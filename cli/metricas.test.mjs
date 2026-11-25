// Testes das métricas (`sabia metricas`): a sprint, as entregas, o histórico da equipe e a seção ## Métricas.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, test } from "node:test";
import { entregasDaSprint, historicoDe, metricasDoProjeto, secaoMetricas } from "./metricas.mjs";
import { sprintsDe } from "./status.mjs";

const raiz = fs.mkdtempSync(path.join(os.tmpdir(), "sabia-metricas-"));
after(() => fs.rmSync(raiz, { recursive: true, force: true }));
const agora = new Date("2026-11-21T12:00:00Z");
const item = (id, tipo, status, tam) => `| ${id} | ${id} | ${tipo} | ${status} |  | ${tam} |  |  |  |  |  | 2026-10-01 |  |\n`;
const sprint = (nn, de, ate, cabecalho, linhas) => `# 2026/Sprint ${nn} · ${de} → ${ate}\n**Meta:** meta ${nn}\n${cabecalho}## Itens\n| Item | Trabalho | Responsável | Tarefas | iniciada_em | concluida_em |\n|---|---|---|---|---|---|\n${linhas.map((l) => `| ${l.join(" | ")} |\n`).join("")}## Review\n## Retro\n`;
function projeto(nome, comAcordos = true) {
  const p = path.join(raiz, nome), arquivos = {
    ".sabia/planejamento/backlog.md": "# Backlog\n| id | título | tipo | status | prioridade | tamanho | responsável | pai | relator | ib | obs | entrou_em | concluida_em |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|\n"
      + item("FT-001", "fatia", "concluida", "P") + item("FT-002", "fatia", "concluida", "M") + item("FT-003", "fatia", "concluida", "M") + item("FT-004", "fatia", "em-andamento", "G") + item("FT-005", "bug", "concluida", "P") + item("AT-001", "sustentação", "concluida", ""),
    ".sabia/planejamento/sprints/2026/sprint-01.md": sprint("01", "2026-10-26", "2026-11-06", "", [["FT-001", "desenvolvimento", "ana", "", "2026-10-26", "2026-10-28"], ["FT-002", "desenvolvimento", "ana", "", "2026-10-28", "2026-11-03"], ["AT-001", "atendimento", "bia", "", "2026-10-27", "2026-10-28"]]),
    ".sabia/planejamento/sprints/2026/sprint-02.md": sprint("02", "2026-11-09", "2026-11-20", "**Reserva de capacidade:** 2\n**Capacidade:** vazão prevista 3 · migrados 0 · sobra 3\n",
      [["FT-003", "especificação", "bia", "", "2026-11-09", "2026-11-10"], ["FT-003", "desenvolvimento", "ana", "", "2026-11-10", "2026-11-14"], ["FT-005", "desenvolvimento", "ana", "", "2026-11-16", "2026-11-24"], ["FT-004", "desenvolvimento", "bia", "", "2026-11-12", ""]]),
  };
  if (comAcordos) arquivos[".sabia/planejamento/acordos.json"] = JSON.stringify({ sle: { percentual: 85, dias: 5 }, reserva_capacidade_pct: 20 });
  for (const [f, c] of Object.entries(arquivos)) { fs.mkdirSync(path.dirname(path.join(p, f)), { recursive: true }); fs.writeFileSync(path.join(p, f), c); }
  return p;
}

test("métricas: a sprint com a vazão contra a prevista, as entregas com os dias de cada trabalho e a seção ## Métricas", () => {
  const p = projeto("sprint"), m = metricasDoProjeto({ projeto: p, agora });
  assert.deepEqual([m.versao, m.projeto, m.sprint.chave, m.sprint.capacidade, m.sprint.reserva], [1, "sprint", "2026/Sprint 02", { prevista: 3, migrados: 0, sobra: 3 }, 2]);
  assert.deepEqual(m.sprint.resumo.vazao, { desenvolvimento: 2, atendimento: 0, "especificação": 1 });
  assert.deepEqual(m.sprint.entregas, [
    { id: "FT-003", tipo: "fatia", tamanho: "M", dias: { "especificação": 1, desenvolvimento: 4, atendimento: null }, lead_time: 5, aberto: false, no_prazo: true },
    { id: "FT-005", tipo: "bug", tamanho: "P", dias: { "especificação": null, desenvolvimento: 8, atendimento: null }, lead_time: 8, aberto: false, no_prazo: false },
  ]);  // a FT-004, sem linha concluída, não é entrega
  assert.deepEqual(secaoMetricas(m), [
    "- Medida em: 2026-11-21",
    "- Conclusão: 3 de 4 linhas (75%) · no prazo 2 · depois 1 · em aberto 1",
    "- Vazão: desenvolvimento 2 (prevista 3) · atendimento 0 · especificação 1",
    "- Lead time médio: desenvolvimento 6 dias · atendimento — · especificação 1 dia",
    "- SLE: 50% em até 5 dias (alvo 85%)",
    "- Reserva de capacidade: 0 de 2 itens",
    "",
    "| Entrega | Tipo | Tam. | Especificação (d) | Desenvolvimento (d) | Atendimento (d) | Lead time (d) | No prazo |",
    "|---|---|---|---|---|---|---|---|",
    "| FT-003 | fatia | M | 1 | 4 |  | 5 | sim |",
    "| FT-005 | bug | P |  | 8 |  | 8 | não |",
  ]);
  // a sprint pedida pela chave; sem capacidade no cabeçalho, sem a prevista; sem acordos, sem SLE; sem reserva, sem a linha
  const m1 = metricasDoProjeto({ projeto: projeto("antiga", false), agora, chave: "2026/Sprint 01" });
  assert.deepEqual(secaoMetricas(m1).slice(0, 4), ["- Medida em: 2026-11-21", "- Conclusão: 3 de 3 linhas (100%) · no prazo 3 · depois 0 · em aberto 0", "- Vazão: desenvolvimento 2 · atendimento 1 · especificação 0", "- Lead time médio: desenvolvimento 4 dias · atendimento 1 dia · especificação —"]);
  assert.equal(secaoMetricas(m1)[4], "");
  assert.throws(() => metricasDoProjeto({ projeto: p, agora, chave: "2026/Sprint 09" }), /não há a sprint 2026\/Sprint 09/);
  assert.throws(() => metricasDoProjeto({ projeto: raiz, agora }), /não há sprint/);
});

test("métricas: o histórico pelas sprints — a vazão de cada uma, a média das fechadas e a duração por tamanho", () => {
  const p = projeto("historico"), h = metricasDoProjeto({ projeto: p, agora }).historico;
  assert.deepEqual(h.sprints.map((s) => [s.chave, s.aberta, s.prevista, s.vazao.desenvolvimento, s.vazao.atendimento, s.lead_medio]), [["2026/Sprint 02", false, 3, 2, 0, 6], ["2026/Sprint 01", false, null, 2, 1, 4]]);
  assert.deepEqual(h.vazao_media, { sprints: ["2026/Sprint 02", "2026/Sprint 01"], "especificação": 0.5, desenvolvimento: 2, atendimento: 0.5 });
  // P: 2 e 8 dias; M: 6 e 4 dias — mediana e percentil 85 pelo posto mais próximo
  assert.deepEqual(h.duracao_por_tamanho, { M: { itens: 2, mediana: 4, p85: 6 }, P: { itens: 2, mediana: 2, p85: 8 } });
  // a sprint aberta não entra na média
  const aberta = historicoDe(sprintsDe(p, "2026-11-15"), []);
  assert.deepEqual([aberta.vazao_media.sprints, aberta.duracao_por_tamanho], [["2026/Sprint 01"], {}]);
  assert.deepEqual(entregasDaSprint({ fim: "2026-11-20", itens: [] }, []), []);
});
