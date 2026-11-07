---
{"resumo": "Só com ELM: oferece criar o item no ELM (tarefa DEV); a resposta não muda o fluxo."}
---
## Entrada

A chave `elm` do `agentes.json`.

## Faça

1. Sem ELM (`elm` = `false`) → não pergunte; siga.
2. Com ELM: pergunte "quer criar o item no ELM?". Sim → chame a `sa-elm.item` (tarefa `DEV`), que volta para cá.
   Não → siga.

## Saída

Com ou sem o item no ELM → passo `seguir`.

## Pare se

Nunca: o ELM não trava o fluxo.
