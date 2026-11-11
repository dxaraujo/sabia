---
{"resumo": "Item concluído ou cancelado: mostra e para; virou épico aponta o novo; publicação pendente vai ao especificador."}
---
## Entrada

O estado.

## Faça

`concluida`, `concluido`, `cancelada` ou `cancelado` → mostre o status e a `obs`. `cancelada · virou EP-nn` →
aponte o `EP-nn`. Concluída com `Publicação: pendente` → quem tem `especificador` (`sa-elm.publicar`).

## Saída

Terminal → o fluxo termina. Senão → passo `impedida`.

## Pare se

Terminal → mostre e pare.
