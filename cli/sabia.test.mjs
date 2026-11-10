// node --test   (nesta pasta)
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { afterEach, beforeEach, test } from "node:test";
import * as s from "./sabia.mjs";
import { statusDoProjeto } from "./status.mjs";
import { abrirQuadro, paginaHtml } from "./kanban.mjs";

let raiz, home, chamadas, respostas, saida, escolhas, logs;

function escrever(base, arquivos) {
  for (const [f, conteudo] of Object.entries(arquivos)) {
    fs.mkdirSync(path.dirname(path.join(base, f)), { recursive: true });
    fs.writeFileSync(path.join(base, f), typeof conteudo === "string" ? conteudo : JSON.stringify(conteudo));
  }
  return base;
}

function framework(nome, versao, skills = ["sabia", "sa-setup", "sa-desenvolver"]) {
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
  respostas = [];  // as respostas de escolher e confirmar, em ordem; sem resposta: o que vem marcado e o padrão
  saida = [];
  escolhas = [];
  logs = [];
  s.ctx.log = (x) => logs.push(String(x));
  s.ctx.interativo = true;
  s.ctx.escolher = async (p) => {
    escolhas.push(p);
    return respostas.length ? respostas.shift() : p.multi ? p.opcoes.filter((o) => o.marcado).map((o) => o.valor) : p.opcoes[0].valor;
  };
  s.ctx.confirmar = async (texto, padrao) => { saida.push(`? ${texto}`); return respostas.length ? respostas.shift() : padrao; };
  s.ctx.tela = { ...Object.fromEntries(["abrir", "fechar", "passo", "ok", "aviso", "cancelar"].map((k) => [k, (t) => saida.push(String(t))])),
    nota: (t, titulo) => saida.push(`[${titulo}]\n${t}`), marca: (simbolo, t) => saida.push(`${simbolo} ${t}`),
    esperar: (t, fn, fim) => { const r = fn(); saida.push(fim(r)); return r; } };
  s.ctx.exec = (cmd, args) => {
    chamadas.push([cmd, ...args].join(" "));
    return { status: 0, stdout: "", stderr: "" };
  };
});

afterEach(() => fs.rmSync(raiz, { recursive: true, force: true }));

const skill = (nome) => path.join(home, ".config/opencode/skills", nome, "SKILL.md");

test("instala no opencode e no Kiro, com o inventário; cursor é ferramenta desconhecida", async () => {
  await s.instalar({ fonte: framework("fw", "1.1.0"), alvo: "opencode,kiro" });
  assert.equal(fs.readFileSync(skill("sa-setup"), "utf8"), "sa-setup 1.1.0");
  assert.ok(fs.existsSync(path.join(home, ".sabia/framework/skills/sa-setup/SKILL.md")));
  const inv = s.lerInventario();
  assert.equal(inv.framework.versao, "1.1.0");
  const p = "~/.config/opencode/skills/";
  assert.deepEqual(Object.keys(inv.alvos.opencode.copias).sort(), [`${p}sa-desenvolver`, `${p}sa-setup`, `${p}sabia`]);
  assert.match(inv.alvos.opencode.copias[`${p}sa-setup`]["SKILL.md"], /^[0-9a-f]{64}$/);
  assert.deepEqual(inv.alvos.opencode.mcp, ["elm"]);
  assert.deepEqual(inv.alvos.kiro, { power: "sabia" });
  assert.ok(chamadas.includes("opencode mcp add --global --env UV_SYSTEM_CERTS=true elm -- uvx mcp-elm@latest"));
  await assert.rejects(s.instalar({ fonte: framework("fw", "1.1.0"), alvo: "cursor" }), /ferramenta desconhecida: cursor \(use kiro, opencode\)/);
  assert.ok(!("cursor" in s.lerInventario().alvos));
});

test("MCP que já existe não é registrado nem entra no inventário", async () => {
  escrever(home, { ".config/opencode/opencode.jsonc": '{\n  // meus MCPs\n  "x": "http://a//b",\n  "mcp": { "servers": { "elm": {} } },\n}\n' });
  assert.deepEqual(s.mcpsDoOpencode(), ["elm"]);
  await s.instalar({ fonte: framework("fw", "1.1.0"), alvo: "opencode" });
  assert.ok(!chamadas.some((c) => c.startsWith("opencode mcp add")));
  assert.deepEqual(s.lerInventario().alvos.opencode.mcp, []);
});

test("skill que já existe e não é do Sabiá é recusada", async () => {
  escrever(home, { ".config/opencode/skills/sa-setup/SKILL.md": "de outra pessoa" });
  await assert.rejects(s.instalar({ fonte: framework("fw", "1.1.0"), alvo: "opencode", semMcp: true }), /não foi instalado pelo Sabiá/);
  assert.equal(fs.readFileSync(skill("sa-setup"), "utf8"), "de outra pessoa");
});

test("atualizar: resumo e um confirm (padrão S); a alterada à mão fica com ✎, salvo --forcar; sem mudança, já na última versão", async () => {
  await s.instalar({ fonte: framework("fw1", "1.1.0"), alvo: "opencode", semMcp: true });
  fs.writeFileSync(skill("sa-desenvolver"), "mexi");
  await s.atualizar({ fonte: framework("fw2", "1.2.0", ["sabia", "sa-setup", "sa-desenvolver"]) });
  assert.equal(fs.readFileSync(skill("sa-setup"), "utf8"), "sa-setup 1.2.0");
  assert.equal(fs.readFileSync(skill("sa-desenvolver"), "utf8"), "mexi");
  assert.ok(saida.includes("✎ ~/.config/opencode/skills/sa-desenvolver alterada à mão — mantida (--forcar sobrescreve)"));
  assert.ok(saida.includes("? Atualizar?"));
  assert.equal(s.lerInventario().framework.versao, "1.2.0");

  respostas = [false];  // "não" no confirm: nada muda
  await assert.rejects(s.atualizar({ fonte: framework("fw3", "1.3.0", ["sabia", "sa-setup"]) }), s.Cancelado);
  assert.equal(s.lerInventario().framework.versao, "1.2.0");
  // a skill que saiu do framework sai da ferramenta; a alterada à mão fica
  await s.atualizar({ fonte: path.join(raiz, "fw3") });
  assert.equal(fs.readFileSync(skill("sa-desenvolver"), "utf8"), "mexi");
  assert.ok("~/.config/opencode/skills/sa-desenvolver" in s.lerInventario().alvos.opencode.copias);
  saida = [];
  await s.atualizar({ fonte: framework("fw3b", "1.3.0", ["sabia", "sa-setup"]) });  // o mesmo conteúdo
  assert.ok(saida.includes("já na última versão (1.3.0)") && !saida.includes("? Atualizar?"));
  await s.atualizar({ fonte: framework("fw4", "1.4.0", ["sabia", "sa-setup"]), forcar: true });
  assert.ok(!fs.existsSync(skill("sa-desenvolver")));
  assert.ok(!("~/.config/opencode/skills/sa-desenvolver" in s.lerInventario().alvos.opencode.copias));
});

test("skill de fluxo é compilada: os passos gerados entram no inventário e o passo editado à mão é detectado", async () => {
  const fw = framework("fw", "2.0.0");
  escrever(fw, {
    "skills/sa-desenvolver/SKILL.md": "---\nname: sa-desenvolver\nmetadata:\n  version: \"2.0.0\"\n---\n# sa-desenvolver\n",
    "fluxo/travas.json": { travas: {} },
    "fluxo/sa-desenvolver/codificar/codificar.md": '---\n{"fluxo": "codificar", "dono": "sa-x", "passos": [{"id": "tarefa"}]}\n---\n# Codificar\n',
    "fluxo/sa-desenvolver/codificar/passos/tarefa.md": '---\n{"resumo": "Uma tarefa."}\n---\n## Entrada\n\n## Faça\n\nCiclo.\n\n## Saída\n\n## Pare se\n\n—\n',
  });
  await s.instalar({ fonte: fw, alvo: "opencode" });
  const dir = path.join(home, ".config/opencode/skills/sa-desenvolver");
  assert.match(fs.readFileSync(path.join(dir, "SKILL.md"), "utf8"), /## Fluxo codificar/);
  const copias = s.lerInventario().alvos.opencode.copias["~/.config/opencode/skills/sa-desenvolver"];
  assert.match(copias["references/codificar/tarefa.md"], /^[0-9a-f]{64}$/);
  assert.equal(s.lerInventario().framework.compilador, JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url), "utf8")).version);
  fs.appendFileSync(path.join(dir, "references/codificar/tarefa.md"), "editado\n");
  escrever(fw, { "fluxo/sa-desenvolver/codificar/passos/tarefa.md": '---\n{"resumo": "Uma tarefa."}\n---\n## Entrada\n\n## Faça\n\nCiclo novo.\n\n## Saída\n\n## Pare se\n\n—\n' });
  await s.atualizar({ fonte: fw });  // confirm no padrão (S); o passo editado à mão fica
  assert.match(fs.readFileSync(path.join(dir, "references/codificar/tarefa.md"), "utf8"), /editado/);
});

test("desinstalar apaga só o que o inventário registrou", async () => {
  await s.instalar({ fonte: framework("fw", "1.1.0"), alvo: "opencode,kiro" });
  escrever(home, { ".config/opencode/skills/minha/SKILL.md": "minha", ".config/opencode/opencode.json": { mcp: { servers: { elm: {}, meu: {} } } } });
  await assert.rejects(s.desinstalar({}), s.Cancelado);  // destrutivo: o padrão do confirm é N
  assert.ok(fs.existsSync(skill("sa-setup")));
  assert.match(saida.find((x) => x.startsWith("[Sai]")), /✗ opencode: 3 skills · MCP elm\n✗ kiro: power sabia\n✗ ~\/\.sabia\/framework/);
  await s.desinstalar({ sim: true });
  assert.ok(!fs.existsSync(skill("sa-setup")));
  assert.ok(fs.existsSync(skill("minha")));
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
      skills: [{ caminho: "skills/batch/SKILL.md", papeis: ["desenvolvedor"], passo: { passo: "sa-desenvolver.codificar.tarefa", para: "job", agente: "batch-job" } }],
      agentes: [{ nome: "batch-job", descricao: "codifica um job", prompt: "agentes/job.md", skills: ["skills/batch/SKILL.md"] }], ...mudar },
  });
}

/** Roda `fn` dentro de um projeto novo, com o gerador trocado por um que só registra a chamada. */
async function emProjeto(fn, cfg = {}, nome = "projeto") {
  const proj = escrever(path.join(raiz, nome), { ".sabia/config/agentes.json": { produto: "p", branch_base: "main", ...cfg } });
  const cwd = process.cwd(), gerar = s.ctx.gerarAgentes;
  s.ctx.gerarAgentes = (o) => { chamadas.push(JSON.stringify(o)); return { avisos: [], tabelaTipos: [] }; };
  process.chdir(proj);
  try { return await fn(proj); } finally { process.chdir(cwd); s.ctx.gerarAgentes = gerar; }
}
const cfgDe = (proj) => JSON.parse(fs.readFileSync(path.join(proj, ".sabia/config/agentes.json"), "utf8"));
const indiceDe = (entradas) => escrever(path.join(raiz, `indice-${Math.random().toString(36).slice(2)}`), { "index.json": { nome: "idx", toolkits: entradas } });

test("valida o toolkit: nome, caminhos presos à pasta e referências", () => {
  assert.deepEqual(s.validarToolkit(toolkit(path.join(raiz, "ok")), "batch-alfa"), []);
  const erros = (mudar, nome) => s.validarToolkit(toolkit(path.join(raiz, Math.random().toString(36).slice(2)), mudar), nome).join("\n");
  assert.match(erros({}, "outro"), /≠ outro/);
  assert.match(erros({ nome: "sa-batch" }), /nome inválido/);
  assert.match(erros({ skills: [{ caminho: "../fora/SKILL.md", papeis: ["desenvolvedor"] }] }), /fora da pasta/);
  assert.match(erros({ skills: [{ caminho: "skills/nao/SKILL.md", papeis: ["desenvolvedor"] }] }), /não existe/);
  assert.match(erros({ agentes: [{ nome: "sa-job", descricao: "x", prompt: "/etc/x.md" }] }), /nome inválido[\s\S]*fora da pasta/);
  assert.match(erros({ agentes: [] }), /agente batch-job não está em agentes/);
  assert.match(erros({ customiza: { toolkit: "batch-alfa" } }), /customiza/);
  assert.equal(erros({ customiza: { toolkit: "spring-alfa", versao: "1.0.0" } }), "");
  assert.match(erros({ autor: undefined }), /falta o campo autor/);
  assert.match(erros({ autor: { nome: "Ana" } }), /autor: precisa de nome e area/);
});

test("customização: cópia modificada da base, listada abaixo dela e recusada no projeto que já usa a base", async () => {
  const indice = escrever(path.join(raiz, "indice-c"), {
    "index.json": { nome: "idx", toolkits: [
      { nome: "batch-alfa-casa", versao: "1.1.0", fonte: { caminho: "./casa" } }, { nome: "batch-alfa", versao: "1.0.0", fonte: { caminho: "./base" } }] },
  });
  toolkit(path.join(indice, "base"));
  toolkit(path.join(indice, "casa"), { nome: "batch-alfa-casa", versao: "1.1.0",
    customiza: { toolkit: "batch-alfa", versao: "1.0.0", mudancas: ["customizações feitas pela casa", "writers da casa"] } });
  // sem nada baixado, a relação vem da entrada do índice
  const ix = path.join(indice, "index.json"), m = JSON.parse(fs.readFileSync(ix, "utf8"));
  m.toolkits[0].customiza = { toolkit: "batch-alfa", versao: "1.0.0" };
  m.toolkits[0].autor = { nome: "Bia Exemplo", area: "Casa" };
  fs.writeFileSync(ix, JSON.stringify(m));
  assert.deepEqual(s.listarToolkits({ indice }).map((l) => [l[0], l[1], l[5]]), [["batch-alfa", "—", ""], ["↳ batch-alfa-casa", "Bia Exemplo (Casa)", "customiza batch-alfa 1.0.0"]]);
  await emProjeto(async () => {
    await s.instalarToolkits(["batch-alfa"], { indice, sim: true });
    await assert.rejects(s.instalarToolkits(["batch-alfa-casa"], { indice, sim: true }), /batch-alfa-casa e batch-alfa são versões do mesmo toolkit/);
  });
  await s.baixarToolkit("batch-alfa-casa", { indice });  // em outro projeto pode ser a casa: na máquina convivem
  const linhas = s.listarToolkits({ indice });
  assert.deepEqual(linhas.map((l) => l[0]), ["batch-alfa", "↳ batch-alfa-casa"]);
  assert.match(linhas[1][5], /^customiza batch-alfa 1\.0\.0: customizações feitas pela casa; …/);
  assert.equal(linhas[0][1], "Ana Exemplo (Equipe Alfa)");  // do toolkit baixado
});

test("toolkit no projeto: instalar baixa na pasta da versão, liga e regenera; atualizar troca a versão sem desfazer escolhas; remover limpa", async () => {
  const dois = { skills: [{ caminho: "skills/batch/SKILL.md", papeis: ["desenvolvedor", "revisor"], passo: { passo: "sa-desenvolver.codificar.tarefa", para: "job", agente: "batch-job" } }] };
  const fonte = toolkit(path.join(raiz, "fonte/batch-alfa"), dois);
  const indice = escrever(path.join(raiz, "indice"), { "index.json": { nome: "idx", toolkits: [{ nome: "batch-alfa", versao: "1.0.0", fonte: { caminho: "../fonte/batch-alfa".replace("../fonte/", "./") } }] } });
  fs.cpSync(fonte, path.join(indice, "batch-alfa"), { recursive: true });
  const v1 = path.join(home, ".sabia/toolkits/batch-alfa/1.0.0"), v2 = path.join(home, ".sabia/toolkits/batch-alfa/1.1.0");
  const id = (v, c = "skills/batch/SKILL.md") => `skill://~/.sabia/toolkits/batch-alfa/${v}/${c}`;
  await emProjeto(async (proj) => {
    await s.instalarToolkits(["batch-alfa"], { indice, sim: true });
    assert.ok(fs.existsSync(path.join(v1, "toolkit.json")));
    assert.equal(JSON.parse(fs.readFileSync(path.join(v1, ".origem.json"), "utf8")).indice, indice);
    let c = cfgDe(proj);
    assert.equal(c.toolkits["batch-alfa"].pasta, "~/.sabia/toolkits/batch-alfa/1.0.0");
    assert.deepEqual(c.passos, [{ toolkit: "batch-alfa", skill: "skills/batch/SKILL.md", agente: true }]);
    assert.deepEqual(c.agentes["sa-desenvolvedor"].skills, [id("1.0.0")]);
    assert.match(chamadas.at(-1), /"gravar":true/);
    assert.deepEqual(s.listarToolkits({ indice }).map((l) => [l[0], l[2], l[3], l[4]]), [["batch-alfa", "1.0.0", "1.0.0", "1.0.0"]]);
    assert.deepEqual(s.lerInventario().toolkits["batch-alfa"].versoes["1.0.0"].projetos, [fs.realpathSync(proj)]);

    saida = [];
    await s.instalarToolkits(["batch-alfa"], { indice, sim: true });
    assert.ok(saida.includes("batch-alfa 1.0.0 já está neste projeto") && saida.includes("Nada a instalar."));
    saida = [];
    await s.atualizarToolkits([], { indice });
    assert.ok(saida.includes("batch-alfa já na última versão (1.0.0)") && !saida.some((x) => x.startsWith("?")));
    await assert.rejects(s.atualizarToolkits(["outro"], { indice }), /outro não está neste projeto — use: sabia toolkits instalar outro/);

    // a pessoa tirou a skill do revisor; a versão nova traz outra skill e não pode devolver a que saiu
    c.agentes["sa-revisor"].skills = [];
    fs.writeFileSync(path.join(proj, ".sabia/config/agentes.json"), JSON.stringify(c));
    toolkit(path.join(indice, "batch-alfa"), { versao: "1.1.0", skills: [...dois.skills, { caminho: "skills/nova/SKILL.md", papeis: ["verificador"] }] });
    escrever(path.join(indice, "batch-alfa"), { "skills/nova/SKILL.md": "nova" });
    fs.writeFileSync(path.join(indice, "index.json"), JSON.stringify({ nome: "idx", toolkits: [{ nome: "batch-alfa", versao: "1.1.0", fonte: { caminho: "./batch-alfa" } }] }));
    await s.atualizarToolkits([], { indice });  // uma tabela e um confirm (padrão S)
    assert.match(saida.find((x) => x.startsWith("[Atualizar]")), /batch-alfa {2}1\.0\.0 → 1\.1\.0/);
    c = cfgDe(proj);
    assert.equal(c.toolkits["batch-alfa"].versao, "1.1.0");
    assert.deepEqual(c.agentes["sa-desenvolvedor"].skills, [id("1.1.0")]);
    assert.deepEqual(c.agentes["sa-revisor"].skills, []);
    assert.deepEqual(c.agentes["sa-verificador"].skills, [id("1.1.0", "skills/nova/SKILL.md")]);
    assert.ok(fs.existsSync(path.join(v2, "toolkit.json")) && !fs.existsSync(v1));  // ninguém mais usa a 1.0.0

    await assert.rejects(s.removerToolkits(["batch-alfa"], { indice }), s.Cancelado);  // destrutivo: padrão N
    assert.ok(fs.existsSync(v2));
    respostas = [true];
    await s.removerToolkits(["batch-alfa"], {});
    c = cfgDe(proj);
    assert.deepEqual([c.toolkits, c.passos, c.agentes["sa-desenvolvedor"].skills], [{}, [], []]);
    assert.ok(!fs.existsSync(path.join(home, ".sabia/toolkits/batch-alfa")));
    assert.deepEqual(s.lerInventario().toolkits, {});
  });
});

test("toolkit em dois projetos: cada um na sua versão, e a pasta só sai quando ninguém mais a usa", async () => {
  const indice = indiceDe([{ nome: "batch-alfa", versao: "1.0.0", fonte: { caminho: "./v1" } }, { nome: "batch-alfa", versao: "2.0.0", fonte: { caminho: "./v2" } }]);
  toolkit(path.join(indice, "v1"));
  toolkit(path.join(indice, "v2"), { versao: "2.0.0" });
  const pasta = (v) => path.join(home, ".sabia/toolkits/batch-alfa", v, "toolkit.json");
  await emProjeto(async (a) => {
    await s.instalarToolkits(["batch-alfa@1.0.0"], { indice, sim: true });
    assert.equal(cfgDe(a).toolkits["batch-alfa"].versao, "1.0.0");
    await emProjeto(async (b) => {
      await s.instalarToolkits(["batch-alfa"], { indice, sim: true });  // sem versão: a maior do índice
      assert.equal(cfgDe(b).toolkits["batch-alfa"].versao, "2.0.0");
      assert.ok(fs.existsSync(pasta("1.0.0")) && fs.existsSync(pasta("2.0.0")));
      assert.deepEqual(s.listarToolkits({ indice }).map((l) => [l[0], l[2], l[3]]), [["batch-alfa", "2.0.0", "1.0.0, 2.0.0"]]);  // uma linha, a mais nova
      // versão fixada que difere troca neste projeto, e a do outro fica
      await s.instalarToolkits(["batch-alfa@1.0.0"], { indice, sim: true });
      assert.equal(cfgDe(b).toolkits["batch-alfa"].versao, "1.0.0");
      assert.ok(fs.existsSync(pasta("1.0.0")) && !fs.existsSync(pasta("2.0.0")));
      await s.removerToolkits(["batch-alfa"], { sim: true });
      assert.ok(fs.existsSync(pasta("1.0.0")));  // o projeto a ainda usa
    }, {}, "projeto-b");
    await s.removerToolkits(["batch-alfa"], { sim: true });
    assert.ok(!fs.existsSync(pasta("1.0.0")));
  });
});

test("toolkit: quem clona baixa as versões do projeto; opencode tem a cópia por projeto; fora de um projeto só baixa", async () => {
  const indice = indiceDe([{ nome: "batch-alfa", versao: "1.0.0", fonte: { caminho: "./batch-alfa" } }]);
  toolkit(path.join(indice, "batch-alfa"));
  await assert.rejects(s.atualizarToolkits([], { indice }), /rode na raiz do projeto/);
  await s.instalarToolkits(["batch-alfa"], { indice, sim: true });
  assert.ok(fs.existsSync(path.join(home, ".sabia/toolkits/batch-alfa/1.0.0/toolkit.json")));
  assert.match(saida.at(-1), /na raiz do projeto: sabia toolkits instalar batch-alfa/);
  await emProjeto(async (proj) => {
    await s.instalarToolkits(["batch-alfa"], { indice, sim: true });
    const copia = path.join(proj, ".opencode/skills/batch/SKILL.md");
    assert.equal(fs.readFileSync(copia, "utf8"), "batch");
    assert.ok(!fs.existsSync(skill("batch")));  // nada global: outro projeto pode estar em outra versão
    // o clone: a máquina não tem o toolkit, e o agentes.json diz de onde ele veio
    const c = cfgDe(proj);
    fs.rmSync(path.join(home, ".sabia/toolkits"), { recursive: true });
    fs.rmSync(copia);
    const inv = s.lerInventario(); inv.toolkits = {}; s.gravarInventario(inv);
    await s.instalarToolkits([], { indice, sim: true });
    assert.ok(fs.existsSync(path.join(home, ".sabia/toolkits/batch-alfa/1.0.0/toolkit.json")) && fs.existsSync(copia));
    assert.deepEqual(cfgDe(proj).toolkits, c.toolkits);
    saida = [];
    await s.instalarToolkits([], { indice, sim: true });
    assert.ok(saida.includes("batch-alfa 1.0.0 já está nesta máquina") && saida.includes("Nada a instalar."));
    await s.removerToolkits(["batch-alfa"], { sim: true });
    assert.ok(!fs.existsSync(copia));
  }, { alvos: ["opencode"] });
  // fora de um projeto, remover avisa quem ainda usa
  await s.baixarToolkit("batch-alfa", { indice });
  await emProjeto(async () => { await s.instalarToolkits(["batch-alfa"], { indice, sim: true }); });
  saida = [];
  await s.removerToolkits(["batch-alfa@1.0.0"], { sim: true });
  assert.ok(saida.some((x) => /batch-alfa 1\.0\.0 ainda é usado por:/.test(x)));
  assert.ok(!fs.existsSync(path.join(home, ".sabia/toolkits/batch-alfa")));
});

test("toolkit já registrado no inventário sem a lista de versões continua instalável", async () => {
  const indice = indiceDe([{ nome: "batch-alfa", versao: "1.0.0", fonte: { caminho: "./batch-alfa" } }]);
  toolkit(path.join(indice, "batch-alfa"));
  const inv = s.lerInventario(); inv.toolkits["batch-alfa"] = { versao: "0.9.0", alvos: {} }; s.gravarInventario(inv);
  assert.deepEqual(await s.baixarToolkit("batch-alfa", { indice }), { nome: "batch-alfa", versao: "1.0.0" });
  assert.ok(s.lerInventario().toolkits["batch-alfa"].versoes["1.0.0"]);
});

test("projeto com a pasta sem versão, ou que a máquina não tem: instalar e atualizar refazem em vez de travar", async () => {
  const indice = indiceDe([{ nome: "batch-alfa", versao: "1.0.0", fonte: { caminho: "./batch-alfa" } }]);
  toolkit(path.join(indice, "batch-alfa"));
  const antigo = (versao) => ({ toolkits: { "batch-alfa": { pasta: "~/.sabia/toolkits/batch-alfa", versao } }, passos: [{ toolkit: "batch-alfa", skill: "skills/batch/SKILL.md", agente: true }],
    agentes: { "sa-desenvolvedor": { skills: ["skill://~/.sabia/toolkits/batch-alfa/skills/batch/SKILL.md"] } } });
  const certo = "skill://~/.sabia/toolkits/batch-alfa/1.0.0/skills/batch/SKILL.md";
  for (const [i, faz] of [["instalar", () => s.instalarToolkits(["batch-alfa"], { indice, sim: true })], ["atualizar", () => s.atualizarToolkits([], { indice, sim: true })]]) {
    await emProjeto(async (proj) => {
      await faz();
      const c = cfgDe(proj);
      assert.equal(c.toolkits["batch-alfa"].pasta, "~/.sabia/toolkits/batch-alfa/1.0.0", i);
      assert.deepEqual(c.agentes["sa-desenvolvedor"].skills, [certo], i);
      assert.deepEqual(c.passos, [{ toolkit: "batch-alfa", skill: "skills/batch/SKILL.md", agente: true }], i);
    }, antigo("0.9.0"), `projeto-${i}`);
  }
});

test("detecção do toolkit: basta um dos termos em `contem`", async () => {
  const indice = indiceDe([{ nome: "batch-alfa", versao: "1.0.0", fonte: { caminho: "./batch-alfa" } }]);
  toolkit(path.join(indice, "batch-alfa"), { deteccao: { arquivos: ["pom.xml"], contem: ["<java.version>", "spring-boot"] } });
  const aviso = "batch-alfa: a detecção do toolkit não casou com este projeto";
  await emProjeto(async (proj) => {
    escrever(proj, { "pom.xml": "<artifactId>spring-boot</artifactId>" });
    await s.instalarToolkits(["batch-alfa"], { indice, sim: true });
    assert.ok(!saida.includes(aviso));
  });
  await emProjeto(async (proj) => {
    escrever(proj, { "pom.xml": "<outra/>" });
    await s.instalarToolkits(["batch-alfa"], { indice, sim: true });
    assert.ok(saida.includes(aviso));
  }, {}, "projeto-d");
});

test("remover a última versão não apaga o que mais houver na pasta do toolkit", async () => {
  const indice = indiceDe([{ nome: "batch-alfa", versao: "1.0.0", fonte: { caminho: "./batch-alfa" } }]);
  toolkit(path.join(indice, "batch-alfa"));
  escrever(path.join(home, ".sabia/toolkits/batch-alfa"), { "outra/coisa.md": "fica" });
  await s.baixarToolkit("batch-alfa", { indice });
  await s.removerToolkits(["batch-alfa"], { sim: true });
  assert.ok(!fs.existsSync(path.join(home, ".sabia/toolkits/batch-alfa/1.0.0")));
  assert.equal(fs.readFileSync(path.join(home, ".sabia/toolkits/batch-alfa/outra/coisa.md"), "utf8"), "fica");
  assert.ok(!s.lerInventario().toolkits["batch-alfa"]);
});

test("toolkit sem acesso ao índice: usa a maior versão baixada e avisa; recusado continua recusado", async () => {
  const indice = indiceDe([{ nome: "batch-alfa", versao: "1.0.0", fonte: { caminho: "./batch-alfa" } }]);
  toolkit(path.join(indice, "batch-alfa"));
  await s.baixarToolkit("batch-alfa", { indice });
  await emProjeto(async (proj) => {
    await s.instalarToolkits(["batch-alfa"], { indice: path.join(raiz, "nao-existe"), sim: true });
    assert.ok(saida.some((x) => /sem acesso ao índice; usando a 1\.0\.0/.test(x)));
    assert.equal(cfgDe(proj).toolkits["batch-alfa"].versao, "1.0.0");
  });
});

test("o passo do toolkit pelo id: só em passo do Sabiá com gancho de desvio; o id antigo da tarefa vale como alias", () => {
  const fm = (d) => `---\n${JSON.stringify(d)}\n---\n`;
  const repo = escrever(path.join(raiz, "fw-gancho"), {
    "fluxo/sa-desenvolver/codificar/codificar.md": fm({ fluxo: "codificar", dono: "sa-desenvolvedor", passos: [{ id: "tarefa", desvio: true }, { id: "validar" }] }) + "# Codificar\n",
    "fluxo/sa-desenvolver/codificar/passos/tarefa.md": fm({ resumo: "t" }), "fluxo/sa-desenvolver/codificar/passos/validar.md": fm({ resumo: "v" }) });
  const comPasso = (passo) => ({ skills: [{ caminho: "skills/batch/SKILL.md", papeis: ["desenvolvedor"], passo: { passo, para: "job de batch", agente: "batch-job" } }] });
  assert.deepEqual(s.validarToolkit(toolkit(path.join(raiz, "ok"), comPasso("sa-desenvolver.codificar.tarefa")), "batch-alfa", repo), []);
  assert.deepEqual(s.validarToolkit(toolkit(path.join(raiz, "alias"), comPasso("sa-codificar.codificar.tarefa")), "batch-alfa", repo), []);
  assert.match(s.validarToolkit(toolkit(path.join(raiz, "a"), comPasso("sa-desenvolver.codificar.validar")), null, repo).join(), /não aceita desvio/);
  assert.match(s.validarToolkit(toolkit(path.join(raiz, "b"), comPasso("sa-desenvolver.codificar.nada")), null, repo).join(), /não existe/);
  assert.deepEqual(s.validarToolkit(toolkit(path.join(raiz, "c"), comPasso("sa-desenvolver.codificar.nada"))), []);  // sem framework: fica para a setup
  // passo sem o id (passo.papel) é recusado, com ou sem o framework
  const semId = { skills: [{ caminho: "skills/batch/SKILL.md", papeis: ["desenvolvedor"], passo: { papel: "desenvolvedor", para: "job de batch" } }] };
  for (const fw of [repo, null]) assert.match(s.validarToolkit(toolkit(path.join(raiz, `p-${!!fw}`), semId), null, fw).join(), /passo de skills\/batch\/SKILL\.md: use o id do passo \(passo\.passo\)/);
});

test("toolkit numa subpasta de um repositório git: #subpasta, @ref lida do commit e ref inexistente recusada", async () => {
  s.ctx.exec = (cmd, args, o = {}) => spawnSync(cmd, args, { encoding: "utf8", ...o });
  const mono = path.join(raiz, "mono");
  toolkit(path.join(mono, "batch-alfa"));
  const g = (...a) => assert.equal(spawnSync("git", ["-c", "user.name=t", "-c", "user.email=t@t", ...a], { cwd: mono }).status, 0);
  g("init", "-q"); g("add", "."); g("commit", "-qm", "v1"); g("tag", "v1");
  fs.writeFileSync(path.join(mono, "batch-alfa/skills/batch/SKILL.md"), "árvore suja");  // fora do commit
  const origem = () => JSON.parse(fs.readFileSync(path.join(home, ".sabia/toolkits/batch-alfa/1.0.0/.origem.json"), "utf8"));
  const lido = () => fs.readFileSync(path.join(home, ".sabia/toolkits/batch-alfa/1.0.0/skills/batch/SKILL.md"), "utf8");
  await s.baixarToolkit(`${mono}@v1#batch-alfa`, {});
  assert.equal(lido(), "batch");
  assert.equal(origem().subpasta, "batch-alfa");
  assert.match(origem().sha, /^[0-9a-f]{40}$/);
  await s.baixarToolkit(path.join(mono, "batch-alfa"), {});  // sem @ref: a árvore de trabalho, com o sha do HEAD
  assert.equal(lido(), "árvore suja");
  assert.match(origem().sha, /^[0-9a-f]{40}$/);
  await assert.rejects(s.baixarToolkit(`${path.join(mono, "batch-alfa")}@nao-existe`, {}), /nao-existe/);
  // o mesmo conteúdo de outra fonte: nada é copiado, mas a origem passa a ser a nova
  const indice = escrever(path.join(raiz, "indice"), { "index.json": { nome: "idx", toolkits: [{ nome: "batch-alfa", versao: "1.0.0", fonte: { caminho: "./batch-alfa" } }] } });
  fs.cpSync(path.join(home, ".sabia/toolkits/batch-alfa/1.0.0"), path.join(indice, "batch-alfa"), { recursive: true, filter: (f) => !f.endsWith(".origem.json") });
  await s.baixarToolkit("batch-alfa", { indice });
  assert.equal(origem().indice, indice);
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

/** main com o stderr capturado. */
async function rodar(argv) {
  const erros = [], antes = console.error;
  console.error = (x) => erros.push(String(x));
  try { return { codigo: await s.main(argv), erro: erros.join("\n") }; } finally { console.error = antes; }
}

test("instalar: a multisseleção traz as ferramentas desmarcadas, o resumo antes do confirm, e só então o disco muda", async () => {
  respostas = [["opencode"], true];
  await s.instalar({ fonte: framework("fw", "1.1.0"), semMcp: true });
  const alvos = escolhas.find((p) => p.mensagem === "Em quais ferramentas?");
  assert.deepEqual(alvos.opcoes.map((o) => [o.valor, o.marcado]), [["kiro", false], ["opencode", false]]);
  assert.equal(alvos.minimo, 1);
  assert.deepEqual(Object.keys(s.lerInventario().alvos), ["opencode"]);
  const i = saida.findIndex((x) => x.startsWith("[Resumo]"));
  assert.ok(i >= 0 && i < saida.indexOf("? Instalar?") && saida.indexOf("? Instalar?") < saida.indexOf("opencode: 3 skills"));
  assert.match(saida[i], /framework +— → 1\.1\.0\nopencode +3 skills/);
});

test("instalar: com uma ferramenta detectada ainda pergunta; Esc ou não no confirm: cancelado, nada gravado", async () => {
  s.ctx.exec = (cmd, args) => { chamadas.push([cmd, ...args].join(" ")); return { status: cmd === "kiro-cli" ? 1 : 0, stdout: "", stderr: "" }; };
  respostas = [["opencode"], false];
  assert.equal((await rodar(["instalar", "--fonte", framework("fw", "1.1.0"), "--sem-mcp"])).codigo, 0);
  const alvos = escolhas.find((p) => p.mensagem === "Em quais ferramentas?");
  assert.ok(alvos && alvos.opcoes.find((o) => o.valor === "kiro").dica.includes("não achado no PATH"));
  assert.ok(saida.includes("cancelado — nada foi alterado"));
  assert.ok(!fs.existsSync(path.join(home, ".sabia/framework")) && !fs.existsSync(skill("sa-setup")));
  s.ctx.escolher = async () => { throw new s.Cancelado(); };  // Esc na multisseleção
  s.ctx.exec = () => ({ status: 0, stdout: "", stderr: "" });
  assert.equal((await rodar(["instalar", "--fonte", path.join(raiz, "fw")])).codigo, 0);
  assert.ok(!fs.existsSync(path.join(home, ".sabia/framework")));
});

test("instalar no opencode sem o comando opencode: erro antes de gravar (os MCPs ficariam de fora)", async () => {
  const semOpencode = (cmd) => cmd === "opencode" || cmd === s.OPENCODE_APP;  // nem no PATH, nem no app
  s.ctx.exec = (cmd, args) => { chamadas.push([cmd, ...args].join(" ")); return { status: semOpencode(cmd) ? 1 : 0, stdout: "", stderr: "" }; };
  respostas = [["opencode"]];
  const r = await rodar(["instalar", "--fonte", framework("fw", "1.1.0")]);
  assert.equal(r.codigo, 1);
  assert.match(r.erro, /não achei o comando opencode.*--sem-mcp/);
  assert.ok(!fs.existsSync(path.join(home, ".sabia/framework")) && !fs.existsSync(skill("sa-setup")));
});

test("opencode desktop: sem o comando no PATH, usa o CLI que vem no app para registrar os MCPs", async () => {
  const app = s.OPENCODE_APP;
  if (!fs.existsSync(app)) return;  // só na máquina com o app
  s.ctx.exec = (cmd, args) => { chamadas.push([cmd, ...args].join(" ")); return { status: cmd === "opencode" ? 1 : 0, stdout: "", stderr: "" }; };
  assert.equal(s.comandoOpencode(), app);
  assert.ok(s.detectarAlvos().includes("opencode"));
});

test("sem terminal: sem -y, a pergunta necessária vira saída 1 com a flag; com -y, as detectadas e sem perguntas", async () => {
  s.ctx.interativo = false;
  const fw = framework("fw", "1.1.0");
  let r = await rodar(["instalar", "--fonte", fw]);
  assert.equal(r.codigo, 1);
  // a dica repete as flags da pessoa; o erro vem antes do download
  assert.equal(r.erro, `sabia: preciso escolher as ferramentas e não há terminal — use: sabia instalar --fonte ${fw} -a opencode -y`);
  assert.ok(!saida.some((x) => x.includes("baixado")));
  r = await rodar(["instalar", "--fonte", fw, "-a", "opencode", "--sem-mcp"]);
  assert.equal(r.codigo, 1);
  assert.equal(r.erro, `sabia: preciso confirmar e não há terminal — use: sabia instalar --fonte ${fw} -a opencode --sem-mcp -y`);
  assert.ok(!fs.existsSync(path.join(home, ".sabia/framework")));
  assert.equal((await rodar(["instalar", "--fonte", fw, "-y", "--sem-mcp"])).codigo, 0);
  assert.deepEqual(Object.keys(s.lerInventario().alvos).sort(), ["kiro", "opencode"]);
  assert.ok(!escolhas.length && !saida.some((x) => x.startsWith("?")));
  // escolher o toolkit sem terminal: erro com o comando; nada instalado: só o aviso
  r = await rodar(["toolkits", "instalar"]);
  assert.equal(r.codigo, 1);
  assert.match(r.erro, /diga o toolkit — use: sabia toolkits instalar <nome> -y/);
  assert.equal((await rodar(["toolkits", "remover"])).codigo, 0);
  assert.ok(saida.includes("nenhum toolkit na máquina"));
});

test("instalar: a skill alterada à mão aparece com ✎ no resumo e fica; --forcar sobrescreve", async () => {
  const fw = framework("fw", "1.1.0");
  await s.instalar({ fonte: fw, alvo: "opencode", semMcp: true });
  fs.writeFileSync(skill("sa-setup"), "mexi");
  saida = [];
  await s.instalar({ fonte: fw, alvo: "opencode", semMcp: true });
  assert.match(saida.find((x) => x.startsWith("[Resumo]")), /\n +✎ ~\/\.config\/opencode\/skills\/sa-setup alterada à mão — mantida \(--forcar sobrescreve\)/);
  assert.ok(saida.includes("opencode: 2 skills"));
  assert.equal(fs.readFileSync(skill("sa-setup"), "utf8"), "mexi");
  await s.instalar({ fonte: fw, alvo: "opencode", semMcp: true, forcar: true });
  assert.equal(fs.readFileSync(skill("sa-setup"), "utf8"), "sa-setup 1.1.0");
});

test("toolkits: sem subcomando lista; apelidos ls, i, rm e toolkit; idempotente; --json; o baixar saiu", async () => {
  const indice = escrever(path.join(raiz, "indice"), {
    "index.json": { nome: "idx", toolkits: [{ nome: "batch-alfa", versao: "1.0.0", fonte: { caminho: "./batch-alfa" }, descricao: "jobs" }] },
  });
  toolkit(path.join(indice, "batch-alfa"));
  const baixado = path.join(home, ".sabia/toolkits/batch-alfa/1.0.0/toolkit.json");
  assert.equal((await rodar(["toolkits", "--indice", indice])).codigo, 0);
  assert.match(logs.at(-1), /^TOOLKIT +AUTOR[\s\S]*\nbatch-alfa +— +1\.0\.0 +— +— +jobs$/);
  assert.equal((await rodar(["toolkit", "ls", "--indice", indice])).codigo, 0);
  assert.equal(logs.at(-1), logs.at(-2));
  // sem nome, fora de projeto: a multisseleção do índice sem os instalados
  respostas = [["batch-alfa"], true];
  assert.equal((await rodar(["toolkits", "i", "--indice", indice])).codigo, 0);
  assert.deepEqual(escolhas[0].opcoes.map((o) => [o.valor, o.dica]), [["batch-alfa", "1.0.0  jobs"]]);
  assert.ok(fs.existsSync(baixado));
  saida = [];
  assert.equal((await rodar(["toolkits", "instalar", "batch-alfa", "-y", "--indice", indice])).codigo, 0);
  assert.ok(saida.includes("batch-alfa 1.0.0 já está na máquina") && !saida.some((x) => x.startsWith("?")));
  assert.equal((await rodar(["toolkits", "listar", "--json", "--indice", indice])).codigo, 0);
  assert.deepEqual(JSON.parse(logs.at(-1)), [{ nome: "batch-alfa", autor: "Ana Exemplo (Equipe Alfa)", indice: "1.0.0", instalado: "1.0.0",
    projeto: null, descricao: "jobs", customiza: null }]);
  // remover sem nome: a multisseleção dos instalados e o confirm (padrão N)
  respostas = [["batch-alfa"]];
  assert.equal((await rodar(["toolkits", "rm"])).codigo, 0);
  assert.ok(saida.includes("cancelado — nada foi alterado") && fs.existsSync(baixado));
  assert.equal((await rodar(["toolkits", "rm", "batch-alfa", "-y"])).codigo, 0);
  assert.ok(!fs.existsSync(baixado));
  saida = [];
  assert.equal((await rodar(["toolkits", "remover", "batch-alfa", "-y"])).codigo, 0);
  assert.ok(saida.includes("batch-alfa não está na máquina"));
  const r = await rodar(["toolkits", "baixar", "batch-alfa"]);
  assert.equal(r.codigo, 1);
  assert.equal(r.erro, 'sabia: comando desconhecido "toolkits baixar" — veja sabia -h');
});

test("toolkits no projeto: instalar liga pelo manifesto, escreve o sabia.md e volta atrás se o gerador recusa", async () => {
  const indice = indiceDe([{ nome: "alfa", versao: "1.2.0", fonte: { caminho: "./alfa" } }]);
  toolkit(path.join(indice, "alfa"), { nome: "alfa", versao: "1.2.0", skills: [
    { caminho: "skills/job/SKILL.md", papeis: ["desenvolvedor", "revisor"], passo: { passo: "sa-desenvolver.codificar.tarefa", para: "criar job", agente: "alfa-job" } },
    { caminho: "skills/teste/SKILL.md", papeis: ["verificador"] }], agentes: [{ nome: "alfa-job", descricao: "codifica um job", prompt: "agentes/job.md", skills: ["skills/job/SKILL.md"] }] });
  escrever(path.join(indice, "alfa"), { "skills/job/SKILL.md": "job", "skills/teste/SKILL.md": "teste" });
  await emProjeto(async (proj) => {
    escrever(proj, { ".sabia/sabia.md": "## Desvios de toolkit\n\nIntro.\n\nNenhum.\n\n## Tipos com skill de toolkit\n\nIntro.\n\nNenhum.\n\n## Regras aprendidas\n\n- r\n" });
    s.ctx.gerarAgentes = () => ({ avisos: ["olhe isto"], tabelaTipos: ["| Tipo |", "|---|", "| `REG` |"] });
    await s.instalarToolkits(["alfa"], { indice, sim: true });
    const c = cfgDe(proj);
    assert.equal(c.toolkits.alfa.pasta, "~/.sabia/toolkits/alfa/1.2.0");
    assert.equal(c.toolkits.alfa.fonte.indice, indice);
    assert.deepEqual(c.passos, [{ toolkit: "alfa", skill: "skills/job/SKILL.md", agente: true }]);
    assert.deepEqual(c.agentes["sa-verificador"].skills, ["skill://~/.sabia/toolkits/alfa/1.2.0/skills/teste/SKILL.md"]);
    assert.deepEqual(c.agentes["sa-revisor"].skills, ["skill://~/.sabia/toolkits/alfa/1.2.0/skills/job/SKILL.md"]);
    const md = fs.readFileSync(path.join(proj, ".sabia/sabia.md"), "utf8");
    assert.match(md, /Intro\.\n\n\| Passo \| Toolkit[^]*`alfa` 1\.2\.0 \| criar job \| `job` \| `alfa-job` \|\n\n## Tipos/);
    assert.match(md, /\| `REG` \|\n\n## Regras aprendidas\n\n- r/);
    assert.ok(saida.includes("olhe isto"));
    const antes = fs.readFileSync(path.join(proj, ".sabia/config/agentes.json"), "utf8");
    s.ctx.gerarAgentes = () => { throw new Error("recusado"); };
    await assert.rejects(s.removerToolkits(["alfa"], { sim: true }), /restaurado:\nrecusado/);
    assert.equal(fs.readFileSync(path.join(proj, ".sabia/config/agentes.json"), "utf8"), antes);
    await assert.rejects(s.instalarToolkits(["beta"], { indice, sim: true }), /beta não está nos índices/);
  });
});

test("status: JSON estável com sprint, sem responsável, não iniciados, em andamento e MRs pelo GitLab", async () => {
  const proj = escrever(path.join(raiz, "st"), {
    ".sabia/planejamento/backlog.md": "# Backlog\n\n| id | título | tipo | status | prioridade | tamanho | responsável | pai | relator | ib | obs | aceita_em | iniciada_em | concluida_em |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n"
      + "| FT-001 | Um | fatia | elegivel |  | P |  |  | a |  |  |  |  |  |\n| FT-002 | Dois | fatia | em-andamento |  | M | ana |  | a |  |  |  | 2026-11-01 |  |\n| FT-003 | Três | fatia | concluida |  | M | ana |  | a |  |  |  |  | 2026-11-02 |\n| FT-004 | Quatro | fatia | em-andamento |  | M | bia |  | a |  |  |  |  |  |\n",
    ".sabia/planejamento/sprints/2026/sprint-02.md": "# 2026/Sprint 02 · 2026-11-01 → 2026-11-13\n\n**Meta:** Entregar\n\n## Itens\n\n| Item | Trabalho | Responsável | Tarefas |\n|---|---|---|---|\n| FT-001 | desenvolvimento | — | — |\n| FT-002 | desenvolvimento | ana | — |\n| FT-003 | desenvolvimento | — | — |\n| FT-004 | desenvolvimento | bia | — |\n",
    ".sabia/planejamento/sprints/2026/sprint-01.md": "# 2026/Sprint 01 · 2026-10-01 → 2026-10-13\n",
    // o status.md das branches: o da FT-002 tem Fase — (fica em em-andamento); o da FT-004, pr-aberto (em-revisao, GitLab ou não)
    ".sabia/local/wt/ft-002/.kiro/specs/ft-002-duas/status.md": "# Status\n\n| Campo | Valor |\n|---|---|\n| Fase | — |\n",
    ".sabia/local/wt/ft-004/.kiro/specs/ft-004-quatro/status.md": "# Status\n\n| Campo | Valor |\n|---|---|\n| Fase | pr-aberto |\n| MR | !99 https://gl.exemplo/time/app/-/merge_requests/99 |\n",
  });
  const agora = new Date("2026-11-09T12:00:00Z");
  delete process.env.GITLAB_API_URL;
  let r = statusDoProjeto({ projeto: proj, exec: s.ctx.exec, agora });
  assert.equal(r.versao, 3);
  assert.equal(r.projeto, "st");
  assert.match(r.sabia, /^\d+\.\d+\.\d+/);  // a versão do Sabiá que gerou
  assert.deepEqual(r.sprint, { chave: "2026/Sprint 02", inicio: "2026-11-01", fim: "2026-11-13", meta: "Entregar", reserva: null, aberta: true });
  assert.deepEqual(r.por_status, { elegivel: 1, "em-andamento": 2, concluida: 1 });
  assert.deepEqual(r.sem_responsavel, [{ id: "FT-001", titulo: "Um", trabalho: "desenvolvimento", status: "elegivel" }]);
  assert.deepEqual(r.nao_iniciados, [{ id: "FT-001", titulo: "Um", status: "elegivel" }]);
  assert.deepEqual(r.em_andamento, [
    { id: "FT-002", titulo: "Dois", responsavel: "ana", iniciada_em: "2026-11-01", idade_dias: 8 },
    { id: "FT-004", titulo: "Quatro", responsavel: "bia", iniciada_em: null, idade_dias: null }]);
  assert.deepEqual(r.mrs_aguardando, { disponivel: false, motivo: "defina GITLAB_API_URL e GITLAB_API_TOKEN", itens: [] });
  // o quadro: as colunas padrão do framework (os status do backlog e, no lugar do em-andamento, as fases) e um card
  // por item do backlog, na coluna dele; a pr-aberto da FT-004 vem do status.md (o GitLab não está disponível)
  assert.deepEqual(r.quadro.config, { arquivo: ".sabia/config/kanban.json", do_projeto: false, erro: null });
  assert.equal(r.quadro.grupo, "Em andamento");
  assert.deepEqual(r.quadro.colunas.map((c) => c.id), ["nova", "a-moldar", "em-especificacao", "fatiado", "aceita", "elegivel",
    "iniciada", "implementando", "revisando", "verificando", "pr-aberto", "retrabalho", "adiada", "concluida", "cancelada"]);
  assert.deepEqual(r.quadro.colunas.filter((c) => c.grupo).map((c) => c.nome), ["Iniciada", "Em desenvolvimento", "Revisão do agente", "Verificação do agente", "Aguardando aprovação do MR", "Retrabalho"]);
  assert.equal(r.quadro.itens.length, 4);
  const c2 = r.quadro.itens.find((c) => c.id === "FT-002");
  assert.equal(c2.status, "em-andamento");
  assert.equal(c2.coluna, "iniciada");  // Fase — no status.md
  assert.equal(c2.responsavel, "ana");
  assert.equal(c2.fase, null);
  assert.equal(c2.na_sprint, true);
  assert.deepEqual(c2.sprint, [{ trabalho: "desenvolvimento", responsavel: "ana", tarefas: null }]);
  const c4 = r.quadro.itens.find((c) => c.id === "FT-004");
  assert.equal(c4.coluna, "pr-aberto");  // Fase pr-aberto no status.md
  assert.deepEqual(c4.mr, { iid: 99, url: "https://gl.exemplo/time/app/-/merge_requests/99" });
  assert.deepEqual(r.quadro.itens.find((c) => c.id === "FT-001").avisos, [{ tipo: "sem-responsavel", nivel: "atencao", mensagem: "sem responsável na sprint (desenvolvimento)" }]);
  assert.equal(r.quadro.itens.find((c) => c.id === "FT-003").lead_time_dias, null);
  assert.deepEqual(r.quadro.wip, []);
  assert.deepEqual(r.quadro.alertas, []);
  // sprint vencida: o estado continua, sem as listas da sprint
  r = statusDoProjeto({ projeto: proj, exec: s.ctx.exec, agora: new Date("2026-12-01T00:00:00Z") });
  assert.equal(r.sprint.aberta, false);
  assert.deepEqual(r.sem_responsavel, []);
  assert.deepEqual(r.quadro.alertas, [{ tipo: "fim-do-ciclo", nivel: "atencao", mensagem: "sprint encerrada em 2026-11-13: 3 itens em aberto para a virada" }]);
  // o GitLab: o token vai pela entrada do curl, nunca nos argumentos
  process.env.GITLAB_API_URL = "https://gl.exemplo/"; process.env.GITLAB_API_TOKEN = "segredo";
  try {
    const vistos = [];
    const exec = (cmd, args, o = {}) => { vistos.push({ cmd, args, o });
      return cmd === "git" ? { status: 0, stdout: "git@gl.exemplo:time/app.git\n" } : { status: 0, stdout: JSON.stringify([{ iid: 7, title: "T", author: { username: "ana" }, source_branch: "ft-002", web_url: "u", created_at: "c", updated_at: "2026-11-09T09:00:00Z", draft: false }]) }; };
    r = statusDoProjeto({ projeto: proj, exec, agora });
    assert.deepEqual(r.mrs_aguardando, { disponivel: true, motivo: null, itens: [{ iid: 7, titulo: "T", autor: "ana", branch: "ft-002", url: "u", criado_em: "c", atualizado_em: "2026-11-09T09:00:00Z", rascunho: false }] });
    assert.ok(vistos[1].args.at(-1).startsWith("https://gl.exemplo/api/v4/projects/time%2Fapp/merge_requests"));
    assert.ok(!vistos[1].args.join(" ").includes("segredo") && vistos[1].o.input.includes("segredo"));
    // FT-002 (Fase —): o MR aberto da branch a leva para pr-aberto; na FT-004 o status.md manda
    assert.equal(r.quadro.itens.find((c) => c.id === "FT-002").coluna, "pr-aberto");
    assert.deepEqual(r.quadro.itens.find((c) => c.id === "FT-002").mr, { iid: 7, url: "u" });
    assert.equal(r.quadro.itens.find((c) => c.id === "FT-004").coluna, "pr-aberto");
    assert.deepEqual(r.quadro.itens.find((c) => c.id === "FT-002").avisos, []);
    // MR parado (atualizado há 2 dias) → o aviso do marco de um dia
    const execParado = (cmd, args, o = {}) => (cmd === "git" ? { status: 0, stdout: "git@gl.exemplo:time/app.git\n" }
      : { status: 0, stdout: JSON.stringify([{ iid: 7, title: "T", author: { username: "ana" }, source_branch: "ft-002", web_url: "u", created_at: "c", updated_at: "2026-11-07T09:00:00Z", draft: false }]) });
    r = statusDoProjeto({ projeto: proj, exec: execParado, agora });
    assert.deepEqual(r.quadro.itens.find((c) => c.id === "FT-002").avisos, [{ tipo: "mr-parado", nivel: "atencao", mensagem: "MR !7 parado: sem atualização há 2 dias" }]);
    r = statusDoProjeto({ projeto: proj, exec: (c) => (c === "git" ? { status: 0, stdout: "https://gl.exemplo/time/app.git" } : { status: 22, stderr: "401" }), agora });
    assert.deepEqual(r.mrs_aguardando, { disponivel: false, motivo: "GitLab: 401", itens: [] });
  } finally { delete process.env.GITLAB_API_URL; delete process.env.GITLAB_API_TOKEN; }
  assert.throws(() => statusDoProjeto({ projeto: raiz, exec: s.ctx.exec }), /backlog\.md não existe/);
});

test("status: quadro lê acordos (WIP/SLE), o status.md da branch, os avisos dos acordos e o kanban.json do projeto", async () => {
  const proj = escrever(path.join(raiz, "st-q"), {
    ".sabia/planejamento/backlog.md": "# Backlog\n\n| id | título | tipo | status | prioridade | tamanho | responsável | pai | relator | ib | obs | aceita_em | iniciada_em | concluida_em |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n"
      + "| FT-001 | Um | fatia | em-andamento |  | M | ana |  | a |  |  |  | 2026-10-20 |  |\n"
      + "| AT-001 | Contas | sustentação | em-andamento |  |  |  |  | a |  |  |  |  |  |\n"
      + "| FT-002 | Dois | bug | em-andamento | crítica | P | bia |  | a |  |  |  | 2026-11-08 |  |\n"
      + "| FT-003 | Três | fatia | adiada até 2026-11-01 |  | P |  |  | a |  |  |  |  |  |\n"
      + "| FT-004 | Quatro | fatia | nova |  |  |  |  | a |  | falta: qual tela · para ana |  |  |  |\n"
      + "| EP-01 | Épico | épico | concluido |  |  |  |  | a |  |  |  | 2026-10-01 | 2026-10-11 |\n",
    ".sabia/planejamento/acordos.md": "# Acordos\n\n| Item | Acordo |\n|---|---|\n| Timebox | 2 semanas |\n| WIP | em-andamento: 1 · em-revisao: 2 |\n| SLE | 85% em até 5 dias |\n",
    ".sabia/planejamento/sprints/2026/sprint-01.md": "# 2026/Sprint 01 · 2026-11-02 → 2026-11-13\n\n**Meta:** Entregar\n\n**Reserva de capacidade:** 0 itens (0%)\n\n## Itens\n\n| Item | Trabalho | Responsável | Tarefas |\n|---|---|---|---|\n| FT-001 | desenvolvimento | ana | — |\n| AT-001 | atendimento | — | — |\n",
    // a worktree do item, com o status.md da spec: a Fase dá a coluna e o Em aberto que bloqueia vira aviso
    ".sabia/local/wt/ft-001/.kiro/specs/ft-001-um/status.md": "# Status\n\n| Campo | Valor |\n|---|---|\n| Fase | retrabalho |\n| MR | !12 https://gl.exemplo/time/app/-/merge_requests/12 |\n| Trilha | completo |\n| Autonomia | IA supervisionada |\n\n## Em aberto\n\n| Pergunta | Para quem | Bloqueia |\n|---|---|---|\n| Qual o limite? | P.O. | MR |\n| E a cor? | P.O. | nada |\n",
    ".sabia/local/loop-ft-002.md": "# Loop\n\nDevolvido: teto de tentativas\n",
  });
  delete process.env.GITLAB_API_URL;
  const agora = new Date("2026-11-09T12:00:00Z");
  const r = statusDoProjeto({ projeto: proj, exec: s.ctx.exec, agora });
  // o WIP conta só fatia e bug, pelas colunas de cada status: a FT-002 em andamento (2 de 1) e a FT-001 com o MR em revisão
  assert.deepEqual(r.quadro.wip, [
    { status: "em-andamento", nome: "Em andamento", colunas: ["iniciada", "implementando", "revisando", "verificando"], atual: 1, limite: 1 },
    { status: "em-revisao", nome: "MR em revisão", colunas: ["pr-aberto", "retrabalho"], atual: 1, limite: 2 }]);
  assert.deepEqual(r.quadro.sle, { percentual: 85, dias: 5 });
  assert.equal(r.sprint.reserva, 0);
  // os alertas do quadro: a reserva de capacidade (1 linha de atendimento contra 0)
  assert.deepEqual(r.quadro.alertas, [{ tipo: "reserva", nivel: "atencao", mensagem: "reserva de capacidade estourada: 1 de 0 itens de atendimento" }]);
  const de = (id) => r.quadro.itens.find((c) => c.id === id), tipos = (id) => de(id).avisos.map((a) => `${a.nivel}:${a.tipo}`);
  const c1 = de("FT-001");
  assert.equal(c1.coluna, "retrabalho");
  assert.equal(c1.fase, "retrabalho");
  assert.equal(c1.trilha, "completo");
  assert.equal(c1.autonomia, "IA supervisionada");
  assert.deepEqual(c1.mr, { iid: 12, url: "https://gl.exemplo/time/app/-/merge_requests/12" });
  assert.deepEqual(c1.avisos, [
    { tipo: "sle", nivel: "critico", mensagem: "idade 20 dias, acima do SLE de 5 dias" },
    { tipo: "bloqueio", nivel: "critico", mensagem: "em aberto bloqueia MR: Qual o limite? (para P.O.)" },
    { tipo: "retrabalho", nivel: "atencao", mensagem: "retrabalho: o dono retoma no mesmo MR" }]);
  // urgente (prioridade crítica), devolvido pelo autopilot e em andamento fora da sprint
  assert.deepEqual(tipos("FT-002"), ["critico:urgente", "critico:devolvido", "atencao:fora-da-sprint"]);
  assert.equal(de("FT-002").na_sprint, false);
  assert.deepEqual(tipos("FT-003"), ["atencao:adiamento-vencido"]);
  assert.equal(de("FT-003").coluna, "adiada");
  assert.deepEqual(de("FT-004").avisos, [{ tipo: "falta-informacao", nivel: "atencao", mensagem: "falta: qual tela" }]);
  const c2 = de("AT-001");
  assert.equal(c2.tipo, "sustentação");
  assert.equal(c2.coluna, "iniciada");
  assert.equal(c2.idade_dias, null);  // sem iniciada_em
  assert.deepEqual(tipos("AT-001"), ["atencao:sem-responsavel"]);
  // o épico concluido cai na coluna concluida, com o lead time
  assert.equal(de("EP-01").coluna, "concluida");
  assert.equal(de("EP-01").lead_time_dias, 10);
  // o kanban.json do projeto: ordem, nome e oculta; id desconhecido sai, a coluna que falta entra no fim e as do
  // em andamento ficam juntas, na ordem em que o projeto as pôs
  escrever(proj, { ".sabia/config/kanban.json": JSON.stringify({ grupo: "Fazendo", colunas: [
    { id: "elegivel", nome: "Pronta" }, { id: "retrabalho" }, { id: "nova", oculta: true }, { id: "inventada", nome: "X" }, { id: "implementando", nome: "Codando" }] }) });
  const q = statusDoProjeto({ projeto: proj, exec: s.ctx.exec, agora }).quadro;
  assert.deepEqual(q.config, { arquivo: ".sabia/config/kanban.json", do_projeto: true, erro: null });
  assert.equal(q.grupo, "Fazendo");
  assert.deepEqual(q.colunas.map((c) => c.id), ["elegivel", "retrabalho", "implementando", "iniciada", "revisando", "verificando", "pr-aberto", "nova",
    "a-moldar", "em-especificacao", "fatiado", "aceita", "adiada", "concluida", "cancelada"]);
  assert.deepEqual(q.colunas.slice(0, 3).map((c) => c.nome), ["Pronta", "Retrabalho", "Codando"]);
  assert.equal(q.colunas.find((c) => c.id === "nova").oculta, true);
  // JSON inválido: o quadro usa o padrão e avisa
  escrever(proj, { ".sabia/config/kanban.json": "{ colunas: " });
  const ruim = statusDoProjeto({ projeto: proj, exec: s.ctx.exec, agora }).quadro;
  assert.equal(ruim.colunas[0].id, "nova");
  assert.equal(ruim.alertas[0].tipo, "config");
  // sem acordos.md: WIP vazio e sem SLE
  fs.rmSync(path.join(proj, ".sabia/planejamento/acordos.md"));
  const s2 = statusDoProjeto({ projeto: proj, exec: s.ctx.exec, agora });
  assert.deepEqual(s2.quadro.wip, []);
  assert.equal(s2.quadro.sle, null);
  assert.ok(!s2.quadro.itens.find((c) => c.id === "FT-001").avisos.some((a) => a.tipo === "sle"));
});

test("status: a spec na branch base, sem branch do item", async () => {
  // a spec pode viver na branch base (o projeto a grava nela até o merge), sem branch do item
  const proj = escrever(path.join(raiz, "st-fase"), {
    ".sabia/planejamento/backlog.md": "# Backlog\n\n| id | título | tipo | status | prioridade | tamanho | responsável | pai | relator | ib | obs | aceita_em | iniciada_em | concluida_em |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n"
      + "| FT-004 | Quatro | fatia | em-andamento |  | M | bia |  | a |  |  |  |  |  |\n",
    ".sabia/planejamento/sprints/2026/sprint-01.md": "# 2026/Sprint 01 · 2026-11-02 → 2026-11-13\n\n**Meta:** Entregar\n\n## Itens\n\n| Item | Trabalho | Responsável | Tarefas |\n|---|---|---|---|\n| FT-004 | desenvolvimento | bia | — |\n",
  });
  const git = { "origin/HEAD": { status: 0, stdout: "origin/main\n" }, HEAD: { status: 0, stdout: "abc\n" } };
  const exec = (cmd, args = []) => {
    if (cmd !== "git") return { status: 1 };
    // ["-C", raiz, rev-parse|ls-tree|show, ...]: a branch do item não existe; a spec só está na base
    if (args[2] === "rev-parse") return git[args[5]] ?? { status: 1 };
    if (args[2] === "ls-tree") return /ft-004/i.test(args[5] ?? "") ? { status: 1 } : { status: 0, stdout: ".kiro/specs/ft-004-quatro/status.md\n" };
    if (args[2] === "show") return { status: 0, stdout: "# Status\n\n| Campo | Valor |\n|---|---|\n| Fase | pr-aberto |\n| MR | !215 https://gl.exemplo/app/-/merge_requests/215 |\n" };
    return { status: 1 };
  };
  delete process.env.GITLAB_API_URL;
  const r = statusDoProjeto({ projeto: proj, exec, agora: new Date("2026-11-09T12:00:00Z") });
  const c = r.quadro.itens.find((x) => x.id === "FT-004");
  assert.equal(c.fase, "pr-aberto");
  assert.equal(c.coluna, "pr-aberto");
  assert.deepEqual(c.mr, { iid: 215, url: "https://gl.exemplo/app/-/merge_requests/215" });
});

test("kanban: a página leva o tema, a versão e o JSON da sabia status; o servidor lê o projeto a cada carga e fecha", async () => {
  const proj = escrever(path.join(raiz, "st-k"), {
    ".sabia/planejamento/backlog.md": "# Backlog\n\n| id | título | tipo | status | prioridade | tamanho | responsável | pai | relator | ib | obs | aceita_em | iniciada_em | concluida_em |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n"
      + "| FT-001 | Um | fatia | em-andamento |  | M | ana |  | a |  |  |  | 2026-11-08 |  |\n"
      + "| FT-002 | Dois | fatia | elegivel |  | M |  |  | a |  |  |  |  |  |\n"
      + "| FT-004 | Quatro | fatia | em-andamento |  | M | bia |  | a |  |  |  |  |  |\n"
      + "| EP-01 | Epic | épico | em-especificacao |  |  | bia |  | a |  |  |  |  |  |\n"
      + "| AT-001 | Contas | sustentação | em-andamento |  |  |  |  | a |  |  |  |  |  |\n",
    ".sabia/planejamento/acordos.md": "# Acordos\n\n| Item | Acordo |\n|---|---|\n| WIP | em-andamento: 1 · em-revisao: 2 |\n| SLE | 85% em até 5 dias |\n",
    ".sabia/planejamento/sprints/2026/sprint-02.md": "# 2026/Sprint 02 · 2026-11-09 → 2026-11-20\n\n**Meta:** Entregar\n\n## Itens\n\n| Item | Trabalho | Responsável | Tarefas |\n|---|---|---|---|\n| FT-001 | desenvolvimento | ana | — |\n| FT-002 | desenvolvimento | — | — |\n| FT-004 | desenvolvimento | bia | — |\n| EP-01 | especificação | bia | — |\n| AT-001 | atendimento | — | — |\n",
    // a situação do FT-001 vem do status.md da worktree (Fase implementando → Em desenvolvimento, ainda que haja MR aberto);
    // a FT-004 não tem status.md: o MR aberto no GitLab a coloca em Em Revisão
    ".sabia/local/wt/ft-001/.kiro/specs/ft-001-um/status.md": "# FT-001\n\n| Campo | Valor |\n|---|---|\n| Fase | implementando |\n| MR | !12 https://gl.exemplo/time/app/-/merge_requests/12 |\n| Trilha | completo |\n| Autonomia | IA supervisionada |\n",
  });
  const agora = new Date("2026-11-10T12:00:00Z");
  process.env.GITLAB_API_URL = "https://gl.exemplo/"; process.env.GITLAB_API_TOKEN = "segredo";
  let q;
  try {
    const exec = (cmd) => cmd === "git"
      ? { status: 0, stdout: "git@gl.exemplo:time/app.git\n" }
      : { status: 0, stdout: JSON.stringify([
        { iid: 12, title: "T", author: { username: "ana" }, source_branch: "ft-001", web_url: "https://gl.exemplo/time/app/-/merge_requests/12", created_at: "2026-11-07T09:00:00Z", updated_at: "2026-11-08T09:00:00Z", draft: false },
        { iid: 13, title: "T2", author: { username: "bia" }, source_branch: "ft-004", web_url: "https://gl.exemplo/time/app/-/merge_requests/13", created_at: "2026-11-10T08:00:00Z", updated_at: "2026-11-10T09:00:00Z", draft: false },
      ]) };
    q = await abrirQuadro({ projeto: proj, exec, log: (x) => logs.push(String(x)), agora });
    assert.match(logs.at(-1), /^Quadro Kanban do projeto st-k \(Ctrl\+C encerra\):\n\n {2}http:\/\/127\.0\.0\.1:\d+\/\n$/);  // a URL sozinha na linha
    const html = await (await fetch(q.url)).text();
    assert.match(html, /<title>Quadro · st-k<\/title>/);
    assert.match(html, /data-sobria="sobria-sabia"/);
    assert.match(html, /data-modo/);  // o claro/escuro do tema
    assert.match(html, new RegExp(`<span class="ver">${s.VERSAO.replaceAll(".", "\\.")}</span>`));  // a versão no topo
    assert.match(html, new RegExp(`<span>Sabiá ${s.VERSAO.replaceAll(".", "\\.")}</span>`));  // e no rodapé
    assert.match(html, /<code>\.sabia\/config\/kanban\.json<\/code>/);  // onde gravar o JSON copiado
    // a página desenha no navegador só o JSON da `sabia status` embutido nela
    const embutido = JSON.parse(html.match(/<script id="dados" type="application\/json">([\s\S]*?)<\/script>/)[1]);
    assert.equal(embutido.versao, 3);
    assert.equal(embutido.quadro.itens.length, 5);
    const de = (id) => embutido.quadro.itens.find((c) => c.id === id);
    assert.equal(de("FT-001").coluna, "implementando");  // a Fase do status.md manda, mesmo com MR aberto
    assert.equal(de("FT-004").coluna, "pr-aberto");  // sem status.md: o MR aberto no GitLab
    assert.equal(de("AT-001").coluna, "iniciada");
    assert.equal(de("EP-01").coluna, "em-especificacao");
    assert.deepEqual(de("FT-001").avisos, [{ tipo: "mr-parado", nivel: "atencao", mensagem: "MR !12 parado: sem atualização há 2 dias" }]);
    assert.deepEqual(embutido.quadro.wip.map((w) => `${w.status} ${w.atual}/${w.limite}`), ["em-andamento 1/1", "em-revisao 1/2"]);
    // os outros caminhos: o JSON cru, o 404 e o método
    const dados = await (await fetch(q.url + "dados.json")).json();
    assert.deepEqual(dados, statusDoProjeto({ projeto: proj, exec, agora }));
    assert.equal((await fetch(q.url + "outro")).status, 404);
    assert.equal((await fetch(q.url, { method: "POST" })).status, 405);
    // cada carga lê o projeto de novo: o kanban.json gravado depois de o servidor subir já vale
    escrever(proj, { ".sabia/config/kanban.json": JSON.stringify({ colunas: [{ id: "concluida", nome: "Feito" }] }) });
    assert.deepEqual((await (await fetch(q.url + "dados.json")).json()).quadro.colunas[0], { id: "concluida", nome: "Feito", oculta: false, grupo: false });
    // o sinal de vida: a conexão fica aberta até o servidor fechar
    const vivo = await fetch(q.url + "vivo");
    assert.equal(vivo.headers.get("content-type"), "text/event-stream");
    q.fechar();
    await q.fechou;  // o evento close: o servidor parou de escutar
    await assert.rejects(fetch(q.url));
  } finally {
    if (q) { q.fechar(); await q.fechou; }  // se uma asserção falhar antes, fecha o mesmo — sem vazar o servidor
    delete process.env.GITLAB_API_URL; delete process.env.GITLAB_API_TOKEN;
  }
});

test("kanban: a linha de comando — ajuda sem executar e o erro quando não há backlog", async () => {
  assert.equal((await rodar(["kanban", "-h"])).codigo, 0);
  assert.match(logs.at(-1), /^uso:\n {2}sabia kanban — o quadro Kanban[\s\S]*\n    \[--projeto <pasta>\] \[--porta <n>\]/);
  assert.equal((await rodar([])).codigo, 0);
  assert.match(logs.at(-1), /sabia kanban/);
  const sem = await rodar(["kanban", "--projeto", raiz]);
  assert.equal(sem.codigo, 1);
  assert.match(sem.erro, /backlog\.md não existe/);
});

test("<cmd> -h mostra a ajuda do comando e nunca executa; -v a versão; as flags curtas", async () => {
  assert.equal((await rodar(["instalar", "-h"])).codigo, 0);
  assert.match(logs.at(-1), /^uso:\n {2}sabia instalar — instala o Sabiá[\s\S]*-y, --sim/);
  assert.ok(!fs.existsSync(path.join(home, ".sabia")) && !chamadas.length);
  assert.equal((await rodar(["toolkits", "-h"])).codigo, 0);
  assert.equal(logs.at(-1).match(/^ {2}sabia toolkits/gm).length, 4);
  assert.equal((await rodar(["-v"])).codigo, 0);
  assert.equal(logs.at(-1), JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url), "utf8")).version);
  assert.equal((await rodar([])).codigo, 0);
  assert.match(logs.at(-1), /experimente: npx sabia instalar$/);
  assert.deepEqual(s.lerArgs(["instalar", "-a", "kiro", "-t", "x,y", "-y"]), { posicionais: ["instalar"], opcoes: { alvo: "kiro", toolkits: "x,y", sim: true } });
  assert.throws(() => s.lerArgs(["instalar", "-a", "-y"]), /--alvo precisa de um valor/);
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
  assert.deepEqual(s.lerArgs(["toolkits", "instalar", "x", "--alvo", "opencode", "--sem-mcp"]),
    { posicionais: ["toolkits", "instalar", "x"], opcoes: { alvo: "opencode", semMcp: true } });
  assert.deepEqual(s.lerArgs(["rota", "--mapa", "--fluxo", "sa-x.f", "--projeto", "p"]),
    { posicionais: ["rota"], opcoes: { mapa: true, fluxo: "sa-x.f", projeto: "p" } });
  assert.equal(await s.main(["rota"]), 1);  // sem arquivo, --fluxo nem --mapa: a ajuda
});

// framework mínimo com fluxo, um toolkit com passo.passo e arquivos, e um projeto com override
function cenarioRota() {
  const mestre = (d) => `---\n${JSON.stringify(d)}\n---\n# ${d.fluxo}\n`;
  const fw = escrever(path.join(raiz, "fw-rota"), {
    "plugin.json": { name: "sabia", version: "2.0.0" },
    "fluxo/travas.json": { travas: { "sim-da-pessoa": { texto: "sim" }, "toolkit-sem-commit": { texto: "sem commit" }, "revisao-independente": { texto: "outro revisa" } } },
    "fluxo/sa-desenvolver/codificar/codificar.md": mestre({ fluxo: "codificar", dono: "sa-desenvolvedor", travas_gerais: ["sim-da-pessoa"], passos: [
      { id: "tarefa", desvio: true, travas: ["toolkit-sem-commit"], saidas: { "ainda há tarefa: não marcada": "tarefa" } },
      { id: "revisar", chama: "sa-revisar.revisar", travas: ["revisao-independente"], saidas: { REVISAR: "tarefa" } },
      { id: "rito", removivel: true },
      { id: "pr", saidas: { "PR aberto": "→ sa-revisar.hitl", "sem GATE": "fim" } }] }),
    "fluxo/sa-revisar/revisar/revisar.md": mestre({ fluxo: "revisar", dono: "sa-revisor", passos: [{ id: "ler" }] }),
    "fluxo/sa-revisar/hitl/hitl.md": mestre({ fluxo: "hitl", dono: "sa-revisor", passos: [{ id: "aprovar-pr", saidas: { pronto: "→ sa-desenvolver.codificar.pr" } }] }),
  });
  escrever(path.join(home, ".sabia/toolkits/batch-alfa"), {
    "toolkit.json": { nome: "batch-alfa", versao: "1.0.0",
      skills: [{ caminho: "skills/batch/SKILL.md", passo: { passo: "sa-desenvolver.codificar.tarefa", para: "tarefa de job", arquivos: ["src/*.java", "**/*JobConfig.java"], agente: "batch-job" } },
        { caminho: "skills/sql/SKILL.md", passo: { passo: "sa-desenvolver.codificar.revisar", para: "sql", arquivos: ["**/*.sql"] } }],  // passo sem gancho
      agentes: [{ nome: "batch-job", prompt: "agentes/job.md", skills: ["skills/batch/SKILL.md", "skills/java/SKILL.md"] }] },
  });
  const projeto = escrever(path.join(raiz, "proj"), {
    ".sabia/config/agentes.json": { toolkits: { "batch-alfa": { pasta: "~/.sabia/toolkits/batch-alfa", versao: "1.0.0" } },
      passos: [{ toolkit: "batch-alfa", skill: "skills/batch/SKILL.md", agente: true },
        { toolkit: "batch-alfa", skill: "skills/sql/SKILL.md" }] },
    ".sabia/fluxo/sa-desenvolver/codificar/codificar.md": '---\n{"inserir": [{"id": "fim2", "depois": "metricas"}, {"id": "metricas", "depois": "revisar"}], "remover": ["rito"]}\n---\n',
    ".sabia/fluxo/sa-desenvolver/codificar/passos/tarefa.md": '---\n{"base": "3f9a1c0b7e21"}\n---\n## Entrada\n',
    ".sabia/fluxo/sa-desenvolver/codificar/passos/metricas.md": "---\n{}\n---\n## Entrada\n",
    ".sabia/fluxo/sa-desenvolver/codificar/passos/fim2.md": "---\n{}\n---\n## Entrada\n",
    ".opencode/agents/sa-desenvolvedor.md": "agente",
  });
  return { framework: fw, projeto };
}

test("glob do passo.arquivos: ** atravessa /, * não", () => {
  assert.ok(s.casaGlob("**/*JobConfig.java", "src/main/java/a/ImportarJobConfig.java"));
  assert.ok(s.casaGlob("**/*JobConfig.java", "ImportarJobConfig.java"));
  assert.ok(s.casaGlob("**/batch/**/*Step*.java", "src/batch/x/y/LerStep1.java"));
  assert.ok(!s.casaGlob("src/*.java", "src/a/B.java"));
  assert.ok(!s.casaGlob("**/*JobConfig.java", "src/JobConfig.javax"));
  assert.ok(!s.casaGlob("a.b", "axb"));  // ponto é literal
});

test("rota de um arquivo: o desvio que casa, o dono, o motivo e as travas; sem casar, o fluxo padrão", () => {
  const o = cenarioRota();
  const com = s.rota(path.join(o.projeto, "src/main/java/x/ImportarPedidosJobConfig.java"), o);
  assert.match(com, /^passo +sa-desenvolver\.codificar\.tarefa +\.sabia\/fluxo\/sa-desenvolver\/codificar\/passos\/tarefa\.md \(projeto\)$/m);
  assert.match(com, /^dono +sa-desenvolvedor +\.opencode\/agents\/sa-desenvolvedor\.md$/m);
  assert.match(com, /^desvio +batch-job +toolkit batch-alfa 1\.0\.0$/m);
  assert.match(com, /^motivo +casou \*\*\/\*JobConfig\.java$/m);
  assert.match(com, /^skills +sa-desenvolver, batch, java$/m);
  assert.match(com, /^travas +sim-da-pessoa, toolkit-sem-commit$/m);
  const sem = s.rota("src/main/java/x/PedidoDto.java", o);
  assert.match(sem, /^desvio +— fluxo padrão +nenhum padrão casou$/m);
  assert.match(sem, /^pelo texto +"tarefa de job" → batch-job/m);
  // desvio em passo sem gancho: o gerador recusa, a rota não o mostra
  assert.match(s.rota("db/x.sql", o), /^desvio +— fluxo padrão/m);
  // sem o projeto: o passo do Sabiá, sem agente gerado
  const fora = s.rota("x.java", { framework: o.framework, projeto: path.join(raiz, "vazio") });
  assert.match(fora, /^passo +sa-desenvolver\.codificar\.tarefa +.*fw-rota\/fluxo\/sa-desenvolver\/codificar\/passos\/tarefa\.md \(Sabiá 2\.0\.0\)$/m);
  assert.match(fora, /agente não gerado neste projeto/);
});

test("rota: toolkit instalado com o passo sem o id avisa o que fazer e não desvia", () => {
  const o = cenarioRota(), logs = [];
  const tk = path.join(home, ".sabia/toolkits/batch-alfa/toolkit.json"), man = JSON.parse(fs.readFileSync(tk, "utf8"));
  delete man.skills[0].passo.passo;
  fs.writeFileSync(tk, JSON.stringify(man));
  s.ctx.log = (x) => logs.push(x);
  try {
    assert.match(s.rota(path.join(o.projeto, "src/main/java/x/ImportarPedidosJobConfig.java"), o), /^desvio +— fluxo padrão/m);
  } finally { s.ctx.log = () => {}; }
  assert.ok(logs.some((x) => /não tem o id: use o id do passo \(passo\.passo\) e reinstale o toolkit \(`sabia toolkits atualizar batch-alfa`\)/.test(x)));
});

test("rota de uma tarefa do tasks.md: casa pelos arquivos que ela cita; sem casar, o texto dela e os para", () => {
  const o = cenarioRota();
  const tasks = path.join(escrever(path.join(raiz, "spec"), { "tasks.md": ["# Implementation Plan: FT-001 x", "", "## Tasks", "",
    "- [ ] 1. Job de importação", "  - [ ] 1.1 Teste em `src/main/java/x/ImportarPedidosJobConfigTest.java` (vermelho)",
    "  - [ ] 1.2 Implementar `src/main/java/x/ImportarPedidosJobConfig.java` (verde)", "  - Pronto quando: `mvn test` verde",
    "- [x] 2. DTO do pedido", "  - [ ] 2.1 Criar `src/main/java/x/PedidoDto.java`", ""].join("\n") }), "tasks.md");
  const com = s.rota(`${tasks}#1`, o);
  assert.match(com, /^tarefa +1 +1\. Job de importação · 1\.1 Teste em/m);
  assert.match(com, /^desvio +batch-job +toolkit batch-alfa 1\.0\.0$/m);
  assert.match(com, /^motivo +casou \*\*\/\*JobConfig\.java em src\/main\/java\/x\/ImportarPedidosJobConfig\.java$/m);
  const sem = s.rota(`${tasks}#T-2`, o);
  assert.match(sem, /^tarefa +2 +2\. DTO do pedido · 2\.1 Criar `src\/main\/java\/x\/PedidoDto\.java`$/m);
  assert.match(sem, /^desvio +— fluxo padrão +nenhum padrão casou$/m);
  assert.match(sem, /^pelo texto +"tarefa de job" → batch-job/m);
  assert.deepEqual(s.lerTarefa(tasks, "1.2").arquivos, ["src/main/java/x/ImportarPedidosJobConfig.java"]);
  assert.throws(() => s.rota(`${tasks}#9`, o), /não há a tarefa 9/);
  // em andamento no Kiro ([-]), linha em branco entre subtarefas e caminho ./ ou absoluto no projeto
  const t2 = path.join(escrever(path.join(raiz, "spec2"), { "tasks.md": ["- [-] 3. Mãe", "", "  - [ ] 3.1 Teste `./src/A.java`", "",
    `  - [ ] 3.2 Job \`${path.join(o.projeto, "src/x/CargaJobConfig.java")}\``, "- [ ] 4. Outra `src/B.java`",
    `- [ ] 5. Só o absoluto \`${path.join(o.projeto, "lib/x/CargaJobConfig.java")}\``, ""].join("\n") }), "tasks.md");
  assert.deepEqual(s.lerTarefa(t2, "3").arquivos, ["./src/A.java", path.join(o.projeto, "src/x/CargaJobConfig.java")]);
  assert.match(s.rota(`${t2}#3`, o), /^motivo +casou src\/\*\.java em src\/A\.java$/m);
  assert.match(s.rota(`${t2}#5`, o), /^motivo +casou \*\*\/\*JobConfig\.java em lib\/x\/CargaJobConfig\.java$/m);
});

test("rota --fluxo: a ordem com o que o projeto mudou, o grafo ASCII e o diagrama de estados", () => {
  const o = cenarioRota();
  const t = s.rotaFluxo("sa-desenvolver/codificar", o);
  const linhas = t.split("\n");
  const ordem = linhas.filter((l) => /^(\d+|-) {2}/.test(l)).map((l) => l.split(/\s+/).slice(0, 2).join(" "));
  assert.deepEqual(ordem, ["1 tarefa", "2 revisar", "3 metricas", "4 fim2", "- rito", "5 pr"]);
  assert.match(t, /^fluxo +sa-desenvolver\.codificar +dono sa-desenvolvedor +Sabiá 2\.0\.0$/m);
  assert.match(t, /^desvio ⇢ +tarefa: src\/\*\.java, \*\*\/\*JobConfig\.java +→ batch-job +toolkit batch-alfa 1\.0\.0$/m);
  assert.match(t, /tarefa ⇢ +projeto \(base 3f9a1c0b7e21\)/);
  assert.match(t, /metricas +projeto, inserido depois de revisar/);
  assert.match(t, /rito +removido no projeto/);
  // o grafo ASCII resolvido: inserido com a origem, removido fora, desvio ligado com o toolkit
  const g = t.slice(t.indexOf("sa-desenvolver.codificar   dono"), t.indexOf("```mermaid"));
  assert.deepEqual([...g.matchAll(/│ (\d+ [a-z0-9-]+)/g)].map((x) => x[1]), ["1 tarefa", "2 revisar", "3 metricas", "4 fim2", "5 pr"]);
  assert.match(g, /│ 1 tarefa ⇢ +│──▶ origem: projeto \(base 3f9a1c0b7e21\)\n.*┘ {4}⇢ desvio → batch-job \(toolkit batch-alfa 1\.0\.0\)\n {32}🔒 toolkit-sem-commit\n {32}↺ tarefa/);
  assert.match(g, /│ 3 metricas +│──▶ origem: projeto, inserido depois de revisar/);
  assert.match(g, /↑ volta a tarefa  \(REVISAR\)/);
  assert.match(g, /⇒ passa a sa-revisar\.hitl  \(PR aberto\)/);
  assert.ok(!g.includes("rito") && g.includes("↓ segue · ↑ volta"));
  const mm = t.slice(t.indexOf("```mermaid"));
  for (const l of ["stateDiagram-v2", "[*] --> tarefa", "tarefa --> tarefa: ainda há tarefa, não marcada", "revisar --> metricas: projeto (inserido)",
    "metricas --> fim2: projeto (inserido)", "fim2 --> pr", 'state "sa-revisar.hitl" as x_sa_revisar_hitl', "pr --> x_sa_revisar_hitl: PR aberto (passagem)",
    "pr --> [*]: sem GATE", "pr --> [*]", "note right of tarefa: corpo do projeto (base 3f9a1c0b7e21) · desvio ⇢ batch-job", "note right of revisar: chama sa-revisar.revisar"])
    assert.ok(mm.includes(`\n  ${l}\n`) || mm.includes(`${l}\n`), l);
  assert.ok(!/rito/.test(mm));
  assert.throws(() => s.rotaFluxo("sa-x.nada", o), /fluxo sa-x\.nada não existe/);
});

test("rota --mapa: chama e passagens de todo o framework em Mermaid", async () => {
  const o = cenarioRota();
  const t = s.rotaMapa(o);
  for (const l of ["flowchart LR", 'sa_desenvolver_codificar["sa-desenvolver.codificar"]', "sa_desenvolver_codificar -->|revisar| sa_revisar_revisar",
    "sa_desenvolver_codificar -.->|pr| sa_revisar_hitl", "sa_revisar_hitl -.->|aprovar-pr| sa_desenvolver_codificar"]) assert.ok(t.includes(l), l);
  const logs = [];
  s.ctx.log = (x) => logs.push(x);
  assert.equal(await s.main(["rota", "--mapa", "--framework", o.framework]), 0);
  assert.equal(logs[0], t);
  assert.equal(await s.main(["rota", "x.java", "--framework", path.join(raiz, "nada")]), 1);  // sem fluxo/: erro, não trava
});

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

/** O toolkit sintético "casa": HF → a skill casa, com o fluxo e o template do tipo como arquivos da pasta. */
function casa(base, mudar = {}) {
  return escrever(base, {
    "toolkit.json": { nome: "casa", versao: "1.0.0", descricao: "toolkit fictício de especificação", autor: { nome: "Ana Exemplo", area: "Equipe Alfa" },
      "tipos-de-projeto": ["backend"], skills: [{ caminho: "skills/casa/SKILL.md", papeis: ["especificador"] }],
      tipos: { HF: { skill: "skills/casa/SKILL.md", fluxo: "fluxo/fluxo-hf.md", template: "template/template-hf.md" } }, ...mudar },
    "skills/casa/SKILL.md": "---\nname: casa\ndescription: HF da casa\n---\n# casa\n\nSiga o fluxo do tipo.\n",
    "fluxo/fluxo-hf.md": "# Fluxo HF\n", "template/template-hf.md": "# Padrão HF\n",
  });
}

test("toolkit com tipo → skill: baixa como veio (nada compilado), remover apaga; o tipo é validado no baixar", async () => {
  for (const f of ["fluxo", "template", "skills", "plugin.json"]) fs.cpSync(path.join(REPO, f), path.join(home, ".sabia/framework", f), { recursive: true });
  await s.baixarToolkit(casa(path.join(raiz, "tk-casa")), {});
  const pasta = path.join(home, ".sabia/toolkits/casa/1.0.0");
  assert.equal(fs.readFileSync(path.join(pasta, "skills/casa/SKILL.md"), "utf8"), "---\nname: casa\ndescription: HF da casa\n---\n# casa\n\nSiga o fluxo do tipo.\n");
  assert.ok(fs.existsSync(path.join(pasta, "fluxo/fluxo-hf.md")) && !fs.existsSync(path.join(home, ".sabia/compilado-toolkits")));
  await s.removerToolkits(["casa"], { sim: true });
  assert.ok(!fs.existsSync(path.join(home, ".sabia/toolkits/casa")));
  // tipo que o catálogo não deixa desviar, e a forma "<tk>.<fluxo>": recusados no baixar, nada gravado
  const hf = { skill: "skills/casa/SKILL.md", fluxo: "fluxo/fluxo-hf.md" };
  await assert.rejects(s.baixarToolkit(casa(path.join(raiz, "tk-ruim"), { tipos: { GL: hf } }), {}), /tipo GL: não é desviável/);
  await assert.rejects(s.baixarToolkit(casa(path.join(raiz, "tk-str"), { tipos: { HF: "casa.hf" } }), {}), /tipo HF: use \{"skill", "fluxo", "template"\}/);
  // a skill do tipo sem o papel do agente dono de um passo de desvio (HF desvia em passos do sa-especificador)
  await assert.rejects(s.baixarToolkit(casa(path.join(raiz, "tk-papel"), { tipos: { HF: hf }, skills: [{ caminho: hf.skill, papeis: ["revisor"] }] }), {}),
    /tipo HF: a skill skills\/casa\/SKILL\.md não traz o papel especificador ou produto em papeis/);
  assert.ok(!fs.existsSync(path.join(home, ".sabia/toolkits/casa")));
  // o passo que só cria um tipo não aceita desvio por para: o tipo vai por `tipos`
  const porPasso = casa(path.join(raiz, "tk-passo"), { tipos: undefined, skills: [{ caminho: "skills/casa/SKILL.md", papeis: ["especificador"],
    passo: { passo: "sa-prd.prd.escrever", para: "épico de exemplo" } }] });
  assert.match(s.validarToolkit(porPasso, null, REPO).join(), /sa-prd\.prd\.escrever não aceita desvio de toolkit \(o tipo HF, UC, REG, MSG, EL, RF, RNF vai por `tipos`\)/);
});

test("toolkit: skill com nome do Sabiá (sa-* ou sabia) é recusada", () => {
  const tk = casa(path.join(raiz, "tk-sa"), { tipos: undefined, skills: [{ caminho: "skills/sa-prd/SKILL.md", papeis: ["especificador"] }] });
  escrever(tk, { "skills/sa-prd/SKILL.md": "---\nname: sa-prd\ndescription: x\n---\n# sa-prd\n" });
  assert.match(s.validarToolkit(tk).join(), /skill skills\/sa-prd\/SKILL\.md: nome do Sabiá/);
});

test("rota --fluxo: o tipo → skill do toolkit no passo que cria o tipo", () => {
  const tk = casa(path.join(raiz, "tk-rota"));
  const projeto = escrever(path.join(raiz, "proj-tipo"), { ".sabia/config/agentes.json": { toolkits: { casa: { pasta: tk, versao: "1.0.0" } } } });
  const prd = s.rotaFluxo("sa-prd.prd", { framework: REPO, projeto });
  assert.match(prd, /^tipo ⇢ +escrever: HF +→ skill casa \(fluxo\/fluxo-hf\.md\) +toolkit casa 1\.0\.0$/m);
  assert.match(prd, /escrever ⇢ +Sabiá/);
  assert.match(prd, /│ \d escrever ⇢ +│──▶ ⇢ tipo HF → skill casa \(fluxo\/fluxo-hf\.md\) \(toolkit casa 1\.0\.0\)/);
  assert.ok(prd.includes("note right of escrever: chama sa-especificar.prototipo · tipo HF ⇢ skill casa (fluxo/fluxo-hf.md)"));
  // sem o toolkit no projeto: o ⇢ continua (o gancho), sem o tipo ligado
  assert.doesNotMatch(s.rotaFluxo("sa-prd.prd", { framework: REPO, projeto: path.join(raiz, "vazio") }), /^tipo ⇢/m);
  // a ATA desvia em outro passo: no sa-especificar.reuniao.escrever
  const tkAta = casa(path.join(raiz, "tk-rota-ata"), { tipos: { ATA: { skill: "skills/casa/SKILL.md", fluxo: "fluxo/fluxo-hf.md" } } });
  const pAta = escrever(path.join(raiz, "proj-ata"), { ".sabia/config/agentes.json": { toolkits: { casa: { pasta: tkAta, versao: "1.0.0" } } } });
  assert.match(s.rotaFluxo("sa-especificar.reuniao", { framework: REPO, projeto: pAta }), /│ \d+ escrever ⇢ +│──▶ ⇢ tipo ATA → skill casa/);
  // só a skill (references dentro) e a forma antiga "<tk>.<fluxo>": a rota não cai
  const tkSo = casa(path.join(raiz, "tk-rota-so"), { tipos: { HF: { skill: "skills/casa/SKILL.md" }, REG: "casa.reg" } });
  const pSo = escrever(path.join(raiz, "proj-so"), { ".sabia/config/agentes.json": { toolkits: { casa: { pasta: tkSo, versao: "1.0.0" } } } });
  const so = s.rotaFluxo("sa-prd.prd", { framework: REPO, projeto: pSo });
  assert.match(so, /^tipo ⇢ +escrever: HF +→ skill casa +toolkit casa 1\.0\.0$/m);
  assert.match(so, /REG +→ \(inválido/);
});

test("opção com valor sem o valor é recusada sem engolir a seguinte", async () => {
  assert.throws(() => s.lerArgs(["rota", "--fluxo", "--framework", "x"]), /--fluxo precisa de um valor/);
  assert.equal(await s.main(["rota", "--fluxo"]), 1);
});

test("desinstalar: a alterada à mão sai do total com ✎, fica registrada e o fecho diz como apagá-la", async () => {
  await s.instalar({ fonte: framework("fw", "1.1.0"), alvo: "opencode", semMcp: true });
  fs.writeFileSync(skill("sa-setup"), "mexi");
  await s.desinstalar({ sim: true });
  assert.match(saida.find((x) => x.startsWith("[Sai]")), /✗ opencode: 2 skills\n✎ ~\/\.config\/opencode\/skills\/sa-setup alterada à mão — mantida \(--forcar apaga\)/);
  assert.match(saida.at(-1), /→ para tirar as cópias alteradas: sabia desinstalar -a opencode --forcar/);
  assert.ok(s.lerInventario().alvos.opencode);
  await s.desinstalar({ sim: true, forcar: true });
  assert.ok(!fs.existsSync(skill("sa-setup")) && !s.lerInventario().alvos.opencode);
});

test("instalar: -t fora do índice e -a desconhecido falham antes do resumo, sem gravar nada", async () => {
  const indice = escrever(path.join(raiz, "indice"), { "index.json": { nome: "idx", toolkits: [] } });
  const fw = framework("fw", "1.1.0");
  await assert.rejects(s.instalar({ fonte: fw, alvo: "opencode", toolkits: "jav", indice, sim: true }), /toolkit jav não está nos índices — veja: sabia toolkits/);
  assert.ok(!fs.existsSync(path.join(home, ".sabia/framework")) && !saida.some((x) => x.startsWith("[Resumo]")));
  saida = [];
  await assert.rejects(s.instalar({ fonte: fw, alvo: "vim", sim: true }), /ferramenta desconhecida: vim/);
  assert.ok(!saida.some((x) => x.includes("baixado")));
});

test("índice vazio ou inacessível: o toolkits instalar diz o que conferir e sai 1", async () => {
  const r = await rodar(["toolkits", "instalar", "--indice", escrever(path.join(raiz, "vazio"), { "index.json": { toolkits: [] } })]);
  assert.equal(r.codigo, 1);
  assert.equal(r.erro, "sabia: nenhum toolkit nos índices — confira o --indice ou ~/.sabia/indices.json");
});

test("opção desconhecida é recusada; o toolkits -h só mostra as opções do grupo", async () => {
  assert.throws(() => s.lerArgs(["toolkits", "instalar", "--froce", "java"]), /opção desconhecida --froce — veja: sabia toolkits -h/);
  assert.throws(() => s.lerArgs(["instalar", "-x"]), /opção desconhecida -x — veja: sabia instalar -h/);
  assert.equal((await rodar(["toolkits", "instalar", "--froce", "java"])).codigo, 1);
  assert.equal((await rodar(["toolkits", "-h"])).codigo, 0);
  assert.ok(!/-t, --toolkits|--sem-mcp/.test(logs.at(-1)) && /-y, --sim/.test(logs.at(-1)));
});

test("schemas públicos: as cópias do framework são iguais às do repositório json-schemas", (t) => {
  const pub = path.resolve(REPO, "../json-schemas/sabia");
  if (!fs.existsSync(pub)) return t.skip("repositório json-schemas não clonado ao lado");
  for (const [nome, copia] of [["toolkit", "skills/sa-setup/assets"], ["equipe", "skills/sa-planejamento/assets"]])
    assert.equal(fs.readFileSync(path.join(REPO, copia, `${nome}.schema.json`), "utf8"), fs.readFileSync(path.join(pub, `${nome}.schema.json`), "utf8"), nome);
});
