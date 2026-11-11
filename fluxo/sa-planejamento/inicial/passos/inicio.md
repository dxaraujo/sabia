---
{"resumo": "Lê o equipe.json e o acordos.json, se existem; com os dois, mostra e pergunta só o que mudou."}
---
## Entrada

Pedido direto ("monta o planejamento", "acordos do time", "rever a equipe"), a oferta da `sa-setup.configurar` ou a
`sa-planejamento.sprint` quando falta o `equipe.json` ou o `acordos.json`. Qualquer pessoa conduz.

## Faça

Leia `.sabia/planejamento/equipe.json` e `.sabia/planejamento/acordos.json` da branch base, se existem. Com os dois, mostre os
dois e pergunte só o que mudou. Sem um deles, siga para montar o que falta. Pergunte também se o pedido é só rever a
equipe e os acordos (aí o fluxo termina depois da gravação, sem o roadmap).

## Saída

O que muda na equipe e nos acordos → passo `equipe`. Nada mudou nos dois → passo `roadmap`.

## Pare se

Sem `.sabia/planejamento/` na branch base → "rode a `sa-setup.configurar`" e pare.
