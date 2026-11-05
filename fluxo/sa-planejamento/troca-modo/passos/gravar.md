---
{"resumo": "Com o ok: o modo novo no backlog.md e no sprint-<nn>.md (revisor, verificador, Observação) e, no EWM, a [REV] e a [VER] que nascem (AFK → HITL) ou são canceladas (HITL → AFK) (§7)."}
---
## Entrada

"Alterar" na pergunta do passo `mostrar`.

## Faça

Com o "ok", pelo bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base):
`modo` novo na linha da fatia no `backlog.md`; no `sprint-<nn>.md`, Modo, Revisor e Verificador (`—` no AFK) e a
Observação `modo: <de> → <para> (<quem>, <data>, <motivo>)` (no Pleno, a do passo `mostrar`). No mesmo "sim", no EWM
([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §7):

- **AFK → HITL:** crie a `[REV]` e a `[VER]` que faltam (a que já existe move) e grave os ids na coluna "Tarefa ELM"
  (`REV <id> · VER <id>`) e no `elm` do `backlog.md`; PR aberto → cancele a `[APR] Aprovar PR`.
- **HITL → AFK:** cancele a `[REV]` e a `[VER]` existentes (`elm_transicao(<id>, "cancelar")`) e tire os ids da
  "Tarefa ELM"; na falha ou sem o MCP `elm` → `ELM pendente [<REV|VER> <id> cancelar]` (o id da tarefa no EWM) onde a fatia guarda as pendências (elm.md, Pendências: não iniciada → rodapé da ficha; `iniciada` → Histórico do `status.md`).

A fatia bloqueada com `aguardando troca de modo` sai do bloqueio na retomada do Dev, que sincroniza o `status.md`
(Modo e ids) pela base.

## Saída

A troca gravada na base e no EWM → passo `avisar`.

## Pare se

Sem o "ok", nada é gravado (regra de ouro).
