// node --test   (nesta pasta)
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, test } from "node:test";
import { fileURLToPath } from "node:url";
import { carregar, compilar, grafoAscii, mapear, reescrever, slug, validar, validarToolkitFonte } from "./compilar.mjs";

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
afterEach(() => fs.rmSync(raiz, { recursive: true, force: true }));

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

test("tipos: catálogo validado (sigla, cria, padrão, depois sem ciclo, rubrica) e tipos.md com a ordem de publicação", () => {
  const rub = { "padrao/sa-revisar/rubricas.md": "---\n{\"resumo\": \"r\"}\n---\n| # | V | S |\n|---|---|---|\n| P1 | x | B |\n" };
  const tipos = (t) => ({ "fluxo/tipos.json": { tipos: t }, "skills/sa-prd/SKILL.md": skill("sa-prd"), "skills/sa-prd/references/okf-elm.md": "# OKF\n", ...rub });
  const ok = { GL: { nome: "Termo", cria: ["sa-a.a.ini"], padrao: "sa-a/modelo.md", elm: "DOORS", requisito: true, depois: [] },
    HF: { nome: "História", cria: ["sa-a.a.rev"], elm: "DOORS", requisito: true, depois: ["GL", "XX"], embute: ["GL"], rubrica: ["P1"] },
    XX: { nome: "Novo", cria: ["sa-a.z.q"], padrao: "sa-a/nao.md", elm: "DOORS", requisito: true, rubrica: ["P9"], pendente: true } };
  const st = compilar(fixture(tipos(ok)), path.join(raiz, "st"), { base: BASE });
  const t = out(st, "sabia/references/tipos.md");
  assert.match(t, /`GL` → `HF`\./);
  assert.match(t, /\| `XX` \(pendente\) \|/);
  assert.match(t, /\[`sa-a\/modelo\.md`\]\(~\/\.config\/opencode\/skills\/sa-a\/references\/padrao\/modelo\.md\)/);
  const e = validar(carregar(fixture(tipos({ ...ok, GL: { ...ok.GL, cria: ["sa-a.a"], padrao: "sa-a/nao.md", depois: ["HF"] }, HF: { ...ok.HF, rubrica: ["P2"] } })))).join("\n");
  for (const rx of [/tipo GL: cria sa-a\.a não é passo/, /tipo GL: padrão sa-a\/nao\.md inexistente/, /tipo HF: rubrica P2 fora/, /ciclo no "depois"/]) assert.match(e, rx);
  assert.doesNotMatch(e, /tipo XX/);
  const pr = validar(carregar(fixture(tipos({ ...ok, GL: { ...ok.GL, pendente: true } })))).join("\n");
  assert.match(pr, /tipo GL: cria e padrão já existem; tire o "pendente"/);
  const f = validar(carregar(fixture(tipos({ gl: { cria: ["sa-a.a.ini"], elm: "DOORS" }, ZZ: { nome: "z", elm: "X", cria: [] },
    YY: { nome: "y", elm: "DOORS", cria: ["sa-a.a.ini"], depois: ["QQ"], embute: ["WW"] } })))).join("\n");
  for (const rx of [/tipo gl: sigla de 2 a 4/, /tipo ZZ: elm "X"/, /tipo ZZ: sem cria/, /tipo YY: QQ fora do catálogo/, /tipo YY: WW fora do catálogo/]) assert.match(f, rx);
  const l = validar(carregar(fixture(tipos({ GL: { ...ok.GL, cria: "sa-a.a.ini", depois: "HF" } })))).join("\n");
  assert.match(l, /tipo GL: cria tem de ser lista/);
  assert.match(l, /tipo GL: depois tem de ser lista/);
  assert.doesNotMatch(l, /não é passo|ciclo/);
  assert.deepEqual(validar(carregar(fixture({ "fluxo/tipos.json": {}, ...rub }))).filter((x) => /tipo/.test(x)), []);
  fs.writeFileSync(path.join(raiz, "fw/fluxo/tipos.json"), '{"tipos": {"GL": {"nome": "a", "cria": ["sa-a.a.ini"], "elm": "ETM"}, "GL": {"nome": "b", "cria": ["sa-a.a.ini"], "elm": "ETM"}}}');
  assert.match(validar(carregar(path.join(raiz, "fw"))).join("\n"), /tipo GL: sigla repetida/);
});

test("chama: em linha (mesmo dono ou skill do agente), subagente, e recusa quando não é nenhum", () => {
  const ok = fixture({ "fluxo/sa-a/a/a.md": mestre({ fluxo: "a", dono: "sa-um", passos: [{ id: "ini", chama: ["sa-a.a.rev", "sa-b.x"] }, { id: "rev" }] }) });
  assert.deepEqual(validar(carregar(ok)), []);
  fs.rmSync(raiz, { recursive: true, force: true }); fs.mkdirSync(raiz);
  const ruim = fixture({ "fluxo/sa-b/x/x.md": mestre({ fluxo: "x", dono: "sa-dois", quando: ["q"], passos: [{ id: "olhar", chama: "sa-a.a" }] }) });
  assert.match(validar(carregar(ruim)).join("\n"), /chama sa-a\.a \(dono sa-um\), mas sa-dois não tem a skill nem esse subagente/);
});

const ENTRADA = { id: "entrada", de: "entrada", sprint: "exige", branch: "fatia" };
const VIZ = "# Título\n\nIntro.\n\n## Entrada: vizinhos\n\n- `pronta` com a tarefa aberta → `sa-b.x` (agente `sa-dois`)\n- `bloqueada` aguardando troca → \"fale com o P.O.\" ■\n\n## Regras\n\n- Uma.\n";
const comEntrada = (passos = [ENTRADA, { id: "ini" }, { id: "rev" }], corpo = VIZ, extra = {}) => fixture({
  "fluxo/entrada.md": passo("Entrada comum.", "Pule se chamado."),
  "fluxo/sa-a/a/a.md": mestre({ fluxo: "a", dono: "sa-um", passos }, corpo), ...extra });

test("passo compartilhado: corpo de fluxo/entrada.md, linha do sprint e da branch injetada, na tabela e no grafo; vizinhos no SKILL.md", () => {
  const fw = comEntrada();
  assert.deepEqual(validar(carregar(fw)), []);
  const st = compilar(fw, path.join(raiz, "st"), { base: BASE });
  assert.equal(out(st, "sa-a/references/a/entrada.md").split("\n## Entrada")[0],
    `_Entrada comum._\n\nSprint deste fluxo: \`exige\`. Branch deste fluxo: \`fatia\`. Vizinhos: a seção Entrada: vizinhos do [Fluxo a](${BASE}/sa-a/SKILL.md#fluxo-a).\n`);
  assert.ok(out(st, "sa-a/references/a/entrada.md").includes("Pule se chamado."));
  const s = out(st, "sa-a/SKILL.md");
  assert.match(s, /\| 1 \| `entrada` \| \[entrada\.md\]\(~\/\.config\/opencode\/skills\/sa-a\/references\/a\/entrada\.md\)/);
  assert.ok(s.includes(`### Entrada: vizinhos\n\n- \`pronta\` com a tarefa aberta → [\`sa-b.x\`](${BASE}/sa-b/SKILL.md#fluxo-x)`));
  const g = out(st, "sa-a/references/a/grafo.md");
  assert.match(g, /│ 1 entrada \[exige\] +│──▶ ↪ vizinhos \(diga e pare\): sa-b\.x · ■ bloqueada aguardando troca\n/);
});

test("passo compartilhado: recusa passos/entrada.md, de sem arquivo, sprint fora de exige|nao, branch fora de fatia|nao, id entrada local e falta dos vizinhos", () => {
  const casos = [
    [() => comEntrada(undefined, undefined, { "fluxo/sa-a/a/passos/entrada.md": passo("x") }), /a\.md:2: passo entrada: vem de fluxo\/entrada\.md; apague passos\/entrada\.md/],
    [() => comEntrada([{ ...ENTRADA, de: "nada" }, { id: "ini" }, { id: "rev" }]), /passo entrada: de "nada" sem fluxo\/nada\.md/],
    [() => comEntrada([{ ...ENTRADA, sprint: "puxa" }, { id: "ini" }, { id: "rev" }]), /passo entrada: sprint "puxa" \(use exige ou nao\)/],
    [() => comEntrada([{ ...ENTRADA, branch: undefined }, { id: "ini" }, { id: "rev" }]), /passo entrada: branch "" \(use fatia ou nao\)/],
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
    ["- `pronta` → `sa-b.x`", /a\.md:8: vizinho → sa-b\.x: dono sa-dois é outro agente → acrescente "\(agente `sa-dois`\)" na linha/],
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

const errosRepo = validar(carregar(REPO));

test("o repo real valida", () => {
  assert.deepEqual(errosRepo, []);
});

test("o repo real compila nos dois alvos e todo link da saída resolve", () => {
  for (const [alvo, base] of [["opencode", BASE], ["kiro", "~/.kiro/powers/installed/sabia/skills"]]) {
    const st = compilar(REPO, path.join(raiz, alvo), { base, raiz: alvo === "kiro", versao: "2.0.0" });
    const s = fs.readFileSync(path.join(st, "skills/sa-codificar/SKILL.md"), "utf8");
    assert.ok(s.includes("## Fluxo codificar") && s.includes(`${base}/sa-codificar/references/codificar/tarefa.md`));
  }
});

test("desvio por tipo no repo: o passo que cria um tipo desviável tem ⇢ e os tipos, sem \"desvio\": true", () => {
  const m = carregar(REPO), x = m.fluxos["sa-prd.prd"].passos.find((p) => p.id === "escrever");
  assert.ok(!x.desvio);
  assert.deepEqual(x.tipos, ["HF", "REG", "EL", "ET", "CT"]);
  assert.match(grafoAscii(m.fluxos["sa-prd.prd"]), /│ 4 escrever ⇢ +│──▶ ⇢ por tipo: HF, REG, EL, ET, CT\n/);
  assert.ok(!m.fluxos["sa-prd.prd"].passos.some((p) => p.id === "similares" && p.tipos));
  // a [ESP] FT desvia os mesmos tipos do PRD fora a ET (o GL segue do Sabiá)
  const f = m.fluxos["sa-especificar.fatia"].passos.find((p) => p.id === "escrever");
  assert.deepEqual(f.tipos, ["HF", "REG", "EL", "CT"]);
  assert.match(grafoAscii(m.fluxos["sa-especificar.fatia"]), /│ 5 escrever ⇢ +│──▶ ⇢ por tipo: HF, REG, EL, CT\n/);
  // só os passos de "desviavel" do catálogo: a ET as-built do PR e o CT.csv da verificação ficam do Sabiá; a ET inicial
  // e o CT planejado desviam no PRD, e a ET as-built também na consolidação
  for (const [q, id] of [["sa-codificar.codificar", "pr"], ["sa-verificar.verificar", "casos"]]) {
    assert.ok(!m.fluxos[q].passos.find((p) => p.id === id).tipos, `${q}.${id}`);
    assert.doesNotMatch(grafoAscii(m.fluxos[q]), new RegExp(`\\d ${id} ⇢|por tipo`), `${q}.${id}`);
  }
  assert.deepEqual(m.fluxos["sa-consolidar.consolidar"].passos.find((p) => p.id === "elm").tipos, ["ET"]);
  assert.match(grafoAscii(m.fluxos["sa-consolidar.consolidar"]), /│ 3 elm ⇢ +│──▶ ⇢ por tipo: ET\n/);
  assert.deepEqual(m.tipos.CT.cria, ["sa-prd.prd.escrever", "sa-verificar.verificar.casos", "sa-especificar.fatia.escrever"]);
  // a [ESP] publica a regra que aprova (passo publicar, sem criar tipo): a consolidação não escreve REG
  assert.deepEqual(m.tipos.REG.cria, ["sa-prd.prd.escrever", "sa-especificar.fatia.escrever"]);
});

test("motor × tarefa no repo: o hitl entra, assume e chama o motor; o motor não tem entrada nem tarefa", () => {
  const m = carregar(REPO);
  for (const s of ["sa-revisar", "sa-verificar"]) {
    const motor = m.fluxos[`${s}.${s.slice(3)}`], hitl = m.fluxos[`${s}.hitl`];
    assert.ok(!motor.passos.some((p) => p.de || p.id === "assumir"), s);
    assert.deepEqual(hitl.passos.slice(0, 2).map((p) => p.id), ["entrada", "assumir"], s);
    assert.ok(hitl.passos.some((p) => p.chama === `${s}.${s.slice(3)}`), s);
  }
});

test("catálogo: desviavel fora de cria é recusado", () => {
  const m = carregar(REPO);
  m.tipos = { ...m.tipos, HF: { ...m.tipos.HF, desviavel: ["sa-codificar.codificar.pr"] } };
  assert.ok(validar(m).some((e) => /tipo HF: desviavel sa-codificar\.codificar\.pr fora de cria/.test(e)));
});

/** O toolkit sintético "casa": a skill casa, com o fluxo e o padrão do tipo HF como arquivos da pasta (o Sabiá não os compila). */
function casa(mudar = {}) {
  const hf = { skill: "skills/casa/SKILL.md", fluxo: "fluxo/fluxo-hf.md", padrao: "padrao/padrao-hf.md" };
  return escrever(path.join(raiz, "casa"), {
    "toolkit.json": { nome: "casa", versao: "1.0.0", descricao: "toolkit fictício", autor: { nome: "Ana Exemplo", area: "Equipe Alfa" },
      "tipos-de-projeto": ["backend"], skills: [{ caminho: "skills/casa/SKILL.md", papeis: ["especificador"] }], tipos: { HF: hf, ATA: { skill: hf.skill, fluxo: hf.fluxo } },
      rubricas: [{ id: "EX1", tipo: "HF", verificacao: "Toda HF cita o campo de origem", severidade: "IMPORTANTE" }], requer: { sabia: "2.0.0" }, ...mudar },
    "skills/casa/SKILL.md": skill("casa", "# casa"), "fluxo/fluxo-hf.md": "# Fluxo HF\n", "padrao/padrao-hf.md": "# Padrão HF\n",
  });
}

test("toolkit: tipo → skill do toolkit com fluxo e padrão da pasta; recusa tipo fora, não desviável, pendente, forma \"<tk>.<fluxo>\", rubrica e requer", () => {
  const erros = (mudar, fw = REPO) => { const r = validarToolkitFonte(fw, casa(mudar)).join("\n"); fs.rmSync(path.join(raiz, "casa"), { recursive: true }); return r; };
  const hf = { skill: "skills/casa/SKILL.md", fluxo: "fluxo/fluxo-hf.md" };
  assert.equal(erros({}), "");
  const e = erros({ tipos: { GL: hf, XX: hf, REG: "casa.reg" }, rubricas: [{ id: "P2", verificacao: "repete a do Sabiá", severidade: "BLOQUEANTE" }], requer: { sabia: "9.0.0" } });
  for (const rx of [/tipo GL: não é desviável/, /tipo XX: fora do catálogo/, /tipo REG: use \{"skill", "fluxo", "padrao"\}/, /rubrica P2: repetida ou já do Sabiá/, /requer o Sabiá 9\.0\.0/]) assert.match(e, rx);
  assert.match(erros({ tipos: { HF: { ...hf, skill: "skills/outra/SKILL.md" } } }), /tipo HF: a skill skills\/outra\/SKILL\.md não está em skills/);
  assert.match(erros({ tipos: { HF: { ...hf, fluxo: "fluxo/nao.md" } } }), /tipo HF: falta o fluxo fluxo\/nao\.md na pasta do toolkit/);
  assert.match(erros({ tipos: { HF: { ...hf, padrao: "../fora.md" } } }), /tipo HF: falta o padrao \.\.\/fora\.md na pasta do toolkit/);
  // pasta no lugar do arquivo e caminho absoluto: recusados como no gerador
  assert.match(erros({ tipos: { HF: { ...hf, fluxo: "fluxo" } } }), /tipo HF: falta o fluxo fluxo na pasta do toolkit/);
  assert.match(erros({ tipos: { HF: { ...hf, fluxo: "/fluxo/fluxo-hf.md" } } }), /tipo HF: falta o fluxo \/fluxo\/fluxo-hf\.md na pasta do toolkit/);
  // só a skill, com as references dentro: aceito
  assert.equal(erros({ tipos: { HF: { skill: hf.skill } } }), "");
  // a skill do tipo traz em papeis o dono de cada passo de desvio: a ET desvia no PRD (especificador) e na consolidação (produto)
  assert.match(erros({ tipos: { ET: { skill: hf.skill } } }), /tipo ET: a skill skills\/casa\/SKILL\.md não traz o papel produto em papeis \(dono do passo de desvio sa-consolidar\.consolidar\.elm\)/);
  assert.doesNotMatch(erros({ tipos: { ET: { skill: hf.skill } } }), /papel especificador/);
  assert.equal(erros({ tipos: { ET: { skill: hf.skill } }, skills: [{ caminho: hf.skill, papeis: ["especificador", "produto"] }] }), "");
  assert.match(erros({ skills: [{ caminho: hf.skill, papeis: ["produto"] }] }), /tipo HF: .*papel especificador.*\n.*tipo ATA: .*papel especificador/);
  // o CT planejado desvia no PRD
  assert.equal(erros({ tipos: { CT: { skill: hf.skill } } }), "");
  // tipo desviável ainda pendente no Sabiá instalado
  const fw = escrever(path.join(raiz, "fw-pend"), { "fluxo/tipos.json": { tipos: { HF: { desviavel: ["sa-prd.prd.escrever"], pendente: true } } } });
  assert.match(erros({ tipos: { HF: hf }, rubricas: [] }, fw), /tipo HF: pendente no Sabiá instalado/);
  const r = erros({ rubricas: [{ id: "EX1", tipo: "HF" }, { id: "ex2", verificacao: "v", severidade: "ALTA" }] });
  for (const rx of [/rubrica EX1: sem verificacao/, /rubrica EX1: severidade ""/, /rubrica ex2: id como EX1/, /rubrica ex2: severidade "ALTA"/]) assert.match(r, rx);
});

test("package.json#files leva todo módulo local que o sabia.mjs importa", () => {
  const pkg = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url), "utf8"));
  const src = fs.readFileSync(new URL("./sabia.mjs", import.meta.url), "utf8");
  for (const [, f] of src.matchAll(/from "\.\/([^"]+)"/g)) assert.ok(pkg.files.includes(f), f);
});
