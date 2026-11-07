---
{"resumo": "Cria a tarefa filha do IB com o título padrão, a pessoa como dona, e assume."}
---
## Entrada

O IB e a linha do sprint.

## Faça

A coluna Tarefas já tem o prefixo do trabalho → use essa tarefa (idempotência). Senão, crie a tarefa filha do
IB, na iteração da sprint, com o título `[<DEV|ESP|ATD>] <id> <título>` e a pessoa como dona (`elm_criar_wi`).
Campo que a PA exige (ex.: estimativa) → pergunte; nunca chute. Depois, `elm_transicao` assumir.

## Saída

O id da tarefa → passo `gravar-ids`.

## Pare se

- Recusa `precondicao` → mostre o campo, pergunte o valor e tente uma vez; de novo → mostre os ids criados e
  devolva.
