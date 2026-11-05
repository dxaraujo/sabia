---
{"resumo": "Atualiza design.md/tasks.md só no que mudou, acrescenta tarefas sem desmarcar as feitas, registra o motivo e repete a análise e o GATE para a parte alterada."}
---
## Entrada

Implementação descobriu que o plano não serve (esperado × encontrado).

## Faça

`fase: planejando` (até o GATE). Atualize `design.md`/`tasks.md` só no que
mudou, acrescente tarefas (nunca desmarque as feitas), registre o motivo no Histórico.

## Saída

Repita os passos `sa-plano.plano.analise` e `sa-plano.plano.gate` para
a parte alterada (com GATE e a `[APR]` já concluída → o aprovador a reabre pela `sa-revisar`, no passo `sa-revisar.aprovar-plano.assumir`, com retrabalho).

## Pare se

Lacuna de negócio na parte alterada → como no passo `sa-plano.plano.decisoes`: é do P.O.; pare.
