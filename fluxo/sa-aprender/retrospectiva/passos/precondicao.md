---
{"resumo": "Retrospectiva de sprint pedida direto → \"use a sa-planejamento (retrospectiva)\" e para; chamada por ela, ou de fatia ou de épico → dados."}
---
## Entrada

O pedido de retrospectiva, ou a chamada do passo `sa-planejamento.retrospectiva.retro`.

## Faça

Retrospectiva de **sprint** pedida direto → "use a `sa-planejamento` (retrospectiva)": lá rodam a pré-condição dos
ritos de fechamento, as horas, o fechamento e a virada. Chamada pelo passo `sa-planejamento.retrospectiva.retro`
(a pré-condição já cumprida), ou de fatia ou de épico → siga.

## Saída

Siga → passo `dados`. Sprint pedida direto → a frase acima: o fluxo termina.

## Pare se

Retrospectiva de sprint fora do passo `sa-planejamento.retrospectiva.retro` → a frase acima e pare.
