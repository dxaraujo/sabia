---
{"resumo": "Mostra o item cadastrado, oferece triar agora a fatia ou o bug e pergunta se há mais item para registrar."}
---
## Entrada

O item gravado nos passos `cadastrar` e `commit-na-branch-base`.

## Faça

Mostre "cadastrado `<id>` · `<tipo>` · `<status>`". Fatia ou bug `nova` → ofereça "triar agora?" (`sa-triar.triar`,
na mesma sessão). Sustentação: já está na fila da `sa-atender.atender`. Épico: a fila é da `sa-refinar.moldar`.
Sem triar agora, pergunte "mais algum item para registrar?".

## Saída

Triar agora → passa à `sa-triar.triar`. Mais um item → passo `cadastrar`. "não" → fim.

## Pare se

Nenhuma condição própria.
