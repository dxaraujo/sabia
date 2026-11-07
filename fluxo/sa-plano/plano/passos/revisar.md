---
{"resumo": "'Quer revisar agora?': sa-revisar.revisar com a rubrica L no sa-revisor e a triagem dos achados."}
---
## Entrada

A parte escrita (completo) ou o plano inteiro (quick).

## Faça

1. No completo, ao fim de cada parte; na quick, uma vez no fim. Pergunte "quer revisar agora?".
2. Sim → chame a `sa-revisar.revisar` (rubrica L) no subagente `sa-revisor`.
3. Achados triados: `corrige` → ajusta o plano; `volta-spec` → Em aberto ao especificador; regra sem decisão → Em
   aberto ao P.O.
4. No autopilot, não pergunte: rode a análise no completo e pule na quick. 2 reprovações seguidas disparam o
   disjuntor, que devolve à pessoa.

## Saída

Completo com parte por escrever, ou achado `corrige` → passo `escrever`; senão → passo `aprovar`.

## Pare se

- Disjuntor disparado no autopilot.
