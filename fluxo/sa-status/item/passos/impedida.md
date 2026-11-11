---
{"resumo": "Item impedido: mostra o motivo, quem impede, desde quando e até quando; a liberação é da sa-status.situacao."}
---
## Entrada

O estado.

## Faça

`impedida` ou `impedido` → mostre a coluna `motivo` (o que impede, quem, desde quando, até quando e o status
anterior) e há quantos dias. A dona é a `sa-status.situacao` (liberar), para quem tem `produto` ou é o responsável da
tarefa em curso.

## Saída

Impedido → passo `mostrar-e-seguir`. Senão → passo `triagem-e-refinamento`.

## Pare se

Sem condição própria.
