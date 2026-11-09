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

/** Um framework mínimo: sa-a (1 fluxo, 2 passos, template), sa-b (2 fluxos), sabia (sem fluxo). */
function fixture(extra = {}) {
  return escrever(path.join(raiz, "fw"), {
    "plugin.json": { name: "sabia", version: "2.0.0" },
    "mcp.json": { mcpServers: {} },
    "README.md": "# Sabiá\n",
    "skills/sa-setup/assets/agents/perfis.json": { agentes: {
      "sa-um": { skills: ["sa-a"], subagentes: ["sa-dois"] }, "sa-dois": { skills: ["sa-b"] } } },
    "skills/sa-setup/SKILL.md": "---\nname: sa-setup\n---\n# sa-setup\n",
    "skills/sa-a/SKILL.md": skill("sa-a"),
    "skills/sa-a/references/proc.md": "# Proc\n\nVeja [b](../../sa-b/SKILL.md) e [fim](#proc).\n",
    "skills/sa-b/SKILL.md": skill("sa-b"),
    "skills/sabia/SKILL.md": "---\nname: sabia\nmetadata:\n  version: \"1.0.0\"\n---\n# Sabiá\n\nSem fluxo: [proc](../sa-a/references/proc.md).\n",
    "fluxo/travas.json": { travas: { "sim-da-pessoa": { texto: "só com sim", liberavel_por: [] } } },
    "fluxo/sa-a/a/a.md": mestre({ fluxo: "a", dono: "sa-um", travas_gerais: ["sim-da-pessoa"], passos: [
      { id: "ini", desvio: true }, { id: "rev", chama: "sa-b.x", saidas: { "voltou": "ini", "pronto": "→ sa-b.y" } }] }),
    "fluxo/sa-a/a/passos/ini.md": passo("Começa.", "Use o template `sa-a/modelo.md` e o passo `rev`; veja `sa-b.y.fim` e [proc](~/.sabia/framework/skills/sa-a/references/proc.md)."),
    "fluxo/sa-a/a/passos/rev.md": passo("Revisa."),
    "fluxo/sa-a/regras.md": "---\n{\"resumo\": \"comuns\"}\n---\n# Regras comuns\n\n- Sempre teste.\n",
    "template/sa-a/modelo.md": "---\n{\"resumo\": \"Um modelo.\"}\n---\n# Modelo\n",
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
  assert.ok(fs.existsSync(path.join(st, "skills/sa-a/references/template/modelo.md")));
});

test("grafo: references/<fluxo>/grafo.md gerado da definição do fluxo e o link logo abaixo da tabela", () => {
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

test("reescrita: link do framework, relativo, âncora local, id e template viram caminho absoluto do alvo", () => {
  const st = compilar(fixture(), path.join(raiz, "st"), { base: BASE });
  const ini = out(st, "sa-a/references/a/ini.md");
  assert.ok(ini.includes(`o template [\`sa-a/modelo.md\`](${BASE}/sa-a/references/template/modelo.md)`));
  assert.ok(ini.includes(`[\`sa-b.y.fim\`](${BASE}/sa-b/references/y/fim.md)`));
  assert.ok(ini.includes(`[proc](${BASE}/sa-a/references/proc.md)`));
  assert.ok(ini.includes("o passo `rev`"), "passo do mesmo fluxo fica texto");
  const proc = out(st, "sa-a/references/proc.md");
  assert.ok(proc.includes(`[b](${BASE}/sa-b/SKILL.md)`) && proc.includes(`[fim](${BASE}/sa-a/references/proc.md#proc)`));
  assert.ok(out(st, "sabia/SKILL.md").includes(`[proc](${BASE}/sa-a/references/proc.md)`));
  assert.equal(mapear("/fw", "/fw/fluxo/sa-a/a/passos/ini.md"), "sa-a/references/a/ini.md");
  assert.equal(mapear("/fw", "/fw/template/sa-a/m.md"), "sa-a/references/template/m.md");
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

test("tipos: catálogo validado (sigla, cria, template, elm, depois sem ciclo) e tipos.md com a ordem de publicação", () => {
  const tipos = (t) => ({ "fluxo/tipos.json": { tipos: t } });
  const ok = { GL: { nome: "Termo", cria: ["sa-a.a.ini"], template: "sa-a/modelo.md", elm: "DOORS", requisito: true, depois: [] },
    HF: { nome: "História", cria: ["sa-a.a.rev"], elm: "DOORS", requisito: true, depois: ["GL", "XX"], embute: ["GL"] },
    CT: { nome: "Caso", cria: ["sa-a.a.rev"], elm: null, requisito: false },
    XX: { nome: "Novo", cria: ["sa-a.z.q"], template: "sa-a/nao.md", elm: "DOORS", requisito: true, pendente: true } };
  const st = compilar(fixture(tipos(ok)), path.join(raiz, "st"), { base: BASE });
  const t = out(st, "sabia/references/tipos.md");
  assert.match(t, /`GL` → `HF`\./);
  assert.match(t, /\| `XX` \(pendente\) \|/);
  assert.match(t, /\[`sa-a\/modelo\.md`\]\(~\/\.config\/opencode\/skills\/sa-a\/references\/template\/modelo\.md\)/);
  assert.match(t, /^\| `CT` \| Caso \| .* \| — \| não \|/m);
  assert.doesNotMatch(t, /Critérios? de revisão/);
  const e = validar(carregar(fixture(tipos({ ...ok, GL: { ...ok.GL, cria: ["sa-a.a"], template: "sa-a/nao.md", depois: ["HF"] } })))).join("\n");
  for (const rx of [/tipo GL: cria sa-a\.a não é passo/, /tipo GL: template sa-a\/nao\.md inexistente/, /ciclo no "depois"/]) assert.match(e, rx);
  assert.doesNotMatch(e, /tipo CT/);
  assert.doesNotMatch(e, /tipo XX/);
  const pr = validar(carregar(fixture(tipos({ ...ok, GL: { ...ok.GL, pendente: true } })))).join("\n");
  assert.match(pr, /tipo GL: cria e template já existem; tire o "pendente"/);
  const f = validar(carregar(fixture(tipos({ gl: { cria: ["sa-a.a.ini"], elm: "DOORS" }, ZZ: { nome: "z", elm: "X", cria: [] },
    YY: { nome: "y", elm: "DOORS", cria: ["sa-a.a.ini"], depois: ["QQ"], embute: ["WW"] } })))).join("\n");
  for (const rx of [/tipo gl: sigla de 2 a 4/, /tipo ZZ: elm "X" \(use DOORS ou null\)/, /tipo ZZ: sem cria/, /tipo YY: QQ fora do catálogo/, /tipo YY: WW fora do catálogo/]) assert.match(f, rx);
  const l = validar(carregar(fixture(tipos({ GL: { ...ok.GL, cria: "sa-a.a.ini", depois: "HF" } })))).join("\n");
  assert.match(l, /tipo GL: cria tem de ser lista/);
  assert.match(l, /tipo GL: depois tem de ser lista/);
  assert.doesNotMatch(l, /não é passo|ciclo/);
  assert.deepEqual(validar(carregar(fixture({ "fluxo/tipos.json": {} }))).filter((x) => /tipo/.test(x)), []);
  fs.writeFileSync(path.join(raiz, "fw/fluxo/tipos.json"), '{"tipos": {"GL": {"nome": "a", "cria": ["sa-a.a.ini"], "elm": "DOORS"}, "GL": {"nome": "b", "cria": ["sa-a.a.ini"], "elm": "DOORS"}}}');
  assert.match(validar(carregar(path.join(raiz, "fw"))).join("\n"), /tipo GL: sigla repetida/);
});

test("chama: em linha (mesmo dono ou skill do agente), subagente, e recusa quando não é nenhum", () => {
  const ok = fixture({ "fluxo/sa-a/a/a.md": mestre({ fluxo: "a", dono: "sa-um", passos: [{ id: "ini", chama: ["sa-a.a.rev", "sa-b.x"] }, { id: "rev" }] }) });
  assert.deepEqual(validar(carregar(ok)), []);
  fs.rmSync(raiz, { recursive: true, force: true }); fs.mkdirSync(raiz);
  const ruim = fixture({ "fluxo/sa-b/x/x.md": mestre({ fluxo: "x", dono: "sa-dois", quando: ["q"], passos: [{ id: "olhar", chama: "sa-a.a" }] }) });
  assert.match(validar(carregar(ruim)).join("\n"), /chama sa-a\.a \(dono sa-um\), mas sa-dois não tem a skill nem esse subagente/);
});

test("dono: só agente do perfis.json", () => {
  const ruim = fixture({ "fluxo/sa-b/x/x.md": mestre({ fluxo: "x", dono: "sa-outro", quando: ["q"], passos: [{ id: "olhar" }] }) });
  assert.match(validar(carregar(ruim)).join("\n"), /x\.md:2: dono sa-outro não é agente do perfis\.json \(sa-um, sa-dois\)/);
});

const ENTRADA = { id: "entrada", de: "entrada", papel: "desenvolvedor", branch: "fatia" };
const VIZ = "# Título\n\nIntro.\n\n## Entrada: vizinhos\n\n- `pronta` com a tarefa aberta → `sa-b.x` (agente `sa-dois`)\n- `bloqueada` aguardando troca → \"fale com o P.O.\" ■\n\n## Regras\n\n- Uma.\n";
const comEntrada = (passos = [ENTRADA, { id: "ini" }, { id: "rev" }], corpo = VIZ, extra = {}) => fixture({
  "fluxo/entrada.md": passo("Entrada comum.", "Pule se chamado."),
  "fluxo/sa-a/a/a.md": mestre({ fluxo: "a", dono: "sa-um", passos }, corpo), ...extra });

test("passo compartilhado: corpo de fluxo/entrada.md, linha do papel e da branch injetada, na tabela e no grafo; vizinhos no SKILL.md", () => {
  const fw = comEntrada();
  assert.deepEqual(validar(carregar(fw)), []);
  const st = compilar(fw, path.join(raiz, "st"), { base: BASE });
  assert.equal(out(st, "sa-a/references/a/entrada.md").split("\n## Entrada")[0],
    `_Entrada comum._\n\nPapel deste fluxo: \`desenvolvedor\`. Branch deste fluxo: \`fatia\`. Vizinhos: a seção Entrada: vizinhos do [Fluxo a](${BASE}/sa-a/SKILL.md#fluxo-a).\n`);
  assert.ok(out(st, "sa-a/references/a/entrada.md").includes("Pule se chamado."));
  const s = out(st, "sa-a/SKILL.md");
  assert.match(s, /\| 1 \| `entrada` \| \[entrada\.md\]\(~\/\.config\/opencode\/skills\/sa-a\/references\/a\/entrada\.md\)/);
  assert.ok(s.includes(`### Entrada: vizinhos\n\n- \`pronta\` com a tarefa aberta → [\`sa-b.x\`](${BASE}/sa-b/SKILL.md#fluxo-x)`));
  const g = out(st, "sa-a/references/a/grafo.md");
  assert.match(g, /│ 1 entrada \[desenvolvedor\] +│──▶ ↪ vizinhos \(diga e pare\): sa-b\.x · ■ bloqueada aguardando troca\n/);
});

test("passo compartilhado além da entrada (cadastro, commit-na-branch-base): só o arquivo comum, sem papel, branch nem vizinhos", () => {
  const fw = fixture({ "fluxo/cadastro.md": passo("Cadastro comum."),
    "fluxo/sa-a/a/a.md": mestre({ fluxo: "a", dono: "sa-um", passos: [{ id: "ini" }, { id: "cadastrar", de: "cadastro" }, { id: "rev" }] }) });
  assert.deepEqual(validar(carregar(fw)), []);
  const st = compilar(fw, path.join(raiz, "st"), { base: BASE });
  assert.match(out(st, "sa-a/references/a/cadastrar.md"), /^_Cadastro comum\._\n\n## Entrada/);
  assert.match(out(st, "sa-a/references/a/grafo.md"), /│ 2 cadastrar +│\n/);
});

test("passo compartilhado: recusa passos/entrada.md, de sem arquivo, papel fora do catálogo, campo sprint, branch fora de fatia|nao, id entrada local e falta dos vizinhos", () => {
  const casos = [
    [() => comEntrada(undefined, undefined, { "fluxo/sa-a/a/passos/entrada.md": passo("x") }), /a\.md:2: passo entrada: vem de fluxo\/entrada\.md; apague passos\/entrada\.md/],
    [() => comEntrada([{ ...ENTRADA, de: "nada" }, { id: "ini" }, { id: "rev" }]), /passo entrada: de "nada" sem fluxo\/nada\.md/],
    [() => comEntrada([{ ...ENTRADA, papel: "senior" }, { id: "ini" }, { id: "rev" }]), /passo entrada: papel "senior" \(use desenvolvedor, especificador, produto, nenhuma\)/],
    [() => comEntrada([{ ...ENTRADA, sprint: "exige" }, { id: "ini" }, { id: "rev" }]), /passo entrada: o campo sprint não existe/],
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
    ["- `pronta` → `sa-c.z`", /a\.md:8: vizinho → sa-c\.z: o dono sa-tres não é agente do perfis\.json/],
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
    const st = compilar(REPO, path.join(raiz, alvo), { base, raiz: alvo === "kiro", versao: "2.1.0" });
    const s = fs.readFileSync(path.join(st, "skills/sa-desenvolver/SKILL.md"), "utf8");
    assert.ok(s.includes("## Fluxo codificar") && s.includes(`${base}/sa-desenvolver/references/codificar/tarefa.md`));
    // o sa-desenvolvedor tem a skill sa-revisar, mas o fluxo revisar é do subagente sa-revisor
    assert.ok(s.includes("(sa-revisor, subagente)") && s.includes("(sa-verificador, subagente)"));
  }
});

test("desvio no repo: a tarefa da codificação por para e arquivos; HF, UC, REG, MSG, EL, RF e RNF no PRD e em elm/; ATA na reunião; ET no as-built; CT no CT.csv", () => {
  const m = carregar(REPO), p = (q) => { const [s, f, id] = q.split("."); return m.fluxos[`${s}.${f}`].passos.find((x) => x.id === id); };
  assert.equal(p("sa-desenvolver.codificar.tarefa").desvio, true);
  for (const q of ["sa-prd.prd.escrever", "sa-especificar.elm.editar"]) {
    assert.ok(!p(q).desvio, q);
    assert.deepEqual(p(q).tipos, ["HF", "UC", "REG", "MSG", "EL", "RF", "RNF"], q);
  }
  assert.deepEqual(p("sa-especificar.reuniao.escrever").tipos, ["ATA"]);
  assert.deepEqual(p("sa-desenvolver.codificar.as-built").tipos, ["ET"]);
  assert.deepEqual(p("sa-verificar.verificar.casos").tipos, ["CT"]);
  assert.ok(!p("sa-refinar.detalhar.cenarios").tipos);
  assert.match(grafoAscii(m.fluxos["sa-prd.prd"]), /│ \d+ escrever ⇢ +│──▶ ⇢ por tipo: HF, UC, REG, MSG, EL, RF, RNF\n/);
});

test("catálogo: desviavel fora de cria é recusado", () => {
  const m = carregar(REPO);
  m.tipos = { ...m.tipos, HF: { ...m.tipos.HF, desviavel: ["sa-verificar.verificar.casos"] } };
  assert.ok(validar(m).some((e) => /tipo HF: desviavel sa-verificar\.verificar\.casos fora de cria/.test(e)));
});

/** O toolkit sintético "casa": a skill casa, com o fluxo e o template do tipo HF como arquivos da pasta (o Sabiá não os compila). */
function casa(mudar = {}) {
  const hf = { skill: "skills/casa/SKILL.md", fluxo: "fluxo/fluxo-hf.md", template: "template/template-hf.md" };
  return escrever(path.join(raiz, "casa"), {
    "toolkit.json": { nome: "casa", versao: "1.0.0", descricao: "toolkit fictício", autor: { nome: "Ana Exemplo", area: "Equipe Alfa" },
      "tipos-de-projeto": ["backend"], skills: [{ caminho: "skills/casa/SKILL.md", papeis: ["especificador"] }], tipos: { HF: hf, ATA: { skill: hf.skill, fluxo: hf.fluxo } },
      criterios_revisao: [{ id: "EX1", tipo: "HF", verificacao: "Toda HF cita o campo de origem", severidade: "IMPORTANTE" }], requer: { sabia: "2.1.0" }, ...mudar },
    "skills/casa/SKILL.md": skill("casa", "# casa"), "fluxo/fluxo-hf.md": "# Fluxo HF\n", "template/template-hf.md": "# Padrão HF\n",
  });
}

/** Um framework mínimo com os agentes do Sabiá: HF e ATA desviam em passos do sa-especificador, ET no do sa-desenvolvedor. */
function fwToolkit() {
  const tipo = (cria, desviavel = cria) => ({ nome: "x", cria, elm: "DOORS", requisito: true, desviavel });
  return escrever(path.join(raiz, "fw-tk"), {
    "plugin.json": { name: "sabia", version: "2.1.0" },
    "skills/sa-setup/assets/agents/perfis.json": { agentes: { "sa-especificador": { skills: ["sa-prd"] }, "sa-desenvolvedor": { skills: ["sa-desenvolver"] } } },
    "fluxo/sa-prd/prd/prd.md": mestre({ fluxo: "prd", dono: "sa-especificador", passos: [{ id: "escrever" }] }),
    "fluxo/sa-prd/prd/passos/escrever.md": passo("Escreve."),
    "fluxo/sa-desenvolver/codificar/codificar.md": mestre({ fluxo: "codificar", dono: "sa-desenvolvedor", passos: [{ id: "as-built" }] }),
    "fluxo/sa-desenvolver/codificar/passos/as-built.md": passo("As-built."),
    "template/sa-revisar/criterios-revisao.md": "---\n{\"resumo\": \"r\"}\n---\n| # | V | S |\n|---|---|---|\n| C2 | x | B |\n",
    "fluxo/tipos.json": { tipos: { HF: tipo(["sa-prd.prd.escrever"]), ATA: tipo(["sa-prd.prd.escrever"]), GL: tipo(["sa-prd.prd.escrever"], []),
      ET: tipo(["sa-desenvolver.codificar.as-built", "sa-prd.prd.escrever"]) } },
  });
}

test("toolkit: tipo → skill do toolkit com fluxo e template da pasta; recusa tipo fora, não desviável, pendente, forma \"<tk>.<fluxo>\", critérios de revisão e requer", () => {
  const FW = fwToolkit();
  const erros = (mudar, fw = FW) => { const r = validarToolkitFonte(fw, casa(mudar)).join("\n"); fs.rmSync(path.join(raiz, "casa"), { recursive: true }); return r; };
  const hf = { skill: "skills/casa/SKILL.md", fluxo: "fluxo/fluxo-hf.md" };
  assert.equal(erros({}), "");
  const e = erros({ tipos: { GL: hf, XX: hf, ATA: "casa.ata" }, criterios_revisao: [{ id: "C2", verificacao: "repete a do Sabiá", severidade: "BLOQUEANTE" }], requer: { sabia: "9.0.0" } });
  for (const rx of [/tipo GL: não é desviável/, /tipo XX: fora do catálogo/, /tipo ATA: use \{"skill", "fluxo", "template"\}/, /critério de revisão C2: repetida ou já do Sabiá/, /requer o Sabiá 9\.0\.0/]) assert.match(e, rx);
  assert.match(erros({ tipos: { HF: { ...hf, skill: "skills/outra/SKILL.md" } } }), /tipo HF: a skill skills\/outra\/SKILL\.md não está em skills/);
  assert.match(erros({ tipos: { HF: { ...hf, fluxo: "fluxo/nao.md" } } }), /tipo HF: falta o fluxo fluxo\/nao\.md na pasta do toolkit/);
  assert.match(erros({ tipos: { HF: { ...hf, template: "../fora.md" } } }), /tipo HF: falta o template \.\.\/fora\.md na pasta do toolkit/);
  // pasta no lugar do arquivo e caminho absoluto: recusados como no gerador
  assert.match(erros({ tipos: { HF: { ...hf, fluxo: "fluxo" } } }), /tipo HF: falta o fluxo fluxo na pasta do toolkit/);
  assert.match(erros({ tipos: { HF: { ...hf, fluxo: "/fluxo/fluxo-hf.md" } } }), /tipo HF: falta o fluxo \/fluxo\/fluxo-hf\.md na pasta do toolkit/);
  // só a skill, com as references dentro: aceito
  assert.equal(erros({ tipos: { HF: { skill: hf.skill } } }), "");
  // a skill do tipo traz em papeis o papel do agente dono de cada passo de desvio (sa-especificador: especificador ou produto)
  assert.match(erros({ tipos: { ET: { skill: hf.skill } } }), /tipo ET: a skill skills\/casa\/SKILL\.md não traz o papel desenvolvedor em papeis \(dono do passo de desvio sa-desenvolver\.codificar\.as-built\)/);
  assert.doesNotMatch(erros({ tipos: { ET: { skill: hf.skill } } }), /papel especificador/);
  assert.equal(erros({ tipos: { ET: { skill: hf.skill } }, skills: [{ caminho: hf.skill, papeis: ["desenvolvedor", "produto"] }] }), "");
  assert.equal(erros({ skills: [{ caminho: hf.skill, papeis: ["produto"] }] }), "");
  assert.match(erros({ skills: [{ caminho: hf.skill, papeis: ["revisor"] }] }), /tipo HF: .*papel especificador ou produto.*\n.*tipo ATA: .*papel especificador ou produto/);
  // tipo desviável ainda pendente no Sabiá instalado
  const fw = escrever(path.join(raiz, "fw-pend"), { "fluxo/tipos.json": { tipos: { HF: { desviavel: ["sa-prd.prd.escrever"], pendente: true } } } });
  assert.match(erros({ tipos: { HF: hf }, criterios_revisao: [] }, fw), /tipo HF: pendente no Sabiá instalado/);
  const r = erros({ criterios_revisao: [{ id: "EX1", tipo: "HF" }, { id: "ex2", verificacao: "v", severidade: "ALTA" }] });
  for (const rx of [/critério de revisão EX1: sem verificacao/, /critério de revisão EX1: severidade ""/, /critério de revisão ex2: id como EX1/, /critério de revisão ex2: severidade "ALTA"/]) assert.match(r, rx);
});

test("package.json#files leva todo módulo local que o sabia.mjs importa", () => {
  const pkg = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url), "utf8"));
  const src = fs.readFileSync(new URL("./sabia.mjs", import.meta.url), "utf8");
  for (const [, f] of src.matchAll(/from "\.\/([^"]+)"/g)) assert.ok(pkg.files.includes(f), f);
});
