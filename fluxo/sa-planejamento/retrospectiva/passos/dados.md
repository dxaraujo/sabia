---
{"resumo": "Os números da sa-status.painel, as pendências de rastreio, os itens que o disjuntor do autopilot devolveu e as propostas de quem conduz."}
---
## Entrada

A sprint escolhida.

## Faça

1. Chame a `sa-status.painel` para os números do ciclo: WIP, vazão, lead time do item e por trabalho (`concluida_em` − `iniciada_em` das linhas da sprint), idade
   contra o SLE e reserva de capacidade consumida (linhas de atendimento).
2. Chame a `sa-status.pendencias` para a lista de rastreio.
3. Mostre também os itens que o disjuntor do autopilot devolveu no ciclo (`.sabia/local/loop-<id>.md` com
   `Devolvido:`).
4. Com a `## Retro` do `sprint-<nn>.md` vazia, ofereça redigir as propostas a partir desses dados. Com o "sim", mostre-as
   e grave em `.sabia/local/cerimonia/propostas.json`: `{ "retrospective": [{ "tipo": "positivo|negativo|melhoria|acao",
   "texto": "…", "autor": "<quem conduz>", "dono": "<usuario>" }] }` (`dono` só na ação, se a pessoa disser). O `autor` é
   a pessoa que conduz, ou quem ela indicar; nunca o agente. Nada vai ao `sprint-<nn>.md` neste passo.

## Saída

Os dados na tela e, se a pessoa quis, as propostas no arquivo → passo `retro`.

## Pare se

Sem condição própria.
