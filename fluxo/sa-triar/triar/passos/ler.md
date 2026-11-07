---
{"resumo": "Lê a entrada: o pedido em texto, o WI do EWM (oferecido pela sa-elm), a linha e o corpo do backlog.md ou a fila de itens nova."}
---
## Entrada

O que a pessoa trouxe (pedido em texto, número do EWM, id do `backlog.md` ou nada) e o `backlog.md` da base, lido
pela entrada comum. Na volta do passo `encaminhar`, o próximo item.

## Faça

| Entrada | Como ler |
|---|---|
| pedido em texto | o próprio pedido |
| número do EWM | ofereça ler o WI pela `sa-elm.item` (ler WI). Sem ELM ou sem o "sim": peça à pessoa o título, a descrição e o comportamento esperado. Defeito → bug; Item de Backlog → fatia; o número vai na coluna `ib` |
| id do `backlog.md` | a linha e o corpo: a ficha `.sabia/planejamento/fatias/FT-nnn-<slug>.md` ou o registro `.sabia/planejamento/sustentacao/<ID>-<slug>.md` |
| nada | a fila: as linhas `nova` de fatia e bug, na ordem do `backlog.md`, com a `obs` `falta:` visível. A pessoa escolhe um item ou "uma a uma" (a fila na ordem) |

Nunca invente dado de work item: o EWM e a pessoa completam.

## Saída

O item lido (pedido, título, descrição, tipo sugerido, `ib`) → passo `duplicado`.

## Pare se

- Nada informado e fila vazia → diga "nenhum item `nova` para triar" e pare.
