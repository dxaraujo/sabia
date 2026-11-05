---
{"resumo": "A puxada (encaixe): item fora da sprint aberta, fatia que concluiu a [ESP] FT, tarefa de especificação da Volta, Sustentação com a reserva estourada ou linha encaixe do EWM → decisão do P.O. (ou aprovação registrada) e gravação na base e no EWM."}
---
## Entrada

O caso 3 da entrada de qualquer fluxo (fatia, épico da `[ESP]` ou item de Sustentação sem linha viva na sprint
aberta), a fatia que acabou de concluir a `[ESP] FT` (`sa-especificar.fatia.concluir`: a `elegivel` comum, e a
`[DEV]` nasce aqui), a tarefa de especificação da Volta à especificação sem a linha viva na seção Especificação da
sprint aberta, o pedido de puxar um item, a `sa-triar` (item de Sustentação com a reserva estourada; fatia `nova` com só `falta: especificação`) ou uma linha
`encaixe` da sincronização (passo `sincronizar`).

## Faça

**Encaixe** — é **a puxada**: todo item entra na sprint aberta por aqui. Quem faz: o P.O., o SM ou a pessoa que
puxa, esta com a orientação ou a aprovação do P.O., **registrada** (quem aprovou e quando); sem ela, o item não
entra. A puxada natural é a `elegivel` do topo com WIP de revisão folgado; a que **fura a fila** (não é a do topo)
ou com o **WIP de revisão no limite** (de qualquer trilha) pede a decisão explícita do P.O. Item de
Sustentação com a reserva estourada é o mesmo encaixe (a `sa-triar` manda para cá; o trazido do EWM já fica na
sprint, §9, e só se decide se uma fatia sai): a decisão do P.O. vai na linha do item na `## Sustentação` do
`sprint-<nn>.md`. A fatia fora da sprint cujo IB ou tarefas entraram na iteração da sprint pelo EWM (inclusive uma
tarefa de papel por fora) chega aqui pela sincronização (§9) como linha `encaixe`: a mesma decisão com o P.O.
(responsável, modo pela senioridade e, no HITL, revisor e verificador), com a Observação
`encaixe: trazida do EWM — <decisão> (<quem decidiu>, <data>)`, e a tarefa que já existe é a do papel inferido.
Mostre a fatia (trilha, tamanho, modo, origem), o que sobra da capacidade (revisão, vazão, HITL; no item de
Sustentação, a reserva, cujo usado não soma as linhas com `saiu da sprint`: o item saiu da sprint e não a consome) e
as opções, com a recomendada:
- **entra na folga** — cabe sem tirar nada;
- **entra no lugar de** `FT-…` — uma `planejada` (ainda não iniciada), que sai da sprint;
- **fica para a próxima sprint** (a trazida do EWM: o IB e as tarefas voltam ao backlog do EWM, o IB no estado
  inicial).

**Tarefa de especificação da Volta** ([Volta à
especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação)): a mesma decisão, na capacidade de
especificação; grava só a linha `planejada` na seção Especificação do `sprint-<nn>.md` (Observação `encaixe: …`) e,
no EWM, nasce sob o IB do item: a `[ESP] FT-<nnn> Especificação` na fatia de épico que não tem `[ESP]`; a
`[ESP] <id> Revisão <n>` (Observação também `revisão <n>: <motivo>`, o motivo da `obs` `falta: especificação (<motivo>,
…)` do item) no item cuja `[ESP]` concluiu numa sprint fechada — a concluída não move nem reabre; no épico, o IB do
épico entra na iteração da sprint (só `iteracao`). A concluída nesta sprint não passa por aqui: reabre pela Volta (a
linha dela volta a `iniciada`), sem tarefa nova. Sem mexer na linha da fatia; no `backlog.md`, só o id novo na
coluna `elm` (`ESP [<id>](<url>)`; no épico, também a `sprint`) e, com a Revisão, sai a `obs` `falta: especificação`
(na fatia `nova` ela fica: é a DoR).

**Fatia `nova` que entra como especificação** (`falta: …`, inclusive só `falta: especificação`, ou a `planejada`
que voltou a `nova` e fica na sprint, [Volta à
especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação)): a mesma decisão, na capacidade de
especificação. No `backlog.md` a fatia fica `nova`, com `sprint` e `obs` `em especificação` (nunca `planejada`), e
ganha a linha `planejada` na seção Especificação do `sprint-<nn>.md` (Observação `encaixe: …`); no EWM, o IB entra
na iteração e a `[ESP] FT-<nnn> Especificação` nasce sob ele
([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §3–4; a que já existe e não concluiu move; a
concluída numa sprint fechada fica como está, e nasce a `[ESP] FT-<nnn> Revisão <n>`; a concluída nesta sprint
reabre pela Volta, com a linha dela `iniciada`, sem tarefa nova) — sem `[DEV]`, `[REV]` ou `[VER]`.

Com a decisão (fatia `elegivel`, épico ou item de Sustentação): `status` `planejada` (no épico da `[ESP]`, `planejado`), `sprint`, `responsavel` (o definido, ou `—`:
quem assumir define o modo pela senioridade) e o modo final pela senioridade (`sa-planejamento.sprint.modo`) no
`backlog.md` (e, na fatia HITL, revisor — Dev Sênior, pela regra do revisor (`sa-planejamento.sprint.modo`) — e
verificador, que não seja quem implementa — as `[REV]`/`[VER]` precisam deles), uma linha `planejada` no
`sprint-<nn>.md` (Fatias, Especificação ou, no item de Sustentação, a linha `aberto` na `### <Categoria>`, que nasce
se for a primeira) com a Observação `encaixe: <decisão> (<quem aprovou>, <data>)` (puxada por outra pessoa:
`encaixe: <decisão> (<quem aprovou>, <data>; puxada por <login>)`), pelo bloco [Gravar na
base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), e no EWM o IB da fatia (no épico, o IB do épico) passa do backlog para a iteração da
sprint (só `iteracao`), cada tarefa que já existe (a que ficou no backlog do EWM quando a fatia saiu de uma sprint sem
começar, ou a que o EWM trouxe; no épico, a `[ESP]`) move na chamada dela, com o dono e a estimativa do papel — uma por papel: com duas, a
que o EWM trouxe é a dele, e a que ficou no backlog não move e é cancelada (`elm_transicao(<id>, "cancelar")`, no
mesmo "sim"; na falha, `ELM pendente [<tipo> <id> cancelar]` no rodapé da ficha) —, e só nasce o papel que falta
([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md), topo e §3–4; item de Sustentação: o IB dele muda de iteração e
a tarefa move ou nasce, §6). Na troca, a fatia que sai fica `elegivel` com `sprint` `—` no `backlog.md`, e a linha
dela no `sprint-<nn>.md` recebe Status `elegivel` e a Observação `saiu da sprint: encaixe de <FT> (<quem>, <data>)`;
o IB dela e as tarefas voltam ao backlog do EWM (`elm_atualizar_wi(ids, iteracao = backlog)`;
[elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §3), o IB no estado inicial (fora dele →
`elm_transicao(<id>, "reabrir")`: no backlog, fora de sprint, o IB fica sempre no estado inicial), e ficam lá até ela
voltar a uma sprint, quando movem.

## Saída

Decidido e gravado → "o executor retoma pela própria skill (`<skill> <id>`)": o fluxo termina. Da sincronização, a
próxima linha `encaixe` (de novo este passo).

## Pare se

Sem a decisão do P.O., ou sem a aprovação dele registrada, o item não entra; urgência acelera a decisão, não a
dispensa.
