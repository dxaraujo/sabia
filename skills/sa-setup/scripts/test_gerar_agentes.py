"""uv run --no-project python -m unittest test_gerar_agentes   (nesta pasta)"""
import json
import os
import re
import tempfile
import unittest
from fnmatch import fnmatchcase
from pathlib import Path

import gerar_agentes as g

REPO = Path(__file__).resolve().parents[3]  # a fonte do framework (fluxo/, padrao/, plugin.json)

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
            for alvo in (".kiro/agents/sa-produto.json", ".sabia/config/agentes.json", ".sabia/http.sh",
                         ".sabia/fluxo/sa-codificar/codificar/passos/tarefa.md", ".sabia/padrao/sa-codificar/pr.md",
                         ".kiro/steering/sabia.md", "opencode.json", "AGENTS.md",
                         ".git/config", ".sabia/local/wt/ft-031/.kiro/agents/x.json",
                         ".sabia/local/wt/ft-031/.sabia/planejamento/backlog.md"):
                self.assertNotEqual(efeito(a, "fs_write", alvo), "allow", (nome, alvo))
            # o sabia.md é da setup; só o sa-produto grava nele (a seção Regras aprendidas, pela sa-aprender)
            self.assertEqual(efeito(a, "fs_write", ".sabia/sabia.md") == "allow", nome == "produto", nome)

    def test_escrita_no_projeto_e_registros_por_papel(self):
        agentes = self.gerar()
        dono = {"backlog.md": {"produto", "especificador", "desenvolvedor", "orquestrador"},
                "sprints/2026/sprint-03.md": {"produto", "especificador", "desenvolvedor", "orquestrador"},
                "epicos/ep-03-x/prd.md": {"produto", "especificador"}}
        for nome, a in agentes.items():
            for reg, quem in dono.items():
                self.assertEqual(efeito(a, "fs_write", f".sabia/planejamento/{reg}"),
                                 "allow" if nome in quem else "ask" if nome == "pesquisador" else "deny", (nome, reg))
            if nome != "pesquisador":
                self.assertEqual(efeito(a, "fs_write", "src/main/App.java"), "allow", nome)
                self.assertEqual(efeito(a, "fs_write", ".kiro/specs/ft-031-x/status.md"), "allow", nome)
                self.assertEqual(efeito(a, "shell", "mvn -q test"), "allow", nome)  # decisão 2: shell liberado para quem escreve
                self.assertEqual(efeito(a, "shell", "cat .env"), "deny", nome)  # credenciais continuam negadas

    def test_pesquisador_sem_escrita(self):
        p = self.gerar()["pesquisador"]
        self.assertNotIn("write", p["tools"])
        self.assertEqual(regras(p, "fs_write", "allow"), [])
        self.assertNotIn("git commit *", regras(p, "shell", "allow"))
        self.assertNotIn("*", regras(p, "shell", "allow"))

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
        for nome in ("produto", "especificador", "desenvolvedor", "revisor", "verificador", "orquestrador"):
            for t in ("elm_comentar", "elm_anexo", "elm_transicao", "elm_lancar_horas"):
                self.assertIn(f"sabia/elm/{t}", regras(agentes[nome], "power", "ask"), nome)
                self.assertIn(f"@elm/{t}", agentes[nome]["tools"])
        self.assertIn("sabia/elm/elm_ligar", regras(agentes["desenvolvedor"], "power", "ask"))

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
        for nome in ("produto", "desenvolvedor", "revisor", "orquestrador"):
            self.assertIn("sabia/gitlabpr/gitlab_obter_mr", regras(agentes[nome], "power", "allow"), nome)
        self.assertIn("sabia/gitlabpr/gitlab_criar_mr", regras(agentes["produto"], "power", "deny"))

    def test_push_da_branch_nomeada_e_merge_so_no_desenvolvedor(self):
        agentes = self.gerar()
        for nome in ("desenvolvedor", "revisor", "verificador", "orquestrador"):
            self.assertIn("*git push*", regras(agentes[nome], "shell", "ask"))
            self.assertEqual(efeito(agentes[nome], "shell", "git push -u origin feature/ft-031-x"), "ask", nome)
            for cmd in ("git push", "git push origin", "cd .sabia/local/wt/ft-031 && git push", "git push origin HEAD",
                        "git push -u origin HEAD:feature/ft-031-x", "git push origin @", "git push origin ft-031:develop",
                        "git push origin refs/heads/develop", "git push -f origin ft-031"):
                self.assertEqual(efeito(agentes[nome], "shell", cmd), "deny", (nome, cmd))
        for nome, a in agentes.items():
            self.assertIn("sabia/gitlabpr/gitlab_mesclar_mr", regras(a, "power", "ask" if nome == "desenvolvedor" else "deny"), nome)

    def test_registro_de_situacao_na_base(self):
        """Desenvolvedor e orquestrador gravam a situação da fatia (backlog e sprint) na base e dão o push com pergunta."""
        agentes = self.gerar()
        for nome in ("desenvolvedor", "orquestrador"):
            a = agentes[nome]
            for p in ("backlog.md", "sprints/2026/sprint-03.md"):
                self.assertEqual(efeito(a, "fs_write", f".sabia/planejamento/{p}"), "allow", (nome, p))
            self.assertEqual(efeito(a, "fs_write", ".sabia/planejamento/epicos/ep-03-x/prd.md"), "deny", nome)
            self.assertNotEqual(efeito(a, "fs_write", ".sabia/local/wt/ft-031/.sabia/planejamento/backlog.md"), "allow", nome)
            self.assertEqual(efeito(a, "shell", "git push origin develop"), "ask", nome)
            self.assertIn("*git reset --keep origin/*", regras(a, "shell", "ask"), nome)
            self.assertEqual(efeito(a, "shell", "git reset --keep origin/develop --hard"), "deny", nome)
        for nome in ("revisor", "verificador"):
            self.assertEqual(efeito(agentes[nome], "shell", "git push origin develop"), "deny", nome)
            self.assertNotIn("*git reset --keep origin/*", regras(agentes[nome], "shell", "ask"), nome)
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
        self.assertNotIn("*git push*", regras(o, "shell", "ask"))
        self.assertIn("sabia/gitlabpr/gitlab_criar_mr", regras(o, "power", "deny"))

    def test_sem_glossario_nem_bundle(self):
        agentes = self.gerar(glossario=None, bundle=None)
        self.assertIn("glossário (`não há`)", agentes["produto"]["prompt"])
        self.assertFalse([m for m in regras(agentes["desenvolvedor"], "fs_read", "deny") if "elm/pa" in m])

    def test_extras_do_projeto(self):
        cfg = {"agentes": {"sa-desenvolvedor": {"skills": ["skill://.kiro/skills/java/SKILL.md"], "mcp": ["banco/consultar"],
                                           "subagentes": [{"nome": "dba", "para": "consultas"}], "modelo": "m1"}}}
        (self.projeto / ".kiro/skills/java").mkdir(parents=True)
        (self.projeto / ".kiro/skills/java/SKILL.md").write_text("x")
        c = self.gerar(**cfg)["desenvolvedor"]
        self.assertTrue(c["includeMcpJson"])
        self.assertIn("@banco/consultar", c["tools"])
        self.assertIn("banco/consultar", regras(c, "mcp", "allow"))
        self.assertIn("dba", c["toolsSettings"]["subagent"]["availableAgents"])
        self.assertIn("Skills do projeto ligadas a você: `java`", c["prompt"])
        self.assertIn("`dba` (consultas)", c["prompt"])
        for cmd in ("mvn test", "sh .sabia/http.sh GET /x"):
            self.assertEqual(efeito(c, "shell", cmd), "allow", cmd)
        self.assertEqual(c["model"], "m1")

    def test_resumo_mostra_o_que_cada_agente_recebeu(self):
        (self.projeto / ".kiro/skills/java").mkdir(parents=True)
        (self.projeto / ".kiro/skills/java/SKILL.md").write_text("x")
        cfg = {**self.cfg, "agentes": {"sa-desenvolvedor": {"skills": ["skill://.kiro/skills/java/SKILL.md"],
                                                           "mcp": ["banco/consultar"]}}}
        linhas = {l.split("|")[1].strip(): l for l in g.resumo(g.gerar(self.projeto, cfg), cfg).splitlines()[2:]}
        self.assertIn("`java`", linhas["**sa-desenvolvedor**"])
        self.assertIn("`banco/consultar`", linhas["**sa-desenvolvedor**"])
        self.assertIn("🟢 só o bundle local", linhas["**sa-pesquisador**"])
        self.assertIn("| ➖ |", linhas["**sa-pesquisador**"])
        self.assertIn("🟢 consulta · 🟡 abrir e mesclar PR", linhas["**sa-desenvolvedor**"])
        self.assertIn("🟡 pergunta", linhas["**sa-desenvolvedor**"])
        self.assertTrue(linhas["**sa-produto**"].rstrip(" |").endswith("🔴 negado"))

    def toolkit(self, **mudar):
        """Toolkit fictício em ~/.sabia/toolkits/batch-alfa: passo do desenvolvedor com o agente job, que chama o step."""
        pasta = self.home / ".sabia/toolkits/batch-alfa"
        for f in ("skills/batch/SKILL.md", "skills/teste/SKILL.md", "agentes/job.md", "agentes/step.md"):
            (pasta / f).parent.mkdir(parents=True, exist_ok=True)
            (pasta / f).write_text("x {{BASE}}" if f.startswith("agentes") else "x")
        man = {"nome": "batch-alfa", "versao": "1.0.0",
               "skills": [{"caminho": "skills/batch/SKILL.md", "papeis": ["desenvolvedor"],
                           "passo": {"papel": "desenvolvedor", "para": "tarefa de job", "agente": "batch-job"}}],
               "agentes": [{"nome": "batch-job", "descricao": "job", "prompt": "agentes/job.md", "skills": ["skills/batch/SKILL.md"],
                            "subagentes": ["batch-step"]},
                           {"nome": "batch-step", "descricao": "step", "prompt": "agentes/step.md", "skills": ["skills/teste/SKILL.md"]}]}
        man.update(mudar)
        (pasta / "toolkit.json").write_text(json.dumps(man))
        return {"toolkits": {"batch-alfa": {"pasta": "~/.sabia/toolkits/batch-alfa", "versao": "1.0.0", "sha": "abc"}},
                "passos": [{"toolkit": "batch-alfa", "skill": "skills/batch/SKILL.md", "agente": True}]}

    def test_passo_com_agente(self):
        agentes = self.gerar(**self.toolkit())
        c, job, step = agentes["desenvolvedor"], agentes["batch-job"], agentes["batch-step"]
        self.assertIn("skill://~/.sabia/toolkits/batch-alfa/skills/batch/SKILL.md", c["resources"])
        self.assertIn("batch-job", c["toolsSettings"]["subagent"]["availableAgents"])
        self.assertIn("`batch-job` (tarefa de job)", c["prompt"])
        # o passo é da configuração do agente, não uma marca no tasks.md
        self.assertIn("Desvios de toolkit no passo `sa-codificar.codificar.tarefa`", c["prompt"])
        self.assertIn("`tarefa de job` → delegue ao subagente `batch-job`", c["prompt"])
        self.assertNotIn("Desvios de toolkit", agentes["revisor"]["prompt"])
        self.assertEqual(job["toolsSettings"]["subagent"]["availableAgents"], ["batch-step"])
        self.assertEqual(job["prompt"], "x develop\n")
        self.assertNotIn("welcomeMessage", job)
        self.assertFalse([r for r in job["resources"] if "/sa-" in r])
        for a in (job, step):  # as regras do papel dono, nunca mais que isso
            self.assertEqual([r for r in a["permissions"]["rules"] if r["capability"] != "subagent"],
                             [r for r in c["permissions"]["rules"] if r["capability"] != "subagent"])
        self.assertNotIn("toolsSettings", step)
        self.assertIn("~/.sabia/toolkits/**", regras(c, "fs_read", "allow"))

    def test_agente_do_toolkit_herda_skills_e_mcps_do_dono(self):
        cfg = {**self.cfg, **self.toolkit(), "agentes": {"sa-desenvolvedor": {
            "skills": ["skill://~/.sabia/toolkits/java/skills/java/SKILL.md"], "mcp": ["sqlcl/sql_run"],
            "subagentes": [{"nome": "outro", "para": "x"}]}}}
        agentes = g.gerar(self.projeto, cfg)
        job, c = agentes["batch-job.json"], agentes["sa-desenvolvedor.json"]
        self.assertEqual(job["resources"][-2:], ["skill://~/.sabia/toolkits/batch-alfa/skills/batch/SKILL.md",
                                                 "skill://~/.sabia/toolkits/java/skills/java/SKILL.md"])
        self.assertIn("@sqlcl/sql_run", job["tools"])
        self.assertTrue(job["includeMcpJson"])
        # os subagentes do dono ficam com ele
        self.assertNotIn("outro", job["toolsSettings"]["subagent"]["availableAgents"])
        self.assertIn("outro", c["toolsSettings"]["subagent"]["availableAgents"])

    def test_passo_sem_agente(self):
        cfg = self.toolkit()
        cfg["passos"][0]["agente"] = False
        agentes = self.gerar(**cfg)
        self.assertNotIn("batch-job", agentes)
        self.assertIn("skill://~/.sabia/toolkits/batch-alfa/skills/batch/SKILL.md", agentes["desenvolvedor"]["resources"])
        self.assertNotIn("batch-job", agentes["desenvolvedor"].get("toolsSettings", {}).get("subagent", {}).get("availableAgents", []))
        self.assertIn("`tarefa de job` → carregue a skill `batch` e faça o passo por ela", agentes["desenvolvedor"]["prompt"])

    def test_toolkit_invalido_e_recusado(self):
        skill = lambda caminho, **passo: {"caminho": caminho, "papeis": ["desenvolvedor"], "passo": {"papel": "desenvolvedor", "para": "p", **passo}}
        ruins = [{"agentes": [{"nome": "sa-job", "descricao": "j", "prompt": "agentes/job.md"}],
                  "skills": [skill("skills/batch/SKILL.md", agente="sa-job")]},
                 {"skills": [skill("../fora/SKILL.md")]},
                 {"skills": [skill("skills/batch/SKILL.md", agente="batch-job")],
                  "agentes": [{"nome": "batch-job", "descricao": "j", "prompt": "/etc/passwd"}]},
                 {"skills": [skill("skills/batch/SKILL.md", papel="faxineiro")]},
                 {"skills": [{"caminho": "skills/batch/SKILL.md", "papeis": ["desenvolvedor"]}]}]  # skill sem `passo`
        for mudar in ruins:
            cfg = self.toolkit(**mudar)
            cfg["passos"][0]["skill"] = mudar["skills"][0]["caminho"]
            with self.assertRaises(ValueError, msg=mudar):
                g.gerar(self.projeto, {**self.cfg, **cfg})

    def test_opencode(self):
        agentes = g.gerar(self.projeto, self.cfg)
        pesq, cod = g.opencode(agentes["sa-pesquisador.json"], self.cfg), g.opencode(agentes["sa-desenvolvedor.json"], self.cfg)
        self.assertTrue(pesq.startswith("---\n") and '"mode": "all"' in pesq)
        self.assertIn('  "edit": "deny"', pesq)
        linhas = cod.splitlines()
        edit = linhas.index('  "edit":')
        self.assertEqual(linhas[edit + 1], '    "*": "allow"')  # a última que casa vence: o geral vem antes
        self.assertIn('    ".sabia/planejamento/epicos/*": "deny"', linhas)
        self.assertIn('    "*/.kiro/agents/*": "deny"', linhas)
        bash = linhas.index('  "bash":')
        self.assertEqual(linhas[bash + 1], '    "*": "allow"')  # liberado; as negações e o push vêm depois e vencem
        self.assertLess(bash + 1, linhas.index('    "*git commit* -n": "deny"'))
        self.assertIn('    "sa-revisor": "allow"', linhas)
        self.assertIn('    "sa-codificar": "allow"', linhas)
        self.assertIn('  "elm_elm_criar_wi": "ask"', linhas)
        self.assertIn('  "gitlabpr_gitlab_mesclar_mr": "ask"', linhas)
        self.assertIn('    "~/.sabia/toolkits/*": "allow"', linhas)
        self.assertIn('    "~/.config/opencode/*": "allow"', linhas)
        self.assertTrue(cod.rstrip().endswith(agentes["sa-desenvolvedor.json"]["prompt"].rstrip()))

    def test_main_so_opencode_sem_kiro_instalado(self):
        conf = self.projeto / ".sabia/config/agentes.json"
        conf.parent.mkdir(parents=True)
        conf.write_text(json.dumps({**self.cfg, "power": "~/nao-existe", "alvos": ["opencode"]}))
        self.assertEqual(g.main(["--projeto", str(self.projeto), "--gravar"]), 0)
        self.assertEqual(len(list((self.projeto / ".opencode/agents").glob("sa-*.md"))), 7)
        self.assertFalse((self.projeto / ".kiro/agents").exists())
        for alvo in ("cursor", "claude"):  # o Claude Code saiu dos alvos na 2.0
            self.assertEqual(g.main(["--projeto", str(self.projeto), "--alvo", alvo]), 1)

    # ---- fluxos (F3): delta do override do projeto, recusas, desvio pelo id e regra de chamada
    def com_fluxo(self, arquivos, **mudar):
        for f, c in arquivos.items():
            (self.projeto / f).parent.mkdir(parents=True, exist_ok=True)
            (self.projeto / f).write_text(c if isinstance(c, str) else json.dumps(c))
        return self.gerar(framework=str(REPO), **mudar)

    def base(self, rel):
        import hashlib
        return hashlib.sha256((REPO / rel).read_bytes()).hexdigest()[:12]

    def test_sem_override_nao_ha_delta_e_todo_agente_tem_a_chamada(self):
        for nome, a in self.gerar(framework=str(REPO)).items():
            self.assertNotIn("O que este projeto mudou", a["prompt"], nome)
            self.assertIn("chama **em linha**", a["prompt"], nome)

    def test_delta_vai_so_para_o_dono_do_fluxo(self):
        pf = "fluxo/sa-codificar/codificar/passos/validar.md"
        agentes = self.com_fluxo({
            ".sabia/" + pf: f'---\n{{"base": "{self.base(pf)}", "resumo": "x"}}\n---\n## Entrada\n',
            ".sabia/fluxo/sa-codificar/codificar/codificar.md": '---\n{"inserir": [{"id": "lint-extra", "depois": "validar"}]}\n---\n',
            ".sabia/fluxo/sa-codificar/codificar/passos/lint-extra.md": "---\n{}\n---\n## Entrada\n",
            ".sabia/padrao/sa-codificar/pr.md": f'---\n{{"base": "{self.base("padrao/sa-codificar/pr.md")}"}}\n---\nPR\n'})
        d = agentes["desenvolvedor"]["prompt"]
        self.assertIn("Fluxo `sa-codificar.codificar`:", d)
        self.assertIn("- passo `validar`: leia `.sabia/fluxo/sa-codificar/codificar/passos/validar.md` (no lugar do da skill)", d)
        self.assertIn("- passo `lint-extra` (inserido depois de `validar`)", d)
        self.assertIn("- padrão `sa-codificar/pr.md`", d)
        for nome in ("orquestrador", "revisor", "produto"):  # D1 = A: só o dono leva o delta do fluxo
            self.assertNotIn("Fluxo `sa-codificar.codificar`", agentes[nome]["prompt"], nome)
            self.assertIn("- padrão `sa-codificar/pr.md`", agentes[nome]["prompt"], nome)  # o padrão vai a todos

    def test_override_invalido_e_recusado(self):
        pf = "fluxo/sa-codificar/codificar/passos/validar.md"
        ruins = [
            {".sabia/fluxo/sa-codificar/codificar/passos/nao-existe.md": "x"},                       # órfão
            {".sabia/fluxo/sa-nada/x/passos/y.md": "x"},                                              # fluxo que não existe
            {".sabia/" + pf: "---\n{}\n---\n## Entrada\n"},                                         # cópia sem base
            {".sabia/fluxo/sa-codificar/codificar/codificar.md": '---\n{"passos": []}\n---\n'},     # chave proibida
            {".sabia/fluxo/sa-codificar/codificar/codificar.md": '---\n{"remover": ["revisar"]}\n---\n'},  # trava
            {".sabia/fluxo/sa-codificar/codificar/codificar.md": '---\n{"liberar": ["backpressure"]}\n---\n'},
            {".sabia/fluxo/sa-codificar/codificar/codificar.md": '---\n{"inserir": [{"id": "z", "depois": "validar"}]}\n---\n'},  # sem arquivo
            {".sabia/padrao/sa-codificar/nao-existe.md": "x"},
            {".sabia/padrao/sa-codificar/pr.md": "PR sem base"},                                      # padrão sem base
            {".sabia/fluxo/sa-codificar/codificar/passos/validar.txt": "x"},                         # não é .md
            {".sabia/fluxo/sa-planejamento/review/review.md": '---\n{"remover": ["rito"]}\n---\n',  # removido e copiado
             ".sabia/fluxo/sa-planejamento/review/passos/rito.md": f'---\n{{"base": "{self.base("fluxo/sa-planejamento/review/passos/rito.md")}"}}\n---\n'},
            {".sabia/fluxo/sa-planejamento/review/review.md": '---\n{"remover": ["rito"], "inserir": [{"id": "a", "depois": "rito"}]}\n---\n',
             ".sabia/fluxo/sa-planejamento/review/passos/a.md": "x"},                                  # depois de um removido
            {".sabia/fluxo/sa-planejamento/review/review.md": '---\n{"inserir": [{"id": "a", "depois": "rito"}, {"id": "a", "depois": "rito"}]}\n---\n',
             ".sabia/fluxo/sa-planejamento/review/passos/a.md": "x"},                                  # id repetido
            {".sabia/fluxo/sa-planejamento/review/review.md": '---\n{"inserir": [{"id": "a", "depois": "b"}, {"id": "b", "depois": "a"}]}\n---\n',
             ".sabia/fluxo/sa-planejamento/review/passos/a.md": "x", ".sabia/fluxo/sa-planejamento/review/passos/b.md": "x"},  # ciclo
            {".sabia/fluxo/sa-planejamento/review/review.md": '---\n{"inserir": [{"id": "../x", "depois": "rito"}]}\n---\n'},  # id ruim
            {".sabia/fluxo/sa-codificar/codificar/codificar.md": '---\n{"inserir": [1,]}\n---\n'},  # JSON inválido
            {".sabia/" + pf: f'---\n{{"base": "{self.base(pf)}"}}\n---\n## Travas\n\n- nenhuma\n'},       # seção gerada no corpo
        ]
        for arquivos in ruins:
            for f in (self.projeto / ".sabia").glob("fluxo"), (self.projeto / ".sabia").glob("padrao"):
                for d in f:
                    import shutil; shutil.rmtree(d)
            for f, c in arquivos.items():
                (self.projeto / f).parent.mkdir(parents=True, exist_ok=True)
                (self.projeto / f).write_text(c)
            with self.assertRaises(ValueError, msg=arquivos):
                g.gerar(self.projeto, {**self.cfg, "framework": str(REPO)})

    def test_base_velha_so_avisa(self):
        pf = "fluxo/sa-codificar/codificar/passos/validar.md"
        self.com_fluxo({".sabia/" + pf: '---\n{"base": "000000000000"}\n---\n## Entrada\n'}, sabia="0.0.1")
        avisos = "\n".join(g.gerar.avisos)
        self.assertIn("a base mudou desde a cópia", avisos)
        self.assertIn("configurado com o Sabiá 0.0.1", avisos)

    def test_desvio_pelo_id_do_passo_com_gancho(self):
        cfg = self.toolkit(skills=[{"caminho": "skills/batch/SKILL.md", "papeis": ["desenvolvedor"],
                                    "passo": {"passo": "sa-codificar.codificar.tarefa", "para": "tarefa de job",
                                              "arquivos": ["**/*JobConfig.java"], "agente": "batch-job"}}])
        c = self.gerar(framework=str(REPO), **cfg)["desenvolvedor"]
        self.assertIn("`tarefa de job` (arquivos `**/*JobConfig.java`) → delegue ao subagente `batch-job`", c["prompt"])
        for passo in ("sa-codificar.codificar.validar", "sa-codificar.codificar.nada"):  # sem gancho · inexistente
            cfg["passos"][0]["skill"] = "skills/batch/SKILL.md"
            ruim = self.toolkit(skills=[{"caminho": "skills/batch/SKILL.md", "papeis": ["desenvolvedor"],
                                         "passo": {"passo": passo, "para": "p"}}])
            with self.assertRaises(ValueError, msg=passo):
                g.gerar(self.projeto, {**self.cfg, "framework": str(REPO), **ruim})

    def test_gerador_fora_do_repo_acha_o_mestre_pelo_framework(self):
        import shutil, subprocess, sys
        copia = Path(self.tmp.name) / "instalado/sa-setup"
        shutil.copytree(Path(__file__).resolve().parents[1], copia, ignore=shutil.ignore_patterns("__pycache__"))
        fw = Path(self.tmp.name) / "fw"
        for d in ("fluxo", "padrao"):
            shutil.copytree(REPO / d, fw / d)
        pf = "fluxo/sa-codificar/codificar/passos/validar.md"
        (self.projeto / ".sabia" / pf).parent.mkdir(parents=True)
        (self.projeto / ".sabia" / pf).write_text(f'---\n{{"base": "{self.base(pf)}"}}\n---\n## Entrada\n')
        conf = self.projeto / ".sabia/config/agentes.json"
        conf.parent.mkdir(parents=True)
        conf.write_text(json.dumps({**self.cfg, "alvos": ["opencode"]}))
        r = subprocess.run([sys.executable, str(copia / "scripts/gerar_agentes.py"), "--projeto", str(self.projeto),
                            "--framework", str(fw), "--gravar"], capture_output=True, text=True, env={**os.environ, "HOME": str(self.home)})
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn("- passo `validar`: leia", (self.projeto / ".opencode/agents/sa-desenvolvedor.md").read_text())

    def test_inserir_encadeado_e_remover_validos(self):
        r = "fluxo/sa-planejamento/review"
        agentes = self.com_fluxo({
            f".sabia/{r}/review.md": '---\n{"remover": ["rito"], "inserir": [{"id": "b", "depois": "a"}, {"id": "a", "depois": "consolidacao"}]}\n---\n',
            f".sabia/{r}/passos/a.md": "x", f".sabia/{r}/passos/b.md": "x"})
        p = agentes["produto"]["prompt"]
        for t in ("- passo `rito`: removido neste projeto", "- passo `a` (inserido depois de `consolidacao`)", "- passo `b` (inserido depois de `a`)"):
            self.assertIn(t, p)

    def test_framework_sem_fluxo_recusa_override_e_nao_poe_a_chamada(self):
        for a in self.gerar().values():  # HOME de teste: ~/.sabia/framework não existe
            self.assertNotIn("chama **em linha**", a["prompt"])
        (self.projeto / ".sabia/fluxo/sa-codificar/codificar/passos").mkdir(parents=True)
        (self.projeto / ".sabia/fluxo/sa-codificar/codificar/passos/validar.md").write_text("x")
        with self.assertRaisesRegex(ValueError, "não tem fluxo/"):
            g.gerar(self.projeto, self.cfg)

    def test_sabia_md_so_do_produto_e_so_na_raiz(self):
        agentes = self.gerar()
        self.assertEqual(efeito(agentes["produto"], "fs_write", ".sabia/sabia.md"), "allow")
        for alvo in (".sabia/local/wt/ft-1/.sabia/sabia.md", "mod/.sabia/sabia.md"):
            self.assertNotEqual(efeito(agentes["produto"], "fs_write", alvo), "allow", alvo)

    def test_shell_liberado_ainda_segura_push_credenciais_e_harness(self):
        d = self.gerar()["desenvolvedor"]
        for cmd in ("cd .sabia/local/wt/ft-1 && git push -u origin ft-1", "sh -c 'git push origin ft-1'"):
            self.assertEqual(efeito(d, "shell", cmd), "ask", cmd)
        # o desenvolvedor dá push na base com pergunta (registro de situação); o revisor nunca
        self.assertEqual(efeito(self.gerar()["revisor"], "shell", "cd .sabia/local/wt/ft-1 && git push origin develop"), "deny")
        for cmd in ("git push -f origin x", "cd ~/.ssh && cat id_rsa",
                    "sed -i s/deny/allow/ .kiro/agents/sa-desenvolvedor.json", "echo x >> .sabia/fluxo/sa-a/f/passos/p.md",
                    "git switch -f outra", "git checkout -f outra"):
            self.assertEqual(efeito(d, "shell", cmd), "deny", cmd)
        self.assertEqual(efeito(self.gerar()["verificador"], "shell", "cd /tmp && curl http://x"), "ask")

    def test_toolkit_1x_de_papel_sem_gancho_e_recusado(self):
        ruim = self.toolkit(skills=[{"caminho": "skills/batch/SKILL.md", "papeis": ["produto"],
                                     "passo": {"papel": "produto", "para": "algo do produto", "agente": "batch-job"}}])
        with self.assertRaisesRegex(ValueError, "não tem passo que aceite desvio"):
            g.gerar(self.projeto, {**self.cfg, **ruim})

    def test_base_pela_linha_de_comando(self):
        import contextlib, io
        out = io.StringIO()
        with contextlib.redirect_stdout(out):
            self.assertEqual(g.main(["--base", "sa-codificar.codificar.validar", "--framework", str(REPO)]), 0)
        self.assertEqual(out.getvalue().strip(), self.base("fluxo/sa-codificar/codificar/passos/validar.md"))
        with contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(g.main(["--base", "sa-codificar/pr.md", "--framework", str(REPO)]), 0)
            self.assertEqual(g.main(["--base", "sa-codificar.codificar.nada", "--framework", str(REPO)]), 1)

    def test_chave_sem_prefixo_falha(self):
        with self.assertRaises(ValueError):
            g.gerar(self.projeto, {**self.cfg, "agentes": {"desenvolvedor": {}}})

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
