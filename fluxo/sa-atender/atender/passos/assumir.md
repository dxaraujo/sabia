---
{"resumo": "Com o AT na sprint aberta, cria no EWM o IB e a [ATD] que faltarem, assume a [ATD] e marca em-andamento na base."}
---
## Entrada

O AT achado no passo `chegou`.

## Faça

AT fora da sprint aberta (`sprint` `—`, sem linha viva na `### Atendimento` do `sprint-<nn>.md` aberto: sem sprint,
fora da reserva na triagem ou só a linha com `saiu da sprint` — [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base),
Linha viva) → pare (abaixo); com a linha viva na sprint, siga
(a reserva já foi decidida ali).

1. **EWM**, com "sim": falta o IB `[AT-nnn]` (`elm` `pendente`: AT registrado sem o MCP `elm`) ou a `[ATD]` → antes,
   crie o que faltar ([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §6) e grave os ids na coluna `elm`
   do `backlog.md` e em "Tarefa ELM" da linha do AT no `sprint-<nn>.md`. Depois `elm_transicao(<id da [ATD]>,
   "assumir")` (já minha → `ja_estava`, nada a fazer; de outra pessoa → `conflito`: pergunte e repita com
   `forcar: true`; já fechada → `precondicao` "já concluída: reabra antes": mostre o estado e, com "sim",
   `elm_transicao(<id>, "reabrir")` e de novo o `assumir`, ou o AT a `concluido` como a sincronização faz — linha
   "tarefa concluída" da Sustentação ([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §9) — e pare).
   Sem o MCP `elm` → `ELM pendente [<chave>]: assumir [ATD] AT-<nnn>` no registro do AT, e siga.
2. **Base:** `em-andamento` no `status` do `backlog.md`, na Situação da linha do sprint e no `**Situação:**` do
   registro, pelos itens 3 e 4 do bloco Gravar na base — commit `AT-<nnn> iniciar`, antes de executar (atender e
   concluir de uma vez, nesta sessão → um commit só, o do passo `desdobramentos`). Já `em-andamento` (retomada) → nada a gravar.

## Saída

`[ATD]` assumida e o AT `em-andamento` na base → passo `executar`.

## Pare se

- AT fora da sprint aberta → a decisão é do P.O. (`sa-planejamento.durante.encaixe`) e pare.
- `[ATD]` já fechada e o AT levado a `concluido` como a sincronização faz (item 1) → pare.
