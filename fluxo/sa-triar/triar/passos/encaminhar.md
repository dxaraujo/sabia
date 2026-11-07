---
{"resumo": "Mostra a linha gravada e o próximo passo do item, só como sugestão de sessão nova, e pergunta se há mais item para triar."}
---
## Entrada

A linha gravada no passo `gravar-na-base`, ou o id existente do passo `duplicado`.

## Faça

Mostre a linha (`<id> · <título> · <tipo> · <status>`) e o próximo passo, como sugestão de sessão nova (é outra
tarefa):

| Item | Próximo |
|---|---|
| fatia ou bug `aceita` | `sa-refinar.detalhar` |
| épico `a-moldar` | `sa-refinar.moldar` |
| sustentação `nova` | `sa-atender.atender` |
| prioridade `crítica` | avise que é expedite e diga quem puxa pela política do `acordos.md` |
| falta, adiada ou cancelada | nada a seguir |

Pergunte "mais algum item para triar?".

## Saída

"sim" → passo `ler`, na mesma sessão (na fila, o próximo da ordem). "não" → fim (a gravação já voltou à branch
anterior).

## Pare se

Não invoque a skill sugerida: é sugestão de sessão nova.
