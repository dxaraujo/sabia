---
{"resumo": "backlog.md ou sprint-<nn>.md alterado numa branch de item."}
---
## Entrada

As branches `<id>`.

## Faça

`backlog.md` ou `sprint-<nn>.md` alterado numa branch de item (`git diff --name-only origin/<branch_base>...origin/<id>`),
quando só muda na branch base → o dono da branch desfaz a alteração na branch.

## Saída

→ o próximo passo da lista.

## Pare se

Sem condição própria: nenhuma pendência trava.
