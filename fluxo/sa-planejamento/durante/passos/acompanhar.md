---
{"resumo": "\"Como está a sprint?\" → sa-status filtrado pela sprint; fatia que cresceu volta à sa-fatiar; Sustentação acima da reserva vai ao Encaixe."}
---
## Entrada

A sprint aberta.

## Faça

"Como está a sprint?" → **`sa-status`** filtrado pela sprint (fase de cada fatia, bloqueios, WIP de revisão,
PRs parados). Sustentação que estoura a reserva → o P.O. decide pelo Encaixe (passo `encaixe`); a Sustentação nunca tira fatia sozinha.

## Saída

A situação da sprint: o fluxo termina. Encaixe → passo `encaixe`; tarefa por fora, divergência ou id `a conferir`
no painel → passo `sincronizar`.

## Pare se

Fatia que cresceu (passou de `G` no plano) → volte para a `sa-fatiar` (dividir) em vez de esticar.
