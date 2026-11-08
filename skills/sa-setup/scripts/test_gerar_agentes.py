"""uv run --no-project python -m unittest test_gerar_agentes   (nesta pasta)"""
import contextlib
import hashlib
import io
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import unittest
from fnmatch import fnmatchcase
from pathlib import Path

import gerar_agentes as g

REPO = Path(__file__).resolve().parents[3]  # a fonte do framework (fluxo/, padrao/, plugin.json)
PERFIS = json.loads((g.ASSETS / "perfis.json").read_text(encoding="utf-8"))
NOMES = list(PERFIS["agentes"])
ELM = {"pa": "alfa", "bundle": "docs/elm/alfa",
       "regras": {"allow": ["elm/elm_ler_wi", "elm/elm_*_local", "elm/elm_sync"],
                  "ask": ["elm/elm_criar_wi", "elm/elm_publicar_req"], "deny": ["elm/elm_backlog"]}}
SABIA_MD = ("# Sabiá — teste\n\n## Verificação de aceite\n\n| Item | `api` | `web` |\n|---|---|---|\n"
            "| Executar | `mvn spring-boot:run` | `npm start` |\n| URL de teste | `http://localhost:8080` | `<url — nunca a de produção | não se aplica>` |\n")


def frente(md):
    """O frontmatter que o _yaml grava (chaves e escalares em JSON, mapas por indentação) de volta em dict."""
    raiz, pilha = {}, [(-1, {})]
    pilha[0] = (-1, raiz)
    for l in md.split("---\n")[1].splitlines():
        ind = len(l) - len(l.lstrip())
        while pilha[-1][0] >= ind:
            pilha.pop()
        k, fim = json.JSONDecoder().raw_decode(l.strip())
        resto = l.strip()[fim:].removeprefix(":").strip()
        if resto:
            pilha[-1][1][k] = json.loads(resto)
        else:
            pilha[-1][1][k] = {}
            pilha.append((ind, pilha[-1][1][k]))
    return raiz


def oc(regra, alvo):
    """Como o opencode decide: a última chave que casa vence (`*` atravessa `/`)."""
    if isinstance(regra, str):
        return regra
    return [v for k, v in regra.items() if fnmatchcase(alvo, k)][-1]


class Base(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        raiz = Path(self.tmp.name)
        self.home, self.projeto = raiz / "home", raiz / "projeto"
        for s in {s for a in PERFIS["agentes"].values() for s in a["skills"]}:
            f = self.home / ".kiro/powers/installed/sabia/skills" / s / "SKILL.md"
            f.parent.mkdir(parents=True)
            f.write_text("x")
        (self.projeto / ".sabia").mkdir(parents=True)
        (self.projeto / ".sabia/sabia.md").write_text(SABIA_MD)
        self.velho_home, os.environ["HOME"] = os.environ.get("HOME"), str(self.home)
        self.cfg = {"alvos": ["kiro", "opencode"], "sabia": json.loads((REPO / "plugin.json").read_text())["version"], "formato_spec": "kiro", "produto": ".sabia/planejamento",
                    "base": "develop", "prefixo_branch": "feature/", "glossario": "docs/glossario.md", "adr": "docs/adr",
                    "elm": ELM, "toolkits": {}, "passos": [], "agentes": {}}

    def tearDown(self):
        os.environ["HOME"] = self.velho_home
        self.tmp.cleanup()

    def gerar(self, **mudar):
        agentes = g.gerar(self.projeto, {**self.cfg, **mudar}, REPO)
        self.assertEqual([e for a in agentes.values() for e in g.problemas(a, self.projeto)], [])
        return agentes

    def perm(self, a):
        return frente(g.opencode(a))["permission"]

    def base(self, rel):
        return hashlib.sha256((REPO / rel).read_bytes()).hexdigest()[:12]

    def escrever(self, arquivos):
        for f, c in arquivos.items():
            (self.projeto / f).parent.mkdir(parents=True, exist_ok=True)
            (self.projeto / f).write_text(c if isinstance(c, str) else json.dumps(c))

    def toolkit(self, passo="sa-desenvolver.codificar.tarefa", papeis=("desenvolvedor",), **mudar):
        """Toolkit fictício em ~/.sabia/toolkits/batch-alfa: passo do desenvolvedor com o agente job, que chama o step."""
        pasta = self.home / ".sabia/toolkits/batch-alfa"
        for f in ("skills/batch/SKILL.md", "skills/teste/SKILL.md", "agentes/job.md", "agentes/step.md"):
            (pasta / f).parent.mkdir(parents=True, exist_ok=True)
            (pasta / f).write_text("x {{BASE}}" if f.startswith("agentes") else "x")
        man = {"nome": "batch-alfa", "versao": "1.0.0",
               "skills": [{"caminho": "skills/batch/SKILL.md", "papeis": list(papeis),
                           "passo": {"passo": passo, "para": "tarefa de job", "arquivos": ["**/*JobConfig.java"], "agente": "batch-job"}}],
               "agentes": [{"nome": "batch-job", "descricao": "job", "prompt": "agentes/job.md", "skills": ["skills/batch/SKILL.md"],
                            "subagentes": ["batch-step"]},
                           {"nome": "batch-step", "descricao": "step", "prompt": "agentes/step.md", "skills": ["skills/teste/SKILL.md"]}]}
        man.update(mudar)
        (pasta / "toolkit.json").write_text(json.dumps(man))
        return {"toolkits": {"batch-alfa": {"pasta": "~/.sabia/toolkits/batch-alfa", "versao": "1.0.0", "sha": "abc"}},
                "passos": [{"toolkit": "batch-alfa", "skill": "skills/batch/SKILL.md", "agente": "batch-job"}]}

    def casa(self, nome="casa", rubricas=None, papeis=("especificador",), extra=None, **tipos):
        """Toolkit sintético em ~/.sabia/toolkits/<nome>: a skill <nome> escreve o tipo pelo fluxo e o padrão dele, arquivos
        da pasta (o Sabiá não compila conteúdo de toolkit), e uma rubrica."""
        pasta = self.home / ".sabia/toolkits" / nome
        for f in (f"skills/{nome}/SKILL.md", "fluxo/fluxo-hf.md", "padrao/padrao-hf.md", "fluxo/fluxo-reuniao.md", "steering/java.md"):
            (pasta / f).parent.mkdir(parents=True, exist_ok=True)
            (pasta / f).write_text("# x\n")
        sk = f"skills/{nome}/SKILL.md"
        man = {"nome": nome, "versao": "1.0.0", "skills": [{"caminho": sk, "papeis": list(papeis)}],
               "tipos": tipos or {"HF": {"skill": sk, "fluxo": "fluxo/fluxo-hf.md", "padrao": "padrao/padrao-hf.md"},
                                  "ATA": {"skill": sk, "fluxo": "fluxo/fluxo-reuniao.md"}},
               "rubricas": [{"id": "EX1", "tipo": "HF", "verificacao": "Toda HF cita o campo de origem", "severidade": "IMPORTANTE"}] if rubricas is None else rubricas,
               **(extra or {})}
        (pasta / "toolkit.json").write_text(json.dumps(man))
        return {nome: {"pasta": f"~/.sabia/toolkits/{nome}", "versao": "1.0.0"}}


class Agentes(Base):
    def test_cinco_agentes_nos_dois_formatos(self):
        agentes = self.gerar()
        self.assertEqual(list(agentes), NOMES)
        for nome, a in agentes.items():
            k, o = g.kiro(a), frente(g.opencode(a))
            self.assertEqual(k["name"], nome)
            self.assertFalse({"toolsSettings", "allowedTools", "permissions"} & set(k), nome)
            self.assertTrue(all(t in ("read", "write", "shell", "subagent") or t.startswith("@") for t in k["tools"]), k["tools"])
            self.assertNotIn("{{", json.dumps(k) + g.opencode(a))
            self.assertEqual(o["mode"], PERFIS["agentes"][nome]["mode"])
            self.assertEqual(o["description"], PERFIS["agentes"][nome]["descricao"])
            self.assertTrue(g.opencode(a).endswith(a["prompt"]))
            self.assertIn("Limites deste agente", a["prompt"])
            self.assertIn("file://.kiro/steering/sabia.md", k["resources"])
            for s in PERFIS["agentes"][nome]["skills"]:
                self.assertIn(f"skill://{g.POWER}/skills/{s}/SKILL.md", k["resources"])
                self.assertEqual(o["permission"]["skill"][s], "allow")
        self.assertEqual({n for n, a in agentes.items() if "write" not in g.kiro(a)["tools"]}, {"sa-pesquisador", "sa-revisor"})
        self.assertEqual(frente(g.opencode(agentes["sa-desenvolvedor"]))["permission"]["task"],
                         {"*": "deny", "sa-pesquisador": "allow", "sa-revisor": "allow", "sa-verificador": "allow", "sa-desenvolvedor": "allow"})
        self.assertEqual(self.perm(agentes["sa-pesquisador"])["task"], "deny")

    def test_build_sem_restricao_por_pasta_fora_do_harness(self):
        agentes = self.gerar()
        for nome in ("sa-desenvolvedor", "sa-especificador"):
            p = self.perm(agentes[nome])
            for alvo in ("src/main/App.java", ".kiro/specs/ft-001-x/status.md", "openspec/changes/ft-001-x/tasks.md",
                         ".sabia/planejamento/backlog.md", ".sabia/sabia.md", ".sabia/creditos/ana.csv"):
                self.assertEqual(oc(p["edit"], alvo), "allow", (nome, alvo))
            for alvo in (".kiro/agents/sa-revisor.json", ".kiro/settings/mcp.json", ".kiro/steering/sabia.md", ".opencode/agents/x.md",
                         "opencode.json", ".sabia/config/agentes.json", ".sabia/fluxo/sa-plano/plano/passos/x.md", ".sabia/padrao/sa-plano/plano.md",
                         ".sabia/local/wt/ft-001/.kiro/agents/x.json", ".env", "mod/.env.local", "certs/x.pem"):
                self.assertEqual(oc(p["edit"], alvo), "deny", (nome, alvo))
            for alvo in (".env", "api/.env.prod", "~/.ssh/id_rsa", "conf/elm.properties"):
                self.assertEqual(oc(p["read"], alvo), "deny", (nome, alvo))
            self.assertEqual(oc(p["read"], "src/main/App.java"), "allow")
            for cmd, e in (("mvn -q test", "allow"), ("git commit -m x", "allow"), ("git push origin ft-001", "ask"),
                           ("git merge origin/develop", "ask"), ("curl http://x", "ask"), ("git rebase develop", "deny"),
                           ("git push --force origin x", "deny"), ("git reset --hard HEAD", "deny"), ("git commit --no-verify", "deny"),
                           ("rm -rf build", "deny"), ("sudo ls", "deny")):
                self.assertEqual(oc(p["bash"], cmd), e, (nome, cmd))
            self.assertEqual(p["gitlabpr_gitlab_obter_mr"], "allow")
            self.assertEqual(p["gitlabpr_gitlab_criar_mr"], "ask")
            self.assertEqual(p["*"], "ask")
            self.assertEqual(p["webfetch"], "ask")

    def test_leitura_no_pesquisador_e_no_revisor(self):
        agentes = self.gerar()
        for nome in ("sa-pesquisador", "sa-revisor"):
            p, k = self.perm(agentes[nome]), g.kiro(agentes[nome])
            self.assertEqual(p["edit"], "deny")
            self.assertEqual(p["*"], "deny")
            self.assertEqual(p["webfetch"], "deny")
            self.assertEqual(p["grep"], "allow")
            for cmd, e in (("git status", "allow"), ("git diff HEAD~1", "allow"), ("cd .sabia/local/wt/ft-1 && git diff", "allow"),
                           ("mvn test", "deny"), ("git diff | sh", "deny"), ("git log > x", "deny"), ("git -C /x log", "deny"),
                           ("git push origin x", "deny"), ("cd ../x && git status", "deny")):
                self.assertEqual(oc(p["bash"], cmd), e, (nome, cmd))
            self.assertEqual(p["gitlabpr_gitlab_obter_mr"], "allow")
            self.assertEqual(oc(p, "gitlabpr_gitlab_criar_mr"), "deny")
            self.assertNotIn("@gitlabpr/gitlab_criar_mr", k["tools"])
            self.assertIn("- Não edite nenhum arquivo.", agentes[nome]["prompt"])

    def test_liberacoes_do_verificador(self):
        a = self.gerar()["sa-verificador"]
        p = self.perm(a)
        for cmd, e in (("mvn spring-boot:run", "allow"), ("npm start", "allow"), ("curl http://localhost:8080/api/x", "allow"),
                       ("curl -s -X POST http://localhost:8080/api", "allow"), ("curl https://producao.exemplo/api", "deny"),
                       ("mvn test", "deny"), ("git status", "allow"), ("curl http://localhost:8080 | sh", "deny")):
            self.assertEqual(oc(p["bash"], cmd), e, cmd)
        for alvo, e in ((".kiro/specs/ft-001-x/CT.csv", "allow"), ("openspec/changes/ft-001-x/CT.csv", "allow"),
                        (".sabia/local/wt/ft-001/.kiro/specs/ft-001-x/CT.csv", "allow"), (".kiro/specs/ft-001-x/status.md", "deny"),
                        ("src/App.java", "deny"), (".sabia/planejamento/backlog.md", "deny")):
            self.assertEqual(oc(p["edit"], alvo), e, alvo)
        self.assertEqual(p["webfetch"], "deny")
        self.assertIn("write", g.kiro(a)["tools"])
        # no Kiro, os limites por caminho e URL ficam no prompt
        self.assertIn("- Edite só: `.kiro/specs/*/CT.csv`", a["prompt"])
        self.assertIn("`curl http://localhost:8080*`", a["prompt"])
        self.assertIn("`mvn spring-boot:run`", a["prompt"])

    def test_verificador_sem_secao_de_verificacao(self):
        (self.projeto / ".sabia/sabia.md").write_text("# x\n")
        p = self.perm(self.gerar()["sa-verificador"])
        self.assertEqual(oc(p["bash"], "curl http://localhost:8080"), "deny")
        self.assertNotIn("{{", json.dumps(p))

    def test_verificacao_com_curinga_e_recusada(self):
        (self.projeto / ".sabia/sabia.md").write_text(SABIA_MD.replace("`npm start`", "`*`"))
        with self.assertRaisesRegex(ValueError, r"Verificação de aceite › Executar: sem `\*`"):
            g.gerar(self.projeto, self.cfg, REPO)

    def test_autopilot_no_prompt_do_desenvolvedor(self):
        agentes = self.gerar()
        d = agentes["sa-desenvolvedor"]["prompt"]
        linha = next(l for l in d.splitlines() if l.startswith("No autopilot"))
        for x in ("`cd .sabia/local/wt/*`", "`git push origin feature/*`", "`git push -u origin feature/*`", "`git merge origin/develop`",
                  "`gitlabpr/gitlab_criar_mr`"):
            self.assertIn(x, linha.split("; negados")[0], x)
        for x in ("`git push * develop`", "`git push *:develop*`", "`git merge *--squash*`", "`curl *`", "`gitlabpr/gitlab_mesclar_mr`", "`elm/*`"):
            self.assertIn(x, linha.split("; negados")[1], x)
        self.assertIn("todo o resto que pediria o \"sim\" fica negado", linha)
        for n in NOMES[1:]:
            self.assertNotIn("No autopilot (", agentes[n]["prompt"], n)
        # o arquivo do agente fica com as regras do supervisionado
        self.assertEqual(oc(self.perm(agentes["sa-desenvolvedor"])["bash"], "git push origin feature/x"), "ask")

    def test_com_elm(self):
        agentes = self.gerar()
        for nome in ("sa-desenvolvedor", "sa-especificador"):
            p, k = self.perm(agentes[nome]), g.kiro(agentes[nome])
            self.assertEqual((p["elm_elm_ler_wi"], p["elm_elm_criar_wi"], p["elm_elm_backlog"]), ("allow", "ask", "deny"))
            self.assertIn("@elm/elm_criar_wi", k["tools"])
        for nome in ("sa-pesquisador", "sa-revisor", "sa-verificador"):
            p, k = self.perm(agentes[nome]), g.kiro(agentes[nome])
            self.assertEqual(oc(p, "elm_elm_ler_wi"), "allow", nome)
            self.assertEqual(oc(p, "elm_elm_buscar_local"), "allow", nome)
            for t in ("elm_elm_criar_wi", "elm_elm_publicar_req", "elm_elm_sync", "elm_elm_indexar_local", "elm_elm_backlog"):
                self.assertEqual(oc(p, t), "deny", (nome, t))
            self.assertIn("@elm/elm_ler_wi", k["tools"])
            self.assertFalse({"@elm/elm_criar_wi", "@elm/elm_sync"} & set(k["tools"]), nome)

    def test_sem_elm(self):
        for nome, a in self.gerar(elm=False).items():
            p = self.perm(a)
            self.assertEqual(p["elm_*"], "deny", nome)
            self.assertEqual(oc(p, "elm_elm_ler_wi"), "deny", nome)
            self.assertFalse([t for t in g.kiro(a)["tools"] if t.startswith("@elm")], nome)

    def test_esquema_fechado_do_agentes_json(self):
        for mudar, erro in (({"bundle": None}, r"chave fora do esquema \['bundle'\]"),
                            ({"agentes": {"desenvolvedor": {}}}, "agente desconhecido desenvolvedor"),
                            ({"agentes": {"sa-revisor": {"ler": []}}}, r"agentes.sa-revisor: chave fora do esquema \['ler'\]"),
                            ({"elm": True}, "elm: false ou"), ({"elm": {"pa": "x", "regras": {"pergunta": []}}}, "elm: false ou"),
                            ({"formato_spec": "markdown"}, "formato_spec"), ({"base": ""}, r"falta \['base'\]")):
            with self.assertRaisesRegex(ValueError, erro, msg=mudar):
                g.gerar(self.projeto, {**self.cfg, **mudar}, REPO)

    def test_extras_do_projeto(self):
        (self.projeto / ".kiro/skills/java").mkdir(parents=True)
        (self.projeto / ".kiro/skills/java/SKILL.md").write_text("x")
        e = self.gerar(agentes={"sa-especificador": {"skills": ["skill://.kiro/skills/java/SKILL.md"], "mcp": ["banco/consultar"],
                                                     "subagentes": [{"nome": "dba", "para": "consultas"}], "modelo": "m1"}})["sa-especificador"]
        k, o = g.kiro(e), frente(g.opencode(e))
        self.assertTrue(k["includeMcpJson"])
        self.assertIn("@banco/consultar", k["tools"])
        self.assertEqual(o["permission"]["banco_consultar"], "allow")
        self.assertEqual(o["permission"]["task"]["dba"], "allow")
        self.assertEqual(o["permission"]["skill"]["java"], "allow")
        self.assertIn("Skills do projeto ligadas a você: `java`", e["prompt"])
        self.assertIn("`dba` (consultas)", e["prompt"])
        self.assertEqual((k["model"], o["model"]), ("m1", "m1"))

    def test_sem_glossario(self):
        e = self.gerar(glossario=None)["sa-especificador"]["prompt"]
        self.assertNotIn("glossário (`", e)
        self.assertIn("glossário (`docs/glossario.md`)", self.gerar()["sa-especificador"]["prompt"])

    def test_caminho_ruim_e_apontado(self):
        a = g.gerar(self.projeto, {**self.cfg, "agentes": {"sa-revisor": {"skills": ["skill://.kiro/skills/nao/SKILL.md", "skill:///abs/SKILL.md"]}}}, REPO)
        self.assertEqual(len(g.problemas(a["sa-revisor"], self.projeto)), 2)
        self.assertEqual(g.problemas(a["sa-revisor"], self.projeto, caminhos=False), [])

    def test_resumo(self):
        linhas = {l.split("|")[1].strip(): l for l in g.resumo(self.gerar(**self.toolkit())).splitlines()[2:]}
        self.assertIn("| primary | build |", linhas["**sa-desenvolvedor**"])
        self.assertIn("| subagent | leitura |", linhas["**sa-revisor**"])
        self.assertIn("build (do sa-desenvolvedor)", linhas["**batch-job**"])
        self.assertIn("`batch-job`", linhas["**sa-desenvolvedor**"])


class Toolkits(Base):
    def test_passo_com_agente_tem_as_permissoes_do_dono(self):
        agentes = self.gerar(**self.toolkit())
        d, job, step = agentes["sa-desenvolvedor"], agentes["batch-job"], agentes["batch-step"]
        self.assertIn("skill://~/.sabia/toolkits/batch-alfa/skills/batch/SKILL.md", g.kiro(d)["resources"])
        self.assertIn("batch-job", d["subagentes"])
        self.assertIn("Desvios de toolkit no passo `sa-desenvolver.codificar.tarefa`", d["prompt"])
        self.assertIn("`tarefa de job` (arquivos `**/*JobConfig.java`) → delegue ao subagente `batch-job`", d["prompt"])
        self.assertNotIn("Desvios de toolkit", agentes["sa-especificador"]["prompt"])
        for a in (job, step):  # as regras do dono, nunca mais que isso
            self.assertEqual(a["perm"], d["perm"])
            pa, pd = self.perm(a), self.perm(d)
            self.assertEqual({k: v for k, v in pa.items() if k not in ("task", "skill")}, {k: v for k, v in pd.items() if k not in ("task", "skill")})
            self.assertEqual(frente(g.opencode(a))["mode"], "subagent")
            self.assertTrue(set(g.kiro(a)["tools"]) - {"subagent"} <= set(g.kiro(d)["tools"]))
            self.assertIn("Limites deste agente", a["prompt"])
            self.assertNotIn("No autopilot (", a["prompt"])
        self.assertTrue(job["prompt"].startswith("x develop\n"))
        self.assertEqual(job["subagentes"], ["batch-step"])
        self.assertEqual(step["subagentes"], [])
        self.assertFalse([r for r in g.kiro(job)["resources"] if "/sa-" in r])

    def test_desvio_aceita_o_id_antigo(self):
        d = self.gerar(**self.toolkit(passo="sa-codificar.codificar.tarefa"))["sa-desenvolvedor"]
        self.assertIn("Desvios de toolkit no passo `sa-desenvolver.codificar.tarefa`", d["prompt"])

    def test_papel_do_toolkit_tem_de_ser_do_dono(self):
        with self.assertRaisesRegex(ValueError, "não traz o papel desenvolvedor em papeis"):
            g.gerar(self.projeto, {**self.cfg, **self.toolkit(papeis=["especificador", "orquestrador"])}, REPO)

    def test_agente_do_toolkit_herda_skills_e_mcps_do_dono(self):
        cfg = {**self.toolkit(), "agentes": {"sa-desenvolvedor": {"skills": ["skill://~/.sabia/toolkits/batch-alfa/skills/teste/SKILL.md"],
                                                                  "mcp": ["sqlcl/sql_run"], "subagentes": [{"nome": "outro", "para": "x"}]}}}
        agentes = self.gerar(**cfg)
        job, d = agentes["batch-job"], agentes["sa-desenvolvedor"]
        self.assertEqual(job["skills_projeto"], ["skill://~/.sabia/toolkits/batch-alfa/skills/batch/SKILL.md",
                                                 "skill://~/.sabia/toolkits/batch-alfa/skills/teste/SKILL.md"])
        self.assertIn("@sqlcl/sql_run", g.kiro(job)["tools"])
        self.assertNotIn("outro", job["subagentes"])
        self.assertIn("outro", d["subagentes"])

    def test_passo_sem_agente(self):
        cfg = self.toolkit()
        cfg["passos"][0]["agente"] = False
        agentes = self.gerar(**cfg)
        self.assertNotIn("batch-job", agentes)
        self.assertNotIn("batch-job", agentes["sa-desenvolvedor"]["subagentes"])
        self.assertIn("`tarefa de job` (arquivos `**/*JobConfig.java`) → carregue a skill `batch` e faça o passo por ela", agentes["sa-desenvolvedor"]["prompt"])

    def test_toolkit_invalido_e_recusado(self):
        skill = lambda caminho, **passo: {"caminho": caminho, "papeis": ["desenvolvedor"],
                                          "passo": {"passo": "sa-desenvolver.codificar.tarefa", "para": "p", **passo}}
        ruins = [{"agentes": [{"nome": "sa-job", "descricao": "j", "prompt": "agentes/job.md"}], "skills": [skill("skills/batch/SKILL.md", agente="sa-job")]},
                 {"skills": [skill("../fora/SKILL.md")]},
                 {"skills": [skill("skills/batch/SKILL.md", agente="batch-job")], "agentes": [{"nome": "batch-job", "descricao": "j", "prompt": "/etc/passwd"}]},
                 {"skills": [skill("skills/batch/SKILL.md", passo="sa-desenvolver.codificar.nada")]},
                 {"skills": [skill("skills/batch/SKILL.md", passo="sa-desenvolver.codificar.validar")]},  # sem desvio
                 {"skills": [{"caminho": "skills/batch/SKILL.md", "papeis": ["desenvolvedor"], "passo": {"para": "p"}}]},  # sem id
                 {"skills": [{"caminho": "skills/batch/SKILL.md", "papeis": ["desenvolvedor"]}]}]  # skill sem `passo`
        for mudar in ruins:
            cfg = self.toolkit(**mudar)
            cfg["passos"][0]["skill"] = mudar["skills"][0]["caminho"]
            with self.assertRaises(ValueError, msg=mudar):
                g.gerar(self.projeto, {**self.cfg, **cfg}, REPO)

    def test_toolkit_nao_instalado_e_recusado(self):
        cfg = {**self.cfg, "toolkits": {"fantasma": {"pasta": "~/.sabia/toolkits/fantasma", "versao": "1.0.0"}}}
        with self.assertRaisesRegex(ValueError, "toolkit fantasma: ~/.sabia/toolkits/fantasma/toolkit.json não encontrado"):
            g.gerar(self.projeto, cfg, REPO)
        with self.assertRaisesRegex(ValueError, "sem entrada em `toolkits`"):
            g.gerar(self.projeto, {**self.cfg, "passos": [{"toolkit": "fantasma", "skill": "skills/x/SKILL.md"}]}, REPO)

    def test_tipo_com_skill_de_toolkit(self):
        agentes = self.gerar(toolkits=self.casa())
        e, pasta = agentes["sa-especificador"], "~/.sabia/toolkits/casa"
        hf = f"HF → carregue a skill `casa` e siga `{pasta}/fluxo/fluxo-hf.md` com o padrão `{pasta}/padrao/padrao-hf.md`"
        self.assertIn(f"Tipos com skill de toolkit (⇢ no passo de desvio do tipo): no passo `sa-prd.prd.escrever`, {hf}; no passo"
                      f" `sa-especificar.elm.editar`, {hf}; no passo `sa-especificar.reuniao.escrever`, ATA → carregue a skill `casa` e siga"
                      f" `{pasta}/fluxo/fluxo-reuniao.md`.", e["prompt"])
        self.assertEqual([r for r in g.kiro(e)["resources"] if "casa" in r], [f"skill://{pasta}/skills/casa/SKILL.md"])
        self.assertIn(f"{pasta}/fluxo/fluxo-hf.md", g.opencode(e))
        self.assertNotIn("Tipos com skill de toolkit", agentes["sa-desenvolvedor"]["prompt"])
        self.assertIn("`EX1` (HF) IMPORTANTE — Toda HF cita o campo de origem (toolkit `casa`)", agentes["sa-revisor"]["prompt"])
        self.assertEqual(g.gerar.tabela_tipos, [
            "| Tipo | Skill | Fluxo e padrão | Toolkit | Passo de desvio |", "|---|---|---|---|---|",
            f"| `HF` | `{pasta}/skills/casa/SKILL.md` | `{pasta}/fluxo/fluxo-hf.md` com o padrão `{pasta}/padrao/padrao-hf.md` | `casa` 1.0.0 | `sa-prd.prd.escrever`, `sa-especificar.elm.editar` |",
            f"| `ATA` | `{pasta}/skills/casa/SKILL.md` | `{pasta}/fluxo/fluxo-reuniao.md` | `casa` 1.0.0 | `sa-especificar.reuniao.escrever` |", "",
            "| Item de rubrica | Tipo | Severidade | Verificação | Toolkit |", "|---|---|---|---|---|",
            "| `EX1` | HF | IMPORTANTE | Toda HF cita o campo de origem | `casa` 1.0.0 |"])
        # só a skill, com as references dentro
        e = self.gerar(toolkits=self.casa(HF={"skill": "skills/casa/SKILL.md"}))["sa-especificador"]
        self.assertIn("no passo `sa-prd.prd.escrever`, HF → carregue a skill `casa` e siga as references dela", e["prompt"])
        # a skill do tipo também no agentes.json: uma vez só
        fonte = f"skill://{pasta}/skills/casa/SKILL.md"
        e = self.gerar(toolkits=self.casa(), agentes={"sa-especificador": {"skills": [fonte]}})["sa-especificador"]
        self.assertEqual([x for x in g.kiro(e)["resources"] if x.endswith("/casa/SKILL.md")], [fonte])

    def test_papeis_mapeiam_um_para_um(self):
        # produto → sa-especificador
        self.assertIn("HF → carregue a skill `casa`", self.gerar(toolkits=self.casa(papeis=["produto"]))["sa-especificador"]["prompt"])
        with self.assertRaisesRegex(ValueError, "não traz o papel especificador ou produto em papeis"):
            g.gerar(self.projeto, {**self.cfg, "toolkits": self.casa(papeis=["desenvolvedor", "orquestrador"])}, REPO)
        # steering pelos papeis; verificacao ao sa-verificador
        agentes = self.gerar(toolkits=self.casa(extra={"verificacao": "Suba com docker compose e chame a API.",
                                                       "steering": [{"caminho": "steering/java.md", "papeis": ["revisor", "produto", "orquestrador"]}]}))
        linha = "Steering do toolkit `casa`: leia `~/.sabia/toolkits/casa/steering/java.md` antes de começar."
        self.assertEqual({n for n, a in agentes.items() if linha in a["prompt"]}, {"sa-revisor", "sa-especificador"})
        self.assertIn("Verificação de aceite do toolkit `casa`: Suba com docker compose e chame a API.", agentes["sa-verificador"]["prompt"])
        self.assertNotIn("Verificação de aceite do toolkit", agentes["sa-revisor"]["prompt"])

    def test_toolkits_em_colisao_ou_tipo_que_nao_desvia_sao_recusados(self):
        sk = {"skill": "skills/casa/SKILL.md", "fluxo": "fluxo/fluxo-hf.md"}
        casos = [(lambda: {**self.casa(), **self.casa("outro", rubricas=[], HF={**sk, "skill": "skills/outro/SKILL.md"})}, "tipo HF já é de toolkit casa"),
                 (lambda: self.casa(rubricas=[{"id": "EX1", "verificacao": "a", "severidade": "BLOQUEANTE"}, {"id": "EX1", "verificacao": "b", "severidade": "BLOQUEANTE"}]),
                  "rubrica EX1 já é de toolkit casa"),
                 (lambda: self.casa(GL=sk), "tipo GL → skills/casa/SKILL.md: use {skill, fluxo, padrao} (fluxo e padrao opcionais); o tipo tem de ser desviável e não pendente"),
                 (lambda: self.casa(CT=sk), "tipo CT: a skill skills/casa/SKILL.md não traz o papel verificador em papeis (dono do passo de desvio sa-verificar.verificar.casos)"),
                 (lambda: self.casa(HF="casa.hf"), "tipo HF → casa.hf: use {skill, fluxo, padrao}"),
                 (lambda: self.casa(HF={**sk, "fluxo": "fluxo/nao.md"}), "o fluxo arquivos da pasta do toolkit"),
                 (lambda: self.casa(HF={**sk, "padrao": "padrao/nao.md"}), "o fluxo e o padrao arquivos da pasta do toolkit"),
                 (lambda: self.casa(HF={**sk, "skill": "skills/outra/SKILL.md"}), "a skill uma das skills do toolkit"),
                 (lambda: self.casa(HF={**sk, "fluxo": "../fora.md"}), "caminho fora da pasta do toolkit"),
                 (lambda: self.casa(rubricas=[{"id": "EX1", "tipo": "HF"}]), "rubrica EX1: precisa de id, verificacao e severidade"),
                 (lambda: self.casa(extra={"steering": [{"caminho": "steering/nao.md", "papeis": ["revisor"]}]}), "steering steering/nao.md não existe")]
        for toolkits, erro in casos:
            with self.assertRaisesRegex(ValueError, re.escape(erro), msg=erro):
                g.gerar(self.projeto, {**self.cfg, "toolkits": toolkits()}, REPO)
            shutil.rmtree(self.home / ".sabia")

    def test_tipo_pendente_no_catalogo_e_recusado(self):
        fw = Path(self.tmp.name) / "fw"
        (fw / "fluxo").mkdir(parents=True)
        (fw / "fluxo/tipos.json").write_text(json.dumps({"tipos": {"HF": {"desviavel": ["sa-prd.prd.escrever"], "pendente": True}}}))
        with self.assertRaisesRegex(ValueError, re.escape("o tipo tem de ser desviável e não pendente")):
            g.fonte_toolkits(self.projeto, {"toolkits": self.casa(HF={"skill": "skills/casa/SKILL.md"})}, fw, {})


class Fluxos(Base):
    PF = "fluxo/sa-desenvolver/codificar/passos/validar.md"

    def test_sem_override_nao_ha_delta_e_todo_agente_tem_a_chamada(self):
        for nome, a in self.gerar().items():
            self.assertNotIn("O que este projeto mudou", a["prompt"], nome)
            self.assertIn("chama **em linha**", a["prompt"], nome)

    def test_delta_vai_so_para_o_dono_do_fluxo(self):
        self.escrever({
            ".sabia/" + self.PF: f'---\n{{"base": "{self.base(self.PF)}"}}\n---\n## Entrada\n',
            ".sabia/fluxo/sa-desenvolver/codificar/codificar.md": '---\n{"inserir": [{"id": "lint-extra", "depois": "validar"}]}\n---\n',
            ".sabia/fluxo/sa-desenvolver/codificar/passos/lint-extra.md": "---\n{}\n---\n## Entrada\n",
            ".sabia/padrao/sa-desenvolver/pr.md": f'---\n{{"base": "{self.base("padrao/sa-desenvolver/pr.md")}"}}\n---\nMR\n'})
        agentes = self.gerar()
        d = agentes["sa-desenvolvedor"]["prompt"]
        self.assertIn("Fluxo `sa-desenvolver.codificar`:", d)
        self.assertIn("- passo `validar`: leia `.sabia/fluxo/sa-desenvolver/codificar/passos/validar.md` (no lugar do da skill)", d)
        self.assertIn("- passo `lint-extra` (inserido depois de `validar`)", d)
        for nome in NOMES[1:]:  # só o dono leva o delta do fluxo; o padrão vai a todos
            self.assertNotIn("Fluxo `sa-desenvolver.codificar`", agentes[nome]["prompt"], nome)
            self.assertIn("- padrão `sa-desenvolver/pr.md`", agentes[nome]["prompt"], nome)

    def test_inserir_encadeado(self):
        r = "fluxo/sa-planejamento/review"
        self.escrever({f".sabia/{r}/review.md": '---\n{"inserir": [{"id": "b", "depois": "a"}, {"id": "a", "depois": "rito"}]}\n---\n',
                       f".sabia/{r}/passos/a.md": "x", f".sabia/{r}/passos/b.md": "x"})
        e = self.gerar()["sa-especificador"]["prompt"]
        for t in ("- passo `a` (inserido depois de `rito`)", "- passo `b` (inserido depois de `a`)"):
            self.assertIn(t, e)

    def test_override_invalido_e_recusado(self):
        c = ".sabia/fluxo/sa-desenvolver/codificar"
        rv = ".sabia/fluxo/sa-planejamento/review"
        ruins = [
            {f"{c}/passos/nao-existe.md": "x"},                                          # órfão
            {".sabia/fluxo/sa-nada/x/passos/y.md": "x"},                                 # fluxo que não existe
            {".sabia/" + self.PF: "---\n{}\n---\n## Entrada\n"},                         # cópia sem base
            {f"{c}/codificar.md": '---\n{"passos": []}\n---\n'},                         # chave proibida
            {f"{c}/codificar.md": '---\n{"remover": ["verificar"]}\n---\n'},              # trava
            {f"{c}/codificar.md": '---\n{"liberar": ["backpressure"]}\n---\n'},
            {f"{c}/codificar.md": '---\n{"inserir": [{"id": "z", "depois": "validar"}]}\n---\n'},  # sem arquivo
            {".sabia/padrao/sa-desenvolver/nao-existe.md": "x"},
            {".sabia/padrao/sa-desenvolver/pr.md": "MR sem base"},
            {f"{c}/passos/validar.txt": "x"},                                            # não é .md
            {f"{rv}/review.md": '---\n{"inserir": [{"id": "a", "depois": "rito"}, {"id": "a", "depois": "rito"}]}\n---\n', f"{rv}/passos/a.md": "x"},
            {f"{rv}/review.md": '---\n{"inserir": [{"id": "a", "depois": "b"}, {"id": "b", "depois": "a"}]}\n---\n',
             f"{rv}/passos/a.md": "x", f"{rv}/passos/b.md": "x"},                       # ciclo
            {f"{rv}/review.md": '---\n{"inserir": [{"id": "../x", "depois": "rito"}]}\n---\n'},
            {f"{rv}/review.md": '---\n{"inserir": [{"id": "grafo", "depois": "rito"}]}\n---\n', f"{rv}/passos/grafo.md": "x"},
            {f"{c}/codificar.md": '---\n{"inserir": [1,]}\n---\n'},                      # JSON inválido
            {".sabia/" + self.PF: f'---\n{{"base": "{self.base(self.PF)}"}}\n---\n## Travas\n\n- nenhuma\n'},
        ]
        for arquivos in ruins:
            for d in (".sabia/fluxo", ".sabia/padrao"):
                shutil.rmtree(self.projeto / d, ignore_errors=True)
            self.escrever(arquivos)
            with self.assertRaises(ValueError, msg=arquivos):
                g.gerar(self.projeto, self.cfg, REPO)

    def test_base_velha_so_avisa(self):
        self.escrever({".sabia/" + self.PF: '---\n{"base": "000000000000"}\n---\n## Entrada\n'})
        self.gerar(sabia="0.0.1")
        avisos = "\n".join(g.gerar.avisos)
        self.assertIn("a base mudou desde a cópia", avisos)
        self.assertIn("configurado com o Sabiá 0.0.1", avisos)

    def test_padrao_do_projeto_so_sobre_o_do_sabia(self):
        self.escrever({".sabia/padrao/casa/padrao-hf.md": '---\n{"base": "000000000000"}\n---\nHF\n'})
        with self.assertRaisesRegex(ValueError, re.escape(".sabia/padrao/casa/padrao-hf.md: não é padrão do Sabiá")):
            g.gerar(self.projeto, {**self.cfg, "toolkits": self.casa()}, REPO)

    def test_framework_sem_fluxo_recusa(self):
        with self.assertRaisesRegex(ValueError, "não tem os fluxos"):
            g.gerar(self.projeto, self.cfg, self.home / ".sabia/framework")


class Main(Base):
    def config(self, **mudar):
        conf = self.projeto / ".sabia/config/agentes.json"
        conf.parent.mkdir(parents=True, exist_ok=True)
        conf.write_text(json.dumps({**self.cfg, **mudar}))

    def main(self, *args):
        out = io.StringIO()
        with contextlib.redirect_stdout(out), contextlib.redirect_stderr(io.StringIO()):
            r = g.main(["--projeto", str(self.projeto), "--framework", str(REPO), *args])
        return r, out.getvalue()

    def test_grava_nos_dois_alvos_e_diff_nao_grava(self):
        self.config(**self.toolkit())
        self.assertEqual(self.main("--diff")[0], 0)
        self.assertEqual(self.main()[0], 0)
        self.assertFalse((self.projeto / ".kiro/agents").exists())
        r, out = self.main("--gravar")
        self.assertEqual(r, 0)
        self.assertNotIn("aviso:", out)
        kiro = {f.stem for f in (self.projeto / ".kiro/agents").glob("*.json")}
        self.assertEqual(kiro, {f.stem for f in (self.projeto / ".opencode/agents").glob("*.md")})
        self.assertEqual(kiro, set(NOMES) | {"batch-job", "batch-step"})
        self.assertIn("| **sa-desenvolvedor** |", out)

    def test_so_opencode_sem_kiro_instalado(self):
        shutil.rmtree(self.home / ".kiro")
        self.config(alvos=["opencode"])
        self.assertEqual(self.main("--gravar")[0], 0)
        self.assertEqual(len(list((self.projeto / ".opencode/agents").glob("sa-*.md"))), 5)
        self.assertFalse((self.projeto / ".kiro/agents").exists())
        self.assertEqual(self.main("--alvo", "cursor")[0], 1)

    def test_agentes_json_invalido_sai_sem_traceback(self):
        (self.projeto / ".sabia/config").mkdir(parents=True)
        (self.projeto / ".sabia/config/agentes.json").write_text("{ruim")
        self.assertEqual(self.main()[0], 1)
        self.config(papeis={})
        self.assertEqual(self.main()[0], 1)

    def test_gerador_fora_do_repo_acha_o_mestre_pelo_framework(self):
        copia = Path(self.tmp.name) / "instalado/sa-setup"
        shutil.copytree(Path(__file__).resolve().parents[1], copia, ignore=shutil.ignore_patterns("__pycache__"))
        fw = Path(self.tmp.name) / "fw"
        for d in ("fluxo", "padrao"):
            shutil.copytree(REPO / d, fw / d)
        pf = "fluxo/sa-desenvolver/codificar/passos/validar.md"
        self.escrever({".sabia/" + pf: f'---\n{{"base": "{self.base(pf)}"}}\n---\n## Entrada\n'})
        self.config(alvos=["opencode"])
        r = subprocess.run([sys.executable, str(copia / "scripts/gerar_agentes.py"), "--projeto", str(self.projeto),
                            "--framework", str(fw), "--gravar"], capture_output=True, text=True, env={**os.environ, "HOME": str(self.home)})
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn("- passo `validar`: leia", (self.projeto / ".opencode/agents/sa-desenvolvedor.md").read_text())

    def test_base_pela_linha_de_comando(self):
        for arg, rel in (("sa-desenvolver.codificar.validar", "fluxo/sa-desenvolver/codificar/passos/validar.md"),
                         ("sa-desenvolver/pr.md", "padrao/sa-desenvolver/pr.md"),
                         ("sa-desenvolver.codificar.entrada", "fluxo/entrada.md")):  # passo compartilhado: a base é a de fluxo/entrada.md
            r, out = self.main("--base", arg)
            self.assertEqual((r, out.strip()), (0, self.base(rel)), arg)
        self.assertEqual(self.main("--base", "sa-desenvolver.codificar.nada")[0], 1)


class SabiaMd(unittest.TestCase):
    def test_sabia_md_montado_do_arquivo_antigo_e_apontado(self):
        modelo = (g.ASSETS.parent / "steering" / "sabia.md").read_text(encoding="utf-8")
        with tempfile.TemporaryDirectory() as d:
            p = Path(d)
            (p / ".sabia").mkdir()
            f = p / ".sabia" / "sabia.md"
            f.write_text(modelo, encoding="utf-8")
            self.assertEqual(g.conferir_sabia_md(p), [])
            f.write_text(re.sub(r"^\| Telas \|.*\n", "| Protótipo | x |\n", modelo, flags=re.M), encoding="utf-8")
            falta, sobra = g.conferir_sabia_md(p)
            self.assertIn("sem estas linhas do modelo (assets/steering/sabia.md): Especificação › Telas;", falta)
            self.assertIn("com linhas que não estão no modelo (assets/steering/sabia.md): Especificação › Protótipo;", sobra)
            f.write_text("# notas da pessoa\n\n## Projeto\n", encoding="utf-8")
            self.assertEqual(g.conferir_sabia_md(p), [])


if __name__ == "__main__":
    unittest.main()
