"""Gera os 5 agentes do Sabiá e os agentes de toolkit a partir de assets/agents/perfis.json (os modelos de permissão e
os agentes), dos prompts assets/agents/sa-<nome>.md e do .sabia/config/agentes.json do projeto, para cada alvo: kiro
(.kiro/agents/<nome>.json, só nomes de capability em tools; os limites por caminho e URL vão no prompt) e opencode
(.opencode/agents/<nome>.md, com mode e permission). Lê as definições dos fluxos no framework instalado
(~/.sabia/framework/fluxo/, ou --framework) e o override do projeto (.sabia/fluxo/, .sabia/padrao/): o agente dono de
cada fluxo recebe no prompt só o que o projeto mudou (o delta), e todo agente a regra de chamada entre fluxos.

    uv run --no-project python gerar_agentes.py --projeto <raiz>            # só mostra o diff e a tabela
    uv run --no-project python gerar_agentes.py --projeto <raiz> --gravar   # grava (só depois do "ok" da pessoa)
    ... --alvo kiro,opencode                                                # padrão: `alvos` do agentes.json, ou kiro
    ... --framework <dir>                                                   # padrão: ~/.sabia/framework

Sai com 1 se o agentes.json foge do esquema, algum caminho citado não existe ou sobrou um {{…}} (nada é gravado).
Termina com a tabela do que cada agente recebeu.
"""
import argparse
import difflib
import hashlib
import itertools
import json
import re
import sys
from fnmatch import fnmatchcase
from pathlib import Path

ASSETS = Path(__file__).resolve().parent.parent / "assets" / "agents"
ALVOS = ("kiro", "opencode")
POWER = "~/.kiro/powers/installed/sabia"  # onde o `sabia instalar` põe o power do Kiro, com as skills compiladas
EFEITOS = ("allow", "ask", "deny")  # nesta ordem no opencode (a última regra que casa vence): deny vence ask, ask vence allow
CATEGORIAS = ("ler", "editar", "comandos", "mcp")
# os mesmos PAPEIS_DO_AGENTE e ALIAS_PASSO do cli/compilar.mjs
PAPEIS_DO_AGENTE = {"sa-desenvolvedor": ["desenvolvedor"], "sa-especificador": ["especificador", "produto"],
                    "sa-pesquisador": ["pesquisador"], "sa-revisor": ["revisor"], "sa-verificador": ["verificador"]}
AGENTE_DO_PAPEL = {p: a for a, ps in PAPEIS_DO_AGENTE.items() for p in ps}
ALIAS_PASSO = {"sa-codificar.codificar.tarefa": "sa-desenvolver.codificar.tarefa"}
# a regra da sa-elm.setup (passo dados): nos subagentes só a leitura do ELM, sem o sync e sem reindexar o bundle
ELM_SO_PRIMARIOS = ["elm/elm_sync", "elm/elm_indexar_local"]
CHAVES = {"alvos", "sabia", "formato_spec", "produto", "branch_base", "prefixo_branch", "glossario", "adr", "elm", "toolkits",
          "passos", "agentes"}
CHAVES_AGENTE = {"modelo", "mcp", "skills", "subagentes"}
LEITURA_OC = ("glob", "grep", "list", "lsp", "todoread", "todowrite")
PH = re.compile(r"\{\{([A-Z_]+)\}\}")
FM = re.compile(r"\A---\n(.*?)\n---\n", re.S)
CHAMADA = ("Entre fluxos (colunas Chama e Saídas da tabela de cada fluxo no SKILL.md): chama **em linha** → rode você mesmo o"
           " fluxo chamado e volte ao passo; chama **subagente** → chame esse agente e continue com a resposta; sem a"
           " ferramenta de subagente, faça o que o passo manda para esse caso (Pare se ou Saída do passo): revisão e"
           " verificação do que você fez nunca são suas; **passa a** → este fluxo termina: diga a próxima (o agente dono do outro fluxo) e pare.")


def preencher(padroes, valores):
    """Troca os {{X}}: um padrão por valor de X (com dois marcadores, cada combinação); marcador sem valor no projeto
    (None ou lista vazia) tira o padrão."""
    out = []
    for p in padroes:
        nomes = list(dict.fromkeys(PH.findall(p)))
        if any(not valores[n] for n in nomes):
            continue
        for combo in itertools.product(*(valores[n] for n in nomes)):
            d = dict(zip(nomes, combo))
            out.append(PH.sub(lambda m: d[m.group(1)], p))
    return list(dict.fromkeys(out))


def efeito(regras, alvo):
    """Como uma categoria decide: entre as listas que casam o alvo, deny vence ask, e ask vence allow; nenhuma → padrao.
    `*` atravessa `/`, como no opencode."""
    return next((e for e in ("deny", "ask", "allow") if any(fnmatchcase(alvo, p) for p in regras[e])), regras["padrao"])


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
    """As definições do framework instalado: {"sa-x.f": {skill, fluxo, dono, passos, dir}}. Sem fluxo/, vazio (o gerar() recusa)."""
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
    """(agente dono, id do passo) do desvio de um toolkit: o passo (ou o id antigo do ALIAS_PASSO) tem de existir e
    aceitar desvio — a mesma regra do ganchoDe() do CLI."""
    if "passo" not in ext:
        raise ValueError(f"toolkit {toolkit}: passo sem o id (use o id do passo em passo.passo)")
    pid = ALIAS_PASSO.get(ext["passo"], ext["passo"])
    fl, x = next(((fl, x) for q, fl in fluxos.items() for x in fl["passos"] if f"{q}.{x['id']}" == pid), (None, None))
    if x is None:
        raise ValueError(f"toolkit {toolkit}: o passo {ext['passo']} não existe no framework")
    if not x.get("desvio"):
        raise ValueError(f"toolkit {toolkit}: o passo {ext['passo']} não aceita desvio de toolkit")
    return fl["dono"], pid


ID = re.compile(r"[a-z][a-z0-9-]*")


def override(projeto, fw, fluxos, originais=None):
    """O que o projeto mudou: ({"sa-x.f": [linhas do delta]}, [linhas dos padrões], avisos). Recusa (ValueError) o
    override que o compilador e o agente não entenderiam: arquivo órfão, operação desconhecida, trava liberada.
    `originais`: {nome do padrão em requisitos/: o padrão do toolkit que desvia o tipo}, a base da cópia do projeto."""
    originais = originais or {}
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
            # requisitos/padrao-<tipo>.md vale sobre o padrão em vigor do tipo: o do toolkit que o desvia, ou o do Sabiá
            do_tk = rel[1:2] == ("requisitos",) and len(rel) == 3 and rel[2] in originais
            original = originais[rel[2]] if do_tk else fw / "padrao" / Path(*rel[1:])
            if len(rel) != 3 or not original.exists():
                erros.append(f"{f.relative_to(projeto)}: não é padrão do Sabiá")
            else:
                com_base(f, original, f"padrão {rel[1]}/{rel[2]}")
                if not do_tk:  # a do toolkit chega pela linha Tipos com skill de toolkit
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


def pasta_de(projeto, nome, t):
    """(pasta como o agentes.json a cita, pasta real) de um toolkit."""
    pasta = t.get("pasta", f"~/.sabia/toolkits/{nome}").rstrip("/")
    return pasta, (Path.home() / pasta[2:] if pasta.startswith("~/") else projeto / pasta)


def fonte_toolkits(projeto, cfg, fw, fluxos):
    """Tipos, rubricas, verificacao e steering dos toolkits do projeto: devolve {agente: {"linhas", "skills"}} e as
    linhas da seção do sabia.md. Tipo → o dono do passo de desvio (a skill com um papel dele em papeis); rubricas →
    sa-revisor; verificacao → sa-verificador; steering → os agentes dos papeis. O Sabiá não compila conteúdo de toolkit.
    O mesmo tipo ou item de critério de revisão em dois toolkits → ValueError."""
    ler = lambda f: json.loads(f.read_text(encoding="utf-8")) if f.is_file() else {}
    catalogo = ler(fw / "fluxo/tipos.json").get("tipos", {})
    rub = fw / "padrao/sa-revisar/criterios-revisao.md"
    de = {f"critério de revisão {r}": "Sabiá" for r in (re.findall(r"^\| ([A-Z]\d+) \|", rub.read_text(encoding="utf-8"), re.M) if rub.is_file() else [])}
    erros, por_agente, por_passo, extras, rubricas, tab_tipos, tab_rubricas = [], {}, {}, {}, [], [], []
    fonte_toolkits.originais = {}  # padrao-<tipo>.md → o padrão do toolkit, para a base da cópia do projeto
    dono = lambda c: fluxos[".".join(c.split(".")[:2])]["dono"]

    def meu(chave, nome):  # a primeira dona fica; a segunda é colisão
        if chave in de:
            erros.append(f"toolkit {nome}: {chave} já é de {de[chave]}")
            return False
        de[chave] = f"toolkit {nome}"
        return True

    for nome, t in cfg.get("toolkits", {}).items():
        pasta, real = pasta_de(projeto, nome, t)
        if not (real / "toolkit.json").is_file():
            erros.append(f"toolkit {nome}: {pasta}/toolkit.json não encontrado (instale o toolkit ou tire-o do agentes.json)")
            continue
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
            papeis = set(next(x for x in man["skills"] if x["caminho"] == q["skill"]).get("papeis", []))
            if falta := [c for c in criam if not papeis & set(PAPEIS_DO_AGENTE.get(dono(c), []))]:
                erros += [f"toolkit {nome}: tipo {sg}: a skill {q['skill']} não traz o papel {' ou '.join(PAPEIS_DO_AGENTE.get(dono(c), ['?']))}"
                          f" em papeis (dono do passo de desvio {c})" for c in falta]
                continue
            if not meu(f"tipo {sg}", nome):
                continue
            sk = Path(q["skill"]).parent.name
            fl = f"`{pasta}/{q['fluxo']}`" if q.get("fluxo") else ""
            copia = f".sabia/padrao/requisitos/padrao-{sg.lower()}.md"
            if q.get("padrao") and (projeto / copia).is_file():  # a cópia do projeto vale sobre o padrão do toolkit
                fonte_toolkits.originais[f"padrao-{sg.lower()}.md"] = real / dentro(q["padrao"], nome)
                pd = f"o padrão `{copia}` (cópia do projeto sobre `{pasta}/{q['padrao']}`)"
            else:
                pd = f"o padrão `{pasta}/{q['padrao']}`" if q.get("padrao") else ""
            segue = (f" e siga {fl}" if fl else "") + (f" com {pd}" if pd else "") or " e siga as references dela"
            for c in criam:  # a skill vai ao dono do passo de desvio
                por_passo.setdefault(dono(c), {}).setdefault(c, []).append(f"{sg} → carregue a skill `{sk}`{segue}")
                sks = por_agente.setdefault(dono(c), {"linhas": [], "skills": []})["skills"]
                if f"skill://{pasta}/{q['skill']}" not in sks:
                    sks.append(f"skill://{pasta}/{q['skill']}")
            tab_tipos.append(f"| `{sg}` | `{pasta}/{q['skill']}` | {(fl + ' com ' + pd if fl and pd else fl or pd) or '—'} | {versao} | {', '.join(f'`{c}`' for c in criam)} |")
        for r in man.get("criterios_revisao", []):
            if not (r.get("id") and r.get("verificacao") and r.get("severidade") in ("BLOQUEANTE", "IMPORTANTE", "SUGESTÃO")):
                erros.append(f"toolkit {nome}: critério de revisão {r.get('id', '?')}: precisa de id, verificacao e severidade (BLOQUEANTE, IMPORTANTE ou SUGESTÃO)")
            elif meu(f"critério de revisão {r['id']}", nome):
                rubricas.append(f"`{r['id']}`{' (' + r['tipo'] + ')' if r.get('tipo') else ''} {r['severidade']} — {r['verificacao']} (toolkit `{nome}`)")
                tab_rubricas.append(f"| `{r['id']}` | {r.get('tipo') or '—'} | {r['severidade']} | {r['verificacao']} | {versao} |")
        if man.get("verificacao"):
            extras.setdefault("sa-verificador", []).append(f"Verificação de aceite do toolkit `{nome}`: {man['verificacao']}")
        for s in man.get("steering", []):
            if not (real / dentro(s["caminho"], nome)).is_file():
                erros.append(f"toolkit {nome}: steering {s['caminho']} não existe na pasta do toolkit")
                continue
            for ag in dict.fromkeys(AGENTE_DO_PAPEL[p] for p in s.get("papeis", []) if p in AGENTE_DO_PAPEL):
                extras.setdefault(ag, []).append(f"Steering do toolkit `{nome}`: leia `{pasta}/{s['caminho']}` antes de começar.")
    if erros:
        raise ValueError("toolkits do projeto recusados (nada foi gravado):\n" + "\n".join(erros))
    for ag, ps in por_passo.items():
        por_agente[ag]["linhas"].append(
            "Tipos com skill de toolkit (⇢ no passo de desvio do tipo): " + "; ".join(f"no passo `{c}`, {'; '.join(ls)}" for c, ls in ps.items())
            + ". O artefato desse tipo sai pela skill do toolkit (ligada a você), que lê o fluxo e o padrão da linha pelo caminho"
              " (sem eles, as references dela), no arquivo da coluna Arquivo do catálogo (`references/tipos.md` da skill `sabia`);"
              " depois volte ao passo. Os demais tipos seguem o passo. O catálogo, a revisão e a aprovação continuam do Sabiá.")
    if rubricas:
        por_agente.setdefault("sa-revisor", {"linhas": [], "skills": []})["linhas"].append(
            "Itens de critério de revisão dos toolkits (acrescentam aos dos critérios de revisão do artefato; nenhum troca um item do Sabiá): " + "; ".join(rubricas) + ".")
    for ag, ls in extras.items():
        por_agente.setdefault(ag, {"linhas": [], "skills": []})["linhas"] += ls
    # a seção Tipos com skill de toolkit do sabia.md: o que vale na sessão sem agente
    tabela = []
    for cab, linhas in (("| Tipo | Skill | Fluxo e padrão | Toolkit | Passo de desvio |\n|---|---|---|---|---|", tab_tipos),
                        ("| Item de critério de revisão | Tipo | Severidade | Verificação | Toolkit |\n|---|---|---|---|---|", tab_rubricas)):
        if linhas:
            tabela += ([""] if tabela else []) + cab.split("\n") + linhas
    return por_agente, tabela


def texto_fluxos(nome, fluxos, delta, padroes):
    """O delta no prompt: os fluxos de que o agente é dono e que o projeto mudou, e os padrões trocados, para todos
    (um padrão é citado por fluxos de vários donos)."""
    blocos = [f"Fluxo `{q}`:\n" + "\n".join(delta[q]) for q, fl in fluxos.items() if fl["dono"] == nome and q in delta]
    if padroes:
        blocos.append("\n".join(padroes))
    return ("O que este projeto mudou (vale sobre o SKILL.md):\n" + "\n".join(blocos)) if blocos else ""


def passos(projeto, cfg, fluxos):
    """Resolve os `passos` do agentes.json pelas skills com `passo` dos toolkit.json: por agente dono, as skills e os
    subagentes (com o `para`) que ele ganha; e os agentes do toolkit a gerar (com os subagentes deles), cada um com
    as permissões do dono."""
    por_agente, do_toolkit = {}, {}
    for e in cfg.get("passos", []):
        if e.get("toolkit") not in cfg.get("toolkits", {}):
            raise ValueError(f"agentes.json: passo de toolkit sem entrada em `toolkits`: {e.get('toolkit')}")
        pasta, real = pasta_de(projeto, e["toolkit"], cfg["toolkits"][e["toolkit"]])
        if not (real / "toolkit.json").is_file():
            raise ValueError(f"toolkit {e['toolkit']}: {pasta}/toolkit.json não encontrado (instale o toolkit ou tire-o do agentes.json)")
        man = json.loads((real / "toolkit.json").read_text(encoding="utf-8"))
        sk = next((x for x in man.get("skills", []) if x["caminho"] == e["skill"] and x.get("passo")), None)
        if sk is None:
            raise ValueError(f"toolkit {e['toolkit']}: não há skill com `passo` em {e['skill']}")
        ext = sk["passo"]
        dono, pid = gancho(ext, fluxos, e["toolkit"])
        if not set(sk.get("papeis", [])) & set(PAPEIS_DO_AGENTE.get(dono, [])):
            raise ValueError(f"toolkit {e['toolkit']}: a skill {e['skill']} não traz o papel {' ou '.join(PAPEIS_DO_AGENTE.get(dono, ['?']))}"
                             f" em papeis (dono do passo {pid})")
        d = por_agente.setdefault(dono, {"skills": [], "subagentes": [], "passos": []})
        d["skills"].append(f"skill://{pasta}/{dentro(e['skill'], e['toolkit'])}")
        com_agente = bool(e.get("agente") and ext.get("agente"))
        d["passos"].append({"skill": Path(e["skill"]).parent.name, "para": ext["para"], "passo": pid,
                            "arquivos": ext.get("arquivos", []), "agente": ext["agente"] if com_agente else None})
        if not com_agente:
            continue
        d["subagentes"].append({"nome": ext["agente"], "para": ext["para"]})
        defs, fila = {a["nome"]: a for a in man.get("agentes", [])}, [ext["agente"]]
        while fila:  # o subagente de um agente do toolkit herda o dono de quem o chama
            n = fila.pop()
            if n in do_toolkit:
                continue
            if n.startswith("sa-") or n not in defs:
                raise ValueError(f"toolkit {e['toolkit']}: agente {n} " + ("não pode começar com sa-" if n.startswith("sa-") else "não está em `agentes`"))
            a = defs[n]
            do_toolkit[n] = {"dono": dono, "nome": n, "descricao": a["descricao"],
                             "prompt": (real / dentro(a["prompt"], e["toolkit"])).read_text(encoding="utf-8"),
                             "skills": [f"skill://{pasta}/{dentro(x, e['toolkit'])}" for x in a.get("skills", [])],
                             "subagentes": a.get("subagentes", [])}
            fila += a.get("subagentes", [])
    return por_agente, do_toolkit


def texto_passos(passos):
    """Os desvios de toolkit no prompt do dono: a configuração decide, nada é marcado no status.md nem no tasks.md."""
    out = []
    for pid in dict.fromkeys(x["passo"] for x in passos):
        regras = []
        for x in (y for y in passos if y["passo"] == pid):
            quando = f"`{x['para']}`" + (f" (arquivos {', '.join(f'`{a}`' for a in x['arquivos'])})" if x["arquivos"] else "")
            regras.append(f"{quando} → delegue ao subagente `{x['agente']}`, com o briefing e o contrato do `references/passos.md` da skill `sabia`" if x["agente"]
                          else f"{quando} → carregue a skill `{x['skill']}` e faça o passo por ela")
        out.append(f"Desvios de toolkit no passo `{pid}` (⇢ na tabela do fluxo): o que casa vai ao toolkit, sem perguntar à pessoa e sem"
                   " marcar no `status.md` nem no `tasks.md`: " + "; ".join(regras) + ".")
    return "\n".join(out)


def validar(cfg, perfis):
    """O esquema fechado do agentes.json: chave fora dele nunca é ignorada em silêncio."""
    erros = []
    if fora := sorted(set(cfg) - CHAVES):
        erros.append(f"chave fora do esquema {fora}")
    if falta := [k for k in ("produto", "branch_base") if not isinstance(cfg.get(k), str) or not cfg[k]]:
        erros.append(f"falta {falta}")
    if cfg.get("formato_spec", "kiro") not in ("kiro", "openspec"):
        erros.append(f"formato_spec {cfg['formato_spec']!r}: use kiro ou openspec")
    elm = cfg.get("elm", False)
    if elm is not False and not (isinstance(elm, dict) and set(elm) <= {"pa", "bundle", "regras"}
                                 and isinstance(elm.get("regras", {}), dict) and set(elm.get("regras", {})) <= set(EFEITOS)):
        erros.append('elm: false ou {"pa", "bundle", "regras": {"allow", "ask", "deny"}}')
    for n, a in cfg.get("agentes", {}).items():
        if n not in perfis["agentes"]:
            erros.append(f"agente desconhecido {n}; use {list(perfis['agentes'])}")
        elif fora := sorted(set(a) - CHAVES_AGENTE):
            erros.append(f"agentes.{n}: chave fora do esquema {fora}; use {sorted(CHAVES_AGENTE)}")
    if erros:
        raise ValueError("agentes.json: " + "; ".join(erros))


def verificacao(projeto):
    """(comandos Executar, URLs de teste) da seção Verificação de aceite do .sabia/sabia.md (uma coluna por módulo);
    o modelo ainda não preenchido (`<…>`) e "não se aplica" ficam de fora."""
    f = projeto / ".sabia/sabia.md"
    sec = re.search(r"^## Verificação de aceite\n(.*?)(?=^## |\Z)", f.read_text(encoding="utf-8") if f.is_file() else "", re.M | re.S)
    out = {"Executar": [], "URL de teste": []}
    for m in re.finditer(r"^\|\s*(Executar|URL de teste)\s*\|(.*)$", sec.group(1) if sec else "", re.M):
        for v in re.findall(r"`([^`]+)`", m[2]):
            if v.startswith("<") or v.strip() in ("não se aplica", "—"):
                continue
            if "*" in v:  # o valor vira regra liberada do sa-verificador: curinga abriria o shell inteiro
                raise ValueError(f".sabia/sabia.md: Verificação de aceite › {m[1]}: sem `*` ({v})")
            out[m[1]].append(v.strip())
    return out["Executar"], out["URL de teste"]


def valores_do(projeto, cfg):
    executar, urls = verificacao(projeto)
    um = lambda v: [v] if v is not None else None
    return {"BASE": [cfg["branch_base"]], "PREFIXO_BRANCH": [cfg.get("prefixo_branch", "")], "PRODUTO": [cfg["produto"]],
            "GLOSSARIO": um(cfg.get("glossario")), "ADR": um(cfg.get("adr")), "BUNDLE": um((cfg.get("elm") or {}).get("bundle")),
            "EXECUTAR": executar, "URL_TESTE": urls}


def permissoes(p, perfis, cfg, valores, mcp_projeto=()):
    """As regras do agente: o modelo dele (build | leitura) + liberacoes + segredos e harness + as regras ELM (só com
    elm diferente de false) + o MCP do projeto, com os marcadores preenchidos."""
    m = perfis["modelos"][p["permissao"]]
    perm = {c: {"padrao": m[c]["padrao"], **{e: list(m[c].get(e, [])) for e in EFEITOS}} for c in CATEGORIAS}
    for c, regras in p.get("liberacoes", {}).items():
        for e, ps in regras.items():
            perm[c][e] += ps
    harness = perfis["harness"] + [f".sabia/local/wt/*/{h}" for h in perfis["harness"]]  # a cópia do harness na worktree também
    perm["ler"]["deny"] += perfis["segredos"]
    perm["editar"]["deny"] += harness + perfis["segredos"]
    elm = cfg.get("elm")
    if not elm:
        perm["mcp"]["deny"].append("elm/*")
    elif p["permissao"] == "build":
        for e in EFEITOS:
            perm["mcp"][e] += elm.get("regras", {}).get(e, [])
    else:  # só leitura: a escrita do ELM é negada (a sa-elm.setup, passo dados)
        r = elm.get("regras", {})
        perm["mcp"]["allow"] += r.get("allow", [])
        perm["mcp"]["deny"] += r.get("ask", []) + r.get("deny", []) + ELM_SO_PRIMARIOS
    perm["mcp"]["allow"] += [x if "/" in x else f"{x}/*" for x in mcp_projeto]
    for c in perm.values():
        for e in EFEITOS:
            c[e] = preencher(c[e], valores)
    return perm


lista = lambda ps: ", ".join(f"`{x}`" for x in ps)
VERBO = {"allow": "liberado", "ask": "pede o \"sim\"", "deny": "negado"}


def limites(perm):
    """Os limites em texto: no Kiro valem só por aqui (tools sem regras); no opencode repetem o permission."""
    ler, ed, cm, mcp = (perm[c] for c in CATEGORIAS)
    out = [f"- Não leia: {lista(ler['deny'])}."]
    if ed["padrao"] == "deny":
        out.append(f"- Edite só: {lista(ed['allow'])}; nunca {lista(ed['deny'])}." if ed["allow"] else "- Não edite nenhum arquivo.")
    else:
        out.append(f"- Não edite: {lista(ed['deny'])}.")
    if cm["padrao"] == "deny":
        out.append(f"- Shell só para: {lista(cm['allow'])}; nunca {lista(cm['deny'])}." if cm["allow"] else "- Sem shell.")
    else:
        out.append("- Comandos: " + "; ".join(f"{VERBO[e]} {lista(cm[e])}" for e in ("ask", "deny") if cm[e]) + ".")
    out.append("- MCP: " + "; ".join(f"{VERBO[e]} {lista(mcp[e])}" for e in EFEITOS if mcp[e]) + f"; o resto {VERBO[mcp['padrao']]}.")
    return "Limites deste agente (no Kiro, valem só por este texto):\n" + "\n".join(out)


def texto_autopilot(ap, valores):
    lib = preencher(ap.get("comandos", {}).get("allow", []) + ap.get("mcp", {}).get("allow", []), valores)
    neg = preencher(ap.get("comandos", {}).get("deny", []) + ap.get("mcp", {}).get("deny", []), valores)
    # shortcut: o arquivo do agente é um só, com as regras do supervisionado; as do autopilot valem por este texto
    return (f"No autopilot (você como subagente na worktree, sem a pessoa): liberados {lista(lib)}; negados {lista(neg)};"
            " todo o resto que pediria o \"sim\" fica negado.")


def agente(nome, perfis, cfg, valores, ext=None, tk=None, fluxo=""):
    """O agente `nome` (sa-*); com `tk`, o agente do toolkit, com as permissões, as skills e os MCPs de `nome`, o dono
    do passo (não os subagentes)."""
    p = perfis["agentes"][nome]
    extra = cfg.get("agentes", {}).get(nome, {})
    ext = ext or {"skills": [], "subagentes": [], "passos": []}
    subs_projeto = [] if tk else extra.get("subagentes", []) + ext["subagentes"]
    subagentes = tk["subagentes"] if tk else p["subagentes"] + [s["nome"] for s in subs_projeto]
    skills_projeto = list(dict.fromkeys((tk["skills"] if tk else []) + extra.get("skills", []) + ([] if tk else ext["skills"])))
    perm = permissoes(p, perfis, cfg, valores, extra.get("mcp", []))

    nomes = [Path(s.removeprefix("skill://")).parent.name for s in skills_projeto]
    prompt = tk["prompt"] if tk else (ASSETS / f"{nome}.md").read_text(encoding="utf-8")
    prompt = prompt.replace("{{SKILLS_EXTRAS}}", f"Skills do projeto ligadas a você: {lista(nomes)} — carregue a do artefato antes de escrevê-lo."
                            if nomes else "")
    prompt = prompt.replace("{{PASSOS}}", texto_passos(ext["passos"]))
    prompt = prompt.replace("{{SUBAGENTES}}", "Subagentes do projeto: " + ", ".join(f"`{s['nome']}` ({s['para']})" for s in subs_projeto)
                            if subs_projeto else "")
    partes = [prompt.rstrip()] + ([] if tk else [x for x in (fluxo, CHAMADA) if x]) + [limites(perm)]
    if p.get("autopilot") and not tk:
        partes.append(texto_autopilot(p["autopilot"], valores))
    prompt = "\n\n".join(partes)
    # glossário ou ADR "não há" (null): a linha do prompt que cita o caminho sai
    prompt = "\n".join(l for l in prompt.split("\n") if not any(n in valores and not valores[n] for n in PH.findall(l)))
    prompt = PH.sub(lambda m: ", ".join(valores[m.group(1)]) if valores.get(m.group(1)) else m.group(0), prompt)
    prompt = re.sub(r"\n{3,}", "\n\n", prompt).rstrip() + "\n"
    return {"name": tk["nome"] if tk else nome, "description": tk["descricao"] if tk else p["descricao"],
            "mode": "subagent" if tk else p["mode"], "permissao": p["permissao"], "dono": nome, "prompt": prompt,
            "perm": perm, "skills": [] if tk else p["skills"], "skills_projeto": skills_projeto, "subagentes": subagentes,
            "mcp_projeto": bool(extra.get("mcp")), "modelo": extra.get("modelo")}


def kiro(a):
    """.kiro/agents/<nome>.json: só nomes de capability em tools, sem toolsSettings nem allowedTools."""
    perm = a["perm"]
    escreve = perm["editar"]["padrao"] != "deny" or perm["editar"]["allow"]
    shell = perm["comandos"]["padrao"] != "deny" or perm["comandos"]["allow"]
    mcp = dict.fromkeys("@" + m.removesuffix("/*") for e in ("allow", "ask") for m in perm["mcp"][e] if efeito(perm["mcp"], m) != "deny")
    k = {"name": a["name"], "description": a["description"], "prompt": a["prompt"],
         "tools": ["read"] + (["write"] if escreve else []) + (["shell"] if shell else []) + (["subagent"] if a["subagentes"] else []) + list(mcp),
         "resources": ["file://.kiro/steering/sabia.md"] + [f"skill://{POWER}/skills/{s}/SKILL.md" for s in a["skills"]] + a["skills_projeto"],
         "includeMcpJson": a["mcp_projeto"], "includePowers": True}
    if a["modelo"]:
        k["model"] = a["modelo"]
    return k


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


def _oc(padrao):
    """Padrão de caminho no curinga simples do opencode (`*` atravessa `/`): `**/x` pega a raiz e o aninhado."""
    padrao = padrao.removeprefix("./")
    return [padrao.removeprefix("**/").replace("**", "*"), "*/" + padrao.removeprefix("**/").replace("**", "*")] \
        if padrao.startswith("**/") else [padrao.replace("**", "*")]


def _bloco(r, conv=lambda x: [x]):
    """Uma categoria no permission do opencode: o padrão primeiro, depois allow, ask e deny (a última que casa vence)."""
    if r["padrao"] == "deny" and not r["allow"] and not r["ask"]:
        return "deny"
    d = {"*": r["padrao"]}
    for e in EFEITOS:
        for y in (y for x in r[e] for y in conv(x)):
            d.pop(y, None)
            d[y] = e
    return d


def opencode(a):
    """.opencode/agents/<nome>.md: mode e permission (allow · ask · deny), com o prompt no corpo."""
    perm = a["perm"]
    rede = efeito(perm["comandos"], "curl https://exemplo.invalido/")  # webfetch segue o curl de fora da URL de teste
    p = {"*": perm["mcp"]["padrao"],  # tool sem regra própria (MCP fora das listas) segue o padrão do MCP
         "read": _bloco(perm["ler"], _oc), **{t: perm["ler"]["padrao"] for t in LEITURA_OC},
         "edit": _bloco(perm["editar"], _oc), "bash": _bloco(perm["comandos"]),
         "task": {"*": "deny", **{s: "allow" for s in a["subagentes"]}} if a["subagentes"] else "deny",
         "skill": {"*": "deny", **{s: "allow" for s in a["skills"] + [Path(x.removeprefix("skill://")).parent.name for x in a["skills_projeto"]]}},
         "webfetch": rede, "websearch": rede,
         "external_directory": {"*": "ask", "~/.sabia/*": "allow", "~/.config/opencode/*": "allow"}}
    for e in EFEITOS:
        for x in perm["mcp"][e]:
            k = x.replace("/", "_", 1)
            p.pop(k, None)
            p[k] = e
    frente = {"description": a["description"], "mode": a["mode"]}
    if a["modelo"]:
        frente["model"] = a["modelo"]
    frente["permission"] = p
    return "---\n" + "\n".join(_yaml(frente)) + "\n---\n\n" + a["prompt"]


LACUNAS = {
    "kiro": ["sem regras por caminho, comando ou URL nos agentes: os limites vão no prompt, e as tools fora das confiáveis pedem o \"sim\""],
    "opencode": ["o autopilot do sa-desenvolvedor roda com as permissões do supervisionado (as do autopilot vão no prompt)",
                 "a negação do shell é por trecho do comando: `grep -r`, glob ou variável chegam a um `.env` ou ao harness sem"
                 " citá-lo (a leitura pela ferramenta continua negada)"],
}


def problemas(a, projeto, caminhos=True):
    """Marcador que sobrou no prompt e, no Kiro, caminho dos resources que não existe ou é absoluto."""
    out = [f"{a['name']}: sobrou {m}" for m in sorted(set(re.findall(r"\{\{[A-Z_]+\}\}", a["prompt"])))]
    for r in kiro(a)["resources"] if caminhos else []:
        caminho = r.split("://", 1)[1]
        if caminho.startswith(("/", "\\")) or re.match(r"^[A-Za-z]:", caminho) or "\\" in caminho or "$" in caminho:
            out.append(f"{a['name']}: caminho absoluto ou com variável: {r}")
            continue
        alvo = Path.home() / caminho[2:] if caminho.startswith("~/") else projeto / caminho
        # o steering é gravado pela setup no mesmo passo, depois do "ok" ao resumo
        if "*" not in caminho and r != "file://.kiro/steering/sabia.md" and not alvo.is_file():
            out.append(f"{a['name']}: não existe: {r}")
    return out


def resumo(agentes):
    """Tabela markdown do que cada agente recebeu."""
    cel = lambda xs: lista(xs) or "➖"
    linhas = ["| Agente | Mode | Permissão | Skills do Sabiá | Skills do projeto | MCP | Subagentes |", "|---|---|---|---|---|---|---|"]
    for a in agentes.values():
        mcp = a["perm"]["mcp"]
        m = "; ".join(f"{ic} {lista(mcp[e])}" for e, ic in (("allow", "🟢"), ("ask", "🟡")) if mcp[e]) or "➖"
        perm = a["permissao"] + ("" if a["name"] == a["dono"] else f" (do {a['dono']})")
        do_projeto = [Path(s.removeprefix("skill://")).parent.name for s in a["skills_projeto"]]
        linhas.append(f"| **{a['name']}** | {a['mode']} | {perm} | {cel(a['skills'])} | {cel(do_projeto)} | {m} | {cel(a['subagentes'])} |")
    return "\n".join(linhas) + "\n"


def conferir_sabia_md(projeto: Path) -> list[str]:
    """Seções e linhas de tabela do modelo que faltam (ou sobram) no .sabia/sabia.md do projeto: a setup o monta do
    modelo, nunca do arquivo antigo. As seções preenchidas por projeto ou pelo fluxo ficam de fora."""
    f = projeto / ".sabia" / "sabia.md"
    if not f.is_file() or not f.read_text(encoding="utf-8").startswith("---\ninclusion: always"):
        return []  # sem o front-matter do modelo: não foi montado pela setup
    livres = {"ELM", "Desvios de toolkit", "Tipos com skill de toolkit", "Regras aprendidas"}

    def rotulos(texto):
        sec, out = None, set()
        for linha in texto.splitlines():
            if linha.startswith("## "):
                sec = linha[3:].strip()
                out.add(f"## {sec}")
            elif sec not in livres and (m := re.match(r"\|\s*([^|]+?)\s*\|", linha)) and not set(m[1]) <= set("-: ") and "<" not in m[1]:
                out.add(f"{sec} › {m[1]}")
        return out
    modelo, atual = rotulos((ASSETS.parent / "steering" / "sabia.md").read_text(encoding="utf-8")), rotulos(f.read_text(encoding="utf-8"))
    return [f".sabia/sabia.md {o} modelo (assets/steering/sabia.md): {', '.join(sorted(x))}; monte o arquivo pelo modelo"
            for o, x in (("sem estas linhas do", modelo - atual), ("com linhas que não estão no", atual - modelo)) if x]


def gerar(projeto: Path, cfg: dict, framework=None) -> dict:
    """{nome: agente} dos 5 agentes e dos agentes de toolkit, no formato interno que kiro() e opencode() traduzem."""
    perfis = json.loads((ASSETS / "perfis.json").read_text(encoding="utf-8"))
    validar(cfg, perfis)
    fw = Path(framework or "~/.sabia/framework").expanduser()
    fluxos = ler_fluxos(fw)
    if not fluxos:
        raise ValueError(f"{fw} não tem os fluxos (fluxo/ ausente ou sem definições de fluxo): rode `sabia instalar` ou passe --framework")
    gerar.avisos, gerar.tabela_tipos = [], []
    tk, gerar.tabela_tipos = fonte_toolkits(projeto, cfg, fw, fluxos)
    delta, padroes, gerar.avisos = override(projeto, fw, fluxos, fonte_toolkits.originais)
    if cfg.get("sabia") and (fw / "plugin.json").exists():
        instalado = json.loads((fw / "plugin.json").read_text(encoding="utf-8")).get("version")
        if instalado != cfg["sabia"]:
            gerar.avisos.append(f"o projeto foi configurado com o Sabiá {cfg['sabia']} e o seu é o {instalado}: atualize um dos dois")
    por_agente, do_toolkit = passos(projeto, cfg, fluxos)
    for n, t in tk.items():  # a skill do tipo vai ao dono do passo de desvio do tipo
        por_agente.setdefault(n, {"skills": [], "subagentes": [], "passos": []})["skills"].extend(t["skills"])
    valores = valores_do(projeto, cfg)
    agentes = {n: agente(n, perfis, cfg, valores, por_agente.get(n),
                         fluxo="\n\n".join(x for x in [texto_fluxos(n, fluxos, delta, padroes), *tk.get(n, {}).get("linhas", [])] if x))
               for n in perfis["agentes"]}
    for n, t in do_toolkit.items():
        agentes[n] = agente(t["dono"], perfis, cfg, valores, tk=t)
    return agentes


def arquivos(agentes, projeto, alvos):
    """{caminho: conteúdo} de cada alvo."""
    out = {}
    for nome, a in agentes.items():
        if "kiro" in alvos:
            out[projeto / ".kiro/agents" / f"{nome}.json"] = json.dumps(kiro(a), ensure_ascii=False, indent=2) + "\n"
        if "opencode" in alvos:
            out[projeto / ".opencode/agents" / f"{nome}.md"] = opencode(a)
    return out


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--projeto", type=Path, default=Path("."))
    ap.add_argument("--config", type=Path, help="padrão: <projeto>/.sabia/config/agentes.json")
    ap.add_argument("--alvo", help="kiro,opencode (padrão: `alvos` do agentes.json, ou kiro)")
    ap.add_argument("--framework", type=Path, help="o framework instalado (padrão: ~/.sabia/framework)")
    ap.add_argument("--base", help="imprime a `base` de uma cópia: o id do passo (sa-x.f.p), o padrão (sa-x/nome.md ou requisitos/padrao-<tipo>.md) ou o caminho do padrão de um toolkit (~/.sabia/toolkits/...)")
    # gravar é opt-in: rodar sem flag nunca grava nada antes do "ok" da pessoa
    ap.add_argument("--gravar", action="store_true", help="grava os agentes (sem ela, só mostra o diff)")
    ap.add_argument("--diff", action="store_true", help="o padrão: mostra o diff e não grava")
    args = ap.parse_args(argv)
    if args.base:  # a setup calcula a base por aqui, nunca por outro caminho
        fw = (args.framework or Path("~/.sabia/framework")).expanduser()
        partes = args.base.split(".")
        fl = ler_fluxos(fw).get(".".join(partes[:2])) if len(partes) == 3 else None
        # o padrão de um toolkit (cópia em requisitos/ sobre ele) vem pelo caminho do arquivo instalado
        tk = Path(args.base).expanduser()
        f = arq_passo(fl, partes[2]) if fl else tk if tk.is_absolute() else fw / "padrao" / args.base
        if not f.is_file():
            print(f"não existe no framework: {args.base} ({f})", file=sys.stderr)
            return 1
        print(sha12(f))
        return 0
    projeto = args.projeto.resolve()
    try:
        cfg = json.loads((args.config or projeto / ".sabia/config/agentes.json").read_text(encoding="utf-8"))
    except (OSError, ValueError) as e:
        print(f"agentes.json: {e}", file=sys.stderr)
        return 1
    alvos = args.alvo.split(",") if args.alvo else cfg.get("alvos", ["kiro"])
    if fora := sorted(set(alvos) - set(ALVOS)):
        print(f"alvo desconhecido {fora}; use {', '.join(ALVOS)}", file=sys.stderr)
        return 1
    try:
        agentes = gerar(projeto, cfg, args.framework)
    except ValueError as e:
        print(e, file=sys.stderr)
        return 1
    if erros := [e for a in agentes.values() for e in problemas(a, projeto, caminhos="kiro" in alvos)]:
        print("\n".join(erros), file=sys.stderr)
        return 1
    for alvo, novo in arquivos(agentes, projeto, alvos).items():
        antigo = alvo.read_text(encoding="utf-8") if alvo.exists() else ""
        if not args.gravar:
            sys.stdout.writelines(difflib.unified_diff(antigo.splitlines(True), novo.splitlines(True), str(alvo), str(alvo)))
        elif novo != antigo:
            alvo.parent.mkdir(parents=True, exist_ok=True)
            alvo.write_text(novo, encoding="utf-8")
            print(f"gravado {alvo}")
    if args.gravar:  # o sabia.md já foi gravado pela setup: a conferência é contra o do disco
        gerar.avisos.extend(conferir_sabia_md(projeto))
    print("\n" + resumo(agentes), end="")
    if gerar.tabela_tipos:  # a setup grava estas tabelas no sabia.md (o que vale na sessão sem agente)
        print("\nTipos com skill de toolkit (seção do sabia.md):\n" + "\n".join(gerar.tabela_tipos))
    for aviso in gerar.avisos:
        print(f"aviso: {aviso}")
    for alvo in alvos:
        print(f"\nO que não tem tradução no {alvo}:\n" + "".join(f"- {l}\n" for l in LACUNAS[alvo]), end="")
    return 0


if __name__ == "__main__":
    sys.exit(main())
