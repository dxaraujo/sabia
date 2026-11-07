---
{"resumo": "Lê o MR (O quê · Porquê · Prova · Risco · Foco · Cobre, conflitos e threads abertas), o CI do último commit e faz git fetch da branch, sem checkout nem commit."}
---
## Entrada

O MR aberto da branch `<id>` e a pessoa que pode revisar (passo `revisor`).

## Faça

1. Leia o MR pelo `gitlabpr` (`gitlab_obter_mr`): O quê · Porquê · Prova (CI e o bloco 🔎) · Risco · Foco · Cobre,
   os conflitos e as threads abertas. Sem o MCP, a pessoa informa o estado do MR.
2. CI do último commit pelo MCP do Jenkins; sem ele, o estado do pipeline mostrado no MR.
3. `git fetch origin <id>`, sem checkout e sem commit.
4. Já são achados: Prova sem o bloco 🔎 da autoverificação, CI vermelho e conflito com a base.
5. MR em Draft: avise que o autor ainda não pediu revisão e só siga com o "sim".

## Saída

O MR lido e os primeiros achados → passo `rubrica`.

## Pare se

- MR em Draft sem o "sim" → pare.
