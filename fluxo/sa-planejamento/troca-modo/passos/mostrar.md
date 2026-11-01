---
{"resumo": "Mostra a fatia, o motivo e a sugestão de revisor (Dev Sênior) e verificador de menor alocação; não troca → AFK mantido."}
---
## Entrada

A fatia em `bloqueada (de: planejando)` com `aguardando troca para HITL` e o motivo.

## Faça

Mostre a fatia, o motivo (Histórico do `status.md` da branch, por `git show origin/<branch>:…`) e a sugestão de
**revisor** (Dev Sênior ativo, pela regra do revisor: `sa-planejamento.sprint.modo`) e de **verificador** (não quem
implementa), cada um o de **menor alocação** na sprint: a soma das horas estimadas das tarefas abertas de cada
pessoa na iteração da sprint no EWM (`elm_listar_wi(iteracao, dono)`); sem ELM, a contagem
de fatias de cada um no `sprint-<nn>.md`.

## Saída

"ok" → passo `gravar`. Não troca → Observação `modo: AFK mantido (<quem>, <data>)` no `sprint-<nn>.md` e avise o Dev, que retoma no AFK
(passo `sa-plano.plano.gate`, GATE). **HITL → AFK nunca.**

## Pare se

A decisão é do P.O. (ou do SM): sem ela, nada é trocado.
