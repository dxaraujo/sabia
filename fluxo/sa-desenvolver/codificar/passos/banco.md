---
{"resumo": "Banco só em leitura; DDL necessária vira item BD pela captura e bloqueia só as tarefas que dependem dela."}
---
## Entrada

A tarefa que precisa de DDL (tabela, coluna, índice, carga).

## Faça

1. O banco é só leitura, pelo MCP de consulta. A DDL nunca é aplicada pela fatia.
2. Pelo passo `captura`: tipo sustentação, série `BD-nnn`, título com a DDL e `obs` `origem FT-nnn` (no autopilot,
   vai ao Em aberto `capturar: …`).
3. Em aberto do `status.md`: `BD-nnn` com `Bloqueia: tarefa N.M` só nas tarefas que dependem da DDL. O Risco do MR
   leva `DDL: BD-nnn`.

## Saída

Item BD capturado → a próxima tarefa que não depende da DDL.

## Pare se

- Só restam tarefas que dependem da DDL → grave o Retomar e pare.
