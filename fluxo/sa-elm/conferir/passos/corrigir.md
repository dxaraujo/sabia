---
{"resumo": "Cada correção pede sim e vai ao fluxo dono: finalizar a tarefa ou corrigir o id na linha."}
---
## Entrada

A lista de divergências do passo `tarefas`.

## Faça

Para cada divergência, proponha a correção e peça o "sim":

- Tarefa aberta no EWM com o item concluído ou cancelado aqui → `sa-elm.finalizar` (concluir ou cancelar).
- Id errado ou inexistente na coluna Tarefas → prepare a linha corrigida para o passo `gravar` (mensagem
  `elm: conferir sprint`).
- Tarefa concluída no EWM com o item aberto aqui → só avise: o status do item no `backlog.md` continua decidido
  no Sabiá, pela skill do trabalho.

## Saída

Com linha a corrigir → passo `gravar`. Senão → passo `devolver`.

## Pare se

- Nunca mude o status do `backlog.md` por causa do EWM.
