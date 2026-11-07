---
{"resumo": "Curadoria: lista as Lições do ciclo (sa-status.licoes) e pergunta quais entram em Regras aprendidas do sabia.md."}
---
## Entrada

A sprint da review.

## Faça

1. Chame a `sa-status.licoes`: as Lições das fatias e da Sustentação concluídas no ciclo, já cruzadas com as Regras
   aprendidas do `.sabia/sabia.md`.
2. Mostre a lista e pergunte quais entram. A lição marcada "já está" não entra de novo.
3. Cada escolhida vira uma linha na seção Regras aprendidas do `.sabia/sabia.md`, pelo padrão `sa-planejamento/regras-aprendidas.md`: `- <regra> · origem <FT-nnn | AT-nnn…> · AAAA-MM-DD`. A pessoa pode reescrever a regra antes do "ok". Erro mecânico vira checagem (lint, teste, hook, CI), não regra.

## Saída

As regras escolhidas (ou nenhuma) → passo `gravar`.

## Pare se

Sem condição própria: nenhuma escolhida → segue.
