---
{"resumo": "Transforma cada exemplo aceito num cenário CT-nn, Dado · Quando · Então, com o Então verificável."}
---
## Entrada

Os exemplos aceitos no passo `regras`; na fatia de épico, os cenários do PRD que o Cobre dela toca.

## Faça

1. Cada exemplo aceito vira um cenário `**CT-nn · <título>**`, numerado na ficha (`CT-01`, `CT-02`…; fora da ficha,
   `FT-nnn CT-nn`), no formato Dado · Quando · Então, com o Então verificável e com valores.
2. O `CT-nn` é o id que o teste automatizado marca e que o `CT.csv` liga (`sa-verificar`). Não renumere um `CT-nn`
   que já existe: cenário novo continua a série.
3. Na fatia de épico, os cenários partem dos cenários do PRD que o Cobre dela toca. Do UC, o fluxo básico e cada FA
   e FE que a fatia leva viram um cenário.

## Saída

A seção Cenários → passo `cobre`.

## Pare se

Nenhuma condição própria: exemplo sem Então verificável volta como pergunta ao passo `duvidas`.
