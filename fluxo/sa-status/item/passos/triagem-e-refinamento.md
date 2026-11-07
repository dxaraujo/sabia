---
{"resumo": "Fatia ou bug nova, adiada ou aceita → triagem, desenvolvimento antecipado ou refinamento."}
---
## Entrada

O estado.

## Faça

Fatia ou bug:
- `nova` → `sa-triar.triar`;
- `adiada até <data>` → depois da data, `sa-triar.triar`; puxar antes da data → `sa-desenvolver.iniciar` (a entrada
  comum avisa e registra);
- `aceita` → `sa-refinar.detalhar`, que aguarda se a trava de artefato prende o item.

## Saída

Casou → passo `mostrar-e-seguir`. Não casou → passo `desenvolvimento`.

## Pare se

Sem condição própria.
