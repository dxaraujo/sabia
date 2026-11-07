---
{"resumo": "Lê o id da tarefa na coluna Tarefas da linha do item no sprint."}
---
## Entrada

O id do Sabiá e o trabalho.

## Faça

Leia a coluna Tarefas da linha Item · Trabalho no `sprint-<nn>.md` (o aberto; se o item saiu dele, a linha da
sprint onde está). Pegue o id com o prefixo do trabalho. Sem id → pergunte qual é ou diga que não há tarefa.

## Saída

Com a tarefa → passo `horas-antes`. Sem tarefa → passo `devolver`.

## Pare se

- Nunca.
