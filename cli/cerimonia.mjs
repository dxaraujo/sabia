// `sabia retrospective` e `sabia review`: a página da cerimônia, no tema do quadro Kanban. O time entra só com o nome; a
// cerimônia fica na memória do servidor, e o `sprint-<nn>.md` só muda no botão Publicar, que pede a mensagem, grava a
// seção `## Retro` (ou `## Review`) e faz o commit e o push na branch base. Quem levantou e quem votou vai na linha.
// A retrospectiva anda em etapas que só o apresentador (quem abriu, na máquina dele) libera: pontos (cada um vê só os
// seus), agrupamento, votação (cada um vê só o seu voto), ações e lições aprendidas. O que é oculto não sai do
// servidor: cada pessoa recebe a visão dela (`visaoDe`). A review também anda em etapas do apresentador, com tudo à
// vista: o feedback de cada entrega e, depois, as novas ideias e necessidades; nela, só o apresentador registra (inclui,
// altera e remove), e os demais acompanham. A última etapa dela é a repriorização do backlog: quem apresenta, com
// `produto`, reordena e marca itens a cancelar; o `backlog.md` só muda no Publicar, no mesmo commit, pelas regras do
// quadro Kanban (`acoes.mjs`).
// Servidor node:http sem dependências, como o do quadro; com --rede, escuta na rede local para o time abrir o link.
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { randomUUID } from "node:crypto";
import { statusDoProjeto, sprintsDe, tabela, semValor } from "./status.mjs";
import { usuarioDaMaquina, prepararLote } from "./acoes.mjs";
import { CSS, tema, AVE, SOL, LUA, PALETA, CERTO, esc, linksDaRede } from "./kanban.mjs";

const MODOS = {
  retrospective: { titulo: "Retrospectiva", secao: "Retro", commit: "retrospectiva", porta: 4782 },
  review: { titulo: "Review", secao: "Review", commit: "review", porta: 4781 },
};
// os cinco grupos da retro, na ordem da página e a palavra de cada um na linha do sprint-<nn>.md (template sa-planejamento/sprint.md)
const RETRO = [
  { id: "positivo", nome: "Pontos positivos", tag: "Positivo", linha: "Positivo" },
  { id: "negativo", nome: "Pontos negativos", tag: "Negativo", linha: "Negativo" },
  { id: "melhoria", nome: "Pontos de melhoria", tag: "Melhoria", linha: "Melhoria" },
  { id: "licao", nome: "Lições aprendidas", tag: "Lição", linha: "Lição" },
  { id: "acao", nome: "Ações propostas", tag: "Ação", linha: "Ação" },
];
// os grupos em que se levanta ponto, se agrupa e se vota; ação e lição têm a etapa delas
const PONTOS = ["positivo", "negativo", "melhoria"];
// as etapas da retrospectiva, na ordem: `liberar` é o botão do apresentador que entra nela, `confirma` o que ele lê
// antes de confirmar (não há volta) e `dica` o que todos leem enquanto ela dura
export const ETAPAS = [
  { id: "pontos", nome: "Pontos", dica: "Inclua os seus pontos. Até a liberação, só você e quem apresenta veem o que você escreveu." },
  { id: "agrupar", nome: "Agrupamento", liberar: "Mostrar os pontos", confirma: "Os pontos de todos ficam à vista e ninguém mais os altera. Quem apresenta junta os repetidos ou correlatos.",
    dica: "Os pontos de todos estão à vista. Quem apresenta junta os repetidos ou correlatos num item só." },
  { id: "votar", nome: "Votação", liberar: "Abrir a votação", confirma: "O agrupamento termina e todos votam nos itens. Até a liberação, só quem apresenta vê os votos.",
    dica: "Vote nos itens. Até a liberação, só você e quem apresenta veem o seu voto." },
  { id: "acoes", nome: "Ações", liberar: "Mostrar o resultado", confirma: "A votação termina, o resultado aparece para todos e o time passa a propor as ações.",
    dica: "O resultado da votação está à vista. Proponha ações para os itens ou ações gerais." },
  { id: "licoes", nome: "Lições aprendidas", liberar: "Ir às lições aprendidas", confirma: "O cadastro das ações termina e aparecem as lições aprendidas do ciclo.",
    dica: "Quem apresenta marca Sim ou Não em cada lição: só as marcadas Sim são gravadas. Depois, publica." },
];
// as etapas da review: nada é oculto e só quem apresenta registra; a etapa diz o que se registra agora
export const ETAPAS_REVIEW = [
  { id: "feedback", nome: "Feedback", dica: "Quem apresenta registra o feedback de cada entrega; os demais acompanham na página." },
  { id: "ideias", nome: "Novas ideias e necessidades", liberar: "Ir às novas ideias e necessidades", confirma: "O feedback das entregas foi registrado. Agora entram as novas ideias e necessidades.",
    dica: "Quem apresenta registra as novas ideias e necessidades: cada uma entra no backlog como item novo, para a triagem depois." },
  { id: "backlog", nome: "Repriorização do backlog", liberar: "Ir à repriorização do backlog", confirma: "As novas ideias e necessidades foram registradas. Agora o backlog é reordenado e o que saiu do plano é cancelado.",
    dica: "Quem apresenta, com produto no equipe.json, reordena o backlog e marca o que será cancelado. Tudo é gravado no Publicar." },
];
const ETAPAS_DE = { retrospective: ETAPAS, review: ETAPAS_REVIEW };
const TERMINAIS = ["concluida", "concluido", "cancelada", "cancelado"];
// o que a etapa do backlog mudou na review: a nova ordem e os itens a cancelar, como ações do quadro (`acoes.mjs`)
const mudouBacklog = (estado) => !!estado.backlog && (!!estado.backlog.ordem || Object.keys(estado.backlog.cancelar).length > 0);
export const acoesDoBacklog = (estado) => (mudouBacklog(estado) ? [...(estado.backlog.ordem ? [{ tipo: "reordenar", ids: estado.backlog.ordem }] : []), ...Object.entries(estado.backlog.cancelar).map(([id, motivo]) => ({ tipo: "cancelar", id, motivo }))] : []);
/** A linha `- Backlog:` da `## Review`: o rastro da repriorização, com o trecho da ordem que mudou, os cancelados com o
 *  motivo e quem fez. O estado em si fica no `backlog.md`. */
function linhaDoBacklog(dados, estado) {
  const b = estado.backlog, antes = b.itens.map((i) => i.id), partes = [];
  if (b.ordem) { const de = b.ordem.findIndex((id, k) => id !== antes[k]), ate = b.ordem.findLastIndex((id, k) => id !== antes[k]); partes.push(`ordem ${b.ordem.slice(de, ate + 1).join(", ")}`); }
  for (const [id, motivo] of Object.entries(b.cancelar)) partes.push(`cancelada ${id} (${motivo})`);
  return `- Backlog: ${partes.join(" · ")} — por ${dados.publicar?.usuario?.usuario ?? "?"}`;
}
const ETAPA_DE = { acao: "acoes", licao: "licoes" };  // a etapa em que o grupo é de todos (os pontos: a primeira)
const linhaDe = (i) => `${RETRO.find((g) => g.id === i.grupo).linha}: ${i.texto}`;
const votavel = (i) => PONTOS.includes(i.grupo) && !i.em_grupo;
// o grupo das novas ideias e necessidades da review
const IDEIA = "ideia", LINHA_IDEIA = "ideia ou necessidade";
const CONCLUIDOS = ["concluida", "concluido"];
const PRINCIPAL = { fatia: "desenvolvimento", bug: "desenvolvimento", "sustentação": "atendimento", "épico": "especificação" };
const ehData = (x) => /^\d{4}-\d{2}-\d{2}$/.test(x ?? "");
const dias = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
// o texto da pessoa vira uma linha de lista do .md: sem quebra, sem barra vertical e sem o separador das partes
const limpo = (x, max = 280) => String(x ?? "").replace(/[|\r\n]+/g, " ").replace(/ · /g, " - ").replace(/\s+/g, " ").trim().slice(0, max);
// o nome da pessoa vai dentro da linha do ponto: sem os sinais que separam as partes dela
const nomeLimpo = (x) => limpo(x, 40).replace(/[(),;]|—/g, " ").replace(/\s+/g, " ").trim();
export const chaveDe = (nome) => String(nome ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const votosDe = (i) => i.votos.length + (i.base ?? 0);
const plural = (n) => `${n} voto${n === 1 ? "" : "s"}`;

/** Os números do ciclo pelas linhas da sprint: por trabalho, quantas linhas, as concluídas até o fim da sprint, as
 *  concluídas depois, as abertas e o lead time médio (concluida_em − iniciada_em). */
export function numerosDaSprint(sprint) {
  return ["especificação", "desenvolvimento", "atendimento"].map((trabalho) => {
    const ls = sprint.itens.filter((x) => x.Trabalho === trabalho), fechadas = ls.filter((x) => ehData(x.concluida_em));
    const leads = fechadas.filter((x) => ehData(x.iniciada_em)).map((x) => dias(x.iniciada_em, x.concluida_em));
    return { trabalho, linhas: ls.length, no_prazo: fechadas.filter((x) => x.concluida_em <= sprint.fim).length, depois: fechadas.filter((x) => x.concluida_em > sprint.fim).length,
      abertas: ls.length - fechadas.length, lead_medio: leads.length ? Math.round(10 * leads.reduce((a, b) => a + b, 0) / leads.length) / 10 : null };
  }).filter((n) => n.linhas);
}

const TERMINAIS_OK = ["concluida", "concluido"];
const norma = (x) => String(x ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** As Lições aprendidas dos itens concluídos da sprint, candidatas a Regra aprendida: da tabela Lição do `status.md`
 *  da fatia (Kiro `.kiro/specs/<id>-…/`, OpenSpec `openspec/changes/<id>-…/` ou o archive) e do registro de
 *  Sustentação. O texto do ponto é a regra proposta (sem ela, a lição); `ja_esta` marca a que já é Regra aprendida do
 *  `.sabia/sabia.md`. A lição do MR da trilha trivial não é lida aqui. */
export function licoesDoCiclo(raiz, sprint, itens) {
  const ler = (f) => { try { return fs.readFileSync(f, "utf8"); } catch { return ""; } };
  const dirs = (d) => { try { return fs.readdirSync(path.join(raiz, d)); } catch { return []; } };
  const sabiaMd = ler(path.join(raiz, ".sabia/sabia.md")), regras = lerSecao(sabiaMd, "Regras aprendidas").filter((l) => /^- /.test(l)).map((l) => norma(l.slice(2).split(" · ")[0]));
  const out = [];
  for (const id of new Set(sprint.itens.map((x) => x.Item))) {
    const item = itens.find((c) => c.id === id);
    if (!item || !TERMINAIS_OK.includes(item.status)) continue;
    const pre = id.toLowerCase() + "-", arquivos = [
      ...dirs(".kiro/specs").filter((d) => d.toLowerCase().startsWith(pre)).map((d) => path.join(".kiro/specs", d, "status.md")),
      ...dirs("openspec/changes").filter((d) => d.toLowerCase().startsWith(pre)).map((d) => path.join("openspec/changes", d, "status.md")),
      ...dirs("openspec/changes/archive").filter((d) => d.toLowerCase().includes("-" + pre)).map((d) => path.join("openspec/changes/archive", d, "status.md")),
      ...dirs(".sabia/planejamento/sustentacao").filter((d) => d.toLowerCase().startsWith(pre)).map((d) => path.join(".sabia/planejamento/sustentacao", d)),
    ];
    for (const arq of arquivos) for (const l of tabela(ler(path.join(raiz, arq)), "Lição")) {
      if (semValor(l["Lição"])) continue;
      const proposta = l["Regra proposta"], temRegra = !semValor(proposta) && !/^—/.test(proposta.trim());
      const texto = limpo(temRegra ? proposta : l["Lição"]);
      if (texto && !out.some((x) => x.origem === id && x.texto === texto)) out.push({ origem: id, texto, detalhe: temRegra ? limpo(l["Lição"], 400) : null, ja_esta: regras.includes(norma(texto)) });
    }
  }
  return out;
}

/** Junta as lições do ciclo aos pontos da cerimônia: a que já está na `## Retro` (marcada Sim) ganha o detalhe; a que
 *  não está entra sem resposta (`manter: null`), para o Sim ou Não do apresentador na página. */
export function juntarLicoes(estado, licoes) {
  for (const l of licoes) {
    const ja = estado.itens.find((i) => i.grupo === "licao" && i.texto === l.texto && (i.origem ?? l.origem) === l.origem);
    if (ja) Object.assign(ja, { origem: l.origem, detalhe: l.detalhe, ja_esta: l.ja_esta, do_ciclo: true });
    else estado.itens.push({ id: randomUUID().slice(0, 8), grupo: "licao", texto: l.texto, autor: null, em: estado.itens.length, votos: [], manter: null, origem: l.origem, detalhe: l.detalhe, ja_esta: l.ja_esta, do_ciclo: true });
  }
  return estado;
}

/** O resumo do ciclo para o painel da retro: conclusão (linhas concluídas sobre as da sprint), o que fechou até o
 *  fim da sprint, a vazão por trabalho, o lead time médio do desenvolvimento, o SLE medido nas linhas de
 *  desenvolvimento e atendimento, os dias além do fim e a parte do atendimento contra a reserva de capacidade. */
export function resumoDaSprint(sprint, { sle = null, reservaPct = null } = {}) {
  const ls = sprint.itens, fechadas = ls.filter((x) => ehData(x.concluida_em)), pct = (a, b) => (b ? Math.round(100 * a / b) : null);
  const de = (t) => fechadas.filter((x) => x.Trabalho === t), media = (v) => (v.length ? Math.round(10 * v.reduce((a, b) => a + b, 0) / v.length) / 10 : null);
  const lead = (xs) => xs.filter((x) => ehData(x.iniciada_em)).map((x) => dias(x.iniciada_em, x.concluida_em));
  const noPrazo = fechadas.filter((x) => x.concluida_em <= sprint.fim).length, ultima = fechadas.map((x) => x.concluida_em).sort().at(-1) ?? null;
  const medidos = lead([...de("desenvolvimento"), ...de("atendimento")]), atend = ls.filter((x) => x.Trabalho === "atendimento").length;
  return { linhas: ls.length, itens: new Set(ls.map((x) => x.Item)).size, concluidas: fechadas.length, no_prazo: noPrazo, depois: fechadas.length - noPrazo, abertas: ls.length - fechadas.length,
    pct_conclusao: pct(fechadas.length, ls.length), pct_no_prazo: pct(noPrazo, ls.length),
    vazao: { desenvolvimento: de("desenvolvimento").length, atendimento: de("atendimento").length, "especificação": de("especificação").length },
    lead_medio: { desenvolvimento: media(lead(de("desenvolvimento"))), atendimento: media(lead(de("atendimento"))), "especificação": media(lead(de("especificação"))) },
    sle: sle && medidos.length ? { dias: sle.dias, alvo: sle.percentual, medidos: medidos.length, dentro: medidos.filter((d) => d <= sle.dias).length, pct: pct(medidos.filter((d) => d <= sle.dias).length, medidos.length) } : null,
    ultima_conclusao: ultima, dias_alem: ultima && ultima > sprint.fim ? dias(sprint.fim, ultima) : 0,
    atendimento: { linhas: atend, pct: pct(atend, ls.length), reserva_pct: reservaPct } };
}

/** Se a máquina pode publicar (commit e push): quem está nela é da equipe e o projeto está na branch base. */
export function podePublicar(raiz, exec, usuario) {
  if (!usuario) return { ok: false, motivo: "seu usuário do git não está no equipe.json" };
  const atual = exec("git", ["-C", raiz, "rev-parse", "--abbrev-ref", "HEAD"]);
  if (atual.status !== 0) return { ok: false, motivo: "a pasta não é um repositório git" };
  let base = null;
  try { base = JSON.parse(fs.readFileSync(path.join(raiz, ".sabia/config/agentes.json"), "utf8")).branch_base ?? null; } catch { /* sem agentes.json, vale a branch atual */ }
  if (base && atual.stdout.trim() !== base) return { ok: false, motivo: `o projeto está na branch ${atual.stdout.trim()}; a cerimônia publica só na ${base}` };
  return { ok: true, motivo: null };
}

/** O que a página desenha: a sprint da cerimônia (a aberta, a de maior chave), os grupos em que se inclui ponto e,
 *  na retro, os números do ciclo. Na review, um grupo por entrega (a fatia, o bug e o atendimento cujo trabalho principal
 *  foi concluído na sprint, e o épico concluído ou com entrega no ciclo) e o das novas ideias e necessidades. */
export function cerimoniaDoProjeto({ projeto = ".", modo, exec, agora = new Date(), usuario = null }) {
  if (!MODOS[modo]) throw new Error(`cerimônia desconhecida: ${modo}`);
  const st = statusDoProjeto({ projeto, exec, agora, usuario }), sprint = sprintsDe(projeto, agora.toISOString().slice(0, 10))[0];
  if (!sprint) throw new Error("não há sprint: planeje pela sa-planejamento.sprint");
  const pessoas = st.quadro.pessoas, nome = (u) => pessoas[u] ?? u;
  let reservaPct = null;
  try { reservaPct = JSON.parse(fs.readFileSync(path.join(projeto, ".sabia/planejamento/acordos.json"), "utf8")).reserva_capacidade_pct ?? null; } catch { /* sem acordos, sem a reserva */ }
  let grupos;
  if (modo === "retrospective") grupos = RETRO.map((g) => ({ id: g.id, nome: g.nome, tag: g.tag, cor: g.id, dono: g.id === "acao" }));
  else {
    const itens = st.quadro.itens, vistos = new Set(), dia = (d) => `${d.slice(8)}/${d.slice(5, 7)}`, porId = (a, b) => a.id.localeCompare(b.id, "en", { numeric: true });
    const grupo = (item, sub, mais = {}) => { const mr = item.mesclado ?? item.mr; return { id: item.id, nome: `${item.id} · ${item.titulo ?? ""}`, tag: "Feedback", cor: "feedback", sub, mr: mr?.url ? { iid: mr.iid, url: mr.url } : null, ...mais }; };
    // a fatia, o bug e o atendimento entregues: o trabalho principal concluído na sprint
    const entregas = sprint.itens.flatMap((l) => {
      const item = itens.find((c) => c.id === l.Item);
      if (!item || item.tipo === "épico" || vistos.has(l.Item) || !CONCLUIDOS.includes(item.status) || l.Trabalho !== PRINCIPAL[item.tipo] || !ehData(l.concluida_em)) return [];
      vistos.add(l.Item);
      return [grupo(item, [item.tipo, item.responsavel && nome(item.responsavel), `concluída em ${dia(l.concluida_em)}`].filter(Boolean).join(" · "), { pai: item.pai })];
    });
    // o épico é entrega quando foi concluído no ciclo, quando a especificação dele fechou na sprint ou quando teve fatia entregue nela
    const epicos = itens.filter((c) => c.tipo === "épico").flatMap((ep) => {
      const filhas = itens.filter((c) => c.pai === ep.id && !["cancelada", "cancelado"].includes(c.status)), feitas = filhas.filter((c) => CONCLUIDOS.includes(c.status)).length;
      const concluido = CONCLUIDOS.includes(ep.status) && ehData(ep.concluida_em) && ep.concluida_em >= sprint.inicio;
      const especificado = sprint.itens.some((l) => l.Item === ep.id && l.Trabalho === "especificação" && ehData(l.concluida_em));
      if (!concluido && !especificado && !entregas.some((g) => g.pai === ep.id)) return [];
      return [grupo(ep, concluido ? `épico · concluído em ${dia(ep.concluida_em)}` : `épico · em andamento · ${feitas} de ${filhas.length} ${filhas.length === 1 ? "fatia" : "fatias"}`)];
    });
    // o épico vem antes das entregas dele
    const doEpico = (g) => !!g.pai && epicos.some((e) => e.id === g.pai);
    grupos = [...epicos, ...entregas.filter((g) => !doEpico(g))].sort(porId).flatMap((g) => [g, ...entregas.filter((f) => f.pai === g.id).sort(porId).map((f) => ({ ...f, filho: true, sub: `${f.sub} · do ${g.id}` }))]);
    grupos.push({ id: IDEIA, nome: "Novas ideias e necessidades", tag: "Novo", cor: "ideia", sub: "cada uma entra no backlog como item novo, para a triagem" });
  }
  return { versao: 1, sabia: st.sabia, projeto: st.projeto, gerado_em: st.gerado_em, modo, titulo: MODOS[modo].titulo, secao: MODOS[modo].secao, votos: modo === "retrospective", etapas: ETAPAS_DE[modo],
    sprint: { chave: sprint.chave, inicio: sprint.inicio, fim: sprint.fim, meta: sprint.meta, arquivo: sprint.arquivo }, pessoas, grupos,
    numeros: modo === "retrospective" ? numerosDaSprint(sprint) : [], sle: st.quadro.sle ?? null,
    // o backlog da repriorização (review): os itens abertos, na ordem do backlog.md; cancela-se aqui só o que ainda não
    // está em andamento (o resto é da sa-status.situacao e, o épico com fatia aberta, da sa-refinar.ajustar)
    backlog: modo !== "review" ? [] : st.quadro.itens.filter((c) => !TERMINAIS.includes(c.status) && c.status !== "sem-dados").map((c) => ({ id: c.id, titulo: c.titulo, tipo: c.tipo, status: c.status, na_sprint: c.na_sprint,
      cancelavel: c.status !== "em-andamento" && c.motivo?.de !== "em-andamento" && !(c.tipo === "épico" && st.quadro.itens.some((f) => f.pai === c.id && !TERMINAIS.includes(f.status))) })),
    licoes: modo === "retrospective" ? licoesDoCiclo(projeto, sprint, st.quadro.itens) : [],
    resumo: modo === "retrospective" ? resumoDaSprint(sprint, { sle: st.quadro.sle ?? null, reservaPct }) : null,
    publicar: { usuario, ...podePublicar(projeto, exec, usuario) } };
}

/** O corpo da seção `## <titulo>` do .md (as linhas entre o título e o próximo `## `), sem as vazias. */
export function lerSecao(texto, titulo) {
  const ls = texto.split("\n"), i = ls.findIndex((l) => l.trim() === `## ${titulo}`);
  if (i < 0) return [];
  let fim = ls.findIndex((l, k) => k > i && /^## /.test(l));
  if (fim < 0) fim = ls.length;
  return ls.slice(i + 1, fim).filter((l) => l.trim());
}

/** Troca o corpo da seção `## <titulo>` pelas `linhas` (a seção que falta entra no fim) e mantém as linhas dela que
 *  casam com `manter` (a `- Números:` da retro, que é do passo `fechar`). Devolve o texto novo. */
export function trocarSecao(texto, titulo, linhas, manter = null) {
  const ls = texto.replace(/\n+$/, "").split("\n"), arejado = ls.some((l, k) => /^## /.test(l) && ls[k + 1]?.trim() === "" && ls[k + 2] !== undefined);
  let i = ls.findIndex((l) => l.trim() === `## ${titulo}`);
  if (i < 0) { if (arejado) ls.push(""); ls.push(`## ${titulo}`); i = ls.length - 1; }
  let fim = ls.findIndex((l, k) => k > i && /^## /.test(l));
  if (fim < 0) fim = ls.length;
  const mantidas = manter ? ls.slice(i + 1, fim).filter((l) => manter.test(l)) : [];
  const corpo = [...linhas, ...mantidas], resto = ls.slice(fim);
  return [...ls.slice(0, i + 1), ...(arejado && corpo.length ? [""] : []), ...corpo, ...(arejado && resto.length ? [""] : []), ...resto].join("\n") + "\n";
}

const ordenados = (itens) => [...itens].sort((a, b) => votosDe(b) - votosDe(a) || (a.em ?? 0) - (b.em ?? 0));
const votosTxt = (i) => (votosDe(i) ? `${plural(votosDe(i))}${i.votos.length ? ` (${i.votos.map((v) => v.nome).join(", ")})` : ""}` : "");

/** As linhas que a cerimônia grava na seção: os pontos pela ordem dos votos, com quem levantou e quem votou — o
 *  sprint-<nn>.md guarda tudo, sem arquivo à parte. Retro: `- Positivo: … · por <autor> · <n> votos (<nome>, <nome>)`,
 *  com `Negativo` e `Melhoria` do mesmo jeito; o grupo é a linha do título com os votos e, recuados abaixo dela, os
 *  pontos que ele junta (`  - <ponto> · por <autor>`); `- Lição: … · origem <id>` só para a lição marcada Sim; e
 *  `- Ação: … · sobre <Negativo: título do item> · por <autor> · dono <usuario>`. Review: `- <id> · <feedback> — por
 *  <autor>; <feedback> — por <autor>` ou `- <id> · sem feedback`, uma linha por entrega, e `- ideia ou necessidade ·
 *  … — por <autor>`, com o `(<id>)` no fim depois do cadastro, e `- Backlog: ordem <ids> · cancelada <id> (<motivo>) —
 *  por <usuario>` quando a repriorização mudou o backlog. */
export function linhasDaSecao(dados, estado) {
  const doGrupo = (g) => (dados.votos ? ordenados : (x) => x)(estado.itens.filter((i) => i.grupo === g));
  if (dados.modo === "retrospective") return RETRO.flatMap((g) => doGrupo(g.id).filter((i) => !i.em_grupo && (g.id !== "licao" || i.manter === true)).flatMap((i) => {
    const alvo = i.sobre && estado.itens.find((x) => x.id === i.sobre && votavel(x));
    const linha = [`- ${g.linha}: ${i.texto}`, i.origem && `origem ${i.origem}`, alvo && `sobre ${linhaDe(alvo)}`, i.autor && `por ${i.autor}`, i.dono && `dono ${i.dono}`, PONTOS.includes(g.id) && votosTxt(i)].filter(Boolean).join(" · ");
    const membros = i.agrupa ? estado.itens.filter((m) => m.em_grupo === i.id).sort((a, b) => (a.em ?? 0) - (b.em ?? 0)) : [];
    return [linha, ...membros.map((m) => `  - ${m.texto}${m.autor ? ` · por ${m.autor}` : ""}`)];
  }));
  const com = (i) => `${i.texto}${i.autor ? ` — por ${i.autor}` : ""}${i.cadastrado ? ` (${i.cadastrado})` : ""}`;
  return [...dados.grupos.flatMap((g) => (g.id === IDEIA ? doGrupo(IDEIA).map((i) => `- ${LINHA_IDEIA} · ${com(i)}`) : [`- ${g.id} · ${doGrupo(g.id).map(com).join("; ") || "sem feedback"}`])),
    ...(mudouBacklog(estado) ? [linhaDoBacklog(dados, estado)] : [])];
}

/** Os pontos que estão na seção do .md, com o autor e os votos de cada linha: é de onde a cerimônia parte. O voto sem
 *  nome (linha escrita à mão) conta como base do ponto. Na retro, a linha recuada é ponto do
 *  grupo da linha acima, toda `- Lição:` gravada é lição marcada Sim e o `sobre …` da ação volta a apontar o item. Na
 *  review, o `(<id>)` no fim da ideia ou necessidade já cadastrada fica em `cadastrado`. */
export function importarSecao(dados, texto) {
  const itens = [], novo = (grupo, t, mais = {}) => { if (!t) return null; itens.push({ id: randomUUID().slice(0, 8), grupo, texto: t, autor: null, em: itens.length, votos: [], ...mais }); return itens.at(-1); };
  let ultimo = null;
  for (const l of lerSecao(texto, dados.secao)) {
    if (dados.modo === "retrospective") {
      const sub = l.match(/^\s+- (.*)$/);
      if (sub) {
        if (!ultimo || !PONTOS.includes(ultimo.grupo)) continue;
        const [t, ...partes] = sub[1].trim().split(" · "), por = partes.map((x) => x.match(/^por (.+)$/)).find(Boolean);
        if (novo(ultimo.grupo, [t, ...partes.filter((x) => !/^por /.test(x))].join(" - ").trim(), { em_grupo: ultimo.id, ...(por ? { autor: por[1].trim() } : {}) })) ultimo.agrupa = true;
        continue;
      }
      const m = l.match(/^- (Positivo|Negativo|Melhoria|Lição|Ação): (.*)$/);
      if (!m) { ultimo = null; continue; }
      const grupo = RETRO.find((g) => g.linha === m[1]).id;
      const [primeira, ...partes] = m[2].trim().split(" · "), mais = {}, textos = [primeira];
      for (const parte of partes) {
        const por = parte.match(/^por (.+)$/), dono = parte.match(/^dono (\S+)$/), origem = parte.match(/^origem (\S+)$/), v = PONTOS.includes(grupo) && parte.match(/^(\d+) votos?(?: \((.*)\))?$/), sobre = grupo === "acao" && parte.match(/^sobre (.+)$/);
        if (por) mais.autor = por[1].trim();
        else if (dono) mais.dono = dono[1];
        else if (origem) mais.origem = origem[1];
        else if (sobre) mais.sobre = sobre[1].trim();
        else if (v) {
          mais.votos = (v[2] ?? "").split(",").map((n) => n.trim()).filter((n) => chaveDe(n)).map((n) => ({ chave: chaveDe(n), nome: n }));
          if (+v[1] > mais.votos.length) mais.base = +v[1] - mais.votos.length;
        } else textos.push(parte);
      }
      if (grupo === "licao") mais.manter = true;
      ultimo = novo(grupo, textos.join(" - ").trim(), mais);
    } else {
      const m = l.match(/^- (.+?) · (.*)$/);
      if (!m) continue;
      const grupo = m[1] === LINHA_IDEIA ? IDEIA : m[1];
      if (!dados.grupos.some((g) => g.id === grupo) || m[2].trim() === "sem feedback") continue;
      for (let parte of grupo === IDEIA ? [m[2]] : m[2].split("; ")) {
        // o id que o cadastro pôs no fim da linha não é parte do nome de quem levantou
        const id = grupo === IDEIA ? parte.match(/ \(([A-Za-zÀ-ú]+-\d+)\)\s*$/) : null;
        if (id) parte = parte.slice(0, id.index);
        const por = parte.match(/ — por (.+)$/);
        novo(grupo, (por ? parte.slice(0, por.index) : parte).trim(), { ...(por ? { autor: por[1].trim() } : {}), ...(id ? { cadastrado: id[1] } : {}) });
      }
    }
  }
  // o `sobre <Negativo: título>` da ação aponta o item pela linha dele; sem o item, o trecho volta ao texto da ação
  for (const i of itens) if (typeof i.sobre === "string") {
    const alvo = itens.find((x) => votavel(x) && linhaDe(x) === i.sobre);
    if (alvo) i.sobre = alvo.id; else { i.texto = `${i.texto} - sobre ${i.sobre}`; delete i.sobre; }
  }
  return itens;
}

/** A retrospectiva, etapa a etapa (`estado.etapa`): o que cada pessoa pode fazer depende da etapa e de ser ou não o
 *  apresentador. Ponto e ação entram na etapa de cada um (pontos · ações) e só o autor altera ou remove, enquanto ela
 *  dura; depois, só o apresentador inclui, sem alterar. A lição não se inclui: é a dos itens concluídos do ciclo.
 *  Agrupar, liberar a próxima etapa e o Sim ou Não da lição são do apresentador. Vota-se só na etapa da votação, no
 *  ponto solto ou no grupo. */
function aplicarRetro(estado, acao, dados, agora, { nome, chave, apresentador }) {
  const n = Math.max(0, ETAPAS.findIndex((e) => e.id === estado.etapa)), etapa = ETAPAS[n].id, nDe = (g) => ETAPAS.findIndex((e) => e.id === (ETAPA_DE[g] ?? "pontos"));
  const exige = (ok, msg) => { if (!ok) throw new Error(msg); };
  const soApresentador = () => exige(apresentador, "isso é de quem apresenta a retrospectiva");
  const achar = (id) => { const i = estado.itens.find((x) => x.id === id); exige(i, "esse ponto não existe mais"); return i; };
  const meu = (i) => !!i.autor && chaveDe(i.autor) === chave;
  // o ponto repetido: enquanto os pontos estão ocultos, só entre os da própria pessoa (os dos outros, o agrupamento junta)
  const repetido = (grupo, texto, menos = null) => estado.itens.some((i) => i !== menos && i.grupo === grupo && i.texto === texto && !i.em_grupo && (etapa !== "pontos" || !PONTOS.includes(grupo) || meu(i)));
  const donoDe = (g, d) => { const dono = g === "acao" && d ? String(d) : null; exige(!dono || dono in dados.pessoas, `${dono} não está no equipe.json`); return dono; };
  if (acao.tipo === "avancar") {
    soApresentador();
    exige(acao.de === etapa, "a etapa já mudou: confira a página");
    exige(n < ETAPAS.length - 1, "a retrospectiva já está na última etapa");
    estado.etapa = ETAPAS[n + 1].id;
    return;
  }
  if (acao.tipo === "incluir") {
    const g = dados.grupos.find((x) => x.id === acao.grupo);
    exige(g, "grupo desconhecido");
    // a lição não se cria na página: vem dos itens concluídos do ciclo, para não virar Regra aprendida sem origem
    exige(g.id !== "licao", "as lições aprendidas vêm dos itens concluídos do ciclo: na página, só o Sim ou Não");
    exige(n >= nDe(g.id), "as ações entram depois da votação");
    exige(n === nDe(g.id) || apresentador, `a etapa ${ETAPAS[nDe(g.id)].nome} terminou: agora só quem apresenta inclui`);
    const texto = limpo(acao.texto);
    exige(texto, "escreva o ponto");
    exige(!repetido(g.id, texto), "esse ponto já está na lista");
    exige(estado.itens.length < 500, "a cerimônia chegou a 500 pontos: remova algum antes de incluir");
    const dono = donoDe(g.id, acao.dono), alvo = g.id === "acao" && acao.sobre ? achar(acao.sobre) : null;
    exige(!alvo || votavel(alvo), "a ação é atrelada a um item ou a um grupo");
    estado.itens.push({ id: randomUUID().slice(0, 8), grupo: g.id, texto, autor: nome, em: agora, votos: [], ...(dono ? { dono } : {}), ...(alvo ? { sobre: alvo.id } : {}) });
    return;
  }
  if (acao.tipo === "agrupar" || acao.tipo === "editar-grupo") {
    soApresentador();
    exige(etapa === "agrupar", "os grupos são da etapa Agrupamento");
    const grupo = acao.tipo === "editar-grupo" ? achar(acao.id) : null;
    exige(!grupo || grupo.agrupa, "esse item não é um grupo");
    const membros = [...new Set(Array.isArray(acao.ids) ? acao.ids : [])].map(achar);
    exige(membros.length >= 2, "o grupo junta pelo menos dois pontos");
    exige(membros.every((m) => PONTOS.includes(m.grupo) && !m.agrupa && (!m.em_grupo || m.em_grupo === grupo?.id)), "só entra em grupo o ponto que está solto");
    exige(membros.every((m) => m.grupo === membros[0].grupo) && (!grupo || grupo.grupo === membros[0].grupo), "o grupo junta pontos da mesma categoria");
    const titulo = limpo(acao.titulo);
    exige(titulo, "escolha o título do grupo");
    exige(!estado.itens.some((i) => i !== grupo && !membros.includes(i) && i.grupo === membros[0].grupo && !i.em_grupo && i.texto === titulo), "já existe um item com esse título");
    const g = grupo ?? { id: randomUUID().slice(0, 8), grupo: membros[0].grupo, texto: titulo, agrupa: true, autor: null, em: Math.min(...membros.map((m) => m.em ?? 0)), votos: [] };
    g.texto = titulo;
    if (!grupo) estado.itens.push(g);
    for (const i of estado.itens) if (i.em_grupo === g.id) delete i.em_grupo;
    for (const m of membros) m.em_grupo = g.id;
    return;
  }
  const item = achar(acao.id);
  if (acao.tipo === "desagrupar") {
    soApresentador();
    exige(etapa === "agrupar", "os grupos são da etapa Agrupamento");
    exige(item.agrupa, "esse item não é um grupo");
    for (const i of estado.itens) if (i.em_grupo === item.id) delete i.em_grupo;
    estado.itens.splice(estado.itens.indexOf(item), 1);
  } else if (acao.tipo === "votar") {
    exige(etapa === "votar", n < ETAPAS.findIndex((e) => e.id === "votar") ? "a votação ainda não foi liberada" : "a votação terminou");
    exige(votavel(item), "vota-se no ponto ou no grupo");
    const k = item.votos.findIndex((v) => v.chave === chave);
    if (k >= 0) item.votos.splice(k, 1); else item.votos.push({ chave, nome });
  } else if (acao.tipo === "manter") {
    soApresentador();
    exige(etapa === "licoes" && item.grupo === "licao", "o Sim ou Não é das lições aprendidas, na última etapa");
    exige(!item.ja_esta, "essa lição já é Regra aprendida");
    item.manter = acao.valor === true ? true : acao.valor === false ? false : null;
  } else if (acao.tipo === "editar" || acao.tipo === "remover") {
    exige(!item.do_ciclo, "a lição do ciclo não se altera nem se remove: marque Não para não mantê-la");
    exige(!item.agrupa, "o grupo se altera pelo agrupamento");
    exige(n === nDe(item.grupo), `a etapa ${ETAPAS[nDe(item.grupo)].nome} terminou: nada mais se altera`);
    exige(meu(item), "só quem criou altera ou remove");
    if (acao.tipo === "remover") return void estado.itens.splice(estado.itens.indexOf(item), 1);
    const texto = limpo(acao.texto);
    exige(texto, "escreva o ponto");
    exige(!repetido(item.grupo, texto, item), "esse ponto já está na lista");
    const dono = donoDe(item.grupo, acao.dono);
    item.texto = texto;
    if (item.grupo === "acao") { if (dono) item.dono = dono; else delete item.dono; }
  } else throw new Error("ação desconhecida");
}

/** O que cada pessoa recebe do estado da retrospectiva. O apresentador recebe tudo. Os demais: na etapa dos pontos, só
 *  os pontos que a própria pessoa levantou; na votação, só o próprio voto em cada item; e a ação e a lição só a partir
 *  da etapa delas. É o que mantém oculto o que ainda não foi liberado: o resto não sai do servidor. */
export function visaoDe(estado, { chave = null, apresentador = false } = {}) {
  const n = ETAPAS.findIndex((e) => e.id === estado.etapa);
  if (n < 0 || apresentador) return estado;
  const nDe = (g) => ETAPAS.findIndex((e) => e.id === (ETAPA_DE[g] ?? "pontos"));
  let itens = estado.itens.filter((i) => n >= nDe(i.grupo));
  if (estado.etapa === "pontos") itens = itens.filter((i) => !!chave && !!i.autor && chaveDe(i.autor) === chave);
  if (estado.etapa === "votar") itens = itens.map(({ base, ...i }) => ({ ...i, votos: i.votos.filter((v) => v.chave === chave) }));
  return { ...estado, itens };
}

/** A review, etapa a etapa: o feedback entra em cada entrega desde a primeira etapa e as novas ideias e necessidades a
 *  partir da segunda. Só o apresentador registra: inclui (dizendo de quem é, em `autor`), altera e remove; os demais
 *  acompanham. Não há votação. Na última etapa, o apresentador com `produto` reordena o backlog (`ordenar`) e marca ou
 *  desmarca itens a cancelar (`cancelar` com o motivo, `manter`): fica em `estado.backlog` até o Publicar. */
function aplicarReview(estado, acao, dados, agora, { nome, apresentador }) {
  const n = Math.max(0, ETAPAS_REVIEW.findIndex((e) => e.id === estado.etapa)), etapa = ETAPAS_REVIEW[n].id, nDe = (g) => (g === IDEIA ? 1 : 0);
  const exige = (ok, msg) => { if (!ok) throw new Error(msg); };
  const textoDe = (x) => limpo(x).replace(/;/g, ",").replace(/ — /g, " - ");
  exige(apresentador, "na review, só quem apresenta registra");
  if (acao.tipo === "avancar") {
    exige(acao.de === etapa, "a etapa já mudou: confira a página");
    exige(n < ETAPAS_REVIEW.length - 1, "a review já está na última etapa");
    estado.etapa = ETAPAS_REVIEW[n + 1].id;
    return;
  }
  if (acao.tipo === "incluir") {
    const g = dados.grupos.find((x) => x.id === acao.grupo);
    exige(g, "grupo desconhecido");
    exige(n >= nDe(g.id), "as novas ideias e necessidades vêm depois do feedback");
    const texto = textoDe(acao.texto);
    exige(texto, "escreva o ponto");
    exige(!estado.itens.some((i) => i.grupo === g.id && i.texto === texto), "esse ponto já está na lista");
    exige(estado.itens.length < 500, "a cerimônia chegou a 500 pontos: remova algum antes de incluir");
    // quem apresenta registra o que ouviu: `autor` diz de quem é; sem ele, é do próprio apresentador
    estado.itens.push({ id: randomUUID().slice(0, 8), grupo: g.id, texto, autor: nomeLimpo(acao.autor) || nome, em: agora, votos: [] });
    return;
  }
  if (["ordenar", "cancelar", "manter"].includes(acao.tipo)) {
    exige(etapa === "backlog", "a repriorização do backlog é a última etapa da review");
    exige(dados.publicar.ok, `sem commit possível (${dados.publicar.motivo}): o backlog fica só para leitura`);
    exige(dados.publicar.usuario?.produto, "a ordem do backlog e o cancelamento são de quem tem produto no equipe.json");
    const b = estado.backlog, antes = b.itens.map((i) => i.id), it = b.itens.find((i) => i.id === acao.id);
    exige(it, `${acao.id ?? "o item"} não está no backlog aberto`);
    if (acao.tipo === "ordenar") {
      const ref = acao.antes ?? acao.depois, resto = (b.ordem ?? antes).filter((id) => id !== it.id), k = resto.indexOf(ref);
      exige(k >= 0, `${ref ?? "sem referência"} não serve de referência para a ordem`);
      const nova = [...resto.slice(0, acao.antes ? k : k + 1), it.id, ...resto.slice(acao.antes ? k : k + 1)];
      b.ordem = nova.join() === antes.join() ? null : nova;
    } else if (acao.tipo === "cancelar") {
      exige(it.cancelavel, `${it.id} não se cancela na review: em andamento, é pela sa-status.situacao; épico com fatia aberta, pela sa-refinar.ajustar`);
      const motivo = limpo(acao.motivo).replace(/[()]/g, " ").replace(/\s+/g, " ").trim();
      exige(motivo, "diga o motivo do cancelamento");
      b.cancelar[it.id] = motivo;
    } else delete b.cancelar[it.id];
    return;
  }
  const item = estado.itens.find((i) => i.id === acao.id);
  exige(item, "esse ponto não existe mais");
  exige(acao.tipo !== "votar", "a review não tem votação");
  exige(acao.tipo === "editar" || acao.tipo === "remover", "ação desconhecida");
  if (acao.tipo === "remover") return void estado.itens.splice(estado.itens.indexOf(item), 1);
  const texto = textoDe(acao.texto);
  exige(texto, "escreva o ponto");
  exige(!estado.itens.some((i) => i !== item && i.grupo === item.grupo && i.texto === texto), "esse ponto já está na lista");
  item.texto = texto;
}

/** Aplica uma mudança da página no estado. Toda mudança exige o nome de quem está na página, e vale a etapa e o papel:
 *  `aplicarRetro` na retrospectiva e `aplicarReview` na review. */
export function aplicar(estado, acao, dados, agora = Date.now(), { apresentador = false } = {}) {
  const nome = nomeLimpo(acao.nome), chave = chaveDe(nome);
  if (!chave) throw new Error("diga o seu nome para participar");
  return (dados.modo === "retrospective" ? aplicarRetro : aplicarReview)(estado, acao, dados, agora, { nome, chave, apresentador });
}

/** O texto do `sprint-<nn>.md` com a seção da cerimônia como está na página (a linha Números da retro fica). */
export function comASecao(dados, estado, texto) {
  // ficam: a linha Números da retro (do passo `fechar`) e, na review sem repriorização nova, a linha Backlog já gravada
  return trocarSecao(texto, dados.secao, linhasDaSecao(dados, estado), dados.modo === "retrospective" ? /^- Números:/ : mudouBacklog(estado) ? null : /^- Backlog:/);
}

/** A mensagem de commit que a página propõe: a do fluxo, `<AAAA>/Sprint <nn>: retrospectiva` (ou `review`). */
export const mensagemPadrao = (dados) => `${dados.sprint.chave}: ${MODOS[dados.modo].commit}`;

/** Publicar: só aqui o `sprint-<nn>.md` muda. Depois do `git pull --ff-only`, grava a seção como está na página e faz
 *  o commit só do que a página mudou, com a mensagem que a pessoa confirmou, e o push na branch base. `acoes` são as
 *  mudanças do backlog da review (`acoesDoBacklog`): entram no mesmo commit, pelas regras do `acoes.mjs`; a que a
 *  regra recusa (o backlog mudou no pull) cancela o Publicar antes de gravar. Se o commit falha, tudo volta ao que era;
 *  se só o push falha, o commit fica local e o erro diz isso. */
export function publicar(raiz, dados, estado, { exec, usuario, mensagem, acoes = [] }) {
  const pode = podePublicar(raiz, exec, usuario);
  if (!pode.ok) throw new Error(pode.motivo);
  const git = (...a) => exec("git", ["-C", raiz, ...a]), falha = (r) => (r.stderr || r.stdout || r.error?.message || "falhou").trim().split("\n").at(-1);
  const arquivo = dados.sprint.arquivo, texto = String(mensagem ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, 300) || mensagemPadrao(dados);
  const pull = git("pull", "--ff-only");
  if (pull.status !== 0) throw new Error(`git pull --ff-only: ${falha(pull)}`);
  const lote = acoes.length ? prepararLote(raiz, acoes, { usuario }) : { arquivos: {}, remover: [], avisos: [] };
  const ler = (c) => fs.readFileSync(path.join(raiz, c), "utf8"), antes = { [arquivo]: ler(arquivo) }, depois = { ...lote.arquivos, [arquivo]: comASecao(dados, estado, lote.arquivos[arquivo] ?? antes[arquivo]) };
  const caminhos = Object.keys(depois);
  for (const c of caminhos) antes[c] ??= ler(c);
  if (caminhos.every((c) => depois[c] === antes[c]) && !lote.remover.length && !git("status", "--porcelain", "--", arquivo).stdout.trim()) throw new Error(`nada a publicar: a seção ${dados.secao} do ${path.basename(arquivo)} já está assim no repositório`);
  const desfaz = () => { for (const c of caminhos) fs.writeFileSync(path.join(raiz, c), antes[c]); git("reset", "--quiet", "--", ...caminhos, ...lote.remover); for (const d of lote.remover) git("checkout", "--", d); };
  for (const c of caminhos) fs.writeFileSync(path.join(raiz, c), depois[c]);
  // a pasta da spec do item cancelado sai no mesmo commit
  for (const d of lote.remover) { const r = git("rm", "-r", "--quiet", d); if (r.status !== 0) { desfaz(); throw new Error(`git rm ${d}: ${falha(r)}`); } }
  const add = git("add", "--", ...caminhos), commit = add.status === 0 ? git("commit", "--quiet", "-m", texto, "--", ...caminhos, ...lote.remover) : add;
  if (commit.status !== 0) { desfaz(); throw new Error(`git commit: ${falha(commit)}`); }
  const push = git("push", "--quiet");
  if (push.status !== 0) throw new Error(`o commit "${texto}" ficou só nesta máquina; o push falhou: ${falha(push)}`);
  return { commit: texto, ...(lote.avisos.length ? { avisos: lote.avisos } : {}) };
}

const CSS_CERIMONIA = `
/* a cerimônia: a lista do quadro, com um bloco por grupo; a linha do ponto leva o selo, os votos e quem criou */
:root{--bom:#2E8B57}
:root[data-modo="escuro"]{--bom:#5CC08B}
[data-g]{--g:var(--muted)}
[data-g="positivo"]{--g:var(--bom)}
[data-g="negativo"]{--g:var(--critico)}
[data-g="melhoria"]{--g:var(--atencao)}
[data-g="acao"],[data-g="feedback"]{--g:var(--brand)}
[data-g="licao"]{--g:var(--epico)}
[data-g="ideia"]{--g:var(--orange)}
.bloco.filho{box-shadow:inset 4px 0 0 var(--epico)}
/* a repriorização do backlog: a posição, os botões de subir e descer e o item marcado a cancelar */
td.pos{width:1%;color:var(--muted);text-align:right}
.bl-l[draggable="true"]{cursor:grab}
.bl-l.a-cancelar .t-tit,.bl-l.a-cancelar td.id{text-decoration:line-through;color:var(--muted)}
.ac:disabled{opacity:.35;cursor:default}
.ac:disabled:hover{background:none}
.bloco summary{flex-wrap:wrap}
.bloco summary h2{box-shadow:inset 0 -2px 0 var(--g)}
.bloco summary a{font-size:13px}
.ponto-l td{vertical-align:middle}
td.tit{box-shadow:inset 3px 0 0 var(--g);overflow-wrap:anywhere}
td.tit small{display:block;font-weight:400;color:var(--muted)}
.ja{display:inline-block;margin-left:8px;padding:0 7px;border-radius:999px;background:var(--suave);color:var(--muted);font:500 12px/18px var(--body)}
.voto:disabled{border-color:var(--suave-h);cursor:default}
.voto:disabled:hover{background:none}
.selo{display:inline-block;min-width:76px;padding:3px 10px;border-radius:var(--r-sm);background:color-mix(in srgb,var(--g) 20%,var(--card));color:color-mix(in srgb,var(--g) 62%,var(--title));font:600 12px/18px var(--body);text-align:center}
td.selo-c{width:112px;white-space:nowrap}
td.quem-c{width:48px;white-space:nowrap}
td.votos{width:240px;min-width:170px}
.voto-l{display:flex;align-items:center;gap:8px}
.voto{flex:none;display:grid;place-items:center;width:24px;height:24px;padding:0;border:2px solid var(--blue);border-radius:50%;background:none;color:transparent}
.voto svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.voto:hover{background:color-mix(in srgb,var(--blue) 18%,transparent)}
.voto[aria-pressed="true"]{background:var(--blue);color:var(--card)}
.trilho{flex:1;min-width:48px;height:12px;border-radius:3px;background:var(--suave);overflow:hidden}
.trilho i{display:block;height:100%;background:var(--blue);transition:width .2s}
.voto-l b{min-width:18px;text-align:right;color:var(--title)}
.av{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:50%;background:var(--suave);color:var(--title);font:600 10px/1 var(--display);font-style:normal}
td.fim{width:1%;white-space:nowrap;text-align:right}
.rm{display:inline-grid;place-items:center;min-width:28px;height:28px;padding:0 6px;border:0;border-radius:var(--r-sm);background:none;color:var(--muted);font-size:13px}
.rm:hover,.rm[data-armado]{background:var(--suave);color:var(--critico)}
.novo{display:flex;flex-wrap:wrap;gap:8px;padding:8px 12px 10px;border-top:1px solid var(--mesa)}
.novo input,.entrar input{flex:1 1 240px;min-width:0;height:32px;padding:0 10px;border:0;border-radius:var(--r-sm);background:var(--suave);color:var(--title)}
.novo input::placeholder,.entrar input::placeholder{color:var(--muted)}
.novo input.de-quem{flex:0 1 220px}
.entrar{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--title)}
.entrar input{flex:0 1 200px}
#aviso{font-size:13px;color:var(--title);font-weight:500}
#aviso.erro{color:var(--critico)}
/* os dados do ciclo: cartões com o número da equipe e, por trabalho, a barra do que fechou no prazo, depois e em aberto */
.bom-s{--cor:var(--bom)}
.painel{max-width:1400px;margin:0 auto 14px;padding:10px 8px 8px;border-radius:var(--r);background:var(--raia)}
.painel>header{display:flex;align-items:baseline;flex-wrap:wrap;gap:4px 10px;padding:0 6px 8px}
.painel>header h2{font-size:14px;line-height:20px}
.painel>header span{font-size:13px;color:var(--muted);font-variant-numeric:tabular-nums}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(172px,1fr));gap:8px}
.tile{display:flex;flex-direction:column;gap:2px;min-width:0;padding:12px 14px;border-radius:8px;background:var(--card);box-shadow:var(--sombra)}
.tile .rot{font:600 12px/16px var(--body);color:var(--muted)}
.tile .val{font:600 26px/32px var(--display);color:var(--title);font-variant-numeric:tabular-nums}
.tile .val small{font:500 12px/16px var(--body);color:var(--muted)}
.tile .sub{margin-top:auto;padding-top:4px;font-size:12px;line-height:16px;color:var(--muted);font-variant-numeric:tabular-nums}
.med{height:6px;margin:4px 0 2px;border-radius:3px;background:var(--suave);overflow:hidden}
.med i{display:block;height:100%;border-radius:3px;background:var(--blue)}
.estado{display:flex;align-items:baseline;gap:6px;font:600 12px/16px var(--body);color:var(--title)}
.trab{display:grid;gap:8px;margin-top:8px;padding:10px 14px 12px;border-radius:8px;background:var(--card);box-shadow:var(--sombra)}
.trab-l{display:grid;grid-template-columns:128px minmax(80px,1fr) 150px 120px;gap:12px;align-items:center;font-size:13px;line-height:18px}
.trab-l b{font-weight:500;color:var(--title)}
.trab-n{text-align:right;color:var(--title);font-variant-numeric:tabular-nums;white-space:nowrap}
.cab-l,.cab-l .trab-n{font-size:12px;font-weight:600;color:var(--muted)}
.pilha{display:flex;gap:2px;height:14px}
.pilha i{display:block;min-width:4px;border-radius:3px}
.pilha .p,.leg .p{background:var(--blue)}
.pilha .d,.leg .d{background:color-mix(in srgb,var(--blue) 42%,var(--card))}
.pilha .a,.leg .a{background:var(--suave-h)}
.leg{display:flex;align-items:center;flex-wrap:wrap;gap:4px 6px;font-weight:500}
.leg i{width:10px;height:10px;border-radius:3px}
.leg i:not(:first-child){margin-left:8px}
/* a retrospectiva em etapas: a faixa com a etapa atual e o botão de quem apresenta; o grupo com os pontos dele; as
   ações de cada item; o Sim ou Não da lição */
.etapas{display:flex;align-items:center;flex-wrap:wrap;gap:8px 16px;padding:0 20px 12px}
.etapas ol{display:flex;flex-wrap:wrap;gap:2px;padding:3px;border-radius:8px;background:var(--suave);list-style:none}
.etapas li{display:inline-flex;align-items:center;gap:6px;padding:4px 12px 4px 6px;border-radius:var(--r-sm);font:500 13px/18px var(--body);color:var(--muted)}
.etapas li b{display:inline-grid;place-items:center;width:18px;height:18px;border-radius:50%;background:var(--suave-h);font:600 11px/1 var(--display);color:var(--title)}
.etapas li.feita{color:var(--title)}
.etapas li.atual{background:var(--card);color:var(--title);font-weight:600;box-shadow:var(--sombra)}
.etapas li.atual b{background:var(--blue);color:var(--card)}
.etapas p{flex:1 1 320px;font-size:13px;color:var(--title)}
.btn:disabled{opacity:.5;cursor:default}
.ac{height:28px;padding:0 8px;border:0;border-radius:var(--r-sm);background:none;color:var(--title);font:500 13px/1 var(--body);white-space:nowrap}
.ac:hover,.ac[data-armado]{background:var(--suave)}
.ac[data-armado]{color:var(--critico)}
td.sel-c{width:1%;padding-right:0}
.sel{width:16px;height:16px;accent-color:var(--blue);cursor:pointer}
.membros,.acoes-i{margin:6px 0 0;padding-left:18px;font-weight:400;color:var(--ink)}
.acoes-i{padding-left:0;list-style:none}
.acoes-i li{margin-top:2px}
.acoes-i b{margin-right:6px;padding:1px 7px;border-radius:999px;background:color-mix(in srgb,var(--brand) 20%,var(--card));color:var(--title);font:600 11px/16px var(--body)}
td.tit :is(.membros,.acoes-i) small{display:inline;margin-left:8px}
td.item-c{min-width:200px;color:var(--title)}
td.item-c .selo{min-width:0;margin-right:8px}
td.manter-c{width:1%;white-space:nowrap}
.geral,.meu-voto{color:var(--muted)}
.meu-voto{font-size:12px}
.seg button:disabled{cursor:default}
dialog fieldset{display:grid;gap:6px;min-width:0;padding:0;border:0}
dialog legend{margin-bottom:4px;padding:0;font-size:13px;font-weight:500;color:var(--title)}
@media (max-width:820px){.etapas{padding-inline:12px}}
@media (max-width:720px){.trab-l{grid-template-columns:1fr 1fr}.trab-l .pilha,.trab-l .leg{grid-column:1/-1;order:3}.trab-l .trab-n:last-child{display:none}}
`;

// A página no navegador: desenha os blocos uma vez e, a cada estado que chega (resposta de uma ação ou o /vivo),
// troca só as linhas, para não fechar bloco nem apagar o que a pessoa está digitando. Na retrospectiva, a etapa do
// estado diz o que aparece e o que cada um pode fazer; o que se edita numa linha abre num popup, fora das linhas.
function cliente() {
  const D = JSON.parse(document.getElementById("dados").textContent), TOKEN = document.querySelector('meta[name="sabia-token"]').content;
  const $ = (s) => document.querySelector(s);
  const esc = (x) => String(x ?? "").replace(/[&<>"']/g, (c) => "&#" + c.charCodeAt(0) + ";");
  const dataBr = (d) => d.slice(8, 10) + "/" + d.slice(5, 7) + "/" + d.slice(0, 4);
  const SETA = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>', CERTO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>';
  const chave = (n) => String(n ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const iniciais = (n) => { const p = String(n || "?").replace(/\(.*?\)/g, " ").trim().split(/[\s.]+/).filter(Boolean); return (p.length > 1 ? p[0][0] + p[p.length - 1][0] : (p[0] || "?").slice(0, 2)).toUpperCase(); };
  const votos = (i) => i.votos.length + (i.base || 0);
  const um = (palavra, n) => palavra + (n === 1 ? "" : "s");
  const CHAVE = "sabia-cerimonia-nome";
  // RETRO: a retrospectiva (senão, a review); AP é o apresentador (quem abriu, na máquina dele)
  const RETRO = D.modo === "retrospective", AP = !!D.apresentador, PONTOS = ["positivo", "negativo", "melhoria"];
  const sel = new Set();  // os pontos que o apresentador marcou para agrupar
  let estado = D.estado, nome = null, ordem = "votos", tAviso, vivo = null;
  try { nome = localStorage.getItem(CHAVE) || null; } catch {}

  function aviso(texto, erro) {
    const a = $("#aviso"); a.textContent = texto; a.classList.toggle("erro", !!erro);
    clearTimeout(tAviso); if (texto) tAviso = setTimeout(() => { a.textContent = ""; }, 6000);
  }
  async function enviar(acao) {
    try {
      const r = await fetch("/acao", { method: "POST", headers: { "content-type": "application/json", "x-sabia-token": TOKEN }, body: JSON.stringify({ ...acao, nome }) });
      const j = await r.json();
      if (!r.ok) { aviso(j.erro || "não deu para gravar", true); return null; }
      if (j.estado) { estado = j.estado; desenhar(); }
      return j;
    } catch { aviso("sem resposta do servidor da cerimônia", true); return null; }
  }
  function exigeNome() {
    if (nome) return true;
    aviso("Entre com o seu nome para participar", true); $("#nome")?.focus(); return false;
  }
  // os popups: abrem sem erro; a ação que o servidor recusa mostra o motivo dentro deles
  const abrir = (dlg) => { dlg.querySelector(".erro").hidden = true; dlg.showModal(); };
  async function noModal(dlg, acao) {
    const erro = dlg.querySelector(".erro"), botao = dlg.querySelector('[type="submit"]');
    botao.disabled = true;
    const r = await enviar(acao);
    botao.disabled = false;
    if (r) dlg.close(); else { erro.textContent = $("#aviso").textContent; erro.hidden = false; }
    return r;
  }
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-fechar]"); if (b) b.closest("dialog").close(); });

  // o /vivo traz a visão desta pessoa a cada mudança de qualquer um: reabre quando o nome muda, porque o que ela pode
  // ver depende de quem ela é; se o servidor fecha (Ctrl+C), a página avisa
  function conectar() {
    if (vivo) vivo.close();
    vivo = new EventSource("/vivo" + (nome ? "?nome=" + encodeURIComponent(nome) : ""));
    vivo.onmessage = (e) => { try { estado = JSON.parse(e.data); desenhar(); } catch {} };
    vivo.onerror = () => { $("#fora").hidden = false; };
    vivo.onopen = () => { if (!$("#fora").hidden) location.reload(); };
  }

  // quem está na página: só o nome, guardado neste navegador; na review, quem não apresenta só acompanha, sem nome
  function desenharQuem() {
    if (!RETRO && !AP) return void ($("#quem").hidden = true);
    $("#quem").innerHTML = nome
      ? '<i class="av">' + esc(iniciais(nome)) + "</i><span>" + esc(nome) + (AP ? " · apresenta" : "") + '</span><button type="button" class="btn" id="sair">Trocar</button>'
      : '<input id="nome" maxlength="40" list="equipe" placeholder="Seu nome" aria-label="Seu nome" autocomplete="off"><button type="submit" class="btn pri">Entrar</button>';
  }
  $("#quem").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $("#nome").value.trim().replace(/\s+/g, " ").slice(0, 40);
    if (!chave(v)) return aviso("Digite o seu nome", true);
    nome = v; try { localStorage.setItem(CHAVE, nome); } catch {}
    aviso(""); desenharQuem(); desenhar(); conectar();
  });
  $("#quem").addEventListener("click", (e) => {
    if (!e.target.closest("#sair")) return;
    nome = null; try { localStorage.removeItem(CHAVE); } catch {}
    desenharQuem(); desenhar(); conectar();
  });
  $("#equipe").innerHTML = Object.values(D.pessoas).map((n) => '<option value="' + esc(n) + '">').join("");

  // o esqueleto: os números do ciclo (retro) e um bloco por grupo, com o formulário de inclusão
  const opcoesDono = '<option value="">sem dono</option>' + Object.entries(D.pessoas).map(([u, n]) => '<option value="' + esc(u) + '">' + esc(n) + "</option>").join("");
  const donos = '<select name="dono" aria-label="Dono da ação">' + opcoesDono + "</select>";
  // os dados do ciclo (retro): sempre à vista — os números da equipe em cartões e, por trabalho, o que fechou até o fim
  // da sprint, o que fechou depois e o que ficou em aberto
  const numeros = (() => {
    const R = D.resumo;
    if (!R || !R.linhas) return "";
    const v = (x) => (x == null ? "—" : String(x).replace(".", ",")), fim = dataBr(D.sprint.fim).slice(0, 5);
    const pl = (n, um, muitos) => n + " " + (n === 1 ? um : muitos);
    const tile = (rot, val, sub, mais) => '<div class="tile"><p class="rot">' + rot + '</p><p class="val">' + val + "</p>" + (mais || "") + '<p class="sub">' + sub + "</p></div>";
    const med = (p) => '<div class="med" role="img" aria-label="' + p + '%"><i style="width:' + Math.max(0, Math.min(100, p)) + '%"></i></div>';
    const estado = (nivel, texto) => '<p class="estado"><span class="ponto ' + nivel + '"></span>' + texto + "</p>";
    const tiles = [
      tile("Conclusão", v(R.pct_conclusao) + "%", R.concluidas + " de " + pl(R.linhas, "linha", "linhas") + " · " + pl(R.itens, "item", "itens"), med(R.pct_conclusao)),
      tile("Concluído no prazo", v(R.pct_no_prazo) + "%", R.no_prazo + " até " + fim + " · " + R.depois + " depois · " + pl(R.abertas, "em aberto", "em aberto"), med(R.pct_no_prazo)),
      tile("Vazão", R.vazao.desenvolvimento + ' <small>desenvolvimento</small>', "atendimento " + R.vazao.atendimento + " · especificação " + R.vazao["especificação"]),
      tile("Lead time médio", v(R.lead_medio.desenvolvimento) + ' <small>dias · desenvolvimento</small>', "atendimento " + v(R.lead_medio.atendimento) + " · especificação " + v(R.lead_medio["especificação"])),
      R.sle ? tile("SLE · até " + pl(R.sle.dias, "dia", "dias"), v(R.sle.pct) + "%", R.sle.dentro + " de " + R.sle.medidos + " linhas · alvo " + R.sle.alvo + "%", estado(R.sle.pct >= R.sle.alvo ? "bom-s" : "atencao", R.sle.pct >= R.sle.alvo ? "dentro do alvo" : "abaixo do alvo")) : "",
      tile("Prazo da sprint", R.dias_alem ? "+" + pl(R.dias_alem, "dia", "dias") : "no prazo", R.ultima_conclusao ? "última conclusão em " + dataBr(R.ultima_conclusao).slice(0, 5) + " · fim em " + fim : "nada concluído ainda", estado(R.dias_alem ? "atencao" : "bom-s", R.dias_alem ? "passou do timebox" : "dentro do timebox")),
      tile("Atendimento", v(R.atendimento.pct) + "%", pl(R.atendimento.linhas, "linha", "linhas") + " da sprint" + (R.atendimento.reserva_pct != null ? " · reserva " + R.atendimento.reserva_pct + "%" : ""), R.atendimento.reserva_pct != null ? estado(R.atendimento.pct > R.atendimento.reserva_pct ? "atencao" : "bom-s", R.atendimento.pct > R.atendimento.reserva_pct ? "acima da reserva" : "dentro da reserva") : ""),
    ].join("");
    const seg = (cls, n, total, rotulo) => (n ? '<i class="' + cls + '" style="flex:' + n + '" title="' + n + " " + rotulo + '"></i>' : "");
    const linhas = D.numeros.map((n) => '<div class="trab-l"><b>' + esc(n.trabalho) + '</b><span class="pilha" role="img" aria-label="' + n.no_prazo + " no prazo, " + n.depois + " depois, " + n.abertas + ' em aberto">' + seg("p", n.no_prazo, n.linhas, "até " + fim) + seg("d", n.depois, n.linhas, "depois de " + fim) + seg("a", n.abertas, n.linhas, "em aberto")
      + '</span><span class="trab-n">' + n.no_prazo + " · " + n.depois + " · " + n.abertas + '</span><span class="trab-n">' + (n.lead_medio == null ? "—" : v(n.lead_medio) + " dias") + "</span></div>").join("");
    return '<section class="painel" aria-label="Dados do ciclo"><header><h2>Dados do ciclo</h2><span>' + esc(D.sprint.chave) + " · " + dataBr(D.sprint.inicio).slice(0, 5) + " → " + fim + '</span></header><div class="tiles">' + tiles + "</div>"
      + '<div class="trab"><div class="trab-l cab-l"><span>Por trabalho</span><span class="leg"><i class="p"></i>até ' + fim + '<i class="d"></i>depois<i class="a"></i>em aberto</span><span class="trab-n">no prazo · depois · aberto</span><span class="trab-n">lead time médio</span></div>' + linhas + "</div></section>";
  })();
  $("#lista").innerHTML = numeros + D.grupos.map((g) =>
    '<details class="bloco' + (g.filho ? " filho" : "") + '" open data-g="' + esc(g.cor) + '" data-grupo="' + esc(g.id) + '"><summary>' + SETA + "<h2>" + esc(g.nome) + '</h2><span class="n"></span>' + (g.sub ? "<span>" + esc(g.sub) + "</span>" : g.id === "licao" ? "<span>só as marcadas Sim viram Regra aprendida</span>" : g.id === "acao" ? "<span>as dos itens e as gerais</span>" : "")
    + (g.mr && /^https?:\/\//.test(g.mr.url) ? '<a href="' + esc(g.mr.url) + '" target="_blank" rel="noopener">MR !' + esc(g.mr.iid) + "</a>" : "")
    + '</summary><div class="rola"><table>' + (g.id === "acao" ? "<thead><tr><th>Ação</th><th>Item</th><th>Dono</th><th>Por</th><th></th></tr></thead>" : "") + '<tbody></tbody></table><form class="novo"><input name="texto" maxlength="280" autocomplete="off" placeholder="' + esc(g.id === "ideia" ? "Nova ideia ou necessidade" : D.modo === "review" ? "Feedback sobre esta entrega" : g.id === "acao" ? "Nova ação geral, sem item" : g.id === "licao" ? "Lição levantada agora" : "Novo ponto") + '" aria-label="Novo ponto em ' + esc(g.nome) + '">'
    + (g.dono ? donos : "") + (RETRO ? "" : '<input name="autor" class="de-quem" maxlength="40" list="equipe" autocomplete="off" placeholder="De quem (se não for seu)" aria-label="De quem é">') + '<button type="submit" class="btn">Incluir</button></form></div></details>').join("")
    + (RETRO ? "" : '<details class="bloco" open id="bloco-backlog" hidden><summary>' + SETA + '<h2>Backlog</h2><span class="n"></span><span>' + esc(D.repriorizar ? "a nova ordem e os cancelamentos são gravados no Publicar" : "só leitura: " + D.sem_repriorizar) + '</span></summary><div class="rola"><table><tbody></tbody></table></div></details>');

  // a faixa das etapas: a atual em destaque, o que se faz nela e, para quem apresenta, o botão que libera a próxima
  function faixa(n, mais) {
    $("#etapas").innerHTML = "<ol>" + D.etapas.map((e, k) => "<li" + (k === n ? ' class="atual" aria-current="step"' : k < n ? ' class="feita"' : "") + "><b>" + (k + 1) + "</b>" + esc(e.nome) + "</li>").join("") + "</ol><p>" + esc(D.etapas[n].dica) + "</p>"
      + (AP ? '<div class="config">' + (mais || "") + (D.etapas[n + 1] ? '<button type="button" class="btn pri" id="liberar">' + esc(D.etapas[n + 1].liberar) + "</button>" : "") + "</div>" : "");
  }

  // a review: tudo à vista; só quem apresenta registra (inclui, altera e remove), no bloco que a etapa já liberou
  function desenharReview() {
    const nDe = (id) => D.etapas.findIndex((e) => e.id === id), n = Math.max(0, nDe(estado.etapa));
    faixa(n);
    for (const g of D.grupos) {
      const bloco = document.querySelector('.bloco[data-grupo="' + CSS.escape(g.id) + '"]'), ideia = g.id === "ideia", nG = ideia ? nDe("ideias") : 0;
      bloco.hidden = n < nG;
      bloco.querySelector(".novo").hidden = !AP;
      const itens = estado.itens.filter((i) => i.grupo === g.id).sort((a, b) => (a.em || 0) - (b.em || 0));
      bloco.querySelector("summary .n").textContent = itens.length + " " + (ideia ? (itens.length === 1 ? "item novo" : "itens novos") : um("feedback", itens.length));
      bloco.querySelector("tbody").innerHTML = itens.map((i) => '<tr class="ponto-l" data-id="' + esc(i.id) + '"><td class="tit">' + esc(i.texto) + (i.cadastrado ? '<span class="ja">' + esc(i.cadastrado) + "</span>" : "") + '</td><td class="selo-c"><span class="selo">' + esc(g.tag) + '</span></td>'
        + '<td class="quem-c"><i class="av" title="' + esc(i.autor ? "Criado por " + i.autor : "Veio do " + D.arquivo) + '">' + esc(i.autor ? iniciais(i.autor) : "md") + '</i></td><td class="fim">'
        + (AP ? '<button type="button" class="ac ed" aria-label="Alterar o texto">Alterar</button><button type="button" class="rm" title="Remover" aria-label="Remover">✕</button>' : "") + "</td></tr>").join("")
        || '<tr><td class="nada" colspan="5">' + (ideia ? "Nenhuma ideia ou necessidade nova." : "Sem feedback ainda.") + "</td></tr>";
    }
    // a repriorização: os itens abertos na ordem nova; quem pode sobe, desce (ou arrasta) e marca a cancelar
    const B = estado.backlog, bl = $("#bloco-backlog"), naEtapa = D.etapas[n].id === "backlog" && !!B;
    bl.hidden = !naEtapa;
    if (naEtapa) {
      const porId = Object.fromEntries(B.itens.map((i) => [i.id, i])), ids = B.ordem || B.itens.map((i) => i.id), nc = Object.keys(B.cancelar).length;
      const bt = (cls, texto, rotulo, off) => '<button type="button" class="ac ' + cls + '" aria-label="' + rotulo + '"' + (off ? " disabled" : "") + ">" + texto + "</button>";
      bl.querySelector("summary .n").textContent = ids.length + " " + (ids.length === 1 ? "item aberto" : "itens abertos") + (B.ordem ? " · ordem alterada" : "") + (nc ? " · " + nc + " a cancelar" : "");
      bl.querySelector("tbody").innerHTML = ids.map((id, k) => {
        const i = porId[id], motivo = B.cancelar[id];
        return '<tr class="ponto-l bl-l' + (motivo ? " a-cancelar" : "") + '" data-item="' + esc(id) + '"' + (D.repriorizar ? ' draggable="true"' : "") + '><td class="pos">' + (k + 1) + '</td><td class="id">' + esc(id) + '</td><td class="tit"><span class="t-tit">' + esc(i.titulo || "") + "</span>" + (motivo ? "<small>a cancelar: " + esc(motivo) + "</small>" : "")
          + '</td><td class="nw">' + esc([i.tipo, i.status].filter(Boolean).join(" · ")) + (i.na_sprint ? '<span class="ja">na sprint</span>' : "") + '</td><td class="fim">'
          + (D.repriorizar ? bt("sobe", "↑", "Subir " + esc(id), k === 0) + bt("desce", "↓", "Descer " + esc(id), k === ids.length - 1) + (motivo ? bt("desfaz", "Manter", "Não cancelar " + esc(id)) : i.cancelavel ? bt("cancela", "Cancelar", "Cancelar " + esc(id)) : "") : "") + "</td></tr>";
      }).join("") || '<tr><td class="nada" colspan="5">Nenhum item aberto no backlog.</td></tr>';
    }
    $("#pendente").hidden = !estado.nao_publicado;
    const pub = $("#publicar");
    if (pub) { pub.disabled = n < D.etapas.length - 1; pub.title = pub.disabled ? "A review é publicada na última etapa" : ""; }
  }

  // a retrospectiva: a faixa das etapas e, em cada bloco, o que a etapa mostra e deixa fazer
  function desenharRetro() {
    const eu = nome ? chave(nome) : null, nDe = (id) => D.etapas.findIndex((e) => e.id === id), n = Math.max(0, nDe(estado.etapa)), E = D.etapas[n], etapa = E.id, depois = (id) => n >= nDe(id);
    const por = (id) => estado.itens.find((i) => i.id === id), meu = (i) => !!eu && !!i.autor && chave(i.autor) === eu, chegada = (a, b) => (a.em || 0) - (b.em || 0);
    const tagDe = (grupo) => D.grupos.find((g) => g.id === grupo)?.tag ?? grupo;
    for (const id of [...sel]) { const i = por(id); if (etapa !== "agrupar" || !i || i.em_grupo) sel.delete(id); }
    faixa(n, etapa === "agrupar" ? '<button type="button" class="btn" id="agrupar"' + (sel.size < 2 ? " disabled" : "") + ">Agrupar selecionados" + (sel.size ? " (" + sel.size + ")" : "") + "</button>" : "");
    const max = Math.max(1, ...estado.itens.map(votos));
    const quemTd = (i, nMembros) => '<td class="quem-c"><i class="av" title="' + esc(i.agrupa ? "Grupo de " + nMembros + " pontos" : i.autor ? "Criado por " + i.autor : i.do_ciclo ? "Lição de " + i.origem : "Veio do " + D.arquivo) + '">' + esc(i.agrupa ? "×" + nMembros : i.autor ? iniciais(i.autor) : i.do_ciclo ? String(i.origem).slice(0, 2) : "md") + "</i></td>";
    const bt = (cls, texto, rotulo) => '<button type="button" class="ac ' + cls + '" aria-label="' + esc(rotulo) + '">' + texto + "</button>";
    // alterar e remover: só de quem criou, e só enquanto dura a etapa do item
    const altera = (i, id) => (etapa === id && meu(i) ? bt("ed", "Alterar", "Alterar o texto") + '<button type="button" class="rm" title="Remover" aria-label="Remover">✕</button>' : "");
    const seloTd = (grupo) => '<td class="selo-c"><span class="selo">' + esc(tagDe(grupo)) + "</span></td>";

    const ponto = (i) => {
      const membros = i.agrupa ? estado.itens.filter((m) => m.em_grupo === i.id).sort(chegada) : [];
      const acoes = depois("acoes") ? estado.itens.filter((a) => a.grupo === "acao" && a.sobre === i.id).sort(chegada) : [];
      const nv = votos(i), meuVoto = !!eu && i.votos.some((v) => v.chave === eu), quem = i.votos.map((v) => v.nome).join(", "), barra = '<span class="trilho"><i style="width:' + Math.round(100 * nv / max) + '%"></i></span><b>' + nv + "</b>";
      let v = "";
      // na votação, cada um vê só o próprio voto; a contagem e os nomes, só o apresentador, até ele mostrar o resultado
      if (etapa === "votar") v = '<td class="votos"><div class="voto-l"><button type="button" class="voto" aria-pressed="' + meuVoto + '" aria-label="' + (meuVoto ? "Tirar o meu voto" : "Votar") + '"' + (AP ? ' title="' + esc(quem ? "Votaram: " + quem : "Ninguém votou ainda") + '"' : "") + ">" + CERTO + "</button>" + (AP ? barra : '<span class="meu-voto">' + (meuVoto ? "Você votou" : "") + "</span>") + "</div></td>";
      else if (depois("acoes")) v = '<td class="votos"><div class="voto-l" title="' + esc(quem ? "Votaram: " + quem : "Sem votos") + '">' + barra + "</div></td>";
      const fim = etapa === "pontos" ? altera(i, "pontos")
        : etapa === "agrupar" && AP && i.agrupa ? bt("gr-ed", "Alterar", "Alterar o grupo") + bt("gr-rm", "Desfazer", "Desfazer o grupo")
        : etapa === "acoes" || (AP && etapa === "licoes") ? bt("mais", "+ Ação", "Nova ação para este item") : "";
      return '<tr class="ponto-l" data-id="' + esc(i.id) + '">' + (AP && etapa === "agrupar" ? '<td class="sel-c"><input type="checkbox" class="sel" aria-label="Selecionar para agrupar"' + (sel.has(i.id) ? " checked" : "") + "></td>" : "")
        + '<td class="tit">' + esc(i.texto) + (i.agrupa ? '<span class="ja">grupo de ' + membros.length + "</span>" : "")
        + (membros.length ? '<ul class="membros">' + membros.map((m) => "<li>" + esc(m.texto) + (m.autor ? "<small>" + esc(m.autor) + "</small>" : "") + "</li>").join("") + "</ul>" : "")
        + (acoes.length ? '<ul class="acoes-i">' + acoes.map((a) => "<li><b>Ação</b>" + esc(a.texto) + (a.dono ? "<small>dono: " + esc(D.pessoas[a.dono] || a.dono) + "</small>" : "") + "</li>").join("") + "</ul>" : "")
        + "</td>" + seloTd(i.grupo) + v + quemTd(i, membros.length) + '<td class="fim">' + fim + "</td></tr>";
    };
    // a tabela consolidada das ações: as atreladas a um item e as gerais
    const acaoL = (i) => {
      const alvo = i.sobre && por(i.sobre);
      return '<tr class="ponto-l" data-id="' + esc(i.id) + '"><td class="tit">' + esc(i.texto) + '</td><td class="item-c">' + (alvo ? '<span class="selo" data-g="' + esc(alvo.grupo) + '">' + esc(tagDe(alvo.grupo)) + "</span>" + esc(alvo.texto) : '<span class="geral">geral</span>')
        + '</td><td class="nw">' + (i.dono ? esc(D.pessoas[i.dono] || i.dono) : '<span class="geral">sem dono</span>') + "</td>" + quemTd(i) + '<td class="fim">' + altera(i, "acoes") + "</td></tr>";
    };
    // a lição: o Sim ou Não é de quem apresenta; os demais veem a resposta
    const licaoL = (i) => {
      const resp = (rot, valor) => '<button type="button" class="manter" data-v="' + (valor ? "sim" : "nao") + '" aria-pressed="' + (i.manter === valor) + '"' + (AP && !i.ja_esta ? "" : " disabled") + ">" + rot + "</button>";
      return '<tr class="ponto-l" data-id="' + esc(i.id) + '"><td class="tit">' + esc(i.texto) + (i.ja_esta ? '<span class="ja">já é regra</span>' : "") + (i.origem ? "<small>origem " + esc(i.origem) + (i.detalhe ? " · " + esc(i.detalhe) : "") + "</small>" : "") + "</td>" + seloTd("licao")
        + '<td class="manter-c"><div class="seg" role="group" aria-label="Manter esta lição?">' + resp("Sim", true) + resp("Não", false) + "</div></td>" + quemTd(i) + '<td class="fim">' + altera(i, "licoes") + "</td></tr>";
    };

    let total = 0;
    for (const g of D.grupos) {
      const bloco = document.querySelector('.bloco[data-grupo="' + CSS.escape(g.id) + '"]'), ehPonto = PONTOS.includes(g.id), nG = nDe(g.id === "acao" ? "acoes" : g.id === "licao" ? "licoes" : "pontos");
      // o bloco aparece na etapa dele; o formulário de incluir, enquanto ela dura e, depois, só para quem apresenta;
      // lição não se inclui na página: só as dos itens concluídos do ciclo
      bloco.hidden = n < nG;
      bloco.querySelector(".novo").hidden = g.id === "licao" || !(n === nG || (AP && n > nG));
      const itens = estado.itens.filter((i) => i.grupo === g.id && !i.em_grupo).sort((a, b) => (ehPonto && depois("acoes") && ordem === "votos" ? votos(b) - votos(a) : 0) || chegada(a, b));
      const nv = itens.reduce((s, i) => s + votos(i), 0);
      if (ehPonto) total += itens.length;
      bloco.querySelector("summary .n").textContent = g.id === "licao" ? itens.length + " " + (itens.length === 1 ? "lição" : "lições") + " · " + itens.filter((i) => i.manter === true).length + " a manter"
        : g.id === "acao" ? itens.length + " " + (itens.length === 1 ? "ação" : "ações")
        : itens.length + " " + um("ponto", itens.length) + (depois("acoes") || (AP && etapa === "votar") ? " · " + nv + (nv === 1 ? " voto" : " votos") : "");
      bloco.querySelector("tbody").innerHTML = itens.map(g.id === "licao" ? licaoL : g.id === "acao" ? acaoL : ponto).join("")
        || '<tr><td class="nada" colspan="6">' + (g.id === "licao" ? "Nenhuma lição registrada nos itens concluídos do ciclo." : g.id === "acao" ? "Nenhuma ação ainda." : etapa === "pontos" && !AP ? "Você ainda não incluiu ponto aqui." : "Nenhum ponto.") + "</td></tr>";
    }
    $("#pendente").hidden = !estado.nao_publicado;
    $("#total").textContent = total + " " + um("ponto", total);
    $("#ordem").closest(".campo").hidden = !depois("acoes");
    const pub = $("#publicar");
    if (pub) { pub.disabled = etapa !== "licoes"; pub.title = pub.disabled ? "A retrospectiva é publicada na última etapa, a das lições aprendidas" : ""; }
  }
  const desenhar = RETRO ? desenharRetro : desenharReview;

  // o popup do texto: alterar um ponto, uma ação, um feedback ou uma ideia, e a ação nova de um item
  let pedido = null;
  function abrirItem(acao, item) {
    const nova = acao.tipo === "incluir", cancela = acao.tipo === "cancelar", ehAcao = nova || item.grupo === "acao";
    pedido = acao;
    $("#item-rotulo").textContent = cancela ? "Motivo do cancelamento" : "Texto";
    $("#item-titulo").textContent = cancela ? "Cancelar " + item.id : nova ? "Nova ação" : ehAcao ? "Alterar a ação" : item.grupo === "licao" ? "Alterar a lição" : item.grupo === "ideia" ? "Alterar a ideia ou necessidade" : RETRO ? "Alterar o ponto" : "Alterar o feedback";
    $("#item-sub").textContent = cancela ? (item.titulo || "") + " — o cancelamento é gravado no Publicar" : nova ? "Para o item: " + item.texto : ""; $("#item-sub").hidden = !nova && !cancela;
    $("#item-texto").value = nova || cancela ? "" : item.texto;
    $("#item-dono-l").hidden = !ehAcao; $("#item-dono").innerHTML = opcoesDono; $("#item-dono").value = nova ? "" : item.dono || "";
    abrir($("#modal-item")); $("#item-texto").focus();
  }
  $("#form-item")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = $("#item-texto").value.trim();
    if (!texto) return $("#item-texto").focus();
    noModal($("#modal-item"), pedido.tipo === "cancelar" ? { ...pedido, motivo: texto } : { ...pedido, texto, dono: $("#item-dono-l").hidden ? null : $("#item-dono").value || null });
  });

  // o popup do grupo: o título começa pelo combo com os pontos e, escolhido um, fica no campo de texto para ajustar
  let grupoId = null;
  function abrirGrupo(id, membros) {
    const g = id ? estado.itens.find((i) => i.id === id) : null;
    grupoId = g ? g.id : null;
    $("#grupo-h").textContent = g ? "Alterar o grupo" : "Agrupar os pontos";
    $("#grupo-combo").innerHTML = '<option value="">Escolha entre os pontos…</option>' + membros.map((m) => "<option>" + esc(m.texto) + "</option>").join("");
    $("#grupo-titulo").value = g ? g.texto : ""; $("#grupo-titulo-l").hidden = !g;
    $("#grupo-membros").innerHTML = "<legend>Pontos do grupo</legend>" + membros.map((m) => '<label class="linha"><input type="checkbox" value="' + esc(m.id) + '" checked><span>' + esc(m.texto) + (m.autor ? " · " + esc(m.autor) : "") + "</span></label>").join("");
    abrir($("#modal-grupo"));
  }
  $("#grupo-combo")?.addEventListener("change", (e) => {
    if (!e.target.value) return;
    $("#grupo-titulo").value = e.target.value; $("#grupo-titulo-l").hidden = false; $("#grupo-titulo").focus();
  });
  $("#form-grupo")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dlg = $("#modal-grupo"), erro = dlg.querySelector(".erro"), titulo = $("#grupo-titulo").value.trim(), ids = [...dlg.querySelectorAll("#grupo-membros input:checked")].map((c) => c.value);
    if (!titulo) { erro.textContent = "Escolha o título do grupo entre os pontos."; erro.hidden = false; return $("#grupo-combo").focus(); }
    const r = await noModal(dlg, grupoId ? { tipo: "editar-grupo", id: grupoId, ids, titulo } : { tipo: "agrupar", ids, titulo });
    if (r) { sel.clear(); desenhar(); }
  });

  // a faixa das etapas: liberar a próxima (com a confirmação, porque não há volta) e agrupar os pontos marcados
  let deEtapa = null;
  $("#etapas")?.addEventListener("click", (e) => {
    if (e.target.closest("#liberar")) {
      if (!exigeNome()) return;
      const k = D.etapas.findIndex((x) => x.id === estado.etapa), prox = D.etapas[k + 1];
      deEtapa = estado.etapa;
      $("#etapa-titulo").textContent = prox.liberar; $("#etapa-sub").textContent = prox.confirma; $("#etapa-ok").textContent = prox.liberar;
      return abrir($("#modal-etapa"));
    }
    if (!e.target.closest("#agrupar") || !exigeNome()) return;
    const itens = [...sel].map((id) => estado.itens.find((i) => i.id === id)).filter(Boolean), grupos = itens.filter((i) => i.agrupa);
    if (new Set(itens.map((i) => i.grupo)).size > 1) return aviso("O grupo junta pontos da mesma categoria", true);
    if (grupos.length > 1) return aviso("Marque um grupo só, com os pontos que entram nele", true);
    abrirGrupo(grupos[0]?.id ?? null, [...(grupos[0] ? estado.itens.filter((m) => m.em_grupo === grupos[0].id) : []), ...itens.filter((i) => !i.agrupa)]);
  });
  $("#form-etapa")?.addEventListener("submit", (e) => { e.preventDefault(); noModal($("#modal-etapa"), { tipo: "avancar", de: deEtapa }); });

  $("#lista").addEventListener("change", (e) => {
    const c = e.target.closest(".sel");
    if (!c) return;
    const id = c.closest("tr").dataset.id;
    if (c.checked) sel.add(id); else sel.delete(id);
    desenhar();
  });
  // o backlog da review: subir, descer, cancelar com o motivo e desfazer; arrastar a linha solta antes da linha alvo
  const idsDoBacklog = () => estado.backlog.ordem || estado.backlog.itens.map((i) => i.id);
  let arrastado = null;
  $("#lista").addEventListener("dragstart", (e) => { const l = e.target.closest?.("tr[data-item]"); if (l) { arrastado = l.dataset.item; e.dataTransfer.effectAllowed = "move"; } });
  $("#lista").addEventListener("dragover", (e) => { if (arrastado && e.target.closest("tr[data-item]")) e.preventDefault(); });
  $("#lista").addEventListener("drop", (e) => {
    const l = e.target.closest("tr[data-item]"), id = arrastado;
    arrastado = null;
    if (!l || !id || l.dataset.item === id || !exigeNome()) return;
    e.preventDefault();
    enviar({ tipo: "ordenar", id, antes: l.dataset.item });
  });
  $("#lista").addEventListener("click", (e) => {
    const doBacklog = e.target.closest("tr[data-item]");
    if (doBacklog) {
      const b = e.target.closest("button:not(:disabled)"), id = doBacklog.dataset.item, ids = idsDoBacklog(), k = ids.indexOf(id);
      if (!b || !exigeNome()) return;
      if (b.classList.contains("sobe")) enviar({ tipo: "ordenar", id, antes: ids[k - 1] });
      else if (b.classList.contains("desce")) enviar({ tipo: "ordenar", id, depois: ids[k + 1] });
      else if (b.classList.contains("desfaz")) enviar({ tipo: "manter", id });
      else if (b.classList.contains("cancela")) abrirItem({ tipo: "cancelar", id }, estado.backlog.itens.find((i) => i.id === id));
      return;
    }
    const linha = e.target.closest("tr[data-id]");
    if (!linha) return;
    const id = linha.dataset.id, item = estado.itens.find((i) => i.id === id);
    if (e.target.closest(".voto")) { if (exigeNome()) enviar({ tipo: "votar", id }); return; }
    const resp = e.target.closest(".manter");
    if (resp) { if (exigeNome()) enviar({ tipo: "manter", id, valor: resp.getAttribute("aria-pressed") === "true" ? null : resp.dataset.v === "sim" }); return; }
    if (e.target.closest(".ed")) { if (item && exigeNome()) abrirItem({ tipo: "editar", id }, item); return; }
    if (e.target.closest(".mais")) { if (item && exigeNome()) abrirItem({ tipo: "incluir", grupo: "acao", sobre: id }, item); return; }
    if (e.target.closest(".gr-ed")) return abrirGrupo(id, estado.itens.filter((m) => m.em_grupo === id));
    const rm = e.target.closest(".rm,.gr-rm");
    if (!rm || !exigeNome()) return;
    // remover e desfazer pedem o segundo clique: o primeiro arma o botão por alguns segundos
    const grupo = rm.classList.contains("gr-rm"), antes = rm.textContent;
    if (rm.dataset.armado) return void enviar({ tipo: grupo ? "desagrupar" : "remover", id });
    rm.dataset.armado = "1"; rm.textContent = grupo ? "Desfazer?" : "Remover?";
    setTimeout(() => { if (rm.isConnected) { delete rm.dataset.armado; rm.textContent = antes; } }, 4000);
  });
  $("#lista").addEventListener("submit", async (e) => {
    const f = e.target.closest(".novo");
    if (!f) return;
    e.preventDefault();
    if (!exigeNome()) return;
    const texto = f.elements.texto.value.trim();
    if (!texto) return f.elements.texto.focus();
    const r = await enviar({ tipo: "incluir", grupo: f.closest(".bloco").dataset.grupo, texto, dono: f.elements.dono?.value || null, autor: f.elements.autor?.value.trim() || null });
    if (r) { f.elements.texto.value = ""; f.elements.texto.focus(); }
  });
  $("#ordem")?.addEventListener("change", (e) => { ordem = e.target.value; desenhar(); });
  // publicar: o popup pede a mensagem do commit, já preenchida; sem commit possível, o botão só grava o arquivo
  $("#publicar")?.addEventListener("click", async () => {
    if (D.publicar.ok) { $("#erro-publicar").hidden = true; $("#modal").showModal(); $("#mensagem").select(); return; }
    const r = await enviar({ tipo: "publicar" });
    if (r) aviso("Gravado no " + r.gravado);
  });
  $("#cancelar").addEventListener("click", () => $("#modal").close());
  $("#form-publicar").addEventListener("submit", async (e) => {
    e.preventDefault();
    const botao = $("#confirmar"); botao.disabled = true;
    const r = await enviar({ tipo: "publicar", mensagem: $("#mensagem").value });
    botao.disabled = false;
    if (r) { $("#modal").close(); aviso("Publicado: " + r.commit); }
    else { $("#erro-publicar").textContent = $("#aviso").textContent; $("#erro-publicar").hidden = false; }
  });

  $("#ciclo").innerHTML = '<span class="quando">' + dataBr(D.sprint.inicio) + " → " + dataBr(D.sprint.fim) + "</span>" + (D.sprint.meta ? '<span class="meta"><b>Meta:</b> ' + esc(D.sprint.meta) + "</span>" : "");
  $("#gerado").textContent = "Aberta em " + new Date(D.gerado_em).toLocaleString("pt-BR");
  desenharQuem(); desenhar(); conectar();
}

/** A página: HTML único, sem rede, com os dados da cerimônia e o estado em <script id="dados">. `local` diz se quem
 *  pediu a página está na máquina do servidor: só ela vê o botão Publicar e é o apresentador, que libera as etapas e,
 *  na retrospectiva, agrupa os pontos e responde o Sim ou Não das lições; na review, só ele registra. */
export function paginaCerimonia(dados, estado, token = "", { local = false } = {}) {
  const arquivo = path.basename(dados.sprint.arquivo), retro = dados.modo === "retrospective", embutido = { ...dados, arquivo, apresentador: local, estado,
    // repriorizar o backlog (review) é de quem apresenta, com produto no equipe.json e o commit possível
    repriorizar: local && dados.publicar.ok && !!dados.publicar.usuario?.produto,
    sem_repriorizar: !local ? "só quem apresenta reprioriza" : !dados.publicar.ok ? `sem commit (${dados.publicar.motivo})` : "a ordem do backlog é de quem tem produto no equipe.json" };
  const publica = local && dados.publicar.ok;
  return `<!doctype html>
<html lang="pt-BR" data-sobria="sobria-sabia">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="sabia-token" content="${esc(token)}">
<title>${esc(dados.titulo)} · ${esc(dados.sprint.chave)} · ${esc(dados.projeto)}</title>
<script>(${tema})()</script>
<style>${CSS}${CSS_CERIMONIA}</style>
</head>
<body>
<header class="top">
  <span class="brand">${AVE}<span>Sabiá</span></span>
  <span class="ver">${esc(dados.sabia)}</span>
  <span class="onde">${esc(dados.titulo)} · ${esc(dados.sprint.chave)}<span>${esc(dados.projeto)}</span></span>
  <div class="tema">
    <button type="button" class="modo-sw" role="switch" aria-checked="false" aria-label="Modo escuro" title="Claro ou escuro"><span class="trilha">${SOL}${LUA}</span><span class="botao">${SOL}${LUA}</span></button>
    <button type="button" class="tema-btn" popovertarget="temas" aria-label="Paleta" title="Paleta">${PALETA}</button>
    <div id="temas" popover role="menu" aria-label="Paleta">
      <button type="button" role="menuitemradio" data-v="sobria-sabia"><i class="sobria-sabia"></i>Sóbria${CERTO}</button>
      <button type="button" role="menuitemradio" data-v="sabia"><i class="sabia"></i>Sabiá${CERTO}</button>
    </div>
  </div>
</header>
<div class="ciclo" id="ciclo"></div>
<div class="barra">
  <form class="entrar" id="quem"></form>
  <datalist id="equipe"></datalist>
  ${dados.votos ? `<label class="campo">Ordem <select id="ordem"><option value="votos">mais votados</option><option value="chegada">ordem de chegada</option></select></label>
  <span class="conta" id="total"></span>` : ""}
  <p id="aviso" role="status"></p>
  <div class="config">
    <p id="gravacao">O <code>${esc(arquivo)}</code> só muda ao publicar<span id="pendente" hidden> · há mudanças não publicadas</span>${publica ? "" : local ? ` · sem commit: ${esc(dados.publicar.motivo)}` : ""}</p>
    ${local ? `<button type="button" class="btn pri" id="publicar">${publica ? "Publicar" : `Gravar no ${esc(arquivo)}`}</button>` : ""}
  </div>
</div>
<nav class="etapas" id="etapas" aria-label="Etapas da ${esc(dados.titulo.toLowerCase())}"></nav>
<main class="mesa"><div class="lista" id="lista"></div></main>
<footer class="rodape"><span id="gerado"></span><span>${esc(dados.sprint.arquivo)}</span><span>Sabiá ${esc(dados.sabia)}</span></footer>
<dialog id="modal" aria-labelledby="modal-titulo"><form method="dialog" id="form-publicar">
  <h2 id="modal-titulo">Publicar a ${esc(dados.titulo.toLowerCase())}</h2>
  <p class="sub">Grava a seção <code>## ${esc(dados.secao)}</code> do <code>${esc(arquivo)}</code> como está na página e faz o commit e o push na branch base.</p>
  <label>Mensagem do commit<input type="text" id="mensagem" maxlength="300" value="${esc(mensagemPadrao(dados))}" autocomplete="off"></label>
  <p class="erro" id="erro-publicar" role="alert" hidden></p>
  <div class="botoes"><button type="button" class="btn" id="cancelar">Cancelar</button><button type="submit" class="btn pri" id="confirmar">Publicar</button></div>
</form></dialog>
<dialog id="modal-etapa" aria-labelledby="etapa-titulo"><form method="dialog" id="form-etapa">
  <h2 id="etapa-titulo"></h2>
  <p class="sub" id="etapa-sub"></p>
  <p class="nota">Não dá para voltar à etapa anterior.</p>
  <p class="erro" role="alert" hidden></p>
  <div class="botoes"><button type="button" class="btn" data-fechar>Cancelar</button><button type="submit" class="btn pri" id="etapa-ok"></button></div>
</form></dialog>
<dialog id="modal-item" aria-labelledby="item-titulo"><form method="dialog" id="form-item">
  <h2 id="item-titulo"></h2>
  <p class="sub" id="item-sub"></p>
  <label><span id="item-rotulo">Texto</span><input type="text" id="item-texto" maxlength="280" autocomplete="off"></label>
  <label id="item-dono-l">Dono<select id="item-dono"></select></label>
  <p class="erro" role="alert" hidden></p>
  <div class="botoes"><button type="button" class="btn" data-fechar>Cancelar</button><button type="submit" class="btn pri">Gravar</button></div>
</form></dialog>
${retro ? `<dialog id="modal-grupo" aria-labelledby="grupo-h"><form method="dialog" id="form-grupo">
  <h2 id="grupo-h"></h2>
  <p class="sub">Os pontos viram um item só, com o título que você escolher: é nele que o time vota.</p>
  <label>Título a partir de um dos pontos<select id="grupo-combo"></select></label>
  <label id="grupo-titulo-l">Título do grupo<input type="text" id="grupo-titulo" maxlength="280" autocomplete="off"></label>
  <fieldset id="grupo-membros"></fieldset>
  <p class="erro" role="alert" hidden></p>
  <div class="botoes"><button type="button" class="btn" data-fechar>Cancelar</button><button type="submit" class="btn pri">Gravar o grupo</button></div>
</form></dialog>` : ""}
<div class="fora" id="fora" role="alert" hidden><h1>A cerimônia foi encerrada</h1><p>Rode <code>sabia ${esc(dados.modo)}</code> de novo para abrir.</p></div>
<script id="dados" type="application/json">${JSON.stringify(embutido).replace(/</g, "\\u003c")}</script>
<script>(${cliente})()</script>
</body>
</html>`;
}

const LOCAIS = ["127.0.0.1", "::1", "::ffff:127.0.0.1"];

/** O comando: lê a sprint, carrega os pontos da cerimônia (os que já estão na
 *  seção do .md), sobe o servidor e devolve { url, urls, fechar, fechou, token }. Rotas: GET / (a
 *  página), /dados.json, /vivo?nome=<quem> (a visão da pessoa a cada mudança) e POST /acao (com o token que só a
 *  página conhece). O apresentador é quem pede da própria máquina do servidor. */
export async function abrirCerimonia({ projeto = ".", modo, exec, log = console.log, porta, rede = false, host, agora } = {}) {
  if (!MODOS[modo]) throw new Error(`cerimônia desconhecida: ${modo}`);
  const usuario = usuarioDaMaquina(projeto, exec), token = randomUUID();
  const gerar = () => cerimoniaDoProjeto({ projeto, modo, exec, agora, usuario });
  let dados = gerar();
  const md = () => path.join(projeto, dados.sprint.arquivo);
  // de onde a cerimônia parte: o que já está na seção do sprint-<nn>.md; ponto novo, só quem está na página inclui
  const inicial = fs.readFileSync(md(), "utf8"), estado = { versao: 1, modo, sprint: dados.sprint.chave, itens: importarSecao(dados, inicial) };
  // a cerimônia começa pela primeira etapa; a que já está no sprint-<nn>.md foi feita: abre na última, com tudo à vista
  // (a review publicada sem feedback nenhum tem só as linhas "sem feedback": vale a seção ter linha)
  const feita = modo === "retrospective" ? estado.itens.length > 0 : lerSecao(inicial, dados.secao).length > 0;
  estado.etapa = ETAPAS_DE[modo].at(feita ? -1 : 0).id;
  // o backlog da repriorização (review): a lista de quando a página abriu, a nova ordem e os itens a cancelar
  const backlogNovo = () => ({ itens: dados.backlog, ordem: null, cancelar: {} });
  if (modo === "review") estado.backlog = backlogNovo();
  juntarLicoes(estado, dados.licoes);
  // a cerimônia fica na memória: o sprint-<nn>.md só muda no Publicar; `nao_publicado` diz à página se há o que publicar
  const marcar = () => { const t = fs.readFileSync(md(), "utf8"); estado.nao_publicado = comASecao(dados, estado, t) !== t; return estado; };
  marcar();
  // quem está na página: cada um recebe a visão dele do estado (o que é oculto não sai daqui)
  const vivos = new Set(), quemE = (nome, local) => ({ chave: chaveDe(nomeLimpo(nome)) || null, apresentador: local });
  const avisar = () => { for (const v of vivos) v.res.write(`data: ${JSON.stringify(visaoDe(estado, v))}\n\n`); };
  const server = http.createServer((req, res) => {
    const fim = (codigo, corpo, tipo = "text/plain; charset=utf-8") => { res.writeHead(codigo, { "content-type": tipo, "cache-control": "no-store" }); res.end(corpo); };
    const json = (codigo, o) => fim(codigo, JSON.stringify(o), "application/json; charset=utf-8");
    const local = LOCAIS.includes(req.socket.remoteAddress);
    if (req.method === "POST" && req.url === "/acao") {
      const origem = req.headers.origin;
      if (req.headers["x-sabia-token"] !== token || (origem && origem !== `http://${req.headers.host}`)) return json(403, { erro: "pedido recusado" });
      let corpo = "";
      req.on("data", (d) => { corpo += d; if (corpo.length > 65536) req.destroy(); });
      req.on("end", () => {
        try {
          const acao = JSON.parse(corpo), visao = () => visaoDe(estado, quemE(acao.nome, local));
          if (acao.tipo === "publicar") {
            if (!local) throw new Error("publicar é de quem abriu a cerimônia, na máquina dela");
            if (estado.etapa !== ETAPAS_DE[modo].at(-1).id) throw new Error(`a ${dados.titulo.toLowerCase()} é publicada na última etapa (${ETAPAS_DE[modo].at(-1).nome})`);
            // quem não pode fazer o commit (fora da equipe ou da branch base) ainda grava o arquivo
            const acoes = modo === "review" ? acoesDoBacklog(estado) : [];
            const r = dados.publicar.ok ? publicar(projeto, dados, estado, { exec, usuario, mensagem: acao.mensagem, acoes }) : (fs.writeFileSync(md(), comASecao(dados, estado, fs.readFileSync(md(), "utf8"))), { commit: null, gravado: path.basename(dados.sprint.arquivo) });
            // o backlog.md mudou: a página passa a partir da ordem gravada
            if (acoes.length) { dados = gerar(); estado.backlog = backlogNovo(); }
            marcar();
            avisar();
            return json(200, { ok: true, ...r, estado: visao() });
          }
          aplicar(estado, acao, dados, Date.now(), { apresentador: local });
          marcar();
          avisar();
          json(200, { ok: true, estado: visao() });
        } catch (e) { json(400, { erro: e.message }); }
      });
      return;
    }
    if (req.method !== "GET" && req.method !== "HEAD") return fim(405, "use GET");
    const url = new URL(req.url, "http://sabia"), semNome = () => visaoDe(estado, quemE(null, local));
    if (url.pathname === "/vivo") {
      const v = { res, ...quemE(url.searchParams.get("nome"), local) };
      res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-store" });
      res.write(`data: ${JSON.stringify(visaoDe(estado, v))}\n\n`);
      vivos.add(v); req.on("close", () => vivos.delete(v));
      return;
    }
    try {
      if (req.url === "/dados.json") return fim(200, JSON.stringify({ ...dados, estado: semNome() }, null, 2), "application/json; charset=utf-8");
      if (req.url === "/" || req.url === "/index.html") { dados = gerar(); return fim(200, paginaCerimonia(dados, semNome(), token, { local }), "text/html; charset=utf-8"); }
    } catch (e) { return fim(500, `sabia ${modo}: ${e.message}`); }
    return fim(404, "não encontrado");
  });
  const escuta = host ?? (rede ? "0.0.0.0" : "127.0.0.1"), pedida = Number.parseInt(porta, 10) || 0, livre = porta === 0;  // porta 0: uma livre qualquer (os testes)
  const q = await new Promise((resolve, reject) => {
    let fecharFechou;
    const fechou = new Promise((r) => { fecharFechou = r; });
    server.on("error", (e) => (e.code === "EADDRINUSE" && !pedida ? server.listen(0, escuta) : reject(e)));
    server.on("listening", () => {
      const { port } = server.address();
      server.on("close", fecharFechou);
      // na rede, o link de cada endereço da máquina, para o time abrir (no WSL em NAT, o do Windows e a dica da porta)
      const daRede = escuta === "0.0.0.0" ? linksDaRede(port, exec) : { urls: [], dica: null };
      resolve({ url: `http://${escuta === "0.0.0.0" ? "127.0.0.1" : escuta}:${port}/`, urls: daRede.urls, dica: daRede.dica, porta: port, token,
        fechar: () => { if (server.listening) { server.close(); server.closeAllConnections?.(); } else fecharFechou(); }, fechou });
    });
    server.listen(livre ? 0 : pedida || MODOS[modo].porta, escuta);
  });
  const link = (u) => (process.stdout.isTTY ? `\x1b]8;;${u}\x1b\\${u}\x1b]8;;\x1b\\` : u);
  log(`${dados.titulo} da ${dados.sprint.chave} do projeto ${dados.projeto} (Ctrl+C encerra):\n\n  ${link(q.url)}\n${q.urls.map((u) => `  ${link(u)}  (para o time, na rede)\n`).join("")}${q.dica ? `\n  ${q.dica}\n` : ""}`);
  return q;
}
