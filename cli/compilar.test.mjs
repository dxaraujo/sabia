// node --test   (nesta pasta)
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { beforeEach, test } from "node:test";
import { fileURLToPath } from "node:url";
import { carregar, compilar, mapear, reescrever, slug, validar } from "./compilar.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "~/.config/opencode/skills";
let raiz;

function escrever(base, arquivos) {
  for (const [f, c] of Object.entries(arquivos)) {
    fs.mkdirSync(path.dirname(path.join(base, f)), { recursive: true });
    fs.writeFileSync(path.join(base, f), typeof c === "string" ? c : JSON.stringify(c));
  }
  return base;
}

const passo = (resumo, corpo = "Faça a coisa.") => `---\n{"resumo": "${resumo}"}\n---\n## Entrada\n\nx\n\n## Faça\n\n${corpo}\n\n## Saída\n\ny\n\n## Pare se\n\n—\n`;
const mestre = (d, corpo = "# Título\n\nEntrada geral.\n\n## Regras\n\n- Uma regra.\n") => `---\n${JSON.stringify(d)}\n---\n${corpo}`;
const skill = (nome, h1 = `# ${nome} — Teste`) => `---\nname: ${nome}\nmetadata:\n  version: "1.0.0"\n---\n\n${h1}\n`;

/** Um framework mínimo: sa-a (1 fluxo, 2 passos, padrão), sa-b (2 fluxos), sabia (sem fluxo). */
function fixture(extra = {}) {
  return escrever(path.join(raiz, "fw"), {
    "plugin.json": { name: "sabia", version: "2.0.0" },
    "mcp.json": { mcpServers: {} },
    "README.md": "# Sabiá\n",
    "skills/sa-setup/assets/agents/papeis.json": { papeis: {
      um: { skills: ["sa-a"], subagentes: ["sa-dois"] }, dois: { skills: ["sa-b"] } } },
    "skills/sa-setup/SKILL.md": "---\nname: sa-setup\n---\n# sa-setup\n",
    "skills/sa-a/SKILL.md": skill("sa-a"),
    "skills/sa-a/references/proc.md": "# Proc\n\nVeja [b](../../sa-b/SKILL.md) e [fim](#proc).\n",
    "skills/sa-b/SKILL.md": skill("sa-b"),
    "skills/sabia/SKILL.md": "---\nname: sabia\nmetadata:\n  version: \"1.0.0\"\n---\n# Sabiá\n\nSem fluxo: [proc](../sa-a/references/proc.md).\n",
    "fluxo/travas.json": { travas: { "sim-da-pessoa": { texto: "só com sim", liberavel_por: [] } } },
    "fluxo/sa-a/a/a.md": mestre({ fluxo: "a", dono: "sa-um", travas_gerais: ["sim-da-pessoa"], passos: [
      { id: "ini", desvio: true }, { id: "rev", chama: "sa-b.x", saidas: { "voltou": "ini", "pronto": "→ sa-b.y.fim" } }] }),
    "fluxo/sa-a/a/passos/ini.md": passo("Começa.", "Use o padrão `sa-a/modelo.md` e o passo `rev`; veja `sa-b.y.fim` e [proc](~/.sabia/framework/skills/sa-a/references/proc.md)."),
    "fluxo/sa-a/a/passos/rev.md": passo("Revisa."),
    "fluxo/sa-a/regras.md": "---\n{\"resumo\": \"comuns\"}\n---\n# Regras comuns\n\n- Sempre teste.\n",
    "padrao/sa-a/modelo.md": "---\n{\"resumo\": \"Um modelo.\"}\n---\n# Modelo\n",
    "fluxo/sa-b/x/x.md": mestre({ fluxo: "x", dono: "sa-dois", quando: ["revisar algo"], passos: [{ id: "olhar" }] }),
    "fluxo/sa-b/x/passos/olhar.md": passo("Olha."),
    "fluxo/sa-b/y/y.md": mestre({ fluxo: "y", dono: "sa-dois", quando: ["fechar"], passos: [{ id: "fim" }] }),
    "fluxo/sa-b/y/passos/fim.md": passo("Fecha."),
    ...extra,
  });
}

beforeEach(() => { raiz = fs.mkdtempSync(path.join(os.tmpdir(), "sabia-comp-")); });

const out = (st, f) => fs.readFileSync(path.join(st, "skills", f), "utf8");

test("skill de 1 fluxo: SKILL.md com regras, fluxo, tabela, travas, arquivos e o override; um arquivo por passo", () => {
  const st = compilar(fixture(), path.join(raiz, "st"), { base: BASE, versao: "2.0.0" });
  const s = out(st, "sa-a/SKILL.md");
  assert.match(s, /version: "2\.0\.0"/);
  for (const t of ["# sa-a — Teste", "## Regras", "- Sempre teste.", "## Fluxo a", "Agente: `sa-um`", "### Regras", "## Travas", "**sim-da-pessoa** — só com sim", "## Arquivos", "## No projeto"])
    assert.ok(s.includes(t), t);
  assert.match(s, /\| 1 \| `ini` ⇢ \| \[ini\.md\]\(~\/\.config\/opencode\/skills\/sa-a\/references\/a\/ini\.md\)/);
  assert.match(s, /\[`sa-b\.x`\]\(~\/\.config\/opencode\/skills\/sa-b\/SKILL\.md#fluxo-x\) \(sa-dois, subagente\)/);
  assert.match(s, /pronto → passa a \[`sa-b\.y\.fim`\]/);
  assert.equal(s.match(/^# /gm).length, 1);
  const ini = out(st, "sa-a/references/a/ini.md");
  assert.match(ini, /^_Começa\._\n\n## Entrada/);
  assert.ok(!ini.includes('"resumo"'));
  assert.ok(fs.existsSync(path.join(st, "skills/sa-a/references/padrao/modelo.md")));
});

test("reescrita: link do framework, relativo, âncora local, id e padrão viram caminho absoluto do alvo", () => {
  const st = compilar(fixture(), path.join(raiz, "st"), { base: BASE });
  const ini = out(st, "sa-a/references/a/ini.md");
  assert.ok(ini.includes(`o padrão [\`sa-a/modelo.md\`](${BASE}/sa-a/references/padrao/modelo.md)`));
  assert.ok(ini.includes(`[\`sa-b.y.fim\`](${BASE}/sa-b/references/y/fim.md)`));
  assert.ok(ini.includes(`[proc](${BASE}/sa-a/references/proc.md)`));
  assert.ok(ini.includes("o passo `rev`"), "passo do mesmo fluxo fica texto");
  const proc = out(st, "sa-a/references/proc.md");
  assert.ok(proc.includes(`[b](${BASE}/sa-b/SKILL.md)`) && proc.includes(`[fim](${BASE}/sa-a/references/proc.md#proc)`));
  assert.ok(out(st, "sabia/SKILL.md").includes(`[proc](${BASE}/sa-a/references/proc.md)`));
  assert.equal(mapear("/fw", "/fw/fluxo/sa-a/a/passos/ini.md"), "sa-a/references/a/ini.md");
  assert.equal(mapear("/fw", "/fw/padrao/sa-a/m.md"), "sa-a/references/padrao/m.md");
  assert.equal(mapear("/fw", "/fw/fora/x.md"), null);
  assert.equal(reescrever("```\n`sa-b.x`\n```", "/fw/x.md", { fw: "/fw", base: BASE, m: carregar(fixture()) }), "```\n`sa-b.x`\n```");
});

test("skill de 2+ fluxos: tabela Fluxos com o quando e âncoras que existem", () => {
  const st = compilar(fixture(), path.join(raiz, "st"), { base: BASE });
  const s = out(st, "sa-b/SKILL.md");
  assert.match(s, /\| \[x\]\(#fluxo-x\) \| revisar algo \|/);
  assert.ok(s.includes("## Fluxo x") && s.includes("## Fluxo y"));
  assert.equal(slug("Fluxo aprovar-pr"), "fluxo-aprovar-pr");
  assert.equal(slug("Fechar a sessão"), "fechar-a-sessão");
});

test("validação: recusa a fonte com erro, com arquivo:linha", () => {
  const casos = {
    "fluxo/sa-a/a/passos/orfao.md": [passo("x"), /passo orfao órfão/],
    "fluxo/sa-b/y/y.md": [mestre({ fluxo: "y", dono: "sa-dois", passos: [{ id: "fim" }] }), /falta "quando"/],
    "fluxo/sa-a/a/a.md": [mestre({ fluxo: "a", dono: "sa-um", travas_gerais: ["nao-existe"], passos: [{ id: "ini", saidas: { z: "nada" } }, { id: "rev", chama: "sa-zz.q" }] }), /trava nao-existe fora do catálogo[\s\S]*saída "z"[\s\S]*chama sa-zz\.q inexistente/],
  };
  for (const [f, [conteudo, erro]] of Object.entries(casos)) {
    fs.rmSync(raiz, { recursive: true, force: true }); fs.mkdirSync(raiz);
    assert.throws(() => compilar(fixture({ [f]: conteudo }), path.join(raiz, "st"), { base: BASE }), erro, f);
  }
  const m = carregar(fixture({ "fluxo/sa-a/a/passos/rev.md": passo("x", "Volte ao passo `zzz` e ao `sa-a.a.nada`; veja ~/.sabia/fluxo/sa-a/.") }));
  const e = validar(m).join("\n");
  assert.match(e, /fluxo\/sa-a\/a\/passos\/rev\.md:\d+: passo `zzz` não é do fluxo/);
  assert.match(e, /id inexistente `sa-a\.a\.nada`/);
  assert.match(e, /prefixo ~\/\.sabia\/fluxo/);
});

test("chama: em linha (mesmo dono ou skill do agente), subagente, e recusa quando não é nenhum", () => {
  const ok = fixture({ "fluxo/sa-a/a/a.md": mestre({ fluxo: "a", dono: "sa-um", passos: [{ id: "ini", chama: ["sa-a.a.rev", "sa-b.x"] }, { id: "rev" }] }) });
  assert.deepEqual(validar(carregar(ok)), []);
  fs.rmSync(raiz, { recursive: true, force: true }); fs.mkdirSync(raiz);
  const ruim = fixture({ "fluxo/sa-b/x/x.md": mestre({ fluxo: "x", dono: "sa-dois", quando: ["q"], passos: [{ id: "olhar", chama: "sa-a.a" }] }) });
  assert.match(validar(carregar(ruim)).join("\n"), /chama sa-a\.a \(dono sa-um\), mas sa-dois não tem a skill nem esse subagente/);
});

test("hub com corpo além do H1 é recusado", () => {
  assert.match(validar(carregar(fixture({ "skills/sa-a/SKILL.md": skill("sa-a") + "\nTexto de hub.\n" }))).join("\n"), /corpo além do H1/);
});

test("Kiro: staging com plugin, mcp e README, recriado do zero (skill que saiu some)", () => {
  const fw = fixture();
  const st = path.join(raiz, "kiro");
  compilar(fw, st, { base: "~/.kiro/powers/installed/sabia/skills", raiz: true });
  for (const f of ["plugin.json", "mcp.json", "README.md", "skills/sa-a/SKILL.md"]) assert.ok(fs.existsSync(path.join(st, f)), f);
  fs.rmSync(path.join(fw, "skills/sabia"), { recursive: true });
  compilar(fw, st, { base: "~/.kiro/powers/installed/sabia/skills", raiz: true });
  assert.ok(!fs.existsSync(path.join(st, "skills/sabia")));
});

test("o repo real compila nos dois alvos e todo link da saída resolve", () => {
  assert.deepEqual(validar(carregar(REPO)), []);
  for (const [alvo, base] of [["opencode", BASE], ["kiro", "~/.kiro/powers/installed/sabia/skills"]]) {
    const st = compilar(REPO, path.join(raiz, alvo), { base, raiz: alvo === "kiro", versao: "2.0.0" });
    const s = fs.readFileSync(path.join(st, "skills/sa-codificar/SKILL.md"), "utf8");
    assert.ok(s.includes("## Fluxo codificar") && s.includes(`${base}/sa-codificar/references/codificar/tarefa.md`));
  }
});

test("package.json#files leva todo módulo local que o sabia.mjs importa", () => {
  const pkg = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url), "utf8"));
  const src = fs.readFileSync(new URL("./sabia.mjs", import.meta.url), "utf8");
  for (const [, f] of src.matchAll(/from "\.\/([^"]+)"/g)) assert.ok(pkg.files.includes(f), f);
});
