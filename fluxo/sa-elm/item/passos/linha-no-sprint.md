---
{"resumo": "Acha ou acrescenta a linha Item · Trabalho no sprint aberto."}
---
## Entrada

O id, o trabalho e o `sprint-<nn>.md` aberto (o de maior chave).

## Faça

Procure a linha Item · Trabalho do item no `sprint-<nn>.md` aberto. Não existe → acrescente (Item · Trabalho ·
Responsável = a pessoa · Tarefas e datas vazias), gravada no passo `gravar`. Sem sprint aberta → não crie a tarefa: diga
que ela nasce quando o item entrar numa sprint.

## Saída

Linha achada ou nova → passo `tarefa`. Sem sprint aberta → passo `gravar-ids` (só a coluna `ib`, se o IB
nasceu agora).

## Pare se

- Nunca crie sprint: isso é da `sa-planejamento.sprint`.
