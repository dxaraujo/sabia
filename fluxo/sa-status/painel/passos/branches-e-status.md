---
{"resumo": "Posse pelas branches <id> e worktrees; estado pelo status.md da pasta da spec."}
---
## Entrada

O backlog e a sprint.

## Faça

1. Uma branch `<id>` publicada (`refs/remotes/origin/<id>`) marca a posse. O dono é o autor do primeiro commit
   dela fora da base. Entram também as worktrees `.sabia/local/wt/<id>` (`git worktree list`).
2. Na pasta da spec do item, na branch dele, leia o `status.md`: Trilha · Autonomia · Fase (`implementando` ·
   `revisando` · `verificando` · `pr-aberto` · `retrabalho`) · MR · Desvios · Em aberto · Lições · Retomar.
3. A trilha trivial não tem `status.md`: a fase sai do MR. Item `concluida` ou `cancelada` no `backlog.md` → o
   `status.md` da branch não vale.

## Saída

Posse e estado por item → passo `mr`.

## Pare se

Sem condição própria.
