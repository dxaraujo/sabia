---
{"resumo": "Épico a moldar, em especificação (com ou sem PRD aprovado) ou fatiado."}
---
## Entrada

O estado.

## Faça

- `a-moldar` → `sa-refinar.moldar`.
- `em-especificacao` sem `prd.md` aprovado → `sa-prd.prd`; com `prd.md` aprovado → `sa-refinar.fatiar`.
- `fatiado` → liste as fatias (`pai` = `EP-nn`) com o próximo passo de cada uma; ajuste de fatias ou do épico →
  `sa-refinar.ajustar`.

## Saída

Casou → passo `mostrar-e-seguir`. Não casou → passo `sustentacao`.

## Pare se

Sem condição própria.
