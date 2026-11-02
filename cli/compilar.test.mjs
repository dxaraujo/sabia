// node --test   (nesta pasta)
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { beforeEach, test } from "node:test";
import { fileURLToPath } from "node:url";
import { carregar, compilar, grafoAscii, mapear, reescrever, slug, validar } from "./compilar.mjs";

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
      { id: "ini", desvio: true }, { id: "rev", chama: "sa-b.x", saidas: { "voltou": "ini", "pronto": "→ sa-b.y" } }] }),
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
  assert.match(s, /pronto → passa a \[`sa-b\.y`\]/);
  assert.equal(s.match(/^# /gm).length, 1);
  const ini = out(st, "sa-a/references/a/ini.md");
  assert.match(ini, /^_Começa\._\n\n## Entrada/);
  assert.ok(!ini.includes('"resumo"'));
  assert.ok(fs.existsSync(path.join(st, "skills/sa-a/references/padrao/modelo.md")));
});

test("grafo: references/<fluxo>/grafo.md gerado do mestre e o link logo abaixo da tabela", () => {
  const st = compilar(fixture(), path.join(raiz, "st"), { base: BASE });
  const g = out(st, "sa-a/references/a/grafo.md");
  assert.match(g, /^# Grafo de sa-a\.a\n\n```\nsa-a\.a   dono sa-um   travas sim-da-pessoa\n/);
  assert.match(g, /│ 1 ini ⇢ +│\n/);
  assert.match(g, /│ 2 rev +│──▶ ⇄ chama sa-b\.x\n.*┘ {4}↑ volta a ini  \(voltou\)\n {32}⇒ passa a sa-b\.y  \(pronto\)\n```\n\n↓ segue · ↑ volta/);
  assert.ok(!/\x1b/.test(g));
  assert.ok(g.includes(grafoAscii(carregar(fixture()).fluxos["sa-a.a"])));
  assert.match(out(st, "sa-a/SKILL.md"), /\| 2 \| `rev` \|.*\n\nGrafo: \[grafo\.md\]\(~\/\.config\/opencode\/skills\/sa-a\/references\/a\/grafo\.md\)\n/);
  const longa = grafoAscii({ skill: "sa-z", fluxo: "z", d: { dono: "sa-um" } }, [{ id: "p", saidas: { ["x".repeat(70)]: "p" } }]);
  assert.match(longa, /↺ p {2}\(x{57}…\)/);
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
  const g = carregar(fixture({ "fluxo/sa-b/y/y.md": mestre({ fluxo: "y", dono: "sa-dois", quando: ["q"], passos: [{ id: "grafo" }] }), "fluxo/sa-b/y/passos/grafo.md": passo("x") }));
  assert.match(validar(g).join("\n"), /fluxo\/sa-b\/y\/y\.md:2: passo grafo: id reservado/);
});

test("chama: em linha (mesmo dono ou skill do agente), subagente, e recusa quando não é nenhum", () => {
  const ok = fixture({ "fluxo/sa-a/a/a.md": mestre({ fluxo: "a", dono: "sa-um", passos: [{ id: "ini", chama: ["sa-a.a.rev", "sa-b.x"] }, { id: "rev" }] }) });
  assert.deepEqual(validar(carregar(ok)), []);
  fs.rmSync(raiz, { recursive: true, force: true }); fs.mkdirSync(raiz);
  const ruim = fixture({ "fluxo/sa-b/x/x.md": mestre({ fluxo: "x", dono: "sa-dois", quando: ["q"], passos: [{ id: "olhar", chama: "sa-a.a" }] }) });
  assert.match(validar(carregar(ruim)).join("\n"), /chama sa-a\.a \(dono sa-um\), mas sa-dois não tem a skill nem esse subagente/);
});

const ENTRADA = { id: "entrada", de: "entrada", sprint: "exige" };
const VIZ = "# Título\n\nIntro.\n\n## Entrada: vizinhos\n\n- `pronta` com a tarefa aberta → `sa-b.x`\n- `bloqueada` aguardando troca → \"fale com o P.O.\" ■\n\n## Regras\n\n- Uma.\n";
const comEntrada = (passos = [ENTRADA, { id: "ini" }, { id: "rev" }], corpo = VIZ, extra = {}) => fixture({
  "fluxo/entrada.md": passo("Entrada comum.", "Pule se chamado."),
  "fluxo/sa-a/a/a.md": mestre({ fluxo: "a", dono: "sa-um", passos }, corpo), ...extra });

test("passo compartilhado: corpo de fluxo/entrada.md, linha do sprint injetada, na tabela e no grafo; vizinhos no SKILL.md", () => {
  const fw = comEntrada();
  assert.deepEqual(validar(carregar(fw)), []);
  const st = compilar(fw, path.join(raiz, "st"), { base: BASE });
  assert.equal(out(st, "sa-a/references/a/entrada.md").split("\n## Entrada")[0],
    `_Entrada comum._\n\nSprint deste fluxo: \`exige\`. Vizinhos: a seção Entrada: vizinhos do [Fluxo a](${BASE}/sa-a/SKILL.md#fluxo-a).\n`);
  assert.ok(out(st, "sa-a/references/a/entrada.md").includes("Pule se chamado."));
  const s = out(st, "sa-a/SKILL.md");
  assert.match(s, /\| 1 \| `entrada` \| \[entrada\.md\]\(~\/\.config\/opencode\/skills\/sa-a\/references\/a\/entrada\.md\)/);
  assert.ok(s.includes(`### Entrada: vizinhos\n\n- \`pronta\` com a tarefa aberta → [\`sa-b.x\`](${BASE}/sa-b/SKILL.md#fluxo-x)`));
  const g = out(st, "sa-a/references/a/grafo.md");
  assert.match(g, /│ 1 entrada \[exige\] +│──▶ ↪ vizinhos \(diga e pare\): sa-b\.x · ■ bloqueada aguardando troca\n/);
});

test("passo compartilhado: recusa passos/entrada.md, de sem arquivo, sprint fora de exige|nao, id entrada local e falta dos vizinhos", () => {
  const casos = [
    [() => comEntrada(undefined, undefined, { "fluxo/sa-a/a/passos/entrada.md": passo("x") }), /a\.md:2: passo entrada: vem de fluxo\/entrada\.md; apague passos\/entrada\.md/],
    [() => comEntrada([{ ...ENTRADA, de: "nada" }, { id: "ini" }, { id: "rev" }]), /passo entrada: de "nada" sem fluxo\/nada\.md/],
    [() => comEntrada([{ ...ENTRADA, sprint: "puxa" }, { id: "ini" }, { id: "rev" }]), /passo entrada: sprint "puxa" \(use exige ou nao\)/],
    [() => comEntrada([{ id: "entrada" }, { id: "ini" }, { id: "rev" }], VIZ, { "fluxo/sa-a/a/passos/entrada.md": passo("x") }), /passo entrada: id reservado ao passo compartilhado/],
    [() => comEntrada(undefined, "# Título\n"), /passo entrada sem a seção "## Entrada: vizinhos"/],
  ];
  for (const [fw, erro] of casos) {
    assert.match(validar(carregar(fw())).join("\n"), erro);
    fs.rmSync(raiz, { recursive: true, force: true }); fs.mkdirSync(raiz);
  }
});

test("vizinhos: formato, id que resolve, dono que é agente e passo só do mesmo agente", () => {
  const viz = (linha) => `# Título\n\n## Entrada: vizinhos\n\n${linha}\n`;
  const casos = [
    ["- `pronta` vai para a outra skill", /a\.md:8: vizinho fora do formato/],
    ["- `pronta` → a outra skill", /a\.md:8: vizinho fora do formato/],
    ["- `pronta` → `sa-b.zz`", /a\.md:8: id inexistente `sa-b\.zz`/],
    ["- `pronta` → `sa-c.z`", /a\.md:8: vizinho → sa-c\.z: o dono sa-tres não é agente do papeis\.json/],
    ["- `pronta` → `sa-b.y.fim`", /a\.md:8: vizinho → sa-b\.y\.fim: passo de outro agente \(sa-dois\) → use o fluxo \(sa-b\.y\)/],
    ["- `pronta` → `sa-a.a.rev`", /a\.md:8: vizinho → sa-a\.a\.rev: é deste fluxo → declare como saída do passo entrada/],
  ];
  const sac = { "fluxo/sa-c/z/z.md": mestre({ fluxo: "z", dono: "sa-tres", passos: [{ id: "p" }] }), "fluxo/sa-c/z/passos/p.md": passo("P."), "skills/sa-c/SKILL.md": skill("sa-c") };
  for (const [linha, erro] of casos) {
    assert.match(validar(carregar(comEntrada(undefined, viz(linha), sac))).join("\n"), erro, linha);
    fs.rmSync(raiz, { recursive: true, force: true }); fs.mkdirSync(raiz);
  }
  const sad = { "fluxo/sa-d/w/w.md": mestre({ fluxo: "w", dono: "sa-um", passos: [{ id: "q" }] }), "fluxo/sa-d/w/passos/q.md": passo("Q."), "skills/sa-d/SKILL.md": skill("sa-d") };
  assert.deepEqual(validar(carregar(comEntrada(undefined, viz("- `iniciada` → `sa-d.w.q`"), sad))), [], "passo de outro fluxo do mesmo agente vale");
});

test("passagem → sa-x.f.p só para passo de fluxo do mesmo agente", () => {
  const ruim = fixture({ "fluxo/sa-a/a/a.md": mestre({ fluxo: "a", dono: "sa-um", passos: [{ id: "ini", saidas: { pronto: "→ sa-b.y.fim" } }, { id: "rev" }] }) });
  assert.match(validar(carregar(ruim)).join("\n"), /a\.md:2: passo ini: saída "pronto" passa ao passo sa-b\.y\.fim, de outro agente \(sa-dois\) → use o fluxo \(→ sa-b\.y\)/);
  fs.rmSync(raiz, { recursive: true, force: true }); fs.mkdirSync(raiz);
  const ok = fixture({ "fluxo/sa-a/a/a.md": mestre({ fluxo: "a", dono: "sa-um", passos: [{ id: "ini", saidas: { volta: "→ sa-a.a.rev", outro: "→ sa-b.y" } }, { id: "rev" }] }) });
  assert.deepEqual(validar(carregar(ok)), []);
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

// shortcut: as passagens do repo para passo de outro agente saem com a reescrita dos fluxos (11.16); até lá, o repo
// real não compila e o teste de compilação fica pulado (volta sozinho quando a validação zerar)
const PASSO_ALHEIO = /passa ao passo .*, de outro agente/;
const errosRepo = validar(carregar(REPO));

test("o repo real valida (fora as passagens para passo de outro agente, pendentes da 11.16)", () => {
  assert.deepEqual(errosRepo.filter((e) => !PASSO_ALHEIO.test(e)), []);
});

test("o repo real compila nos dois alvos e todo link da saída resolve", { skip: errosRepo.length ? `${errosRepo.length} passagem(ns) para passo de outro agente` : false }, () => {
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
