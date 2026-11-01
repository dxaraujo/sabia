---
{"resumo": "Aprovado → fase implementando e 'plano aprovado por <login>'; ajuste → o pedido no Histórico e em Achados abertos e fase planejando."}
---
## Entrada

A decisão da pessoa (passo `ler`).

## Faça

- **Aprovado** → `fase: implementando`, Histórico `plano aprovado por <login>`, `Responsável` volta a quem
  implementa.
- **Ajuste pedido** → o pedido no Histórico e em Achados abertos (origem: GATE do plano),
  `fase: planejando`; a `[APR]` fica em andamento e é a mesma na nova aprovação.

## Saída

O `status.md` com a fase e o Histórico da decisão → passo `entrega`.

## Pare se

—
