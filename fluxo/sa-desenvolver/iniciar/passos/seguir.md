---
{"resumo": "Mostra o resumo do início e encaminha pela autonomia: plano, codificação, autopilot ou a espera do manual."}
---
## Entrada

O item assumido: título, tamanho, trilha, autonomia, branch, pasta e, com ELM, a tarefa criada ou a recusa.

## Faça

1. Mostre `🚦 FT-nnn — <título> · <tamanho> · <trilha> · <autonomia> · <branch> · <pasta | sem pasta>`, com
   ` · ELM: <tarefa | não | pendente>` no fim quando houver a chave `elm`.
2. Pela autonomia:
   - **IA supervisionada**: ofereça "seguir?" na mesma sessão, para a `sa-plano.plano` (rápida e completo) ou a
     `sa-desenvolver.codificar` (trivial).
   - **Manual**: na rápida e no completo, ofereça a `sa-plano.plano` como na IA supervisionada; ela encerra a sessão
     depois do plano aprovado. No trivial, diga "codificação manual; avise quando terminar" e encerre a sessão. Na
     volta ("terminei", nesta ou em outra sessão), a `sa-desenvolver.codificar` segue do validar.
   - **IA autopilot**: vá ao passo `autopilot`.

## Saída

A saída da definição do fluxo pela autonomia e pela trilha.

## Pare se

- Sem o "sim" para seguir → termine com o resumo e a frase de retomada ("vamos trabalhar na FT-nnn").
