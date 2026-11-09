---
{"resumo": "Resumo 🧭 do plano e a aprovação de quem desenvolve (no autopilot, o subagente aprova e registra); Fase implementando."}
---
## Entrada

O plano escrito e revisado.

## Faça

1. **Confira a pasta:** os arquivos da matriz do template `sa-plano/spec.md` para a trilha, o tipo (fatia ou bug) e o formato,
   e o `research.md`. Faltando um deles, ou com arquivo fora da matriz (como um `plano.md`) → volta ao passo `escrever`.
2. Fora do autopilot, mostre o resumo `🧭 FT-nnn — <trilha> · <arquivos> · <n> tarefas · decisões · Em aberto` e
   quem desenvolve aprova (ou pede ajuste). A aprovação é uma pergunta própria, sem juntar com a revisão ou com o seguir.
3. No autopilot, o subagente aprova e registra `plano aprovado no autopilot` no Retomar; a pessoa vê o plano no MR.
4. No `status.md`: Fase `implementando` e o Retomar `Próximo: sa-desenvolver.codificar`.
5. Commit dos arquivos do plano na branch e push (com o "sim"; liberado no autopilot).

## Saída

Plano aprovado → passo `seguir`.

## Pare se

- Quem desenvolve pede ajuste (volta ao passo `escrever`).
