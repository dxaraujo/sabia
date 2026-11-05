---
{"resumo": "Sprint aberta fora da virada → manda para a virada e para; Dev ativo sem senioridade → pergunta e grava; nenhum Dev Sênior ativo → avisa antes de planejar."}
---
## Entrada

O `equipe.json` e o `**Situação:**` das sprints em `sprints/`.

## Faça

**Senioridade:** Dev ativo sem `senioridade` no `equipe.json` → pergunte só isso,
para cada um, e grave antes de seguir. Nenhum **Dev Sênior** ativo → avise antes de planejar: nenhum PR teria quem
o revise (a `[REV]` é sempre de um Dev Sênior); o time decide se alguém passa a Sênior ou se a sprint segue assim,
com as fatias HITL paradas em `pr-aberto`.

## Saída

Todo Dev ativo com senioridade → passo `capacidade`.

## Pare se

Pedido direto (não é o replanejamento do passo `sa-planejamento.retrospectiva.recalcular`) com uma sprint
`**Situação:** aberta` → "a próxima sprint é planejada na virada: fluxo `sa-planejamento.retrospectiva`" e pare. A
falta de Dev Sênior é aviso, e o time decide.
