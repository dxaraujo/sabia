"""Gera os agentes do Sabiá a partir de assets/agents/papeis.json, dos prompts assets/agents/sa-<papel>.md e da
configuração do projeto em .sabia/config/agentes.json, para cada alvo: kiro (.kiro/agents/*.json, motor V3: IDE e
`kiro-cli --agent-engine v3`) e opencode (.opencode/agents/*.md). Lê os mestres dos fluxos no framework instalado
(~/.sabia/framework/fluxo/, ou --framework) e o override do projeto (.sabia/fluxo/): o agente dono de cada fluxo
recebe no prompt só o que o projeto mudou (o delta), e todo agente a regra de chamada entre fluxos.

    uv run --no-project python gerar_agentes.py --projeto <raiz>            # só mostra o diff e a tabela
    uv run --no-project python gerar_agentes.py --projeto <raiz> --gravar   # grava (só depois do "ok" da pessoa)
    ... --alvo kiro,opencode                                                # padrão: `alvos` do agentes.json, ou kiro
    ... --framework <dir>                                                   # padrão: ~/.sabia/framework

Sai com 1 se algum caminho citado não existe ou sobrou um {{…}} (nada é gravado). Termina com a tabela do que
cada agente recebeu (skills, MCPs, ELM, subagentes, push), lida dos agentes gerados.
"""
import argparse
import difflib
import hashlib
import json
import re
import sys
from pathlib import Path

ASSETS = Path(__file__).resolve().parent.parent / "assets" / "agents"
ALVOS = ("kiro", "opencode")
# shortcut: pasta fixa das skills do Sabiá no opencode (onde o CLI as copia); se o CLI ganhar --escopo projeto, vira config
POWER_OPENCODE = "~/.config/opencode"
PH = re.compile(r"\{\{([A-Z_]+)\}\}")
FM = re.compile(r"\A---\n(.*?)\n---\n", re.S)
CHAMADA = ("Entre fluxos (colunas Chama e Saídas da tabela de cada fluxo no SKILL.md): chama **em linha** → rode você mesmo o"
           " fluxo chamado e volte ao passo; chama **subagente** → chame esse agente e continue com a resposta (sem ele,"
           " carregue a skill do fluxo); **passa a** → este fluxo termina: diga a próxima (o agente dono do outro fluxo) e pare.")


def expandir(itens, grupos):
    """Lista com '+grupo' trocado pelo conteúdo do grupo (recursivo), sem repetir."""
    out = []
    for i in itens:
        for j in (expandir(grupos[i[1:]], grupos) if i.startswith("+") else [i]):
            if j not in out:
                out.append(j)
    return out


def preencher(padroes, valores):
    """Troca os {{X}}; padrão cujo valor é None (não há) sai."""
    out = []
    for p in padroes:
        nomes = PH.findall(p)
        if any(valores.get(n) is None for n in nomes):
            continue
        out.append(PH.sub(lambda m: valores[m.group(1)], p))
    return out


def regra(cap, efeito, match=None, exclude=None):
    r = {"capability": cap, "effect": efeito}
    if match is not None:
        r["match"] = match
    if exclude:
        r["exclude"] = exclude
    return r


def dentro(caminho, toolkit):
    """Caminho do manifesto preso à pasta do toolkit: relativo, com `/`, sem `..`."""
    if caminho.startswith(("/", "~")) or "\\" in caminho or re.match(r"^[A-Za-z]:", caminho) or ".." in caminho.split("/"):
        raise ValueError(f"toolkit {toolkit}: caminho fora da pasta do toolkit: {caminho}")
    return caminho


def _fm(texto, arquivo=""):
    m = FM.match(texto)
    try:
        return json.loads(m.group(1)) if m else {}
    except ValueError as e:
        raise ValueError(f"{arquivo}: front-matter inválido ({e})") from None


def sha12(arquivo):
    """A `base` de uma cópia: o sha256 (12) do arquivo-fonte no framework, com o front-matter."""
    return hashlib.sha256(Path(arquivo).read_bytes()).hexdigest()[:12]


def ler_fluxos(fw):
    """Os mestres do framework instalado: {"sa-x.f": {skill, fluxo, dono, passos, dir}}. Sem fluxo/, vazio (o gerar() recusa)."""
    out = {}
    for m in sorted((fw / "fluxo").glob("*/*/*.md")) if (fw / "fluxo").is_dir() else []:
        if m.stem == m.parent.name:
            d = _fm(m.read_text(encoding="utf-8"), m)
            out[f"{m.parts[-3]}.{m.stem}"] = {"skill": m.parts[-3], "fluxo": m.stem, "dono": d.get("dono"),
                                              "passos": d.get("passos", []), "dir": m.parent}
    return out


def arq_passo(fl, pid):
    """O arquivo-fonte do passo no framework: passos/<id>.md, ou fluxo/<de>.md no passo compartilhado."""
    x = next((y for y in fl["passos"] if y["id"] == pid), {})
    return fl["dir"].parent.parent / f"{x['de']}.md" if x.get("de") else fl["dir"] / "passos" / f"{pid}.md"


def gancho(ext, fluxos, toolkit):
    """(papel dono, id do passo) do desvio de um toolkit: o passo tem de existir e aceitar desvio — a mesma regra do
    ganchoDe() do CLI."""
    if "passo" not in ext:
        raise ValueError(f"toolkit {toolkit}: passo sem o id (use o id do passo em passo.passo)")
    pid, fl, x = next(((f"{q}.{x['id']}", fl, x) for q, fl in fluxos.items() for x in fl["passos"]
                       if f"{q}.{x['id']}" == ext["passo"]), (None, None, None))
    if x is None:
        raise ValueError(f"toolkit {toolkit}: o passo {ext['passo']} não existe no framework")
    if not x.get("desvio"):
        raise ValueError(f"toolkit {toolkit}: o passo {ext['passo']} não aceita desvio de toolkit")
    return fl["dono"].removeprefix("sa-"), pid


ID = re.compile(r"[a-z][a-z0-9-]*")


def override(projeto, fw, fluxos):
    """O que o projeto mudou: ({"sa-x.f": [linhas do delta]}, [linhas dos padrões], avisos). Recusa (ValueError) o
    override que o compilador e o agente não entenderiam: arquivo órfão, operação desconhecida, trava liberada."""
    delta, padroes, avisos, erros = {}, [], [], []
    ler = lambda f: _fm(f.read_text(encoding="utf-8"), f.relative_to(projeto))

    def com_base(f, original, rotulo):
        b = ler(f).get("base")
        if not b:
            erros.append(f"{f.relative_to(projeto)}: sem `base` (crie a cópia pela setup: \"customizar {rotulo}\")")
        elif b != sha12(original):
            avisos.append(f"{f.relative_to(projeto)}: a base mudou desde a cópia ({b} → {sha12(original)}): compare e funda à mão")

    tem = [f for d in (".sabia/fluxo", ".sabia/padrao") if (projeto / d).is_dir() for f in (projeto / d).rglob("*") if f.is_file()]
    por_fluxo = {}
    for f in sorted(tem):
        rel = f.relative_to(projeto).parts[1:]  # ("fluxo"|"padrao", ...)
        if f.suffix != ".md":
            erros.append(f"{f.relative_to(projeto)}: só arquivos .md")
        elif rel[0] == "padrao":
            original = fw / "padrao" / Path(*rel[1:])
            if len(rel) != 3 or not original.exists():
                erros.append(f"{f.relative_to(projeto)}: não é padrão do Sabiá")
            else:
                com_base(f, original, f"padrão {rel[1]}/{rel[2]}")
                padroes.append(f"- padrão `{rel[1]}/{rel[2]}`: `.sabia/padrao/{rel[1]}/{rel[2]}` (no lugar do da skill)")
        elif (q := ".".join(rel[1:3]) if len(rel) >= 4 else None) not in fluxos:
            erros.append(f"{f.relative_to(projeto)}: não é de um fluxo do Sabiá")
        else:
            por_fluxo.setdefault(q, []).append((rel[3:], f))
    for q, arqs in por_fluxo.items():
        fl, linhas = fluxos[q], []
        ids = [x["id"] for x in fl["passos"]]
        mestre = next((f for r, f in arqs if r == (f"{fl['fluxo']}.md",)), None)
        ops = ler(mestre) if mestre else {}
        if fora := sorted(set(ops) - {"inserir", "remover", "liberar"}):
            erros.append(f"{q}: no {fl['fluxo']}.md do projeto só valem inserir, remover e liberar (não {', '.join(fora)})")
        if ops.get("liberar"):
            erros.append(f"{q}: nenhuma trava pode ser liberada ({ops['liberar']})")
        ins, rem = ops.get("inserir", []), ops.get("remover", [])
        if not isinstance(ins, list) or not all(isinstance(o, dict) for o in ins) or not isinstance(rem, list):
            erros.append(f"{q}: inserir é uma lista de {{id, depois}} e remover uma lista de ids")
            ins, rem = [], []
        removidos = set(rem)
        for r in rem:
            x = next((y for y in fl["passos"] if y["id"] == r), None)
            if not x or not x.get("removivel") or x.get("travas"):
                erros.append(f"{q}: o passo {r} não pode ser removido (só passo removivel e sem trava)")
            else:
                linhas.append(f"- passo `{r}`: removido neste projeto")
        novos = [o.get("id") for o in ins]
        inseridos = {}
        for o in ins:
            i, depois = o.get("id"), o.get("depois")
            if not isinstance(i, str) or not ID.fullmatch(i) or i in ids or novos.count(i) > 1:
                erros.append(f"{q}: inserir {i}: id inválido, repetido ou que já existe no fluxo")
            elif i == "grafo":  # o compilador gera references/<fluxo>/grafo.md
                erros.append(f"{q}: inserir {i}: id reservado (o grafo gerado do fluxo)")
            elif depois not in ids + novos or depois in removidos or depois == i:
                erros.append(f"{q}: inserir {i} depois de {depois}: o 'depois' não existe (ou foi removido)")
            else:
                inseridos[i] = depois
        visto = set()
        for i in inseridos:  # sem ciclo: seguindo os 'depois', chega-se a um passo do fluxo
            cadeia, k = set(), i
            while k in inseridos and k not in cadeia:
                cadeia.add(k); k = inseridos[k]
            if k in inseridos and i not in visto:
                erros.append(f"{q}: inserir em ciclo ({', '.join(sorted(cadeia))})")
                visto |= cadeia
        for r, f in arqs:
            if r == (f"{fl['fluxo']}.md",):
                continue
            pid = r[1].removesuffix(".md") if len(r) == 2 and r[0] == "passos" else None
            caminho = f".sabia/fluxo/{fl['skill']}/{fl['fluxo']}/passos/{pid}.md"
            if pid is None:
                erros.append(f"{f.relative_to(projeto)}: fora de passos/")
            elif pid in removidos:
                erros.append(f"{caminho}: o passo foi removido no {fl['fluxo']}.md (apague a cópia ou não o remova)")
            elif re.search(r"^## (Travas|Desvios)\b", f.read_text(encoding="utf-8"), re.M):
                erros.append(f"{caminho}: `## Travas` e `## Desvios` são gerados (catálogo e prompt); tire do arquivo")
            elif pid in ids:
                com_base(f, arq_passo(fl, pid), f"{q}.{pid}")
                linhas.append(f"- passo `{pid}`: leia `{caminho}` (no lugar do da skill)")
            elif pid in inseridos:
                linhas.append(f"- passo `{pid}` (inserido depois de `{inseridos[pid]}`): `{caminho}`")
            else:
                erros.append(f"{caminho}: não é passo de {q} (passo novo → declare em `inserir` no {fl['fluxo']}.md)")
        if falta := [i for i in inseridos if not (projeto / f".sabia/fluxo/{fl['skill']}/{fl['fluxo']}/passos/{i}.md").is_file()]:
            erros.append(f"{q}: inserido sem arquivo: {', '.join(falta)}")
        if linhas:
            delta[q] = linhas
    if erros:
        raise ValueError("override do projeto recusado (nada foi gravado):\n" + "\n".join(erros))
    return delta, padroes, avisos


def fonte_toolkits(projeto, cfg, fw, fluxos):
    """Tipos (a skill do toolkit, com o fluxo e o padrão do tipo, arquivos da pasta lidos pelo caminho) e rubricas dos
    toolkits do projeto: devolve {papel: {"linhas", "skills"}} e as linhas da seção do sabia.md. O Sabiá não compila
    conteúdo de toolkit. O mesmo tipo ou item de rubrica em dois toolkits → ValueError."""
    ler = lambda f: json.loads(f.read_text(encoding="utf-8")) if f.is_file() else {}
    catalogo = ler(fw / "fluxo/tipos.json").get("tipos", {})
    rub = fw / "padrao/sa-revisar/rubricas.md"
    de = {f"rubrica {r}": "Sabiá" for r in (re.findall(r"^\| ([A-Z]\d+) \|", rub.read_text(encoding="utf-8"), re.M) if rub.is_file() else [])}
    erros, por_papel, rubricas, tab_tipos, tab_rubricas = [], {}, [], [], []

    def meu(chave, nome):  # a primeira dona fica; a segunda é colisão
        if chave in de:
            erros.append(f"toolkit {nome}: {chave} já é de {de[chave]}")
            return False
        de[chave] = f"toolkit {nome}"
        return True

    for nome, t in cfg.get("toolkits", {}).items():
        pasta = t.get("pasta", f"~/.sabia/toolkits/{nome}").rstrip("/")
        real = Path.home() / pasta[2:] if pasta.startswith("~/") else projeto / pasta
        man = ler(real / "toolkit.json")
        versao = f"`{nome}` {man.get('versao', '')}".rstrip()
        for sg, q in man.get("tipos", {}).items():
            tipo = catalogo.get(sg, {})
            ks = [k for k in ("fluxo", "padrao") if isinstance(q, dict) and k in q]
            if not isinstance(q, dict) or not tipo.get("desviavel") or tipo.get("pendente") \
                    or q.get("skill") not in [x["caminho"] for x in man.get("skills", [])] \
                    or any(not isinstance(q.get(k), str) or not (real / dentro(q[k], nome)).is_file() for k in ks):
                erros.append(f"toolkit {nome}: tipo {sg} → {q.get('skill') if isinstance(q, dict) else q}: use {{skill, fluxo, padrao}} (fluxo e padrao opcionais);"
                             f" o tipo tem de ser desviável e não pendente no catálogo, a skill uma das skills do toolkit"
                             + (f", e o {' e o '.join(ks)} arquivos da pasta do toolkit" if ks else ""))
                continue
            # só os passos de "desviavel" do catálogo: nos outros passos de cria, o tipo é sempre do Sabiá
            criam = [c for c in tipo["desviavel"] if ".".join(c.split(".")[:2]) in fluxos]
            papeis = next(x for x in man["skills"] if x["caminho"] == q["skill"]).get("papeis", [])
            falta = [(p, c) for c in criam if (p := fluxos[".".join(c.split(".")[:2])]["dono"].removeprefix("sa-")) not in papeis]
            if falta:  # a skill vai ao dono do passo de desvio: o toolkit tem de declarar esse papel
                erros += [f"toolkit {nome}: tipo {sg}: a skill {q['skill']} não traz o papel {p} em papeis (dono do passo de desvio {c})" for p, c in falta]
                continue
            if not meu(f"tipo {sg}", nome):
                continue
            sk = Path(q["skill"]).parent.name
            fl = f"`{pasta}/{q['fluxo']}`" if q.get("fluxo") else ""
            pd = f"o padrão `{pasta}/{q['padrao']}`" if q.get("padrao") else ""
            segue = (f" e siga {fl}" if fl else "") + (f" com {pd}" if pd else "") or " e siga as references dela"
            for c in criam:  # a skill vai ao dono do passo de desvio
                dono = por_papel.setdefault(fluxos[".".join(c.split(".")[:2])]["dono"].removeprefix("sa-"), {"linhas": {}, "skills": []})
                dono["linhas"].setdefault(c, []).append(f"{sg} → carregue a skill `{sk}`{segue}")
                if f"skill://{pasta}/{q['skill']}" not in dono["skills"]:
                    dono["skills"].append(f"skill://{pasta}/{q['skill']}")
            tab_tipos.append(f"| `{sg}` | `{pasta}/{q['skill']}` | {(fl + ' com ' + pd if fl and pd else fl or pd) or '—'} | {versao} | {', '.join(f'`{c}`' for c in criam)} |")
        for r in man.get("rubricas", []):
            if not (r.get("id") and r.get("verificacao") and r.get("severidade") in ("BLOQUEANTE", "IMPORTANTE", "SUGESTÃO")):
                erros.append(f"toolkit {nome}: rubrica {r.get('id', '?')}: precisa de id, verificacao e severidade (BLOQUEANTE, IMPORTANTE ou SUGESTÃO)")
            elif meu(f"rubrica {r['id']}", nome):
                rubricas.append(f"`{r['id']}`{' (' + r['tipo'] + ')' if r.get('tipo') else ''} {r['severidade']} — {r['verificacao']} (toolkit `{nome}`)")
                tab_rubricas.append(f"| `{r['id']}` | {r.get('tipo') or '—'} | {r['severidade']} | {r['verificacao']} | {versao} |")
    if erros:
        raise ValueError("toolkits do projeto recusados (nada foi gravado):\n" + "\n".join(erros))
    for p in por_papel.values():
        p["linhas"] = [
            "Tipos com skill de toolkit (⇢ no passo de desvio do tipo): " + "; ".join(f"no passo `{c}`, {'; '.join(ls)}" for c, ls in p["linhas"].items())
            + ". O artefato desse tipo sai pela skill do toolkit (ligada a você), que lê o fluxo e o padrão da linha pelo caminho (sem eles, as references dela),"
              " escrevendo no padrão OKF do Sabiá: o arquivo pela coluna Arquivo do catálogo, o envelope do `okf-elm.md`,"
              " `status: draft`, a entrada no `index.md` e no `log.md`; depois volte ao passo. Os demais tipos seguem o passo."
              " O catálogo, a revisão e o GATE continuam do Sabiá."]
    if rubricas:  # quem revisa é o dono da sa-revisar
        por_papel.setdefault("revisor", {"linhas": [], "skills": []})["linhas"].append(
            "Itens de rubrica dos toolkits (acrescentam aos da rubrica do artefato; nenhum troca um item do Sabiá): " + "; ".join(rubricas) + ".")
    # a seção Tipos com skill de toolkit do sabia.md: o que vale na sessão sem agente
    tabela = []
    for cab, linhas in (("| Tipo | Skill | Fluxo e padrão | Toolkit | Passo de desvio |\n|---|---|---|---|---|", tab_tipos),
                        ("| Item de rubrica | Tipo | Severidade | Verificação | Toolkit |\n|---|---|---|---|---|", tab_rubricas)):
        if linhas:
            tabela += ([""] if tabela else []) + cab.split("\n") + linhas
    return por_papel, tabela


def texto_fluxos(nome, fluxos, delta, padroes):
    """O delta no prompt: os fluxos de que o agente é dono e que o projeto mudou (D1), e os padrões trocados, para todos
    (um padrão é citado por fluxos de vários donos)."""
    blocos = [f"Fluxo `{q}`:\n" + "\n".join(delta[q]) for q, fl in fluxos.items() if fl["dono"] == f"sa-{nome}" and q in delta]
    if padroes:
        blocos.append("\n".join(padroes))
    return ("O que este projeto mudou (vale sobre o SKILL.md):\n" + "\n".join(blocos)) if blocos else ""


def passos(projeto, cfg, fluxos=None):
    """Resolve os `passos` do agentes.json pelas skills com `passo` dos toolkit.json: por papel dono, as skills e os
    subagentes (com o `para`) que ele ganha; e os agentes do toolkit a gerar (com os subagentes deles), cada um com
    o papel do dono."""
    por_papel, do_toolkit = {}, {}
    for e in cfg.get("passos", []):
        if e["toolkit"] not in cfg.get("toolkits", {}):
            raise ValueError(f"agentes.json: passo de toolkit sem entrada em `toolkits`: {e['toolkit']}")
        pasta = cfg["toolkits"][e["toolkit"]]["pasta"].rstrip("/")
        real = Path.home() / pasta[2:] if pasta.startswith("~/") else projeto / pasta
        man = json.loads((real / "toolkit.json").read_text(encoding="utf-8"))
        ext = next((x["passo"] for x in man.get("skills", []) if x["caminho"] == e["skill"] and x.get("passo")), None)
        if ext is None:
            raise ValueError(f"toolkit {e['toolkit']}: não há skill com `passo` em {e['skill']}")
        papel, pid = gancho(ext, fluxos or {}, e["toolkit"])
        dono = por_papel.setdefault(papel, {"skills": [], "subagentes": [], "passos": []})
        dono["skills"].append(f"skill://{pasta}/{dentro(e['skill'], e['toolkit'])}")
        com_agente = bool(e.get("agente") and ext.get("agente"))
        dono["passos"].append({"skill": Path(e["skill"]).parent.name, "para": ext["para"], "passo": pid,
                               "arquivos": ext.get("arquivos", []), "agente": ext["agente"] if com_agente else None})
        if not com_agente:
            continue
        dono["subagentes"].append({"nome": ext["agente"], "para": ext["para"]})
        defs, fila = {a["nome"]: a for a in man.get("agentes", [])}, [ext["agente"]]
        while fila:  # o subagente de um agente do toolkit herda o papel de quem o chama
            n = fila.pop()
            if n in do_toolkit:
                continue
            if n.startswith("sa-") or n not in defs:
                raise ValueError(f"toolkit {e['toolkit']}: agente {n} " + ("não pode começar com sa-" if n.startswith("sa-") else "não está em `agentes`"))
            d = defs[n]
            do_toolkit[n] = {"papel": papel, "nome": n, "descricao": d["descricao"],
                             "prompt": (real / dentro(d["prompt"], e["toolkit"])).read_text(encoding="utf-8"),
                             "skills": [f"skill://{pasta}/{dentro(x, e['toolkit'])}" for x in d.get("skills", [])],
                             "subagentes": d.get("subagentes", [])}
            fila += d.get("subagentes", [])
    return por_papel, do_toolkit


def texto_passos(papel, passos):
    """Os desvios de toolkit no prompt do dono: a configuração decide, nada é marcado no status.md nem no tasks.md."""
    if not passos:
        return ""
    out = []
    for pid in dict.fromkeys(x["passo"] for x in passos):
        regras = []
        for x in (y for y in passos if y["passo"] == pid):
            quando = f"`{x['para']}`" + (f" (arquivos {', '.join(f'`{a}`' for a in x['arquivos'])})" if x["arquivos"] else "")
            regras.append(f"{quando} → delegue ao subagente `{x['agente']}`, com o briefing e o contrato do `passos.md`" if x["agente"]
                          else f"{quando} → carregue a skill `{x['skill']}` e faça o passo por ela")
        onde = f"no passo `{pid}`" if pid else "no passo"
        out.append(f"Desvios de toolkit {onde} (⇢ na tabela do fluxo): o que casa vai ao toolkit, sem perguntar à pessoa e sem"
                   " marcar no `status.md` nem no `tasks.md`: " + "; ".join(regras) + ".")
    return "\n".join(out)


def agente(nome, p, base, cfg, ext=None, tk=None, fluxo=""):
    """O agente sa-<nome>; com `tk`, o agente do toolkit, com as regras do papel <nome>, dono do passo."""
    valores = {"POWER": cfg.get("power", "~/.kiro/powers/installed/sabia"), "PRODUTO": cfg["produto"], "GLOSSARIO": cfg.get("glossario"), "ADR": cfg.get("adr"),
               "BASE": cfg["base"], "BUNDLE": cfg.get("bundle"), "MASSA": cfg.get("massa")}
    extra = cfg.get("agentes", {}).get(f"sa-{nome}", {})
    if tk:  # o agente do toolkit herda do dono do passo as skills, os MCPs e as leituras (o mesmo papel), não os subagentes
        extra = {k: v for k, v in extra.items() if k != "subagentes"}
    ext = ext or {"skills": [], "subagentes": [], "passos": []}
    grupos, sh = base["grupos"], base["shell"]

    libera = expandir(p.get("mcp_libera", []), grupos)
    pergunta = expandir(p.get("mcp_pergunta", []), grupos)
    if p.get("push") == "loop" and not cfg.get("push_pr_no_loop", True):
        pergunta = [t for t in pergunta if t != "gitlabpr/gitlab_criar_mr"]
    if not cfg.get("elm", True):
        libera = [t for t in libera if not t.startswith("elm/")]
        pergunta = [t for t in pergunta if not t.startswith("elm/")]
    # o que o papel não usa é negado: a IDE chama tool de power pelo kiro_powers, fora do filtro de `tools`
    nega = [f"{s}/{t}" for s, ts in base["mcp_do_power"].items() for t in ts
            if f"{s}/{t}" not in libera + pergunta and (s != "elm" or cfg.get("elm", True))]
    if not cfg.get("elm", True):
        nega.append("elm/*")

    subs_projeto = extra.get("subagentes", []) + ext["subagentes"]
    subagentes = (tk["subagentes"] if tk else p.get("subagentes", [])) + [s["nome"] for s in subs_projeto]
    mcp_extra = extra.get("mcp", [])

    regras = [regra("fs_read", "allow", preencher(base["ler"]["permitir"], valores) + extra.get("ler", [])),
              regra("fs_read", "deny", preencher(base["ler"]["negar"], valores))]
    if p["escrita"] == "projeto":  # escreve no projeto, menos o harness e os registros de outros papéis
        alheios = [x for r, ps in base["registros"].items() if r not in p["registros"] for x in ps]
        # `**/x` também na raiz: o `like` do V3 exige o `/` antes de `x`
        do_papel = set() if tk else set(p.get("harness_libera", []))  # a exceção é do papel, não de quem ele delega
        harness = [y for x in base["harness"] for y in ([x.removeprefix("**/"), x] if x.startswith("**/") else [x]) if y not in do_papel]
        regras += [regra("fs_write", "allow", ["./**"]),
                   regra("fs_write", "deny", preencher(harness + alheios, valores))]
    nivel = base["niveis_shell"][p["shell"]]
    if nivel == "*":  # o shell é liberado para quem escreve; restam o `negar` e o push do papel
        regras.append(regra("shell", "allow", ["*"]))
    else:
        for g in nivel:
            regras.append(regra("shell", "allow", sh[g]["comandos"], sh[g].get("exceto")))
        if p.get("shell_permitir"):
            regras.append(regra("shell", "allow", list(p["shell_permitir"])))
    push = p.get("push")
    if push == "loop":
        push = "perguntar" if cfg.get("push_pr_no_loop", True) else "negar"
    # o curinga no início pega `cd <worktree> && git push …`, o jeito de trabalhar na worktree (`git -C` é negado)
    perguntar = (["*git push*"] if push == "perguntar" else []) + p.get("shell_perguntar", [])
    if perguntar:
        regras.append(regra("shell", "ask", perguntar))
    negar = sh["negar"] + (sh["push-perigoso"] if push == "perguntar" else ["*git push*"]) + p.get("shell_negar", [])
    regras.append(regra("shell", "deny", preencher(negar, valores)))
    if subagentes:
        regras.append(regra("subagent", "allow", subagentes))
    for efeito, ts in (("allow", libera), ("ask", pergunta), ("deny", nega)):
        if ts:
            regras.append(regra("power", efeito, [f"sabia/{t}" for t in ts]))
    if mcp_extra:
        regras.append(regra("mcp", "allow", [m if "/" in m else f"{m}/*" for m in mcp_extra]))
    regras.append(regra("skill", "allow"))

    skills_projeto = tk["skills"] + [s for s in extra.get("skills", []) if s not in tk["skills"]] if tk else list(dict.fromkeys(extra.get("skills", []) + ext["skills"]))
    skills_extras = [Path(s.removeprefix("skill://")).parent.name for s in skills_projeto]
    prompt = tk["prompt"] if tk else (ASSETS / f"sa-{nome}.md").read_text(encoding="utf-8")
    prompt = prompt.replace("{{SKILLS_EXTRAS}}", f"Skills do projeto ligadas a você: {', '.join(f'`{s}`' for s in skills_extras)}"
                            " — carregue a do artefato antes de escrevê-lo." if skills_extras else "")
    prompt = prompt.replace("{{PASSOS}}", texto_passos(nome, ext.get("passos", [])))
    prompt = prompt.replace("{{SUBAGENTES}}", "Subagentes do projeto: " + ", ".join(f"`{s['nome']}` ({s['para']})" for s in subs_projeto)
                            if subs_projeto else "")
    if not tk:
        prompt = prompt.rstrip() + "\n\n" + "\n\n".join(x for x in (fluxo, CHAMADA) if x)
    prompt = re.sub(r"\n{3,}", "\n\n", PH.sub(lambda m: valores.get(m.group(1)) or "não há", prompt)).rstrip() + "\n"

    a = {"name": tk["nome"] if tk else f"sa-{nome}", "description": tk["descricao"] if tk else p["description"], "prompt": prompt,
         "tools": ["read"] + (["write"] if p["escrita"] != "nenhuma" else []) + (["shell"] if p["shell"] != "nenhum" else [])
                  + [f"subagent/{s}" for s in subagentes]
                  + [f"@{t}" for t in libera + pergunta] + [f"@{m}" for m in mcp_extra],
         "resources": ["file://.sabia/sabia.md"] + cfg.get("steering", [])
                      + ([] if tk else [f"skill://{valores['POWER']}/skills/{s}/SKILL.md" for s in p["skills"]]) + skills_projeto,
         "includeMcpJson": bool(mcp_extra), "includePowers": True, "permissions": {"rules": regras}}
    if not tk:
        a["welcomeMessage"] = p["welcomeMessage"]
    if subagentes:  # o V3 ainda lê a lista de subagentes daqui (o resto do toolsSettings saiu)
        a["toolsSettings"] = {"subagent": {"availableAgents": subagentes, "trustedAgents": subagentes}}
    if extra.get("modelo"):
        a["model"] = extra["modelo"]
    return a


def _yaml(d, ind=0):
    """YAML do frontmatter: strings em JSON (escalar entre aspas válido em YAML), mapas aninhados."""
    out = []
    for k, v in d.items():
        chave = " " * ind + json.dumps(k, ensure_ascii=False)
        if isinstance(v, dict):
            out += [chave + ":"] + _yaml(v, ind + 2)
        elif isinstance(v, list):
            out.append(chave + ": [" + ", ".join(json.dumps(x, ensure_ascii=False) for x in v) + "]")
        else:
            out.append(chave + ": " + json.dumps(v, ensure_ascii=False))
    return out


def _md(frente, prompt):
    return "---\n" + "\n".join(_yaml(frente)) + "\n---\n\n" + prompt


def _regras(a, cap, efeito=None):
    return [r for r in a["permissions"]["rules"] if r["capability"] == cap and (efeito is None or r["effect"] == efeito)]


def _oc(padrao):
    """Padrão de caminho do Kiro no curinga simples do opencode (`*` atravessa `/`): `**/x` pega a raiz e o aninhado."""
    padrao = padrao.removeprefix("./")
    return [padrao.removeprefix("**/").replace("**", "*"), "*/" + padrao.removeprefix("**/").replace("**", "*")] \
        if padrao.startswith("**/") else [padrao.replace("**", "*")]


def _mcp(t, sep):
    """`sabia/elm/elm_x` (regra power) ou `banco/consultar` (regra mcp) no nome de tool do alvo."""
    servidor, _, tool = t.removeprefix("sabia/").partition("/")
    return f"{servidor}{sep}{tool}"


def opencode(a, cfg, subagente=False):
    """O agente do Kiro traduzido para .opencode/agents/<nome>.md (permission por agente; a última regra que casa vence)."""
    perm = {"read": {"*": "allow"}}
    for r in _regras(a, "fs_read", "deny"):
        perm["read"].update({x: "deny" for m in r["match"] for x in _oc(m)})
    escrita = _regras(a, "fs_write")
    perm["edit"] = "deny" if not escrita else {"*": "allow", **{x: "deny" for r in _regras(a, "fs_write", "deny")
                                                                 for m in r["match"] for x in _oc(m)}}
    if "shell" not in a["tools"]:
        perm["bash"] = "deny"
    else:  # a negação vem por último: no Kiro ela sempre vence
        bash = {"*": "ask"}
        for r in _regras(a, "shell", "allow"):
            bash.update({m: "allow" for m in r["match"]})
            bash.update({m: "ask" for m in r.get("exclude", [])})
        for efeito in ("ask", "deny"):
            bash.update({m: efeito for r in _regras(a, "shell", efeito) for m in r["match"]})
        perm["bash"] = bash
    subs = [m for r in _regras(a, "subagent") for m in r["match"]]
    perm["task"] = {"*": "deny", **{s: "allow" for s in subs}} if subs else "deny"
    perm["skill"] = {"*": "deny", **{Path(r.removeprefix("skill://")).parent.name: "allow"
                                     for r in a["resources"] if r.startswith("skill://")}}
    for r in _regras(a, "power"):
        perm.update({_mcp(m, "_"): r["effect"] for m in r["match"]})
    for r in _regras(a, "mcp"):
        perm.update({_mcp(m, "_"): r["effect"] for m in r["match"]})
    fora = [m.replace(cfg.get("power", "~/.kiro/powers/installed/sabia"), POWER_OPENCODE).replace("**", "*")
            for r in _regras(a, "fs_read", "allow") for m in r["match"] if m.startswith("~/")]
    perm["external_directory"] = {"*": "ask", **{m: "allow" for m in fora}}
    frente = {"description": a["description"], "mode": "subagent" if subagente else "all"}
    if a.get("model"):
        frente["model"] = a["model"]
    frente["permission"] = perm
    return _md(frente, a["prompt"])


LACUNAS = {
    "kiro": ["com o shell liberado, a negação do shell é por trecho do comando: `grep -r` no projeto, glob ou variável chegam a um"
             " `.env` ou a um arquivo do harness sem citá-lo (a leitura pela ferramenta continua negada; o prompt manda buscar"
             " com as ferramentas do agente)"],
    "opencode": ["as exceções de cada grupo de comandos (`git log --output`, `git add -f`…) perguntam para qualquer comando, não só para o grupo",
                 "com o shell liberado, a negação do shell é por trecho do comando: `grep -r` no projeto, glob ou variável chegam a"
                 " um `.env` ou a um arquivo do harness sem citá-lo (a leitura pela ferramenta continua negada)"],
}


def problemas(a, projeto):
    texto = json.dumps(a, ensure_ascii=False)
    out = [f"{a['name']}: sobrou {m}" for m in sorted(set(re.findall(r"\{\{[A-Z_]+\}\}", texto)))]
    for r in a["resources"]:
        caminho = r.split("://", 1)[1]
        if caminho.startswith(("/", "\\")) or re.match(r"^[A-Za-z]:", caminho) or "\\" in caminho or "$" in caminho:
            out.append(f"{a['name']}: caminho absoluto ou com variável: {r}")
            continue
        alvo = Path.home() / caminho[2:] if caminho.startswith("~/") else projeto / caminho
        # o sabia.md é gravado pela setup no mesmo passo, depois do "ok" ao resumo
        if "*" not in caminho and r != "file://.sabia/sabia.md" and not alvo.is_file():
            out.append(f"{a['name']}: não existe: {r}")
    return out


def resumo(agentes, cfg):
    """Tabela markdown do que cada agente recebeu, lida dos agentes gerados; ícones da legenda de references/wizard.md."""
    fluxo = f"skill://{cfg.get('power', '~/.kiro/powers/installed/sabia')}/skills/"
    linhas = ["| Agente | Skills do fluxo | Skills do projeto | MCPs do projeto | ELM | GitLab | Subagentes | Push |",
              "|---|---|---|---|---|---|---|---|"]
    for a in agentes.values():
        skills = [r.removeprefix("skill://") for r in a["resources"] if r.startswith("skill://")]
        do_fluxo = [Path(s).parent.name.removeprefix("sa-") for s in skills if f"skill://{s}".startswith(fluxo)]
        do_projeto = [Path(s).parent.name for s in skills if not f"skill://{s}".startswith(fluxo)]
        mcps = [t[1:] for t in a["tools"] if t.startswith("@") and not t.startswith(("@elm/", "@gitlabpr/"))]
        do_elm = [t for t in a["tools"] if t.startswith("@elm/")]
        escreve = any(r["capability"] == "power" and r["effect"] == "ask" and any(m.startswith("sabia/elm/") for m in r["match"])
                      for r in a["permissions"]["rules"])
        elm = ("➖" if not do_elm else "🟢 só o bundle local" if all(t.endswith("_local") for t in do_elm)
               else "🟢 consulta · 🟡 escrita" if escreve else "🟢 consulta")
        do_gitlab = {t.removeprefix("@gitlabpr/") for t in a["tools"] if t.startswith("@gitlabpr/")}
        gitlab = ("➖" if not do_gitlab else "🟢 consulta · 🟡 abrir e mesclar PR" if "gitlab_mesclar_mr" in do_gitlab
                  else "🟢 consulta · 🟡 abrir PR" if "gitlab_criar_mr" in do_gitlab else "🟢 consulta")
        subs = a.get("toolsSettings", {}).get("subagent", {}).get("availableAgents", [])
        push = "🟡 pergunta" if any(r["capability"] == "shell" and r["effect"] == "ask" and "*git push*" in r["match"]
                                 for r in a["permissions"]["rules"]) else "🔴 negado"
        cel = lambda xs: ", ".join(f"`{x}`" for x in xs) or "➖"
        linhas.append(f"| **{a['name']}** | {cel(do_fluxo)} | {cel(do_projeto)} | {cel(mcps)} | {elm} | {gitlab} | {cel(subs)} | {push} |")
    return "\n".join(linhas) + "\n"


def gerar(projeto: Path, cfg: dict) -> dict:
    base = json.loads((ASSETS / "papeis.json").read_text(encoding="utf-8"))
    # a chave é o nome do agente (sa-<papel>); desconhecida nunca é ignorada em silêncio
    nomes = [f"sa-{n}" for n in base["papeis"]]
    if desconhecidos := sorted(set(cfg.get("agentes", {})) - set(nomes)):
        raise ValueError(f"agentes.json: agente desconhecido {desconhecidos}; use {nomes}")
    fw = Path(cfg.get("framework") or "~/.sabia/framework").expanduser()
    fluxos = ler_fluxos(fw)
    if not fluxos:
        raise ValueError(f"{fw} não tem os fluxos (fluxo/ ausente ou sem mestres): rode `sabia instalar` ou passe --framework")
    gerar.avisos, gerar.tabela_tipos = [], []
    tk, gerar.tabela_tipos = fonte_toolkits(projeto, cfg, fw, fluxos)
    delta, padroes, avisos = override(projeto, fw, fluxos)
    gerar.avisos = avisos
    if cfg.get("sabia") and (fw / "plugin.json").exists():
        instalado = json.loads((fw / "plugin.json").read_text(encoding="utf-8")).get("version")
        if instalado != cfg["sabia"]:
            avisos.append(f"o projeto foi configurado com o Sabiá {cfg['sabia']} e o seu é o {instalado}: atualize um dos dois")
    por_papel, do_toolkit = passos(projeto, cfg, fluxos)
    if fora := sorted(set(por_papel) - set(base["papeis"])):
        raise ValueError(f"toolkit: passo de papel desconhecido {fora}")
    for n, t in tk.items():  # a skill do tipo vai ao dono do passo de desvio do tipo
        por_papel.setdefault(n, {"skills": [], "subagentes": [], "passos": []})["skills"].extend(t["skills"])
    agentes = {f"sa-{n}.json": agente(n, p, base, cfg, por_papel.get(n),
                                   fluxo="\n\n".join(x for x in [texto_fluxos(n, fluxos, delta, padroes), *tk.get(n, {}).get("linhas", [])] if x))
               for n, p in base["papeis"].items()}
    for n, tk in do_toolkit.items():
        agentes[f"{n}.json"] = agente(tk["papel"], base["papeis"][tk["papel"]], base, cfg, tk=tk)
    return agentes


def arquivos(agentes, cfg, projeto, alvos):
    """{caminho: conteúdo} de cada alvo."""
    out = {}
    for arquivo, a in agentes.items():
        nome = arquivo.removesuffix(".json")
        if "kiro" in alvos:
            out[projeto / ".kiro/agents" / arquivo] = json.dumps(a, ensure_ascii=False, indent=2) + "\n"
        if "opencode" in alvos:
            out[projeto / ".opencode/agents" / f"{nome}.md"] = opencode(a, cfg, subagente=not nome.startswith("sa-"))
    return out


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--projeto", type=Path, default=Path("."))
    ap.add_argument("--config", type=Path, help="padrão: <projeto>/.sabia/config/agentes.json")
    ap.add_argument("--alvo", help="kiro,opencode (padrão: `alvos` do agentes.json, ou kiro)")
    ap.add_argument("--framework", type=Path, help="o framework instalado (padrão: ~/.sabia/framework)")
    ap.add_argument("--base", help="imprime a `base` de uma cópia: o id do passo (sa-x.f.p) ou o padrão (sa-x/nome.md)")
    # gravar é opt-in: rodar sem flag nunca grava nada antes do "ok" da pessoa
    ap.add_argument("--gravar", action="store_true", help="grava os agentes (sem ela, só mostra o diff)")
    ap.add_argument("--diff", action="store_true", help="o padrão: mostra o diff e não grava")
    args = ap.parse_args(argv)
    if args.base:  # a setup calcula a base por aqui, nunca por outro caminho
        fw = (args.framework or Path("~/.sabia/framework")).expanduser()
        partes = args.base.split(".")
        fl = ler_fluxos(fw).get(".".join(partes[:2])) if len(partes) == 3 else None
        f = arq_passo(fl, partes[2]) if fl else fw / "padrao" / args.base
        if not f.is_file():
            print(f"não existe no framework: {args.base} ({f})", file=sys.stderr)
            return 1
        print(sha12(f))
        return 0
    projeto = args.projeto.resolve()
    cfg = json.loads((args.config or projeto / ".sabia/config/agentes.json").read_text(encoding="utf-8"))
    if args.framework:
        cfg["framework"] = str(args.framework)
    alvos = args.alvo.split(",") if args.alvo else cfg.get("alvos", ["kiro"])
    if fora := sorted(set(alvos) - set(ALVOS)):
        print(f"alvo desconhecido {fora}; use {', '.join(ALVOS)}", file=sys.stderr)
        return 1
    try:
        agentes = gerar(projeto, cfg)
    except ValueError as e:
        print(e, file=sys.stderr)
        return 1
    # os caminhos skill:// e file:// são do Kiro; nos outros alvos as skills são achadas pelo nome
    erros = [e for a in agentes.values() for e in problemas(a, projeto)] if "kiro" in alvos else []
    if erros:
        print("\n".join(erros), file=sys.stderr)
        return 1
    for alvo, novo in arquivos(agentes, cfg, projeto, alvos).items():
        antigo = alvo.read_text(encoding="utf-8") if alvo.exists() else ""
        if not args.gravar:
            sys.stdout.writelines(difflib.unified_diff(antigo.splitlines(True), novo.splitlines(True), str(alvo), str(alvo)))
        elif novo != antigo:
            alvo.parent.mkdir(parents=True, exist_ok=True)
            alvo.write_text(novo, encoding="utf-8")
            print(f"gravado {alvo}")
    print("\n" + resumo(agentes, cfg), end="")
    if gerar.tabela_tipos:  # a setup grava estas tabelas no sabia.md (o que vale na sessão sem agente)
        print("\nTipos com skill de toolkit (seção do sabia.md):\n" + "\n".join(gerar.tabela_tipos))
    for aviso in getattr(gerar, "avisos", []):
        print(f"aviso: {aviso}")
    for alvo in alvos:
        if LACUNAS.get(alvo):
            print(f"\nO que não tem tradução no {alvo}:\n" + "".join(f"- {l}\n" for l in LACUNAS[alvo]), end="")
    return 0


if __name__ == "__main__":
    sys.exit(main())
