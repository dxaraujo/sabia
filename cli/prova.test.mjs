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
const GERAR = path.join(REPO, "skills/sa-setup/scripts/gerar_agentes.py");
const PYTHON = spawnSync("python3", ["--version"]).status === 0;
let raiz, home;

const fm = (d) => `---\n${JSON.stringify(d)}\n---\n`;
const sha12 = (f) => crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex").slice(0, 12);

function escrever(base, arquivos) {
  for (const [f, c] of Object.entries(arquivos)) {
    fs.mkdirSync(path.dirname(path.join(base, f)), { recursive: true });
    fs.writeFileSync(path.join(base, f), typeof c === "string" ? c : JSON.stringify(c));
  }
  return base;
}

/** O toolkit sintético "exemplo": HF → exemplo.hf, um padrão em camada sobre o sa-prd/hf.md e um item de rubrica. */
const exemplo = () => escrever(path.join(raiz, "fontes/exemplo"), {
  "toolkit.json": { nome: "exemplo", versao: "1.0.0", descricao: "toolkit fictício de especificação", autor: { nome: "Ana Exemplo", area: "Equipe Alfa" },
    "tipos-de-projeto": ["backend", "frontend"], skills: [{ caminho: "skills/exemplo/SKILL.md", papeis: ["especificador"] }],
    fluxos: ["exemplo.hf"], padroes: ["sa-prd/hf.md"], tipos: { HF: "exemplo.hf" },
    rubricas: [{ id: "EX1", tipo: "HF", verificacao: "Toda HF cita a tela de origem", severidade: "IMPORTANTE" }], requer: { sabia: "2.0.0" } },
  "skills/exemplo/SKILL.md": "---\nname: exemplo\ndescription: HF do exemplo\n---\n# exemplo — histórias\n",
  "fluxo/exemplo/hf/hf.md": fm({ fluxo: "hf", dono: "sa-especificador", passos: [{ id: "escrever" }, { id: "conferir" }] }) + "# HF do exemplo\n",
  "fluxo/exemplo/hf/passos/escrever.md": fm({ resumo: "Escreve as HF." }) + "## Entrada\n\nO lote.\n\n## Faça\n\nSiga o padrão `sa-prd/hf.md` e volte ao `sa-prd.prd.escrever`.\n\n## Saída\n\nAs HF.\n\n## Pare se\n\n—\n",
  "fluxo/exemplo/hf/passos/conferir.md": fm({ resumo: "Confere as HF." }) + "## Entrada\n\nAs HF.\n\n## Faça\n\nConfira.\n\n## Saída\n\nOk.\n\n## Pare se\n\n—\n",
  "padrao/sa-prd/hf.md": fm({ resumo: "HF do exemplo." }) + "# HF (exemplo)\n",
});

/** O toolkit sintético "batch-alfa": a tarefa de job vai ao agente batch-job no passo sa-codificar.codificar.tarefa. */
const batchAlfa = () => escrever(path.join(raiz, "fontes/batch-alfa"), {
  "toolkit.json": { nome: "batch-alfa", versao: "1.0.0", descricao: "toolkit fictício de jobs", autor: { nome: "Beto Exemplo", area: "Equipe Beta" },
    "tipos-de-projeto": ["batch"], skills: [{ caminho: "skills/batch/SKILL.md", papeis: ["desenvolvedor"],
      passo: { passo: "sa-codificar.codificar.tarefa", para: "tarefa de job", arquivos: ["**/*JobConfig.java"], agente: "batch-job" } }],
    agentes: [{ nome: "batch-job", descricao: "Codifica um job", prompt: "agentes/job.md", skills: ["skills/batch/SKILL.md"] }] },
  "skills/batch/SKILL.md": "---\nname: batch\ndescription: jobs\n---\n# batch\n",
  "agentes/job.md": "Codifique o job da tarefa na base {{BASE}}.\n",
});

/** Um projeto sintético: o sabia.md (as linhas que o fluxo lê; elm = as linhas da seção ELM), o agentes.json e os extras. */
function projeto(nome, { tipos, elm = {}, toolkits = {}, passos = [] }, extra = {}) {
  const linhas = Object.entries(elm).map(([k, v]) => `| ${k} | \`${v}\` |\n`).join("");
  return escrever(path.join(raiz, nome), {
    ".sabia/sabia.md": `# Sabiá — ${nome}\n\n## Projeto\n\n| Item | Valor |\n|---|---|\n| Tipos · stack · módulos | \`${tipos}\` |\n\n## ELM\n\n| Item | Valor |\n|---|---|\n${linhas}`,
    ".sabia/config/agentes.json": { produto: ".sabia/planejamento", glossario: ".sabia/glossario.md", adr: ".sabia/adr", base: "develop",
      bundle: null, massa: null, elm: true, push_pr_no_loop: true, http_sh: false, alvos: ["kiro", "opencode"], toolkits, passos },
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
  s.ctx.perguntar = async (texto, padrao) => padrao;
  // o kiro-cli não roda no teste: o "powers install" vira a cópia da compilação para onde o Kiro a poria
  s.ctx.exec = (cmd, args) => {
    if (cmd === "kiro-cli" && args[0] === "powers" && args[1] === "install") fs.cpSync(args[2], path.join(home, ".kiro/powers/installed/sabia"), { recursive: true });
    return { status: 0, stdout: "", stderr: "" };
  };
  const fw = path.join(raiz, "fw");
  for (const f of ["fluxo", "padrao", "skills", "plugin.json", "mcp.json", "README.md", "LICENSE"]) fs.cpSync(path.join(REPO, f), path.join(fw, f), { recursive: true });
  await s.instalar({ fonte: fw, alvo: "opencode,kiro", semMcp: true });
  await s.instalarToolkit(exemplo(), { alvo: "opencode,kiro" });
  await s.instalarToolkit(batchAlfa(), { alvo: "opencode,kiro" });
});

after(() => fs.rmSync(raiz, { recursive: true, force: true }));

test("prova: o framework compilado nos dois alvos tem o catálogo, o grafo de cada fluxo igual ao do mestre e a trava do Telas", () => {
  const m = carregar(path.join(home, ".sabia/framework"));
  for (const [alvo, skills] of [["opencode", path.join(home, ".config/opencode/skills")], ["kiro", path.join(home, ".kiro/powers/installed/sabia/skills")]]) {
    for (const q of Object.keys(m.fluxos)) {
      const [sk, fl] = q.split(".");
      assert.ok(fs.readFileSync(path.join(skills, sk, "references", fl, "grafo.md"), "utf8").includes(grafoAscii(m.fluxos[q])), `${alvo} ${q}`);
    }
    const tipos = fs.readFileSync(path.join(skills, "sabia/references/tipos.md"), "utf8");
    for (const sg of ["HF", "REG", "GL", "EL", "ET", "CT", "ATA"]) assert.match(tipos, new RegExp(`^\\| \`${sg}\` \\|`, "m"), `${alvo} ${sg}`);
    assert.match(tipos, /`GL` → `REG` → `EL` → `HF` → `ET`/);
    assert.ok(!tipos.includes("(pendente)"), alvo);
  }
  // sem Telas = sim, nada de protótipo nem EL: a condição trava a linha de cada passo compilado (a trava é texto)
  const ler = (f) => fs.readFileSync(path.join(home, ".config/opencode/skills", f), "utf8");
  const enc = ler("sa-especificar/references/especificar/encaminhar.md");
  assert.match(enc, /^\| [^|]*linha Telas = `sim`[^|]*\| \*\*\[`sa-especificar\.prototipo`\]/m);
  assert.ok(enc.includes("sa-especificar.reuniao"));
  assert.match(ler("sa-prd/references/prd/escrever.md"), /^- \*\*Leiautes \(EL\)\*\* — só com a linha Telas = `sim`:/m);
  assert.match(ler("sa-especificar/references/especificar/pasta.md"), /^\*\*`prototipo\/`\*\* — só com a linha Telas = `sim`/m);
  assert.match(ler("sa-revisar/references/padrao/rubricas.md"), /^\| P12 \| Com a linha Telas do `sabia\.md` = `sim`:/m);
});

test("prova front+back: o toolkit exemplo (HF ⇢ exemplo.hf) com o override do projeto por cima, gerado e na rota", { skip: !PYTHON && "sem python3" }, () => {
  const fonte = path.join(home, ".sabia/toolkits/exemplo/fluxo/exemplo/hf/passos/escrever.md");
  const base = sha12(fonte);
  const proj = projeto("loja", { tipos: "backend, frontend", toolkits: { exemplo: { pasta: "~/.sabia/toolkits/exemplo", versao: "1.0.0" } },
    elm: { ET: "inicial no PRD + as-built", "Casos de teste": "CSV", "REG com dados técnicos": "sim", Telas: "sim" } },
  { ".sabia/fluxo/exemplo/hf/passos/escrever.md": fm({ base }) + "## Entrada\n\nO lote, com as telas do protótipo aprovado.\n" });
  const saida = gerar(proj);
  // o especificador: a linha do tipo, a skill compilada do toolkit e o passo do projeto no lugar do do toolkit
  const e = agenteKiro(proj, "sa-especificador");
  assert.ok(e.prompt.includes("no passo `sa-prd.prd.escrever`, HF → `exemplo.hf`"));
  assert.ok(e.prompt.includes("Fluxo `exemplo.hf`:\n- passo `escrever`: leia `.sabia/fluxo/exemplo/hf/passos/escrever.md`"));
  assert.ok(e.resources.includes("skill://~/.sabia/compilado-toolkits/kiro/exemplo/skills/exemplo/SKILL.md"));
  assert.ok(agenteOpencode(proj, "sa-especificador").includes("~/.sabia/compilado-toolkits/opencode/exemplo/padrao/sa-prd/hf.md"));
  assert.ok(agenteKiro(proj, "sa-revisor").prompt.includes("`EX1` (HF) IMPORTANTE — Toda HF cita a tela de origem (toolkit `exemplo`)"));
  assert.match(saida, /\| `HF` \| `exemplo\.hf` \| `~\/\.sabia\/compilado-toolkits\/<alvo>\/exemplo\/skills\/exemplo\/SKILL\.md` \| `exemplo` 1\.0\.0 \| `sa-prd\.prd\.escrever` \|/);
  // a rota: o desvio por tipo no sa-prd.prd e o passo do projeto (com a base da fonte do toolkit) no exemplo.hf
  const o = { projeto: proj };
  const prd = s.rotaFluxo("sa-prd.prd", o);
  assert.deepEqual(ordem(prd), ["1 entender", "2 entrevistar", "3 similares", "4 escrever", "5 revisao", "6 gate"]);
  assert.match(prd, /^tipo ⇢ +escrever: HF +→ exemplo\.hf +toolkit exemplo 1\.0\.0$/m);
  assert.match(prd, /│ 4 escrever ⇢ +│──▶ ⇢ tipo HF → exemplo\.hf \(toolkit exemplo 1\.0\.0\)\n.*┘ {4}⇢ por tipo: HF, REG, EL, ET\n/);
  const hf = s.rotaFluxo("exemplo.hf", o);
  assert.match(hf, /^fluxo +exemplo\.hf +dono sa-especificador +toolkit exemplo 1\.0\.0$/m);
  assert.match(hf, new RegExp(`^1 +escrever +projeto \\(base ${base}\\)`, "m"));
  assert.match(hf, /^2 +conferir +toolkit exemplo 1\.0\.0/m);
  assert.match(hf, new RegExp(`│ 1 escrever +│──▶ origem: projeto \\(base ${base}\\)`));
  // os fluxos novos da especificação, resolvidos no projeto
  const reuniao = s.rotaFluxo("sa-especificar.reuniao", o);
  assert.deepEqual(ordem(reuniao), ["1 transcricao", "2 escrever", "3 aprovar", "4 publicar", "5 decisoes"]);
  assert.match(reuniao, /│ 2 escrever ⇢ +│──▶ ⇢ por tipo: ATA\n/);
  assert.match(reuniao, /^  decisoes --> x_sa_triar_triar: fatiado.*escopo novo.*\(passagem\)$/m);
  const prot = s.rotaFluxo("sa-especificar.prototipo", o);
  assert.deepEqual(ordem(prot), ["1 registrar", "2 aprovacao"]);
  assert.match(prot, /│ 2 aprovacao +│──▶ 🔒 aprovacao-do-cliente\n/);
  assert.match(prot, /↑ volta a registrar {2}\(ajuste pedido pelo cliente \(versão nova\)\)/);
  const esp = s.rotaFluxo("sa-especificar.especificar", o);
  assert.match(esp, /│ 4 encaminhar +│──▶ ⇄ chama sa-especificar\.reuniao, sa-especificar\.prototipo, sa-prd\.prd, sa-fatiar\.fatiar\n/);
  // o que o lote e a verificação fazem com as linhas do sabia.md do projeto, nos passos compilados (opencode)
  const ler = (f) => fs.readFileSync(path.join(home, ".config/opencode/skills", f), "utf8");
  const escr = ler("sa-prd/references/prd/escrever.md");
  assert.match(escr, /^- \*\*ET inicial\*\* — só com a linha ET = `inicial no PRD \+ as-built`:/m);
  assert.match(escr, /A HF cita a EL da tela\s+\(`\*\*Telas:\*\*`\) e a EL lista as HFs que a usam \(`## Histórias`\)/);
  assert.match(ler("sa-verificar/references/verificar/casos.md"), /Gere `CT\.csv` na pasta da fatia/);
  const rub = ler("sa-revisar/references/padrao/rubricas.md");
  assert.match(rub, /^\| P12 \|.*`\*\*Telas:\*\*` na HF, `## Histórias` na EL.*\| BLOQUEANTE \|$/m);
  assert.match(rub, /^\| P13 \| Com a linha ET do `sabia\.md` = `inicial no PRD \+ as-built`: uma ET inicial do épico.*\| BLOQUEANTE \|$/m);
});

test("prova batch: o desvio do batch-alfa na tarefa de job, gerado nos dois alvos, sem tipo de toolkit", { skip: !PYTHON && "sem python3" }, () => {
  const proj = projeto("lote", { tipos: "batch",
    toolkits: { "batch-alfa": { pasta: "~/.sabia/toolkits/batch-alfa", versao: "1.0.0" } },
    passos: [{ toolkit: "batch-alfa", skill: "skills/batch/SKILL.md", agente: true }] });
  const saida = gerar(proj);
  const d = agenteKiro(proj, "sa-desenvolvedor");
  assert.ok(d.prompt.includes("`tarefa de job` (arquivos `**/*JobConfig.java`) → delegue ao subagente `batch-job`"));
  assert.ok(d.toolsSettings.subagent.availableAgents.includes("batch-job"));
  assert.equal(agenteKiro(proj, "batch-job").prompt, "Codifique o job da tarefa na base develop.\n");
  assert.ok(fs.existsSync(path.join(proj, ".opencode/agents/batch-job.md")));
  for (const n of ["sa-especificador", "sa-produto"]) assert.ok(!agenteKiro(proj, n).prompt.includes("Tipos com fluxo de toolkit"), n);
  assert.doesNotMatch(saida, /Tipos com fluxo de toolkit/);
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
