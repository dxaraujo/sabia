#!/usr/bin/env node
// Sabiá CLI — instala, atualiza e desinstala o Sabiá e os toolkits no Kiro e no opencode, e explica a rota (`sabia rota`).
// ~/.sabia/ é a fonte (framework/ e toolkits/), cada ferramenta recebe uma cópia no padrão dela, e o
// ~/.sabia/inventario.json registra cada cópia (com o hash de cada arquivo) e cada MCP: atualizar e desinstalar
// mexem só no que está lá. Node 18+ e o @clack/prompts (as perguntas e as linhas ┌ ◇ └).
import { cancel, confirm, intro, isCancel, log, multiselect, note, outro, spinner, updateSettings } from "@clack/prompts";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ALIAS_PASSO, carregar, compilar, grafoAscii, LEGENDA, partes, temDesvio, validarToolkitFonte } from "./compilar.mjs";

const VERSAO = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url), "utf8")).version;
const REPO = "https://github.com/dxaraujo/sabia.git";
const INDICE = "https://github.com/dxaraujo/sabia-toolkits.git";
const ALVOS = ["kiro", "opencode"];
const NOME = [
  "                               ▄▄▀",
  "███████╗ █████╗ ██████╗ ██╗ █████╗",
  "██╔════╝██╔══██╗██╔══██╗██║██╔══██╗",
  "███████╗███████║██████╔╝██║███████║",
  "╚════██║██╔══██║██╔══██╗██║██╔══██║",
  "███████║██║  ██║██████╔╝██║██║  ██║",
  "╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝╚═╝  ╚═╝",
];
// o sabiá do sabia-site/logo.svg: as sete facetas (uma por etapa) e o bico, cinza para aparecer no fundo escuro
const SABIA = [
  ["#00BBCE", [56, 57, 70, 42, 90, 38, 104, 46, 106, 62, 84, 74, 57, 70]],
  ["#B2D235", [84, 74, 106, 62, 118, 74, 116, 92, 92, 94]],
  ["#0786E3", [57, 70, 84, 74, 92, 94, 86, 122, 70, 112, 60, 92]],
  ["#2C5168", [92, 94, 116, 92, 134, 108, 112, 124, 86, 122]],
  ["#76B043", [86, 122, 112, 124, 132, 152, 118, 170, 94, 146]],
  ["#FAA61A", [134, 108, 150, 128, 150, 154, 132, 152, 112, 124]],
  ["#0094AD", [132, 152, 150, 154, 180, 196, 164, 198]],
  ["#8A8F8C", [36, 64, 56, 57, 57, 70]],
];

function noSabia(x, y, p) {
  let d = false;
  for (let i = 0, j = p.length - 2; i < p.length; j = i, i += 2)
    if (p[i + 1] > y !== p[j + 1] > y && x < ((p[j] - p[i]) * (y - p[i + 1])) / (p[j + 1] - p[i + 1]) + p[i]) d = !d;
  return d;
}

/** O sabiá em meio-blocos coloridos: cada caractere são dois pixels de `passo` unidades do SVG. */
function desenharSabia(cor, passo = 13) {
  // pixel: a cor que mais aparece em 4x4 amostras; vazio se menos da metade cai no sabiá
  const pixel = (cx, cy) => {
    if (Math.hypot(cx - 82, cy - 54) < passo * 0.55) return "#0E1210"; // o olho
    const n = {};
    for (let i = 0; i < 16; i++) {
      const x = cx + ((i % 4) + 0.5 - 2) * (passo / 4), y = cy + (Math.floor(i / 4) + 0.5 - 2) * (passo / 4);
      const c = SABIA.find(([, p]) => noSabia(x, y, p))?.[0];
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

/** Sem terminal ou com NO_COLOR, só o nome; senão o sabiá ao lado, em 24 bits ou nos 256 tons. */
export function banner({ cores = process.stdout.isTTY && !process.env.NO_COLOR, bits24 = /truecolor|24bit/.test(process.env.COLORTERM ?? "") } = {}) {
  if (!cores) return "\n" + NOME.join("\n");
  const cor = (h, fundo) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    return `\x1b[${fundo ? 48 : 38};` + (bits24 ? `2;${r};${g};${b}m` : `5;${16 + 36 * Math.round(r / 51) + 6 * Math.round(g / 51) + Math.round(b / 51)}m`);
  };
  const desenho = desenharSabia(cor), largura = [...desenho[0]].filter((c) => " ▀▄".includes(c)).length;
  const texto = [...NOME.map((l) => `\x1b[1m${l}\x1b[0m`), "", `\x1b[2mengenharia agêntica, da ideia ao resultado aceito  v${VERSAO}\x1b[0m`];
  return "\n" + texto.map((t, i) => (desenho[i] ?? " ".repeat(largura)) + "  " + t).join("\n");
}
const BANNER = banner();

/** Esc, Ctrl+C ou "não" no confirm: as perguntas vêm antes de qualquer gravação, então nada mudou. */
export class Cancelado extends Error {}

// o que o clack escreve sozinho (Ctrl+C no meio do spinner, por exemplo) sai em português
updateSettings({ messages: { cancel: "cancelado — nada foi alterado", error: "falhou" } });
let quadroAberto = false;  // ┌ sem └: o erro do main fecha o quadro

// trocáveis nos testes
export const ctx = {
  exec: (cmd, args, opcoes = {}) => spawnSync(cmd, args, { encoding: "utf8", ...opcoes }),
  log: (...xs) => console.log(...xs),
  interativo: Boolean(process.stdin.isTTY && process.stdout.isTTY && !process.env.CI),
  /** Multisseleção. opcoes: [{ valor, rotulo, dica, marcado }]; devolve a lista dos valores marcados. */
  escolher: async ({ mensagem, opcoes, minimo = 0 }) => {
    const options = opcoes.map((o) => ({ value: o.valor, label: o.rotulo, hint: o.dica }));
    for (;;) {
      // o required do clack avisa em inglês: a regra do mínimo fica aqui
      const r = await multiselect({ message: `${mensagem} (espaço marca · a marca todas · enter confirma)`, options, required: false,
        initialValues: opcoes.filter((o) => o.marcado).map((o) => o.valor) });
      if (isCancel(r)) throw new Cancelado();
      if (r.length >= minimo) return r;
      log.warn(`marque pelo menos ${minimo}`);
    }
  },
  confirmar: async (mensagem, padrao) => {
    const r = await confirm({ message: mensagem, initialValue: padrao, active: "Sim", inactive: "Não" });
    if (isCancel(r)) throw new Cancelado();
    return r;
  },
  tela: {
    abrir: (t) => { quadroAberto = true; intro(t); },
    fechar: (t) => { quadroAberto = false; outro(t); },
    passo: (t) => log.step(t),
    ok: (t) => log.message(t, { symbol: "✓" }),
    aviso: (t) => log.warn(t),
    marca: (simbolo, t) => log.message(t, { symbol: simbolo }),
    nota: (t, titulo) => note(t, titulo),
    cancelar: (t) => { quadroAberto = false; cancel(t); },
    /** `fn` é síncrona (o git roda com spawnSync): o spinner não gira, mas mostra o que está acontecendo. */
    esperar(texto, fn, fim) {
      if (!ctx.interativo) { const r = fn(); log.step(fim(r)); return r; }
      const s = spinner({ cancelMessage: texto });  // Ctrl+C: o passo fica riscado e o main diz "cancelado"
      s.start(texto);
      try { const r = fn(); s.stop(fim(r)); return r; } catch (e) { s.error(texto); throw e; }
    },
  },
};

const qt = (n, nome) => `${n} ${nome}${n === 1 ? "" : "s"}`;

/** Antes de mexer no disco: -y vale como sim; sem terminal, erro com o comando a rodar (o da pessoa, com as flags dela,
 * quando veio do main); "não" cancela. */
async function confirmar(opcoes, texto, padrao, uso) {
  if (opcoes.sim) return;
  if (!ctx.interativo) throw new Error(`preciso confirmar e não há terminal — use: ${opcoes.linha ?? uso} -y`);
  if (!(await ctx.confirmar(texto, padrao))) throw new Cancelado();
}

/** A cópia mantida por ter sido alterada à mão aparece com ✎; `forcar` diz o que o --forcar faria com ela. */
const alterada = (k, forcar = "sobrescreve") => `${k} alterada à mão — mantida (--forcar ${forcar})`;
function mostrar({ texto, mantidos = [] }, forcar) {
  ctx.tela.passo(texto);
  for (const k of mantidos) ctx.tela.marca("✎", alterada(k, forcar));
}

/** As cópias que o apagar() manteria (alteradas à mão), sem apagar nada: para a prévia do remover e do desinstalar. */
const ficariam = (copias, opcoes) => (opcoes.forcar ? [] : Object.keys(copias).filter((k) => alteradosAMao(longo(k), copias[k]).length));

// ---------- caminhos e inventário ----------

const home = () => os.homedir();
const sabia = (...p) => path.join(home(), ".sabia", ...p);
/** Caminho no inventário: relativo ao home, com `~/`, para ser o mesmo em qualquer máquina. */
export const curto = (p) => (p.startsWith(home() + path.sep) ? "~/" + path.relative(home(), p).split(path.sep).join("/") : p);
export const longo = (p) => (p.startsWith("~/") ? path.join(home(), ...p.slice(2).split("/")) : p);

export const PASTA_SKILLS = {
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
 * inventário é de outra pessoa ou ferramenta: recusa, salvo `forcar`. Cópia alterada à mão: mantida, salvo `forcar`.
 * Devolve "copiado" ou "mantido".
 */
export function copiar(origem, destino, copias, { forcar = false } = {}) {
  const chave = curto(destino);
  if (fs.existsSync(destino)) {
    if (!copias[chave] && !forcar) throw new Error(`${chave} já existe e não foi instalado pelo Sabiá (use --forcar para sobrescrever)`);
    if (!forcar && alteradosAMao(destino, copias[chave]).length) return "mantido";
    fs.rmSync(destino, { recursive: true, force: true });
  }
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.cpSync(origem, destino, { recursive: true });
  copias[chave] = hashes(destino);
  return "copiado";
}

/** Apaga as cópias registradas; a alterada à mão fica, salvo `forcar`. Devolve as mantidas. */
export function apagar(copias, { forcar = false } = {}) {
  const mantidos = [];
  for (const [chave, registrado] of Object.entries(copias)) {
    const destino = longo(chave);
    if (!forcar && alteradosAMao(destino, registrado).length) { mantidos.push(chave); continue; }
    fs.rmSync(destino, { recursive: true, force: true });
    delete copias[chave];
  }
  return mantidos;
}

// ---------- git e fontes ----------

function git(args, cwd) {
  const r = ctx.exec("git", args, { cwd });
  if (r.signal === "SIGINT") throw new Cancelado();  // Ctrl+C no clone: o git morre antes de qualquer gravação
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
// as cópias baixadas são lidas e copiadas para ~/.sabia durante o comando; somem quando o processo termina
const temporarios = new Set();
process.on("exit", () => { for (const t of temporarios) fs.rmSync(t, { recursive: true, force: true }); });

export function baixar(url, { ref = null, sha = null, subpasta = null } = {}) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "sabia-"));
  temporarios.add(tmp);
  const repo = path.join(tmp, "repo");
  let atual = null;
  if (fs.existsSync(url) && fs.statSync(url).isDirectory()) {
    const topo = ctx.exec("git", ["rev-parse", "--show-toplevel"], { cwd: url });
    if (ref) {
      // com @ref, a pasta vem do commit (git archive), não da árvore de trabalho; ref inexistente é recusada
      if (topo.status !== 0) throw new Error(`${url}: @${ref} pede uma pasta dentro de um repositório git`);
      atual = git(["rev-parse", "--verify", `${ref}^{commit}`], url);
      const rel = path.relative(fs.realpathSync(topo.stdout.trim()), fs.realpathSync(url)).split(path.sep).join("/");
      const tar = path.join(tmp, "a.tar");
      git(["archive", "--format=tar", "-o", tar, rel ? `${atual}:${rel}` : atual], url);
      fs.mkdirSync(repo);
      const r = ctx.exec("tar", ["-xf", tar, "-C", repo]);
      if (r.status !== 0) throw new Error(`tar: ${(r.stderr || "").trim()}`);
    } else {
      fs.cpSync(url, repo, { recursive: true, filter: (f) => path.basename(f) !== ".git" });
      if (topo.status === 0) atual = git(["rev-parse", "HEAD"], url);
    }
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

// o opencode desktop (macOS) traz o CLI dentro do app, fora do PATH
export const OPENCODE_APP = "/Applications/OpenCode.app/Contents/Resources/opencode-cli";

/** O comando do opencode: o do PATH ou o que vem no app desktop; null sem nenhum. */
export function comandoOpencode() {
  if (temComando("opencode")) return "opencode";
  return fs.existsSync(OPENCODE_APP) && temComando(OPENCODE_APP) ? OPENCODE_APP : null;
}

export function detectarAlvos() {
  return ALVOS.filter((a) => (a === "kiro" ? temComando("kiro-cli") : comandoOpencode()));
}

const DICA_ALVO = { kiro: "power em ~/.kiro/powers/installed/sabia", opencode: "~/.config/opencode/skills e os MCPs" };

/** --alvo; com -y, as detectadas; senão, no terminal, a multisseleção de todas, desmarcadas (a pessoa escolhe). */
async function escolherAlvos(opcoes, uso = "sabia instalar") {
  if (opcoes.alvo) {
    const alvos = opcoes.alvo.split(",").filter(Boolean);
    const fora = alvos.filter((a) => !ALVOS.includes(a));
    if (fora.length || !alvos.length) throw new Error(`ferramenta desconhecida: ${fora.join(", ")} (use ${ALVOS.join(", ")})`);
    return alvos;
  }
  const achadas = detectarAlvos();
  if (opcoes.sim) {
    if (!achadas.length) throw new Error(`nenhuma ferramenta achada (kiro-cli, opencode) — use: ${opcoes.linha ?? uso} -a opencode -y`);
    ctx.tela.passo(`Instalando em: ${achadas.join(", ")}`);
    return achadas;
  }
  if (!ctx.interativo) throw new Error(`preciso escolher as ferramentas e não há terminal — use: ${opcoes.linha ?? uso} -a opencode -y`);
  return ctx.escolher({ mensagem: "Em quais ferramentas?", multi: true, minimo: 1,
    opcoes: ALVOS.map((a) => ({ valor: a, rotulo: a, dica: `${DICA_ALVO[a]}${achadas.includes(a) ? "" : " · não achado no PATH"}`, marcado: false })) });
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
  } catch {
    ctx.tela.aviso(`opencode: tire o MCP ${nome} de mcp.servers no ${curto(arq)} (o arquivo tem comentários; não o reescrevo)`);
  }
}

/** Os MCPs do framework no opencode (no Kiro, vão no mcp.json do power); o que já existe lá fica. Devolve quantos registrou. */
function registrarMcps(fw, reg) {
  reg.mcp ||= [];
  const ja = mcpsDoOpencode();
  let n = 0;
  for (const [nome, s] of Object.entries(servidoresMcp(fw))) {
    if (ja.includes(nome)) continue;
    const env = Object.entries(s.env || {}).map(([k, v]) => `${k}=${v}`);
    const r = ctx.exec(comandoOpencode() || "opencode", ["mcp", "add", "--global", ...env.flatMap((e) => ["--env", e]), nome, "--", s.command, ...s.args]);
    if (r.status !== 0) throw new Error(`MCP ${nome} no opencode: ${(r.stderr || r.error?.message || "").trim()}`);
    if (!reg.mcp.includes(nome)) reg.mcp.push(nome);
    n++;
  }
  return n;
}

/** Onde as skills do Sabiá ficam no alvo (caminho com ~). */
const baseSabia = (alvo) => (alvo === "kiro" ? "~/.kiro/powers/installed/sabia/skills" : curto(PASTA_SKILLS[alvo]()));

/** Compila o framework para o alvo em ~/.sabia/compilado/<alvo>/. */
function compilarPara(alvo, fw) {
  const versao = JSON.parse(fs.readFileSync(path.join(fw, "plugin.json"), "utf8")).version;
  return compilar(fw, sabia("compilado", alvo), { base: baseSabia(alvo), raiz: alvo === "kiro", versao });
}

/** Instala no alvo o framework de ~/.sabia/framework; devolve a linha do alvo e as cópias mantidas (✎). */
function instalarAlvo(alvo, inv, opcoes) {
  const fw = compilarPara(alvo, sabia("framework"));
  if (alvo === "kiro") {
    const nosso = inv.alvos.kiro?.power;
    if (nosso || opcoes.forcar) ctx.exec("kiro-cli", ["powers", "uninstall", "sabia"]);
    const r = ctx.exec("kiro-cli", ["powers", "install", fw]);
    if (r.status !== 0) throw new Error(`kiro-cli powers install: ${(r.stderr || r.error?.message || "").trim()}`);
    inv.alvos.kiro = { power: "sabia" };
    return { texto: "kiro: power sabia" };
  }
  const reg = (inv.alvos[alvo] ||= { copias: {}, mcp: [] });
  const skills = skillsDoFluxo(fw), mantidos = [];
  for (const s of skills) {
    const destino = path.join(PASTA_SKILLS[alvo](), s);
    if (copiar(path.join(fw, "skills", s), destino, reg.copias, opcoes) === "mantido") mantidos.push(curto(destino));
  }
  const mcps = opcoes.semMcp ? 0 : registrarMcps(sabia("framework"), reg);
  return { texto: `${alvo}: ${qt(skills.length - mantidos.length, "skill")}${mcps ? `, ${qt(mcps, "MCP")}` : ""}`, mantidos };
}

/** O que o instalar fará no alvo, para o resumo; o que seria recusado (cópia de outra pessoa, power de fora) é erro já aqui,
 * antes de qualquer gravação. */
function previa(alvo, inv, novo, opcoes) {
  if (alvo === "kiro") {
    // o painel Powers instala em ~/.kiro/powers/installed/sabia: fora do inventário, é de outra instalação
    if (!inv.alvos.kiro?.power && fs.existsSync(path.join(home(), ".kiro", "powers", "installed", "sabia")) && !opcoes.forcar)
      throw new Error("o power sabia já está no Kiro e não foi instalado pelo CLI (desinstale pelo painel Powers ou use --forcar)");
    return ["power sabia"];
  }
  const copias = inv.alvos[alvo]?.copias || {}, skills = skillsDoFluxo(novo.pasta), mantidas = [];
  for (const s of skills) {
    const destino = path.join(PASTA_SKILLS[alvo](), s), chave = curto(destino);
    if (!fs.existsSync(destino) || opcoes.forcar) continue;
    if (!copias[chave]) throw new Error(`${chave} já existe e não foi instalado pelo Sabiá (use --forcar para sobrescrever)`);
    if (alteradosAMao(destino, copias[chave]).length) mantidas.push(chave);
  }
  const mcps = opcoes.semMcp ? 0 : Object.keys(servidoresMcp(novo.pasta)).filter((n) => !mcpsDoOpencode().includes(n)).length;
  // os MCPs entram pelo `opencode mcp add`: sem o comando, a cópia das skills sairia sem eles
  if (mcps && !comandoOpencode())
    throw new Error("não achei o comando opencode (nem no PATH, nem no app em /Applications): sem ele não registro os MCPs (opencode mcp add) — ponha o opencode no PATH ou use --sem-mcp");
  return [`${qt(skills.length, "skill")}${mcps ? ` · ${qt(mcps, "MCP")}` : ""}`,
    ...mantidas.map((k) => `✎ ${alterada(k)}`)];
}

/** Baixa o framework para uma pasta temporária (nada muda em ~/.sabia/ ainda). */
function baixarFramework(opcoes) {
  const versao = opcoes.versao || VERSAO;
  const [url, ref] = opcoes.fonte ? separarRef(opcoes.fonte) : [REPO, `sabia-${versao}`];
  const { pasta, sha } = baixar(url, { ref });
  if (!fs.existsSync(path.join(pasta, "skills", "sa-setup", "SKILL.md"))) throw new Error(`${url}: não parece o Sabiá (falta skills/sa-setup)`);
  const plugin = JSON.parse(fs.readFileSync(path.join(pasta, "plugin.json"), "utf8"));
  return { pasta, sha, ref, versao: plugin.version, fonte: opcoes.fonte || REPO };
}

const baixando = (fn) => ctx.tela.esperar("baixando o Sabiá …", fn, (n) => `Sabiá ${n.versao} baixado (${n.ref || curto(n.fonte)})`);

export function diferencas(antes, depois) {
  const a = fs.existsSync(antes) ? hashes(antes) : {};
  const d = hashes(depois);
  return {
    novos: Object.keys(d).filter((f) => !(f in a)),
    alterados: Object.keys(d).filter((f) => f in a && a[f] !== d[f]),
    removidos: Object.keys(a).filter((f) => !(f in d)),
  };
}

const linhasDif = (dif) => Object.entries(dif).filter(([, xs]) => xs.length)
  .map(([rotulo, xs]) => `${rotulo} (${xs.length}): ${xs.slice(0, 5).join(", ")}${xs.length > 5 ? ", …" : ""}`);

/** Toolkits para instalar junto: -t; sem ele, no terminal, a multisseleção opcional dos que o índice tem e não estão instalados. */
async function escolherToolkits(opcoes, inv) {
  const pedidos = opcoes.toolkits?.split(",").filter(Boolean);
  if (pedidos?.every(ehUrl) || (!pedidos && (opcoes.sim || !ctx.interativo))) return pedidos || [];
  const todos = ctx.tela.esperar("lendo os índices de toolkits …", () => entradasDosIndices(opcoes), (l) => `${qt(l.length, "toolkit")} nos índices`);
  // o -t é conferido antes do resumo: nome fora do índice não pode aparecer depois do framework gravado
  if (pedidos) {
    const fora = pedidos.filter((p) => { const [n, v] = separarRef(p); return !ehUrl(p) && !todos.some((e) => e.nome === n && (!v || e.versao === v)); });
    if (fora.length) throw new Error(`${fora.length === 1 ? `toolkit ${fora[0]} não está` : `toolkits ${fora.join(", ")} não estão`} nos índices — veja: sabia toolkits`);
    return pedidos;
  }
  if (!todos.length) { ctx.tela.aviso(SEM_INDICE); return []; }
  const livres = todos.filter((e) => !inv.toolkits[e.nome]);
  if (!livres.length) return [];
  return ctx.escolher({ mensagem: "Toolkits (opcional)", multi: true, minimo: 0,
    opcoes: livres.map((e) => ({ valor: e.nome, rotulo: e.nome, dica: [e.versao, e.descricao].filter(Boolean).join("  ") })) });
}

export async function instalar(opcoes = {}) {
  if (process.stdout.isTTY) ctx.log(BANNER + "\n");
  ctx.tela.abrir("sabia instalar");
  const inv = lerInventario();
  // todas as perguntas e o resumo antes de mexer em ~/.sabia: cancelar não deixa nada pela metade; as ferramentas antes
  // do download, que é o passo lento
  const alvos = await escolherAlvos(opcoes, "sabia instalar");
  const novo = baixando(() => baixarFramework(opcoes));
  const toolkits = await escolherToolkits(opcoes, inv);
  const resumo = [["framework", `${inv.framework?.versao || "—"} → ${novo.versao}`],
    ...alvos.flatMap((a) => previa(a, inv, novo, opcoes).map((t, i) => [i ? "" : a, t])),
    ...(toolkits.length ? [["toolkits", toolkits.join(", ")]] : [])];
  ctx.tela.nota(colunas(resumo), "Resumo");
  await confirmar(opcoes, "Instalar?", true, `sabia instalar -a ${alvos.join(",")}`);
  fs.rmSync(sabia("framework"), { recursive: true, force: true });
  fs.mkdirSync(sabia(), { recursive: true });
  fs.cpSync(novo.pasta, sabia("framework"), { recursive: true });
  inv.framework = { versao: novo.versao, sha: novo.sha, fonte: novo.fonte, compilador: VERSAO, instalado_em: new Date().toISOString() };
  try {
    for (const alvo of alvos) mostrar(instalarAlvo(alvo, inv, opcoes));
  } finally {
    gravarInventario(inv);
  }
  for (const t of toolkits) mostrar(await instalarToolkit(t, { ...opcoes, alvo: alvos.join(",") }));
  ctx.tela.fechar(`Pronto.${opcoes.semMcp ? " (MCPs não registrados: --sem-mcp)" : ""}\n` +
    '   → na raiz do projeto, no Kiro ou no opencode, peça "configurar o Sabiá" (já configurado: "atualizar os agentes do Sabiá")');
}

export async function atualizar(opcoes = {}) {
  ctx.tela.abrir("sabia atualizar");
  const inv = lerInventario();
  if (!inv.framework) throw new Error("o Sabiá não está instalado — use: sabia instalar");
  const fonte = { fonte: inv.framework.fonte === REPO ? undefined : inv.framework.fonte, ...opcoes };
  const novo = baixando(() => baixarFramework(fonte));
  // o compilador também conta: a mesma fonte compilada por outro CLI pode dar outra skill
  const compilador = inv.framework.compilador === VERSAO ? [] : [`compilador ${inv.framework.compilador || "—"} → ${VERSAO}`];
  const muda = [...linhasDif(diferencas(sabia("framework"), novo.pasta)), ...compilador];
  if (!muda.length) return ctx.tela.fechar(`já na última versão (${novo.versao})`);
  ctx.tela.nota([`framework ${inv.framework.versao} → ${novo.versao}`, ...muda, `em ${Object.keys(inv.alvos).join(", ") || "nenhuma ferramenta"}`].join("\n"), "Resumo");
  await confirmar(opcoes, "Atualizar?", true, "sabia atualizar");
  fs.rmSync(sabia("framework"), { recursive: true, force: true });
  fs.cpSync(novo.pasta, sabia("framework"), { recursive: true });
  inv.framework = { ...inv.framework, versao: novo.versao, sha: novo.sha, compilador: VERSAO, instalado_em: new Date().toISOString() };
  try {
    for (const alvo of Object.keys(inv.alvos)) {
      const mantidos = [];
      if (alvo !== "kiro") {  // skill que saiu do framework sai da ferramenta
        const copias = inv.alvos[alvo].copias;
        const fica = new Set(skillsDoFluxo(sabia("framework")).map((s) => curto(path.join(PASTA_SKILLS[alvo](), s))));
        const sai = Object.fromEntries(Object.entries(copias).filter(([k]) => !fica.has(k)));
        mantidos.push(...apagar(sai, opcoes));
        for (const k of Object.keys(copias)) if (!fica.has(k) && !(k in sai)) delete copias[k];
      }
      const r = instalarAlvo(alvo, inv, { ...opcoes, semMcp: true });
      mostrar({ ...r, mantidos: [...mantidos, ...(r.mantidos || [])] });
    }
  } finally {
    gravarInventario(inv);
  }
  ctx.tela.fechar('Pronto.\n   → em cada projeto, peça "atualizar os agentes do Sabiá"');
}

export async function desinstalar(opcoes = {}) {
  ctx.tela.abrir("sabia desinstalar");
  const inv = lerInventario();
  const alvos = (opcoes.alvo ? opcoes.alvo.split(",") : Object.keys(inv.alvos)).filter((a) => inv.alvos[a]);
  if (!alvos.length) return ctx.tela.fechar("nada a desinstalar: o Sabiá não está em nenhuma ferramenta");
  const sai = alvos.flatMap((a) => {
    const reg = inv.alvos[a], tks = Object.keys(inv.toolkits).filter((n) => inv.toolkits[n].alvos?.[a]);
    const fica = [...(a === "kiro" ? [] : ficariam(reg.copias, opcoes)), ...tks.flatMap((n) => ficariam(inv.toolkits[n].alvos[a].copias, opcoes))];
    const skills = a === "kiro" ? 0 : Object.keys(reg.copias).filter((k) => !fica.includes(k)).length;
    const o = a === "kiro" ? ["power sabia"] : [qt(skills, "skill"), ...(reg.mcp?.length ? [`MCP ${reg.mcp.join(", ")}`] : [])];
    return [`✗ ${a}: ${[...o, ...(tks.length ? [`toolkits ${tks.join(", ")}`] : [])].join(" · ")}`, ...fica.map((k) => `✎ ${alterada(k, "apaga")}`)];
  });
  // com cópia alterada que fica, o alvo fica no inventário e o framework também
  if (alvos.length === Object.keys(inv.alvos).length && !sai.some((l) => l.startsWith("✎"))) sai.push("✗ ~/.sabia/framework e ~/.sabia/compilado");
  ctx.tela.nota(sai.join("\n"), "Sai");
  await confirmar(opcoes, `Desinstalar o Sabiá de ${alvos.join(", ")}?`, false, `sabia desinstalar -a ${alvos.join(",")}`);
  const sobrou = [];
  try {
    for (const alvo of alvos) {
      const reg = inv.alvos[alvo], mantidos = [];
      for (const tk of Object.values(inv.toolkits)) if (tk.alvos?.[alvo]) {
        mantidos.push(...apagar(tk.alvos[alvo].copias, opcoes));
        if (!Object.keys(tk.alvos[alvo].copias).length) delete tk.alvos[alvo];  // a alterada à mão fica registrada
      }
      if (alvo === "kiro") {
        const r = ctx.exec("kiro-cli", ["powers", "uninstall", reg.power]);
        if (r.status !== 0) { ctx.tela.aviso(`kiro: kiro-cli powers uninstall falhou: ${(r.stderr || r.error?.message || "").trim()}`); continue; }
      } else mantidos.push(...apagar(reg.copias, opcoes));
      if (alvo === "opencode") for (const nome of reg.mcp || []) tirarMcpDoOpencode(nome);
      // com cópia alterada à mão (do Sabiá ou de um toolkit), o alvo fica no inventário para o --forcar achá-la
      if (mantidos.length) sobrou.push(alvo);
      else delete inv.alvos[alvo];
      mostrar({ texto: `${alvo}: Sabiá ${mantidos.length ? "desinstalado, menos as cópias alteradas à mão" : "desinstalado"}`, mantidos }, "apaga");
    }
    if (!Object.keys(inv.alvos).length) {
      fs.rmSync(sabia("framework"), { recursive: true, force: true });
      fs.rmSync(sabia("compilado"), { recursive: true, force: true });
      inv.framework = null;
    }
  } finally {
    gravarInventario(inv);
  }
  ctx.tela.fechar(sobrou.length ? `Pronto.\n   → para tirar as cópias alteradas: sabia desinstalar -a ${sobrou.join(",")} --forcar`
    : 'Pronto.\n   → para voltar: sabia instalar');
}

// ---------- toolkits ----------

/** O passo do framework (`m` do carregar) que o `passo` de um toolkit assume, pelo id (ou pelo id antigo do ALIAS_PASSO)
 * — a mesma regra do gancho() do gerar_agentes.py. */
const ganchoDe = (m, ext) => {
  const passos = Object.entries(m.fluxos).flatMap(([q, fl]) => fl.passos.map((x) => ({ id: `${q}.${x.id}`, x })));
  return passos.find(({ id }) => id === ext.passo) || passos.find(({ id }) => id === ALIAS_PASSO[ext.passo]);
};

/** Erros do toolkit.json: campos, nome, caminhos presos à pasta e arquivos que existem (o schema completo é o da setup). */
export function validarToolkit(pasta, nomeEsperado = null, fw = null) {
  const f = path.join(pasta, "toolkit.json");
  if (!fs.existsSync(f)) return ["falta o toolkit.json"];
  let m;
  try { m = JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { return [`toolkit.json inválido: ${e.message}`]; }
  const erros = [];
  for (const c of ["nome", "versao", "descricao", "autor", "tipos-de-projeto", "skills"]) if (!(c in m)) erros.push(`falta o campo ${c}`);
  // quem fez responde pelo toolkit: nome e área aparecem no listar e na setup
  if (m.autor && (typeof m.autor.nome !== "string" || typeof m.autor.area !== "string" || !m.autor.nome.trim() || !m.autor.area.trim()))
    erros.push("autor: precisa de nome e area");
  const nomeOk = (n) => typeof n === "string" && /^[a-z0-9][a-z0-9-]*$/.test(n) && !n.startsWith("sa-");
  if (!nomeOk(m.nome)) erros.push(`nome inválido (kebab-case, sem sa-): ${m.nome}`);
  if (nomeEsperado && m.nome !== nomeEsperado) erros.push(`nome ${m.nome} ≠ ${nomeEsperado} do índice`);
  if (m.customiza && (!nomeOk(m.customiza.toolkit) || m.customiza.toolkit === m.nome || typeof m.customiza.versao !== "string"))
    erros.push("customiza: precisa de toolkit (outro nome, kebab-case) e versao da base");
  const existe = (c, de) => {
    try { if (!fs.existsSync(path.join(pasta, dentro(c, de)))) erros.push(`${de}: não existe ${c}`); } catch (e) { erros.push(e.message); }
  };
  const agentes = new Set((m.agentes || []).map((a) => a.nome));
  // sem o framework (toolkit baixado antes do Sabiá), o gancho é conferido na setup
  const ganchos = fw && fs.existsSync(path.join(fw, "fluxo")) ? carregar(fw) : null;
  for (const s of m.skills || []) {
    existe(s.caminho, "skills");
    // a skill do toolkit não ocupa um nome do Sabiá: a cópia dela trocaria a do Sabiá sem aviso
    const sk = path.basename(path.dirname(String(s.caminho)));
    if (sk.startsWith("sa-") || sk === "sabia") erros.push(`skill ${s.caminho}: nome do Sabiá (sa-* ou sabia); use outro nome de pasta`);
    if (s.passo?.agente && !agentes.has(s.passo.agente)) erros.push(`passo de ${s.caminho}: agente ${s.passo.agente} não está em agentes`);
    if (s.passo && !s.passo.passo) erros.push(`passo de ${s.caminho}: use o id do passo (passo.passo)`);
    else if (s.passo && ganchos) {
      const g = ganchoDe(ganchos, s.passo);
      if (!g) erros.push(`passo de ${s.caminho}: ${s.passo.passo} não existe no Sabiá instalado`);
      else if (!g.x.desvio) erros.push(`passo de ${s.caminho}: ${s.passo.passo} não aceita desvio de toolkit${g.x.tipos ? ` (o tipo ${g.x.tipos.join(", ")} vai por \`tipos\`)` : ""}`);
    }
  }
  if (ganchos && (m.tipos || m.criterios_revisao || m.requer)) {
    try { erros.push(...validarToolkitFonte(fw, pasta)); } catch (e) { erros.push(e.message); }
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

/** Entradas do índice (`index.json`), cada uma resolvida para { nome, versao, url, ref, sha, subpasta }. */
export function lerIndice(fonte) {
  const local = fs.existsSync(fonte);
  const raiz = local ? fonte : baixar(fonte).pasta;
  const m = JSON.parse(fs.readFileSync(path.join(raiz, "index.json"), "utf8"));
  return (m.toolkits || []).map((t) => {
    const f = t.fonte;
    const base = { nome: t.nome, versao: t.versao, descricao: t.descricao, customiza: t.customiza, autor: t.autor, indice: fonte };
    if (f?.caminho) {
      const c = f.caminho.replace(/^\.\//, "");
      return { ...base, url: local ? path.resolve(raiz, dentro(c, fonte)) : fonte, subpasta: local ? null : c };
    }
    if (f?.url && f.ref && f.sha) return { ...base, url: f.url, ref: f.ref, sha: f.sha, subpasta: f.subpasta };
    throw new Error(`${fonte}: fonte de ${t.nome} inválida (${JSON.stringify(f)}); use caminho, ou url, ref e sha`);
  });
}

function acharNoIndice(nome, versao, opcoes) {
  for (const i of opcoes.indice ? [opcoes.indice] : indices()) {
    const e = lerIndice(i).find((x) => x.nome === nome && (!versao || x.versao === versao));
    if (e) return e;
  }
  throw new Error(`toolkit ${nome}${versao ? "@" + versao : ""} não está nos índices — veja: sabia toolkits`);
}

const SEM_INDICE = "nenhum toolkit nos índices — confira o --indice ou ~/.sabia/indices.json";

/** As entradas de todos os índices (ou do --indice); índice que não abre vira aviso. */
function entradasDosIndices(opcoes) {
  return (opcoes.indice ? [opcoes.indice] : indices()).flatMap((i) => {
    try { return lerIndice(i); } catch (e) { ctx.tela.aviso(`índice ${i}: ${e.message}`); return []; }
  });
}

/** Baixa e valida o toolkit numa pasta temporária e diz o que muda em ~/.sabia/toolkits/<nome> (nada é gravado). */
const ehUrl = (alvo) => /[:/]/.test(alvo) && !/^[a-z0-9-]+(@[\w.-]+)?$/.test(alvo);

function buscarToolkit(alvo, opcoes = {}) {
  // `<url>[@ref]#<subpasta>`: o toolkit numa subpasta de um repositório (monorepo de toolkits)
  const [semSub, subpasta = null] = ehUrl(alvo) ? alvo.split("#") : [alvo];
  const [nomeOuUrl, versaoOuRef] = separarRef(semSub);
  const e = ehUrl(alvo) ? { nome: null, url: nomeOuUrl, ref: versaoOuRef, subpasta } : acharNoIndice(nomeOuUrl, versaoOuRef, opcoes);
  const { pasta, sha } = baixar(e.url, e);
  const erros = validarToolkit(pasta, e.nome, sabia("framework"));
  if (erros.length) throw new Error(`toolkit recusado:\n- ${erros.join("\n- ")}`);
  const m = JSON.parse(fs.readFileSync(path.join(pasta, "toolkit.json"), "utf8"));
  const destino = sabia("toolkits", m.nome);
  const dif = diferencas(destino, pasta);
  dif.removidos = dif.removidos.filter((f) => f !== ".origem.json");  // é nossa, regravada no gravarToolkit
  const de = fs.existsSync(path.join(destino, "toolkit.json")) ? JSON.parse(fs.readFileSync(path.join(destino, "toolkit.json"), "utf8")).versao : null;
  return { e, pasta, sha, m, destino, de, dif, mudou: Object.values(dif).some((xs) => xs.length) };
}

/** Grava em ~/.sabia/toolkits/<nome> o que o buscarToolkit trouxe, com a origem, e registra no inventário. */
function gravarToolkit({ e, pasta, sha, m, destino, mudou }) {
  if (mudou) {
    fs.rmSync(destino, { recursive: true, force: true });
    fs.mkdirSync(path.dirname(destino), { recursive: true });
    fs.cpSync(pasta, destino, { recursive: true });
  }
  // mesmo sem mudar o conteúdo, a origem pode ter mudado (da pasta local para o índice, por exemplo)
  const origem = { indice: e.indice || null, url: e.url, ref: e.ref || null, subpasta: e.indice ? null : e.subpasta || null, sha, versao: m.versao };
  fs.writeFileSync(path.join(destino, ".origem.json"), JSON.stringify(origem, null, 2) + "\n");
  const inv = lerInventario();
  inv.toolkits[m.nome] = { ...(inv.toolkits[m.nome] || { alvos: {} }), versao: m.versao, sha, fonte: e.url };
  gravarInventario(inv);
  return m.nome;
}

/** Baixa o toolkit para ~/.sabia/toolkits (sem as ferramentas): o primeiro passo do instalar e do atualizar. */
export async function baixarToolkit(alvo, opcoes = {}) {
  return gravarToolkit(buscarToolkit(alvo, opcoes));
}

/** Copia as skills do toolkit para as ferramentas (o Kiro lê de ~/.sabia/toolkits pelo `skill://` de cada agente). Sem
 * perguntas, salvo as ferramentas quando não há --alvo nem Sabiá instalado; devolve a linha e as cópias mantidas. */
export async function instalarToolkit(alvo, opcoes = {}) {
  const [nome] = separarRef(alvo);
  const baixado = fs.existsSync(sabia("toolkits", nome, "toolkit.json")) && !opcoes.atualizar ? nome : await baixarToolkit(alvo, opcoes);
  const pasta = sabia("toolkits", baixado);
  const m = JSON.parse(fs.readFileSync(path.join(pasta, "toolkit.json"), "utf8"));
  const inv = lerInventario();
  // a customização é uma cópia modificada da base: as duas juntas no projeto dão skills e agentes repetidos
  const familia = m.customiza?.toolkit ?? baixado;
  const rival = Object.keys(inv.toolkits).find((n) => n !== baixado && (baseDe(n) ?? n) === familia);
  // mesmos nomes de skill e de agente: as duas no usuário se sobrescreveriam
  if (rival) throw new Error(`${baixado} e ${rival} são versões do mesmo toolkit (base ${familia}); instale um só: sabia toolkits remover ${rival}`);
  const tk = (inv.toolkits[baixado] ||= { versao: m.versao, alvos: {} });
  const doInv = Object.keys(inv.alvos);
  const alvos = opcoes.alvo || !doInv.length ? await escolherAlvos(opcoes, `sabia toolkits instalar ${baixado}`) : doInv;
  const mantidos = [];
  try {
    for (const a of alvos.filter((x) => x !== "kiro")) {
      const reg = (tk.alvos[a] ||= { copias: {} });
      for (const s of m.skills) {
        const dir = path.dirname(path.join(pasta, s.caminho)), destino = path.join(PASTA_SKILLS[a](), path.basename(dir));
        if (copiar(dir, destino, reg.copias, opcoes) === "mantido") mantidos.push(curto(destino));
      }
    }
  } finally {
    gravarInventario(inv);
  }
  const onde = alvos.map((a) => (a === "kiro" ? `kiro (lê de ~/.sabia/toolkits/${baixado})` : a));
  return { texto: `${baixado} ${m.versao}: ${onde.join(", ")}`, mantidos };
}

const usaNoProjeto = (nome) => {
  const f = path.join(process.cwd(), ".sabia", "config", "agentes.json");
  return fs.existsSync(f) && !!JSON.parse(fs.readFileSync(f, "utf8")).toolkits?.[nome];
};
const ondeEsta = (t) => Object.keys(t.alvos || {}).join(", ") || "~/.sabia/toolkits";

/** `sabia toolkits instalar [nome…]`: sem nome, no projeto, as versões dele; fora dele, a multisseleção do índice. */
export async function instalarToolkits(nomes = [], opcoes = {}) {
  ctx.tela.abrir("sabia toolkits instalar");
  const inv = lerInventario();
  let pedidos = nomes;
  if (!pedidos.length) {
    const f = path.join(process.cwd(), ".sabia", "config", "agentes.json");
    if (fs.existsSync(f)) {
      pedidos = Object.entries(JSON.parse(fs.readFileSync(f, "utf8")).toolkits || {}).map(([n, t]) => (t.versao ? `${n}@${t.versao}` : n));
      ctx.tela.passo(`Este projeto usa: ${pedidos.join(", ") || "nenhum toolkit"}`);
    } else {
      if (opcoes.sim || !ctx.interativo) throw new Error("diga o toolkit — use: sabia toolkits instalar <nome> -y (os nomes: sabia toolkits)");
      const todos = ctx.tela.esperar("lendo os índices de toolkits …", () => entradasDosIndices(opcoes), (l) => `${qt(l.length, "toolkit")} nos índices`);
      if (!todos.length) throw new Error(SEM_INDICE);
      const livres = todos.filter((e) => !inv.toolkits[e.nome]);
      if (!livres.length) return ctx.tela.fechar("todos os toolkits dos índices já estão instalados");
      pedidos = await ctx.escolher({ mensagem: "Quais toolkits?", multi: true, minimo: 1,
        opcoes: livres.map((e) => ({ valor: e.nome, rotulo: e.nome, dica: [e.versao, e.descricao].filter(Boolean).join("  ") })) });
    }
  }
  // o que já está instalado na versão pedida não é baixado de novo (com --alvo, é copiado para as ferramentas novas)
  const faltam = pedidos.filter((p) => {
    const [n, v] = separarRef(p), t = inv.toolkits[n];
    // sem ~/.sabia/toolkits/<nome>, o registro é só das cópias alteradas que o remover deixou
    if (!t || (v && t.versao !== v) || opcoes.alvo || !fs.existsSync(sabia("toolkits", n, "toolkit.json"))) return true;
    ctx.tela.ok(`${n} ${t.versao} já instalado (${ondeEsta(t)})`);
    return false;
  });
  if (!faltam.length) return ctx.tela.fechar("Nada a instalar.");
  const alvos = Object.keys(inv.alvos).length && !opcoes.alvo ? Object.keys(inv.alvos) : await escolherAlvos(opcoes, `sabia toolkits instalar ${faltam.join(" ")}`);
  ctx.tela.nota(colunas([["toolkits", faltam.join(", ")], ["em", alvos.join(", ")]]), "Resumo");
  await confirmar(opcoes, `Instalar ${qt(faltam.length, "toolkit")}?`, true, `sabia toolkits instalar ${faltam.join(" ")}`);
  for (const p of faltam) {
    const [n, v] = separarRef(p);
    mostrar(await instalarToolkit(p, { ...opcoes, alvo: alvos.join(","), atualizar: !!(v && inv.toolkits[n] && inv.toolkits[n].versao !== v) }));
  }
  ctx.tela.fechar('Pronto.\n   → no projeto, peça "atualizar os agentes do Sabiá" para ligar o toolkit');
}

/** Apaga o toolkit das ferramentas e de ~/.sabia/toolkits; devolve as cópias mantidas (alteradas à mão), que ficam no
 * inventário: sem o registro, reinstalar as recusaria como de outra pessoa. */
export function removerToolkit(nome, opcoes = {}) {
  const inv = lerInventario();
  const tk = inv.toolkits[nome], mantidos = [];
  try {
    for (const [a, reg] of Object.entries(tk?.alvos || {})) {
      mantidos.push(...apagar(reg.copias, opcoes));
      if (!Object.keys(reg.copias).length) delete tk.alvos[a];
    }
    fs.rmSync(sabia("toolkits", nome), { recursive: true, force: true });
    if (!Object.keys(tk?.alvos || {}).length) delete inv.toolkits[nome];
  } finally {
    gravarInventario(inv);
  }
  return mantidos;
}

/** `sabia toolkits remover [nome…]`: sem nome, a multisseleção dos instalados; o que sai aparece com ✗ antes do confirm. */
export async function removerToolkits(nomes = [], opcoes = {}) {
  ctx.tela.abrir("sabia toolkits remover");
  const inv = lerInventario();
  if (!nomes.length) {
    if (!Object.keys(inv.toolkits).length) return ctx.tela.fechar("nenhum toolkit instalado");
    if (opcoes.sim || !ctx.interativo) throw new Error("diga o toolkit — use: sabia toolkits remover <nome> -y");
    nomes = await ctx.escolher({ mensagem: "Quais remover?", multi: true, minimo: 1,
      opcoes: Object.entries(inv.toolkits).map(([n, t]) => ({ valor: n, rotulo: n, dica: `${t.versao}  ${ondeEsta(t)}` })) });
  }
  const sai = nomes.filter((n) => {
    if (inv.toolkits[n] || fs.existsSync(sabia("toolkits", n))) return true;
    ctx.tela.ok(`${n} não está instalado`);
    return false;
  });
  if (!sai.length) return ctx.tela.fechar("Nada a remover.");
  for (const n of sai) {
    for (const reg of Object.values(inv.toolkits[n]?.alvos || {})) {
      const fica = ficariam(reg.copias, opcoes);
      for (const k of Object.keys(reg.copias)) fica.includes(k) ? ctx.tela.marca("✎", alterada(k, "apaga")) : ctx.tela.marca("✗", k);
    }
    ctx.tela.marca("✗", `~/.sabia/toolkits/${n}`);
    if (usaNoProjeto(n)) ctx.tela.aviso(`este projeto usa o ${n}: depois peça "atualizar os agentes do Sabiá"`);
  }
  await confirmar(opcoes, `Remover ${qt(sai.length, "toolkit")}?`, false, `sabia toolkits remover ${sai.join(" ")}`);
  const ficaram = sai.filter((n) => { const m = removerToolkit(n, opcoes); mostrar({ texto: `${n} removido`, mantidos: m }, "apaga"); return m.length; });
  ctx.tela.fechar(ficaram.length ? `Pronto.\n   → para tirar as cópias alteradas: sabia toolkits remover ${ficaram.join(" ")} --forcar` : "Pronto.");
}

// papéis do toolkit.json → agentes do Sabiá (o mesmo mapa do gerar_agentes.py)
const AGENTE_DO_PAPEL = { desenvolvedor: "sa-desenvolvedor", especificador: "sa-especificador", produto: "sa-especificador",
  pesquisador: "sa-pesquisador", revisor: "sa-revisor", verificador: "sa-verificador" };

function manifestoInstalado(nome) {
  const f = sabia("toolkits", nome, "toolkit.json");
  if (!fs.existsSync(f)) throw new Error(`${nome} não está instalado — use: sabia toolkits instalar ${nome}`);
  return JSON.parse(fs.readFileSync(f, "utf8"));
}

/** Tira o toolkit do agentes.json: a entrada, os passos e as skills ligadas aos agentes. */
function desligarDoCfg(cfg, nome) {
  delete cfg.toolkits?.[nome];
  cfg.passos = (cfg.passos || []).filter((p) => p.toolkit !== nome);
  for (const a of Object.values(cfg.agentes || {}))
    if (a.skills) a.skills = a.skills.filter((s) => !s.startsWith(`skill://~/.sabia/toolkits/${nome}/`));
}

/** Põe o toolkit no agentes.json pelo manifesto: `passo` vai a `passos`, e cada skill aos agentes dos seus papéis. */
function ligarNoCfg(cfg, nome, m) {
  desligarDoCfg(cfg, nome);
  const fo = sabia("toolkits", nome, ".origem.json");
  cfg.toolkits = { ...cfg.toolkits, [nome]: { pasta: `~/.sabia/toolkits/${nome}`, versao: m.versao,
    ...(fs.existsSync(fo) ? { sha: JSON.parse(fs.readFileSync(fo, "utf8")).sha } : {}) } };
  const ligadas = [];
  for (const s of m.skills || []) {
    if (s.passo) cfg.passos.push({ toolkit: nome, skill: s.caminho, agente: Boolean(s.passo.agente) });
    for (const ag of new Set((s.papeis || []).map((p) => AGENTE_DO_PAPEL[p]).filter(Boolean))) {
      const a = ((cfg.agentes ||= {})[ag] ||= {}), id = `skill://~/.sabia/toolkits/${nome}/${s.caminho}`;
      if (!(a.skills ||= []).includes(id)) a.skills.push(id);
      ligadas.push(`${path.basename(path.dirname(s.caminho))} → ${ag}`);
    }
  }
  return ligadas;
}

const detectado = ({ arquivos = [], contem = [] } = {}) => !arquivos.length || arquivos.some((a) => {
  const f = path.join(process.cwd(), a);
  return fs.existsSync(f) && contem.every((c) => fs.readFileSync(f, "utf8").includes(c));
});

/** As seções geradas do sabia.md: a tabela de desvios vem do agentes.json e a de tipos, do que o gerador imprime. */
function atualizarSabiaMd(cfg, saidaGerador) {
  const f = path.join(process.cwd(), ".sabia", "sabia.md");
  if (!fs.existsSync(f)) return;
  const corpo = (md, titulo, texto) => md.replace(new RegExp(`(## ${titulo}\\n\\n[\\s\\S]*?\\n\\n)[\\s\\S]*?(?=\\n## |$)`), (_, cab) => `${cab}${texto}\n`);
  const desvios = (cfg.passos || []).flatMap((p) => {
    const m = manifestoInstalado(p.toolkit), s = (m.skills || []).find((x) => x.caminho === p.skill);
    return s?.passo ? [`| \`${s.passo.passo}\` | \`${p.toolkit}\` ${m.versao} | ${s.passo.para} | \`${path.basename(path.dirname(p.skill))}\` | ${p.agente ? `\`${s.passo.agente}\`` : "—"} |`] : [];
  });
  const tipos = saidaGerador.split("Tipos com skill de toolkit (seção do sabia.md):\n")[1]?.split(/\n(?:aviso:|\nO que não tem)/)[0].trim();
  let md = fs.readFileSync(f, "utf8");
  md = corpo(md, "Desvios de toolkit", desvios.length ? ["| Passo | Toolkit | Para | Skill | Agente |", "|---|---|---|---|---|", ...desvios].join("\n") : "Nenhum.");
  fs.writeFileSync(f, corpo(md, "Tipos com skill de toolkit", tipos || "Nenhum."));
}

/** `sabia toolkits ligar|desligar <nome…>`: muda o agentes.json do projeto, regenera os agentes e o sabia.md. */
async function mudarToolkits(nomes, opcoes, ligar) {
  const acao = ligar ? "ligar" : "desligar";
  ctx.tela.abrir(`sabia toolkits ${acao}`);
  if (!nomes.length) throw new Error(`diga o toolkit — use: sabia toolkits ${acao} <nome> -y`);
  const f = path.join(process.cwd(), ".sabia", "config", "agentes.json");
  if (!fs.existsSync(f)) throw new Error("este projeto não tem .sabia/config/agentes.json — rode a sa-setup antes");
  const antes = fs.readFileSync(f, "utf8"), cfg = JSON.parse(antes);
  const linhas = [];
  for (const n of nomes) {
    if (!ligar) {
      if (!cfg.toolkits?.[n]) throw new Error(`${n} não está ligado neste projeto`);
      desligarDoCfg(cfg, n);
      linhas.push(`✗ ${n}`);
      continue;
    }
    const m = manifestoInstalado(n);
    if (!detectado(m.deteccao)) ctx.tela.aviso(`${n}: a detecção do toolkit não casou com este projeto`);
    linhas.push(`${n} ${m.versao}`, ...ligarNoCfg(cfg, n, m).map((l) => `  ${l}`));
  }
  ctx.tela.nota(linhas.join("\n"), "Resumo");
  await confirmar(opcoes, `${ligar ? "Ligar" : "Desligar"} ${qt(nomes.length, "toolkit")} e regenerar os agentes?`, true, `sabia toolkits ${acao} ${nomes.join(" ")}`);
  fs.writeFileSync(f, JSON.stringify(cfg, null, 2) + "\n");
  const r = ctx.exec("uv", ["run", "--no-project", "python", sabia("framework", "skills/sa-setup/scripts/gerar_agentes.py"), "--projeto", process.cwd(), "--gravar"]);
  if (r.status !== 0) {
    fs.writeFileSync(f, antes);  // o gerador recusa antes de gravar: nada fica pela metade
    throw new Error(`o gerador recusou; agentes.json restaurado:\n${r.stderr || r.stdout || r.error?.message}`);
  }
  atualizarSabiaMd(cfg, r.stdout);
  for (const a of r.stdout.split("\n").filter((l) => l.startsWith("aviso: "))) ctx.tela.aviso(a.slice(7));
  ctx.tela.fechar("Pronto: agentes e sabia.md atualizados. Confira o diff e faça o commit.");
}

/** `sabia toolkits atualizar [nome…]`: busca todos (sem gravar), uma tabela de → para e um confirm. */
export async function atualizarToolkits(nomes = [], opcoes = {}) {
  ctx.tela.abrir("sabia toolkits atualizar");
  const inv = lerInventario();
  // sem nome: os baixados (o registro das cópias alteradas que o remover deixou não tem o que atualizar)
  if (!nomes.length) nomes = Object.keys(inv.toolkits).filter((n) => fs.existsSync(sabia("toolkits", n, ".origem.json")));
  if (!nomes.length) return ctx.tela.fechar("nenhum toolkit instalado — veja: sabia toolkits");
  const buscados = ctx.tela.esperar("buscando as versões novas …", () => nomes.map((n) => {
    const fo = sabia("toolkits", n, ".origem.json");
    if (!inv.toolkits[n] || !fs.existsSync(fo)) throw new Error(`${n} não está instalado pelo CLI — use: sabia toolkits instalar ${n}`);
    const origem = JSON.parse(fs.readFileSync(fo, "utf8"));
    const alvo = origem.indice ? n : `${origem.url}${origem.ref ? "@" + origem.ref : ""}${origem.subpasta ? "#" + origem.subpasta : ""}`;
    return { n, b: buscarToolkit(alvo, { ...opcoes, indice: origem.indice || opcoes.indice }) };
  }), (l) => `${qt(l.length, "toolkit")} conferido${l.length === 1 ? "" : "s"}`);
  for (const { n, b } of buscados) if (!b.mudou) ctx.tela.ok(`${n} já na última versão (${b.m.versao})`);
  const novos = buscados.filter(({ b }) => b.mudou);
  if (!novos.length) return ctx.tela.fechar("Nada a atualizar.");
  ctx.tela.nota(colunas(novos.map(({ n, b }) => [n, `${b.de || "—"} → ${b.m.versao}`, linhasDif(b.dif).join("; ")])), "Atualizar");
  await confirmar(opcoes, `Atualizar ${qt(novos.length, "toolkit")}?`, true, `sabia toolkits atualizar ${novos.map((x) => x.n).join(" ")}`);
  for (const { n, b } of novos) {
    gravarToolkit(b);
    mostrar(await instalarToolkit(n, { ...opcoes, alvo: Object.keys(inv.toolkits[n]?.alvos || {}).join(",") || "kiro" }));
  }
  ctx.tela.fechar('Pronto.\n   → em cada projeto, peça "atualizar os agentes do Sabiá"');
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
  // autor e customiza: do toolkit baixado (o toolkit.json) ou, sem ele, da entrada do índice
  const manifesto = (n) => { const f = sabia("toolkits", n, "toolkit.json"); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : {}; };
  const linhas = [], doIndice = {};
  for (const i of opcoes.indice ? [opcoes.indice] : indices()) {
    try {
      for (const e of lerIndice(i)) {
        doIndice[e.nome] = e;
        linhas.push([e.nome, "", e.versao || "—", inv.toolkits[e.nome]?.versao || "—", doProjeto[e.nome]?.versao || "—", e.descricao || ""]);
      }
    } catch (err) {
      console.error(`sabia: índice ${i}: ${err.message}`);  // no stderr: o stdout do --json fica um JSON só
    }
  }
  for (const [n, t] of Object.entries(inv.toolkits)) if (!linhas.some((l) => l[0] === n)) linhas.push([n, "", "—", t.versao, doProjeto[n]?.versao || "—", "(fora dos índices)"]);
  for (const l of linhas) {
    const a = manifesto(l[0]).autor ?? doIndice[l[0]]?.autor;
    l[1] = a ? `${a.nome} (${a.area})` : "—";
  }
  // a customização logo abaixo da base, com ↳ e de onde veio
  for (const l of [...linhas]) {
    const c = manifesto(l[0]).customiza ?? doIndice[l[0]]?.customiza;
    if (!c) continue;
    linhas.splice(linhas.indexOf(l), 1);
    const i = linhas.findIndex((b) => b[0] === c.toolkit);
    // só a primeira mudança (quem customizou), como resumo; a lista inteira está no toolkit.json
    l[5] = `customiza ${c.toolkit} ${c.versao}${c.mudancas?.length ? `: ${c.mudancas[0]}${c.mudancas.length > 1 ? "; …" : ""}` : ""}${l[5] ? " — " + l[5] : ""}`;
    l[0] = `↳ ${l[0]}`;
    linhas.splice(i < 0 ? linhas.length : i + 1, 0, l);
  }
  if (opcoes.json) {  // para o sa-status e para bots: um array só, sem cor; "—" vira null
    const v = (x) => (x === "—" || x === "" ? null : x);
    ctx.log(JSON.stringify(linhas.map(([rotulo, autor, indice, instalado, projeto, descricao]) => {
      const nome = rotulo.replace(/^↳ /, "");
      return { nome, autor: v(autor), indice: v(indice), instalado: v(instalado), projeto: v(projeto), descricao: v(descricao),
        customiza: (manifesto(nome).customiza ?? doIndice[nome]?.customiza)?.toolkit ?? null };
    }), null, 2));
    return linhas;
  }
  // no terminal, a descrição é cortada na largura da tela; em pipe ou arquivo, sai inteira
  const largura = process.stdout.columns;
  const corta = (s) => { const c = [...s]; return !largura || c.length <= largura ? s : c.slice(0, largura - 1).join("") + "…"; };
  ctx.log(colunas([["TOOLKIT", "AUTOR", "NO ÍNDICE", "INSTALADO", "NESTE PROJETO", "DESCRIÇÃO"], ...linhas]).split("\n").map(corta).join("\n"));
  return linhas;
}

// ---------- rota (diagnóstico, para pessoas) ----------

const lerJson = (f, padrao) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : padrao);
const lerFm = (f) => (fs.existsSync(f) ? partes(fs.readFileSync(f, "utf8")).dados || {} : null);

/** Glob do `passo.arquivos`: `**` atravessa `/`; `*` e `?` não. */
export function casaGlob(glob, arquivo) {
  const rx = glob.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*\/|\*\*|\*|\?/g, (t) => ({ "**/": "(?:.*/)?", "**": ".*", "*": "[^/]*", "?": "[^/]" })[t]);
  return new RegExp(`^${rx}$`).test(arquivo);
}

/** Colunas alinhadas; a última sem preenchimento. */
const colunas = (linhas) => {
  const w = [];
  for (const l of linhas) l.slice(0, -1).forEach((c, i) => { w[i] = Math.max(w[i] || 0, c.length); });
  return linhas.map((l) => l.map((c, i) => (i < l.length - 1 ? c.padEnd(w[i]) : c)).join("  ").trimEnd()).join("\n");
};

/** Framework instalado (ou --framework), projeto (ou --projeto) e os desvios ligados nele, como o gerador os resolve. */
function contextoRota(opcoes) {
  const fw = path.resolve(opcoes.framework || sabia("framework"));
  if (!fs.existsSync(path.join(fw, "fluxo"))) throw new Error(`${curto(fw)} não tem fluxo/: rode \`sabia instalar\` ou passe --framework`);
  const projeto = path.resolve(opcoes.projeto || process.cwd());
  const cfg = lerJson(path.join(projeto, ".sabia", "config", "agentes.json"), {});
  const m = carregar(fw);
  const dirTk = (nome) => { const pasta = cfg.toolkits?.[nome]?.pasta; return !pasta ? sabia("toolkits", nome) : pasta.startsWith("~/") ? longo(pasta) : path.resolve(projeto, pasta); };
  // os tipos dos toolkits do projeto viram o desvio por tipo: a skill do toolkit, com o fluxo do tipo, se o traz
  const tipos = [];
  for (const nome of Object.keys(cfg.toolkits || {})) {
    const man = lerJson(path.join(dirTk(nome), "toolkit.json"), null);
    if (!man) continue;
    for (const [sigla, q] of Object.entries(man.tipos || {})) {
      if (typeof q?.skill !== "string") { tipos.push({ sigla, fluxo: "(inválido: o tipo no toolkit.json precisa de {\"skill\"}; o gerador recusa)", toolkit: nome, versao: man.versao }); continue; }
      const sk = path.basename(path.dirname(q.skill));
      tipos.push({ sigla, fluxo: q.fluxo ? `skill ${sk} (${q.fluxo})` : `skill ${sk}`, toolkit: nome, versao: man.versao });
    }
  }
  const desvios = (cfg.passos || []).flatMap((e) => {
    const dir = dirTk(e.toolkit);
    const man = lerJson(path.join(dir, "toolkit.json"), null);
    const ext = man?.skills?.find((x) => x.caminho === e.skill && x.passo)?.passo;
    if (!ext) { ctx.log(`aviso: toolkit ${e.toolkit} sem passo em ${e.skill} (${curto(dir)})`); return []; }
    if (!ext.passo) {
      ctx.log(`aviso: toolkit ${e.toolkit}: o passo de ${e.skill} não tem o id: use o id do passo (passo.passo)`
        + ` e reinstale o toolkit (\`sabia toolkits atualizar ${e.toolkit}\`) — ignorado`);
      return [];
    }
    // como o gancho() do gerador: só passo do framework com "desvio": true (senão o gerador recusa e o prompt não o tem)
    const g = ganchoDe(m, ext), passo = g?.x.desvio ? g.id : null;
    if (!passo) {
      ctx.log(`aviso: toolkit ${e.toolkit}: o passo ${ext.passo} não aceita desvio de toolkit (o gerador recusa) — ignorado`);
      return [];
    }
    const agente = e.agente && ext.agente ? ext.agente : null;
    const skills = agente ? (man.agentes || []).find((a) => a.nome === agente)?.skills || [] : [e.skill];
    return [{ toolkit: e.toolkit, versao: man.versao, passo, para: ext.para, arquivos: ext.arquivos || [],
      agente, skill: path.basename(path.dirname(e.skill)), skills: skills.map((x) => path.basename(path.dirname(x))) }];
  });
  return { fw, projeto, m, versao: lerJson(path.join(fw, "plugin.json"), {}).version || "?", desvios, tipos };
}

/** Os passos do fluxo `q` na ordem, com o que o projeto mudou: origem sabia | projeto (corpo trocado) | inserido | removido. */
function resolverFluxo(c, q) {
  const fl = c.m.fluxos[q.replace("/", ".")];
  if (!fl) throw new Error(`fluxo ${q} não existe em ${curto(c.fw)} (use skill.fluxo, ex.: sa-desenvolver.codificar)`);
  const dir = path.join(c.projeto, ".sabia", "fluxo", fl.skill, fl.fluxo);
  const ops = lerFm(path.join(dir, `${fl.fluxo}.md`)) || {};
  const doProjeto = (id) => path.join(dir, "passos", `${id}.md`);
  const passos = fl.passos.map((x) => {
    const base = lerFm(doProjeto(x.id));
    const origem = (ops.remover || []).includes(x.id) ? "removido" : base ? "projeto" : "sabia";
    return { ...x, origem, base: base?.base, arq: base ? doProjeto(x.id) : x.arq };
  });
  let falta = [...(ops.inserir || [])];
  while (falta.length) {  // em qualquer ordem, inclusive depois de outro inserido
    const prontos = falta.filter((o) => passos.some((x) => x.id === o.depois));
    if (!prontos.length) { ctx.log(`aviso: ${q}: inserir ${falta.map((o) => `${o.id} depois de ${o.depois}`).join(", ")}: o 'depois' não existe`); break; }
    for (const o of prontos) {
      let i = passos.findIndex((x) => x.id === o.depois);
      while (passos[i + 1]?.depois === o.depois) i++;
      passos.splice(i + 1, 0, { id: o.id, depois: o.depois, origem: "inserido", arq: doProjeto(o.id) });
    }
    falta = falta.filter((o) => !prontos.includes(o));
  }
  return { fl, q: `${fl.skill}.${fl.fluxo}`, passos };
}

const travasDe = (fl, x) => [...new Set([...(fl.d.travas_gerais || []), ...(x?.travas || [])])].join(", ") || "—";

/** A tarefa `id` do tasks.md (`1`, `2.1`; `T-2` também): o texto do bloco dela (a linha e as de baixo, mais
 * recuadas) e o que ela cita entre crases, sem espaço (os arquivos, classes e métodos). */
export function lerTarefa(arquivo, id) {
  if (!fs.existsSync(arquivo)) throw new Error(`${arquivo} não existe`);
  const norm = (t) => t.replace(/^T-?/i, "").split(".").map(Number).join(".");
  const linhas = fs.readFileSync(arquivo, "utf8").split("\n");
  let achado;
  const i = linhas.findIndex((l) => (achado = l.match(/^\s*- \[.\]\*? (\d+(?:\.\d+)*)\.? /)) && norm(achado[1]) === norm(id));
  if (i < 0) throw new Error(`${arquivo}: não há a tarefa ${id} (use o número dela, ex.: #2 ou #2.1)`);
  let fim = i + 1;
  // linha em branco entre as subtarefas não fecha o bloco; fecha a primeira linha com recuo igual ou menor
  for (let k = i + 1; k < linhas.length; k++) {
    const r = linhas[k].search(/\S/);
    if (r < 0) continue;
    if (r <= linhas[i].search(/\S/)) break;
    fim = k + 1;
  }
  const texto = linhas.slice(i, fim).filter((l) => l.trim()).map((l) => l.trim().replace(/^- (?:\[.\]\*? )?/, "")).join(" · ");
  return { id: achado[1], texto, arquivos: [...new Set([...texto.matchAll(/`([^`\s]+)`/g)].map((m) => m[1]))] };
}

/** `sabia rota <arquivo>` (ou `<tasks.md>#<tarefa>`, pelos arquivos que ela cita): o passo com gancho cujo desvio
 * casa, o dono, o toolkit, o motivo e as travas. */
export function rota(arquivo, opcoes = {}) {
  const c = contextoRota(opcoes);
  const t = arquivo.match(/^(.+\.md)#(.+)$/), tarefa = t && lerTarefa(t[1], t[2]);
  const relativo = (a, base) => {
    const r = path.relative(c.projeto, path.resolve(base, a));
    return (r.startsWith("..") ? a : r).split(path.sep).join("/");  // fora do projeto: o caminho como veio
  };
  // a tarefa cita os arquivos como no repositório: relativos à raiz do projeto
  const alvos = tarefa ? tarefa.arquivos.map((a) => relativo(a, c.projeto)) : [relativo(arquivo, process.cwd())];
  const ganchos = Object.entries(c.m.fluxos).flatMap(([q, fl]) => fl.passos.filter((x) => x.desvio).map((x) => `${q}.${x.id}`));
  let casou = null;
  achar: for (const d of c.desvios) for (const a of alvos) { const g = d.arquivos.find((x) => casaGlob(x, a)); if (g) { casou = { d, g, a }; break achar; } }
  // sem casar: o passo dos desvios por arquivo do projeto (o de código), senão o primeiro gancho do framework
  const pid = casou?.d.passo || c.desvios.find((d) => d.arquivos.length)?.passo || ganchos[0];
  if (!pid) throw new Error(`${curto(c.fw)} não tem passo com desvio de toolkit`);
  const { fl, passos } = resolverFluxo(c, pid.split(".").slice(0, 2).join("."));
  const x = passos.find((y) => y.id === pid.split(".")[2]);
  if (!x) throw new Error(`o desvio aponta para ${pid}, que não é passo do Sabiá instalado`);
  const agentes = [`.opencode/agents/${fl.d.dono}.md`, `.kiro/agents/${fl.d.dono}.json`].filter((f) => fs.existsSync(path.join(c.projeto, f)));
  const linhas = [
    ...(tarefa ? [["tarefa", tarefa.id, tarefa.texto]] : []),
    ["passo", pid, x.origem === "projeto" ? `${path.relative(c.projeto, x.arq)} (projeto)` : `${curto(x.arq)} (Sabiá ${c.versao})`],
    ["dono", fl.d.dono, agentes.join(", ") || "agente não gerado neste projeto"],
  ];
  if (casou) linhas.push(["desvio", casou.d.agente || `skill ${casou.d.skill}`, `toolkit ${casou.d.toolkit} ${casou.d.versao}`],
    ["motivo", `casou ${casou.g}${tarefa ? ` em ${casou.a}` : ""}`], ["skills", [fl.skill, ...casou.d.skills].join(", ")]);
  else {
    linhas.push(["desvio", "— fluxo padrão", "nenhum padrão casou"]);
    for (const d of c.desvios.filter((y) => y.passo === pid)) linhas.push(["pelo texto", `"${d.para}" → ${d.agente || `skill ${d.skill}`}`, "o modelo decide pela tarefa"]);
  }
  linhas.push(["travas", travasDe(fl, x)]);
  return colunas(linhas);
}

const sid = (t) => t.replace(/[^A-Za-z0-9_]/g, "_");
const rotulo = (t) => t.replace(/[;:]/g, ",").replace(/[`"#]/g, "");

/** `sabia rota --fluxo <skill.fluxo>`: a tabela resolvida (com o que o projeto mudou), o grafo ASCII e o diagrama de estados. */
export function rotaFluxo(q, opcoes = {}) {
  const c = contextoRota(opcoes);
  const r = resolverFluxo(c, q), { fl } = r;
  const desvios = c.desvios.filter((d) => d.passo?.startsWith(`${r.q}.`));
  // desvio por tipo: o tipo que o passo cria tem skill de toolkit no projeto
  const porTipo = (x) => c.tipos.filter((t) => x.tipos?.includes(t.sigla));
  const origem = (x) => ({ sabia: "Sabiá", projeto: `projeto${x.base ? ` (base ${x.base})` : ""}`,
    inserido: `projeto, inserido depois de ${x.depois}`, removido: "removido no projeto" })[x.origem];
  let n = 0;
  const tabela = [["#", "passo", "origem", "chama", "travas", "saídas"], ...r.passos.map((x) => [
    x.origem === "removido" ? "-" : String(++n), x.id + (temDesvio(x) ? " ⇢" : ""), origem(x), [].concat(x.chama || []).join(", ") || "—",
    (x.travas || []).join(", ") || "—", Object.entries(x.saidas || {}).map(([k, v]) => `${k} → ${v.replace(/^→ /, "passa a ")}`).join("; ") || "—"])];
  const cab = [["fluxo", r.q, `dono ${fl.d.dono}`, `Sabiá ${c.versao}`], ["travas", (fl.d.travas_gerais || []).join(", ") || "—"],
    ...desvios.map((d) => ["desvio ⇢", `${d.passo.split(".")[2]}: ${d.arquivos.join(", ") || `"${d.para}"`}`, `→ ${d.agente || `skill ${d.skill}`}`, `toolkit ${d.toolkit} ${d.versao}`]),
    ...r.passos.flatMap((x) => porTipo(x).map((t) => ["tipo ⇢", `${x.id}: ${t.sigla}`, `→ ${t.fluxo}`, `toolkit ${t.toolkit} ${t.versao}`]))];

  const out = ["stateDiagram-v2"], declarados = new Set();
  const estado = (id, nome = id) => {
    const s = sid(id);
    if (s !== nome && !declarados.has(s)) { declarados.add(s); out.push(`  state "${nome}" as ${s}`); }
    return s;
  };
  const ativos = r.passos.filter((x) => x.origem !== "removido");
  ativos.forEach((x, i) => {
    const a = estado(x.id), prox = ativos[i + 1];
    if (!i) out.push(`  [*] --> ${a}`);
    for (const [cond, dest] of Object.entries(x.saidas || {})) {
      if (dest === "fim") out.push(`  ${a} --> [*]: ${rotulo(cond)}`);
      else if (dest.startsWith("→ ")) { const q2 = dest.slice(2).trim(); out.push(`  ${a} --> ${estado(`x_${q2}`, q2)}: ${rotulo(cond)} (passagem)`); }
      else if (ativos.some((y) => y.id === dest)) out.push(`  ${a} --> ${estado(dest)}: ${rotulo(cond)}`);
    }
    out.push(prox ? `  ${a} --> ${estado(prox.id)}${prox.origem === "inserido" ? ": projeto (inserido)" : ""}` : `  ${a} --> [*]`);
    const nota = [x.chama && `chama ${[].concat(x.chama).join(", ")}`, x.origem === "projeto" && `corpo do projeto${x.base ? ` (base ${x.base})` : ""}`,
      x.desvio && desvios.length && `desvio ⇢ ${desvios.filter((d) => d.passo === `${r.q}.${x.id}`).map((d) => d.agente || d.skill).join(", ")}`,
      ...porTipo(x).map((t) => `tipo ${t.sigla} ⇢ ${t.fluxo}`)].filter(Boolean);
    if (nota.length) out.push(`  note right of ${a}: ${rotulo(nota.join(" · "))}`);
  });
  const notas = (x) => [x.origem !== "sabia" && `origem: ${origem(x)}`,
    ...desvios.filter((d) => d.passo === `${r.q}.${x.id}`).map((d) => `⇢ desvio → ${d.agente || `skill ${d.skill}`} (toolkit ${d.toolkit} ${d.versao})`),
    ...porTipo(x).map((t) => `⇢ tipo ${t.sigla} → ${t.fluxo} (toolkit ${t.toolkit} ${t.versao})`)].filter(Boolean);
  return [colunas(cab), "", colunas(tabela), "", grafoAscii(fl, ativos, { notas }), "", LEGENDA, "", "```mermaid", ...out, "```"].join("\n");
}

/** `sabia rota --mapa`: as arestas entre fluxos de todo o framework (chama e passagens), em Mermaid. */
export function rotaMapa(opcoes = {}) {
  const c = contextoRota(opcoes);
  const out = ["flowchart LR"], nos = new Set(), vistas = new Set();
  const no = (q) => { const s = sid(q); if (!nos.has(s)) { nos.add(s); out.push(`  ${s}["${q}"]`); } return s; };
  for (const [q, fl] of Object.entries(c.m.fluxos))
    for (const x of fl.passos) {
      const arestas = [...[].concat(x.chama || []).map((d) => [d, "-->"]),
        ...Object.values(x.saidas || {}).filter((d) => d.startsWith("→ ")).map((d) => [d.slice(2).trim(), "-.->"])];
      for (const [d, seta] of arestas) {
        const q2 = d.split(".").slice(0, 2).join(".");
        if (vistas.has(`${q} ${seta} ${q2} ${x.id}`)) continue;
        vistas.add(`${q} ${seta} ${q2} ${x.id}`);
        out.push(`  ${no(q)} ${seta}|${x.id}| ${no(q2)}`);
      }
    }
  return [`Fluxos do Sabiá ${c.versao}: --> chama (volta ao passo) · -.-> passagem (o fluxo termina e segue no outro); rótulo = passo de origem`,
    "", "```mermaid", ...out, "```"].join("\n");
}

// ---------- linha de comando ----------

const FONTE = "[--versao X] [--fonte <pasta|url-git>[@ref]]";
const TK = "<nome>[@versao] | <url-git|pasta>[@ref][#subpasta]";
// [uso, o que faz, opções]: a ajuda geral mostra as duas primeiras; `<cmd> -h`, as linhas do comando com as opções
const USO = [
  ["sabia instalar", "instala o Sabiá (e toolkits) nas ferramentas", `[-a kiro,opencode] [-t <toolkit>,…] [-y] ${FONTE} [--forcar] [--sem-mcp]`],
  ["sabia atualizar", "atualiza o Sabiá instalado", `[-y] ${FONTE} [--forcar]`],
  ["sabia desinstalar", "tira o Sabiá das ferramentas", "[-a kiro,opencode] [-y] [--forcar]"],
  ["sabia toolkits", "lista os toolkits (índice, instalados, projeto)", "[listar|ls] [--json] [--indice <url-git|pasta>]"],
  ["sabia toolkits instalar", "escolhe e instala toolkits", `[${TK} …] [-a …] [-y] [--indice <url-git|pasta>] [--forcar]   (apelido i; sem nome, no projeto: as versões dele; fora: escolha no índice)`],
  ["sabia toolkits atualizar", "atualiza os toolkits instalados", "[<nome> …] [-y] [--indice <url-git|pasta>] [--forcar]   (sem nome: todos)"],
  ["sabia toolkits remover", "escolhe e remove toolkits", "[<nome> …] [-y] [--forcar]   (apelido rm; sem nome: escolha nos instalados)"],
  ["sabia toolkits ligar", "liga toolkits instalados ao projeto e regenera os agentes", "<nome> … [-y]"],
  ["sabia toolkits desligar", "desliga toolkits do projeto e regenera os agentes", "<nome> … [-y]"],
  ["sabia rota <arquivo>", "explica a rota de um arquivo", "o passo com desvio de toolkit, o dono, o toolkit, o motivo e as travas\n" +
    "  sabia rota <tasks.md>#<tarefa>     o mesmo pelos arquivos que a tarefa (#2, #2.1) cita; sem casar, o texto dela\n" +
    "  sabia rota --fluxo <skill.fluxo>   o fluxo resolvido no projeto (tabela, grafo ASCII e Mermaid)\n" +
    "  sabia rota --mapa                  as arestas entre fluxos (chama e passagens), em Mermaid\n" +
    "      [--projeto <pasta>] (padrão: a atual) [--framework <pasta>] (padrão: ~/.sabia/framework)"],
];

// [a flag como aparece no USO, a linha]: o `<cmd> -h` mostra só as que o comando aceita
const OPCOES = [
  ["[-a", "  -a, --alvo      as ferramentas (kiro, opencode); sem ela, as detectadas"],
  ["[-t", "  -t, --toolkits  toolkits para instalar junto com o Sabiá"],
  ["[-y]", "  -y, --sim       sem perguntas: as ferramentas detectadas e todo confirm vale como sim (sem terminal, é obrigatório)"],
  ["[--forcar]", "  --forcar        sobrescreve ou apaga o que não foi instalado pelo Sabiá ou foi alterado à mão (sem ela, a cópia alterada fica: ✎)"],
  ["[--sem-mcp]", "  --sem-mcp       não registra os MCPs"],
];

const AJUDA = `sabia ${VERSAO} — instala o Sabiá e os toolkits no Kiro e no opencode

${USO.map(([u, o]) => `  ${u.padEnd(27)}${o}`).join("\n")}
  -y sem perguntas · -h ajuda do comando · -v versão

Tudo fica em ~/.sabia/ (framework/, compilado/, toolkits/, inventario.json e indices.json).

experimente: npx sabia instalar`;

/** `sabia <cmd> -h`: as linhas do comando (de `sabia toolkits`, todas as do grupo), com as opções; nunca executa nada. */
function ajudaDe(prefixo) {
  const doCmd = USO.filter(([u]) => u === prefixo || u.startsWith(prefixo + " "));
  const linhas = doCmd.map(([u, o, op]) => `  ${u} — ${o}\n    ${op}`);
  const opcoes = OPCOES.filter(([f]) => doCmd.some(([, , op]) => op.includes(f))).map(([, l]) => l);
  return `uso:\n${linhas.join("\n")}\n\n${opcoes.join("\n")}`.trimEnd();
}

const CURTAS = { "-y": "--sim", "-h": "--ajuda", "-v": "--version", "-a": "--alvo", "-t": "--toolkits" };

const BOOLEANAS = ["sim", "forcar", "semMcp", "mapa", "ajuda", "version", "json"];
const COM_VALOR = ["alvo", "toolkits", "versao", "fonte", "indice", "fluxo", "projeto", "framework"];

export function lerArgs(argv) {
  const posicionais = [];
  const opcoes = {};
  for (let i = 0; i < argv.length; i++) {
    const a = CURTAS[argv[i]] ?? argv[i];
    if (!a.startsWith("-") || a === "-") { posicionais.push(a); continue; }
    const chave = a === "--help" ? "ajuda" : a.slice(2).replace(/-(\w)/g, (_, c) => c.toUpperCase());
    // a desconhecida não vira posicional nem engole o nome seguinte (`--froce java`)
    if (!a.startsWith("--") || ![...BOOLEANAS, ...COM_VALOR].includes(chave))
      throw new Error(`opção desconhecida ${argv[i]} — veja: sabia ${posicionais[0] ? posicionais[0] + " " : ""}-h`);
    if (BOOLEANAS.includes(chave)) opcoes[chave] = true;
    else if (argv[i + 1] === undefined || argv[i + 1].startsWith("-")) throw new Error(`--${a.slice(2)} precisa de um valor`);
    else opcoes[chave] = argv[++i];
  }
  return { posicionais, opcoes };
}

const APELIDOS = { ls: "listar", i: "instalar", rm: "remover" };
const COMANDOS = {
  instalar: (_, o) => instalar(o),
  atualizar: (_, o) => atualizar(o),
  desinstalar: (_, o) => desinstalar(o),
  "toolkits listar": (_, o) => { listarToolkits(o); },
  "toolkits instalar": instalarToolkits,
  "toolkits atualizar": atualizarToolkits,
  "toolkits remover": removerToolkits,
  "toolkits ligar": (n, o) => mudarToolkits(n, o, true),
  "toolkits desligar": (n, o) => mudarToolkits(n, o, false),
  rota: ([arquivo], o) => {
    if (!arquivo && !o.fluxo && !o.mapa) throw new Error("diga o arquivo, o --fluxo ou o --mapa — veja: sabia rota -h");
    ctx.log(o.mapa ? rotaMapa(o) : o.fluxo ? rotaFluxo(o.fluxo, o) : rota(arquivo, o));
  },
};

export { mudarToolkits };

export async function main(argv = process.argv.slice(2)) {
  let args;
  try { args = lerArgs(argv); } catch (e) { console.error(`sabia: ${e.message}`); return 1; }
  const { posicionais: [primeiro, ...resto], opcoes } = args;
  if (opcoes.version) { ctx.log(VERSAO); return 0; }
  if (!primeiro) { ctx.log((process.stdout.isTTY ? BANNER + "\n\n" : "") + AJUDA); return 0; }
  const grupo = primeiro === "toolkit" || primeiro === "toolkits";
  const sub = grupo ? resto.shift() : null;
  const cmd = grupo ? `toolkits ${APELIDOS[sub] ?? sub ?? "listar"}` : primeiro;
  if (!COMANDOS[cmd]) { console.error(`sabia: comando desconhecido "${grupo ? `toolkits ${sub}` : cmd}" — veja sabia -h`); return 1; }
  if (opcoes.ajuda) { ctx.log(ajudaDe(grupo && !sub ? "sabia toolkits" : `sabia ${cmd === "toolkits listar" ? "toolkits" : cmd}`)); return 0; }
  // o comando da pessoa, sem o -y, para a dica de quando falta o terminal
  const linha = ["sabia", ...argv.filter((a) => a !== "-y" && a !== "--sim").map((a) => (/^[\w@%+=:,./~#-]+$/.test(a) ? a : `'${a.replace(/'/g, "'\\''")}'`))].join(" ");
  try {
    await COMANDOS[cmd](resto, { ...opcoes, linha });
    return 0;
  } catch (e) {
    if (e instanceof Cancelado) { ctx.tela.cancelar("cancelado — nada foi alterado"); return 0; }
    if (quadroAberto) ctx.tela.cancelar("falhou");
    console.error(`sabia: ${e.message}`);
    return 1;
  }
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = await main();
