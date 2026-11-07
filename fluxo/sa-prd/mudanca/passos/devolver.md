---
{"resumo": "Devolve a quem chamou; no pedido direto com fatia atingida, oferece seguir para o ajuste das fatias."}
---
## Entrada

A versão aprovada e a lista de fatias atingidas.

## Faça

Chamada por outra skill → devolva a versão e as fatias atingidas. Pedido direto com fatia atingida → "seguir para o
ajuste das fatias?" (`sa-refinar.ajustar`). Senão, termine com o resumo.

## Saída

Devolvido, a passagem à `sa-refinar.ajustar` ou o resumo.

## Pare se

Nenhum caso próprio deste passo.
