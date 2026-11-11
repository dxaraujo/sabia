---
{"resumo": "Confere 1 aprovação vigente de um desenvolvedor ≠ autor e a validação verde no último commit (o pipeline, se o projeto declara CI; senão, a suíte local)."}
---
## Entrada

O MR lido e o `equipe.json`.

## Faça

1. Uma aprovação vigente (no último commit) de alguém com `desenvolvedor` no `equipe.json` e `usuario` ≠ autor do
   MR.
2. Validação verde no último commit da branch: com CI declarado no `.sabia/sabia.md`, o pipeline, lido pelo MCP do
   CI; sem CI, a suíte completa verde na Evidência do MR (a saída do validar).
3. Falta algo → diga o que falta (quem pode aprovar: o dono no `CODEOWNERS` e os desenvolvedores do `equipe.json`).

## Saída

Aprovado e verde → passo `merge`.

## Pare se

- Falta a aprovação ou o CI verde.
