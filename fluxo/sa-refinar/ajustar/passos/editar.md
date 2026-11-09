---
{"resumo": "Muda a ficha ou o tamanho; a mudança tira o Aprovado e refaz a DoR; cenário novo em fatia já entregue vira item novo pelo cadastro."}
---
## Entrada

A fatia ou o bug e a mudança aprovados no passo `previa`.

## Faça

1. Mude a ficha (regras, cenários, artefatos afetados) ou o tamanho.
2. A mudança tira o Aprovado (`**Aprovado:** —`) até o P.O. aprovar de novo, e a DoR é refeita: o item que perde um
   ponto volta de `elegivel` para `aceita`.
3. Cenário novo em fatia não puxada: entra nela ou numa fatia nova do épico (pelo passo `cadastro`, `veio de EP-nn`).
   Cenário novo em fatia já entregue: vira item novo pelo passo `cadastro`, com `origem FT-nnn`.

## Saída

Cenário novo que vira item → passo `cadastro`. Os demais → passo `gravar`.

## Pare se

Nenhuma condição própria.
