// Gera os 5 agentes do Sabiá e os agentes de toolkit a partir de skills/sa-setup/assets/agents (perfis.json e prompts) do
// framework instalado e do .sabia/config/agentes.json do projeto, para cada alvo: kiro (.kiro/agents/<nome>.json, só nomes
// de capability em tools; os limites por caminho e URL vão no prompt) e opencode (.opencode/agents/<nome>.md, com mode e
// permission). O agente dono de cada fluxo recebe no prompt só o que o projeto mudou (.sabia/fluxo/, .sabia/template/), e
// todo agente a regra de chamada entre fluxos.
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ALIAS_PASSO, carregar, PAPEIS_DO_AGENTE } from "./compilar.mjs";

export const ALVOS = ["kiro", "opencode"];
export const POWER = "~/.kiro/powers/installed/sabia";  // onde o `sabia instalar` põe o power do Kiro, com as skills compiladas
const EFEITOS = ["allow", "ask", "deny"];  // nesta ordem no opencode (a última regra que casa vence): deny vence ask, ask vence allow
const CATEGORIAS = ["ler", "editar", "comandos", "mcp"];
export const AGENTE_DO_PAPEL = Object.fromEntries(Object.entries(PAPEIS_DO_AGENTE).flatMap(([a, ps]) => ps.map((p) => [p, a])));
// a regra da sa-elm.setup (passo dados): nos subagentes só a leitura do ELM, sem o sync e sem reindexar o bundle
const ELM_SO_PRIMARIOS = ["elm/elm_sync", "elm/elm_indexar_local"];
const CHAVES = new Set(["alvos", "sabia", "formato_spec", "produto", "branch_base", "prefixo_branch", "glossario", "adr", "elm", "toolkits", "passos", "agentes"]);
const CHAVES_AGENTE = new Set(["modelo", "mcp", "skills", "subagentes"]);
const LEITURA_OC = ["glob", "grep", "list", "lsp", "todoread", "todowrite"];
const PH = /\{\{([A-Z_]+)\}\}/g;
const FM = /^---\n([\s\S]*?)\n---\n/;
const ID = /^[a-z][a-z0-9-]*$/;
const CHAMADA = "Entre fluxos (colunas Chama e Saídas da tabela de cada fluxo no SKILL.md): chama **em linha** → rode você mesmo o"
  + " fluxo chamado e volte ao passo; chama **subagente** → chame esse agente e continue com a resposta; sem a"
  + " ferramenta de subagente, faça o que o passo manda para esse caso (Pare se ou Saída do passo): revisão e"
  + " verificação do que você fez nunca são suas; **passa a** → este fluxo termina: diga a próxima (o agente dono do outro fluxo) e pare.";
export const LACUNAS = {
  kiro: ["sem regras por caminho, comando ou URL nos agentes: os limites vão no prompt, e as tools fora das confiáveis pedem o \"sim\""],
  opencode: ["o autopilot do sa-desenvolvedor roda com as permissões do supervisionado (as do autopilot vão no prompt)",
    "a negação do shell é por trecho do comando: `grep -r`, glob ou variável chegam a um `.env` ou ao harness sem"
    + " citá-lo (a leitura pela ferramenta continua negada)"],
};

const ler = (f) => fs.readFileSync(f, "utf8");
const existe = (f) => fs.existsSync(f) && fs.statSync(f).isFile();
const ehDir = (f) => fs.existsSync(f) && fs.statSync(f).isDirectory();
const unicos = (xs) => [...new Set(xs)];
const tem = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const ehObjeto = (x) => typeof x === "object" && x !== null && !Array.isArray(x);
/** O que não conta como valor: nulo, false, "", lista ou mapa vazio. */
const vazio = (x) => !x || (Array.isArray(x) && !x.length) || (ehObjeto(x) && !Object.keys(x).length);
const fluxoDe = (c) => c.split(".").slice(0, 2).join(".");
const nomeSkill = (s) => path.basename(path.dirname(s.replace(/^skill:\/\//, "")));
const pyLista = (xs) => `[${xs.map((x) => `'${x}'`).join(", ")}]`;
export const lista = (ps) => ps.map((x) => `\`${x}\``).join(", ");
const VERBO = { allow: "liberado", ask: "pede o \"sim\"", deny: "negado" };
const padraoFw = () => path.join(os.homedir(), ".sabia", "framework");
const assets = (fw) => path.join(fw, "skills/sa-setup/assets");

/** Casamento de curinga do shell (`*` atravessa `/`), como no opencode. */
export function casa(alvo, padrao) {
  let re = "";
  for (let i = 0; i < padrao.length; i++) {
    const c = padrao[i];
    if (c === "*") re += "[\\s\\S]*";
    else if (c === "?") re += "[\\s\\S]";
    else if (c === "[") {
      let j = i + 1;
      if (padrao[j] === "!") j++;
      if (padrao[j] === "]") j++;
      while (j < padrao.length && padrao[j] !== "]") j++;
      if (j >= padrao.length) re += "\\[";
      else {
        const dentroClasse = padrao.slice(i + 1, j).replace(/\\/g, "\\\\");
        re += `[${dentroClasse.startsWith("!") ? `^${dentroClasse.slice(1)}` : dentroClasse}]`;
        i = j;
      }
    } else re += c.replace(/[.+^${}()|\\\]]/g, "\\$&");
  }
  return new RegExp(`^${re}$`).test(alvo);
}

/** Troca os {{X}}: um padrão por valor de X (com dois marcadores, cada combinação); marcador sem valor no projeto
 * (nulo ou lista vazia) tira o padrão. */
export function preencher(padroes, valores) {
  const out = [];
  for (const p of padroes) {
    const nomes = unicos([...p.matchAll(PH)].map((m) => m[1]));
    if (nomes.some((n) => vazio(valores[n]))) continue;
    let combos = [{}];
    for (const n of nomes) combos = combos.flatMap((c) => valores[n].map((v) => ({ ...c, [n]: v })));
    for (const d of combos) out.push(p.replace(PH, (_, n) => d[n]));
  }
  return unicos(out);
}

/** Como uma categoria decide: entre as listas que casam o alvo, deny vence ask, e ask vence allow; nenhuma → padrao. */
export const efeito = (regras, alvo) => ["deny", "ask", "allow"].find((e) => regras[e].some((p) => casa(alvo, p))) ?? regras.padrao;

/** Caminho do manifesto preso à pasta do toolkit: relativo, com `/`, sem `..`. */
export function dentro(caminho, toolkit) {
  if (caminho.startsWith("/") || caminho.startsWith("~") || caminho.includes("\\") || /^[A-Za-z]:/.test(caminho) || caminho.split("/").includes(".."))
    throw new Error(`toolkit ${toolkit}: caminho fora da pasta do toolkit: ${caminho}`);
  return caminho;
}

function frente(texto, arquivo = "") {
  const m = texto.match(FM);
  try {
    return m ? JSON.parse(m[1]) : {};
  } catch (e) {
    throw new Error(`${arquivo}: front-matter inválido (${e.message})`);
  }
}

/** A `base` de uma cópia: o sha256 (12) do arquivo-fonte no framework, com o front-matter. */
export const sha12 = (arquivo) => createHash("sha256").update(fs.readFileSync(arquivo)).digest("hex").slice(0, 12);

/** O arquivo-fonte do passo no framework: passos/<id>.md, ou fluxo/<de>.md no passo compartilhado. */
export const arqPasso = (fl, pid) => fl.passos.find((y) => y.id === pid)?.arq ?? path.join(path.dirname(fl.arq), "passos", `${pid}.md`);

/** O passo do framework que o `passo` de um toolkit assume, pelo id (ou pelo id antigo do ALIAS_PASSO). */
export const ganchoDe = (m, ext) => {
  const passos = Object.entries(m.fluxos).flatMap(([q, fl]) => fl.passos.map((x) => ({ id: `${q}.${x.id}`, x })));
  return passos.find(({ id }) => id === ext.passo) || passos.find(({ id }) => id === ALIAS_PASSO[ext.passo]);
};

function gancho(ext, fluxos, toolkit) {
  if (!tem(ext, "passo")) throw new Error(`toolkit ${toolkit}: passo sem o id (use o id do passo em passo.passo)`);
  const g = ganchoDe({ fluxos }, ext);
  if (!g) throw new Error(`toolkit ${toolkit}: o passo ${ext.passo} não existe no framework`);
  if (!g.x.desvio) throw new Error(`toolkit ${toolkit}: o passo ${ext.passo} não aceita desvio de toolkit`);
  return [fluxos[fluxoDe(g.id)].d.dono, g.id];
}

const porPartes = (a, b) => {
  const x = a.split(path.sep), y = b.split(path.sep);
  for (let i = 0; i < Math.min(x.length, y.length); i++) if (x[i] !== y[i]) return x[i] < y[i] ? -1 : 1;
  return x.length - y.length;
};
const arquivosEm = (d) => fs.readdirSync(d, { recursive: true }).map((r) => path.join(d, r)).filter(existe);

/** O que o projeto mudou: {delta, padroes, avisos}. Recusa o override que o compilador e o agente não entenderiam: arquivo
 * órfão, operação desconhecida, trava liberada. `originais`: {nome do template em requisitos/: o template do toolkit}. */
export function override(projeto, fw, fluxos, originais = {}) {
  const delta = {}, padroes = [], avisos = [], erros = [];
  const rel = (f) => path.relative(projeto, f).split(path.sep).join("/");
  const lerFm = (f) => frente(ler(f), rel(f));
  const comBase = (f, original, rotulo) => {
    const b = lerFm(f).base;
    if (!b) erros.push(`${rel(f)}: sem \`base\` (crie a cópia pela setup: "customizar ${rotulo}")`);
    else if (b !== sha12(original)) avisos.push(`${rel(f)}: a base mudou desde a cópia (${b} → ${sha12(original)}): compare e funda à mão`);
  };
  const achados = [".sabia/fluxo", ".sabia/template"].filter((d) => ehDir(path.join(projeto, d))).flatMap((d) => arquivosEm(path.join(projeto, d)));
  const porFluxo = new Map();
  for (const f of achados.sort(porPartes)) {
    const r = path.relative(projeto, f).split(path.sep).slice(1);  // ["fluxo"|"template", ...]
    if (path.extname(f) !== ".md") erros.push(`${rel(f)}: só arquivos .md`);
    else if (r[0] === "template") {
      // requisitos/template-<tipo>.md vale sobre o template em vigor do tipo: o do toolkit que o desvia, ou o do Sabiá
      const doTk = r[1] === "requisitos" && r.length === 3 && tem(originais, r[2]);
      const original = doTk ? originais[r[2]] : path.join(fw, "template", ...r.slice(1));
      if (r.length !== 3 || !fs.existsSync(original)) erros.push(`${rel(f)}: não é template do Sabiá`);
      else {
        comBase(f, original, `template ${r[1]}/${r[2]}`);
        if (!doTk) padroes.push(`- template \`${r[1]}/${r[2]}\`: \`.sabia/template/${r[1]}/${r[2]}\` (no lugar do da skill)`);
      }
    } else {
      const q = r.length >= 4 ? r.slice(1, 3).join(".") : null;
      if (q === null || !tem(fluxos, q)) erros.push(`${rel(f)}: não é de um fluxo do Sabiá`);
      else porFluxo.set(q, [...(porFluxo.get(q) || []), [r.slice(3), f]]);
    }
  }
  for (const [q, arqs] of porFluxo) {
    const fl = fluxos[q], linhas = [], ids = fl.passos.map((x) => x.id), nomeMestre = `${fl.fluxo}.md`;
    const mestre = arqs.find(([r]) => r.length === 1 && r[0] === nomeMestre)?.[1];
    const ops = mestre ? lerFm(mestre) : {};
    const fora = Object.keys(ops).filter((k) => !["inserir", "remover", "liberar"].includes(k)).sort();
    if (fora.length) erros.push(`${q}: no ${nomeMestre} do projeto só valem inserir, remover e liberar (não ${fora.join(", ")})`);
    if (!vazio(ops.liberar)) erros.push(`${q}: nenhuma trava pode ser liberada (${ops.liberar})`);
    let ins = ops.inserir === undefined ? [] : ops.inserir, rem = ops.remover === undefined ? [] : ops.remover;
    if (!Array.isArray(ins) || !ins.every(ehObjeto) || !Array.isArray(rem)) {
      erros.push(`${q}: inserir é uma lista de {id, depois} e remover uma lista de ids`);
      ins = []; rem = [];
    }
    const removidos = new Set(rem);
    for (const r of rem) {
      const x = fl.passos.find((y) => y.id === r);
      if (!x || !x.removivel || !vazio(x.travas)) erros.push(`${q}: o passo ${r} não pode ser removido (só passo removivel e sem trava)`);
      else linhas.push(`- passo \`${r}\`: removido neste projeto`);
    }
    const novos = ins.map((o) => o.id), inseridos = new Map();
    for (const o of ins) {
      const i = o.id, depois = o.depois;
      if (typeof i !== "string" || !ID.test(i) || ids.includes(i) || novos.filter((n) => n === i).length > 1) erros.push(`${q}: inserir ${i}: id inválido, repetido ou que já existe no fluxo`);
      else if (i === "grafo") erros.push(`${q}: inserir ${i}: id reservado (o grafo gerado do fluxo)`);  // o compilador gera references/<fluxo>/grafo.md
      else if (![...ids, ...novos].includes(depois) || removidos.has(depois) || depois === i) erros.push(`${q}: inserir ${i} depois de ${depois}: o 'depois' não existe (ou foi removido)`);
      else inseridos.set(i, depois);
    }
    const visto = new Set();
    for (const i of inseridos.keys()) {  // sem ciclo: seguindo os 'depois', chega-se a um passo do fluxo
      const cadeia = new Set();
      let k = i;
      while (inseridos.has(k) && !cadeia.has(k)) { cadeia.add(k); k = inseridos.get(k); }
      if (inseridos.has(k) && !visto.has(i)) {
        erros.push(`${q}: inserir em ciclo (${[...cadeia].sort().join(", ")})`);
        for (const c of cadeia) visto.add(c);
      }
    }
    for (const [r, f] of arqs) {
      if (r.length === 1 && r[0] === nomeMestre) continue;
      const pid = r.length === 2 && r[0] === "passos" ? r[1].replace(/\.md$/, "") : null;
      const caminho = `.sabia/fluxo/${fl.skill}/${fl.fluxo}/passos/${pid}.md`;
      if (pid === null) erros.push(`${rel(f)}: fora de passos/`);
      else if (removidos.has(pid)) erros.push(`${caminho}: o passo foi removido no ${nomeMestre} (apague a cópia ou não o remova)`);
      else if (/^## (Travas|Desvios)\b/m.test(ler(f))) erros.push(`${caminho}: \`## Travas\` e \`## Desvios\` são gerados (catálogo e prompt); tire do arquivo`);
      else if (ids.includes(pid)) {
        comBase(f, arqPasso(fl, pid), `${q}.${pid}`);
        linhas.push(`- passo \`${pid}\`: leia \`${caminho}\` (no lugar do da skill)`);
      } else if (inseridos.has(pid)) linhas.push(`- passo \`${pid}\` (inserido depois de \`${inseridos.get(pid)}\`): \`${caminho}\``);
      else erros.push(`${caminho}: não é passo de ${q} (passo novo → declare em \`inserir\` no ${nomeMestre})`);
    }
    const falta = [...inseridos.keys()].filter((i) => !existe(path.join(projeto, `.sabia/fluxo/${fl.skill}/${fl.fluxo}/passos/${i}.md`)));
    if (falta.length) erros.push(`${q}: inserido sem arquivo: ${falta.join(", ")}`);
    if (linhas.length) delta[q] = linhas;
  }
  if (erros.length) throw new Error(`override do projeto recusado (nada foi gravado):\n${erros.join("\n")}`);
  return { delta, padroes, avisos };
}

/** [pasta como o agentes.json a cita, pasta real] de um toolkit. */
function pastaDe(projeto, nome, t) {
  const pasta = (t.pasta ?? `~/.sabia/toolkits/${nome}/${t.versao}`).replace(/\/+$/, "");
  return [pasta, pasta.startsWith("~/") ? path.join(os.homedir(), pasta.slice(2)) : path.join(projeto, pasta)];
}

/** Tipos, critérios de revisão, verificacao e steering dos toolkits do projeto. O mesmo tipo ou item de critério de
 * revisão em dois toolkits é recusado. O Sabiá não compila conteúdo de toolkit. */
export function fonteToolkits(projeto, cfg, fw, fluxos) {
  const lerJson = (f) => (existe(f) ? JSON.parse(ler(f)) : {});
  const catalogo = lerJson(path.join(fw, "fluxo/tipos.json")).tipos ?? {};
  const rub = path.join(fw, "template/sa-revisar/criterios-revisao.md");
  const de = Object.fromEntries((existe(rub) ? [...ler(rub).matchAll(/^\| ([A-Z]\d+) \|/gm)].map((m) => m[1]) : []).map((r) => [`critério de revisão ${r}`, "Sabiá"]));
  const erros = [], porAgente = {}, porPasso = new Map(), extras = {}, rubricas = [], tabTipos = [], tabRubricas = [], originais = {};
  const dono = (c) => fluxos[fluxoDe(c)].d.dono;
  const novoAg = () => ({ linhas: [], skills: [] });
  const meu = (chave, nome) => {  // a primeira dona fica; a segunda é colisão
    if (tem(de, chave)) { erros.push(`toolkit ${nome}: ${chave} já é de ${de[chave]}`); return false; }
    de[chave] = `toolkit ${nome}`;
    return true;
  };
  for (const [nome, t] of Object.entries(cfg.toolkits ?? {})) {
    const [pasta, real] = pastaDe(projeto, nome, t);
    if (!existe(path.join(real, "toolkit.json"))) {
      erros.push(`toolkit ${nome}: ${pasta}/toolkit.json não encontrado (instale o toolkit ou tire-o do agentes.json)`);
      continue;
    }
    const man = lerJson(path.join(real, "toolkit.json"));
    const versao = `\`${nome}\` ${man.versao ?? ""}`.trimEnd();
    for (const [sg, q] of Object.entries(man.tipos ?? {})) {
      const tipo = catalogo[sg] ?? {};
      const ks = ["fluxo", "template"].filter((k) => ehObjeto(q) && tem(q, k));
      if (!ehObjeto(q) || vazio(tipo.desviavel) || tipo.pendente || !(man.skills ?? []).some((x) => x.caminho === q.skill)
        || ks.some((k) => typeof q[k] !== "string" || !existe(path.join(real, dentro(q[k], nome))))) {
        erros.push(`toolkit ${nome}: tipo ${sg} → ${ehObjeto(q) ? q.skill ?? "None" : q}: use {skill, fluxo, template} (fluxo e template opcionais);`
          + " o tipo tem de ser desviável e não pendente no catálogo, a skill uma das skills do toolkit"
          + (ks.length ? `, e o ${ks.join(" e o ")} arquivos da pasta do toolkit` : ""));
        continue;
      }
      // só os passos de "desviavel" do catálogo: nos outros passos de cria, o tipo é sempre do Sabiá
      const criam = tipo.desviavel.filter((c) => tem(fluxos, fluxoDe(c)));
      const papeis = man.skills.find((x) => x.caminho === q.skill).papeis ?? [];
      const aceitos = (c) => PAPEIS_DO_AGENTE[dono(c)] ?? [];
      const falta = criam.filter((c) => !papeis.some((p) => aceitos(c).includes(p)));
      if (falta.length) {
        for (const c of falta) erros.push(`toolkit ${nome}: tipo ${sg}: a skill ${q.skill} não traz o papel ${(PAPEIS_DO_AGENTE[dono(c)] ?? ["?"]).join(" ou ")} em papeis (dono do passo de desvio ${c})`);
        continue;
      }
      if (!meu(`tipo ${sg}`, nome)) continue;
      const sk = nomeSkill(q.skill);
      const fl = q.fluxo ? `\`${pasta}/${q.fluxo}\`` : "";
      const copia = `.sabia/template/requisitos/template-${sg.toLowerCase()}.md`;
      let pd;
      if (q.template && existe(path.join(projeto, copia))) {  // a cópia do projeto vale sobre o template do toolkit
        originais[`template-${sg.toLowerCase()}.md`] = path.join(real, dentro(q.template, nome));
        pd = `o template \`${copia}\` (cópia do projeto sobre \`${pasta}/${q.template}\`)`;
      } else pd = q.template ? `o template \`${pasta}/${q.template}\`` : "";
      const segue = (fl ? ` e siga ${fl}` : "") + (pd ? ` com ${pd}` : "") || " e siga as references dela";
      for (const c of criam) {  // a skill vai ao dono do passo de desvio
        const ag = dono(c);
        if (!porPasso.has(ag)) porPasso.set(ag, new Map());
        const ps = porPasso.get(ag);
        ps.set(c, [...(ps.get(c) || []), `${sg} → carregue a skill \`${sk}\`${segue}`]);
        const sks = (porAgente[ag] ??= novoAg()).skills, id = `skill://${pasta}/${q.skill}`;
        if (!sks.includes(id)) sks.push(id);
      }
      tabTipos.push(`| \`${sg}\` | \`${pasta}/${q.skill}\` | ${(fl && pd ? `${fl} com ${pd}` : fl || pd) || "—"} | ${versao} | ${criam.map((c) => `\`${c}\``).join(", ")} |`);
    }
    for (const r of man.criterios_revisao ?? []) {
      if (!(r.id && r.verificacao && ["BLOQUEANTE", "IMPORTANTE", "SUGESTÃO"].includes(r.severidade)))
        erros.push(`toolkit ${nome}: critério de revisão ${r.id ?? "?"}: precisa de id, verificacao e severidade (BLOQUEANTE, IMPORTANTE ou SUGESTÃO)`);
      else if (meu(`critério de revisão ${r.id}`, nome)) {
        rubricas.push(`\`${r.id}\`${r.tipo ? ` (${r.tipo})` : ""} ${r.severidade} — ${r.verificacao} (toolkit \`${nome}\`)`);
        tabRubricas.push(`| \`${r.id}\` | ${r.tipo || "—"} | ${r.severidade} | ${r.verificacao} | ${versao} |`);
      }
    }
    if (man.verificacao) (extras["sa-verificador"] ??= []).push(`Verificação de aceite do toolkit \`${nome}\`: ${man.verificacao}`);
    for (const s of man.steering ?? []) {
      if (!existe(path.join(real, dentro(s.caminho, nome)))) {
        erros.push(`toolkit ${nome}: steering ${s.caminho} não existe na pasta do toolkit`);
        continue;
      }
      for (const ag of unicos((s.papeis ?? []).filter((p) => tem(AGENTE_DO_PAPEL, p)).map((p) => AGENTE_DO_PAPEL[p])))
        (extras[ag] ??= []).push(`Steering do toolkit \`${nome}\`: leia \`${pasta}/${s.caminho}\` antes de começar.`);
    }
  }
  if (erros.length) throw new Error(`toolkits do projeto recusados (nada foi gravado):\n${erros.join("\n")}`);
  for (const [ag, ps] of porPasso)
    porAgente[ag].linhas.push(`Tipos com skill de toolkit (⇢ no passo de desvio do tipo): ${[...ps].map(([c, ls]) => `no passo \`${c}\`, ${ls.join("; ")}`).join("; ")}`
      + ". O artefato desse tipo sai pela skill do toolkit (ligada a você), que lê o fluxo e o template da linha pelo caminho"
      + " (sem eles, as references dela), no arquivo da coluna Arquivo do catálogo (`references/tipos.md` da skill `sabia`);"
      + " depois volte ao passo. Os demais tipos seguem o passo. O catálogo, a revisão e a aprovação continuam do Sabiá.");
  if (rubricas.length)
    (porAgente["sa-revisor"] ??= novoAg()).linhas.push(`Itens de critério de revisão dos toolkits (acrescentam aos dos critérios de revisão do artefato; nenhum troca um item do Sabiá): ${rubricas.join("; ")}.`);
  for (const [ag, ls] of Object.entries(extras)) (porAgente[ag] ??= novoAg()).linhas.push(...ls);
  // a seção Tipos com skill de toolkit do sabia.md: o que vale na sessão sem agente
  const tabela = [];
  for (const [cab, linhas] of [[["| Tipo | Skill | Fluxo e template | Toolkit | Passo de desvio |", "|---|---|---|---|---|"], tabTipos],
    [["| Item de critério de revisão | Tipo | Severidade | Verificação | Toolkit |", "|---|---|---|---|---|"], tabRubricas]])
    if (linhas.length) tabela.push(...(tabela.length ? [""] : []), ...cab, ...linhas);
  return { porAgente, tabela, originais };
}

/** O delta no prompt: os fluxos de que o agente é dono e que o projeto mudou, e os padrões trocados, para todos. */
function textoFluxos(nome, fluxos, delta, padroes) {
  const blocos = Object.entries(fluxos).filter(([q, fl]) => fl.d.dono === nome && tem(delta, q)).map(([q]) => `Fluxo \`${q}\`:\n${delta[q].join("\n")}`);
  if (padroes.length) blocos.push(padroes.join("\n"));
  return blocos.length ? `O que este projeto mudou (vale sobre o SKILL.md):\n${blocos.join("\n")}` : "";
}

/** Resolve os `passos` do agentes.json pelas skills com `passo` dos toolkit.json. */
function resolverPassos(projeto, cfg, fluxos) {
  const porAgente = {}, doToolkit = {};
  for (const e of cfg.passos ?? []) {
    if (!tem(cfg.toolkits ?? {}, e.toolkit)) throw new Error(`agentes.json: passo de toolkit sem entrada em \`toolkits\`: ${e.toolkit ?? "None"}`);
    const [pasta, real] = pastaDe(projeto, e.toolkit, cfg.toolkits[e.toolkit]);
    if (!existe(path.join(real, "toolkit.json"))) throw new Error(`toolkit ${e.toolkit}: ${pasta}/toolkit.json não encontrado (instale o toolkit ou tire-o do agentes.json)`);
    const man = JSON.parse(ler(path.join(real, "toolkit.json")));
    const sk = (man.skills ?? []).find((x) => x.caminho === e.skill && x.passo);
    if (!sk) throw new Error(`toolkit ${e.toolkit}: não há skill com \`passo\` em ${e.skill}`);
    const ext = sk.passo;
    const [dono, pid] = gancho(ext, fluxos, e.toolkit);
    const aceitos = PAPEIS_DO_AGENTE[dono] ?? [];
    if (!(sk.papeis ?? []).some((p) => aceitos.includes(p)))
      throw new Error(`toolkit ${e.toolkit}: a skill ${e.skill} não traz o papel ${(PAPEIS_DO_AGENTE[dono] ?? ["?"]).join(" ou ")} em papeis (dono do passo ${pid})`);
    const d = (porAgente[dono] ??= { skills: [], subagentes: [], passos: [] });
    d.skills.push(`skill://${pasta}/${dentro(e.skill, e.toolkit)}`);
    const comAgente = Boolean(e.agente && ext.agente);
    d.passos.push({ skill: nomeSkill(e.skill), para: ext.para, passo: pid, arquivos: ext.arquivos ?? [], agente: comAgente ? ext.agente : null });
    if (!comAgente) continue;
    d.subagentes.push({ nome: ext.agente, para: ext.para });
    const defs = Object.fromEntries((man.agentes ?? []).map((a) => [a.nome, a])), fila = [ext.agente];
    while (fila.length) {  // o subagente de um agente do toolkit herda o dono de quem o chama
      const n = fila.pop();
      if (tem(doToolkit, n)) continue;
      if (n.startsWith("sa-") || !tem(defs, n)) throw new Error(`toolkit ${e.toolkit}: agente ${n} ${n.startsWith("sa-") ? "não pode começar com sa-" : "não está em `agentes`"}`);
      const a = defs[n];
      doToolkit[n] = { dono, nome: n, descricao: a.descricao, prompt: ler(path.join(real, dentro(a.prompt, e.toolkit))),
        skills: (a.skills ?? []).map((x) => `skill://${pasta}/${dentro(x, e.toolkit)}`), subagentes: a.subagentes ?? [] };
      fila.push(...(a.subagentes ?? []));
    }
  }
  return { porAgente, doToolkit };
}

/** Os desvios de toolkit no prompt do dono: a configuração decide, nada é marcado no status.md nem no tasks.md. */
function textoPassos(passos) {
  return unicos(passos.map((x) => x.passo)).map((pid) => {
    const regras = passos.filter((y) => y.passo === pid).map((x) => {
      const quando = `\`${x.para}\`${x.arquivos.length ? ` (arquivos ${x.arquivos.map((a) => `\`${a}\``).join(", ")})` : ""}`;
      return x.agente ? `${quando} → delegue ao subagente \`${x.agente}\`, com o briefing e o contrato do \`references/passos.md\` da skill \`sabia\``
        : `${quando} → carregue a skill \`${x.skill}\` e faça o passo por ela`;
    });
    return `Desvios de toolkit no passo \`${pid}\` (⇢ na tabela do fluxo): o que casa vai ao toolkit, sem perguntar à pessoa e sem marcar no \`status.md\` nem no \`tasks.md\`: ${regras.join("; ")}.`;
  }).join("\n");
}

/** O esquema fechado do agentes.json: chave fora dele nunca é ignorada em silêncio. */
export function validarCfg(cfg, perfis) {
  const erros = [];
  const fora = Object.keys(cfg).filter((k) => !CHAVES.has(k)).sort();
  if (fora.length) erros.push(`chave fora do esquema ${pyLista(fora)}`);
  const falta = ["produto", "branch_base"].filter((k) => typeof cfg[k] !== "string" || !cfg[k]);
  if (falta.length) erros.push(`falta ${pyLista(falta)}`);
  if (!["kiro", "openspec"].includes(cfg.formato_spec ?? "kiro")) erros.push(`formato_spec '${cfg.formato_spec}': use kiro ou openspec`);
  const elm = cfg.elm ?? false;
  if (elm !== false && !(ehObjeto(elm) && Object.keys(elm).every((k) => ["pa", "bundle", "regras"].includes(k))
    && ehObjeto(elm.regras ?? {}) && Object.keys(elm.regras ?? {}).every((k) => EFEITOS.includes(k))))
    erros.push('elm: false ou {"pa", "bundle", "regras": {"allow", "ask", "deny"}}');
  for (const [n, a] of Object.entries(cfg.agentes ?? {})) {
    if (!tem(perfis.agentes, n)) erros.push(`agente desconhecido ${n}; use ${pyLista(Object.keys(perfis.agentes))}`);
    else {
      const f = Object.keys(a).filter((k) => !CHAVES_AGENTE.has(k)).sort();
      if (f.length) erros.push(`agentes.${n}: chave fora do esquema ${pyLista(f)}; use ${pyLista([...CHAVES_AGENTE].sort())}`);
    }
  }
  if (erros.length) throw new Error(`agentes.json: ${erros.join("; ")}`);
}

/** [comandos Executar, URLs de teste] da seção Verificação de aceite do .sabia/sabia.md (uma coluna por módulo). */
export function verificacao(projeto) {
  const f = path.join(projeto, ".sabia/sabia.md");
  const sec = (existe(f) ? ler(f) : "").match(/^## Verificação de aceite\n([\s\S]*?)(?=^## |(?![\s\S]))/m);
  const out = { Executar: [], "URL de teste": [] };
  for (const m of (sec ? sec[1] : "").matchAll(/^\|\s*(Executar|URL de teste)\s*\|(.*)$/gm))
    for (const [, v] of m[2].matchAll(/`([^`]+)`/g)) {
      if (v.startsWith("<") || ["não se aplica", "—"].includes(v.trim())) continue;
      if (v.includes("*")) throw new Error(`.sabia/sabia.md: Verificação de aceite › ${m[1]}: sem \`*\` (${v})`);  // o valor vira regra liberada do sa-verificador
      out[m[1]].push(v.trim());
    }
  return [out.Executar, out["URL de teste"]];
}

function valoresDo(projeto, cfg) {
  const [executar, urls] = verificacao(projeto);
  const um = (v) => (v !== null && v !== undefined ? [v] : null);
  return { BASE: [cfg.branch_base], PREFIXO_BRANCH: [cfg.prefixo_branch ?? ""], PRODUTO: [cfg.produto], GLOSSARIO: um(cfg.glossario), ADR: um(cfg.adr),
    BUNDLE: um((vazio(cfg.elm) ? {} : cfg.elm).bundle), EXECUTAR: executar, URL_TESTE: urls };
}

/** As regras do agente: o modelo dele + liberacoes + segredos e harness + as regras ELM + o MCP do projeto, preenchidos. */
function permissoes(p, perfis, cfg, valores, mcpProjeto = []) {
  const m = perfis.modelos[p.permissao];
  const perm = Object.fromEntries(CATEGORIAS.map((c) => [c, { padrao: m[c].padrao, ...Object.fromEntries(EFEITOS.map((e) => [e, [...(m[c][e] ?? [])]])) }]));
  for (const [c, regras] of Object.entries(p.liberacoes ?? {})) for (const [e, ps] of Object.entries(regras)) perm[c][e].push(...ps);
  const harness = [...perfis.harness, ...perfis.harness.map((h) => `.sabia/local/wt/*/${h}`)];  // a cópia do harness na worktree também
  perm.ler.deny.push(...perfis.segredos);
  perm.editar.deny.push(...harness, ...perfis.segredos);
  const elm = cfg.elm;
  if (vazio(elm)) perm.mcp.deny.push("elm/*");
  else if (p.permissao === "build") for (const e of EFEITOS) perm.mcp[e].push(...(elm.regras?.[e] ?? []));
  else {  // só leitura: a escrita do ELM é negada (a sa-elm.setup, passo dados)
    const r = elm.regras ?? {};
    perm.mcp.allow.push(...(r.allow ?? []));
    perm.mcp.deny.push(...(r.ask ?? []), ...(r.deny ?? []), ...ELM_SO_PRIMARIOS);
  }
  perm.mcp.allow.push(...mcpProjeto.map((x) => (x.includes("/") ? x : `${x}/*`)));
  for (const c of Object.values(perm)) for (const e of EFEITOS) c[e] = preencher(c[e], valores);
  return perm;
}

/** Os limites em texto: no Kiro valem só por aqui (tools sem regras); no opencode repetem o permission. */
function limites(perm) {
  const { ler: l, editar: ed, comandos: cm, mcp } = perm;
  const out = [`- Não leia: ${lista(l.deny)}.`];
  if (ed.padrao === "deny") out.push(ed.allow.length ? `- Edite só: ${lista(ed.allow)}; nunca ${lista(ed.deny)}.` : "- Não edite nenhum arquivo.");
  else out.push(`- Não edite: ${lista(ed.deny)}.`);
  if (cm.padrao === "deny") out.push(cm.allow.length ? `- Shell só para: ${lista(cm.allow)}; nunca ${lista(cm.deny)}.` : "- Sem shell.");
  else out.push(`- Comandos: ${["ask", "deny"].filter((e) => cm[e].length).map((e) => `${VERBO[e]} ${lista(cm[e])}`).join("; ")}.`);
  out.push(`- MCP: ${EFEITOS.filter((e) => mcp[e].length).map((e) => `${VERBO[e]} ${lista(mcp[e])}`).join("; ")}; o resto ${VERBO[mcp.padrao]}.`);
  return `Limites deste agente (no Kiro, valem só por este texto):\n${out.join("\n")}`;
}

function textoAutopilot(ap, valores) {
  const lib = preencher([...(ap.comandos?.allow ?? []), ...(ap.mcp?.allow ?? [])], valores);
  const neg = preencher([...(ap.comandos?.deny ?? []), ...(ap.mcp?.deny ?? [])], valores);
  // shortcut: o arquivo do agente é um só, com as regras do supervisionado; as do autopilot valem por este texto
  return `No autopilot (você como subagente na worktree, sem a pessoa): liberados ${lista(lib)}; negados ${lista(neg)}; todo o resto que pediria o "sim" fica negado.`;
}

/** O agente `nome` (sa-*); com `tk`, o agente do toolkit, com as permissões, as skills e os MCPs do dono do passo. */
function agente(nome, perfis, cfg, valores, fw, { ext, tk, fluxo = "" } = {}) {
  const p = perfis.agentes[nome], extra = cfg.agentes?.[nome] ?? {};
  ext ??= { skills: [], subagentes: [], passos: [] };
  const subsProjeto = tk ? [] : [...(extra.subagentes ?? []), ...ext.subagentes];
  const subagentes = tk ? tk.subagentes : [...p.subagentes, ...subsProjeto.map((s) => s.nome)];
  const skillsProjeto = unicos([...(tk ? tk.skills : []), ...(extra.skills ?? []), ...(tk ? [] : ext.skills)]);
  const perm = permissoes(p, perfis, cfg, valores, extra.mcp ?? []);
  const nomes = skillsProjeto.map(nomeSkill);
  let prompt = tk ? tk.prompt : ler(path.join(assets(fw), "agents", `${nome}.md`));
  const trocar = (de, por) => { prompt = prompt.split(de).join(por); };
  trocar("{{SKILLS_EXTRAS}}", nomes.length ? `Skills do projeto ligadas a você: ${lista(nomes)} — carregue a do artefato antes de escrevê-lo.` : "");
  trocar("{{PASSOS}}", textoPassos(ext.passos));
  trocar("{{SUBAGENTES}}", subsProjeto.length ? `Subagentes do projeto: ${subsProjeto.map((s) => `\`${s.nome}\` (${s.para})`).join(", ")}` : "");
  const partes = [prompt.trimEnd(), ...(tk ? [] : [fluxo, CHAMADA].filter(Boolean)), limites(perm)];
  if (p.autopilot && !tk) partes.push(textoAutopilot(p.autopilot, valores));
  prompt = partes.join("\n\n");
  // glossário ou ADR "não há" (null): a linha do prompt que cita o caminho sai
  prompt = prompt.split("\n").filter((l) => ![...l.matchAll(PH)].some((m) => tem(valores, m[1]) && vazio(valores[m[1]]))).join("\n");
  prompt = prompt.replace(PH, (t, n) => (vazio(valores[n]) ? t : valores[n].join(", ")));
  prompt = `${prompt.replace(/\n{3,}/g, "\n\n").trimEnd()}\n`;
  return { name: tk ? tk.nome : nome, description: tk ? tk.descricao : p.descricao, mode: tk ? "subagent" : p.mode, permissao: p.permissao, dono: nome, prompt,
    perm, skills: tk ? [] : p.skills, skills_projeto: skillsProjeto, subagentes, mcp_projeto: !vazio(extra.mcp), modelo: extra.modelo };
}

/** .kiro/agents/<nome>.json: só nomes de capability em tools, sem toolsSettings nem allowedTools. */
export function kiro(a) {
  const { perm } = a;
  const escreve = perm.editar.padrao !== "deny" || perm.editar.allow.length;
  const shell = perm.comandos.padrao !== "deny" || perm.comandos.allow.length;
  const mcp = unicos(["allow", "ask"].flatMap((e) => perm.mcp[e]).filter((m) => efeito(perm.mcp, m) !== "deny").map((m) => `@${m.replace(/\/\*$/, "")}`));
  const k = { name: a.name, description: a.description, prompt: a.prompt,
    tools: ["read", ...(escreve ? ["write"] : []), ...(shell ? ["shell"] : []), ...(a.subagentes.length ? ["subagent"] : []), ...mcp],
    resources: ["file://.kiro/steering/sabia.md", ...a.skills.map((s) => `skill://${POWER}/skills/${s}/SKILL.md`), ...a.skills_projeto],
    includeMcpJson: a.mcp_projeto, includePowers: true };
  if (a.modelo) k.model = a.modelo;
  return k;
}

/** YAML do frontmatter: strings em JSON (escalar entre aspas válido em YAML), mapas aninhados. */
function yaml(d, ind = 0) {
  return Object.entries(d).flatMap(([k, v]) => {
    const chave = " ".repeat(ind) + JSON.stringify(k);
    if (ehObjeto(v)) return [`${chave}:`, ...yaml(v, ind + 2)];
    if (Array.isArray(v)) return [`${chave}: [${v.map((x) => JSON.stringify(x)).join(", ")}]`];
    return [`${chave}: ${JSON.stringify(v)}`];
  });
}

/** Padrão de caminho no curinga simples do opencode (`*` atravessa `/`): `**\/x` pega a raiz e o aninhado. */
function oc(padrao) {
  const p = padrao.replace(/^\.\//, "");
  if (!p.startsWith("**/")) return [p.replaceAll("**", "*")];
  const resto = p.slice(3).replaceAll("**", "*");
  return [resto, `*/${resto}`];
}

/** Uma categoria no permission do opencode: o padrão primeiro, depois allow, ask e deny (a última que casa vence). */
function bloco(r, conv = (x) => [x]) {
  if (r.padrao === "deny" && !r.allow.length && !r.ask.length) return "deny";
  const d = { "*": r.padrao };
  for (const e of EFEITOS) for (const y of r[e].flatMap(conv)) { delete d[y]; d[y] = e; }
  return d;
}

/** .opencode/agents/<nome>.md: mode e permission (allow · ask · deny), com o prompt no corpo. */
export function opencode(a) {
  const { perm } = a;
  const rede = efeito(perm.comandos, "curl https://exemplo.invalido/");  // webfetch segue o curl de fora da URL de teste
  const p = { "*": perm.mcp.padrao,  // tool sem regra própria (MCP fora das listas) segue o padrão do MCP
    read: bloco(perm.ler, oc), ...Object.fromEntries(LEITURA_OC.map((t) => [t, perm.ler.padrao])),
    edit: bloco(perm.editar, oc), bash: bloco(perm.comandos),
    task: a.subagentes.length ? { "*": "deny", ...Object.fromEntries(a.subagentes.map((s) => [s, "allow"])) } : "deny",
    skill: { "*": "deny", ...Object.fromEntries([...a.skills, ...a.skills_projeto.map(nomeSkill)].map((s) => [s, "allow"])) },
    webfetch: rede, websearch: rede,
    external_directory: { "*": "ask", "~/.sabia/*": "allow", "~/.config/opencode/*": "allow" } };
  for (const e of EFEITOS) for (const x of perm.mcp[e]) { const k = x.replace("/", "_"); delete p[k]; p[k] = e; }
  const fr = { description: a.description, mode: a.mode, ...(a.modelo ? { model: a.modelo } : {}), permission: p };
  return `---\n${yaml(fr).join("\n")}\n---\n\n${a.prompt}`;
}

/** Marcador que sobrou no prompt e, no Kiro, caminho dos resources que não existe ou é absoluto. */
export function problemas(a, projeto, caminhos = true) {
  const out = unicos(a.prompt.match(/\{\{[A-Z_]+\}\}/g) ?? []).sort().map((m) => `${a.name}: sobrou ${m}`);
  for (const r of caminhos ? kiro(a).resources : []) {
    const caminho = r.split("://").slice(1).join("://");
    if (caminho.startsWith("/") || caminho.startsWith("\\") || /^[A-Za-z]:/.test(caminho) || caminho.includes("\\") || caminho.includes("$")) {
      out.push(`${a.name}: caminho absoluto ou com variável: ${r}`);
      continue;
    }
    const alvo = caminho.startsWith("~/") ? path.join(os.homedir(), caminho.slice(2)) : path.join(projeto, caminho);
    // o steering é gravado pela setup no mesmo passo, depois do "ok" ao resumo
    if (!caminho.includes("*") && r !== "file://.kiro/steering/sabia.md" && !existe(alvo)) out.push(`${a.name}: não existe: ${r}`);
  }
  return out;
}

/** Tabela markdown do que cada agente recebeu. */
export function resumo(agentes) {
  const cel = (xs) => lista(xs) || "➖";
  const linhas = ["| Agente | Mode | Permissão | Skills do Sabiá | Skills do projeto | MCP | Subagentes |", "|---|---|---|---|---|---|---|"];
  for (const a of Object.values(agentes)) {
    const { mcp } = a.perm;
    const m = [["allow", "🟢"], ["ask", "🟡"]].filter(([e]) => mcp[e].length).map(([e, ic]) => `${ic} ${lista(mcp[e])}`).join("; ") || "➖";
    const perm = a.permissao + (a.name === a.dono ? "" : ` (do ${a.dono})`);
    linhas.push(`| **${a.name}** | ${a.mode} | ${perm} | ${cel(a.skills)} | ${cel(a.skills_projeto.map(nomeSkill))} | ${m} | ${cel(a.subagentes)} |`);
  }
  return `${linhas.join("\n")}\n`;
}

/** Seções e linhas de tabela do modelo que faltam (ou sobram) no .sabia/sabia.md do projeto. */
export function conferirSabiaMd(projeto, fw) {
  const f = path.join(projeto, ".sabia", "sabia.md");
  if (!existe(f) || !ler(f).startsWith("---\ninclusion: always")) return [];  // sem o front-matter do modelo: não foi montado pela setup
  const livres = new Set(["ELM", "Desvios de toolkit", "Tipos com skill de toolkit", "Regras aprendidas"]);
  const rotulos = (texto) => {
    let sec = null;
    const out = new Set();
    for (const linha of texto.split(/\r\n|\n|\r/)) {
      if (linha.startsWith("## ")) { sec = linha.slice(3).trim(); out.add(`## ${sec}`); continue; }
      const m = linha.match(/^\|\s*([^|]+?)\s*\|/);
      if (!livres.has(sec) && m && ![...m[1]].every((c) => "-: ".includes(c)) && !m[1].includes("<")) out.add(`${sec} › ${m[1]}`);
    }
    return out;
  };
  const modelo = rotulos(ler(path.join(assets(fw), "steering", "sabia.md"))), atual = rotulos(ler(f));
  const dif = (a, b) => [...a].filter((x) => !b.has(x)).sort();
  return [["sem estas linhas do", dif(modelo, atual)], ["com linhas que não estão no", dif(atual, modelo)]].filter(([, x]) => x.length)
    .map(([o, x]) => `.sabia/sabia.md ${o} modelo (assets/steering/sabia.md): ${x.join(", ")}; monte o arquivo pelo modelo`);
}

/** {agentes, avisos, tabelaTipos}: os 5 agentes e os de toolkit, no formato interno que kiro() e opencode() traduzem. */
export function gerar(projeto, cfg, framework) {
  const fw = framework ?? padraoFw();
  const arqPerfis = path.join(assets(fw), "agents/perfis.json");
  if (!existe(arqPerfis)) throw new Error(`${fw} não tem o Sabiá instalado: rode \`sabia instalar\` ou passe --framework`);
  const perfis = JSON.parse(ler(arqPerfis));
  validarCfg(cfg, perfis);
  const { fluxos } = carregar(fw);
  if (!Object.keys(fluxos).length) throw new Error(`${fw} não tem os fluxos (fluxo/ ausente ou sem definições de fluxo): rode \`sabia instalar\` ou passe --framework`);
  const tk = fonteToolkits(projeto, cfg, fw, fluxos);
  const { delta, padroes, avisos } = override(projeto, fw, fluxos, tk.originais);
  const plugin = path.join(fw, "plugin.json");
  if (cfg.sabia && fs.existsSync(plugin)) {
    const instalado = JSON.parse(ler(plugin)).version;
    if (instalado !== cfg.sabia) avisos.push(`o projeto foi configurado com o Sabiá ${cfg.sabia} e o seu é o ${instalado}: atualize um dos dois`);
  }
  const { porAgente, doToolkit } = resolverPassos(projeto, cfg, fluxos);
  for (const [n, t] of Object.entries(tk.porAgente)) (porAgente[n] ??= { skills: [], subagentes: [], passos: [] }).skills.push(...t.skills);  // a skill do tipo vai ao dono do passo de desvio do tipo
  const valores = valoresDo(projeto, cfg), agentes = {};
  for (const n of Object.keys(perfis.agentes))
    agentes[n] = agente(n, perfis, cfg, valores, fw, { ext: porAgente[n], fluxo: [textoFluxos(n, fluxos, delta, padroes), ...(tk.porAgente[n]?.linhas ?? [])].filter(Boolean).join("\n\n") });
  for (const [n, t] of Object.entries(doToolkit)) agentes[n] = agente(t.dono, perfis, cfg, valores, fw, { tk: t });
  return { agentes, avisos, tabelaTipos: tk.tabela };
}

/** {caminho: conteúdo} de cada alvo. */
export function arquivos(agentes, projeto, alvos) {
  const out = {};
  for (const [nome, a] of Object.entries(agentes)) {
    if (alvos.includes("kiro")) out[path.join(projeto, ".kiro/agents", `${nome}.json`)] = `${JSON.stringify(kiro(a), null, 2)}\n`;
    if (alvos.includes("opencode")) out[path.join(projeto, ".opencode/agents", `${nome}.md`)] = opencode(a);
  }
  return out;
}

/** `sabia agentes base <id>`: o id do passo (sa-x.f.p), o template (sa-x/nome.md, requisitos/template-<tipo>.md) ou o caminho do template de um toolkit. */
export function baseDe(id, framework) {
  const fw = framework ?? padraoFw(), p = id.split(".");
  const fl = p.length === 3 ? carregar(fw).fluxos[p.slice(0, 2).join(".")] : undefined;
  const tk = id.startsWith("~/") ? path.join(os.homedir(), id.slice(2)) : id;
  const f = fl ? arqPasso(fl, p[2]) : path.isAbsolute(tk) ? tk : path.join(fw, "template", id);
  if (!existe(f)) throw new Error(`não existe no framework: ${id} (${f})`);
  return sha12(f);
}

/** Gera (e, com `gravar`, escreve) os agentes do projeto; devolve o texto do relatório, o resultado e os arquivos tocados. */
export function gerarProjeto({ projeto = ".", config, alvo, framework, gravar = false } = {}) {
  const raiz = path.resolve(projeto);
  let cfg;
  try {
    cfg = JSON.parse(ler(config ?? path.join(raiz, ".sabia/config/agentes.json")));
  } catch (e) {
    throw new Error(`agentes.json: ${e.message}`);
  }
  const alvos = alvo ? alvo.split(",") : cfg.alvos ?? ["kiro"];
  const fora = alvos.filter((a) => !ALVOS.includes(a)).sort();
  if (fora.length) throw new Error(`alvo desconhecido ${pyLista(fora)}; use ${ALVOS.join(", ")}`);
  const r = gerar(raiz, cfg, framework);
  const erros = Object.values(r.agentes).flatMap((a) => problemas(a, raiz, alvos.includes("kiro")));
  if (erros.length) throw new Error(erros.join("\n"));
  const linhas = [];
  for (const [f, novo] of Object.entries(arquivos(r.agentes, raiz, alvos))) {
    const antigo = existe(f) ? ler(f) : null;
    if (novo === antigo) continue;
    if (!gravar) { linhas.push(`${antigo === null ? "novo" : "alterado"} ${f}`); continue; }
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, novo);
    linhas.push(`gravado ${f}`);
  }
  if (gravar) r.avisos.push(...conferirSabiaMd(raiz, framework ?? padraoFw()));  // o sabia.md já foi gravado: a conferência é contra o do disco
  const texto = [...linhas, "", resumo(r.agentes).trimEnd(),
    ...(r.tabelaTipos.length ? ["", "Tipos com skill de toolkit (seção do sabia.md):", ...r.tabelaTipos] : []),
    ...r.avisos.map((a) => `aviso: ${a}`),
    ...alvos.flatMap((a) => ["", `O que não tem tradução no ${a}:`, ...LACUNAS[a].map((l) => `- ${l}`)])].join("\n");
  return { ...r, texto, tocados: linhas };
}
