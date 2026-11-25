---
{"resumo": "Confere e atualiza a seção Métricas da sprint, com a resposta sobre a meta."}
---
## Entrada

Os dados do ciclo, a meta da sprint e a `## Métricas` do `sprint-<nn>.md`.

## Faça

1. Rode `sabia metricas --md` de novo: se a sprint andou depois da review (ou a review não gravou a seção), a
   `## Métricas` é regravada com os números de hoje.
2. Pergunte a quem tem `produto`, se ainda não respondeu: "a meta foi atingida?". A resposta fica na primeira linha:
   `- Medida em: AAAA-MM-DD · meta atingida` ou `· meta não atingida — <por quê>`.

A sprint não tem situação: deixa de ser a aberta quando o próximo `sprint-<nn>.md` é gravado. Os itens em aberto ficam
como estão até a virada (`sa-planejamento.sprint.virada`).

## Saída

A `## Métricas` conferida → passo `reserva-capacidade`.

## Pare se

Sem condição própria.
