---
{"resumo": "Aceitas a detalhar, épicos a moldar, PRD a aprovar, PRD a fatiar e andamento dos épicos fatiados."}
---
## Entrada

O backlog, os `prd.md` e as fatias por `pai`.

## Faça

- Fatias e bugs `aceita` → `sa-refinar.detalhar`.
- Épico `a-moldar` → `sa-refinar.moldar`.
- Épico `em-especificacao` sem `prd.md` aprovado → `sa-prd.prd`; com `prd.md` aprovado e sem fatias →
  `sa-refinar.fatiar`.
- Épico `fatiado` → o andamento das fatias (`pai` = `EP-nn`).

## Saída

Refinamento e produto → passo `reserva-capacidade`.

## Pare se

Sem condição própria.
