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
(responsável, modo pela senioridade e, no HITL, revisor e verificador), e a tarefa que já existe é a do papel
inferido.
Mostre a fatia (trilha, tamanho, modo, origem), o que sobra da capacidade (revisão, vazão, HITL; no item de
Sustentação, a reserva e o consumido, pela conta do
[arquivos.md](~/.sabia/framework/skills/sa-planejamento/references/arquivos.md#sprintspaisprint-nnmd), sem as linhas com
`saiu da sprint`: o item saiu da sprint e não a consome;
na especificação, a capacidade de especificação) e as opções, com a recomendada:
- **entra na folga** — cabe sem tirar nada;
- **entra no lugar de** `FT-…` — uma `planejada` (ainda não iniciada), que sai da sprint;
- **fica para a próxima sprint** (a trazida do EWM: o IB e as tarefas voltam ao backlog do EWM, o IB no estado
  inicial).

**Observação** do encaixe, na linha do `sprint-<nn>.md`: `encaixe: <decisão> (<quem aprovou>, <data>)`; puxada por
outra pessoa, `encaixe: <decisão> (<quem aprovou>, <data>; puxada por <login>)`; a trazida do EWM,
`encaixe: trazida do EWM — <decisão> (<quem aprovou>, <data>)`. `<decisão>` = `entra na folga` ·
`entra no lugar de FT-<nnn>` · `entra como especificação`.

**Com a decisão** — tudo pelo bloco [Gravar na
base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), e no EWM pelo
[elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) (topo e §3–4; Sustentação, §6):

| Caso | `backlog.md` | `sprint-<nn>.md` | EWM |
|---|---|---|---|
| fatia `elegivel` (inclusive a que acabou de concluir a `[ESP] FT`: a `[DEV]` nasce aqui) | `status` `planejada`, `sprint`, `responsavel` (o definido, ou `—`: quem assumir define o modo pela senioridade) e o `modo` final pela senioridade (`sa-planejamento.sprint.modo`) | linha `planejada` em Fatias, com a Observação `encaixe: …`; na fatia HITL, Revisor — Dev Sênior, pela regra do revisor (`sa-planejamento.sprint.modo`) — e Verificador, que não seja quem implementa (as `[REV]`/`[VER]` precisam deles) | o IB da fatia passa do backlog para a iteração da sprint (só `iteracao`); as tarefas que já existem movem e só nasce o papel que falta |
| fatia `nova` como especificação (`falta: …`, inclusive só `falta: especificação`, ou a `planejada` que voltou a `nova` e fica na sprint, [Volta à especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação)) | fica `nova` (nunca `planejada`), com `sprint` e `obs` `em especificação` | linha `planejada` na seção Especificação, Observação `encaixe: …` | o IB entra na iteração e a `[ESP] FT-<nnn> Especificação` nasce sob ele (§3–4): a que já existe e não concluiu move; a concluída numa sprint fechada fica como está, e nasce a `[ESP] FT-<nnn> Revisão <n>`; a concluída nesta sprint reabre pela Volta, com a linha dela `iniciada`, sem tarefa nova — sem `[DEV]`, `[REV]` ou `[VER]` |
| tarefa de especificação da Volta ([Volta à especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação)), na capacidade de especificação | sem mexer na linha da fatia: só o id novo na coluna `elm` (`ESP [<id>](<url>)`; no épico, também a `sprint`); com a Revisão, sai a `obs` `falta: especificação` (na fatia `nova` ela fica: é a DoR) | só a linha `planejada` na seção Especificação, Observação `encaixe: …` (na Revisão, também `revisão <n>: <motivo>`; na `[ESP] FT-<nnn> Especificação` da fatia `iniciada`, também `volta: <motivo>` — o motivo da `obs` `falta: especificação (<motivo>, …)` do item ou, achada na branch, o do Bloqueio) | nasce sob o IB do item: a `[ESP] FT-<nnn> Especificação` na fatia de épico sem `[ESP]`; a `[ESP] <id> Revisão <n>` no item cuja `[ESP]` concluiu numa sprint fechada (a concluída não move nem reabre); no épico, o IB do épico entra na iteração da sprint (só `iteracao`). A concluída nesta sprint não passa por aqui: reabre pela Volta (a linha dela volta a `iniciada`), sem tarefa nova |
| épico com a `[ESP]` | `status` `planejado`, `sprint`, `responsavel` | linha `planejada` na seção Especificação, Observação `encaixe: …` | o IB do épico passa do backlog para a iteração (só `iteracao`); a `[ESP]` que já existe move, senão nasce |
| item de Sustentação | o `status` não muda (`aberto`), só `sprint` e `responsavel` | linha `aberto` na `### <Categoria>` (que nasce se for a primeira), com a Observação `encaixe: …` (a decisão do P.O.) | o IB dele muda de iteração e a tarefa move ou nasce (§6) |
| linha `encaixe` trazida do EWM | o do caso do item (acima) | o do caso do item, Observação `encaixe: trazida do EWM — …` | a tarefa que já existe é a do papel inferido; fica para a próxima → o IB e as tarefas voltam ao backlog do EWM, o IB no estado inicial |
| fatia que sai na troca | fica `elegivel`, com `sprint` `—` | a linha dela recebe Status `elegivel` e a Observação `saiu da sprint: encaixe de <FT> (<quem aprovou>, <data>)` | o IB dela e as tarefas voltam ao backlog do EWM (`elm_atualizar_wi(ids, iteracao = backlog)`; §3), o IB no estado inicial (fora dele → `elm_transicao(<id>, "reabrir")`: no backlog, fora de sprint, o IB fica sempre no estado inicial), e ficam lá até ela voltar a uma sprint, quando movem |

Regras comuns:
- **Move, nunca recria:** cada tarefa que já existe (a que ficou no backlog do EWM quando o item saiu de uma sprint
  sem começar, ou a que o EWM trouxe; no épico, a `[ESP]`) move na chamada dela, com o dono e a estimativa do papel;
  só nasce o papel que falta.
- **Uma tarefa por papel:** com duas, a que o EWM trouxe é a dele, e a que ficou no backlog não move e é cancelada
  (`elm_transicao(<id>, "cancelar")`, no mesmo "sim").
- **Falha no cancelar:** `ELM pendente [<tipo> <id> cancelar]` no rodapé da ficha.
- **Volta achada na branch** (fatia `iniciada` com o Bloqueio `aguardando especificação [ESP] FT-<nnn>: …` e a
  `[ESP]` concluída numa sprint fechada, ou sem `[ESP]`): a tarefa nasce com o motivo do Bloqueio na Observação
  ([Achado na branch da fatia](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação)).

## Saída

Decidido e gravado → diga por onde o executor retoma, e o fluxo termina:

| Item | Diga |
|---|---|
| fatia `elegivel` | "o Dev começa pela `sa-desenvolver <FT>`" |
| fatia como especificação, `[ESP] FT` ou Revisão | "quem especifica segue pela `sa-especificar <id>` (agente `sa-especificador`)" |
| épico com a `[ESP]` | "`sa-especificar <EP>` (agente `sa-especificador`)" |
| Atendimento | "`sa-atender <AT>`" |
| demais categorias de Sustentação | "`sa-executar <ID>`" |
| **fica para a próxima sprint** | nada é gravado nos arquivos (na trazida do EWM: o IB e as tarefas voltam ao backlog do EWM, o IB no estado inicial); diga "fica para o próximo planejamento" |

Da sincronização, a próxima linha `encaixe` (de novo este passo).

## Pare se

- Sem a decisão do P.O., ou sem a aprovação dele registrada, o item não entra; urgência acelera a decisão, não a
  dispensa.
- Item fora do `backlog.md` → "use `sa-triar`" e pare.
- Item terminal → mostre a situação e a `obs` e pare.
- Item já com linha viva na sprint aberta → "já está na sprint" e pare.
