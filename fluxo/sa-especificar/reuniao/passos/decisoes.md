---
{"resumo": "Copia cada decisão da ATA para a tabela Decisões do documento do item, com Fonte ATA-nn [mm:ss], e o que ficou sem decisão para o Em aberto."}
---
## Entrada

A ATA aprovada e o documento do item: `pitch.md` antes do go, `prd.md` depois, ou a ficha.

## Faça

1. **Decisões.** Cada decisão vira uma linha `D-nn | Decisão | Por quê | Quem | Quando | Fonte` na tabela Decisões do documento,
   com o mesmo D-nn da ATA e Fonte `ATA-<nn> [mm:ss]`.
2. **Em aberto.** O que ficou sem decisão vai ao Em aberto do documento (`Pergunta | Para quem | Bloqueia`).
3. **Gravar.** Um commit leva a ATA e o documento: o do passo `gravar` (`<id> registrar ATA-<nn>`).

## Saída

As decisões no documento → passo `gravar`.

## Pare se

Nenhum caso próprio deste passo.
