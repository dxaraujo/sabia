---
{"resumo": "Mostra o que o ajuste muda (linhas, fichas, pastas de spec) e só segue com o ok do P.O.; na mudança do PRD, propõe o ajuste de cada fatia atingida."}
---
## Entrada

O pedido de ajuste e os itens; na mudança do PRD, as fatias com Cobre atingido que a `sa-prd.mudanca` passou.

## Faça

1. Mostre o que muda: as linhas do `backlog.md`, as fichas e as pastas de spec (com `elm/`), antes e depois.
2. Mudança do PRD: liste as fatias com Cobre atingido e proponha o ajuste de cada uma (editar, dividir ou cancelar).
3. Peça o ok de quem tem `produto`. Ajuste diferente do mostrado → mostre a prévia de novo.

## Saída

Com o ok, o passo do ajuste: ordenar → passo `ordenar`; dividir → passo `dividir`; juntar → passo `juntar`; editar
→ passo `editar`; cancelar a fatia ou o bug → passo `cancelar-fatia`; cancelar o épico → passo `cancelar-epico`. Sem
o ok → passo `seguir`, sem gravar.

## Pare se

Nenhuma condição própria: a entrada já conferiu a booleana `produto`.
