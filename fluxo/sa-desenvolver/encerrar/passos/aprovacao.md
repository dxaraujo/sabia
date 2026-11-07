---
{"resumo": "Confere 1 aprovação vigente de um desenvolvedor ≠ autor e o pipeline verde no último commit."}
---
## Entrada

O MR lido e o `equipe.json`.

## Faça

1. Uma aprovação vigente (no último commit) de alguém com `desenvolvedor` no `equipe.json` e `usuario` ≠ autor do
   MR.
2. Pipeline verde no último commit da branch. Sem o MCP do Jenkins, vale o estado mostrado no MR ou a pessoa
   confere.
3. Falta algo → diga o que falta (quem pode aprovar: o dono no `CODEOWNERS` e os desenvolvedores do `equipe.json`).

## Saída

Aprovado e verde → passo `merge`.

## Pare se

- Falta a aprovação ou o CI verde.
