---
{"resumo": "Só com ELM: executa, na sessão da pessoa, a resposta dada no assumir sobre criar o item (tarefa DEV); a resposta não muda o fluxo."}
---
## Entrada

A chave `elm` do `agentes.json` e a resposta a "quer criar o item no ELM?" do passo `assumir`.

## Faça

Este passo roda na sessão da pessoa, mesmo com a autonomia IA autopilot: o subagente ainda não foi lançado e não usa o ELM.

1. Sem ELM (`elm` = `false`) → não pergunte; siga.
2. Com ELM e sem a resposta do `assumir` (volta da virada) → pergunte "quer criar o item no ELM?".
3. Sim → chame a `sa-elm.item` (tarefa `DEV`), que volta para cá. Não → siga.

## Saída

Com ou sem o item no ELM → passo `seguir`.

## Pare se

Nunca: o ELM não trava o fluxo.
