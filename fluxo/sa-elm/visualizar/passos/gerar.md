---
{"resumo": "Gera o explorar.html único e offline na pasta do bundle."}
---
## Entrada

O bundle indexado.

## Faça

`elm_explorar_local(projeto, pa)` → um HTML único e offline na pasta do bundle, com vista 3D ou 2D, busca e
filtros por tipo, pasta e galáxia (planeta = documento, lua = chunk). Gerar de novo sobrescreve o arquivo. O
`explorar.html` fica fora do git.

## Saída

Gerado → passo `saida`. Erro de índice ou de bundle → passo `sem-indice`.

## Pare se

- Nunca.
