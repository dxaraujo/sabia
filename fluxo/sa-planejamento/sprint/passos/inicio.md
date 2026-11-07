---
{"resumo": "Acha a sprint aberta e decide: início do ciclo (com virada) ou reabastecimento."}
---
## Entrada

Pedido direto ("planejar a sprint", "reabastecer a sprint", "virada de sprint") ou o seguir da
`sa-planejamento.inicial` ou da `sa-planejamento.retrospectiva`.

## Faça

1. Sem `equipe.json` ou `acordos.md` em `.sabia/planejamento/` → ofereça a `sa-planejamento.inicial`.
2. A sprint aberta é o `.sabia/planejamento/sprints/<AAAA>/sprint-<nn>.md` de maior chave. Nenhum, ou o de maior
   chave já passou da data de fim → **início do ciclo**. Dentro das datas → **reabastecimento**: pula a virada, só
   acrescenta linhas e não muda a meta.
3. Qualquer pessoa conduz; a ordem, a meta e o "ok" são de quem tem `produto` no `equipe.json`. Sem a booleana, o
   fluxo segue até a proposta, diz quem aprova e não grava.

## Saída

Início do ciclo → passo `virada`. Reabastecimento → passo `capacidade`. Sem `equipe.json` ou `acordos.md` → passa a
`sa-planejamento.inicial`.

## Pare se

Sem o sim à `sa-planejamento.inicial`, faltando o `equipe.json` ou o `acordos.md` → pare.
