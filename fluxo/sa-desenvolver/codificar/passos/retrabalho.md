---
{"resumo": "MR aberto com thread não resolvida, CI vermelho ou conflito: Fase retrabalho, achados 'corrige' viram tarefas [R<n>] e conflito sai por merge da branch base."}
---
## Entrada

O MR da branch (link no `status.md`; no trivial, pela branch), lido pelo `gitlabpr` (`gitlab_obter_mr`). Sem o
MCP, a pessoa diz o estado.

## Faça

Sem MR aberto, ou MR sem thread aberta, CI verde e sem conflito → nada a fazer; siga.

1. Grave Fase `retrabalho` no `status.md`.
2. Cada achado triado como `corrige` na `sa-revisar.mr` vira uma tarefa `[R<n>]` no `tasks.md`; no trivial, corrija
   direto. Os outros destinos já saíram na triagem do revisor.
3. CI vermelho: a falha vira tarefa (sem o MCP do Jenkins, a pessoa informa a falha).
4. Conflito: `git merge origin/<branch_base>` (fora do autopilot com o "sim"), resolva e rode o backpressure do trecho.
   Nunca rebase.
5. No fim, o mesmo MR é atualizado (passo `mr`).

## Saída

Tarefas de retrabalho no `tasks.md` (ou nada a fazer) → passo `tarefa`.

## Pare se

- MR fechado sem merge → mostre e pare.
