---
{"resumo": "Propõe o commit do que está pronto na branch atual; na Sustentação, vai pela gravação comum na base."}
---
## Entrada

O `git status`.

## Faça

Mostre o `git status` e proponha o commit do que está pronto, com o `status.md`, o `tasks.md` e o CSV de créditos,
na branch atual. A mensagem segue o padrão do `.sabia/sabia.md`; o id da tarefa só entra com `Id no commit: sim`.
Grave com o "ok" e ofereça o push da própria branch (com o sim, sem `--force`). O estado do `backlog.md` e do
`sprint-<nn>.md` não é gravado aqui.

Na Sustentação, sem branch: o registro e o CSV de créditos vão pelo passo `gravar-na-base`, commit
`<ID> registrar sessão`.

## Saída

Na branch `<id>`, ou sem o "ok" → passo `retomada`. Sustentação → passo `gravar-na-base`.

## Pare se

Sem o "ok" → nada é gravado; siga para a retomada.
