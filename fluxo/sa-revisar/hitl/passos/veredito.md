---
{"resumo": "APROVADO → fase em-verificacao; REVISAR → retrabalho (de: em-revisao), Rodadas e linha na tabela Retrabalho; a [REV] fica em andamento."}
---
## Entrada

O `VEREDITO` na última linha do `revisao-codigo-<N>.md` (passo `rubrica`).

## Faça

- **`APROVADO`** → `fase: em-verificacao`.
- **`REVISAR`** → `fase: retrabalho (de: em-revisao)`; incremente "retrabalho" em Rodadas e grave uma linha na
  tabela **Retrabalho** do `status.md` (papel REV, motivo = o relatório). A `[REV]` fica em andamento: você
  revisa de novo quando o PR for atualizado (a retomada começa no passo `pr`).

## Saída

A fase do veredito no `status.md` → passo `entrega`.

## Pare se

—
