---
{"resumo": "Os números da sa-status.painel, as pendências de rastreio e os itens que o disjuntor do autopilot devolveu."}
---
## Entrada

A sprint escolhida.

## Faça

1. Chame a `sa-status.painel` para os números do ciclo: WIP, vazão, lead time (`concluida_em` − `iniciada_em`), idade
   contra o SLE e reserva de capacidade consumida (linhas de atendimento).
2. Chame a `sa-status.pendencias` para a lista de rastreio.
3. Mostre também os itens que o disjuntor do autopilot devolveu no ciclo (`.sabia/local/loop-<id>.md` com
   `Devolvido:`).

## Saída

Os dados na tela → passo `retro`.

## Pare se

Sem condição própria.
