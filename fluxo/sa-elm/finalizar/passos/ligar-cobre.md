---
{"resumo": "Na DEV, liga a tarefa aos requisitos do Cobre que já têm id do ELM."}
---
## Entrada

A tarefa concluída e a ficha do item.

## Faça

Só na `DEV`: para cada linha do Cobre da ficha com id do ELM (`<sigla>-<id>`, nunca o provisório
`<sigla>-<EP|FT>-nn`), `elm_ligar(wi = <DEV>, req = <id>, tipo implementa)`, no mesmo "sim". O requisito novo é
ligado pela `sa-elm.publicar`. Sem Cobre ou `nenhum requisito` → siga.

## Saída

Segue para o passo `ib`.

## Pare se

- Nunca.
