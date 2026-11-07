---
{"resumo": "Sem horas lançadas, oferece lançar antes de concluir."}
---
## Entrada

A tarefa.

## Faça

`elm_horas(<id>)`. Sem horas lançadas → pergunte "deseja lançar horas?". Com "sim", chame a `sa-elm.horas`,
que volta para cá. Com "não", siga.

## Saída

Segue para o passo `concluir`.

## Pare se

- Nunca: horas nunca travam a conclusão.
