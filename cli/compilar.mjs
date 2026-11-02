// Compilador as-built do Sabiá: fluxo/ + padrao/ + skills/ (a fonte, no framework) → skills comuns (SKILL.md +
// references/) numa pasta de staging, uma por alvo.
import fs from "node:fs";
import path from "node:path";

const FM = /^---\n([\s\S]*?)\n---\n/;
const ID = /`(sa-[a-z]+(?:\.[a-z][a-z-]*){1,2})`/g;
const LINK = /\]\(([^)\s]+)\)/g;

const ler = (f) => fs.readFileSync(f, "utf8");
const json = (f) => JSON.parse(ler(f));
const skillsDe = (fw) => fs.readdirSync(path.join(fw, "skills")).filter((d) => d === "sabia" || d.startsWith("sa-")).sort();
const mds = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort() : []);

/** Front-matter JSON (fluxo/, padrao/) e o corpo, com as linhas do front-matter preservadas para o número de linha. */
export function partes(texto) {
  const m = texto.match(FM);
  return m ? { dados: JSON.parse(m[1]), corpo: texto.slice(m[0].length), pulo: m[0].split("\n").length - 1 } : { dados: null, corpo: texto, pulo: 0 };
}

/** Slug de âncora no estilo do GitHub: minúsculas, letras e números Unicode mantidos, espaço vira "-". */
export const slug = (titulo) => titulo.trim().toLowerCase().replace(/`/g, "").replace(/[^\p{L}\p{N} _-]/gu, "").replace(/ /g, "-");
const ancoras = (texto) => new Set([...texto.matchAll(/^#+ (.+)$/gm)].map((m) => slug(m[1])));

export const VIZINHOS = "## Entrada: vizinhos";
export const SPRINT = ["exige", "nao"];

/** As linhas "- <estado> → <destino>" da seção Entrada: vizinhos do corpo do mestre (null sem a seção). */
function vizinhos(corpo, pulo) {
  const ls = corpo.split("\n"), i = ls.findIndex((l) => l.trim() === VIZINHOS);
  if (i < 0) return null;
  const out = [];
  for (let j = i + 1; j < ls.length && !/^#{1,6} /.test(ls[j]); j++) {
    if (!ls[j].trim()) continue;
    const t = ls[j].trim(), k = t.lastIndexOf(" → ");
    out.push({ n: pulo + j + 1, ...(t.startsWith("- ") && k > 2 ? { estado: t.slice(2, k), destino: t.slice(k + 3) } : {}) });
  }
  return out;
}

/** Lê a fonte inteira: fluxos, passos, regras, padrões, travas e papéis. */
export function carregar(fw) {
  const m = { fw, fluxos: {}, regras: {}, padroes: {}, travas: {}, subag: {}, skillsAgente: {} };
  const dirFluxo = path.join(fw, "fluxo");
  if (fs.existsSync(path.join(dirFluxo, "travas.json"))) m.travas = json(path.join(dirFluxo, "travas.json")).travas;
  const papeis = path.join(fw, "skills/sa-setup/assets/agents/papeis.json");
  if (fs.existsSync(papeis))
    for (const [k, v] of Object.entries(json(papeis).papeis)) {
      m.subag[`sa-${k}`] = new Set(v.subagentes || []);
      m.skillsAgente[`sa-${k}`] = new Set(v.skills || []);
    }
  for (const s of fs.existsSync(dirFluxo) ? fs.readdirSync(dirFluxo).sort() : []) {
    const ds = path.join(dirFluxo, s);
    if (!fs.statSync(ds).isDirectory()) continue;
    if (fs.existsSync(path.join(ds, "regras.md"))) m.regras[s] = { arq: path.join(ds, "regras.md"), ...partes(ler(path.join(ds, "regras.md"))) };
    for (const f of fs.readdirSync(ds).sort()) {
      const mestre = path.join(ds, f, `${f}.md`);
      if (!fs.existsSync(mestre)) continue;
      const p = partes(ler(mestre));
      const passos = (p.dados?.passos || []).map((x) => {
        // passo compartilhado ({"de": "entrada"}): o corpo vem de fluxo/<de>.md, não de passos/
        const arq = x.de ? path.join(dirFluxo, `${x.de}.md`) : path.join(ds, f, "passos", `${x.id}.md`);
        return { ...x, arq, ...(fs.existsSync(arq) ? partes(ler(arq)) : { dados: null, corpo: "", pulo: 0 }) };
      });
      m.fluxos[`${s}.${f}`] = { skill: s, fluxo: f, arq: mestre, d: p.dados || {}, corpo: p.corpo, pulo: p.pulo, passos, vizinhos: vizinhos(p.corpo, p.pulo) };
    }
  }
  const dirPadrao = path.join(fw, "padrao");
  for (const s of fs.existsSync(dirPadrao) ? fs.readdirSync(dirPadrao).sort() : [])
    m.padroes[s] = mds(path.join(dirPadrao, s)).map((n) => ({ nome: n, arq: path.join(dirPadrao, s, n), ...partes(ler(path.join(dirPadrao, s, n))) }));
  return m;
}

const fluxosDa = (m, s) => Object.values(m.fluxos).filter((f) => f.skill === s);

/** "sa-x.f" ou "sa-x.f.p" existe? Devolve o fluxo e o passo (ou null). */
function resolverId(m, q) {
  const [s, f, p] = q.split(".");
  const fl = m.fluxos[`${s}.${f}`];
  if (!fl) return null;
  if (p === undefined) return { fl, passo: null };
  const passo = fl.passos.find((x) => x.id === p);
  return passo ? { fl, passo } : null;
}

/** Como o agente roda um fluxo chamado: "em linha" (mesmo dono ou skill do agente), "subagente", ou null (não pode). */
function modoChamada(m, dono, alvo) {
  if (alvo.d.dono === dono || m.skillsAgente[dono]?.has(alvo.skill)) return "em linha";
  if (m.subag[dono]?.has(alvo.d.dono)) return "subagente";
  return null;
}

// ---------------------------------------------------------------- validação

/** Erros "arquivo:linha: mensagem" da fonte. Lista vazia = pronta para compilar. */
export function validar(m) {
  const erros = [];
  const rel = (f) => path.relative(m.fw, f);
  const e = (f, n, msg) => erros.push(`${rel(f)}:${n}: ${msg}`);
  const porSkill = {};
  for (const fl of Object.values(m.fluxos)) (porSkill[fl.skill] ||= []).push(fl);

  for (const [q, fl] of Object.entries(m.fluxos)) {
    const { d } = fl;
    if (!d.passos?.length || d.fluxo !== fl.fluxo || !d.dono) e(fl.arq, 2, "mestre sem fluxo/dono/passos (ou fluxo ≠ nome da pasta)");
    if (porSkill[fl.skill].length > 1 && !(Array.isArray(d.quando) ? d.quando.length : String(d.quando || "").trim()))
      e(fl.arq, 2, `falta "quando" (a skill ${fl.skill} tem ${porSkill[fl.skill].length} fluxos)`);
    const ids = fl.passos.map((x) => x.id);
    const orfaos = fs.existsSync(path.join(path.dirname(fl.arq), "passos"))
      ? mds(path.join(path.dirname(fl.arq), "passos")).map((f) => f.slice(0, -3)).filter((x) => !ids.includes(x)) : [];
    for (const o of orfaos) e(fl.arq, 2, `passo ${o} órfão (tem arquivo, não está no mestre)`);
    for (const t of d.travas_gerais || []) if (!m.travas[t]) e(fl.arq, 2, `trava ${t} fora do catálogo`);
    if (fl.passos.some((x) => x.de) && !fl.vizinhos?.length)
      e(fl.arq, 2, `passo entrada sem a seção "${VIZINHOS}" no corpo do mestre (uma linha "- <estado> → <dona>" por vizinho)`);
    for (const v of fl.vizinhos || []) {
      const alvos = v.destino ? [...v.destino.matchAll(ID)].map((r) => r[1]) : [];
      if (!alvos.length && !v.destino?.endsWith("■")) { e(fl.arq, v.n, 'vizinho fora do formato "- <estado> → `sa-x.f[.p]`" ou "- <estado> → <frase> ■"'); continue; }
      for (const q2 of alvos) {
        const r = resolverId(m, q2);
        if (!r) continue;  // o id inexistente já sai na varredura do texto
        if (r.fl === fl) e(fl.arq, v.n, `vizinho → ${q2}: é deste fluxo → declare como saída do passo entrada ("saidas" no mestre)`);
        else if (!m.subag[r.fl.d.dono]) e(fl.arq, v.n, `vizinho → ${q2}: o dono ${r.fl.d.dono} não é agente do papeis.json`);
        else if (r.passo && r.fl.d.dono !== d.dono) e(fl.arq, v.n, `vizinho → ${q2}: passo de outro agente (${r.fl.d.dono}) → use o fluxo (${r.fl.skill}.${r.fl.fluxo})`);
      }
    }
    for (const x of fl.passos) {
      if (x.id === "grafo") e(fl.arq, 2, "passo grafo: id reservado (o compilador gera references/<fluxo>/grafo.md)");
      if (x.id === "entrada" && !x.de) e(fl.arq, 2, 'passo entrada: id reservado ao passo compartilhado → {"id": "entrada", "de": "entrada", "sprint": "exige|nao"}');
      if (x.de) {
        if (!SPRINT.includes(x.sprint)) e(fl.arq, 2, `passo ${x.id}: sprint "${x.sprint ?? ""}" (use ${SPRINT.join(" ou ")})`);
        if (fs.existsSync(path.join(path.dirname(fl.arq), "passos", `${x.id}.md`))) e(fl.arq, 2, `passo ${x.id}: vem de fluxo/${x.de}.md; apague passos/${x.id}.md`);
        if (!fs.existsSync(x.arq)) { e(fl.arq, 2, `passo ${x.id}: de "${x.de}" sem fluxo/${x.de}.md`); continue; }
      }
      if (!x.dados) { e(x.arq, 1, `passo ${x.id} sem arquivo ou sem front-matter`); continue; }
      if (!x.dados.resumo) e(x.arq, 2, "passo sem resumo");
      for (const sec of ["## Entrada", "## Faça", "## Saída", "## Pare se"]) if (!x.corpo.includes(sec)) e(x.arq, 1, `falta ${sec}`);
      for (const t of x.travas || []) if (!m.travas[t]) e(fl.arq, 2, `passo ${x.id}: trava ${t} fora do catálogo`);
      for (const c of [].concat(x.chama || [])) {
        const r = resolverId(m, c);
        if (!r) e(fl.arq, 2, `passo ${x.id}: chama ${c} inexistente`);
        else if (!modoChamada(m, d.dono, r.fl)) e(fl.arq, 2, `passo ${x.id}: chama ${c} (dono ${r.fl.d.dono}), mas ${d.dono} não tem a skill nem esse subagente → use passagem (→)`);
      }
      for (const [cond, dest] of Object.entries(x.saidas || {})) {
        const r = dest.startsWith("→ ") ? resolverId(m, dest.slice(2).trim()) : null;
        if (r?.passo && r.fl.d.dono !== d.dono)
          e(fl.arq, 2, `passo ${x.id}: saída "${cond}" passa ao passo ${dest.slice(2).trim()}, de outro agente (${r.fl.d.dono}) → use o fluxo (→ ${r.fl.skill}.${r.fl.fluxo})`);
        if (dest === "fim" || ids.includes(dest) || r) continue;
        e(fl.arq, 2, `passo ${x.id}: saída "${cond}" → "${dest}" (use id do fluxo, fim ou "→ skill.fluxo[.passo]" existente)`);
      }
    }
  }

  const textos = [];
  for (const fl of Object.values(m.fluxos)) {
    textos.push({ arq: fl.arq, corpo: fl.corpo, pulo: fl.pulo, skill: fl.skill, fl });
    for (const x of fl.passos) textos.push({ arq: x.arq, corpo: x.corpo, pulo: x.pulo, skill: fl.skill, fl });
  }
  for (const [s, r] of Object.entries(m.regras)) textos.push({ arq: r.arq, corpo: r.corpo, pulo: r.pulo, skill: s });
  for (const [s, ps] of Object.entries(m.padroes)) for (const p of ps) textos.push({ arq: p.arq, corpo: p.corpo, pulo: p.pulo, skill: s });
  for (const s of skillsDe(m.fw)) {
    const dir = path.join(m.fw, "skills", s);
    for (const f of [path.join(dir, "SKILL.md"), ...mds(path.join(dir, "references")).map((n) => path.join(dir, "references", n))]) {
      if (!fs.existsSync(f)) continue;
      const t = ler(f);
      const fmYaml = t.match(FM);
      const corpo = fmYaml ? t.slice(fmYaml[0].length) : t;
      const pulo = fmYaml ? fmYaml[0].split("\n").length - 1 : 0;
      if (path.basename(f) === "SKILL.md" && porSkill[s]) {
        const resto = corpo.split("\n").filter((l) => l.trim() && !l.startsWith("# "));
        if (resto.length) e(f, pulo + 1, `skill de fluxo com corpo além do H1 (${resto.length} linhas): vai para "quando" ou regras.md`);
      }
      textos.push({ arq: f, corpo, pulo, skill: s });
    }
  }

  const passoRx = /\bpassos? ((?:`[a-z][a-z-]*`(?:, | e | ou )?)+)/g;
  const fluxoRx = /\bfluxos? ((?:`[a-z][a-z-]*`(?:, | e | ou )?)+)/g;
  const legado = [/`?\bsa-[a-z]+`?\*{0,2},? \(?(?:fluxo|passo)s? `/, /\b(?:fluxo|passo)s? `[a-z-]+`(?: \([^)]*\))? d[ao] \*{0,2}`?sa-[a-z]+/];
  for (const t of textos) {
    let cerca = false;
    t.corpo.split("\n").forEach((linha, i) => {
      const n = t.pulo + i + 1;
      if (linha.trimStart().startsWith("```")) { cerca = !cerca; return; }
      if (/~\/\.sabia\/(fluxo|padrao)\//.test(linha)) e(t.arq, n, "prefixo ~/.sabia/fluxo|padrao/ → ~/.sabia/framework/fluxo|padrao/");
      if (cerca) return;
      for (const [, q] of linha.matchAll(ID)) if (!/\.(md|json|sh|py)$/.test(q) && !resolverId(m, q)) e(t.arq, n, `id inexistente \`${q}\``);
      const semId = linha.replace(ID, "ID");
      for (const rx of legado) if (rx.test(semId)) e(t.arq, n, `referência em prosa → use o id: …${semId.match(rx)[0]}…`);
      for (const [, grupo] of semId.matchAll(passoRx))
        for (const [, x] of grupo.matchAll(/`([a-z][a-z-]*)`/g)) {
          if (t.fl) { if (!t.fl.passos.some((p) => p.id === x)) e(t.arq, n, `passo \`${x}\` não é do fluxo ${t.skill}.${t.fl.fluxo} → use o id`); }
          else if (porSkill[t.skill]) { if (porSkill[t.skill].filter((f) => f.passos.some((p) => p.id === x)).length !== 1) e(t.arq, n, `passo \`${x}\` sem fluxo → use o id`); }
          else e(t.arq, n, `passo \`${x}\` fora de fluxo → use o id`);
        }
      for (const [, grupo] of semId.matchAll(fluxoRx))
        for (const [, x] of grupo.matchAll(/`([a-z][a-z-]*)`/g)) if (!m.fluxos[`${t.skill}.${x}`]) e(t.arq, n, `fluxo \`${x}\` não é da skill ${t.skill} → use o id`);
      for (const mi of semId.matchAll(/\bitens? \d+/g))
        if (/^[^.;]*?(\bd[ao] `?sa-|ID|\bd[ao] passo `)/.test(semId.slice(mi.index + mi[0].length, mi.index + mi[0].length + 70)))
          e(t.arq, n, `"${mi[0]}" de outro arquivo → use id ou âncora`);
      for (const f of ["em `fluxo/`", "abra-os pelo caminho", "abra pelo caminho", "ficam fora do projeto"]) if (linha.includes(f)) e(t.arq, n, `frase de localização "${f}"`);
      if (/`sa-[a-z]+\/[a-z-]+\/passos\/|`sa-[a-z]+\/regras\.md`/.test(linha)) e(t.arq, n, "caminho de fluxo/ em code-span → id do passo");
    });
  }
  return [...new Set(erros)];  // o passo compartilhado repete os mesmos erros em cada fluxo
}

// ---------------------------------------------------------------- reescrita

/** Caminho na fonte (absoluto) → caminho relativo à pasta skills/ da saída, ou null se não for do framework. */
export function mapear(fw, src) {
  const r = path.relative(fw, src).split(path.sep);
  if (r[0] === "skills" && r.length >= 2) return r.slice(1).join("/");
  if (r[0] === "padrao" && r.length === 3) return `${r[1]}/references/padrao/${r[2]}`;
  if (r[0] === "fluxo" && r.length === 3 && r[2] === "regras.md") return `${r[1]}/SKILL.md`;
  if (r[0] === "fluxo" && r.length === 4 && r[3] === `${r[2]}.md`) return `${r[1]}/SKILL.md`;
  if (r[0] === "fluxo" && r.length === 5 && r[3] === "passos") return `${r[1]}/references/${r[2]}/${r[4]}`;
  return null;
}

/** Reescreve links e caminhos do framework para o caminho absoluto do alvo (`base`) e liga ids e padrões. */
export function reescrever(texto, origem, { fw, base, m }) {
  const destino = (alvo) => {
    const [cam, anc = ""] = alvo.split("#");
    let src;
    if (cam.startsWith("~/.sabia/framework/")) src = path.join(fw, cam.slice("~/.sabia/framework/".length));
    else if (!cam) src = origem;
    else if (cam.startsWith("../") || cam.startsWith("references/") || cam.endsWith("SKILL.md")) src = path.resolve(path.dirname(origem), cam);
    else return null;
    const r = mapear(fw, src);
    return r ? `${base}/${r}${anc ? "#" + anc : ""}` : null;
  };
  let cerca = false;
  return texto.split("\n").map((linha) => {
    if (linha.trimStart().startsWith("```")) { cerca = !cerca; return linha; }
    linha = linha.replace(LINK, (todo, alvo) => {
      if (/^(https?:|mailto:)/.test(alvo) || alvo.includes("<") || alvo.includes("…")) return todo;
      const d = destino(alvo);
      return d ? `](${d})` : todo;
    });
    linha = linha.replace(/~\/\.sabia\/framework\/[^\s)`'"]+/g, (cam) => destino(cam) || cam);
    if (cerca || !m) return linha;
    linha = linha.replace(/(\[)?`(sa-[a-z]+(?:\.[a-z][a-z-]*){1,2})`(\]\()?/g, (todo, abre, q, fecha) => {
      if (abre || fecha || /\.(md|json|sh|py)$/.test(q)) return todo;
      const r = resolverId(m, q);
      if (!r) return todo;
      const alvo = destinoId(base, r);
      return `[\`${q}\`](${alvo})`;
    });
    return linha.replace(/o padrão `([a-z-]+)\/([a-z0-9.-]+\.md)`(?!\])/g, (todo, s, n) =>
      m.padroes[s]?.some((p) => p.nome === n) ? `o padrão [\`${s}/${n}\`](${base}/${s}/references/padrao/${n})` : todo);
  }).join("\n");
}

/** Desce os títulos `n` níveis (fora das cercas de código). */
function rebaixar(texto, n) {
  let cerca = false;
  return texto.split("\n").map((l) => {
    if (l.trimStart().startsWith("```")) cerca = !cerca;
    return !cerca && /^#{1,5} /.test(l) ? "#".repeat(n) + l : l;
  }).join("\n");
}

/** Tira o H1 do corpo; devolve o título e o resto. */
function semH1(corpo) {
  const m = corpo.match(/^\s*# (.+)\n/);
  return m ? { titulo: m[1].trim(), resto: corpo.slice(m[0].length).replace(/^\n+/, "") } : { titulo: "", resto: corpo.replace(/^\n+/, "") };
}

/** Link de um id: o arquivo do passo, ou a seção do fluxo no SKILL.md. */
const destinoId = (base, r) => (r.passo ? `${base}/${r.fl.skill}/references/${r.fl.fluxo}/${r.passo.id}.md` : `${base}/${r.fl.skill}/SKILL.md#${slug(`Fluxo ${r.fl.fluxo}`)}`);

const cel = (t) => String(t).replace(/\|/g, "\\|").replace(/\n/g, " ");
const italico = (resumo) => (resumo ? `_${resumo}_\n\n` : "");

export const LEGENDA = "↓ segue · ↑ volta · ↺ repete · ⇄ chama · ⇒ passa a (o fluxo termina) · ↪ vizinhos da entrada (diga a dona e pare) · ■ fim · 🔒 trava · ⇢ passo com desvio de toolkit";

/**
 * O grafo ASCII do fluxo `fl` (de carregar): uma caixa por passo de `passos` (o rota passa os resolvidos no projeto) e, à
 * direita, chama, travas e saídas. `notas(x)` acrescenta linhas no topo das anotações (origem, desvio ligado).
 */
export function grafoAscii(fl, passos = fl.passos, { notas = () => [] } = {}) {
  const ids = passos.map((x) => x.id), out = [];
  const rot = (x, i) => `${i + 1} ${x.id}${x.sprint ? ` [${x.sprint}]` : ""}${x.desvio ? " ⇢" : ""}`;
  // 26 colunas cabem os ids do Sabiá; um id longo inserido pelo projeto alarga a caixa (par, por causa do ┬ central)
  const W = 2 * Math.ceil(Math.max(26, ...passos.map((x, i) => rot(x, i).length + 4)) / 2);
  const cond = (c) => (c.length > 60 ? c.slice(0, 57) + "…" : c);
  out.push(`${fl.skill}.${fl.fluxo}   dono ${fl.d.dono}   travas ${(fl.d.travas_gerais || []).join(", ") || "—"}`, "");
  passos.forEach((x, i) => {
    const lado = [...notas(x)];
    // os vizinhos numa linha só: a entrada diz a dona e para, não é passagem de trabalho (⇒)
    const viz = x.de ? (fl.vizinhos || []).filter((v) => v.destino).map((v) => [...v.destino.matchAll(ID)][0]?.[1] || `■ ${cond(v.estado.replace(/`/g, ""))}`) : [];
    if (viz.length) lado.push(`↪ vizinhos (diga e pare): ${[...new Set(viz)].join(" · ")}`);
    if (x.chama) lado.push(`⇄ chama ${[].concat(x.chama).join(", ")}`);
    if (x.travas?.length) lado.push(`🔒 ${x.travas.join(", ")}`);
    for (const [c, dest] of Object.entries(x.saidas || {})) {
      const j = ids.indexOf(dest);
      const seta = dest.startsWith("→ ") ? `⇒ passa a ${dest.slice(2).trim()}` : dest === "fim" ? "■ fim" : dest === x.id ? `↺ ${dest}` : j >= 0 && j < i ? `↑ volta a ${dest}` : `↓ ${dest}`;
      lado.push(`${seta}  (${cond(c)})`);
    }
    const ultimo = i === passos.length - 1;
    out.push(`  ┌${"─".repeat(W - 2)}┐`);
    out.push(`  │ ${rot(x, i).padEnd(W - 4)} │${lado[0] ? `──▶ ${lado[0]}` : ""}`);
    out.push((ultimo ? `  └${"─".repeat(W - 2)}┘` : `  └${"─".repeat(W / 2 - 2)}┬${"─".repeat(W / 2 - 1)}┘`) + (lado[1] ? `    ${lado[1]}` : ""));
    for (const l of lado.slice(2)) out.push(`${" ".repeat(W + 6)}${l}`);
    if (!ultimo) out.push(`  ${" ".repeat(W / 2 - 1)}▼`);
  });
  return out.join("\n");
}

const grafoMd = (fl) => [`# Grafo de ${fl.skill}.${fl.fluxo}`, "", "```", grafoAscii(fl), "```", "", LEGENDA, ""].join("\n");

const NO_PROJETO = `## No projeto

Antes de ler o arquivo de um passo (\`…/skills/<skill>/references/<fluxo>/<passo>.md\`, de qualquer skill), tente abrir
direto \`.sabia/fluxo/<skill>/<fluxo>/passos/<passo>.md\` na raiz do projeto: se existir, vale ele; senão, o da skill.
O mesmo para um padrão: \`.sabia/padrao/<skill>/<nome>.md\` no lugar de \`…/references/padrao/<nome>.md\`. Abra pelo
caminho; não liste a pasta (a busca não vê pastas ocultas). Com agente do Sabiá, o prompt lista também os passos inseridos
e removidos nos fluxos de que ele é dono.
`;

/** O SKILL.md compilado de uma skill de fluxo. */
function skillMd(m, s, fmYaml, h1, ctx) {
  const { base } = ctx;
  const fls = fluxosDa(m, s);
  const out = [fmYaml.trimEnd(), "", h1, ""];
  if (m.regras[s]) out.push("## Regras", "", rebaixar(reescrever(semH1(m.regras[s].corpo).resto, m.regras[s].arq, ctx), 1).trimEnd(), "");
  if (fls.length > 1) {
    out.push("## Fluxos", "", "| Fluxo | Quando |", "|---|---|");
    for (const fl of fls) out.push(`| [${fl.fluxo}](#${slug(`Fluxo ${fl.fluxo}`)}) | ${cel([].concat(fl.d.quando || []).join("; "))} |`);
    out.push("");
  }
  const usadas = new Set();
  for (const fl of fls) {
    const { titulo, resto } = semH1(fl.corpo);
    out.push(`## Fluxo ${fl.fluxo}`, "");
    if (titulo) out.push(`**${titulo}**`, "");
    out.push(`Agente: \`${fl.d.dono}\`. Sem ele, sugira à pessoa usá-lo; seguindo aqui, os passos inseridos pelo projeto e os`,
      "desvios de toolkit (⇢) não entram.", "");
    if (resto.trim()) out.push(rebaixar(reescrever(resto, fl.arq, ctx), 1).trimEnd(), "");
    out.push("| # | Passo | Arquivo | Chama | Travas | Saídas |", "|---|---|---|---|---|---|");
    (fl.d.travas_gerais || []).forEach((t) => usadas.add(t));
    fl.passos.forEach((x, i) => {
      (x.travas || []).forEach((t) => usadas.add(t));
      const arq = `${base}/${s}/references/${fl.fluxo}/${x.id}.md`;
      const chama = [].concat(x.chama || []).map((c) => {
        const r = resolverId(m, c);
        const modo = modoChamada(m, fl.d.dono, r.fl);
        const alvo = destinoId(base, r);
        return `[\`${c}\`](${alvo}) (${modo === "subagente" ? `${r.fl.d.dono}, subagente` : "em linha"})`;
      }).join("<br>") || "—";
      const saidas = Object.entries(x.saidas || {}).map(([cond, dest]) => {
        if (dest === "fim") return `${cond} → fim`;
        if (!dest.startsWith("→ ")) return `${cond} → \`${dest}\``;
        const q = dest.slice(2).trim();
        const r = resolverId(m, q);
        const alvo = destinoId(base, r);
        return `${cond} → passa a [\`${q}\`](${alvo})`;
      }).join("<br>") || "—";
      out.push(`| ${i + 1} | \`${x.id}\`${x.desvio ? " ⇢" : ""} | [${x.id}.md](${arq}) | ${cel(chama)} | ${cel((x.travas || []).join(", ") || "—")} | ${cel(saidas)} |`);
    });
    out.push("", `Grafo: [grafo.md](${base}/${s}/references/${fl.fluxo}/grafo.md)`);
    out.push("", "Ao começar um passo, leia o arquivo dele (não os dos outros passos) e o que ele mandar ler. Sem Saídas, segue para o",
      `próximo da lista. Travas do fluxo: ${(fl.d.travas_gerais || []).map((t) => `\`${t}\``).join(", ") || "—"}.`, "");
  }
  const ordem = Object.keys(m.travas).filter((t) => usadas.has(t));
  if (ordem.length) out.push("## Travas", "", "Valem sobre o corpo de qualquer passo.", "", ...ordem.map((t) => `- **${t}** — ${m.travas[t].texto}`), "");
  const padroes = m.padroes[s] || [];
  const refs = mds(path.join(m.fw, "skills", s, "references"));
  if (padroes.length || refs.length) {
    out.push("## Arquivos", "");
    for (const p of padroes) out.push(`- padrão [\`${s}/${p.nome}\`](${base}/${s}/references/padrao/${p.nome})${p.dados?.resumo ? ` — ${p.dados.resumo}` : ""}`);
    for (const r of refs) out.push(`- [\`references/${r}\`](${base}/${s}/references/${r})`);
    out.push("");
  }
  out.push(NO_PROJETO);
  return out.join("\n");
}

const comVersao = (fmYaml, versao) => (versao ? fmYaml.replace(/^(\s+version:\s*)"[^"]*"/m, `$1"${versao}"`) : fmYaml);

function copiarArvore(origem, destino, transformar) {
  fs.mkdirSync(destino, { recursive: true });
  for (const n of fs.readdirSync(origem)) {
    if (n === "__pycache__" || n === ".DS_Store") continue;
    const o = path.join(origem, n), d = path.join(destino, n);
    if (fs.statSync(o).isDirectory()) copiarArvore(o, d, transformar);
    else if (n.endsWith(".md")) fs.writeFileSync(d, transformar(ler(o), o));
    else fs.copyFileSync(o, d);
  }
}

/** Confere a saída: todo link para `base` resolve num arquivo do staging (e a âncora existe); nada do layout da fonte sobra. */
function conferirSaida(staging, base) {
  const erros = [];
  const raiz = path.join(staging, "skills");
  const cache = {};
  const andar = (dir) => fs.readdirSync(dir).flatMap((n) => (fs.statSync(path.join(dir, n)).isDirectory() ? andar(path.join(dir, n)) : n.endsWith(".md") ? [path.join(dir, n)] : []));
  for (const f of andar(raiz)) {
    const t = ler(f);
    const rel = path.relative(staging, f);
    t.split("\n").forEach((l, i) => {
      if (/~\/\.sabia\/(framework\/(skills|fluxo|padrao)|fluxo|padrao)\//.test(l)) erros.push(`${rel}:${i + 1}: caminho da fonte na saída`);
      for (const [, alvo] of l.matchAll(LINK)) {
        if (!alvo.startsWith(base + "/")) continue;
        const [cam, anc] = alvo.slice(base.length + 1).split("#");
        const arq = path.join(raiz, cam);
        if (!fs.existsSync(arq)) { erros.push(`${rel}:${i + 1}: link para ${cam} inexistente`); continue; }
        if (anc && !(cache[arq] ||= ancoras(ler(arq))).has(anc)) erros.push(`${rel}:${i + 1}: âncora #${anc} não existe em ${cam}`);
      }
    });
  }
  return erros;
}

/**
 * Compila o framework `fw` no `staging` (recriado do zero): staging/skills/<s>/… e, com `raiz`, plugin.json, mcp.json,
 * README.md e LICENSE (o power do Kiro). `base` é o caminho absoluto com ~ onde as skills ficam no alvo.
 */
export function compilar(fw, staging, { base, raiz = false, versao = null } = {}) {
  const m = carregar(fw);
  const erros = validar(m);
  if (erros.length) throw new Error(`a fonte do Sabiá tem ${erros.length} erro(s):\n${erros.slice(0, 40).join("\n")}`);
  fs.rmSync(staging, { recursive: true, force: true });
  const ctx = { fw, base, m };
  const comFluxo = new Set(Object.values(m.fluxos).map((f) => f.skill));
  for (const s of skillsDe(fw)) {
    const dir = path.join(fw, "skills", s), out = path.join(staging, "skills", s);
    copiarArvore(dir, out, (t, o) => reescrever(t, o, ctx));
    const fonte = ler(path.join(dir, "SKILL.md"));
    const fmYaml = (fonte.match(FM) || [""])[0];
    if (comFluxo.has(s)) {
      const h1 = (fonte.slice(fmYaml.length).match(/^# .+$/m) || [`# ${s}`])[0];
      fs.writeFileSync(path.join(out, "SKILL.md"), skillMd(m, s, comVersao(fmYaml, versao), h1, ctx));
      for (const fl of fluxosDa(m, s)) {
        fs.mkdirSync(path.join(out, "references", fl.fluxo), { recursive: true });
        fs.writeFileSync(path.join(out, "references", fl.fluxo, "grafo.md"), grafoMd(fl));
        const linhaSprint = (x) => (x.de ? `Sprint deste fluxo: \`${x.sprint}\`. Vizinhos: a seção Entrada: vizinhos do [Fluxo ${fl.fluxo}](${base}/${s}/SKILL.md#${slug(`Fluxo ${fl.fluxo}`)}).\n\n` : "");
        for (const x of fl.passos)
          fs.writeFileSync(path.join(out, "references", fl.fluxo, `${x.id}.md`), italico(x.dados.resumo) + linhaSprint(x) + reescrever(x.corpo, x.arq, ctx).replace(/^\n+/, ""));
      }
    } else if (fmYaml) {
      fs.writeFileSync(path.join(out, "SKILL.md"), comVersao(fmYaml, versao) + reescrever(fonte.slice(fmYaml.length), path.join(dir, "SKILL.md"), ctx));
    }
    for (const p of m.padroes[s] || []) {
      fs.mkdirSync(path.join(out, "references", "padrao"), { recursive: true });
      fs.writeFileSync(path.join(out, "references", "padrao", p.nome), italico(p.dados?.resumo) + reescrever(p.corpo, p.arq, ctx).replace(/^\n+/, ""));
    }
  }
  if (raiz) for (const f of ["plugin.json", "mcp.json", "README.md", "LICENSE"]) if (fs.existsSync(path.join(fw, f))) fs.copyFileSync(path.join(fw, f), path.join(staging, f));
  const ruins = conferirSaida(staging, base);
  if (ruins.length) throw new Error(`a skill compilada tem ${ruins.length} erro(s):\n${ruins.slice(0, 40).join("\n")}`);
  return staging;
}
