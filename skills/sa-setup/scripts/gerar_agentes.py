"""Gera os agentes do Sabiá a partir de assets/agents/papeis.json, dos prompts assets/agents/sa-<papel>.md e da
configuração do projeto em .sabia/config/agentes.json, para cada alvo: kiro (.kiro/agents/*.json, IDE e CLI V3),
opencode (.opencode/agents/*.md) e claude (.claude/agents/*.md e as regras de proteção no .claude/settings.json).

    uv run --no-project python gerar_agentes.py --projeto <raiz>            # só mostra o diff e a tabela
    uv run --no-project python gerar_agentes.py --projeto <raiz> --gravar   # grava (só depois do "ok" da pessoa)
    ... --alvo kiro,opencode,claude                                         # padrão: `alvos` do agentes.json, ou kiro

Sai com 1 se algum caminho citado não existe ou sobrou um {{…}} (nada é gravado). Termina com a tabela do que
cada agente recebeu (skills, MCPs, ELM, subagentes, push), lida dos agentes gerados.
"""
import argparse
import difflib
import json
import re
import sys
from pathlib import Path

ASSETS = Path(__file__).resolve().parent.parent / "assets" / "agents"
ALVOS = ("kiro", "opencode", "claude")
# shortcut: pasta fixa das skills do Sabiá no opencode (onde o CLI as copia); se o CLI ganhar --escopo projeto, vira config
POWER_OPENCODE = "~/.config/opencode"
PH = re.compile(r"\{\{([A-Z_]+)\}\}")


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


def passos(projeto, cfg):
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
        dono = por_papel.setdefault(ext["papel"], {"skills": [], "subagentes": [], "passos": []})
        dono["skills"].append(f"skill://{pasta}/{dentro(e['skill'], e['toolkit'])}")
        com_agente = bool(e.get("agente") and ext.get("agente"))
        dono["passos"].append({"skill": Path(e["skill"]).parent.name, "para": ext["para"],
                               "agente": ext["agente"] if com_agente else None})
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
            do_toolkit[n] = {"papel": ext["papel"], "nome": n, "descricao": d["descricao"],
                             "prompt": (real / dentro(d["prompt"], e["toolkit"])).read_text(encoding="utf-8"),
                             "skills": [f"skill://{pasta}/{dentro(x, e['toolkit'])}" for x in d.get("skills", [])],
                             "subagentes": d.get("subagentes", [])}
            fila += d.get("subagentes", [])
    return por_papel, do_toolkit


def texto_passos(papel, passos):
    """Os passos de toolkit no prompt do dono: a configuração decide, nada é marcado no status.md nem no tasks.md."""
    if not passos:
        return ""
    onde = {"especificador": "na escrita do PRD (3.2 da `sa-prd`)", "desenvolvedor": "em cada tarefa do `tasks.md`"}.get(papel, "no passo")
    regras = [f"`{x['para']}` → delegue ao subagente `{x['agente']}`, com o briefing e o contrato do `passos.md`" if x["agente"]
              else f"`{x['para']}` → carregue a skill `{x['skill']}` e faça o passo por ela" for x in passos]
    return (f"Passos de toolkit: {onde}, o que casa com o `para` vai ao toolkit, sem perguntar à pessoa e sem marcar"
            f" no `status.md` nem no `tasks.md`: " + "; ".join(regras) + ".")


def agente(nome, p, base, cfg, ext=None, tk=None):
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
        harness = [y for x in base["harness"] for y in ([x.removeprefix("**/"), x] if x.startswith("**/") else [x])]
        regras += [regra("fs_write", "allow", ["./**"]),
                   regra("fs_write", "deny", preencher(harness + alheios, valores))]
    for g in base["niveis_shell"][p["shell"]]:
        regras.append(regra("shell", "allow", sh[g]["comandos"], sh[g].get("exceto")))
    soltos = list(p.get("shell_permitir", []))
    if p["shell"] == "trabalho":  # os comandos do projeto
        soltos += [c for cs in cfg.get("comandos", {}).values() for c in cs] + ["sh .sabia/verificar.sh"]
        if cfg.get("http_sh"):
            soltos.append("sh .sabia/http.sh *")
    if soltos:
        regras.append(regra("shell", "allow", soltos))
    push = p.get("push")
    if push == "loop":
        push = "perguntar" if cfg.get("push_pr_no_loop", True) else "negar"
    perguntar = (["git push *"] if push == "perguntar" else []) + p.get("shell_perguntar", [])
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

    skills_projeto = tk["skills"] + [s for s in extra.get("skills", []) if s not in tk["skills"]] if tk else extra.get("skills", []) + ext["skills"]
    skills_extras = [Path(s.removeprefix("skill://")).parent.name for s in skills_projeto]
    prompt = tk["prompt"] if tk else (ASSETS / f"sa-{nome}.md").read_text(encoding="utf-8")
    prompt = prompt.replace("{{SKILLS_EXTRAS}}", f"Skills do projeto ligadas a você: {', '.join(f'`{s}`' for s in skills_extras)}"
                            " — carregue a do artefato antes de escrevê-lo." if skills_extras else "")
    prompt = prompt.replace("{{PASSOS}}", texto_passos(nome, ext.get("passos", [])))
    prompt = prompt.replace("{{SUBAGENTES}}", "Subagentes do projeto: " + ", ".join(f"`{s['nome']}` ({s['para']})" for s in subs_projeto)
                            if subs_projeto else "")
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


def claude(a):
    """O agente do Kiro traduzido para .claude/agents/<nome>.md. O Claude Code só tira ferramentas inteiras do
    subagente; a proteção dos arquivos vai no settings.json (`claude_settings`)."""
    tira = []
    if not _regras(a, "fs_write"):
        tira += ["Write", "Edit", "NotebookEdit"]
    if "shell" not in a["tools"]:
        tira.append("Bash")
    tira += [f"mcp__{_mcp(m, '__')}" for r in _regras(a, "power", "deny") for m in r["match"]]
    frente = {"name": a["name"], "description": a["description"]}
    if tira:
        frente["disallowedTools"] = ", ".join(tira)
    if a.get("model"):
        frente["model"] = a["model"]
    return _md(frente, a["prompt"])


def claude_settings(agentes, atual):
    """Protege só o fluxo e o planejamento: harness e registros perguntam antes de qualquer escrita, a todos (o Claude
    Code não restringe caminho por subagente). Mantém o resto do settings.json como está."""
    caminhos = sorted({m for a in agentes.values() for r in _regras(a, "fs_write", "deny") for m in r["match"]})
    regras = [f"Edit({m if m.startswith('**/') else '/' + m.removeprefix('./')})" for m in caminhos]
    novo = json.loads(json.dumps(atual))
    ask = novo.setdefault("permissions", {}).setdefault("ask", [])
    ask += [r for r in regras if r not in ask]
    return novo


LACUNAS = {
    "opencode": ["as exceções de cada grupo de comandos (`git log --output`, `git add -f`…) perguntam para qualquer comando, não só para o grupo",
                 "`external_directory` com `~/` não foi conferido numa sessão real"],
    "claude": ["registros e harness perguntam a todos (sessão principal inclusive), sem diferenciar o papel",
               "sem regra de shell por papel: push, comandos negados e comandos do projeto seguem as permissões da pessoa",
               "escrita no ELM e no GitLab sem pergunta por agente (só as tools que o papel não usa são tiradas)",
               "skills e subagentes não ficam restritos por agente (o prompt diz quais usar)"],
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
        push = "🟡 pergunta" if any(r["capability"] == "shell" and r["effect"] == "ask" and "git push *" in r["match"]
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
    por_papel, do_toolkit = passos(projeto, cfg)
    if fora := sorted(set(por_papel) - set(base["papeis"])):
        raise ValueError(f"toolkit: passo de papel desconhecido {fora}")
    agentes = {f"sa-{n}.json": agente(n, p, base, cfg, por_papel.get(n)) for n, p in base["papeis"].items()}
    for n, tk in do_toolkit.items():
        agentes[f"{n}.json"] = agente(tk["papel"], base["papeis"][tk["papel"]], base, cfg, tk=tk)
    return agentes


def arquivos(agentes, cfg, projeto, alvos):
    """{caminho: conteúdo} de cada alvo; o settings.json do Claude Code é mesclado com o que já existe."""
    out = {}
    for arquivo, a in agentes.items():
        nome = arquivo.removesuffix(".json")
        if "kiro" in alvos:
            out[projeto / ".kiro/agents" / arquivo] = json.dumps(a, ensure_ascii=False, indent=2) + "\n"
        if "opencode" in alvos:
            out[projeto / ".opencode/agents" / f"{nome}.md"] = opencode(a, cfg, subagente=not nome.startswith("sa-"))
        if "claude" in alvos:
            out[projeto / ".claude/agents" / f"{nome}.md"] = claude(a)
    if "claude" in alvos:
        st = projeto / ".claude/settings.json"
        atual = json.loads(st.read_text(encoding="utf-8")) if st.exists() else {}
        out[st] = json.dumps(claude_settings(agentes, atual), ensure_ascii=False, indent=2) + "\n"
    return out


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--projeto", type=Path, default=Path("."))
    ap.add_argument("--config", type=Path, help="padrão: <projeto>/.sabia/config/agentes.json")
    ap.add_argument("--alvo", help="kiro,opencode,claude (padrão: `alvos` do agentes.json, ou kiro)")
    # gravar é opt-in: rodar sem flag nunca grava nada antes do "ok" da pessoa
    ap.add_argument("--gravar", action="store_true", help="grava os agentes (sem ela, só mostra o diff)")
    ap.add_argument("--diff", action="store_true", help="o padrão: mostra o diff e não grava")
    args = ap.parse_args(argv)
    projeto = args.projeto.resolve()
    cfg = json.loads((args.config or projeto / ".sabia/config/agentes.json").read_text(encoding="utf-8"))
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
    for alvo in alvos:
        if LACUNAS.get(alvo):
            print(f"\nO que não tem tradução no {alvo}:\n" + "".join(f"- {l}\n" for l in LACUNAS[alvo]), end="")
    return 0


if __name__ == "__main__":
    sys.exit(main())
