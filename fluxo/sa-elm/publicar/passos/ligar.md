---
{"resumo": "Liga os requisitos publicados à tarefa DEV do item, se houver."}
---
## Entrada

Os requisitos publicados.

## Faça

Se a coluna Tarefas da linha do item no `sprint-<nn>.md` tem uma `DEV`, ligue a ela os requisitos publicados
(`elm_ligar(wi = <DEV>, req = <id>, tipo implementa)`), no mesmo "sim". Sem `DEV`, siga.

## Saída

Segue para o passo `ata`.

## Pare se

- Nunca.
