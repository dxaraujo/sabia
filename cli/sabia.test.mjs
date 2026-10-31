// node --test   (nesta pasta)
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { beforeEach, test } from "node:test";
import * as s from "./sabia.mjs";

let raiz, home, chamadas, respostas;

function escrever(base, arquivos) {
  for (const [f, conteudo] of Object.entries(arquivos)) {
    fs.mkdirSync(path.dirname(path.join(base, f)), { recursive: true });
    fs.writeFileSync(path.join(base, f), typeof conteudo === "string" ? conteudo : JSON.stringify(conteudo));
  }
  return base;
}

function framework(nome, versao, skills = ["sabia", "sa-setup", "sa-codificar"]) {
  return escrever(path.join(raiz, nome), {
    "plugin.json": { name: "sabia", version: versao },
    "mcp.json": { mcpServers: { elm: { type: "stdio", command: "uvx", args: ["mcp-elm@latest"], env: { UV_SYSTEM_CERTS: "true" } } } },
    ...Object.fromEntries(skills.map((k) => [`skills/${k}/SKILL.md`, `${k} ${versao}`])),
  });
}

beforeEach(() => {
  raiz = fs.mkdtempSync(path.join(os.tmpdir(), "sabia-teste-"));
  home = path.join(raiz, "home");
  fs.mkdirSync(home);
  process.env.HOME = home;
  chamadas = [];
  respostas = [];
  s.ctx.log = () => {};
  s.ctx.perguntar = async (texto, padrao) => (respostas.length ? respostas.shift() : padrao);
  s.ctx.exec = (cmd, args) => {
    chamadas.push([cmd, ...args].join(" "));
    if (cmd === "claude" && args[1] === "get") return { status: 1, stdout: "", stderr: "" };  // MCP ainda não existe
    return { status: 0, stdout: "", stderr: "" };
  };
});

const skill = (alvo, nome) => path.join(home, alvo === "claude" ? ".claude/skills" : ".config/opencode/skills", nome, "SKILL.md");

test("instala no Claude Code e no opencode, com o inventário", async () => {
  await s.instalar({ fonte: framework("fw", "1.1.0"), alvo: "claude,opencode" });
  for (const a of ["claude", "opencode"]) assert.equal(fs.readFileSync(skill(a, "sa-setup"), "utf8"), "sa-setup 1.1.0");
  assert.ok(fs.existsSync(path.join(home, ".sabia/framework/skills/sa-setup/SKILL.md")));
  const inv = s.lerInventario();
  assert.equal(inv.framework.versao, "1.1.0");
  assert.deepEqual(Object.keys(inv.alvos.claude.copias).sort(), ["~/.claude/skills/sa-codificar", "~/.claude/skills/sa-setup", "~/.claude/skills/sabia"]);
  assert.match(inv.alvos.claude.copias["~/.claude/skills/sa-setup"]["SKILL.md"], /^[0-9a-f]{64}$/);
  assert.deepEqual(inv.alvos.claude.mcp, ["elm"]);
  assert.ok(chamadas.includes("claude mcp add --scope user elm -e UV_SYSTEM_CERTS=true -- uvx mcp-elm@latest"));
  assert.ok(chamadas.includes("opencode mcp add --global --env UV_SYSTEM_CERTS=true elm -- uvx mcp-elm@latest"));
});

test("MCP que já existe não é registrado nem entra no inventário", async () => {
  escrever(home, { ".config/opencode/opencode.jsonc": '{\n  // meus MCPs\n  "x": "http://a//b",\n  "mcp": { "servers": { "elm": {} } },\n}\n' });
  assert.deepEqual(s.mcpsDoOpencode(), ["elm"]);
  await s.instalar({ fonte: framework("fw", "1.1.0"), alvo: "opencode" });
  assert.ok(!chamadas.some((c) => c.startsWith("opencode mcp add")));
  assert.deepEqual(s.lerInventario().alvos.opencode.mcp, []);
});

test("skill que já existe e não é do Sabiá é recusada", async () => {
  escrever(home, { ".claude/skills/sa-setup/SKILL.md": "de outra pessoa" });
  await assert.rejects(s.instalar({ fonte: framework("fw", "1.1.0"), alvo: "claude", semMcp: true }), /não foi instalado pelo Sabiá/);
  assert.equal(fs.readFileSync(skill("claude", "sa-setup"), "utf8"), "de outra pessoa");
});

test("atualizar mostra a diferença, troca as cópias, tira a skill que saiu e pergunta pela alterada à mão", async () => {
  await s.instalar({ fonte: framework("fw1", "1.1.0"), alvo: "claude", semMcp: true });
  fs.writeFileSync(skill("claude", "sa-codificar"), "mexi");
  respostas = ["s", "n"];  // atualizar? sim · sobrescrever a alterada à mão? não
  await s.atualizar({ fonte: framework("fw2", "1.2.0", ["sabia", "sa-setup", "sa-codificar"]) });
  assert.equal(fs.readFileSync(skill("claude", "sa-setup"), "utf8"), "sa-setup 1.2.0");
  assert.equal(fs.readFileSync(skill("claude", "sa-codificar"), "utf8"), "mexi");
  assert.equal(s.lerInventario().framework.versao, "1.2.0");

  await s.atualizar({ fonte: framework("fw3", "1.3.0", ["sabia", "sa-setup"]) });  // padrão das respostas: "n"
  assert.equal(s.lerInventario().framework.versao, "1.2.0");
  respostas = ["s", "s"];
  await s.atualizar({ fonte: framework("fw3b", "1.3.0", ["sabia", "sa-setup"]) });
  assert.ok(!fs.existsSync(skill("claude", "sa-codificar")));
  assert.ok(!("~/.claude/skills/sa-codificar" in s.lerInventario().alvos.claude.copias));
});

test("desinstalar apaga só o que o inventário registrou", async () => {
  await s.instalar({ fonte: framework("fw", "1.1.0"), alvo: "claude,kiro" });
  escrever(home, { ".claude/skills/minha/SKILL.md": "minha" });
  await s.desinstalar({});
  assert.ok(!fs.existsSync(skill("claude", "sa-setup")));
  assert.ok(fs.existsSync(skill("claude", "minha")));
  assert.ok(chamadas.includes("claude mcp remove --scope user elm"));
  await s.instalar({ fonte: framework("fw", "1.1.0"), alvo: "opencode" });
  escrever(home, { ".config/opencode/opencode.json": { mcp: { servers: { elm: {}, meu: {} } } } });
  await s.desinstalar({});
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(home, ".config/opencode/opencode.json"), "utf8")).mcp.servers, { meu: {} });
  assert.ok(chamadas.some((c) => c.startsWith("kiro-cli powers install ")));
  assert.ok(chamadas.includes("kiro-cli powers uninstall sabia"));
  const inv = s.lerInventario();
  assert.deepEqual(inv.alvos, {});
  assert.equal(inv.framework, null);
  assert.ok(!fs.existsSync(path.join(home, ".sabia/framework")));
});

test("power do Kiro instalado por fora é recusado, e falha não deixa rastro no inventário", async () => {
  escrever(home, { ".kiro/powers/installed/sabia/plugin.json": "{}" });
  await assert.rejects(s.instalar({ fonte: framework("fw", "1.1.0"), alvo: "kiro" }), /não foi instalado pelo CLI/);
  assert.equal(s.lerInventario().alvos.kiro, undefined);
  s.ctx.exec = (cmd, args) => ({ status: args[1] === "install" ? 1 : 0, stderr: "falhou" });
  fs.rmSync(path.join(home, ".kiro"), { recursive: true });
  await assert.rejects(s.instalar({ fonte: framework("fw", "1.1.0"), alvo: "kiro" }), /falhou/);
  assert.equal(s.lerInventario().alvos.kiro, undefined);
});

test("separa a ref sem confundir com git@host:", () => {
  assert.deepEqual(s.separarRef("batch-alfa@1.0.0"), ["batch-alfa", "1.0.0"]);
  assert.deepEqual(s.separarRef("git@gitlab.x:grupo/sub/tk.git@v2"), ["git@gitlab.x:grupo/sub/tk.git", "v2"]);
  assert.deepEqual(s.separarRef("git@gitlab.x:grupo/tk.git"), ["git@gitlab.x:grupo/tk.git", null]);
  assert.deepEqual(s.separarRef("https://github.com/a/b.git"), ["https://github.com/a/b.git", null]);
});

function toolkit(base, mudar = {}) {
  return escrever(base, {
    "skills/batch/SKILL.md": "batch",
    "agentes/job.md": "job",
    "toolkit.json": { nome: "batch-alfa", versao: "1.0.0", descricao: "toolkit fictício", autor: { nome: "Ana Exemplo", area: "Equipe Alfa" },
      "tipos-de-projeto": ["batch"],
      skills: [{ caminho: "skills/batch/SKILL.md", papeis: ["codificador"], passo: { papel: "codificador", para: "job", agente: "batch-job" } }],
      agentes: [{ nome: "batch-job", descricao: "codifica um job", prompt: "agentes/job.md", skills: ["skills/batch/SKILL.md"] }], ...mudar },
  });
}

test("valida o toolkit: nome, caminhos presos à pasta e referências", () => {
  assert.deepEqual(s.validarToolkit(toolkit(path.join(raiz, "ok")), "batch-alfa"), []);
  const erros = (mudar, nome) => s.validarToolkit(toolkit(path.join(raiz, Math.random().toString(36).slice(2)), mudar), nome).join("\n");
  assert.match(erros({}, "outro"), /≠ outro/);
  assert.match(erros({ nome: "sa-batch" }), /nome inválido/);
  assert.match(erros({ skills: [{ caminho: "../fora/SKILL.md", papeis: ["codificador"] }] }), /fora da pasta/);
  assert.match(erros({ skills: [{ caminho: "skills/nao/SKILL.md", papeis: ["codificador"] }] }), /não existe/);
  assert.match(erros({ agentes: [{ nome: "sa-job", descricao: "x", prompt: "/etc/x.md" }] }), /nome inválido[\s\S]*fora da pasta/);
  assert.match(erros({ agentes: [] }), /agente batch-job não está em agentes/);
  assert.match(erros({ customiza: { toolkit: "batch-alfa" } }), /customiza/);
  assert.equal(erros({ customiza: { toolkit: "spring-alfa", versao: "1.0.0" } }), "");
  assert.match(erros({ autor: undefined }), /falta o campo autor/);
  assert.match(erros({ autor: { nome: "Ana" } }), /autor: precisa de nome e area/);
});

test("customização: cópia modificada da base, listada abaixo dela e recusada com a base já instalada", async () => {
  const indice = escrever(path.join(raiz, "indice-c"), {
    ".claude-plugin/marketplace.json": { name: "idx", plugins: [
      { name: "batch-alfa-casa", version: "1.1.0", source: "./casa" }, { name: "batch-alfa", version: "1.0.0", source: "./base" }] },
  });
  toolkit(path.join(indice, "base"));
  toolkit(path.join(indice, "casa"), { nome: "batch-alfa-casa", versao: "1.1.0",
    customiza: { toolkit: "batch-alfa", versao: "1.0.0", mudancas: ["customizações feitas pela casa", "writers da casa"] } });
  // sem nada baixado, a relação vem da entrada do índice
  const ix = path.join(indice, ".claude-plugin/marketplace.json"), m = JSON.parse(fs.readFileSync(ix, "utf8"));
  m.plugins[0].customiza = { toolkit: "batch-alfa", versao: "1.0.0" };
  m.plugins[0].autor = { nome: "Bia Exemplo", area: "Casa" };
  fs.writeFileSync(ix, JSON.stringify(m));
  assert.deepEqual(s.listarToolkits({ indice }).map((l) => [l[0], l[1], l[5]]), [["batch-alfa", "—", ""], ["↳ batch-alfa-casa", "Bia Exemplo (Casa)", "customiza batch-alfa 1.0.0"]]);
  await s.instalarToolkit("batch-alfa", { indice, alvo: "kiro" });
  await assert.rejects(s.instalarToolkit("batch-alfa-casa", { indice, alvo: "kiro" }), /batch-alfa-casa e batch-alfa são versões do mesmo toolkit/);
  const linhas = s.listarToolkits({ indice });
  assert.deepEqual(linhas.map((l) => l[0]), ["batch-alfa", "↳ batch-alfa-casa"]);
  assert.match(linhas[1][5], /^customiza batch-alfa 1\.0\.0: customizações feitas pela casa; …/);
  assert.equal(linhas[0][1], "Ana Exemplo (Equipe Alfa)");  // do toolkit baixado
});

test("toolkit pelo índice: baixa, instala nas ferramentas, atualiza e remove pelo inventário", async () => {
  const indice = escrever(path.join(raiz, "indice"), {
    ".claude-plugin/marketplace.json": { name: "idx", plugins: [{ name: "batch-alfa", version: "1.0.0", source: "./batch-alfa" }] },
  });
  toolkit(path.join(indice, "batch-alfa"));
  await s.instalarToolkit("batch-alfa", { indice, alvo: "claude,kiro" });
  assert.ok(fs.existsSync(path.join(home, ".sabia/toolkits/batch-alfa/toolkit.json")));
  assert.equal(JSON.parse(fs.readFileSync(path.join(home, ".sabia/toolkits/batch-alfa/.origem.json"), "utf8")).indice, indice);
  assert.equal(fs.readFileSync(skill("claude", "batch"), "utf8"), "batch");
  assert.ok(!fs.existsSync(path.join(home, ".kiro")));  // o Kiro lê de ~/.sabia/toolkits
  const linhas = s.listarToolkits({ indice });
  assert.deepEqual([linhas[0][0], linhas[0][2], linhas[0][3]], ["batch-alfa", "1.0.0", "1.0.0"]);

  fs.writeFileSync(path.join(indice, "batch-alfa/skills/batch/SKILL.md"), "batch 2");
  respostas = ["s"];
  await s.atualizarToolkits("batch-alfa", {});
  assert.equal(fs.readFileSync(skill("claude", "batch"), "utf8"), "batch 2");

  const projeto = escrever(path.join(raiz, "projeto"), { ".sabia/config/agentes.json": { toolkits: { "batch-alfa": { versao: "1.0.0" } } } });
  const cwd = process.cwd();
  process.chdir(projeto);
  try { await s.instalarDoProjeto({ indice }); } finally { process.chdir(cwd); }  // a mesma versão: nada a fazer
  assert.equal(fs.readFileSync(skill("claude", "batch"), "utf8"), "batch 2");

  await s.removerToolkit("batch-alfa", {});
  assert.ok(!fs.existsSync(skill("claude", "batch")));
  assert.ok(!fs.existsSync(path.join(home, ".sabia/toolkits/batch-alfa")));
  assert.deepEqual(s.lerInventario().toolkits, {});
});

test("toolkit inválido é recusado e nada é gravado", async () => {
  const pasta = toolkit(path.join(raiz, "ruim"), { nome: "sa-ruim" });
  await assert.rejects(s.baixarToolkit(pasta, {}), /toolkit recusado/);
  assert.ok(!fs.existsSync(path.join(home, ".sabia/toolkits")));
});

test("a versão do CLI é a do framework (o instalar baixa a tag sabia-<versão do CLI>)", () => {
  const ler = (f) => JSON.parse(fs.readFileSync(new URL(f, import.meta.url), "utf8")).version;
  assert.equal(ler("./package.json"), ler("../plugin.json"));
});

test("banner: o sabiá colorido ao lado do nome; sem cores, só o nome", () => {
  const sem = s.banner({ cores: false });
  assert.ok(!sem.includes("\x1b") && sem.includes("███████╗ █████╗"));
  for (const bits24 of [true, false]) {
    const com = s.banner({ cores: true, bits24 }).split("\n").slice(1);
    assert.equal(com.length, 9);
    assert.ok(com[0].includes(bits24 ? "\x1b[38;2;" : "\x1b[38;5;"));
    // o nome começa na mesma coluna em todas as linhas, depois do sabiá
    const nome = sem.split("\n").slice(1), limpo = com.map((l) => [...l.replace(/\x1b\[[0-9;]*m/g, "")]);
    assert.equal(new Set(nome.map((n, i) => limpo[i].length - [...n].length)).size, 1);
  }
});

test("linha de comando: ajuda e comando desconhecido", async () => {
  assert.equal(await s.main(["--ajuda"]), 0);
  assert.equal(await s.main(["voar"]), 1);
  assert.deepEqual(s.lerArgs(["toolkits", "instalar", "x", "--alvo", "claude", "--sem-mcp"]),
    { posicionais: ["toolkits", "instalar", "x"], opcoes: { alvo: "claude", semMcp: true } });
});
