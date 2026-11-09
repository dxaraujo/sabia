---
{"resumo": "Confere o estado merged no GitLab (sem o MCP: git fetch e diff vazio com a branch base)."}
---
## Entrada

O MR depois do merge (deste fluxo ou feito por fora).

## Faça

1. Estado `merged` pelo `gitlab_obter_mr`. Sem o MCP: `git fetch` e diff vazio entre `origin/<branch_base>` e a branch nos
   arquivos da fatia.
2. Guarde a data do merge (vira `concluida_em`).

## Saída

Mergeado → passo `concluir`.

## Pare se

- Não mergeado → mostre o estado e pare.
