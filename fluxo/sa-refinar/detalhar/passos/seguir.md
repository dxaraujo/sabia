---
{"resumo": "Diz se a fatia está pronta para puxar ou o que falta na DoR e oferece refinar o próximo item aceita."}
---
## Entrada

A ficha e a linha gravadas no passo `commit-na-branch-base`, ou o épico nascido no vira épico.

## Faça

- `pronta` → "pronta para puxar: `sa-desenvolver.iniciar` FT-nnn" (é outra tarefa: sugira sessão nova).
- `aceita` → liste o que falta na DoR.
- Virou épico → ofereça seguir na `sa-refinar.moldar` com o `EP-nn`.

Depois ofereça "refinar o próximo?": a próxima fatia ou bug `aceita` na ordem do `backlog.md`.

## Saída

Virou épico com o "sim" → passa à `sa-refinar.moldar`. Refinar o próximo → passo `entrada`, com o próximo item.
"não" → fim.

## Pare se

Não invoque a `sa-desenvolver.iniciar`: é sugestão de sessão nova.
