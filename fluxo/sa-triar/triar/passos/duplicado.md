---
{"resumo": "Procura o mesmo pedido no backlog.md da branch base, nas fichas e nos registros; o mesmo de um aberto não vira linha nova, e o de um terminal vira item novo com origem."}
---
## Entrada

O item lido no passo `ler`.

## Faça

Procure o mesmo pedido no `backlog.md` da branch base (título parecido, `ib` igual, `obs`; inclusive as canceladas), nas
fichas (`.sabia/planejamento/fatias/`) e nos registros (`.sabia/planejamento/sustentacao/`). Achou → mostre a linha
e pergunte "é o mesmo?".

| Resposta | O existente está | O que acontece |
|---|---|---|
| sim | aberto | pedido em texto ou EWM: não vira linha; diga o id existente. Item da fila: segue como duplicado de `<id>` |
| sim | terminal | segue como item novo, com `origem <id>` na `obs` (o terminal nunca reabre) |
| não | — | segue |

Ninguém parecido → segue.

## Saída

O mesmo de um aberto, vindo de pedido em texto ou EWM → passo `encaminhar`, com o id existente. Os demais → passo
`decidir` (o item da fila já marcado como duplicado de `<id>`, quando for).

## Pare se

Nenhuma condição própria: a resposta da pessoa decide o caminho.
