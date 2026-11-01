---
{"resumo": "Acha o item de Sustentação registrado (IM-, BD-, IN-, OP-, EX-nnn ou a tarefa da categoria) no backlog da base e o registro dele; o resto não é daqui."}
---
## Entrada

O id do item (`IM-`, `BD-`, `IN-`, `OP-`, `EX-nnn`), a tarefa da categoria ou o número do EWM.

## Faça

| Entrada | Como ler |
|---|---|
| `IM-`, `BD-`, `IN-`, `OP-`, `EX-nnn`, ou a tarefa `[IMPL]` `[BD]` `[INF]` `[OPE]` `[EXT]` (número do EWM, do IB do item ou da tarefa: a linha com esse id em `elm`) | a linha na `### <Categoria>` da `## Sustentação` do `backlog.md` da base e a ficha `<produto>/sustentacao/<pasta>/<ID>-<slug>.md` (formato: o padrão `sa-atender/registro.md`, com `## O que foi feito`) |
| pedido novo, ou id fora do backlog | não está registrado → "use `sa-triar`" e pare |
| `AT-nnn`, tarefa `[ATD]` | não é deste fluxo → "use `sa-atender <item>`" e pare |
| item `concluido` ou `cancelado` | mostre a situação e pare |

## Saída

A linha do item no `backlog.md` e a ficha dele → passo `registrar`.

## Pare se

- Pedido novo, ou id fora do backlog → não está registrado: "use `sa-triar`" e pare.
- `AT-nnn`, tarefa `[ATD]` → não é deste fluxo: "use `sa-atender <item>`" e pare.
- Item `concluido` ou `cancelado` → mostre a situação e pare.
