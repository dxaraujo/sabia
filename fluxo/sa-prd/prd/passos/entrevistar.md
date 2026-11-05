---
{"resumo": "Roda a sa-entrevistar sobre a demanda, gravando no decisoes.md da pasta de trabalho, até a árvore de decisões fechar ou a pessoa dizer chega; transcrição nova sem ATA passa antes pela ata da reunião."}
---
## Entrada

A demanda entendida e as fontes do passo `entender`; a pasta de trabalho.

## Faça

Rode a **`sa-entrevistar`** sobre a demanda, gravando em `decisoes.md` da pasta de trabalho. Ela termina quando a
árvore de decisões está fechada ou a pessoa diz "chega".

Transcrição nova em `reunioes/` sem ATA aprovada (a pessoa trouxe a de uma reunião no meio da sessão) → chame o
`sa-especificar.reuniao` e volte: os `D-nn` da ATA entram na árvore.

## Saída

`decisoes.md` gravado → passo `similares`.

## Pare se

Nenhuma condição própria deste passo: valem as da `sa-entrevistar`.

Ao parar aqui (na sessão da `[ESP]`, feche-a: `sa-especificar.especificar.fechar-sessao`).
