---
{"resumo": "'Quer revisar agora?' sobre a parte alterada: sa-revisar.revisar com os critérios de revisão L no sa-revisor."}
---
## Entrada

A parte alterada do plano.

## Faça

1. Pergunte "quer revisar agora?" sobre a parte alterada. Sim → chame a `sa-revisar.revisar` (critérios de revisão L) no
   subagente `sa-revisor`.
2. Achados triados como no plano: `corrige` → ajusta; `volta-spec` → Em aberto ao especificador; regra sem decisão →
   Em aberto ao P.O.
3. No autopilot, rode a análise só no completo.

## Saída

Sem achado `corrige` → passo `aprovar`.

## Pare se

Nunca.
