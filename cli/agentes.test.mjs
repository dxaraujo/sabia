// node --test agentes.test.mjs   (nesta pasta) — o gerador de agentes (agentes.mjs), porte dos testes do gerar_agentes.py.
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as g from "./agentes.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");  // a fonte do framework (fluxo/, template/, plugin.json)
const ASSETS = path.join(REPO, "skills/sa-setup/assets/agents");
const PERFIS = JSON.parse(fs.readFileSync(path.join(ASSETS, "perfis.json"), "utf8"));
const NOMES = Object.keys(PERFIS.agentes);
const ELM = { pa: "alfa", bundle: "docs/elm/alfa",
  regras: { allow: ["elm/elm_ler_wi", "elm/elm_*_local", "elm/elm_sync"], ask: ["elm/elm_criar_wi", "elm/elm_publicar_req"], deny: ["elm/elm_backlog"] } };
const SABIA_MD = "# Sabiá — teste\n\n## Verificação de aceite\n\n| Item | `api` | `web` |\n|---|---|---|\n"
  + "| Executar | `mvn spring-boot:run` | `npm start` |\n| URL de teste | `http://localhost:8080` | `<url — nunca a de produção | não se aplica>` |\n";

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const subconjunto = (a, b) => [...a].every((x) => b.has(x));

/** O frontmatter que o _yaml grava (chaves e escalares em JSON, mapas por indentação) de volta em objeto. */
function frente(md) {
  const raiz = {}, pilha = [[-1, raiz]];
  for (const l of md.split("---\n")[1].split("\n")) {
    if (!l.trim()) continue;
    const ind = l.length - l.trimStart().length;
    while (pilha.at(-1)[0] >= ind) pilha.pop();
    const [, k, resto] = l.trim().match(/^("(?:[^"\\]|\\.)*")\s*:?\s*(.*)$/s);
    const alvo = pilha.at(-1)[1], chave = JSON.parse(k);
    if (resto) alvo[chave] = JSON.parse(resto);
    else { alvo[chave] = {}; pilha.push([ind, alvo[chave]]); }
  }
  return raiz;
}

/** Como o opencode decide: a última chave que casa vence (`*` atravessa `/`). */
function oc(regra, alvo) {
  if (typeof regra === "string") return regra;
  return Object.entries(regra).filter(([k]) => g.casa(alvo, k)).at(-1)[1];
}

let tmp, home, projeto, velhoHome, cfg, ultimo;

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "agentes-"));
  home = path.join(tmp, "home");
  projeto = path.join(tmp, "projeto");
  for (const s of new Set(Object.values(PERFIS.agentes).flatMap((a) => a.skills))) {
    const f = path.join(home, ".kiro/powers/installed/sabia/skills", s, "SKILL.md");
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, "x");
  }
  fs.mkdirSync(path.join(projeto, ".sabia"), { recursive: true });
  fs.writeFileSync(path.join(projeto, ".sabia/sabia.md"), SABIA_MD);
  velhoHome = process.env.HOME;
  process.env.HOME = home;
  cfg = { alvos: ["kiro", "opencode"], sabia: JSON.parse(fs.readFileSync(path.join(REPO, "plugin.json"), "utf8")).version, formato_spec: "kiro",
    produto: ".sabia/planejamento", branch_base: "develop", prefixo_branch: "feature/", glossario: "docs/glossario.md", adr: "docs/adr",
    elm: ELM, toolkits: {}, passos: [], agentes: {} };
});

afterEach(() => {
  process.env.HOME = velhoHome;
  fs.rmSync(tmp, { recursive: true, force: true });
});

/** Gera e confere que nenhum agente aponta para caminho que não existe; guarda o resultado (avisos, tabelaTipos). */
function gerar(mudar = {}) {
  ultimo = g.gerar(projeto, { ...cfg, ...mudar }, REPO);
  assert.deepEqual(Object.values(ultimo.agentes).flatMap((a) => g.problemas(a, projeto)), []);
  return ultimo.agentes;
}
const perm = (a) => frente(g.opencode(a)).permission;
const base = (rel) => crypto.createHash("sha256").update(fs.readFileSync(path.join(REPO, rel))).digest("hex").slice(0, 12);

function escrever(arquivos) {
  for (const [f, c] of Object.entries(arquivos)) {
    fs.mkdirSync(path.dirname(path.join(projeto, f)), { recursive: true });
    fs.writeFileSync(path.join(projeto, f), typeof c === "string" ? c : JSON.stringify(c));
  }
}

/** Toolkit fictício em ~/.sabia/toolkits/batch-alfa: passo do desenvolvedor com o agente job, que chama o step. */
function toolkit({ passo = "sa-desenvolver.codificar.tarefa", papeis = ["desenvolvedor"], ...mudar } = {}) {
  const pasta = path.join(home, ".sabia/toolkits/batch-alfa");
  for (const f of ["skills/batch/SKILL.md", "skills/teste/SKILL.md", "agentes/job.md", "agentes/step.md"]) {
    fs.mkdirSync(path.dirname(path.join(pasta, f)), { recursive: true });
    fs.writeFileSync(path.join(pasta, f), f.startsWith("agentes") ? "x {{BASE}}" : "x");
  }
  const man = { nome: "batch-alfa", versao: "1.0.0",
    skills: [{ caminho: "skills/batch/SKILL.md", papeis: [...papeis], passo: { passo, para: "tarefa de job", arquivos: ["**/*JobConfig.java"], agente: "batch-job" } }],
    agentes: [{ nome: "batch-job", descricao: "job", prompt: "agentes/job.md", skills: ["skills/batch/SKILL.md"], subagentes: ["batch-step"] },
      { nome: "batch-step", descricao: "step", prompt: "agentes/step.md", skills: ["skills/teste/SKILL.md"] }],
    ...mudar };
  fs.writeFileSync(path.join(pasta, "toolkit.json"), JSON.stringify(man));
  return { toolkits: { "batch-alfa": { pasta: "~/.sabia/toolkits/batch-alfa", versao: "1.0.0", sha: "abc" } },
    passos: [{ toolkit: "batch-alfa", skill: "skills/batch/SKILL.md", agente: "batch-job" }] };
}

/** Toolkit sintético em ~/.sabia/toolkits/<nome>: a skill <nome> escreve o tipo pelo fluxo e o template dele, arquivos
 * da pasta (o Sabiá não compila conteúdo de toolkit), e uma rubrica. */
function casaTk(nome = "casa", { rubricas, papeis = ["especificador"], extra, tipos } = {}) {
  const pasta = path.join(home, ".sabia/toolkits", nome);
  for (const f of [`skills/${nome}/SKILL.md`, "fluxo/fluxo-hf.md", "template/template-hf.md", "fluxo/fluxo-reuniao.md", "steering/java.md"]) {
    fs.mkdirSync(path.dirname(path.join(pasta, f)), { recursive: true });
    fs.writeFileSync(path.join(pasta, f), "# x\n");
  }
  const sk = `skills/${nome}/SKILL.md`;
  const man = { nome, versao: "1.0.0", skills: [{ caminho: sk, papeis: [...papeis] }],
    tipos: tipos ?? { HF: { skill: sk, fluxo: "fluxo/fluxo-hf.md", template: "template/template-hf.md" }, ATA: { skill: sk, fluxo: "fluxo/fluxo-reuniao.md" } },
    criterios_revisao: rubricas === undefined ? [{ id: "EX1", tipo: "HF", verificacao: "Toda HF cita o campo de origem", severidade: "IMPORTANTE" }] : rubricas,
    ...(extra ?? {}) };
  fs.writeFileSync(path.join(pasta, "toolkit.json"), JSON.stringify(man));
  return { [nome]: { pasta: `~/.sabia/toolkits/${nome}`, versao: "1.0.0" } };
}

describe("Agentes", () => {
  test("cinco agentes nos dois formatos", () => {
    const agentes = gerar();
    assert.deepEqual(Object.keys(agentes), NOMES);
    for (const [nome, a] of Object.entries(agentes)) {
      const k = g.kiro(a), o = frente(g.opencode(a));
      assert.equal(k.name, nome);
      assert.ok(!["toolsSettings", "allowedTools", "permissions"].some((x) => x in k), nome);
      assert.ok(k.tools.every((t) => ["read", "write", "shell", "subagent"].includes(t) || t.startsWith("@")), String(k.tools));
      assert.ok(!(JSON.stringify(k) + g.opencode(a)).includes("{{"));
      assert.equal(o.mode, PERFIS.agentes[nome].mode);
      assert.equal(o.description, PERFIS.agentes[nome].descricao);
      assert.ok(g.opencode(a).endsWith(a.prompt));
      assert.ok(a.prompt.includes("Limites deste agente"));
      assert.ok(k.resources.includes("file://.kiro/steering/sabia.md"));
      for (const s of PERFIS.agentes[nome].skills) {
        assert.ok(k.resources.includes(`skill://${g.POWER}/skills/${s}/SKILL.md`));
        assert.equal(o.permission.skill[s], "allow");
      }
    }
    assert.deepEqual(Object.entries(agentes).filter(([, a]) => !g.kiro(a).tools.includes("write")).map(([n]) => n).sort(), ["sa-pesquisador", "sa-revisor"]);
    assert.deepEqual(frente(g.opencode(agentes["sa-desenvolvedor"])).permission.task,
      { "*": "deny", "sa-pesquisador": "allow", "sa-revisor": "allow", "sa-verificador": "allow", "sa-desenvolvedor": "allow" });
    assert.equal(perm(agentes["sa-pesquisador"]).task, "deny");
  });

  test("build sem restrição por pasta fora do harness", () => {
    const agentes = gerar();
    for (const nome of ["sa-desenvolvedor", "sa-especificador"]) {
      const p = perm(agentes[nome]);
      for (const alvo of ["src/main/App.java", ".kiro/specs/ft-001-x/status.md", "openspec/changes/ft-001-x/tasks.md",
        ".sabia/planejamento/backlog.md", ".sabia/sabia.md", ".sabia/creditos/ana.csv"])
        assert.equal(oc(p.edit, alvo), "allow", `${nome} ${alvo}`);
      for (const alvo of [".kiro/agents/sa-revisor.json", ".kiro/settings/mcp.json", ".kiro/steering/sabia.md", ".opencode/agents/x.md",
        "opencode.json", ".sabia/config/agentes.json", ".sabia/fluxo/sa-plano/plano/passos/x.md", ".sabia/template/sa-plano/spec.md",
        ".sabia/local/wt/ft-001/.kiro/agents/x.json", ".env", "mod/.env.local", "certs/x.pem"])
        assert.equal(oc(p.edit, alvo), "deny", `${nome} ${alvo}`);
      for (const alvo of [".env", "api/.env.prod", "~/.ssh/id_rsa"]) assert.equal(oc(p.read, alvo), "deny", `${nome} ${alvo}`);
      assert.equal(oc(p.read, "src/main/App.java"), "allow");
      for (const [cmd, e] of [["mvn -q test", "allow"], ["git commit -m x", "allow"], ["git push origin ft-001", "ask"],
        ["git merge origin/develop", "ask"], ["curl http://x", "ask"], ["git rebase develop", "deny"],
        ["git push --force origin x", "deny"], ["git reset --hard HEAD", "deny"], ["git commit --no-verify", "deny"],
        ["rm -rf build", "deny"], ["sudo ls", "deny"]])
        assert.equal(oc(p.bash, cmd), e, `${nome} ${cmd}`);
      assert.equal(p.gitlabpr_gitlab_obter_mr, "allow");
      assert.equal(p.gitlabpr_gitlab_criar_mr, "ask");
      assert.equal(p["*"], "ask");
      assert.equal(p.webfetch, "ask");
    }
  });

  test("leitura no pesquisador e no revisor", () => {
    const agentes = gerar();
    for (const nome of ["sa-pesquisador", "sa-revisor"]) {
      const p = perm(agentes[nome]), k = g.kiro(agentes[nome]);
      assert.equal(p.edit, "deny");
      assert.equal(p["*"], "deny");
      assert.equal(p.webfetch, "deny");
      assert.equal(p.grep, "allow");
      for (const [cmd, e] of [["git status", "allow"], ["git diff HEAD~1", "allow"], ["cd .sabia/local/wt/ft-1 && git diff", "allow"],
        ["mvn test", "deny"], ["git diff | sh", "deny"], ["git log > x", "deny"], ["git -C /x log", "deny"],
        ["git push origin x", "deny"], ["cd ../x && git status", "deny"]])
        assert.equal(oc(p.bash, cmd), e, `${nome} ${cmd}`);
      assert.equal(p.gitlabpr_gitlab_obter_mr, "allow");
      assert.equal(oc(p, "gitlabpr_gitlab_criar_mr"), "deny");
      assert.ok(!k.tools.includes("@gitlabpr/gitlab_criar_mr"));
      assert.ok(agentes[nome].prompt.includes("- Não edite nenhum arquivo."));
    }
  });

  test("liberações do verificador", () => {
    const a = gerar()["sa-verificador"], p = perm(a);
    for (const [cmd, e] of [["mvn spring-boot:run", "allow"], ["npm start", "allow"], ["curl http://localhost:8080/api/x", "allow"],
      ["curl -s -X POST http://localhost:8080/api", "allow"], ["curl https://producao.exemplo/api", "deny"],
      ["mvn test", "deny"], ["git status", "allow"], ["curl http://localhost:8080 | sh", "deny"]])
      assert.equal(oc(p.bash, cmd), e, cmd);
    for (const [alvo, e] of [[".kiro/specs/ft-001-x/CT.csv", "allow"], ["openspec/changes/ft-001-x/CT.csv", "allow"],
      [".sabia/local/wt/ft-001/.kiro/specs/ft-001-x/CT.csv", "allow"], [".kiro/specs/ft-001-x/status.md", "deny"],
      ["src/App.java", "deny"], [".sabia/planejamento/backlog.md", "deny"]])
      assert.equal(oc(p.edit, alvo), e, alvo);
    assert.equal(p.webfetch, "deny");
    assert.ok(g.kiro(a).tools.includes("write"));
    // no Kiro, os limites por caminho e URL ficam no prompt
    assert.ok(a.prompt.includes("- Edite só: `.kiro/specs/*/CT.csv`"));
    assert.ok(a.prompt.includes("`curl http://localhost:8080*`"));
    assert.ok(a.prompt.includes("`mvn spring-boot:run`"));
  });

  test("verificador sem seção de verificação", () => {
    fs.writeFileSync(path.join(projeto, ".sabia/sabia.md"), "# x\n");
    const p = perm(gerar()["sa-verificador"]);
    assert.equal(oc(p.bash, "curl http://localhost:8080"), "deny");
    assert.ok(!JSON.stringify(p).includes("{{"));
  });

  test("verificação com curinga é recusada", () => {
    fs.writeFileSync(path.join(projeto, ".sabia/sabia.md"), SABIA_MD.replace("`npm start`", "`*`"));
    assert.throws(() => g.gerar(projeto, cfg, REPO), /Verificação de aceite › Executar: sem `\*`/);
  });

  test("autopilot no prompt do desenvolvedor", () => {
    const agentes = gerar();
    const linha = agentes["sa-desenvolvedor"].prompt.split("\n").find((l) => l.startsWith("No autopilot"));
    assert.ok(linha);
    const [liberados, negados] = linha.split("; negados");
    for (const x of ["`cd .sabia/local/wt/*`", "`git push origin feature/*`", "`git push -u origin feature/*`", "`git merge origin/develop`", "`gitlabpr/gitlab_criar_mr`"])
      assert.ok(liberados.includes(x), x);
    for (const x of ["`git push * develop`", "`git push *:develop*`", "`git merge *--squash*`", "`curl *`", "`gitlabpr/gitlab_mesclar_mr`", "`elm/*`"])
      assert.ok(negados.includes(x), x);
    assert.ok(linha.includes('todo o resto que pediria o "sim" fica negado'));
    for (const n of NOMES.slice(1)) assert.ok(!agentes[n].prompt.includes("No autopilot ("), n);
    // o arquivo do agente fica com as regras do supervisionado
    assert.equal(oc(perm(agentes["sa-desenvolvedor"]).bash, "git push origin feature/x"), "ask");
  });

  test("com elm", () => {
    const agentes = gerar();
    for (const nome of ["sa-desenvolvedor", "sa-especificador"]) {
      const p = perm(agentes[nome]), k = g.kiro(agentes[nome]);
      assert.deepEqual([p.elm_elm_ler_wi, p.elm_elm_criar_wi, p.elm_elm_backlog], ["allow", "ask", "deny"]);
      assert.ok(k.tools.includes("@elm/elm_criar_wi"));
    }
    for (const nome of ["sa-pesquisador", "sa-revisor", "sa-verificador"]) {
      const p = perm(agentes[nome]), k = g.kiro(agentes[nome]);
      assert.equal(oc(p, "elm_elm_ler_wi"), "allow", nome);
      assert.equal(oc(p, "elm_elm_buscar_local"), "allow", nome);
      for (const t of ["elm_elm_criar_wi", "elm_elm_publicar_req", "elm_elm_sync", "elm_elm_indexar_local", "elm_elm_backlog"])
        assert.equal(oc(p, t), "deny", `${nome} ${t}`);
      assert.ok(k.tools.includes("@elm/elm_ler_wi"));
      assert.ok(!["@elm/elm_criar_wi", "@elm/elm_sync"].some((t) => k.tools.includes(t)), nome);
    }
  });

  test("sem elm", () => {
    for (const [nome, a] of Object.entries(gerar({ elm: false }))) {
      const p = perm(a);
      assert.equal(p["elm_*"], "deny", nome);
      assert.equal(oc(p, "elm_elm_ler_wi"), "deny", nome);
      assert.deepEqual(g.kiro(a).tools.filter((t) => t.startsWith("@elm")), [], nome);
    }
  });

  test("esquema fechado do agentes.json", () => {
    for (const [mudar, erro] of [[{ bundle: null }, /chave fora do esquema \['bundle'\]/],
      [{ agentes: { desenvolvedor: {} } }, /agente desconhecido desenvolvedor/],
      [{ agentes: { "sa-revisor": { ler: [] } } }, /agentes.sa-revisor: chave fora do esquema \['ler'\]/],
      [{ elm: true }, /elm: false ou/], [{ elm: { pa: "x", regras: { pergunta: [] } } }, /elm: false ou/],
      [{ formato_spec: "markdown" }, /formato_spec/], [{ branch_base: "" }, /falta \['branch_base'\]/]])
      assert.throws(() => g.gerar(projeto, { ...cfg, ...mudar }, REPO), { message: erro }, JSON.stringify(mudar));
  });

  test("extras do projeto", () => {
    fs.mkdirSync(path.join(projeto, ".kiro/skills/java"), { recursive: true });
    fs.writeFileSync(path.join(projeto, ".kiro/skills/java/SKILL.md"), "x");
    const e = gerar({ agentes: { "sa-especificador": { skills: ["skill://.kiro/skills/java/SKILL.md"], mcp: ["banco/consultar"],
      subagentes: [{ nome: "dba", para: "consultas" }], modelo: "m1" } } })["sa-especificador"];
    const k = g.kiro(e), o = frente(g.opencode(e));
    assert.equal(k.includeMcpJson, true);
    assert.ok(k.tools.includes("@banco/consultar"));
    assert.equal(o.permission.banco_consultar, "allow");
    assert.equal(o.permission.task.dba, "allow");
    assert.equal(o.permission.skill.java, "allow");
    assert.ok(e.prompt.includes("Skills do projeto ligadas a você: `java`"));
    assert.ok(e.prompt.includes("`dba` (consultas)"));
    assert.deepEqual([k.model, o.model], ["m1", "m1"]);
  });

  test("sem glossário", () => {
    const e = gerar({ glossario: null })["sa-especificador"].prompt;
    assert.ok(!e.includes("glossário (`"));
    assert.ok(gerar()["sa-especificador"].prompt.includes("glossário (`docs/glossario.md`)"));
  });

  test("caminho ruim é apontado", () => {
    const { agentes: a } = g.gerar(projeto, { ...cfg, agentes: { "sa-revisor": { skills: ["skill://.kiro/skills/nao/SKILL.md", "skill:///abs/SKILL.md"] } } }, REPO);
    assert.equal(g.problemas(a["sa-revisor"], projeto).length, 2);
    assert.deepEqual(g.problemas(a["sa-revisor"], projeto, false), []);
  });

  test("resumo", () => {
    const linhas = Object.fromEntries(g.resumo(gerar(toolkit())).split("\n").slice(2).filter(Boolean).map((l) => [l.split("|")[1].trim(), l]));
    assert.ok(linhas["**sa-desenvolvedor**"].includes("| primary | build |"));
    assert.ok(linhas["**sa-revisor**"].includes("| subagent | leitura |"));
    assert.ok(linhas["**batch-job**"].includes("build (do sa-desenvolvedor)"));
    assert.ok(linhas["**sa-desenvolvedor**"].includes("`batch-job`"));
  });
});

describe("Toolkits", () => {
  test("passo com agente tem as permissões do dono", () => {
    const agentes = gerar(toolkit());
    const { "sa-desenvolvedor": d, "batch-job": job, "batch-step": step } = agentes;
    assert.ok(g.kiro(d).resources.includes("skill://~/.sabia/toolkits/batch-alfa/skills/batch/SKILL.md"));
    assert.ok(d.subagentes.includes("batch-job"));
    assert.ok(d.prompt.includes("Desvios de toolkit no passo `sa-desenvolver.codificar.tarefa`"));
    assert.ok(d.prompt.includes("`tarefa de job` (arquivos `**/*JobConfig.java`) → delegue ao subagente `batch-job`"));
    assert.ok(!agentes["sa-especificador"].prompt.includes("Desvios de toolkit"));
    for (const a of [job, step]) {  // as regras do dono, nunca mais que isso
      assert.deepEqual(a.perm, d.perm);
      const sem = (p) => Object.fromEntries(Object.entries(p).filter(([k]) => !["task", "skill"].includes(k)));
      assert.deepEqual(sem(perm(a)), sem(perm(d)));
      assert.equal(frente(g.opencode(a)).mode, "subagent");
      assert.ok(subconjunto(g.kiro(a).tools.filter((t) => t !== "subagent"), new Set(g.kiro(d).tools)));
      assert.ok(a.prompt.includes("Limites deste agente"));
      assert.ok(!a.prompt.includes("No autopilot ("));
    }
    assert.ok(job.prompt.startsWith("x develop\n"));
    assert.deepEqual(job.subagentes, ["batch-step"]);
    assert.deepEqual(step.subagentes, []);
    assert.deepEqual(g.kiro(job).resources.filter((r) => r.includes("/sa-")), []);
  });

  test("desvio aceita o id antigo", () => {
    const d = gerar(toolkit({ passo: "sa-codificar.codificar.tarefa" }))["sa-desenvolvedor"];
    assert.ok(d.prompt.includes("Desvios de toolkit no passo `sa-desenvolver.codificar.tarefa`"));
  });

  test("papel do toolkit tem de ser do dono", () => {
    assert.throws(() => g.gerar(projeto, { ...cfg, ...toolkit({ papeis: ["especificador", "orquestrador"] }) }, REPO),
      { message: /não traz o papel desenvolvedor em papeis/ });
  });

  test("agente do toolkit herda skills e mcps do dono", () => {
    const c = { ...toolkit(), agentes: { "sa-desenvolvedor": { skills: ["skill://~/.sabia/toolkits/batch-alfa/skills/teste/SKILL.md"],
      mcp: ["sqlcl/sql_run"], subagentes: [{ nome: "outro", para: "x" }] } } };
    const agentes = gerar(c);
    const { "batch-job": job, "sa-desenvolvedor": d } = agentes;
    assert.deepEqual(job.skills_projeto, ["skill://~/.sabia/toolkits/batch-alfa/skills/batch/SKILL.md", "skill://~/.sabia/toolkits/batch-alfa/skills/teste/SKILL.md"]);
    assert.ok(g.kiro(job).tools.includes("@sqlcl/sql_run"));
    assert.ok(!job.subagentes.includes("outro"));
    assert.ok(d.subagentes.includes("outro"));
  });

  test("passo sem agente", () => {
    const c = toolkit();
    c.passos[0].agente = false;
    const agentes = gerar(c);
    assert.ok(!("batch-job" in agentes));
    assert.ok(!agentes["sa-desenvolvedor"].subagentes.includes("batch-job"));
    assert.ok(agentes["sa-desenvolvedor"].prompt.includes("`tarefa de job` (arquivos `**/*JobConfig.java`) → carregue a skill `batch` e faça o passo por ela"));
  });

  test("toolkit inválido é recusado", () => {
    const skill = (caminho, passo = {}) => ({ caminho, papeis: ["desenvolvedor"], passo: { passo: "sa-desenvolver.codificar.tarefa", para: "p", ...passo } });
    const ruins = [{ agentes: [{ nome: "sa-job", descricao: "j", prompt: "agentes/job.md" }], skills: [skill("skills/batch/SKILL.md", { agente: "sa-job" })] },
      { skills: [skill("../fora/SKILL.md")] },
      { skills: [skill("skills/batch/SKILL.md", { agente: "batch-job" })], agentes: [{ nome: "batch-job", descricao: "j", prompt: "/etc/passwd" }] },
      { skills: [skill("skills/batch/SKILL.md", { passo: "sa-desenvolver.codificar.nada" })] },
      { skills: [skill("skills/batch/SKILL.md", { passo: "sa-desenvolver.codificar.validar" })] },  // sem desvio
      { skills: [{ caminho: "skills/batch/SKILL.md", papeis: ["desenvolvedor"], passo: { para: "p" } }] },  // sem id
      { skills: [{ caminho: "skills/batch/SKILL.md", papeis: ["desenvolvedor"] }] }];  // skill sem `passo`
    for (const mudar of ruins) {
      const c = toolkit(mudar);
      c.passos[0].skill = mudar.skills[0].caminho;
      assert.throws(() => g.gerar(projeto, { ...cfg, ...c }, REPO), Error, JSON.stringify(mudar));
    }
  });

  test("cópia do projeto vale sobre o padrão do toolkit", () => {
    const tk = casaTk();
    const orig = path.join(home, ".sabia/toolkits/casa/template/template-hf.md");
    escrever({ ".sabia/template/requisitos/template-hf.md": `---\n{"base": "${g.sha12(orig)}"}\n---\nHF do projeto\n` });
    const agentes = gerar({ toolkits: tk });
    assert.ok(agentes["sa-especificador"].prompt.includes("com o template `.sabia/template/requisitos/template-hf.md` (cópia do projeto sobre `~/.sabia/toolkits/casa/template/template-hf.md`)"));
    assert.deepEqual(ultimo.avisos.filter((a) => a.includes("template-hf")), []);
    fs.writeFileSync(orig, "# x mudou\n");  // o toolkit mudou o padrão: a base da cópia ficou velha
    gerar({ toolkits: tk });
    assert.ok(ultimo.avisos.some((a) => a.includes("template-hf.md: a base mudou")));
  });

  test("cópia do projeto sem toolkit vale sobre o padrão do Sabiá", () => {
    const rel = "template/requisitos/template-hf.md";
    escrever({ [`.sabia/${rel}`]: `---\n{"base": "${base(rel)}"}\n---\nHF do projeto\n` });
    assert.ok(gerar()["sa-especificador"].prompt.includes("`.sabia/template/requisitos/template-hf.md` (no lugar do da skill)"));
  });

  test("toolkit não instalado é recusado", () => {
    const c = { ...cfg, toolkits: { fantasma: { pasta: "~/.sabia/toolkits/fantasma", versao: "1.0.0" } } };
    assert.throws(() => g.gerar(projeto, c, REPO), { message: /toolkit fantasma: ~\/\.sabia\/toolkits\/fantasma\/toolkit\.json não encontrado/ });
    assert.throws(() => g.gerar(projeto, { ...cfg, passos: [{ toolkit: "fantasma", skill: "skills/x/SKILL.md" }] }, REPO), { message: /sem entrada em `toolkits`/ });
  });

  test("tipo com skill de toolkit", () => {
    const agentes = gerar({ toolkits: casaTk() });
    const e = agentes["sa-especificador"], pasta = "~/.sabia/toolkits/casa";
    const hf = `HF → carregue a skill \`casa\` e siga \`${pasta}/fluxo/fluxo-hf.md\` com o template \`${pasta}/template/template-hf.md\``;
    assert.ok(e.prompt.includes(`Tipos com skill de toolkit (⇢ no passo de desvio do tipo): no passo \`sa-prd.prd.escrever\`, ${hf}; no passo`
      + ` \`sa-especificar.elm.editar\`, ${hf}; no passo \`sa-especificar.reuniao.escrever\`, ATA → carregue a skill \`casa\` e siga`
      + ` \`${pasta}/fluxo/fluxo-reuniao.md\`.`));
    assert.deepEqual(g.kiro(e).resources.filter((r) => r.includes("casa")), [`skill://${pasta}/skills/casa/SKILL.md`]);
    assert.ok(g.opencode(e).includes(`${pasta}/fluxo/fluxo-hf.md`));
    assert.ok(!agentes["sa-desenvolvedor"].prompt.includes("Tipos com skill de toolkit"));
    assert.ok(agentes["sa-revisor"].prompt.includes("`EX1` (HF) IMPORTANTE — Toda HF cita o campo de origem (toolkit `casa`)"));
    assert.deepEqual(ultimo.tabelaTipos, [
      "| Tipo | Skill | Fluxo e template | Toolkit | Passo de desvio |", "|---|---|---|---|---|",
      `| \`HF\` | \`${pasta}/skills/casa/SKILL.md\` | \`${pasta}/fluxo/fluxo-hf.md\` com o template \`${pasta}/template/template-hf.md\` | \`casa\` 1.0.0 | \`sa-prd.prd.escrever\`, \`sa-especificar.elm.editar\` |`,
      `| \`ATA\` | \`${pasta}/skills/casa/SKILL.md\` | \`${pasta}/fluxo/fluxo-reuniao.md\` | \`casa\` 1.0.0 | \`sa-especificar.reuniao.escrever\` |`, "",
      "| Item de critério de revisão | Tipo | Severidade | Verificação | Toolkit |", "|---|---|---|---|---|",
      "| `EX1` | HF | IMPORTANTE | Toda HF cita o campo de origem | `casa` 1.0.0 |"]);
    // só a skill, com as references dentro
    let e2 = gerar({ toolkits: casaTk("casa", { tipos: { HF: { skill: "skills/casa/SKILL.md" } } }) })["sa-especificador"];
    assert.ok(e2.prompt.includes("no passo `sa-prd.prd.escrever`, HF → carregue a skill `casa` e siga as references dela"));
    // a skill do tipo também no agentes.json: uma vez só
    const fonte = `skill://${pasta}/skills/casa/SKILL.md`;
    e2 = gerar({ toolkits: casaTk(), agentes: { "sa-especificador": { skills: [fonte] } } })["sa-especificador"];
    assert.deepEqual(g.kiro(e2).resources.filter((x) => x.endsWith("/casa/SKILL.md")), [fonte]);
  });

  test("papéis mapeiam um para um", () => {
    // produto → sa-especificador
    assert.ok(gerar({ toolkits: casaTk("casa", { papeis: ["produto"] }) })["sa-especificador"].prompt.includes("HF → carregue a skill `casa`"));
    assert.throws(() => g.gerar(projeto, { ...cfg, toolkits: casaTk("casa", { papeis: ["desenvolvedor", "orquestrador"] }) }, REPO),
      { message: /não traz o papel especificador ou produto em papeis/ });
    // steering pelos papeis; verificacao ao sa-verificador
    const agentes = gerar({ toolkits: casaTk("casa", { extra: { verificacao: "Suba com docker compose e chame a API.",
      steering: [{ caminho: "steering/java.md", papeis: ["revisor", "produto", "orquestrador"] }] } }) });
    const linha = "Steering do toolkit `casa`: leia `~/.sabia/toolkits/casa/steering/java.md` antes de começar.";
    assert.deepEqual(Object.entries(agentes).filter(([, a]) => a.prompt.includes(linha)).map(([n]) => n).sort(), ["sa-especificador", "sa-revisor"]);
    assert.ok(agentes["sa-verificador"].prompt.includes("Verificação de aceite do toolkit `casa`: Suba com docker compose e chame a API."));
    assert.ok(!agentes["sa-revisor"].prompt.includes("Verificação de aceite do toolkit"));
  });

  test("toolkits em colisão ou tipo que não desvia são recusados", () => {
    const sk = { skill: "skills/casa/SKILL.md", fluxo: "fluxo/fluxo-hf.md" };
    const casos = [[() => ({ ...casaTk(), ...casaTk("outro", { rubricas: [], tipos: { HF: { ...sk, skill: "skills/outro/SKILL.md" } } }) }), "tipo HF já é de toolkit casa"],
      [() => casaTk("casa", { rubricas: [{ id: "EX1", verificacao: "a", severidade: "BLOQUEANTE" }, { id: "EX1", verificacao: "b", severidade: "BLOQUEANTE" }] }),
        "critério de revisão EX1 já é de toolkit casa"],
      [() => casaTk("casa", { tipos: { GL: sk } }), "tipo GL → skills/casa/SKILL.md: use {skill, fluxo, template} (fluxo e template opcionais); o tipo tem de ser desviável e não pendente"],
      [() => casaTk("casa", { tipos: { CT: sk } }), "tipo CT: a skill skills/casa/SKILL.md não traz o papel verificador em papeis (dono do passo de desvio sa-verificar.verificar.casos)"],
      [() => casaTk("casa", { tipos: { HF: "casa.hf" } }), "tipo HF → casa.hf: use {skill, fluxo, template}"],
      [() => casaTk("casa", { tipos: { HF: { ...sk, fluxo: "fluxo/nao.md" } } }), "o fluxo arquivos da pasta do toolkit"],
      [() => casaTk("casa", { tipos: { HF: { ...sk, template: "template/nao.md" } } }), "o fluxo e o template arquivos da pasta do toolkit"],
      [() => casaTk("casa", { tipos: { HF: { ...sk, skill: "skills/outra/SKILL.md" } } }), "a skill uma das skills do toolkit"],
      [() => casaTk("casa", { tipos: { HF: { ...sk, fluxo: "../fora.md" } } }), "caminho fora da pasta do toolkit"],
      [() => casaTk("casa", { rubricas: [{ id: "EX1", tipo: "HF" }] }), "critério de revisão EX1: precisa de id, verificacao e severidade"],
      [() => casaTk("casa", { extra: { steering: [{ caminho: "steering/nao.md", papeis: ["revisor"] }] } }), "steering steering/nao.md não existe"]];
    for (const [toolkits, erro] of casos) {
      assert.throws(() => g.gerar(projeto, { ...cfg, toolkits: toolkits() }, REPO), { message: new RegExp(esc(erro)) }, erro);
      fs.rmSync(path.join(home, ".sabia"), { recursive: true, force: true });
    }
  });

  test("tipo pendente no catálogo é recusado", () => {
    const fw = path.join(tmp, "fw");
    fs.mkdirSync(path.join(fw, "fluxo"), { recursive: true });
    fs.writeFileSync(path.join(fw, "fluxo/tipos.json"), JSON.stringify({ tipos: { HF: { desviavel: ["sa-prd.prd.escrever"], pendente: true } } }));
    assert.throws(() => g.fonteToolkits(projeto, { toolkits: casaTk("casa", { tipos: { HF: { skill: "skills/casa/SKILL.md" } } }) }, fw, {}),
      { message: new RegExp(esc("o tipo tem de ser desviável e não pendente")) });
  });
});

describe("Fluxos", () => {
  const PF = "fluxo/sa-desenvolver/codificar/passos/validar.md";

  test("sem override não há delta e todo agente tem a chamada", () => {
    for (const [nome, a] of Object.entries(gerar())) {
      assert.ok(!a.prompt.includes("O que este projeto mudou"), nome);
      assert.ok(a.prompt.includes("chama **em linha**"), nome);
    }
  });

  test("delta vai só para o dono do fluxo", () => {
    escrever({
      [`.sabia/${PF}`]: `---\n{"base": "${base(PF)}"}\n---\n## Entrada\n`,
      ".sabia/fluxo/sa-desenvolver/codificar/codificar.md": '---\n{"inserir": [{"id": "lint-extra", "depois": "validar"}]}\n---\n',
      ".sabia/fluxo/sa-desenvolver/codificar/passos/lint-extra.md": "---\n{}\n---\n## Entrada\n",
      ".sabia/template/sa-desenvolver/pr.md": `---\n{"base": "${base("template/sa-desenvolver/pr.md")}"}\n---\nMR\n` });
    const agentes = gerar();
    const d = agentes["sa-desenvolvedor"].prompt;
    assert.ok(d.includes("Fluxo `sa-desenvolver.codificar`:"));
    assert.ok(d.includes("- passo `validar`: leia `.sabia/fluxo/sa-desenvolver/codificar/passos/validar.md` (no lugar do da skill)"));
    assert.ok(d.includes("- passo `lint-extra` (inserido depois de `validar`)"));
    for (const nome of NOMES.slice(1)) {  // só o dono leva o delta do fluxo; o padrão vai a todos
      assert.ok(!agentes[nome].prompt.includes("Fluxo `sa-desenvolver.codificar`"), nome);
      assert.ok(agentes[nome].prompt.includes("- template `sa-desenvolver/pr.md`"), nome);
    }
  });

  test("inserir encadeado", () => {
    const r = "fluxo/sa-planejamento/review";
    escrever({ [`.sabia/${r}/review.md`]: '---\n{"inserir": [{"id": "b", "depois": "a"}, {"id": "a", "depois": "rito"}]}\n---\n',
      [`.sabia/${r}/passos/a.md`]: "x", [`.sabia/${r}/passos/b.md`]: "x" });
    const e = gerar()["sa-especificador"].prompt;
    for (const t of ["- passo `a` (inserido depois de `rito`)", "- passo `b` (inserido depois de `a`)"]) assert.ok(e.includes(t), t);
  });

  test("override inválido é recusado", () => {
    const c = ".sabia/fluxo/sa-desenvolver/codificar", rv = ".sabia/fluxo/sa-planejamento/review";
    const ruins = [
      { [`${c}/passos/nao-existe.md`]: "x" },                                          // órfão
      { ".sabia/fluxo/sa-nada/x/passos/y.md": "x" },                                   // fluxo que não existe
      { [`.sabia/${PF}`]: "---\n{}\n---\n## Entrada\n" },                              // cópia sem base
      { [`${c}/codificar.md`]: '---\n{"passos": []}\n---\n' },                         // chave proibida
      { [`${c}/codificar.md`]: '---\n{"remover": ["verificar"]}\n---\n' },             // trava
      { [`${c}/codificar.md`]: '---\n{"liberar": ["backpressure"]}\n---\n' },
      { [`${c}/codificar.md`]: '---\n{"inserir": [{"id": "z", "depois": "validar"}]}\n---\n' },  // sem arquivo
      { ".sabia/template/sa-desenvolver/nao-existe.md": "x" },
      { ".sabia/template/sa-desenvolver/pr.md": "MR sem base" },
      { [`${c}/passos/validar.txt`]: "x" },                                            // não é .md
      { [`${rv}/review.md`]: '---\n{"inserir": [{"id": "a", "depois": "rito"}, {"id": "a", "depois": "rito"}]}\n---\n', [`${rv}/passos/a.md`]: "x" },
      { [`${rv}/review.md`]: '---\n{"inserir": [{"id": "a", "depois": "b"}, {"id": "b", "depois": "a"}]}\n---\n',
        [`${rv}/passos/a.md`]: "x", [`${rv}/passos/b.md`]: "x" },                      // ciclo
      { [`${rv}/review.md`]: '---\n{"inserir": [{"id": "../x", "depois": "rito"}]}\n---\n' },
      { [`${rv}/review.md`]: '---\n{"inserir": [{"id": "grafo", "depois": "rito"}]}\n---\n', [`${rv}/passos/grafo.md`]: "x" },
      { [`${c}/codificar.md`]: '---\n{"inserir": [1,]}\n---\n' },                     // JSON inválido
      { [`.sabia/${PF}`]: `---\n{"base": "${base(PF)}"}\n---\n## Travas\n\n- nenhuma\n` },
    ];
    for (const arquivos of ruins) {
      for (const d of [".sabia/fluxo", ".sabia/template"]) fs.rmSync(path.join(projeto, d), { recursive: true, force: true });
      escrever(arquivos);
      assert.throws(() => g.gerar(projeto, cfg, REPO), Error, JSON.stringify(arquivos));
    }
  });

  test("base velha só avisa", () => {
    escrever({ [`.sabia/${PF}`]: '---\n{"base": "000000000000"}\n---\n## Entrada\n' });
    gerar({ sabia: "0.0.1" });
    const avisos = ultimo.avisos.join("\n");
    assert.ok(avisos.includes("a base mudou desde a cópia"));
    assert.ok(avisos.includes("configurado com o Sabiá 0.0.1"));
  });

  test("padrão do projeto só sobre o do Sabiá", () => {
    escrever({ ".sabia/template/casa/template-hf.md": '---\n{"base": "000000000000"}\n---\nHF\n' });
    assert.throws(() => g.gerar(projeto, { ...cfg, toolkits: casaTk() }, REPO), { message: new RegExp(esc(".sabia/template/casa/template-hf.md: não é template do Sabiá")) });
  });

  test("framework sem fluxo recusa", () => {
    assert.throws(() => g.gerar(projeto, cfg, path.join(home, ".sabia/framework")), { message: /não tem o Sabiá instalado|não tem os fluxos/ });
  });
});

describe("Main", () => {
  const config = (mudar = {}) => {
    const conf = path.join(projeto, ".sabia/config/agentes.json");
    fs.mkdirSync(path.dirname(conf), { recursive: true });
    fs.writeFileSync(conf, JSON.stringify({ ...cfg, ...mudar }));
  };
  const main = (extra = {}) => g.gerarProjeto({ projeto, framework: REPO, ...extra });
  const lista = (d, ext) => fs.readdirSync(d).filter((f) => f.endsWith(ext)).map((f) => f.slice(0, -ext.length));

  test("grava nos dois alvos; sem --gravar não grava", () => {
    config(toolkit());
    const seco = main();
    assert.ok(seco.tocados.length && seco.tocados.every((l) => l.startsWith("novo ")), String(seco.tocados));
    assert.ok(!fs.existsSync(path.join(projeto, ".kiro/agents")));
    const r = main({ gravar: true });
    assert.ok(!r.texto.includes("aviso:"));
    const kiro = new Set(lista(path.join(projeto, ".kiro/agents"), ".json"));
    assert.deepEqual(kiro, new Set(lista(path.join(projeto, ".opencode/agents"), ".md")));
    assert.deepEqual(kiro, new Set([...NOMES, "batch-job", "batch-step"]));
    assert.ok(r.texto.includes("| **sa-desenvolvedor** |"));
    assert.deepEqual(main().tocados, []);  // nada a mudar
    fs.appendFileSync(path.join(projeto, ".opencode/agents/sa-revisor.md"), "x");
    assert.deepEqual(main().tocados.map((l) => l.split(" ")[0]), ["alterado"]);
  });

  test("só opencode sem kiro instalado", () => {
    fs.rmSync(path.join(home, ".kiro"), { recursive: true, force: true });
    config({ alvos: ["opencode"] });
    main({ gravar: true });
    assert.equal(lista(path.join(projeto, ".opencode/agents"), ".md").filter((f) => f.startsWith("sa-")).length, 5);
    assert.ok(!fs.existsSync(path.join(projeto, ".kiro/agents")));
    assert.throws(() => main({ alvo: "cursor" }), { message: /alvo desconhecido \['cursor'\]/ });
  });

  test("agentes.json inválido sai sem traceback", () => {
    fs.mkdirSync(path.join(projeto, ".sabia/config"), { recursive: true });
    fs.writeFileSync(path.join(projeto, ".sabia/config/agentes.json"), "{ruim");
    assert.throws(() => main(), { message: /agentes\.json/ });
    config({ papeis: {} });
    assert.throws(() => main(), { message: /agentes\.json/ });
  });

  test("gerador fora do repo acha o mestre pelo framework", async () => {
    // o módulo copiado para fora do repositório só enxerga o framework passado: fluxo/, template/ e os assets da setup
    const copia = path.join(tmp, "instalado/cli");
    fs.mkdirSync(copia, { recursive: true });
    for (const f of ["agentes.mjs", "compilar.mjs", "package.json"]) fs.copyFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), f), path.join(copia, f));
    const fw = path.join(tmp, "fw");
    for (const d of ["fluxo", "template", "skills/sa-setup/assets"]) fs.cpSync(path.join(REPO, d), path.join(fw, d), { recursive: true });
    fs.copyFileSync(path.join(REPO, "plugin.json"), path.join(fw, "plugin.json"));
    const pf = "fluxo/sa-desenvolver/codificar/passos/validar.md";
    escrever({ [`.sabia/${pf}`]: `---\n{"base": "${base(pf)}"}\n---\n## Entrada\n` });
    config({ alvos: ["opencode"] });
    const m = await import(pathToFileURL(path.join(copia, "agentes.mjs")).href);
    m.gerarProjeto({ projeto, framework: fw, gravar: true });
    assert.ok(fs.readFileSync(path.join(projeto, ".opencode/agents/sa-desenvolvedor.md"), "utf8").includes("- passo `validar`: leia"));
  });

  test("base pela linha de comando", () => {
    for (const [arg, rel] of [["sa-desenvolver.codificar.validar", "fluxo/sa-desenvolver/codificar/passos/validar.md"],
      ["sa-desenvolver/pr.md", "template/sa-desenvolver/pr.md"],
      ["sa-desenvolver.codificar.entrada", "fluxo/entrada.md"]])  // passo compartilhado: a base é a de fluxo/entrada.md
      assert.equal(g.baseDe(arg, REPO), base(rel), arg);
    assert.throws(() => g.baseDe("sa-desenvolver.codificar.nada", REPO), Error);
  });
});

describe("SabiaMd", () => {
  test("sabia.md montado do arquivo antigo é apontado", () => {
    const modelo = fs.readFileSync(path.join(ASSETS, "../steering/sabia.md"), "utf8");
    const p = fs.mkdtempSync(path.join(tmp, "sm-"));
    fs.mkdirSync(path.join(p, ".sabia"));
    const f = path.join(p, ".sabia/sabia.md");
    fs.writeFileSync(f, modelo);
    assert.deepEqual(g.conferirSabiaMd(p, REPO), []);
    fs.writeFileSync(f, modelo.replace(/^\| Telas \|.*\n/m, "| Protótipo | x |\n"));
    const [falta, sobra] = g.conferirSabiaMd(p, REPO);
    assert.ok(falta.includes("sem estas linhas do modelo (assets/steering/sabia.md): Especificação › Telas;"));
    assert.ok(sobra.includes("com linhas que não estão no modelo (assets/steering/sabia.md): Especificação › Protótipo;"));
    fs.writeFileSync(f, "# notas da pessoa\n\n## Projeto\n");
    assert.deepEqual(g.conferirSabiaMd(p, REPO), []);
  });
});
