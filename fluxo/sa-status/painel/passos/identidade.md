---
{"resumo": "Regra única de identidade: o usuário do GitLab da sessão no equipe.json; 'minhas' = responsável ou branch da pessoa."}
---
## Entrada

O `equipe.json`.

## Faça

A pessoa é o membro ativo do `equipe.json` cujo `usuario` é o usuário do GitLab da sessão (MCP `gitlabpr`). Sem o
MCP, a parte antes do `@` do `git config user.email`, ou o `git config user.name`. Sem correspondência, pergunte o
`usuario` uma vez. "Minhas" = Responsável no `backlog.md` ou na linha da sprint igual ao `usuario`, ou branch `<id>`
da pessoa. As outras skills citam esta regra.

## Saída

A pessoa e as booleanas dela → passo `sustentacao`.

## Pare se

Sem condição própria.
