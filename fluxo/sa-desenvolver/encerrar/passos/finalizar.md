---
{"resumo": "Só com ELM: oferece finalizar a tarefa no ELM (sa-elm.finalizar); qualquer resposta segue."}
---
## Entrada

A chave `elm` do `agentes.json` e a linha do item no `sprint-<nn>.md` (Tarefas).

## Faça

1. Sem ELM → não pergunte; siga.
2. Com ELM: pergunte "finalizar a tarefa no ELM?". Sim → chame a `sa-elm.finalizar`, que oferece as horas e, na
   última fatia, a conclusão do IB do épico, e volta para cá.

## Saída

Com qualquer resposta → passo `archive`.

## Pare se

Nunca: o ELM não trava o fluxo.
