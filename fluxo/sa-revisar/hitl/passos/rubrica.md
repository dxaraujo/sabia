---
{"resumo": "Rubrica C (fluxo revisar, passos escopo a relatorio) sobre o diff do PR, gravando revisao-codigo-<N>.md e o Drift de negócio no status.md."}
---
## Entrada

Na branch do PR, com a rodada `<N>` (passo `pr`).

## Faça

1. Rubrica **C** (fluxo `revisar`: passos `sa-revisar.revisar.escopo`, `sa-revisar.revisar.evidencia`,
   `sa-revisar.revisar.calibrar` e `sa-revisar.revisar.relatorio`) sobre `git diff origin/<base>...HEAD`, gravando `revisao-codigo-<N>.md`.
2. Grave o campo **Drift de negócio** do `status.md` com a penúltima linha do relatório (só sobe de `não` para
   `possível alteração`; outra possível alteração acrescenta o motivo e os artefatos; sobre um campo já decidido, com
   `especificação:`, o decidido vai ao Histórico e o campo recomeça com a possível alteração nova, padrão
   `sa-desenvolver/status.md`) — é a indicação do agente; a decisão é do passo `veredito`.

## Saída

`revisao-codigo-<N>.md` gravado e o Drift de negócio no `status.md` → passo `veredito`.

## Pare se

—
