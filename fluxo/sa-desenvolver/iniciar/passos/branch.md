---
{"resumo": "Cria a branch <id> a partir da base: na sessão (IA supervisionada e manual) ou numa worktree (autopilot)."}
---
## Entrada

O modo escolhido, o `prefixo_branch` e a `base` do `agentes.json` e o `slug` da ficha.

## Faça

1. Sugira a branch `<prefixo_branch>ft-<nnn>-<slug>` e espere o ok (a pessoa pode trocar o nome).
2. IA supervisionada e manual: `git fetch` e `git switch -c <branch> origin/<base>`.
3. IA autopilot: `git worktree add -b <branch> .sabia/local/wt/<id> origin/<base>`; a pessoa continua na base.
4. Sem remoto, a branch sai da base local.

## Saída

Branch criada (ou a worktree) → passo `pasta`.

## Pare se

- Sem o ok do nome da branch.
- A branch já existe no remoto com outro dono → mostre de quem é e pare.
