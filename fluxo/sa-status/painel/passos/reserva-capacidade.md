---
{"resumo": "Linhas de atendimento contra a reserva de capacidade da sprint."}
---
## Entrada

A sprint aberta.

## Faça

Conte as linhas de atendimento da sprint aberta contra o `**Reserva de capacidade:** <n> itens` do cabeçalho. Estourou → "reserva de capacidade
estourada: quem tem `produto` decide o que entra" (a `sa-atender.atender` segue puxando o crítico).

## Saída

A reserva de capacidade → passo `fim-do-ciclo`.

## Pare se

Sem condição própria.
