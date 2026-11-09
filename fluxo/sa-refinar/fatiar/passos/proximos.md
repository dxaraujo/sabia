---
{"resumo": "Mostra as fatias gravadas, na ordem do P.O., e oferece detalhar a primeira na mesma sessão."}
---
## Entrada

As fatias gravadas no passo `commit-na-branch-base`.

## Faça

Mostre as fatias (`FT-nnn · título · tamanho · depende de`), na ordem do P.O. Elas ainda passam pelo detalhar para
chegar a `pronta`. Ofereça "detalhar a primeira?" (`sa-refinar.detalhar`).

## Saída

"sim" → passa à `sa-refinar.detalhar`, com a primeira fatia. "não" → fim.

## Pare se

Nenhuma condição própria.
