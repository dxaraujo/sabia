---
{"resumo": "Acha o item pelo id, pelo ib ou pela tarefa do EWM; texto sem id vai à triagem."}
---
## Entrada

O que a pessoa disse e a coleta.

## Faça

Procure, nesta ordem:
1. o id no `backlog.md` da branch base;
2. o número na coluna `ib`;
3. a tarefa (`DEV 123`, `ESP 456`, `ATD 789` ou só o número) na coluna Tarefas dos `sprint-<nn>.md`.

Texto sem id → pedido não registrado → `sa-triar.triar` (ou `sa-triar.capturar`, para só registrar). Id que não
está em lugar nenhum → diga que não está registrado e ofereça as mesmas duas. Nunca invente dado de item.

## Saída

Achou → passo `estado`. Número do EWM que não está no Sabiá → passo `fora-do-sabia`.

## Pare se

Texto sem id ou id não registrado → a oferta e pare.
