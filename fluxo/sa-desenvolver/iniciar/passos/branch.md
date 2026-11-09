---
{"resumo": "Cria a branch <id> a partir da branch base: na sessão (IA supervisionada e manual) ou numa worktree (autopilot)."}
---
## Entrada

O autonomia escolhida, o `prefixo_branch` e a `branch_base` do `agentes.json` e o `slug` da ficha.

## Faça

Volta da virada (branch `<id>` publicada, do mesmo responsável) → `git fetch` e `git switch <branch>` (IA autopilot:
`git worktree add .sabia/local/wt/<id> <branch>`), sem criar outra; siga.

1. Sugira a branch `<prefixo_branch>ft-<nnn>-<slug>` e espere o ok (a pessoa pode trocar o nome).
2. IA supervisionada e manual: `git fetch` e `git switch -c <branch> origin/<branch_base>`.
3. IA autopilot: `git worktree add -b <branch> .sabia/local/wt/<id> origin/<branch_base>`; a pessoa continua na branch base.
4. Sem remoto, a branch sai da branch base local.

## Saída

Branch criada (ou a worktree) → passo `pasta`.

## Pare se

- Sem o ok do nome da branch.
- A branch já existe no remoto com outro dono → mostre de quem é e pare.
