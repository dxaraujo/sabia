---
{"resumo": "Oferece o glossario.md (só sem GL do DOORS) e diz que os ADRs em docs/adr/ são opcionais."}
---
## Entrada

O resultado do passo `elm`.

## Faça

1. Sem GL do DOORS (sem ELM, ou a `sa-elm.setup` avisou que não usa GL) → ofereça o `.sabia/glossario.md` (chave
   `glossario` do `agentes.json`), criado só se a pessoa pedir, com as colunas Termo · Definição · Evitar (o template
   `sa-entrevistar/glossario.md`). Recusou → `glossario: null`.
2. ADRs em `docs/adr/` (chave `adr`) são opcionais e servem só para decisão que atravessa fatias. Recusou →
   `adr: null`.

## Saída

→ passo `especificacao`.

## Pare se

- Com GL no DOORS: não ofereça o `glossario.md`.
