---
{"resumo": "Os números da sa-status.painel, as pendências de rastreio, e os itens que o disjuntor do autopilot devolveu."}
---
## Entrada

A sprint escolhida.

## Faça

1. Leia a `## Métricas` do `sprint-<nn>.md` (a review a grava) e rode `sabia metricas` para o histórico: a vazão das
   sprints anteriores contra a prevista e a duração por tamanho. Chame também a `sa-status.painel` para os números do ciclo: WIP, vazão, lead time do item e por trabalho (`concluida_em` − `iniciada_em` das linhas da sprint), idade
   contra o SLE e reserva de capacidade consumida (linhas de atendimento).
2. Chame a `sa-status.pendencias` para a lista de rastreio.
3. Mostre também os itens que o disjuntor do autopilot devolveu no ciclo (`.sabia/local/loop-<id>.md` com
   `Devolvido:`).

## Saída

Os dados na tela → passo `retro`. O agente não redige ponto: quem levanta é o time, na página.

## Pare se

Sem condição própria.
