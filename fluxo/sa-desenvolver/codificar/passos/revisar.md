---
{"resumo": "Autorrevisão: sa-revisar.revisar no subagente sa-revisor (rubrica C: spec · padrões · segurança) e triagem dos achados."}
---
## Entrada

A branch com a suíte verde e o diff contra `origin/<base>`.

## Faça

1. Grave Fase `revisando`.
2. Chame a `sa-revisar.revisar` no subagente `sa-revisor` com a rubrica C (spec · padrões · segurança), as rubricas
   do toolkit e o diff. É autorrevisão, sem valor de revisão oficial.
3. Cada achado tem severidade BLOQUEANTE, IMPORTANTE ou SUGESTÃO. Triagem:
   - `corrige` → tarefa `[R<n>]` no `tasks.md` e volta ao passo `tarefa`;
   - `adia` → passo `captura` (`obs` `origem FT-nnn`);
   - `volta-plano` → `sa-plano.replanejar`;
   - `volta-spec` → Em aberto ao especificador;
   - `descarta` → o motivo vai no MR.
4. Fora do autopilot, a pessoa tria. No autopilot, siga a recomendação do revisor e registre em Desvios.
5. Guarde o resumo para a Prova do MR.

## Saída

Sem BLOQUEANTE aberto → passo `verificar`.

## Pare se

- `VEREDITO: AMBIENTE` fora do autopilot → a pessoa decide se segue.
