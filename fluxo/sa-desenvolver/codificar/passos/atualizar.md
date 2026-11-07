---
{"resumo": "Atualiza a branch com a base só por merge (git merge origin/<base>), nunca rebase."}
---
## Entrada

Todas as tarefas marcadas.

## Faça

1. `git fetch`. A branch está atrás de `origin/<base>` → `git merge origin/<base>`: fora do autopilot, com o "sim";
   no autopilot, liberado.
2. Conflito: resolva e rode o backpressure do trecho tocado.
3. Nunca rebase, nunca `--force`.

## Saída

Branch em dia com a base → passo `validar`.

## Pare se

- Merge recusado pela pessoa → siga avisando que o MR pode ter conflito.
