"""uv run --no-project python -m unittest test_gerar_agentes   (nesta pasta)"""
import json
import os
import re
import tempfile
import unittest
from fnmatch import fnmatchcase
from pathlib import Path

import gerar_agentes as g

BASE = json.loads((g.ASSETS / "papeis.json").read_text(encoding="utf-8"))
PAPEIS = BASE["papeis"]


def regras(a, cap, efeito):
    return [m for r in a["permissions"]["rules"] if r["capability"] == cap and r["effect"] == efeito for m in r.get("match", [])]


def efeito(a, cap, alvo):
    """Como o V3 decide: entre as regras com um `match` que pega o alvo e nenhum `exclude` que o pegue, vence a mais
    restritiva; sem regra, pergunta. `*` do fnmatch atravessa `/` (como o `like` do Cedar)."""
    pega = lambda padroes: any(fnmatchcase(alvo, p.removeprefix("./")) for p in padroes)
    efeitos = {r["effect"] for r in a["permissions"]["rules"]
               if r["capability"] == cap and pega(r.get("match", ["*"])) and not pega(r.get("exclude", []))}
    return next((e for e in ("deny", "ask", "allow") if e in efeitos), "ask")


class Gerar(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        raiz = Path(self.tmp.name)
        self.home, self.projeto = raiz / "home", raiz / "projeto"
        for s in {s for p in PAPEIS.values() for s in p["skills"]}:
            (self.home / "power/skills" / s).mkdir(parents=True)
            (self.home / "power/skills" / s / "SKILL.md").write_text("x")
        (self.projeto / ".sabia").mkdir(parents=True)
        (self.projeto / ".sabia/sabia.md").write_text("x")
        self.velho_home, os.environ["HOME"] = os.environ.get("HOME"), str(self.home)
        self.cfg = {"power": "~/power", "produto": ".sabia/planejamento", "glossario": "docs/glossario.md", "adr": "docs/adr",
                    "base": "develop", "bundle": "docs/elm/pa", "massa": None, "elm": True, "push_pr_no_loop": True,
                    "http_sh": True, "comandos": {"build": ["mvn test*"], "verificacao": ["mvn spring-boot:run*"]}}

    def tearDown(self):
        os.environ["HOME"] = self.velho_home
        self.tmp.cleanup()

    def gerar(self, **mudar):
        agentes = g.gerar(self.projeto, {**self.cfg, **mudar})
        self.assertEqual([e for a in agentes.values() for e in g.problemas(a, self.projeto)], [])
        return {k.removeprefix("sa-").removesuffix(".json"): a for k, a in agentes.items()}

    def test_sete_agentes_so_v3(self):
        agentes = self.gerar()
        self.assertEqual(sorted(agentes), sorted(PAPEIS))
        for nome, a in agentes.items():
            self.assertEqual(a["name"], f"sa-{nome}")
            self.assertNotIn("allowedTools", a)
            self.assertNotIn("policies", a["permissions"])
            self.assertEqual(set(a.get("toolsSettings", {})) - {"subagent"}, set())
            self.assertNotIn("{{", json.dumps(a))
            self.assertNotIn("V2", a["prompt"])

    def test_harness_ninguem_escreve(self):
        for nome, a in self.gerar().items():
            for alvo in (".kiro/agents/sa-produto.json", ".sabia/config/agentes.json", ".sabia/sabia.md", ".sabia/verificar.sh",
                         ".sabia/http.sh", ".kiro/steering/sabia.md", ".claude/settings.json", "opencode.json", "AGENTS.md",
                         ".git/config", ".sabia/local/wt/ft-031/.kiro/agents/x.json",
                         ".sabia/local/wt/ft-031/.sabia/planejamento/backlog.md"):
                self.assertNotEqual(efeito(a, "fs_write", alvo), "allow", (nome, alvo))

    def test_escrita_no_projeto_e_registros_por_papel(self):
        agentes = self.gerar()
        dono = {"backlog.md": {"produto", "especificador", "codificador", "orquestrador"},
                "sprints/2026/sprint-03.md": {"produto", "especificador", "codificador", "orquestrador"},
                "epicos/ep-03-x/prd.md": {"produto", "especificador"}}
        for nome, a in agentes.items():
            for reg, quem in dono.items():
                self.assertEqual(efeito(a, "fs_write", f".sabia/planejamento/{reg}"),
                                 "allow" if nome in quem else "ask" if nome == "pesquisador" else "deny", (nome, reg))
            if nome != "pesquisador":
                self.assertEqual(efeito(a, "fs_write", "src/main/App.java"), "allow", nome)
                self.assertEqual(efeito(a, "fs_write", ".kiro/specs/ft-031-x/status.md"), "allow", nome)
                self.assertIn("sh .sabia/verificar.sh", regras(a, "shell", "allow"), nome)

    def test_pesquisador_sem_escrita(self):
        p = self.gerar()["pesquisador"]
        self.assertNotIn("write", p["tools"])
        self.assertEqual(regras(p, "fs_write", "allow"), [])
        self.assertNotIn("git commit *", regras(p, "shell", "allow"))
        self.assertNotIn("sh .sabia/verificar.sh", regras(p, "shell", "allow"))

    def test_especificador_separado_do_produto(self):
        agentes = self.gerar()
        e, p = agentes["especificador"], agentes["produto"]
        for s in ("sa-especificar", "sa-prd", "sa-fatiar", "sa-entrevistar"):
            self.assertTrue(any(r.endswith(f"/{s}/SKILL.md") for r in e["resources"]), s)
        for s in ("sa-especificar", "sa-prd", "sa-fatiar"):
            self.assertFalse(any(r.endswith(f"/{s}/SKILL.md") for r in p["resources"]), s)
        self.assertTrue(any(r.endswith("/sa-entrevistar/SKILL.md") for r in p["resources"]))
        self.assertEqual(e["toolsSettings"]["subagent"]["availableAgents"], ["sa-pesquisador", "sa-revisor"])
        self.assertEqual(efeito(e, "shell", "git push origin feature/x"), "deny")
        self.assertIn("sabia/elm/elm_publicar_req", regras(e, "power", "ask"))
        self.assertIn("sabia/gitlabpr/gitlab_obter_mr", regras(e, "power", "deny"))

    def test_comentar_e_anexar_na_propria_tarefa(self):
        agentes = self.gerar()
        for nome in ("produto", "especificador", "codificador", "revisor", "verificador", "orquestrador"):
            for t in ("elm_comentar", "elm_anexo", "elm_transicao", "elm_lancar_horas"):
                self.assertIn(f"sabia/elm/{t}", regras(agentes[nome], "power", "ask"), nome)
                self.assertIn(f"@elm/{t}", agentes[nome]["tools"])
        self.assertIn("sabia/elm/elm_ligar", regras(agentes["codificador"], "power", "ask"))

    def test_pesquisador_so_le(self):
        p = self.gerar()["pesquisador"]
        self.assertEqual(regras(p, "power", "ask"), [])
        self.assertIn("sabia/elm/elm_comentar", regras(p, "power", "deny"))
        self.assertIn("sabia/gitlabpr/gitlab_criar_mr", regras(p, "power", "deny"))
        self.assertIn("*git push*", regras(p, "shell", "deny"))
        self.assertEqual(regras(p, "power", "allow"), [f"sabia/{t}" for t in g.expandir(["+elm-local"],
                                                                                      json.loads((g.ASSETS / "papeis.json").read_text())["grupos"])])

    def test_gitlab_so_em_quem_lida_com_pr(self):
        agentes = self.gerar()
        for nome in ("pesquisador", "verificador", "especificador"):
            self.assertFalse([t for t in agentes[nome]["tools"] if t.startswith("@gitlabpr/")], nome)
            self.assertIn("sabia/gitlabpr/gitlab_obter_mr", regras(agentes[nome], "power", "deny"), nome)
        for nome in ("produto", "codificador", "revisor", "orquestrador"):
            self.assertIn("sabia/gitlabpr/gitlab_obter_mr", regras(agentes[nome], "power", "allow"), nome)
        self.assertIn("sabia/gitlabpr/gitlab_criar_mr", regras(agentes["produto"], "power", "deny"))

    def test_push_da_branch_nomeada_e_merge_so_no_codificador(self):
        agentes = self.gerar()
        for nome in ("codificador", "revisor", "verificador", "orquestrador"):
            self.assertIn("git push *", regras(agentes[nome], "shell", "ask"))
            self.assertEqual(efeito(agentes[nome], "shell", "git push -u origin feature/ft-031-x"), "ask", nome)
            for cmd in ("git push", "git push origin", "cd .sabia/local/wt/ft-031 && git push", "git push origin HEAD",
                        "git push -u origin HEAD:feature/ft-031-x", "git push origin @", "git push origin ft-031:develop",
                        "git push origin refs/heads/develop", "git push -f origin ft-031"):
                self.assertEqual(efeito(agentes[nome], "shell", cmd), "deny", (nome, cmd))
        for nome, a in agentes.items():
            self.assertIn("sabia/gitlabpr/gitlab_mesclar_mr", regras(a, "power", "ask" if nome == "codificador" else "deny"), nome)

    def test_registro_de_situacao_na_base(self):
        """Codificador e orquestrador gravam a situação da fatia (backlog e sprint) na base e dão o push com pergunta."""
        agentes = self.gerar()
        for nome in ("codificador", "orquestrador"):
            a = agentes[nome]
            for p in ("backlog.md", "sprints/2026/sprint-03.md"):
                self.assertEqual(efeito(a, "fs_write", f".sabia/planejamento/{p}"), "allow", (nome, p))
            self.assertEqual(efeito(a, "fs_write", ".sabia/planejamento/epicos/ep-03-x/prd.md"), "deny", nome)
            self.assertNotEqual(efeito(a, "fs_write", ".sabia/local/wt/ft-031/.sabia/planejamento/backlog.md"), "allow", nome)
            self.assertEqual(efeito(a, "shell", "git push origin develop"), "ask", nome)
            self.assertIn("git reset --keep origin/*", regras(a, "shell", "ask"), nome)
            self.assertEqual(efeito(a, "shell", "git reset --keep origin/develop --hard"), "deny", nome)
        for nome in ("revisor", "verificador"):
            self.assertEqual(efeito(agentes[nome], "shell", "git push origin develop"), "deny", nome)
            self.assertNotIn("git reset --keep origin/*", regras(agentes[nome], "shell", "ask"), nome)
        self.assertEqual(efeito(agentes["produto"], "shell", "git push origin develop"), "deny")

    def test_tool_do_elm_fora_do_papel_e_negada(self):
        catalogo = BASE["mcp_do_power"]["elm"]
        server = Path(__file__).resolve().parents[4] / "mcp-elm/mcp_elm/server.py"
        if server.exists():  # tool do mcp-elm fora do catálogo escaparia das regras dos agentes
            self.assertEqual(sorted(re.findall(r"^def (elm_\w+)\(", server.read_text(encoding="utf-8"), re.M)), sorted(catalogo))
        for nome, a in self.gerar().items():
            self.assertIn("sabia/elm/elm_backlog", regras(a, "power", "deny"), nome)

    def test_sem_elm(self):
        for a in self.gerar(elm=False).values():
            self.assertFalse([t for t in a["tools"] if t.startswith("@elm/")])
            self.assertEqual([m for m in regras(a, "power", "deny") if m.startswith("sabia/elm/")], ["sabia/elm/*"])

    def test_loop_sem_push_nem_pr(self):
        o = self.gerar(push_pr_no_loop=False)["orquestrador"]
        self.assertIn("*git push*", regras(o, "shell", "deny"))
        self.assertNotIn("git push *", regras(o, "shell", "ask"))
        self.assertIn("sabia/gitlabpr/gitlab_criar_mr", regras(o, "power", "deny"))

    def test_sem_glossario_nem_bundle(self):
        agentes = self.gerar(glossario=None, bundle=None)
        self.assertIn("glossário (`não há`)", agentes["produto"]["prompt"])
        self.assertFalse([m for m in regras(agentes["codificador"], "fs_read", "deny") if "elm/pa" in m])

    def test_extras_do_projeto(self):
        cfg = {"agentes": {"sa-codificador": {"skills": ["skill://.kiro/skills/java/SKILL.md"], "mcp": ["banco/consultar"],
                                           "subagentes": [{"nome": "dba", "para": "consultas"}], "modelo": "m1"}}}
        (self.projeto / ".kiro/skills/java").mkdir(parents=True)
        (self.projeto / ".kiro/skills/java/SKILL.md").write_text("x")
        c = self.gerar(**cfg)["codificador"]
        self.assertTrue(c["includeMcpJson"])
        self.assertIn("@banco/consultar", c["tools"])
        self.assertIn("banco/consultar", regras(c, "mcp", "allow"))
        self.assertIn("dba", c["toolsSettings"]["subagent"]["availableAgents"])
        self.assertIn("Skills do projeto ligadas a você: `java`", c["prompt"])
        self.assertIn("`dba` (consultas)", c["prompt"])
        self.assertIn("mvn test*", regras(c, "shell", "allow"))
        self.assertIn("sh .sabia/http.sh *", regras(c, "shell", "allow"))
        self.assertIn("sh .sabia/verificar.sh", regras(c, "shell", "allow"))
        self.assertEqual(c["model"], "m1")

    def test_resumo_mostra_o_que_cada_agente_recebeu(self):
        (self.projeto / ".kiro/skills/java").mkdir(parents=True)
        (self.projeto / ".kiro/skills/java/SKILL.md").write_text("x")
        cfg = {**self.cfg, "agentes": {"sa-codificador": {"skills": ["skill://.kiro/skills/java/SKILL.md"],
                                                           "mcp": ["banco/consultar"]}}}
        linhas = {l.split("|")[1].strip(): l for l in g.resumo(g.gerar(self.projeto, cfg), cfg).splitlines()[2:]}
        self.assertIn("`java`", linhas["**sa-codificador**"])
        self.assertIn("`banco/consultar`", linhas["**sa-codificador**"])
        self.assertIn("🟢 só o bundle local", linhas["**sa-pesquisador**"])
        self.assertIn("| ➖ |", linhas["**sa-pesquisador**"])
        self.assertIn("🟢 consulta · 🟡 abrir e mesclar PR", linhas["**sa-codificador**"])
        self.assertIn("🟡 pergunta", linhas["**sa-codificador**"])
        self.assertTrue(linhas["**sa-produto**"].rstrip(" |").endswith("🔴 negado"))

    def toolkit(self, **mudar):
        """Toolkit fictício em ~/.sabia/toolkits/batch-alfa: passo do codificador com o agente job, que chama o step."""
        pasta = self.home / ".sabia/toolkits/batch-alfa"
        for f in ("skills/batch/SKILL.md", "skills/teste/SKILL.md", "agentes/job.md", "agentes/step.md"):
            (pasta / f).parent.mkdir(parents=True, exist_ok=True)
            (pasta / f).write_text("x {{BASE}}" if f.startswith("agentes") else "x")
        man = {"nome": "batch-alfa", "versao": "1.0.0",
               "skills": [{"caminho": "skills/batch/SKILL.md", "papeis": ["codificador"],
                           "passo": {"papel": "codificador", "para": "tarefa de job", "agente": "batch-job"}}],
               "agentes": [{"nome": "batch-job", "descricao": "job", "prompt": "agentes/job.md", "skills": ["skills/batch/SKILL.md"],
                            "subagentes": ["batch-step"]},
                           {"nome": "batch-step", "descricao": "step", "prompt": "agentes/step.md", "skills": ["skills/teste/SKILL.md"]}]}
        man.update(mudar)
        (pasta / "toolkit.json").write_text(json.dumps(man))
        return {"toolkits": {"batch-alfa": {"pasta": "~/.sabia/toolkits/batch-alfa", "versao": "1.0.0", "sha": "abc"}},
                "passos": [{"toolkit": "batch-alfa", "skill": "skills/batch/SKILL.md", "agente": True}]}

    def test_passo_com_agente(self):
        agentes = self.gerar(**self.toolkit())
        c, job, step = agentes["codificador"], agentes["batch-job"], agentes["batch-step"]
        self.assertIn("skill://~/.sabia/toolkits/batch-alfa/skills/batch/SKILL.md", c["resources"])
        self.assertIn("batch-job", c["toolsSettings"]["subagent"]["availableAgents"])
        self.assertIn("`batch-job` (tarefa de job)", c["prompt"])
        self.assertEqual(job["toolsSettings"]["subagent"]["availableAgents"], ["batch-step"])
        self.assertEqual(job["prompt"], "x develop\n")
        self.assertNotIn("welcomeMessage", job)
        self.assertFalse([r for r in job["resources"] if "/sa-" in r])
        for a in (job, step):  # as regras do papel dono, nunca mais que isso
            self.assertEqual([r for r in a["permissions"]["rules"] if r["capability"] != "subagent"],
                             [r for r in c["permissions"]["rules"] if r["capability"] != "subagent"])
        self.assertNotIn("toolsSettings", step)
        self.assertIn("~/.sabia/toolkits/**", regras(c, "fs_read", "allow"))

    def test_passo_sem_agente(self):
        cfg = self.toolkit()
        cfg["passos"][0]["agente"] = False
        agentes = self.gerar(**cfg)
        self.assertNotIn("batch-job", agentes)
        self.assertIn("skill://~/.sabia/toolkits/batch-alfa/skills/batch/SKILL.md", agentes["codificador"]["resources"])
        self.assertNotIn("batch-job", agentes["codificador"].get("toolsSettings", {}).get("subagent", {}).get("availableAgents", []))

    def test_toolkit_invalido_e_recusado(self):
        skill = lambda caminho, **passo: {"caminho": caminho, "papeis": ["codificador"], "passo": {"papel": "codificador", "para": "p", **passo}}
        ruins = [{"agentes": [{"nome": "sa-job", "descricao": "j", "prompt": "agentes/job.md"}],
                  "skills": [skill("skills/batch/SKILL.md", agente="sa-job")]},
                 {"skills": [skill("../fora/SKILL.md")]},
                 {"skills": [skill("skills/batch/SKILL.md", agente="batch-job")],
                  "agentes": [{"nome": "batch-job", "descricao": "j", "prompt": "/etc/passwd"}]},
                 {"skills": [skill("skills/batch/SKILL.md", papel="faxineiro")]},
                 {"skills": [{"caminho": "skills/batch/SKILL.md", "papeis": ["codificador"]}]}]  # skill sem `passo`
        for mudar in ruins:
            cfg = self.toolkit(**mudar)
            cfg["passos"][0]["skill"] = mudar["skills"][0]["caminho"]
            with self.assertRaises(ValueError, msg=mudar):
                g.gerar(self.projeto, {**self.cfg, **cfg})

    def test_chave_sem_prefixo_falha(self):
        with self.assertRaises(ValueError):
            g.gerar(self.projeto, {**self.cfg, "agentes": {"codificador": {}}})

    def test_caminho_ruim_e_apontado(self):
        a = g.gerar(self.projeto, {**self.cfg, "agentes": {"sa-revisor": {"skills": ["skill://.kiro/skills/nao/SKILL.md",
                                                                                     "skill:///abs/SKILL.md"]}}})
        erros = g.problemas(a["sa-revisor.json"], self.projeto)
        self.assertEqual(len(erros), 2)

    def test_main_grava_e_diff_nao(self):
        conf = self.projeto / ".sabia/config/agentes.json"
        conf.parent.mkdir(parents=True)
        conf.write_text(json.dumps(self.cfg))
        self.assertEqual(g.main(["--projeto", str(self.projeto), "--diff"]), 0)
        self.assertFalse((self.projeto / ".kiro/agents").exists())
        self.assertEqual(g.main(["--projeto", str(self.projeto)]), 0)
        self.assertFalse((self.projeto / ".kiro/agents").exists())  # sem --gravar nada é gravado
        self.assertEqual(g.main(["--projeto", str(self.projeto), "--gravar"]), 0)
        self.assertEqual(len(list((self.projeto / ".kiro/agents").glob("sa-*.json"))), 7)


if __name__ == "__main__":
    unittest.main()
