---
{"resumo": "Possível alteração indicada → a pessoa decide (volta à especificação: bloqueada; código errado: achado); APROVADO → fase em-verificacao; REVISAR → retrabalho (de: em-revisao), Rodadas e linha na tabela Retrabalho; a [REV] fica em andamento."}
---
## Entrada

O `VEREDITO` na última linha do `revisao-codigo-<N>.md` e o Drift de negócio do `status.md` (passo `rubrica`).

## Faça

**Possível alteração** (`possível alteração — … · artefatos: …` sem ` · especificação:`) → antes do veredito,
mostre-a e pergunte: `Possível alteração: <motivo> · <artefatos>. Volta à especificação, ou o código está errado?` A
decisão é sua, não do agente:

- **código errado** → o motivo vira achado BLOQUEANTE no relatório (`VEREDITO: REVISAR`), o Drift fica `não` e o
  Histórico ganha `drift descartado: código errado (<login>)`;
- **volta** → ` · especificação: [ESP] FT-<nnn>` no Drift e o bloco [Volta à especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação) (`de: em-revisao`), só na branch do PR (nada na base); a `[REV]` fica em andamento (você revisa
  de novo quando o PR for atualizado) e o veredito abaixo não se aplica.

- **`APROVADO`** → `fase: em-verificacao`.
- **`REVISAR`** → `fase: retrabalho (de: em-revisao)`; incremente "retrabalho" em Rodadas e grave uma linha na
  tabela **Retrabalho** do `status.md` (papel REV, motivo = o relatório). A `[REV]` fica em andamento: você
  revisa de novo quando o PR for atualizado (a retomada começa no passo `pr`).

## Saída

A fase do veredito (ou `bloqueada`, na volta à especificação) no `status.md` → passo `entrega`.

## Pare se

—
