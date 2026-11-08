---
{"resumo": "Pergunta horas, dias e tarefa, sugerindo as tarefas da pessoa no sprint."}
---
## Entrada

O pedido incompleto, ou a oferta de outra skill.

## Faça

Pergunte as horas, os dias e a tarefa, e sugira as tarefas da pessoa na coluna Tarefas do `sprint-<nn>.md` aberto
(a do item da skill que ofereceu primeiro). Horas de revisão e de revisão humana vão para uma tarefa da própria pessoa, sem
criar tarefa nova.

## Saída

O lançamento montado → passo `lancar`.

## Pare se

- "não" ou "depois" → passo `devolver`, sem lançar.
