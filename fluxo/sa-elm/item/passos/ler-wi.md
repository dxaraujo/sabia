---
{"resumo": "A pedido, devolve a descrição e os comentários de um WI."}
---
## Entrada

O número do WI, de uma skill ou da pessoa.

## Faça

`elm_ler_wi(<id>)` → devolva a descrição e os comentários (Markdown), sem gravar nada.

## Saída

O texto do WI → passo `devolver`.

## Pare se

- `nao_encontrado` → pergunte o número.
