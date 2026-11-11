---
{"resumo": "Propõe o commit do que está pronto na branch atual; na Sustentação, vai pelo commit direto na branch base."}
---
## Entrada

O `git status`.

## Faça

Mostre o `git status` e proponha o commit do que está pronto, com o `status.md`, o `tasks.md` e o CSV de créditos,
na branch atual. A mensagem segue o padrão do `.sabia/sabia.md`; o id da tarefa só entra com `id_no_commit: true` no `acordos.json`.
Grave com o "ok" e ofereça o push da própria branch (com o sim, sem `--force`). O estado do `backlog.md` e do
`sprint-<nn>.md` não é gravado aqui.

Na Sustentação, sem branch: o registro e o CSV de créditos vão pelo passo `commit-na-branch-base`, commit
`<ID> registrar sessão`.

## Saída

Na branch `<id>`, ou sem o "ok" → passo `retomada`. Sustentação → passo `commit-na-branch-base`.

## Pare se

Sem o "ok" → nada é gravado; siga para a retomada.
