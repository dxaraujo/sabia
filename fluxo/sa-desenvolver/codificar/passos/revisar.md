---
{"resumo": "Revisão do agente: sa-revisar.revisar no subagente sa-revisor (critérios de revisão C: spec · padrões · segurança) e triagem dos achados."}
---
## Entrada

A branch com a suíte verde e o diff contra `origin/<branch_base>`.

## Faça

1. Grave Fase `revisando`.
2. Chame a `sa-revisar.revisar` no subagente `sa-revisor` com os critérios de revisão C (spec · padrões · segurança), os critérios de revisão
   do toolkit e o diff. É revisão do agente, sem valor de revisão oficial.
3. Cada achado tem severidade BLOQUEANTE, IMPORTANTE ou SUGESTÃO. Triagem:
   - `corrige` → tarefa `[R<n>]` no `tasks.md` e volta ao passo `tarefa`;
   - `adia` → passo `captura` (`obs` `origem FT-nnn`);
   - `volta-plano` → `sa-plano.replanejar`;
   - `volta-spec` → Em aberto ao especificador;
   - `descarta` → o motivo vai no MR.
4. Fora do autopilot, a pessoa tria. No autopilot, siga a recomendação do revisor e registre em Desvios.
5. Guarde o resumo para a Evidência do MR.

## Saída

Sem BLOQUEANTE aberto → passo `verificar`.

## Pare se

- `VEREDITO: AMBIENTE` fora do autopilot → a pessoa decide se segue.
