---
{"resumo": "Revisão independente dos artefatos da fatia pelo sa-revisor (rubrica P sobre os conceitos e a seção da ficha); na 2ª reprovação seguida, a pessoa decide achado a achado; decisão de negócio volta ao trabalho."}
---
## Entrada

Os conceitos da pasta de trabalho escritos (passo `escrever`).

## Faça

Peça ao agente **`sa-revisor`** a revisão (rubrica **P** do padrão `sa-revisar/rubricas.md`; relatório
`revisao-esp-<N>.md` na pasta de trabalho, passo `sa-revisar.revisar.relatorio`) sobre os conceitos da
pasta de trabalho e a seção Artefatos afetados da ficha: P1, P10 e P13 não se aplicam; P6 lê a seção (a ação e o
impacto de cada linha). Corrija os achados e peça a rodada seguinte; o que for decisão de negócio volta ao
trabalho. Na 2ª reprovação seguida (`RESULTADO: AJUSTAR`), não corrija: passe à pessoa, que decide achado a achado
— o aceito vai à aprovação (`achados aceitos`), o de negócio volta ao trabalho.

## Saída

Revisão OK (ou achados aceitos) → passo `aprovacao`. Achado que é decisão de negócio → passo `trabalho`.

## Pare se

Nenhuma condição própria deste passo.
