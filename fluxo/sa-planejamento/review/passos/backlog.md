---
{"resumo": "Mostra o que a repriorização da review mudou no backlog (a nova ordem e os cancelados) e oferece finalizar no ELM a tarefa do item cancelado."}
---
## Entrada

A `## Review` do `sprint-<nn>.md` publicada e o `backlog.md` da branch base, já atualizado.

## Faça

1. Leia a linha `- Backlog: ordem <ids> · cancelada <id> (<motivo>) — por <usuario>` da `## Review`. Sem a linha, a
   repriorização não mudou nada: siga.
2. Mostre o que mudou: a nova ordem do trecho citado e cada item cancelado com o motivo. O `backlog.md` já foi gravado
   pelo Publicar da página, com as regras do quadro Kanban: a última fatia aberta cancelada fecha o épico, e a pasta
   da spec do item cancelado sai da branch base. Não regrave nada aqui.
3. Item cancelado com `ib` (tarefa no ELM) → ofereça a `sa-elm.finalizar` para cancelar a tarefa.
4. Sem a página, ou com a lista só leitura (quem apresentou não tem `produto`): a ordem e o cancelamento são da
   `sa-refinar.ajustar`, com quem tem `produto`. Diga isso e siga; não refaça a repriorização neste fluxo.

## Saída

O que mudou, na tela → passo `historico`.

## Pare se

Sem condição própria: a resposta sobre o ELM não trava.
