---
{"resumo": "Grava o relatório da rodada (revisao-prd, analise-plano ou revisao-codigo -<N>.md) no formato do padrão, com o fecho da rubrica na última linha."}
---
## Entrada

Os achados calibrados (passo `calibrar`) e a rodada `<N>` que quem chamou passou.

## Faça

No formato do fim do padrão `sa-revisar/rubricas.md`. A **última linha** é exatamente o fecho
da rubrica. Grave o relatório na pasta do artefato — `revisao-prd-<N>.md` (épico), `analise-plano-<N>.md` ou
`revisao-codigo-<N>.md` (fatia), `<N>` = a rodada que quem chamou passou (sem ela: 1 + o maior `<N>` já existente na pasta; HITL: a sua). É o **único** arquivo que você escreve.

Zero BLOQUEANTE e zero IMPORTANTE → aprovado. Sugestões nunca reprovam.

## Saída

O relatório gravado, com o veredito na última linha; como subagente, devolva-o a quem chamou. Aqui o fluxo termina.

## Pare se

—
