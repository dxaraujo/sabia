---
{"resumo": "Decide o destino do item: cancelada (duplicado ou recusa), nova com falta, impedida até a data ou aceita; todo ramo grava."}
---
## Entrada

O item do passo `duplicado`, já marcado como duplicado quando for.

## Faça

Proponha o destino e o motivo numa linha; a decisão é da pessoa.

| Destino | Status | Onde fica o motivo |
|---|---|---|
| duplicado | `cancelada` | `motivo`: `duplicada de <id> · desde <hoje>` |
| recusa | `cancelada` | `motivo`: `<texto> · desde <hoje>` |
| falta informação | fica `nova` | `obs`: `falta: <pergunta> · para <quem responde>`; volta à fila quando essa pessoa responde |
| agora não | `impedida` (épico: `impedido`), todo tipo | `motivo`: `<texto> · desde <hoje> · até <AAAA-MM-DD> · de <status de agora>` |
| aceito | definido no passo `classificar` | — |

O "agora não" é um impedimento com data: vencida a data, a entrada comum libera o item, que volta ao status
anterior e à fila.

## Saída

Aceito → passo `classificar`. Duplicado, recusa, falta informação ou agora não → passo `registrar`.

## Pare se

Nenhuma condição própria: todo ramo grava.
