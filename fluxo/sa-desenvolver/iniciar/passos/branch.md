---
{"resumo": "Cria a branch <id> a partir da branch base: na sessão (IA supervisionada e manual) ou numa worktree (autopilot)."}
---
## Entrada

A autonomia escolhida, o nome de branch confirmado no passo `assumir` e a `branch_base` do `agentes.json`.

## Faça

Volta da virada (branch `<id>` publicada, do mesmo responsável) → `git fetch` e `git switch <branch>` (IA autopilot:
`git worktree add .sabia/local/wt/<id> <branch>`), sem criar outra; siga.

1. Use o nome confirmado no passo `assumir`.
2. IA supervisionada e manual: `git fetch` e `git switch -c <branch> origin/<branch_base>`.
3. IA autopilot: `git worktree add -b <branch> .sabia/local/wt/<id> origin/<branch_base>`; a pessoa continua na branch base.
4. Sem remoto, a branch sai da branch base local.

## Saída

Branch criada (ou a worktree) → passo `pasta`.

## Pare se

- A branch já existe no remoto com outro dono → mostre de quem é e pare.
