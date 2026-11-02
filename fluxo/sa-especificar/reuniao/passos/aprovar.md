---
{"resumo": "Mostra a ATA à pessoa; com o \"sim\", grava status stable e o verified humano, sem esperar o GATE do PRD; ajuste volta à escrita."}
---
## Entrada

A ATA `draft` em `elm/` (passo `escrever`, ou uma `draft` de outra sessão achada pelo passo `transcricao`).

## Faça

Antes, confira cada `D-nn` da ATA no `decisoes.md`: tem de estar reservado para ela (`em aberto — ATA-<nn> draft`).
Número tomado por outra decisão → renumere na ATA para o próximo livre, reserve-o, `generated.at` novo. Depois de
aprovada, a ATA não muda mais. Mostre a ATA inteira e pergunte:

```
📝 ATA-<nn> — <AAAA-MM-DD> <assunto> · EP-<nn> · [ESP] <id>
Participantes: <n> · Decisões: D-<nn>…D-<nn> · Em aberto: <n>
Aprovar? (sim | ajuste: <o quê>)
```

Com "sim": na ATA, `status: stable` e um `verified` com `{ by: human:<login de quem disse o sim>, at: <agora> }`.
Ajuste → passo `escrever`, com o que a pessoa pediu.

## Saída

A ATA `stable` e verificada → passo `publicar`. Sem o "sim", a ATA fica `draft` e o próximo encaminhar a traz de
volta a este passo.

## Pare se

- Sem o "sim" → a ATA fica `draft`, com os `D-nn` reservados; volte a quem chamou.
