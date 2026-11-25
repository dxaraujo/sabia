---
{"resumo": "Curadoria: as Lições aprendidas do ciclo que o time marcou na retrospectiva viram Regras aprendidas do sabia.md."}
---
## Entrada

A `## Retro` do `sprint-<nn>.md`, com as linhas `- Lição:` que o time marcou.

## Faça

1. As lições a considerar são as linhas `- Lição: <lição> · origem <id> · <n> votos (<quem>, …)` da `## Retro`: na página
   `sabia retrospective`, o bloco Lições aprendidas lista as lições dos itens concluídos no ciclo (do `status.md` da
   fatia ou do registro de Sustentação), o time marca as que devem ser consideradas, e só as marcadas vão para o
   `sprint-<nn>.md`. A lição levantada na hora entra do mesmo jeito, com `por <quem>` no lugar da origem.
2. Sem a página (ou para conferir o que ela não lê, como a lição do MR na trilha trivial): chame a
   `sa-status.licoes-aprendidas`, mostre a lista e pergunte quais o time considera; grave as escolhidas como linhas
   `- Lição:` no mesmo formato.
3. Para cada lição marcada, pela ordem dos votos, proponha a regra: a "já está" nas Regras aprendidas do `.sabia/sabia.md`
   não entra de novo. Cada uma vira uma linha na seção Regras aprendidas do `.sabia/sabia.md`, pelo template
   `sa-planejamento/regras-aprendidas.md`: `- <regra> · origem <FT-nnn | AT-nnn…> · AAAA-MM-DD`. A pessoa pode reescrever
   a regra antes do "ok". Erro mecânico vira checagem (lint, teste, hook, CI), não regra.

## Saída

As regras escolhidas (ou nenhuma) → passo `fechar`.

## Pare se

Sem condição própria: nenhuma lição marcada → segue.
