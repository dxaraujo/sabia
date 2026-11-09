---
{"resumo": "Oferece cancelar o IB do épico cancelado, pergunta se há mais ajuste e, no fim, mostra as linhas mudadas e o próximo passo de cada uma."}
---
## Entrada

O ajuste gravado no passo `commit-na-branch-base`, ou a parada sem gravar.

## Faça

1. Épico cancelado com `ib` → ofereça cancelar o IB pela `sa-elm.finalizar`. A resposta não muda o fluxo.
2. Pergunte "mais algum ajuste?".
3. No fim, mostre as linhas mudadas e o próximo passo de cada uma: fatia nova ou editada → `sa-refinar.detalhar`.

## Saída

"sim" → passo `previa`. "não" → fim.

## Pare se

Nenhuma condição própria.
