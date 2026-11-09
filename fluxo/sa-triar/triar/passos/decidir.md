---
{"resumo": "Decide o destino do item: cancelada (duplicado ou recusa), nova com falta, adiada até a data ou aceita; todo ramo grava."}
---
## Entrada

O item do passo `duplicado`, já marcado como duplicado quando for.

## Faça

Proponha o destino e o motivo numa linha; a decisão é da pessoa.

| Destino | Status | `obs` |
|---|---|---|
| duplicado | `cancelada` | `duplicada de <id>` |
| recusa | `cancelada` | `motivo: <texto>` |
| falta informação | fica `nova` | `falta: <pergunta> · para <quem responde>`; volta à fila quando essa pessoa responde |
| agora não | fatia ou bug: `adiada até <AAAA-MM-DD>`; épico: fica `a-moldar`, no fim da ordem; sustentação: fica `nova` (não tem adiada) | `motivo: <texto>` |
| aceito | definido no passo `classificar` | — |

Na retriagem de um item adiado, a pessoa decide de novo: aceito segue para classificar; agora não grava a data
nova.

## Saída

Aceito → passo `classificar`. Duplicado, recusa, falta informação ou agora não → passo `registrar`.

## Pare se

Nenhuma condição própria: todo ramo grava.
