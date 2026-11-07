---
{"resumo": "Mostra o publicado e o pendente, oferece baixar o bundle e devolve ao archive."}
---
## Entrada

O commit da publicação.

## Faça

Mostre `📤 DOORS · publicados <n> · pulados <n> · manuais <n> · Publicação: <publicada | pendente>`. Pergunte
"baixar o bundle agora?": com "sim", chame a `sa-elm.baixar` no modo bundle. Devolva à
`sa-especificar.archive`. No pedido direto, encerre.

## Saída

Fim do fluxo.

## Pare se

- Nunca.
