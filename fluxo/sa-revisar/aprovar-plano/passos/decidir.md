---
{"resumo": "Aprovado → fase implementando e 'plano aprovado por <login>'; ajuste → o pedido em Achados abertos (origem GATE do plano), 'ajuste do plano pedido por <login>' e fase planejando."}
---
## Entrada

A decisão da pessoa (passo `ler`).

## Faça

- **Aprovado** → `fase: implementando`, Histórico `plano aprovado por <login>`, `Responsável` volta a quem
  implementa.
- **Ajuste pedido** → cada pedido uma linha em Achados abertos (origem `GATE do plano`, Situação `aberto`), Histórico
  `ajuste do plano pedido por <login>`, `fase: planejando`, `Responsável` volta a quem implementa; a `[APR]` fica em
  andamento e é a mesma na nova aprovação.

## Saída

O `status.md` com a fase e o Histórico da decisão → passo `entrega`.

## Pare se

—
