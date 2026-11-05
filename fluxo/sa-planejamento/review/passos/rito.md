---
{"resumo": "Rito da review: o resumo da coluna Status e, para cada fatia concluída, o cenário entregue e a evidência; o débito de especificação sem tarefa; o retorno do P.O. no sprint-<nn>.md."}
---
## Entrada

A pré-condição dos ritos de fechamento cumprida (passos `sincronizar` e `consolidacao`).

## Faça

Abra pelo resumo da coluna Status das Fatias do `sprint-<nn>.md` — concluídas · prontas sem consolidar · iniciadas
e planejadas que migram —: é o que foi feito na sprint. Para cada fatia concluída: o cenário entregue e a
**evidência** do `verificacao.md` (resposta, contagem, screenshot). Depois das concluídas, o débito técnico de
especificação: `Débito de especificação: <linhas com Tarefa —>` (seção Débito de especificação do `sprint-<nn>.md`;
a consolidada sem sprint aberta, pelo Histórico do `status.md` e pela `obs` `débito de especificação` da fatia); a
correção é decisão do P.O. Registre o retorno do P.O. no `sprint-<nn>.md`;
pedido novo → registre-o pela `sa-triar` (origem: review `<chave>`) — não reabre fatia concluída.

## Saída

O retorno do P.O. registrado: o fluxo termina. A retrospectiva e a virada são o fluxo `sa-planejamento.retrospectiva`.

## Pare se

Pedido para reabrir fatia concluída → não reabre: é pedido novo pela `sa-triar`.
