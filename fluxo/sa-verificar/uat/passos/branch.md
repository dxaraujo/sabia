---
{"resumo": "Traz a branch do MR com git fetch, checkout e git pull --ff-only; árvore suja avisa e para; o UAT não faz commit nela."}
---
## Entrada

O item com o MR aberto da branch `<id>` (passo `entrada`).

## Faça

1. Anote a branch atual, para voltar no fim.
2. `git status --porcelain` com alteração → avise e pare. Nunca `reset`, `stash` nem `rebase`.
3. `git fetch origin <id>`, `git checkout <id>` e `git pull --ff-only`.
4. O UAT não faz commit nessa branch.

## Saída

A branch `<id>` atualizada → passo `cenarios`.

## Pare se

- Árvore suja ou `pull --ff-only` falhou → avise e pare.
