---
{"resumo": "Fatia ou bug nova ou aceita → triagem ou refinamento."}
---
## Entrada

O estado.

## Faça

Fatia ou bug:
- `nova` → `sa-triar.triar`;
- `aceita` → `sa-refinar.detalhar`, que aguarda se a trava de artefato prende o item.

## Saída

Casou → passo `mostrar-e-seguir`. Não casou → passo `desenvolvimento`.

## Pare se

Sem condição própria.
