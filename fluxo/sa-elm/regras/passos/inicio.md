---
{"resumo": "Abertura: as regras rodam dentro de outro fluxo da sa-elm, nunca sozinhas."}
---
## Entrada

O passo `inicio` de um fluxo da `sa-elm`, com o nome do fluxo e a skill que ofereceu o ELM (se houver).

## Faça

Guarde quem incluiu (o fluxo da `sa-elm`) e quem ofereceu (a skill do trabalho): a devolução vai para essa
skill, que segue do ponto em que parou.

## Saída

Segue para o passo `pre-condicao`.

## Pare se

- Pedido direto de "regras do ELM", sem fluxo → explique as regras em poucas linhas e pare.
