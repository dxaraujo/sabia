// node --test   (nesta pasta) — prova do núcleo de ponta a ponta, só com fixtures sintéticas: o framework deste
// repositório instalado e compilado nos dois alvos, os toolkits instalados, os agentes gerados pelo gerar_agentes.py
// (o de verdade, sobre a instalação) e a rota e o grafo dos fluxos no projeto.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { carregar, grafoAscii } from "./compilar.mjs";
import * as s from "./sabia.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VERSAO_FW = JSON.parse(fs.readFileSync(path.join(REPO, "plugin.json"), "utf8")).version;  // o projeto configurado com o Sabiá deste repositório
const GERAR = path.join(REPO, "skills/sa-setup/scripts/gerar_agentes.py");
const PYTHON = spawnSync("python3", ["--version"]).status === 0;
let raiz, home, falhaInstalar = null;

const fm = (d) => `---\n${JSON.stringify(d)}\n---\n`;
const sha12 = (f) => crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex").slice(0, 12);

function escrever(base, arquivos) {
  for (const [f, c] of Object.entries(arquivos)) {
    fs.mkdirSync(path.dirname(path.join(base, f)), { recursive: true });
    fs.writeFileSync(path.join(base, f), typeof c === "string" ? c : JSON.stringify(c));
  }
  return base;
}

/** O toolkit sintético "casa": HF → a skill casa, com o fluxo e o padrão do tipo como arquivos da pasta, e um item de rubrica. */
const casa = () => escrever(path.join(raiz, "fontes/casa"), {
  "toolkit.json": { nome: "casa", versao: "1.0.0", descricao: "toolkit fictício de especificação", autor: { nome: "Ana Exemplo", area: "Equipe Alfa" },
    "tipos-de-projeto": ["backend", "frontend"], skills: [{ caminho: "skills/casa/SKILL.md", papeis: ["especificador"] }],
    tipos: { HF: { skill: "skills/casa/SKILL.md", fluxo: "fluxo/fluxo-hf.md", padrao: "padrao/padrao-hf.md" } },
    rubricas: [{ id: "EX1", tipo: "HF", verificacao: "Toda HF cita a tela de origem", severidade: "IMPORTANTE" }], requer: { sabia: "2.1.0" } },
  "skills/casa/SKILL.md": "---\nname: casa\ndescription: HF da casa\n---\n# casa — histórias\n\nSiga o fluxo e o padrão do tipo.\n",
  "fluxo/fluxo-hf.md": "# Fluxo HF\n\nEscreva as HF e confira.\n",
  "padrao/padrao-hf.md": "# Padrão HF\n",
});

/** O toolkit sintético "batch-alfa": a tarefa de job vai ao agente batch-job no passo sa-desenvolver.codificar.tarefa. */
const batchAlfa = () => escrever(path.join(raiz, "fontes/batch-alfa"), {
  "toolkit.json": { nome: "batch-alfa", versao: "1.0.0", descricao: "toolkit fictício de jobs", autor: { nome: "Beto Exemplo", area: "Equipe Beta" },
    "tipos-de-projeto": ["batch"], skills: [{ caminho: "skills/batch/SKILL.md", papeis: ["desenvolvedor"],
      passo: { passo: "sa-desenvolver.codificar.tarefa", para: "tarefa de job", arquivos: ["**/*JobConfig.java"], agente: "batch-job" } }],
    agentes: [{ nome: "batch-job", descricao: "Codifica um job", prompt: "agentes/job.md", skills: ["skills/batch/SKILL.md"] }] },
  "skills/batch/SKILL.md": "---\nname: batch\ndescription: jobs\n---\n# batch\n",
  "agentes/job.md": "Codifique o job da tarefa na base {{BASE}}.\n",
});

/** Um projeto sintético: o sabia.md (as linhas que o fluxo lê; elm = as linhas da seção ELM), o agentes.json e os extras. */
function projeto(nome, { tipos, elm = {}, toolkits = {}, passos = [] }, extra = {}) {
  const linhas = Object.entries(elm).map(([k, v]) => `| ${k} | \`${v}\` |\n`).join("");
  return escrever(path.join(raiz, nome), {
    ".sabia/sabia.md": `# Sabiá — ${nome}\n\n## Projeto\n\n| Item | Valor |\n|---|---|\n| Tipos · stack · módulos | \`${tipos}\` |\n\n## ELM\n\n| Item | Valor |\n|---|---|\n${linhas}`,
    ".sabia/config/agentes.json": { sabia: VERSAO_FW, alvos: ["kiro", "opencode"], formato_spec: "kiro", produto: ".sabia/planejamento",
      branch_base: "develop", prefixo_branch: "", glossario: ".sabia/glossario.md", adr: "docs/adr", elm: false, toolkits, passos, agentes: {} },
    ...extra,
  });
}

/** O gerar_agentes.py de verdade, sobre o ~/.sabia/framework instalado; devolve a saída (o resumo e as tabelas). */
function gerar(proj) {
  const r = spawnSync("python3", [GERAR, "--projeto", proj, "--gravar"], { encoding: "utf8", env: { ...process.env, HOME: home } });
  assert.equal(r.status, 0, r.stderr);
  assert.doesNotMatch(r.stdout, /^aviso:/m);
  return r.stdout;
}

const agenteKiro = (proj, n) => JSON.parse(fs.readFileSync(path.join(proj, ".kiro/agents", `${n}.json`), "utf8"));
const agenteOpencode = (proj, n) => fs.readFileSync(path.join(proj, ".opencode/agents", `${n}.md`), "utf8");
const ordem = (rota) => [...rota.matchAll(/│ (\d+ [a-z0-9-]+)/g)].map((x) => x[1]);

before(async () => {
  raiz = fs.mkdtempSync(path.join(os.tmpdir(), "sabia-prova-"));
  home = path.join(raiz, "home");
  fs.mkdirSync(home);
  process.env.HOME = home;
  s.ctx.log = () => {};
  s.ctx.tela = { ...Object.fromEntries(["abrir", "fechar", "passo", "ok", "aviso", "marca", "nota", "cancelar"].map((k) => [k, () => {}])), esperar: (t, fn) => fn() };
  // o kiro-cli não roda no teste: o "powers install" vira a cópia da compilação para onde o Kiro a poria
  s.ctx.exec = (cmd, args) => {
    if (cmd === "kiro-cli" && args[0] === "powers" && args[1] === "install") fs.cpSync(args[2], path.join(home, ".kiro/powers/installed/sabia"), { recursive: true });
    return { status: 0, stdout: "", stderr: "" };
  };
  const fw = path.join(raiz, "fw");
  for (const f of ["fluxo", "padrao", "skills", "plugin.json", "mcp.json", "README.md", "LICENSE"]) if (fs.existsSync(path.join(REPO, f))) fs.cpSync(path.join(REPO, f), path.join(fw, f), { recursive: true });
  try {
    await s.instalar({ fonte: fw, alvo: "opencode,kiro", semMcp: true, sim: true });
    await s.instalarToolkit(casa(), { alvo: "opencode,kiro" });
    await s.instalarToolkit(batchAlfa(), { alvo: "opencode,kiro" });
  } catch (e) { falhaInstalar = e; }
});

after(() => fs.rmSync(raiz, { recursive: true, force: true }));

test("prova: o framework compilado nos dois alvos tem o catálogo e o grafo de cada fluxo igual ao do mestre", () => {
  assert.ifError(falhaInstalar);
  const m = carregar(path.join(home, ".sabia/framework"));
  for (const [alvo, skills] of [["opencode", path.join(home, ".config/opencode/skills")], ["kiro", path.join(home, ".kiro/powers/installed/sabia/skills")]]) {
    for (const q of Object.keys(m.fluxos)) {
      const [sk, fl] = q.split(".");
      assert.ok(fs.readFileSync(path.join(skills, sk, "references", fl, "grafo.md"), "utf8").includes(grafoAscii(m.fluxos[q])), `${alvo} ${q}`);
    }
    const tipos = fs.readFileSync(path.join(skills, "sabia/references/tipos.md"), "utf8");
    for (const sg of ["HF", "UC", "REG", "MSG", "GL", "EL", "ET", "CT", "ATA"]) assert.match(tipos, new RegExp(`^\\| \`${sg}\` \\|`, "m"), `${alvo} ${sg}`);
    assert.match(tipos, /`MSG` → `GL` → `REG` → `UC` → `EL` → `HF` → `ET`/);
    assert.ok(!tipos.includes("(pendente)"), alvo);
  }
});

test("prova front+back: o toolkit casa (HF ⇢ skill casa) com o override do projeto num passo do Sabiá, gerado e na rota", { skip: !PYTHON && "sem python3" }, () => {
  assert.ifError(falhaInstalar);
  const fonte = path.join(home, ".sabia/framework/fluxo/sa-prd/prd/passos/entender.md");
  const base = sha12(fonte);
  const proj = projeto("loja", { tipos: "backend, frontend", toolkits: { casa: { pasta: "~/.sabia/toolkits/casa", versao: "1.0.0" } },
    elm: { "ET as-built": "sim", "REG com dados técnicos": "sim", Telas: "sim" } },
  { ".sabia/fluxo/sa-prd/prd/passos/entender.md": fm({ base }) + "## Entrada\n\nO pedido, com as telas do protótipo aprovado.\n" });
  gerar(proj);
  // o especificador: a linha do tipo, a skill do toolkit como veio (nada compilado) e o passo do projeto
  const tk = "~/.sabia/toolkits/casa";
  const e = agenteOpencode(proj, "sa-especificador");
  assert.ok(e.includes(`no passo \`sa-prd.prd.escrever\`, HF → carregue a skill \`casa\` e siga \`${tk}/fluxo/fluxo-hf.md\` com o padrão \`${tk}/padrao/padrao-hf.md\``));
  assert.ok(e.includes("Fluxo `sa-prd.prd`:\n- passo `entender`: leia `.sabia/fluxo/sa-prd/prd/passos/entender.md`"));
  assert.ok(agenteKiro(proj, "sa-especificador").prompt.includes(`${tk}/fluxo/fluxo-hf.md`));
  assert.ok(!fs.existsSync(path.join(home, ".sabia/compilado-toolkits")));
  assert.equal(fs.readFileSync(path.join(home, ".config/opencode/skills/casa/SKILL.md"), "utf8"), fs.readFileSync(path.join(raiz, "fontes/casa/skills/casa/SKILL.md"), "utf8"));
  assert.ok(agenteKiro(proj, "sa-revisor").prompt.includes("`EX1` (HF) IMPORTANTE — Toda HF cita a tela de origem (toolkit `casa`)"));
  // a rota: o passo do projeto (com a base do Sabiá) e o desvio por tipo no sa-prd.prd e em elm/
  const o = { projeto: proj };
  const prd = s.rotaFluxo("sa-prd.prd", o);
  assert.match(prd, /^tipo ⇢ +escrever: HF +→ skill casa \(fluxo\/fluxo-hf\.md\) +toolkit casa 1\.0\.0$/m);
  assert.match(prd, /│ \d+ escrever ⇢ +│──▶ ⇢ tipo HF → skill casa \(fluxo\/fluxo-hf\.md\) \(toolkit casa 1\.0\.0\)\n.*┘ {4}⇢ por tipo: HF, UC, REG, MSG, EL\n/);
  assert.match(prd, new RegExp(`│ \\d+ entender +│──▶ origem: projeto \\(base ${base}\\)`));
  assert.match(s.rotaFluxo("sa-especificar.elm", o), /│ \d+ editar ⇢ +│──▶ ⇢ tipo HF → skill casa/);
  assert.match(s.rotaFluxo("sa-especificar.reuniao", o), /│ \d+ escrever ⇢ +│──▶ ⇢ por tipo: ATA\n/);
});

test("prova batch: o desvio do batch-alfa na tarefa de job, gerado nos dois alvos, sem tipo de toolkit", { skip: !PYTHON && "sem python3" }, () => {
  assert.ifError(falhaInstalar);
  const proj = projeto("lote", { tipos: "batch",
    toolkits: { "batch-alfa": { pasta: "~/.sabia/toolkits/batch-alfa", versao: "1.0.0" } },
    passos: [{ passo: "sa-desenvolver.codificar.tarefa", toolkit: "batch-alfa", skill: "skills/batch/SKILL.md", agente: "batch-job" }] });
  const saida = gerar(proj);
  const d = agenteOpencode(proj, "sa-desenvolvedor");
  assert.ok(d.includes("`tarefa de job` (arquivos `**/*JobConfig.java`) → delegue ao subagente `batch-job`"));
  // o agente do toolkit: o prompt dele, com os limites do dono do passo (no Kiro, os limites valem pelo prompt)
  const job = agenteKiro(proj, "batch-job");
  assert.ok(job.prompt.startsWith("Codifique o job da tarefa na base develop.\n"), job.prompt);
  assert.deepEqual(job.tools, agenteKiro(proj, "sa-desenvolvedor").tools.filter((t) => t !== "subagent"));
  assert.ok(fs.existsSync(path.join(proj, ".opencode/agents/batch-job.md")));
  assert.ok(!agenteKiro(proj, "sa-especificador").prompt.includes("Tipos com skill de toolkit"));
  assert.doesNotMatch(saida, /Tipos com skill de toolkit/);
  // a rota de um arquivo de job: o desvio, o dono com os agentes gerados e o motivo
  const r = s.rota(path.join(proj, "src/main/java/x/ImportarPedidosJobConfig.java"), { projeto: proj });
  assert.match(r, /^dono +sa-desenvolvedor +\.opencode\/agents\/sa-desenvolvedor\.md, \.kiro\/agents\/sa-desenvolvedor\.json$/m);
  assert.match(r, /^desvio +batch-job +toolkit batch-alfa 1\.0\.0$/m);
  assert.match(r, /^motivo +casou \*\*\/\*JobConfig\.java$/m);
  assert.match(s.rota(path.join(proj, "src/main/java/x/PedidoDto.java"), { projeto: proj }), /^desvio +— fluxo padrão/m);
  // sem toolkit de tipo, o sa-prd.prd fica todo do Sabiá (o ⇢ é só o gancho)
  const prd = s.rotaFluxo("sa-prd.prd", { projeto: proj });
  assert.doesNotMatch(prd, /^tipo ⇢/m);
  assert.doesNotMatch(prd, /⇢ tipo HF/);
});
