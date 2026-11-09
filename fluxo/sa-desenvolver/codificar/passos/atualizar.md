---
{"resumo": "Atualiza a branch com a branch base só por merge (git merge origin/<branch_base>), nunca rebase."}
---
## Entrada

Todas as tarefas marcadas.

## Faça

1. `git fetch`. A branch está atrás de `origin/<branch_base>` → `git merge origin/<branch_base>`: fora do autopilot, com o "sim";
   no autopilot, liberado.
2. Conflito: resolva e rode o backpressure do trecho tocado.
3. Nunca rebase, nunca `--force`.

## Saída

Branch em dia com a branch base → passo `validar`.

## Pare se

- Merge recusado pela pessoa → siga avisando que o MR pode ter conflito.
