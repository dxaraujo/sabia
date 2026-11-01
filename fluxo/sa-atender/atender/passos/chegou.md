---
{"resumo": "Acha o AT registrado (AT-nnn, [ATD] ou o número do EWM) no backlog da base e o registro dele; o resto não é daqui."}
---
## Entrada

`AT-nnn`, `[ATD] AT-nnn` ou o número do EWM do IB `[AT-nnn]` ou da `[ATD]`.

## Faça

| Entrada | Como ler |
|---|---|
| `AT-nnn` ou `[ATD] AT-nnn` | a linha na `### Atendimento` do `backlog.md` e o `AT-<nnn>-<slug>.md`, na base (itens 1 e 5 do bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base): o registro é gravado ali durante todo o atendimento) |
| número do EWM do IB `[AT-nnn]` ou da `[ATD]` | a linha do `backlog.md` com esse id em `elm` |
| pedido novo ("o cliente pediu …"), ou AT fora do backlog | não está registrado → "use `sa-triar`" e pare — nunca abra AT aqui |
| AT `concluido` ou `cancelado` | mostre a situação e pare; reabrir é um AT novo pela triagem |
| item de outra categoria da Sustentação (`IM-`, `BD-`, `IN-`, `OP-`, `EX-`; tarefa `[IMPL]` `[BD]` `[INF]` `[OPE]` `[EXT]`) | não é deste fluxo → "use `sa-executar <item>`" e pare |

## Saída

A linha do AT no `backlog.md` e o registro dele, na base → passo `assumir`.

## Pare se

- Pedido novo, ou AT fora do backlog → não está registrado: "use `sa-triar`" e pare — nunca abra AT aqui.
- AT `concluido` ou `cancelado` → mostre a situação e pare; reabrir é um AT novo pela triagem.
- Item de outra categoria da Sustentação → não é deste fluxo: "use `sa-executar <item>`" e pare.
- Não é atendimento (pedido que muda o comportamento do sistema, ou regra que ninguém decidiu) → devolva à
  `sa-triar` para refazer a triagem e pare.
