---
{"resumo": "Para cada arquivo de elm/, compara o DOORS atual com a versão de referência e mostra a diferença."}
---
## Entrada

A fatia e a pasta `elm/` da spec dela.

## Faça

Para cada arquivo de `elm/` com id do ELM, `elm_ler_req(<id>)` e compare o `modificado_em` atual com a versão de referência dos artefatos afetados. Mudou → mostre o texto do DOORS atual contra o commit de base do arquivo (o original baixado). O
especificador decide: baixar de novo e mesclar (na `sa-especificar.elm`) ou seguir.

## Saída

Chamado pela `sa-especificar.elm` → devolva a lista a ela. Pedido direto → passa à `sa-especificar.elm` para
mesclar, ou passo `devolver`.

## Pare se

- Nunca altere o arquivo de `elm/` aqui.
