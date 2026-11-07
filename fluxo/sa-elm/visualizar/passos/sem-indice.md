---
{"resumo": "Sem índice, indexa e roda de novo; sem bundle, oferece a sa-elm.baixar."}
---
## Entrada

O erro do passo `gerar`.

## Faça

`precondicao` com `campo: "indice"` → `elm_indexar_local` e volte ao passo `gerar`. `nao_encontrado` com
`campo: "bundle"` → ofereça "baixar o bundle agora?" (`sa-elm.baixar`).

## Saída

Indexado → passo `gerar`. Sem bundle, com o "sim" → passa à `sa-elm.baixar`. Sem o "sim" → fim.

## Pare se

- Nunca.
