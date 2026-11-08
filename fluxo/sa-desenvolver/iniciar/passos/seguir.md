---
{"resumo": "Mostra o resumo do início e encaminha pelo modo: plano, codificação, autopilot ou a espera do manual."}
---
## Entrada

O item assumido: título, tamanho, rota, modo, branch e pasta.

## Faça

1. Mostre `🚦 FT-nnn — <título> · <tamanho> · <rota> · <autonomia> · <branch> · <pasta | sem pasta>`.
2. Pelo modo:
   - **IA supervisionada**: ofereça "seguir?" na mesma sessão, para a `sa-plano.plano` (rápida e completo) ou a
     `sa-desenvolver.codificar` (trivial).
   - **Manual**: na rápida e no completo, ofereça a `sa-plano.plano` como na IA supervisionada; ela encerra a sessão
     depois do plano aprovado. No trivial, diga "codificação manual; avise quando terminar" e encerre a sessão. Na
     volta ("terminei", nesta ou em outra sessão), a `sa-desenvolver.codificar` segue do validar.
   - **IA autopilot**: vá ao passo `autopilot`.

## Saída

A saída do mestre pelo modo e pela rota.

## Pare se

- Sem o "sim" para seguir → termine com o resumo e a frase de retomada ("vamos trabalhar na FT-nnn").
