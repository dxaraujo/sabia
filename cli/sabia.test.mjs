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
    return { status: 0, stdout: "", stderr: "" };
  };
});

const skill = (nome) => path.join(home, ".config/opencode/skills", nome, "SKILL.md");

test("instala no opencode e no Kiro, com o inventário; cursor é ferramenta desconhecida", async () => {
  await s.instalar({ fonte: framework("fw", "1.1.0"), alvo: "opencode,kiro" });
  assert.equal(fs.readFileSync(skill("sa-setup"), "utf8"), "sa-setup 1.1.0");
  assert.ok(fs.existsSync(path.join(home, ".sabia/framework/skills/sa-setup/SKILL.md")));
  const inv = s.lerInventario();
  assert.equal(inv.framework.versao, "1.1.0");
  const p = "~/.config/opencode/skills/";
  assert.deepEqual(Object.keys(inv.alvos.opencode.copias).sort(), [`${p}sa-codificar`, `${p}sa-setup`, `${p}sabia`]);
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

test("atualizar mostra a diferença, troca as cópias, tira a skill que saiu e pergunta pela alterada à mão", async () => {
  await s.instalar({ fonte: framework("fw1", "1.1.0"), alvo: "opencode", semMcp: true });
  fs.writeFileSync(skill("sa-codificar"), "mexi");
  respostas = ["s", "n"];  // atualizar? sim · sobrescrever a alterada à mão? não
  await s.atualizar({ fonte: framework("fw2", "1.2.0", ["sabia", "sa-setup", "sa-codificar"]) });
  assert.equal(fs.readFileSync(skill("sa-setup"), "utf8"), "sa-setup 1.2.0");
  assert.equal(fs.readFileSync(skill("sa-codificar"), "utf8"), "mexi");
  assert.equal(s.lerInventario().framework.versao, "1.2.0");

  await s.atualizar({ fonte: framework("fw3", "1.3.0", ["sabia", "sa-setup"]) });  // padrão das respostas: "n"
  assert.equal(s.lerInventario().framework.versao, "1.2.0");
  respostas = ["s", "s"];
  await s.atualizar({ fonte: framework("fw3b", "1.3.0", ["sabia", "sa-setup"]) });
  assert.ok(!fs.existsSync(skill("sa-codificar")));
  assert.ok(!("~/.config/opencode/skills/sa-codificar" in s.lerInventario().alvos.opencode.copias));
});

test("skill de fluxo é compilada: os passos gerados entram no inventário e o passo editado à mão é detectado", async () => {
  const fw = framework("fw", "2.0.0");
  escrever(fw, {
    "skills/sa-codificar/SKILL.md": "---\nname: sa-codificar\nmetadata:\n  version: \"2.0.0\"\n---\n# sa-codificar\n",
    "fluxo/travas.json": { travas: {} },
    "fluxo/sa-codificar/codificar/codificar.md": '---\n{"fluxo": "codificar", "dono": "sa-x", "passos": [{"id": "tarefa"}]}\n---\n# Codificar\n',
    "fluxo/sa-codificar/codificar/passos/tarefa.md": '---\n{"resumo": "Uma tarefa."}\n---\n## Entrada\n\n## Faça\n\nCiclo.\n\n## Saída\n\n## Pare se\n\n—\n',
  });
  await s.instalar({ fonte: fw, alvo: "opencode" });
  const dir = path.join(home, ".config/opencode/skills/sa-codificar");
  assert.match(fs.readFileSync(path.join(dir, "SKILL.md"), "utf8"), /## Fluxo codificar/);
  const copias = s.lerInventario().alvos.opencode.copias["~/.config/opencode/skills/sa-codificar"];
  assert.match(copias["references/codificar/tarefa.md"], /^[0-9a-f]{64}$/);
  assert.equal(s.lerInventario().framework.compilador, JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url), "utf8")).version);
  fs.appendFileSync(path.join(dir, "references/codificar/tarefa.md"), "editado\n");
  escrever(fw, { "fluxo/sa-codificar/codificar/passos/tarefa.md": '---\n{"resumo": "Uma tarefa."}\n---\n## Entrada\n\n## Faça\n\nCiclo novo.\n\n## Saída\n\n## Pare se\n\n—\n' });
  respostas = ["s", "n"];  // atualizar? sim · sobrescrever a alterada à mão? não
  await s.atualizar({ fonte: fw });
  assert.match(fs.readFileSync(path.join(dir, "references/codificar/tarefa.md"), "utf8"), /editado/);
});

test("desinstalar apaga só o que o inventário registrou", async () => {
  await s.instalar({ fonte: framework("fw", "1.1.0"), alvo: "opencode,kiro" });
  escrever(home, { ".config/opencode/skills/minha/SKILL.md": "minha", ".config/opencode/opencode.json": { mcp: { servers: { elm: {}, meu: {} } } } });
  await s.desinstalar({});
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
      skills: [{ caminho: "skills/batch/SKILL.md", papeis: ["desenvolvedor"], passo: { passo: "sa-codificar.codificar.tarefa", para: "job", agente: "batch-job" } }],
      agentes: [{ nome: "batch-job", descricao: "codifica um job", prompt: "agentes/job.md", skills: ["skills/batch/SKILL.md"] }], ...mudar },
  });
}

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
  await s.instalarToolkit("batch-alfa", { indice, alvo: "opencode,kiro" });
  assert.ok(fs.existsSync(path.join(home, ".sabia/toolkits/batch-alfa/toolkit.json")));
  assert.equal(JSON.parse(fs.readFileSync(path.join(home, ".sabia/toolkits/batch-alfa/.origem.json"), "utf8")).indice, indice);
  assert.equal(fs.readFileSync(skill("batch"), "utf8"), "batch");
  assert.ok(!fs.existsSync(path.join(home, ".kiro")));  // o Kiro lê de ~/.sabia/toolkits
  const linhas = s.listarToolkits({ indice });
  assert.deepEqual([linhas[0][0], linhas[0][2], linhas[0][3]], ["batch-alfa", "1.0.0", "1.0.0"]);

  fs.writeFileSync(path.join(indice, "batch-alfa/skills/batch/SKILL.md"), "batch 2");
  respostas = ["s"];
  await s.atualizarToolkits("batch-alfa", {});
  assert.equal(fs.readFileSync(skill("batch"), "utf8"), "batch 2");

  const projeto = escrever(path.join(raiz, "projeto"), { ".sabia/config/agentes.json": { toolkits: { "batch-alfa": { versao: "1.0.0" } } } });
  const cwd = process.cwd();
  process.chdir(projeto);
  try { await s.instalarDoProjeto({ indice }); } finally { process.chdir(cwd); }  // a mesma versão: nada a fazer
  assert.equal(fs.readFileSync(skill("batch"), "utf8"), "batch 2");

  await s.removerToolkit("batch-alfa", {});
  assert.ok(!fs.existsSync(skill("batch")));
  assert.ok(!fs.existsSync(path.join(home, ".sabia/toolkits/batch-alfa")));
  assert.deepEqual(s.lerInventario().toolkits, {});
});

test("o passo do toolkit pelo id: só em passo do Sabiá com gancho de desvio", () => {
  const repo = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
  const comPasso = (passo) => ({ skills: [{ caminho: "skills/batch/SKILL.md", papeis: ["desenvolvedor"], passo: { passo, para: "job de batch", agente: "batch-job" } }] });
  assert.deepEqual(s.validarToolkit(toolkit(path.join(raiz, "ok"), comPasso("sa-codificar.codificar.tarefa")), "batch-alfa", repo), []);
  assert.match(s.validarToolkit(toolkit(path.join(raiz, "a"), comPasso("sa-codificar.codificar.validar")), null, repo).join(), /não aceita desvio/);
  assert.match(s.validarToolkit(toolkit(path.join(raiz, "b"), comPasso("sa-codificar.codificar.nada")), null, repo).join(), /não existe/);
  assert.deepEqual(s.validarToolkit(toolkit(path.join(raiz, "c"), comPasso("sa-codificar.codificar.nada"))), []);  // sem framework: fica para a setup
  // passo sem o id (passo.papel) é recusado, com ou sem o framework
  const semId = { skills: [{ caminho: "skills/batch/SKILL.md", papeis: ["desenvolvedor"], passo: { papel: "desenvolvedor", para: "job de batch" } }] };
  for (const fw of [repo, null]) assert.match(s.validarToolkit(toolkit(path.join(raiz, `p-${!!fw}`), semId), null, fw).join(), /passo de skills\/batch\/SKILL\.md: use o id do passo \(passo\.passo\)/);
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
    "fluxo/sa-codificar/codificar/codificar.md": mestre({ fluxo: "codificar", dono: "sa-desenvolvedor", travas_gerais: ["sim-da-pessoa"], passos: [
      { id: "tarefa", desvio: true, travas: ["toolkit-sem-commit"], saidas: { "ainda há tarefa: não marcada": "tarefa" } },
      { id: "revisar", chama: "sa-revisar.revisar", travas: ["revisao-independente"], saidas: { REVISAR: "tarefa" } },
      { id: "rito", removivel: true },
      { id: "pr", saidas: { "PR aberto": "→ sa-revisar.hitl", "sem GATE": "fim" } }] }),
    "fluxo/sa-revisar/revisar/revisar.md": mestre({ fluxo: "revisar", dono: "sa-revisor", passos: [{ id: "ler" }] }),
    "fluxo/sa-revisar/hitl/hitl.md": mestre({ fluxo: "hitl", dono: "sa-revisor", passos: [{ id: "aprovar-pr", saidas: { pronto: "→ sa-codificar.codificar.pr" } }] }),
  });
  escrever(path.join(home, ".sabia/toolkits/batch-alfa"), {
    "toolkit.json": { nome: "batch-alfa", versao: "1.0.0",
      skills: [{ caminho: "skills/batch/SKILL.md", passo: { passo: "sa-codificar.codificar.tarefa", para: "tarefa de job", arquivos: ["src/*.java", "**/*JobConfig.java"], agente: "batch-job" } },
        { caminho: "skills/sql/SKILL.md", passo: { passo: "sa-codificar.codificar.revisar", para: "sql", arquivos: ["**/*.sql"] } }],  // passo sem gancho
      agentes: [{ nome: "batch-job", prompt: "agentes/job.md", skills: ["skills/batch/SKILL.md", "skills/java/SKILL.md"] }] },
  });
  const projeto = escrever(path.join(raiz, "proj"), {
    ".sabia/config/agentes.json": { toolkits: { "batch-alfa": { pasta: "~/.sabia/toolkits/batch-alfa", versao: "1.0.0" } },
      passos: [{ toolkit: "batch-alfa", skill: "skills/batch/SKILL.md", agente: true },
        { toolkit: "batch-alfa", skill: "skills/sql/SKILL.md" }] },
    ".sabia/fluxo/sa-codificar/codificar/codificar.md": '---\n{"inserir": [{"id": "fim2", "depois": "metricas"}, {"id": "metricas", "depois": "revisar"}], "remover": ["rito"]}\n---\n',
    ".sabia/fluxo/sa-codificar/codificar/passos/tarefa.md": '---\n{"base": "3f9a1c0b7e21"}\n---\n## Entrada\n',
    ".sabia/fluxo/sa-codificar/codificar/passos/metricas.md": "---\n{}\n---\n## Entrada\n",
    ".sabia/fluxo/sa-codificar/codificar/passos/fim2.md": "---\n{}\n---\n## Entrada\n",
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
  assert.match(com, /^passo +sa-codificar\.codificar\.tarefa +\.sabia\/fluxo\/sa-codificar\/codificar\/passos\/tarefa\.md \(projeto\)$/m);
  assert.match(com, /^dono +sa-desenvolvedor +\.opencode\/agents\/sa-desenvolvedor\.md$/m);
  assert.match(com, /^desvio +batch-job +toolkit batch-alfa 1\.0\.0$/m);
  assert.match(com, /^motivo +casou \*\*\/\*JobConfig\.java$/m);
  assert.match(com, /^skills +sa-codificar, batch, java$/m);
  assert.match(com, /^travas +sim-da-pessoa, toolkit-sem-commit$/m);
  const sem = s.rota("src/main/java/x/PedidoDto.java", o);
  assert.match(sem, /^desvio +— fluxo padrão +nenhum padrão casou$/m);
  assert.match(sem, /^pelo texto +"tarefa de job" → batch-job/m);
  // desvio em passo sem gancho: o gerador recusa, a rota não o mostra
  assert.match(s.rota("db/x.sql", o), /^desvio +— fluxo padrão/m);
  // sem o projeto: o passo do Sabiá, sem agente gerado
  const fora = s.rota("x.java", { framework: o.framework, projeto: path.join(raiz, "vazio") });
  assert.match(fora, /^passo +sa-codificar\.codificar\.tarefa +.*fw-rota\/fluxo\/sa-codificar\/codificar\/passos\/tarefa\.md \(Sabiá 2\.0\.0\)$/m);
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
  const t = s.rotaFluxo("sa-codificar/codificar", o);
  const linhas = t.split("\n");
  const ordem = linhas.filter((l) => /^(\d+|-) {2}/.test(l)).map((l) => l.split(/\s+/).slice(0, 2).join(" "));
  assert.deepEqual(ordem, ["1 tarefa", "2 revisar", "3 metricas", "4 fim2", "- rito", "5 pr"]);
  assert.match(t, /^fluxo +sa-codificar\.codificar +dono sa-desenvolvedor +Sabiá 2\.0\.0$/m);
  assert.match(t, /^desvio ⇢ +tarefa: src\/\*\.java, \*\*\/\*JobConfig\.java +→ batch-job +toolkit batch-alfa 1\.0\.0$/m);
  assert.match(t, /tarefa ⇢ +projeto \(base 3f9a1c0b7e21\)/);
  assert.match(t, /metricas +projeto, inserido depois de revisar/);
  assert.match(t, /rito +removido no projeto/);
  // o grafo ASCII resolvido: inserido com a origem, removido fora, desvio ligado com o toolkit
  const g = t.slice(t.indexOf("sa-codificar.codificar   dono"), t.indexOf("```mermaid"));
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
  for (const l of ["flowchart LR", 'sa_codificar_codificar["sa-codificar.codificar"]', "sa_codificar_codificar -->|revisar| sa_revisar_revisar",
    "sa_codificar_codificar -.->|pr| sa_revisar_hitl", "sa_revisar_hitl -.->|aprovar-pr| sa_codificar_codificar"]) assert.ok(t.includes(l), l);
  const logs = [];
  s.ctx.log = (x) => logs.push(x);
  assert.equal(await s.main(["rota", "--mapa", "--framework", o.framework]), 0);
  assert.equal(logs[0], t);
  assert.equal(await s.main(["rota", "x.java", "--framework", path.join(raiz, "nada")]), 1);  // sem fluxo/: erro, não trava
});

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

/** O toolkit sintético "exemplo" (HF → exemplo.hf), com um padrão em camada sobre o sa-prd/hf.md. */
function exemplo(base, mudar = {}) {
  const fm = (d) => `---\n${JSON.stringify(d)}\n---\n`;
  return escrever(base, {
    "toolkit.json": { nome: "exemplo", versao: "1.0.0", descricao: "toolkit fictício de especificação", autor: { nome: "Ana Exemplo", area: "Equipe Alfa" },
      "tipos-de-projeto": ["backend"], skills: [{ caminho: "skills/exemplo/SKILL.md", papeis: ["especificador"] }],
      fluxos: ["exemplo.hf"], padroes: ["sa-prd/hf.md"], tipos: { HF: "exemplo.hf" }, ...mudar },
    "skills/exemplo/SKILL.md": "---\nname: exemplo\ndescription: HF do exemplo\n---\n# exemplo\n",
    "fluxo/exemplo/hf/hf.md": fm({ fluxo: "hf", dono: "sa-especificador", passos: [{ id: "escrever" }] }) + "# HF do exemplo\n",
    "fluxo/exemplo/hf/passos/escrever.md": fm({ resumo: "Escreve as HF." }) + "## Entrada\n\nx\n\n## Faça\n\nSiga o padrão `sa-prd/hf.md` e volte ao `sa-prd.prd.escrever`.\n\n## Saída\n\ny\n\n## Pare se\n\n—\n",
    "padrao/sa-prd/hf.md": fm({ resumo: "HF do exemplo." }) + "# HF (exemplo)\n",
  });
}

test("toolkit com fluxos: instalar compila para cada alvo (o opencode recebe a compilação), remover apaga a compilação", async () => {
  for (const f of ["fluxo", "padrao", "skills", "plugin.json"]) fs.cpSync(path.join(REPO, f), path.join(home, ".sabia/framework", f), { recursive: true });
  await s.instalarToolkit(exemplo(path.join(raiz, "tk-exemplo")), { alvo: "opencode,kiro" });
  const oc = fs.readFileSync(skill("exemplo"), "utf8");
  assert.ok(oc.includes("## Fluxo hf"));
  const passo = fs.readFileSync(path.join(home, ".config/opencode/skills/exemplo/references/hf/escrever.md"), "utf8");
  assert.ok(passo.includes("](~/.config/opencode/skills/sa-prd/references/prd/escrever.md)") && passo.includes("](~/.sabia/compilado-toolkits/opencode/exemplo/padrao/sa-prd/hf.md)"));
  const kiro = path.join(home, ".sabia/compilado-toolkits/kiro/exemplo");
  assert.ok(fs.readFileSync(path.join(kiro, "skills/exemplo/references/hf/escrever.md"), "utf8").includes("](~/.kiro/powers/installed/sabia/skills/sa-prd/references/prd/escrever.md)"));
  assert.ok(fs.existsSync(path.join(home, ".sabia/compilado-toolkits/opencode/exemplo/padrao/sa-prd/hf.md")));
  assert.deepEqual(Object.keys(s.lerInventario().toolkits.exemplo.alvos.opencode.copias), ["~/.config/opencode/skills/exemplo"]);
  await s.removerToolkit("exemplo", {});
  assert.ok(!fs.existsSync(skill("exemplo")) && !fs.existsSync(kiro));
  // tipo que o catálogo não deixa desviar: recusado no baixar, nada gravado
  await assert.rejects(s.baixarToolkit(exemplo(path.join(raiz, "tk-ruim"), { tipos: { GL: "exemplo.hf" } }), {}), /tipo GL: não é desviável/);
  assert.ok(!fs.existsSync(path.join(home, ".sabia/toolkits/exemplo")));
  // o passo que só cria um tipo não aceita desvio por para: o tipo vai por `tipos`
  const porPasso = exemplo(path.join(raiz, "tk-passo"), { tipos: undefined, skills: [{ caminho: "skills/exemplo/SKILL.md", papeis: ["especificador"],
    passo: { passo: "sa-prd.prd.escrever", para: "épico de exemplo" } }] });
  assert.match(s.validarToolkit(porPasso, null, REPO).join(), /sa-prd\.prd\.escrever não aceita desvio de toolkit \(o tipo HF, REG, EL, ET vai por `tipos`\)/);
});

test("toolkit com fluxos: atualizar o toolkit recompila também o Kiro; atualizar o Sabiá recompila os toolkits", async () => {
  const fw = path.join(raiz, "fw");
  for (const f of ["fluxo", "padrao", "skills", "plugin.json", "mcp.json"]) fs.cpSync(path.join(REPO, f), path.join(fw, f), { recursive: true });
  await s.instalar({ fonte: fw, alvo: "opencode", semMcp: true });
  const fonte = exemplo(path.join(raiz, "tk-at"));
  await s.instalarToolkit(fonte, { alvo: "opencode,kiro" });
  const doKiro = path.join(home, ".sabia/compilado-toolkits/kiro/exemplo/skills/exemplo/references/hf/escrever.md");
  escrever(fonte, { "fluxo/exemplo/hf/passos/escrever.md": fs.readFileSync(path.join(fonte, "fluxo/exemplo/hf/passos/escrever.md"), "utf8").replace("Siga", "Agora siga") });
  respostas = ["s"];  // substituir o toolkit baixado? sim
  await s.atualizarToolkits("exemplo", {});
  assert.match(fs.readFileSync(doKiro, "utf8"), /Agora siga/);
  assert.match(fs.readFileSync(skill("exemplo").replace("SKILL.md", "references/hf/escrever.md"), "utf8"), /Agora siga/);
  // o framework novo: a compilação dos toolkits é refeita sobre ele
  const doOpencode = path.join(home, ".sabia/compilado-toolkits/opencode/exemplo/padrao/sa-prd/hf.md");
  fs.rmSync(doOpencode);
  fs.appendFileSync(path.join(fw, "README.md"), "\nmudou\n");
  respostas = ["s"];  // atualizar? sim
  await s.atualizar({ fonte: fw });
  assert.ok(fs.existsSync(doOpencode));
});

test("toolkit: skill com nome do Sabiá (sa-* ou sabia) é recusada", () => {
  const tk = exemplo(path.join(raiz, "tk-sa"), { skills: [{ caminho: "skills/sa-prd/SKILL.md", papeis: ["especificador"] }] });
  escrever(tk, { "skills/sa-prd/SKILL.md": "---\nname: sa-prd\ndescription: x\n---\n# sa-prd\n" });
  assert.match(s.validarToolkit(tk).join(), /skill skills\/sa-prd\/SKILL\.md: nome do Sabiá/);
});

test("rota --fluxo: o desvio por tipo no passo que cria o tipo e a origem toolkit no fluxo do toolkit", () => {
  const tk = exemplo(path.join(raiz, "tk-rota"));
  const projeto = escrever(path.join(raiz, "proj-tipo"), { ".sabia/config/agentes.json": { toolkits: { exemplo: { pasta: tk, versao: "1.0.0" } } } });
  const o = { framework: REPO, projeto };
  const prd = s.rotaFluxo("sa-prd.prd", o);
  assert.match(prd, /^tipo ⇢ +escrever: HF +→ exemplo\.hf +toolkit exemplo 1\.0\.0$/m);
  assert.match(prd, /escrever ⇢ +Sabiá/);
  assert.match(prd, /│ \d escrever ⇢ +│──▶ ⇢ tipo HF → exemplo\.hf \(toolkit exemplo 1\.0\.0\)/);
  assert.ok(prd.includes("note right of escrever: chama sa-especificar.prototipo · tipo HF ⇢ exemplo.hf"));
  const hf = s.rotaFluxo("exemplo.hf", o);
  assert.match(hf, /^fluxo +exemplo\.hf +dono sa-especificador +toolkit exemplo 1\.0\.0$/m);
  assert.match(hf, /^1 +escrever +toolkit exemplo 1\.0\.0/m);
  // sem o toolkit no projeto: o ⇢ continua (o gancho), sem o tipo ligado
  assert.doesNotMatch(s.rotaFluxo("sa-prd.prd", { framework: REPO, projeto: path.join(raiz, "vazio") }), /^tipo ⇢/m);
});

test("opção com valor sem o valor é recusada sem engolir a seguinte", async () => {
  assert.throws(() => s.lerArgs(["rota", "--fluxo", "--framework", "x"]), /--fluxo precisa de um valor/);
  assert.equal(await s.main(["rota", "--fluxo"]), 1);
});
