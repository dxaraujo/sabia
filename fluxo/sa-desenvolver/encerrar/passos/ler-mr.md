---
{"resumo": "Lê o MR pelo gitlabpr: aberto, sem Draft e sem conflito."}
---
## Entrada

O link do MR no `status.md` (no trivial, a branch `<id>`).

## Faça

1. `gitlab_obter_mr` pelo link (no trivial, `gitlab_listar_mrs` pela branch). Sem o MCP, a pessoa confere na UI e
   diz o estado.
2. Precisa estar aberto, sem Draft e sem conflito.
3. Conflito → grave `conflito com a branch base` no Retomar do `status.md` e passe à `sa-desenvolver.codificar`
   (retrabalho).

## Saída

MR aberto e limpo → passo `aprovacao`.

## Pare se

- Fechado sem merge → avise e pare.
- Draft → "o autor ainda não pediu revisão" e pare.
