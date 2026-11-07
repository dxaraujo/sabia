---
{"resumo": "Lança com prévia; o lançamento errado sai só a pedido."}
---
## Entrada

O lançamento montado.

## Faça

Prévia `lançar | <tarefa> | <h> em <data>` e "sim" → `elm_lancar_horas`. Um lançamento errado sai com
`elm_remover_horas(<id>, <data>)`, só a pedido.

## Saída

Passo `devolver`.

## Pare se

- Recusa da PA por campo → mostre o campo e devolva.
