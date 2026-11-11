---
{"resumo": "concluida e concluida_em no backlog e na linha da sprint; na última fatia aberta do épico fatiado, o épico concluido no mesmo commit."}
---
## Entrada

A data do merge e a linha do item no `backlog.md` da branch base.

## Faça

1. Pelo passo `gravar`, commit `<FT> concluir`: no `backlog.md`, status `concluida` e `concluida_em` = data do merge;
   na linha Item · `desenvolvimento` da sprint, `concluida_em` = a mesma data.
2. Fatia ou bug com `pai` `EP-nn`: se o épico está `fatiado` e não resta nenhuma outra fatia ou bug dele aberto
   (`nova`, `aceita`, `elegivel`, `em-andamento` ou `adiada até …`), grave também `concluido` e `concluida_em` na linha do épico, no
   mesmo commit.

## Saída

Concluída na branch base → passo `finalizar`.

## Pare se

- A gravação na branch base parou → mostre o que gravaria; o resto segue na próxima sessão pela entrada (item mergeado).
