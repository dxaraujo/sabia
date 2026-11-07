---
{"resumo": "Só se o item passou pelo autopilot: remove a worktree sem --force e apaga o loop-<id>.md."}
---
## Entrada

`git worktree list` e `.sabia/local/loop-<id>.md`.

## Faça

1. Sem worktree `.sabia/local/wt/<id>` → nada a fazer; siga.
2. Com o "sim": `git worktree remove .sabia/local/wt/<id>` (sem `--force`) e apague `.sabia/local/loop-<id>.md`.
3. A worktree tem arquivos alterados → mostre quais; a pessoa decide.

## Saída

Worktree removida (ou mantida pela pessoa) → passo `seguir`.

## Pare se

Nunca.
