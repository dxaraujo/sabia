---
{"resumo": "Branch e status que não batem: em andamento sem branch, branch com item nova ou terminal."}
---
## Entrada

As branches e o backlog.

## Faça

- Item `em-andamento` sem branch `<id>` publicada → o responsável retoma (`sa-desenvolver.iniciar`).
- Branch `<id>` publicada com o item em `nova` ou `aceita` → `sa-desenvolver.iniciar`.
- Branch `<id>` aberta com o item `concluida` ou `cancelada` → o dono apaga a branch remota (sem `--force`).

## Saída

→ o próximo passo da lista.

## Pare se

Sem condição própria: nenhuma pendência trava.
