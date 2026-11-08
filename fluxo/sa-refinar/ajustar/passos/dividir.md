---
{"resumo": "Divide a fatia: a original fica com a primeira parte e o mesmo id; cada outra parte nasce aceita pela captura, com ficha, artefatos afetados e cenários próprios."}
---
## Entrada

A fatia ou o bug e o corte aprovados no passo `previa` (inclusive a fatia sem pai que veio do detalhar).

## Faça

1. A original fica com a primeira parte, e o id dela não muda: a ficha perde as regras, os cenários e os artefatos afetados que
   saem.
2. Cada outra parte nasce pelo passo `captura`, já `aceita` (com `aceita_em` e o tamanho), com o mesmo tipo e pai,
   `veio de FT-nnn` na `obs`, a linha logo abaixo da original e ficha própria com o seus artefatos afetados e cenários.
3. O arquivo de `elm/` do requisito que muda de fatia vai junto: `git mv` para a pasta da spec da nova.
4. As fichas mexidas voltam para `**Aprovado:** —`, e a DoR de cada uma é refeita (a `pronta` que perde um ponto volta
   a `aceita`).

## Saída

As partes novas → passo `captura`.

## Pare se

Nenhuma condição própria.
