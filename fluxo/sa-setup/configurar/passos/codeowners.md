---
{"resumo": "Sugere um CODEOWNERS, sem gravar; sem ele, o revisor é qualquer desenvolvedor que não é o autor."}
---
## Entrada

As pastas do projeto.

## Faça

Sem `CODEOWNERS` (raiz, `.gitlab/` ou `docs/`) → sugira um, com as pastas do projeto e o `@usuario` do
`equipe.json` (quando existir), mas não grave: o time grava. Sem `CODEOWNERS`, o revisor é qualquer desenvolvedor
diferente do autor.

## Saída

→ passo `gitignore`.

## Pare se

- Nunca grave o `CODEOWNERS`.
