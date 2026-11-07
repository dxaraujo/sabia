---
{"resumo": "Oferece o próximo pelo que a ATA decidiu (mudança do PRD, texto do elm/ ou outra transcrição) e devolve a quem chamou."}
---
## Entrada

As decisões gravadas (ou o rascunho sem aprovação).

## Faça

- Decisão que muda um `prd.md` aprovado → ofereça a `sa-prd.mudanca`.
- Decisão que muda o texto do `elm/` de uma fatia → ofereça a `sa-especificar.elm`.
- Outra transcrição sem ATA em `.sabia/local/reunioes/` → passo `transcricao`.
- Senão, devolva a quem chamou com as decisões gravadas; no pedido direto, termine com o resumo (ATA, decisões, em
  aberto).

## Saída

A oferta aceita, a próxima transcrição ou o resumo.

## Pare se

Nenhum caso próprio deste passo.
