// `sabia metricas`: as métricas do fluxo num cálculo só, pelas linhas das sprints e pelo backlog.md (só lê arquivos, sem
// GitLab). Da sprint: conclusão, vazão por trabalho contra a prevista, lead time, SLE, reserva de capacidade e a
// tabela das entregas — é o que vai na seção `## Métricas` do `sprint-<nn>.md`. Do histórico: a vazão de cada sprint
// fechada, a média das três últimas (a base da capacidade do próximo planejamento) e a duração por tamanho (P, M, G).
// Nada é guardado à parte: o histórico é sempre derivado das sprints. A página da retrospectiva usa os mesmos números.
import fs from "node:fs";
import path from "node:path";
import { sprintsDe, tabela, semValor } from "./status.mjs";

const TRABALHOS = ["especificação", "desenvolvimento", "atendimento"];
const ehData = (x) => /^\d{4}-\d{2}-\d{2}$/.test(x ?? "");
const dias = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
const media = (v) => (v.length ? Math.round(10 * v.reduce((a, b) => a + b, 0) / v.length) / 10 : null);
// o percentil pelo método do posto mais próximo: o valor abaixo do qual está p% das medidas
const percentil = (v, p) => { const o = [...v].sort((a, b) => a - b); return o.length ? o[Math.max(0, Math.ceil(p / 100 * o.length) - 1)] : null; };

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

/** As entregas da sprint: cada item com alguma linha concluída, com os dias de cada trabalho (concluida_em −
 *  iniciada_em), o lead time do item na sprint (da primeira linha iniciada à última concluída) e se tudo fechou até o
 *  fim da sprint. Tipo e tamanho vêm do backlog. */
export function entregasDaSprint(sprint, backlog) {
  return [...new Set(sprint.itens.map((x) => x.Item))].flatMap((id) => {
    const ls = sprint.itens.filter((x) => x.Item === id), fechadas = ls.filter((x) => ehData(x.concluida_em));
    if (!fechadas.length) return [];
    const item = backlog.find((l) => l.id === id) ?? {}, de = (t) => { const v = fechadas.filter((x) => x.Trabalho === t && ehData(x.iniciada_em)).map((x) => dias(x.iniciada_em, x.concluida_em)); return v.length ? v.reduce((a, b) => a + b, 0) : null; };
    const inicio = ls.map((x) => x.iniciada_em).filter(ehData).sort()[0], fim = fechadas.map((x) => x.concluida_em).sort().at(-1);
    return [{ id, tipo: item.tipo || null, tamanho: semValor(item.tamanho) ? null : item.tamanho, dias: Object.fromEntries(TRABALHOS.map((t) => [t, de(t)])), lead_time: inicio ? dias(inicio, fim) : null,
      aberto: fechadas.length < ls.length, no_prazo: fechadas.every((x) => x.concluida_em <= sprint.fim) }];
  });
}

/** O histórico da equipe pelas sprints (da mais nova para a mais antiga): por sprint, a vazão por trabalho, a prevista
 *  (do cabeçalho `**Capacidade:**`) e o lead time médio do desenvolvimento; a média da vazão nas três últimas sprints
 *  fechadas; e a duração do desenvolvimento por tamanho (quantas, mediana e percentil 85, em dias). */
export function historicoDe(sprints, backlog) {
  const fechou = (s, t) => s.itens.filter((x) => x.Trabalho === t && ehData(x.concluida_em));
  const porSprint = sprints.map((s) => ({ chave: s.chave, inicio: s.inicio, fim: s.fim, aberta: s.aberta, prevista: s.capacidade?.prevista ?? null,
    vazao: Object.fromEntries(TRABALHOS.map((t) => [t, fechou(s, t).length])), lead_medio: media(fechou(s, "desenvolvimento").filter((x) => ehData(x.iniciada_em)).map((x) => dias(x.iniciada_em, x.concluida_em))) }));
  const ultimas = porSprint.filter((s) => !s.aberta).slice(0, 3);
  const duracoes = {};
  for (const s of sprints) for (const x of fechou(s, "desenvolvimento")) {
    const tam = backlog.find((l) => l.id === x.Item)?.tamanho;
    if (ehData(x.iniciada_em) && !semValor(tam)) (duracoes[tam] ??= []).push(dias(x.iniciada_em, x.concluida_em));
  }
  return { sprints: porSprint, vazao_media: { sprints: ultimas.map((s) => s.chave), ...Object.fromEntries(TRABALHOS.map((t) => [t, media(ultimas.map((s) => s.vazao[t]))])) },
    duracao_por_tamanho: Object.fromEntries(Object.entries(duracoes).sort().map(([t, v]) => [t, { itens: v.length, mediana: percentil(v, 50), p85: percentil(v, 85) }])) };
}

/** As métricas do projeto: a sprint pedida (`chave`, ex. "2026/Sprint 03"; sem ela, a aberta) e o histórico. */
export function metricasDoProjeto({ projeto = ".", agora = new Date(), chave = null } = {}) {
  const hoje = agora.toISOString().slice(0, 10), sprints = sprintsDe(projeto, hoje), sprint = chave ? sprints.find((s) => s.chave === chave) : sprints[0];
  if (!sprint) throw new Error(chave ? `não há a sprint ${chave}` : "não há sprint: planeje pela sa-planejamento.sprint");
  const ler = (f) => { try { return fs.readFileSync(path.join(projeto, f), "utf8"); } catch { return ""; } };
  const backlog = tabela(ler(".sabia/planejamento/backlog.md"), "id");
  let acordos = {};
  try { acordos = JSON.parse(ler(".sabia/planejamento/acordos.json")); } catch { /* sem acordos, sem SLE nem reserva em % */ }
  const sle = acordos.sle?.dias ? { dias: acordos.sle.dias, percentual: acordos.sle.percentual } : null;
  return { versao: 1, projeto: path.basename(path.resolve(projeto)), gerado_em: agora.toISOString(),
    sprint: { chave: sprint.chave, inicio: sprint.inicio, fim: sprint.fim, meta: sprint.meta, aberta: sprint.aberta, arquivo: sprint.arquivo, capacidade: sprint.capacidade ?? null, reserva: sprint.reserva ?? null,
      numeros: numerosDaSprint(sprint), resumo: resumoDaSprint(sprint, { sle, reservaPct: acordos.reserva_capacidade_pct ?? null }), entregas: entregasDaSprint(sprint, backlog) },
    historico: historicoDe(sprints, backlog) };
}

/** As linhas da seção `## Métricas` do `sprint-<nn>.md` (template sa-planejamento/sprint.md): o retrato da sprint no dia
 *  da medida. "meta atingida" não sai daqui: é resposta de quem tem `produto`. */
export function secaoMetricas(m) {
  const s = m.sprint, r = s.resumo, n = (x) => (x == null ? "—" : String(x).replace(".", ",")), d = (x) => (x == null ? "—" : `${n(x)} ${x === 1 ? "dia" : "dias"}`);
  const linhas = [`- Medida em: ${m.gerado_em.slice(0, 10)}`,
    `- Conclusão: ${r.concluidas} de ${r.linhas} ${r.linhas === 1 ? "linha" : "linhas"} (${r.pct_conclusao ?? 0}%) · no prazo ${r.no_prazo} · depois ${r.depois} · em aberto ${r.abertas}`,
    `- Vazão: desenvolvimento ${r.vazao.desenvolvimento}${s.capacidade ? ` (prevista ${s.capacidade.prevista})` : ""} · atendimento ${r.vazao.atendimento} · especificação ${r.vazao["especificação"]}`,
    `- Lead time médio: desenvolvimento ${d(r.lead_medio.desenvolvimento)} · atendimento ${d(r.lead_medio.atendimento)} · especificação ${d(r.lead_medio["especificação"])}`];
  if (r.sle) linhas.push(`- SLE: ${r.sle.pct}% em até ${d(r.sle.dias)} (alvo ${r.sle.alvo}%)`);
  if (s.reserva != null) linhas.push(`- Reserva de capacidade: ${r.atendimento.linhas} de ${s.reserva} ${s.reserva === 1 ? "item" : "itens"}`);
  if (s.entregas.length) linhas.push("", "| Entrega | Tipo | Tam. | Especificação (d) | Desenvolvimento (d) | Atendimento (d) | Lead time (d) | No prazo |", "|---|---|---|---|---|---|---|---|",
    ...s.entregas.map((e) => `| ${e.id} | ${e.tipo ?? ""} | ${e.tamanho ?? ""} | ${e.dias["especificação"] ?? ""} | ${e.dias.desenvolvimento ?? ""} | ${e.dias.atendimento ?? ""} | ${e.lead_time ?? ""} | ${e.aberto ? "em aberto" : e.no_prazo ? "sim" : "não"} |`));
  return linhas;
}
