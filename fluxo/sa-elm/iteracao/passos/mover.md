---
{"resumo": "Move o IB e as tarefas das linhas do sprint; na virada, só os migrados."}
---
## Entrada

A iteração e as linhas do `sprint-<nn>.md`.

## Faça

Mova para a iteração (`elm_atualizar_wi(ids, iteracao)`) o IB (coluna `ib`) e as tarefas (coluna Tarefas) de
cada linha. Na virada, só os itens migrados. Move, nunca recria. A tarefa do item tirado da sprint é cancelada
pela `sa-elm.finalizar` (passo cancelar).

## Saída

Segue para o passo `devolver`.

## Pare se

- Nunca.
