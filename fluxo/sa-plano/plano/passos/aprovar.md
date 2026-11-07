---
{"resumo": "Resumo 🧭 do plano e a aprovação de quem desenvolve (no autopilot, o subagente aprova e registra); Fase implementando."}
---
## Entrada

O plano escrito e revisado.

## Faça

1. Fora do autopilot, mostre o resumo `🧭 FT-nnn — <rota> · <arquivos> · <n> tarefas · decisões · Em aberto` e
   quem desenvolve aprova (ou pede ajuste).
2. No autopilot, o subagente aprova e registra `plano aprovado no autopilot` no Retomar; a pessoa vê o plano no MR.
3. No `status.md`: Fase `implementando` e o Retomar `Próximo: sa-desenvolver.codificar`.
4. Commit dos arquivos do plano na branch e push (com o "sim"; liberado no autopilot).

## Saída

Plano aprovado → passo `seguir`.

## Pare se

- Quem desenvolve pede ajuste (volta ao passo `escrever`).
