---
{"resumo": "Cancela o épico e as fatias abertas dele, tirando as pastas de spec; com fatia em andamento, para."}
---
## Entrada

O épico e o motivo aprovados no passo `previa`.

## Faça

1. Alguma fatia do épico `em-andamento` → diga "conclua ou cancele antes FT-…" e não grave.
2. Senão: épico `cancelado`, coluna `motivo` `<texto> · desde <hoje>`. As fatias abertas ficam `cancelada`, `motivo`
   `épico cancelado · desde <hoje>`, e as pastas de spec delas saem (`git rm`). A pasta do épico fica.
3. Linha com `ib`: a oferta de cancelar o IB vem depois da gravação, no passo `seguir`.

## Saída

Fatia `em-andamento` → passo `seguir`, sem gravar. O cancelamento → passo `gravar`.

## Pare se

Nenhuma condição própria além da fatia em andamento (acima).
