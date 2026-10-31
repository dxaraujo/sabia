#!/usr/bin/env node
// Sabiá CLI — instala, atualiza e desinstala o Sabiá e os toolkits no Kiro, no Claude Code e no opencode.
// ~/.sabia/ é a fonte (framework/ e toolkits/), cada ferramenta recebe uma cópia no padrão dela, e o
// ~/.sabia/inventario.json registra cada cópia (com o hash de cada arquivo) e cada MCP: atualizar e desinstalar
// mexem só no que está lá. Só a biblioteca padrão do Node 18+.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";

const VERSAO = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url), "utf8")).version;
const REPO = "https://github.com/dxaraujo/sabia.git";
const INDICE = "https://github.com/dxaraujo/sabia-toolkits.git";
const ALVOS = ["kiro", "claude", "opencode"];
const NOME = [
  "                               ▄▄▀",
  "███████╗ █████╗ ██████╗ ██╗ █████╗",
  "██╔════╝██╔══██╗██╔══██╗██║██╔══██╗",
  "███████╗███████║██████╔╝██║███████║",
  "╚════██║██╔══██║██╔══██╗██║██╔══██║",
  "███████║██║  ██║██████╔╝██║██║  ██║",
  "╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝╚═╝  ╚═╝",
];
// a saíra do sabia-site/logo.svg: as sete facetas (uma por etapa) e o bico, cinza para aparecer no fundo escuro
const SAIRA = [
  ["#00BBCE", [56, 57, 70, 42, 90, 38, 104, 46, 106, 62, 84, 74, 57, 70]],
  ["#B2D235", [84, 74, 106, 62, 118, 74, 116, 92, 92, 94]],
  ["#0786E3", [57, 70, 84, 74, 92, 94, 86, 122, 70, 112, 60, 92]],
  ["#2C5168", [92, 94, 116, 92, 134, 108, 112, 124, 86, 122]],
  ["#76B043", [86, 122, 112, 124, 132, 152, 118, 170, 94, 146]],
  ["#FAA61A", [134, 108, 150, 128, 150, 154, 132, 152, 112, 124]],
  ["#0094AD", [132, 152, 150, 154, 180, 196, 164, 198]],
  ["#8A8F8C", [36, 64, 56, 57, 57, 70]],
];

function naAve(x, y, p) {
  let d = false;
  for (let i = 0, j = p.length - 2; i < p.length; j = i, i += 2)
    if (p[i + 1] > y !== p[j + 1] > y && x < ((p[j] - p[i]) * (y - p[i + 1])) / (p[j + 1] - p[i + 1]) + p[i]) d = !d;
  return d;
}

/** A saíra em meio-blocos coloridos: cada caractere são dois pixels de `passo` unidades do SVG. */
function saira(cor, passo = 13) {
  // pixel: a cor que mais aparece em 4x4 amostras; vazio se menos da metade cai na ave
  const pixel = (cx, cy) => {
    if (Math.hypot(cx - 82, cy - 54) < passo * 0.55) return "#0E1210"; // o olho
    const n = {};
    for (let i = 0; i < 16; i++) {
      const x = cx + ((i % 4) + 0.5 - 2) * (passo / 4), y = cy + (Math.floor(i / 4) + 0.5 - 2) * (passo / 4);
      const c = SAIRA.find(([, p]) => naAve(x, y, p))?.[0];
      if (c) n[c] = (n[c] || 0) + 1;
    }
    const total = Object.values(n).reduce((a, b) => a + b, 0);
    return total >= 8 ? Object.entries(n).sort((a, b) => b[1] - a[1])[0][0] : null;
  };
  const linhas = [];
  for (let y = 36; y < 200; y += 2 * passo) {
    let l = "";
    for (let x = 34; x < 182; x += passo) {
      const a = pixel(x + passo / 2, y + passo / 2), b = pixel(x + passo / 2, y + 1.5 * passo);
      l += !a && !b ? " " : !b ? cor(a) + "▀\x1b[0m" : !a ? cor(b) + "▄\x1b[0m" : cor(a) + cor(b, true) + "▀\x1b[0m";
    }
    linhas.push(l);
  }
  while (!linhas.at(-1).trim()) linhas.pop();
  return linhas;
}

/** Sem terminal ou com NO_COLOR, só o nome; senão a saíra ao lado, em 24 bits ou nos 256 tons. */
export function banner({ cores = process.stdout.isTTY && !process.env.NO_COLOR, bits24 = /truecolor|24bit/.test(process.env.COLORTERM ?? "") } = {}) {
  if (!cores) return "\n" + NOME.join("\n");
  const cor = (h, fundo) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    return `\x1b[${fundo ? 48 : 38};` + (bits24 ? `2;${r};${g};${b}m` : `5;${16 + 36 * Math.round(r / 51) + 6 * Math.round(g / 51) + Math.round(b / 51)}m`);
  };
  const ave = saira(cor), largura = [...ave[0]].filter((c) => " ▀▄".includes(c)).length;
  const texto = [...NOME.map((l) => `\x1b[1m${l}\x1b[0m`), "", `\x1b[2mengenharia agêntica, da ideia ao resultado aceito  v${VERSAO}\x1b[0m`];
  return "\n" + texto.map((t, i) => (ave[i] ?? " ".repeat(largura)) + "  " + t).join("\n");
}
const BANNER = banner();

// trocáveis nos testes
export const ctx = {
  exec: (cmd, args, opcoes = {}) => spawnSync(cmd, args, { encoding: "utf8", ...opcoes }),
  perguntar: async (texto, padrao) => {
    if (!process.stdin.isTTY) return padrao;
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const r = (await rl.question(`${texto} `)).trim();
    rl.close();
    return r === "" ? padrao : r;
  },
  log: (...xs) => console.log(...xs),
};

// ---------- caminhos e inventário ----------

const home = () => os.homedir();
const sabia = (...p) => path.join(home(), ".sabia", ...p);
/** Caminho no inventário: relativo ao home, com `~/`, para ser o mesmo em qualquer máquina. */
export const curto = (p) => (p.startsWith(home() + path.sep) ? "~/" + path.relative(home(), p).split(path.sep).join("/") : p);
export const longo = (p) => (p.startsWith("~/") ? path.join(home(), ...p.slice(2).split("/")) : p);

export const PASTA_SKILLS = {
  claude: () => path.join(home(), ".claude", "skills"),
  opencode: () => path.join(home(), ".config", "opencode", "skills"),
};

export function lerInventario() {
  const f = sabia("inventario.json");
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : { versao: 1, framework: null, alvos: {}, toolkits: {} };
}

export function gravarInventario(inv) {
  fs.mkdirSync(sabia(), { recursive: true });
  fs.writeFileSync(sabia("inventario.json"), JSON.stringify(inv, null, 2) + "\n");
}

// ---------- cópias com hash ----------

function arquivos(dir, base = dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? arquivos(p, base) : [path.relative(base, p).split(path.sep).join("/")];
  });
}

export function hashes(dir) {
  return Object.fromEntries(arquivos(dir).sort().map((f) => [f, createHash("sha256").update(fs.readFileSync(path.join(dir, f))).digest("hex")]));
}

/** O que mudou na cópia desde que foi registrada: arquivos alterados, novos e apagados à mão. */
export function alteradosAMao(dir, registrado) {
  if (!fs.existsSync(dir)) return [];
  const atual = hashes(dir);
  return [...new Set([...Object.keys(atual), ...Object.keys(registrado)])].filter((f) => atual[f] !== registrado[f]);
}

/**
 * Copia `origem` para `destino` e registra em `copias` (destino curto → hashes). Destino que existe e não está no
 * inventário é de outra pessoa ou ferramenta: recusa, salvo `forcar`. Cópia alterada à mão: mostra e pergunta.
 */
export async function copiar(origem, destino, copias, { forcar = false } = {}) {
  const chave = curto(destino);
  if (fs.existsSync(destino)) {
    if (!copias[chave] && !forcar) throw new Error(`${chave} já existe e não foi instalado pelo Sabiá (use --forcar para sobrescrever)`);
    const mudou = copias[chave] ? alteradosAMao(destino, copias[chave]) : [];
    if (mudou.length && !forcar) {
      const r = await ctx.perguntar(`${chave} foi alterado à mão (${mudou.join(", ")}). Sobrescrever? [s/N]`, "n");
      if (!/^s/i.test(r)) return ctx.log(`mantido ${chave}`);
    }
    fs.rmSync(destino, { recursive: true, force: true });
  }
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.cpSync(origem, destino, { recursive: true });
  copias[chave] = hashes(destino);
  ctx.log(`copiado ${chave}`);
}

/** Apaga as cópias registradas; a alterada à mão só com "sim". */
export async function apagar(copias, { forcar = false } = {}) {
  for (const [chave, registrado] of Object.entries(copias)) {
    const destino = longo(chave);
    const mudou = alteradosAMao(destino, registrado);
    if (mudou.length && !forcar) {
      const r = await ctx.perguntar(`${chave} foi alterado à mão (${mudou.join(", ")}). Apagar mesmo assim? [s/N]`, "n");
      if (!/^s/i.test(r)) { ctx.log(`mantido ${chave}`); continue; }
    }
    fs.rmSync(destino, { recursive: true, force: true });
    delete copias[chave];
    ctx.log(`apagado ${chave}`);
  }
}

// ---------- git e fontes ----------

function git(args, cwd) {
  const r = ctx.exec("git", args, { cwd });
  if (r.status !== 0) throw new Error(`git ${args.join(" ")}: ${(r.stderr || r.error?.message || "").trim()}`);
  return (r.stdout || "").trim();
}

/** `<url ou pasta>[@ref]` — o `@` da ref vem depois do último `/` e do último `:` (não confunde com `git@host:`). */
export function separarRef(fonte) {
  const i = fonte.lastIndexOf("@");
  return i > fonte.lastIndexOf("/") && i > fonte.lastIndexOf(":") && i > 0 ? [fonte.slice(0, i), fonte.slice(i + 1)] : [fonte, null];
}

/**
 * Baixa `url` (ou copia a pasta local) na `ref`, confere o `sha` e devolve { pasta, sha }. Clona com o git da
 * pessoa (credencial, SSH, CA), sem submódulos; nunca guarda token nem executa nada do que baixou.
 */
export function baixar(url, { ref = null, sha = null, subpasta = null } = {}) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "sabia-"));
  const repo = path.join(tmp, "repo");
  let atual = null;
  if (fs.existsSync(url) && fs.statSync(url).isDirectory()) {
    fs.cpSync(url, repo, { recursive: true, filter: (f) => path.basename(f) !== ".git" });
    if (fs.existsSync(path.join(url, ".git"))) atual = git(["rev-parse", ref || "HEAD"], url);
  } else {
    git(["clone", "--quiet", "--depth", "1", "--no-recurse-submodules", ...(ref ? ["--branch", ref] : []), url, repo]);
    atual = git(["rev-parse", "HEAD"], repo);
    fs.rmSync(path.join(repo, ".git"), { recursive: true, force: true });
  }
  if (sha && !(atual || "").startsWith(sha)) throw new Error(`${url}@${ref}: sha ${atual} ≠ ${sha} esperado no índice`);
  const pasta = subpasta ? path.join(repo, dentro(subpasta, url)) : repo;
  if (!fs.existsSync(pasta)) throw new Error(`${url}: não há a subpasta ${subpasta}`);
  return { pasta, sha: atual };
}

/** Caminho do manifesto preso à pasta: relativo, com `/`, sem `..`. */
export function dentro(caminho, de) {
  if (typeof caminho !== "string" || /^([/\\~]|[A-Za-z]:)/.test(caminho) || caminho.includes("\\") || caminho.split("/").includes(".."))
    throw new Error(`${de}: caminho fora da pasta: ${caminho}`);
  return caminho;
}

// ---------- framework ----------

const skillsDoFluxo = (fw) => fs.readdirSync(path.join(fw, "skills")).filter((d) => d === "sabia" || d.startsWith("sa-"));

function temComando(cmd) {
  const r = ctx.exec(cmd, ["--version"]);
  return !r.error && r.status === 0;
}

export function detectarAlvos() {
  return ALVOS.filter((a) => temComando({ kiro: "kiro-cli", claude: "claude", opencode: "opencode" }[a]));
}

async function escolherAlvos(opcoes) {
  if (opcoes.alvo) {
    const alvos = opcoes.alvo.split(",");
    const fora = alvos.filter((a) => !ALVOS.includes(a));
    if (fora.length) throw new Error(`ferramenta desconhecida: ${fora.join(", ")} (use ${ALVOS.join(", ")})`);
    return alvos;
  }
  const achadas = detectarAlvos();
  const r = await ctx.perguntar(`Ferramentas do time (${ALVOS.join(", ")}) [${achadas.join(",") || "nenhuma achada"}]:`, achadas.join(","));
  return r.split(",").map((a) => a.trim()).filter(Boolean);
}

function servidoresMcp(fw) {
  return JSON.parse(fs.readFileSync(path.join(fw, "mcp.json"), "utf8")).mcpServers;
}

function configOpencode() {
  return ["opencode.jsonc", "opencode.json"].map((f) => path.join(home(), ".config", "opencode", f)).find((f) => fs.existsSync(f));
}

/** Quais MCPs já existem no opencode (lê o JSONC sem os comentários). */
export function mcpsDoOpencode() {
  const arq = configOpencode();
  if (!arq) return [];
  const sem = fs.readFileSync(arq, "utf8").replace(/("(?:\\.|[^"\\])*")|\/\/[^\n]*|\/\*[\s\S]*?\*\//g, (m, s) => s || "")
    .replace(/,(\s*[}\]])/g, "$1");
  const c = JSON.parse(sem);
  return Object.keys(c.mcp?.servers || c.mcp || {});
}

/** O opencode 2.x não tem `mcp remove`: tira do arquivo se ele é JSON puro; com comentários, não o reescreve e avisa. */
function tirarMcpDoOpencode(nome) {
  const arq = configOpencode();
  if (!arq) return;
  try {
    const c = JSON.parse(fs.readFileSync(arq, "utf8"));
    const servidores = c.mcp?.servers || c.mcp || {};
    delete servidores[nome];
    fs.writeFileSync(arq, JSON.stringify(c, null, 2) + "\n");
    ctx.log(`MCP ${nome} tirado do opencode`);
  } catch {
    ctx.log(`opencode: tire o MCP ${nome} de mcp.servers no ${curto(arq)} (o arquivo tem comentários; não o reescrevo)`);
  }
}

async function registrarMcps(alvo, fw, reg) {
  reg.mcp ||= [];
  const ja = alvo === "opencode" ? mcpsDoOpencode() : [];
  for (const [nome, s] of Object.entries(servidoresMcp(fw))) {
    const env = Object.entries(s.env || {}).map(([k, v]) => `${k}=${v}`);
    let r;
    if (alvo === "claude") {
      if (ctx.exec("claude", ["mcp", "get", nome]).status === 0) { ctx.log(`MCP ${nome} já existe no Claude Code — mantido`); continue; }
      // o nome vem antes do -e, que aceita vários valores e engoliria o nome
      r = ctx.exec("claude", ["mcp", "add", "--scope", "user", nome, ...env.flatMap((e) => ["-e", e]), "--", s.command, ...s.args]);
    } else {
      if (ja.includes(nome)) { ctx.log(`MCP ${nome} já existe no opencode — mantido`); continue; }
      r = ctx.exec("opencode", ["mcp", "add", "--global", ...env.flatMap((e) => ["--env", e]), nome, "--", s.command, ...s.args]);
    }
    if (r.status !== 0) throw new Error(`MCP ${nome} no ${alvo}: ${(r.stderr || r.error?.message || "").trim()}`);
    if (!reg.mcp.includes(nome)) reg.mcp.push(nome);
    ctx.log(`MCP ${nome} registrado no ${alvo}`);
  }
}

async function instalarAlvo(alvo, inv, opcoes) {
  const fw = sabia("framework");
  if (alvo === "kiro") {
    const nosso = inv.alvos.kiro?.power;
    // o painel Powers instala em ~/.kiro/powers/installed/sabia: fora do inventário, é de outra instalação
    if (!nosso && fs.existsSync(path.join(home(), ".kiro", "powers", "installed", "sabia")) && !opcoes.forcar)
      throw new Error("o power sabia já está no Kiro e não foi instalado pelo CLI (desinstale pelo painel Powers ou use --forcar)");
    if (nosso || opcoes.forcar) ctx.exec("kiro-cli", ["powers", "uninstall", "sabia"]);
    const r = ctx.exec("kiro-cli", ["powers", "install", fw]);
    if (r.status !== 0) throw new Error(`kiro-cli powers install: ${(r.stderr || r.error?.message || "").trim()}`);
    inv.alvos.kiro = { power: "sabia" };
    ctx.log("power sabia instalado no Kiro");
    if (fs.existsSync(path.join(home(), ".kiro", "powers", "installed", "sdd")))
      ctx.log("aviso: o power antigo sdd ainda está no Kiro e concorre com o sabia (desinstale pelo painel Powers se não usa mais)");
    return;
  }
  const reg = (inv.alvos[alvo] ||= { copias: {}, mcp: [] });
  for (const s of skillsDoFluxo(fw)) await copiar(path.join(fw, "skills", s), path.join(PASTA_SKILLS[alvo](), s), reg.copias, opcoes);
  if (!opcoes.semMcp) await registrarMcps(alvo, fw, reg);
  if (alvo === "opencode") {
    const velhas = fs.existsSync(PASTA_SKILLS.opencode()) ? fs.readdirSync(PASTA_SKILLS.opencode()).filter((d) => /^sdd/.test(d)) : [];
    if (velhas.length) ctx.log(`aviso: skills antigas no opencode concorrem com as sa-*: ${velhas.join(", ")} (remova se não usa mais)`);
  }
}

/** Baixa o framework para uma pasta temporária e diz o que muda em relação a ~/.sabia/framework/. */
function baixarFramework(opcoes) {
  const versao = opcoes.versao || VERSAO;
  const [url, ref] = opcoes.fonte ? separarRef(opcoes.fonte) : [REPO, `sabia-${versao}`];
  const { pasta, sha } = baixar(url, { ref });
  if (!fs.existsSync(path.join(pasta, "skills", "sa-setup", "SKILL.md"))) throw new Error(`${url}: não parece o Sabiá (falta skills/sa-setup)`);
  const plugin = JSON.parse(fs.readFileSync(path.join(pasta, "plugin.json"), "utf8"));
  return { pasta, sha, versao: plugin.version, fonte: opcoes.fonte || REPO };
}

export function diferencas(antes, depois) {
  const a = fs.existsSync(antes) ? hashes(antes) : {};
  const d = hashes(depois);
  return {
    novos: Object.keys(d).filter((f) => !(f in a)),
    alterados: Object.keys(d).filter((f) => f in a && a[f] !== d[f]),
    removidos: Object.keys(a).filter((f) => !(f in d)),
  };
}

function mostrarDiferencas(dif) {
  for (const [rotulo, xs] of Object.entries(dif)) if (xs.length) ctx.log(`  ${rotulo} (${xs.length}): ${xs.slice(0, 20).join(", ")}${xs.length > 20 ? ", …" : ""}`);
  return Object.values(dif).some((xs) => xs.length);
}

export async function instalar(opcoes = {}) {
  ctx.log(BANNER + "\n");
  const inv = lerInventario();
  const novo = baixarFramework(opcoes);
  fs.rmSync(sabia("framework"), { recursive: true, force: true });
  fs.mkdirSync(sabia(), { recursive: true });
  fs.cpSync(novo.pasta, sabia("framework"), { recursive: true });
  inv.framework = { versao: novo.versao, sha: novo.sha, fonte: novo.fonte, instalado_em: new Date().toISOString() };
  ctx.log(`Sabiá ${novo.versao} em ~/.sabia/framework`);
  try {
    for (const alvo of await escolherAlvos(opcoes)) await instalarAlvo(alvo, inv, opcoes);
  } finally {
    gravarInventario(inv);
  }
  ctx.log('Pronto: skills e MCPs instalados. Os agentes são de cada projeto: abra a ferramenta na raiz dele, na sessão\n' +
    'padrão, e peça "configurar o Sabiá" (ou, num projeto já configurado, "atualizar os agentes do Sabiá").');
}

export async function atualizar(opcoes = {}) {
  const inv = lerInventario();
  if (!inv.framework) throw new Error("o Sabiá não está instalado: rode `sabia instalar`");
  const novo = baixarFramework({ fonte: inv.framework.fonte === REPO ? undefined : inv.framework.fonte, ...opcoes });
  ctx.log(`Sabiá ${inv.framework.versao} → ${novo.versao}`);
  if (!mostrarDiferencas(diferencas(sabia("framework"), novo.pasta))) return ctx.log("nada mudou");
  if (!/^s/i.test(await ctx.perguntar("Atualizar? [s/N]", "n"))) return ctx.log("nada foi alterado");
  fs.rmSync(sabia("framework"), { recursive: true, force: true });
  fs.cpSync(novo.pasta, sabia("framework"), { recursive: true });
  inv.framework = { ...inv.framework, versao: novo.versao, sha: novo.sha, instalado_em: new Date().toISOString() };
  try {
    for (const alvo of Object.keys(inv.alvos)) {
      if (alvo !== "kiro") {  // skill que saiu do framework sai da ferramenta
        const copias = inv.alvos[alvo].copias;
        const fica = new Set(skillsDoFluxo(sabia("framework")).map((s) => curto(path.join(PASTA_SKILLS[alvo](), s))));
        const sai = Object.fromEntries(Object.entries(copias).filter(([k]) => !fica.has(k)));
        await apagar(sai, opcoes);
        for (const k of Object.keys(copias)) if (!fica.has(k) && !(k in sai)) delete copias[k];
      }
      await instalarAlvo(alvo, inv, { ...opcoes, semMcp: true });
    }
  } finally {
    gravarInventario(inv);
  }
  ctx.log('Pronto. Em cada projeto, peça "atualizar os agentes do Sabiá".');
}

export async function desinstalar(opcoes = {}) {
  const inv = lerInventario();
  const alvos = opcoes.alvo ? opcoes.alvo.split(",") : Object.keys(inv.alvos);
  try {
    for (const alvo of alvos) {
      const reg = inv.alvos[alvo];
      if (!reg) { ctx.log(`${alvo}: nada instalado pelo Sabiá`); continue; }
      for (const tk of Object.values(inv.toolkits)) if (tk.alvos?.[alvo]) { await apagar(tk.alvos[alvo].copias, opcoes); delete tk.alvos[alvo]; }
      if (alvo === "kiro") ctx.exec("kiro-cli", ["powers", "uninstall", reg.power]);
      else await apagar(reg.copias, opcoes);
      for (const nome of reg.mcp || []) {
        if (alvo === "claude") ctx.exec("claude", ["mcp", "remove", "--scope", "user", nome]);
        else tirarMcpDoOpencode(nome);
      }
      if (alvo !== "kiro" && Object.keys(reg.copias).length) continue;  // ficou cópia alterada à mão
      delete inv.alvos[alvo];
      ctx.log(`${alvo}: Sabiá desinstalado`);
    }
    if (!Object.keys(inv.alvos).length) {
      fs.rmSync(sabia("framework"), { recursive: true, force: true });
      inv.framework = null;
    }
  } finally {
    gravarInventario(inv);
  }
}

// ---------- toolkits ----------

/** Erros do toolkit.json: campos, nome, caminhos presos à pasta e arquivos que existem (o schema completo é o da setup). */
export function validarToolkit(pasta, nomeEsperado = null) {
  const f = path.join(pasta, "toolkit.json");
  if (!fs.existsSync(f)) return ["falta o toolkit.json"];
  let m;
  try { m = JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { return [`toolkit.json inválido: ${e.message}`]; }
  const erros = [];
  for (const c of ["nome", "versao", "descricao", "tipos-de-projeto", "skills"]) if (!(c in m)) erros.push(`falta o campo ${c}`);
  const nomeOk = (n) => typeof n === "string" && /^[a-z0-9][a-z0-9-]*$/.test(n) && !n.startsWith("sa-");
  if (!nomeOk(m.nome)) erros.push(`nome inválido (kebab-case, sem sa-): ${m.nome}`);
  if (nomeEsperado && m.nome !== nomeEsperado) erros.push(`nome ${m.nome} ≠ ${nomeEsperado} do índice`);
  if (m.customiza && (!nomeOk(m.customiza.toolkit) || m.customiza.toolkit === m.nome || typeof m.customiza.versao !== "string"))
    erros.push("customiza: precisa de toolkit (outro nome, kebab-case) e versao da base");
  const existe = (c, de) => {
    try { if (!fs.existsSync(path.join(pasta, dentro(c, de)))) erros.push(`${de}: não existe ${c}`); } catch (e) { erros.push(e.message); }
  };
  const agentes = new Set((m.agentes || []).map((a) => a.nome));
  for (const s of m.skills || []) {
    existe(s.caminho, "skills");
    if (s.passo?.agente && !agentes.has(s.passo.agente)) erros.push(`passo de ${s.caminho}: agente ${s.passo.agente} não está em agentes`);
  }
  for (const s of m.steering || []) existe(s.caminho, "steering");
  for (const a of m.agentes || []) {
    if (!nomeOk(a.nome)) erros.push(`agente com nome inválido (kebab-case, sem sa-): ${a.nome}`);
    existe(a.prompt, `agente ${a.nome}`);
    for (const s of a.skills || []) existe(s, `agente ${a.nome}`);
    for (const s of a.subagentes || []) if (!agentes.has(s)) erros.push(`agente ${a.nome}: subagente ${s} não está em agentes`);
  }
  return erros;
}

function indices() {
  const f = sabia("indices.json");
  return [INDICE, ...(fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : [])];
}

/** Entradas do índice (`.claude-plugin/marketplace.json`), cada uma resolvida para { nome, versao, url, ref, sha, subpasta }. */
export function lerIndice(fonte) {
  const local = fs.existsSync(fonte);
  const raiz = local ? fonte : baixar(fonte).pasta;
  const m = JSON.parse(fs.readFileSync(path.join(raiz, ".claude-plugin", "marketplace.json"), "utf8"));
  return (m.plugins || []).map((p) => {
    const s = p.source;
    const base = { nome: p.name, versao: p.version, descricao: p.description, indice: fonte };
    if (typeof s === "string") return { ...base, url: local ? path.resolve(raiz, dentro(s.replace(/^\.\//, ""), fonte)) : fonte, subpasta: local ? null : s.replace(/^\.\//, "") };
    if (s?.source === "github") return { ...base, url: `https://github.com/${s.repo}.git`, ref: s.ref, sha: s.sha };
    if (s?.source === "url") return { ...base, url: s.url, ref: s.ref, sha: s.sha };
    if (s?.source === "git-subdir") return { ...base, url: s.url, ref: s.ref, sha: s.sha, subpasta: s.path };
    throw new Error(`${fonte}: fonte de ${p.name} não suportada (${JSON.stringify(s)}); use caminho, github, url ou git-subdir`);
  });
}

function acharNoIndice(nome, versao, opcoes) {
  for (const i of opcoes.indice ? [opcoes.indice] : indices()) {
    const e = lerIndice(i).find((x) => x.nome === nome && (!versao || x.versao === versao));
    if (e) return e;
  }
  throw new Error(`toolkit ${nome}${versao ? "@" + versao : ""} não está nos índices`);
}

export async function baixarToolkit(alvo, opcoes = {}) {
  const ehUrl = /[:/]/.test(alvo) && !/^[a-z0-9-]+(@[\w.-]+)?$/.test(alvo);
  const [nomeOuUrl, versaoOuRef] = separarRef(alvo);
  const e = ehUrl ? { nome: null, url: nomeOuUrl, ref: versaoOuRef } : acharNoIndice(nomeOuUrl, versaoOuRef, opcoes);
  const { pasta, sha } = baixar(e.url, e);
  const erros = validarToolkit(pasta, e.nome);
  if (erros.length) throw new Error(`toolkit recusado:\n- ${erros.join("\n- ")}`);
  const m = JSON.parse(fs.readFileSync(path.join(pasta, "toolkit.json"), "utf8"));
  const destino = sabia("toolkits", m.nome);
  const dif = diferencas(destino, pasta);
  if (fs.existsSync(destino)) {
    ctx.log(`toolkit ${m.nome}: ${JSON.parse(fs.readFileSync(path.join(destino, "toolkit.json"), "utf8")).versao} → ${m.versao}`);
    if (!mostrarDiferencas(dif)) { ctx.log("nada mudou"); return m.nome; }
    if (!/^s/i.test(await ctx.perguntar("Substituir? [s/N]", "n"))) { ctx.log("nada foi alterado"); return null; }
    fs.rmSync(destino, { recursive: true, force: true });
  }
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.cpSync(pasta, destino, { recursive: true });
  const origem = { indice: e.indice || null, url: e.url, ref: e.ref || null, sha, versao: m.versao };
  fs.writeFileSync(path.join(destino, ".origem.json"), JSON.stringify(origem, null, 2) + "\n");
  const inv = lerInventario();
  inv.toolkits[m.nome] = { ...(inv.toolkits[m.nome] || { alvos: {} }), versao: m.versao, sha, fonte: e.url };
  gravarInventario(inv);
  ctx.log(`toolkit ${m.nome} ${m.versao} em ~/.sabia/toolkits/${m.nome}`);
  return m.nome;
}

/** Copia as skills do toolkit para as ferramentas (o Kiro lê de ~/.sabia/toolkits pelo `skill://` de cada agente). */
export async function instalarToolkit(alvo, opcoes = {}) {
  const [nome] = separarRef(alvo);
  const baixado = fs.existsSync(sabia("toolkits", nome, "toolkit.json")) && !opcoes.atualizar ? nome : await baixarToolkit(alvo, opcoes);
  if (!baixado) return;
  const pasta = sabia("toolkits", baixado);
  const m = JSON.parse(fs.readFileSync(path.join(pasta, "toolkit.json"), "utf8"));
  const inv = lerInventario();
  // a customização é uma cópia modificada da base: as duas juntas no projeto dão skills e agentes repetidos
  const familia = m.customiza?.toolkit ?? baixado;
  const rival = Object.keys(inv.toolkits).find((n) => n !== baixado && (baseDe(n) ?? n) === familia);
  if (rival) ctx.log(`aviso: ${baixado} e ${rival} são versões do mesmo toolkit (base ${familia}); use um só: sabia toolkits remover ${rival}`);
  const tk = (inv.toolkits[baixado] ||= { versao: m.versao, alvos: {} });
  const alvos = opcoes.alvo ? opcoes.alvo.split(",") : Object.keys(inv.alvos).length ? Object.keys(inv.alvos) : await escolherAlvos(opcoes);
  try {
    for (const a of alvos.filter((x) => x !== "kiro")) {
      const reg = (tk.alvos[a] ||= { copias: {} });
      for (const s of m.skills) {
        const dir = path.dirname(path.join(pasta, s.caminho));
        await copiar(dir, path.join(PASTA_SKILLS[a](), path.basename(dir)), reg.copias, opcoes);
      }
    }
  } finally {
    gravarInventario(inv);
  }
  if (alvos.includes("kiro")) ctx.log(`kiro: o gerador liga as skills de ~/.sabia/toolkits/${baixado} a cada agente (nada copiado para ~/.kiro)`);
  ctx.log('No projeto, peça "atualizar os agentes do Sabiá" para ligar o toolkit.');
}

/** Sem argumento, dentro de um projeto: as versões que o `.sabia/config/agentes.json` dele usa. */
export async function instalarDoProjeto(opcoes = {}) {
  const f = path.join(process.cwd(), ".sabia", "config", "agentes.json");
  if (!fs.existsSync(f)) throw new Error("diga o toolkit, ou rode dentro de um projeto com .sabia/config/agentes.json");
  const inv = lerInventario();
  for (const [nome, t] of Object.entries(JSON.parse(fs.readFileSync(f, "utf8")).toolkits || {})) {
    if (inv.toolkits[nome]?.versao === t.versao) { ctx.log(`toolkit ${nome} ${t.versao} já instalado`); continue; }
    await instalarToolkit(`${nome}@${t.versao}`, { ...opcoes, atualizar: true });
  }
}

export async function removerToolkit(nome, opcoes = {}) {
  const inv = lerInventario();
  const tk = inv.toolkits[nome];
  try {
    for (const reg of Object.values(tk?.alvos || {})) await apagar(reg.copias, opcoes);
    fs.rmSync(sabia("toolkits", nome), { recursive: true, force: true });
    delete inv.toolkits[nome];
  } finally {
    gravarInventario(inv);
  }
  ctx.log(`toolkit ${nome} removido`);
}

export async function atualizarToolkits(nome, opcoes = {}) {
  const inv = lerInventario();
  for (const n of nome ? [nome] : Object.keys(inv.toolkits)) {
    const origem = JSON.parse(fs.readFileSync(sabia("toolkits", n, ".origem.json"), "utf8"));
    const alvo = origem.indice ? n : `${origem.url}${origem.ref ? "@" + origem.ref : ""}`;
    await instalarToolkit(alvo, { ...opcoes, atualizar: true, indice: origem.indice || opcoes.indice,
      alvo: Object.keys(inv.toolkits[n]?.alvos || {}).join(",") || "kiro" });
  }
}

/** A base que o toolkit baixado customiza (do toolkit.json em ~/.sabia/toolkits), ou null. */
function baseDe(nome) {
  const f = sabia("toolkits", nome, "toolkit.json");
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")).customiza?.toolkit ?? null : null;
}

export function listarToolkits(opcoes = {}) {
  const inv = lerInventario();
  const projeto = path.join(process.cwd(), ".sabia", "config", "agentes.json");
  const doProjeto = fs.existsSync(projeto) ? JSON.parse(fs.readFileSync(projeto, "utf8")).toolkits || {} : {};
  const linhas = [];
  for (const i of opcoes.indice ? [opcoes.indice] : indices()) {
    try {
      for (const e of lerIndice(i)) linhas.push([e.nome, e.versao || "—", inv.toolkits[e.nome]?.versao || "—", doProjeto[e.nome]?.versao || "—", e.descricao || ""]);
    } catch (err) {
      ctx.log(`índice ${i}: ${err.message}`);
    }
  }
  for (const [n, t] of Object.entries(inv.toolkits)) if (!linhas.some((l) => l[0] === n)) linhas.push([n, "—", t.versao, doProjeto[n]?.versao || "—", "(fora dos índices)"]);
  // a customização logo abaixo da base, com ↳ e de onde veio
  for (const l of [...linhas]) {
    const f = sabia("toolkits", l[0], "toolkit.json");
    const c = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")).customiza : null;
    if (!c) continue;
    linhas.splice(linhas.indexOf(l), 1);
    const i = linhas.findIndex((b) => b[0] === c.toolkit);
    // só a primeira mudança (quem customizou), como resumo; a lista inteira está no toolkit.json
    l[4] = `customiza ${c.toolkit} ${c.versao}${c.mudancas?.length ? `: ${c.mudancas[0]}${c.mudancas.length > 1 ? "; …" : ""}` : ""}${l[4] ? " — " + l[4] : ""}`;
    l[0] = `↳ ${l[0]}`;
    linhas.splice(i < 0 ? linhas.length : i + 1, 0, l);
  }
  ctx.log(["| Toolkit | No índice | Instalado | Neste projeto | Descrição |", "|---|---|---|---|---|",
    ...linhas.map((l) => `| ${l.join(" | ")} |`)].join("\n"));
  return linhas;
}

// ---------- linha de comando ----------

const AJUDA = `${BANNER}

sabia ${VERSAO} — instala o Sabiá e os toolkits no Kiro, no Claude Code e no opencode

  sabia instalar   [--alvo kiro,claude,opencode] [--versao X] [--fonte <pasta|url-git>[@ref]]
  sabia atualizar  [--versao X]
  sabia desinstalar [--alvo …]
  sabia toolkits listar   [--indice <url-git|pasta>]
  sabia toolkits baixar   <nome>[@versao] | <url-git>[@ref]
  sabia toolkits instalar <nome>[@versao] | <url-git>[@ref]  [--alvo …]   (sem argumento, no projeto: as versões dele)
  sabia toolkits atualizar [<nome>]
  sabia toolkits remover  <nome>

  --sim       responde "sim" às confirmações (cópia alterada à mão continua perguntando, salvo --forcar)
  --forcar    sobrescreve o que não foi instalado pelo Sabiá ou foi alterado à mão
  --sem-mcp   não registra os MCPs

Tudo fica em ~/.sabia/ (framework/, toolkits/, inventario.json).`;

export function lerArgs(argv) {
  const posicionais = [];
  const opcoes = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) { posicionais.push(a); continue; }
    const chave = a.slice(2).replace(/-(\w)/g, (_, c) => c.toUpperCase());
    if (["sim", "forcar", "semMcp", "ajuda", "help"].includes(chave)) opcoes[chave] = true;
    else opcoes[chave] = argv[++i];
  }
  return { posicionais, opcoes };
}

export async function main(argv = process.argv.slice(2)) {
  const { posicionais: [cmd, sub, arg], opcoes } = lerArgs(argv);
  if (opcoes.sim) {  // cópia alterada à mão continua perguntando: só o --forcar passa por cima
    const antes = ctx.perguntar;
    ctx.perguntar = async (texto, padrao) => (/alterado à mão/.test(texto) ? antes(texto, padrao) : /\[s\/N\]/.test(texto) ? "s" : padrao);
  }
  try {
    if (cmd === "instalar") await instalar(opcoes);
    else if (cmd === "atualizar") await atualizar(opcoes);
    else if (cmd === "desinstalar") await desinstalar(opcoes);
    else if (cmd === "toolkits" && sub === "listar") listarToolkits(opcoes);
    else if (cmd === "toolkits" && sub === "baixar" && arg) await baixarToolkit(arg, opcoes);
    else if (cmd === "toolkits" && sub === "instalar") await (arg ? instalarToolkit(arg, opcoes) : instalarDoProjeto(opcoes));
    else if (cmd === "toolkits" && sub === "atualizar") await atualizarToolkits(arg, opcoes);
    else if (cmd === "toolkits" && sub === "remover" && arg) await removerToolkit(arg, opcoes);
    else { ctx.log(AJUDA); return cmd && !opcoes.ajuda && !opcoes.help ? 1 : 0; }
    return 0;
  } catch (e) {
    console.error(`sabia: ${e.message}`);
    return 1;
  }
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = await main();
