---
{"resumo": "Mostra o resumo do merge, pergunta 'Mergear?' e mergeia pelo gitlabpr, removendo a branch de origem."}
---
## Entrada

O MR aprovado com CI verde.

## Faça

1. Mostre `🔀 Merge FT-nnn — <título> · MR !<iid> · aprovado por <usuario> · CI verde` e pergunte "Mergear?" (o
   merge está em ask). Com auto-merge, se o time usa, não pergunte.
2. Sim → `gitlab_mesclar_mr` com `remover_origem`. Sem o MCP ou sem permissão, a pessoa faz o merge na UI, sem o
   botão Rebase, e diz "mergeado".

## Saída

Merge pedido → passo `conferir`.

## Pare se

- Sem o "sim" ao merge.
