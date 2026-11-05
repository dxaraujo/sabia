---
{"resumo": "Modo pela senioridade: o modo final da fatia sai da senioridade de quem implementa, também na primeira atribuição; a [REV] é sempre de um Dev Sênior; a troca é só pela Troca de modo."}
---
## Entrada

A fatia ganha responsável — na seleção da sprint (passo `responsaveis`), no encaixe
(`sa-planejamento.durante.encaixe`) ou, se ela entrou sem responsável, quando alguém a assume (a primeira
atribuição: `sa-desenvolver.desenvolver.compromisso`, ou o lote do `sa-orquestrar`).

## Faça

O `modo` que a triagem ou o fatiamento gravaram é a proposta para a **fatia** (critérios do passo `sa-fatiar.fatiar.rascunho`, item Modo). O modo
final sai quando a fatia ganha responsável — na seleção da sprint, no encaixe ou, se ela entrou sem responsável,
quando alguém a assume (`sa-desenvolver.desenvolver.compromisso`) —, pela `senioridade` de quem implementa no `equipe.json`:

| Senioridade | Modo da fatia |
|---|---|
| `Júnior` | sempre `HITL` |
| `Pleno` | o Sabiá aplica os critérios do passo `sa-fatiar.fatiar.rascunho`, item Modo (inclusive "tipo de trabalho novo começa `HITL`") e propõe; a pessoa confirma |
| `Sênior` | `AFK` por padrão; `HITL` só com motivo forte da fatia — decisão de produto ou de UX no caminho, dado sensível, risco alto (diga qual) |

Modo final diferente do backlog → grave-o com `obs` `modo pela senioridade (<login>)`; o `HITL` do Sênior leva o
motivo: `modo pela senioridade (<login>): HITL — <motivo>`.

**Revisor** (fatia HITL): a `[REV]` é sempre de um **Dev Sênior** ativo — o Sênior revisa os PRs do Pleno e do
Júnior. PR de um Sênior → outro Sênior; se ele for o **único** Sênior ativo, ele mesmo, com `revisor único` na
Observação da linha da fatia no `sprint-<nn>.md`. Conte essas revisões, e as aprovações (`[APR]`), nas horas de
revisão dos Sêniores. A senioridade também decide o GATE do plano (Júnior sempre, Pleno se pedir, Sênior nunca —
passo `sa-plano.plano.gate`).

**Primeira atribuição** (fatia com responsável `—`, não iniciada): não é troca — quem assume define o modo pela
senioridade dele, por esta tabela, e a `[REV]`/`[VER]` nascem ou são canceladas no mesmo "sim"
([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md), topo e §7). Com responsável
definido, a troca de modo, nos dois sentidos, é só pelo fluxo `sa-planejamento.troca-modo`, pelo P.O. ou pelo SM
(agente `sa-produto`).

## Saída

O modo final de cada fatia (sem responsável, o do backlog) e, no HITL, o revisor → passo `meta`. Fora deste fluxo,
volte a quem chamou.

## Pare se

Pedido de troca de modo de fatia com responsável definido, fora da Troca de modo → diga que é pelo fluxo
`sa-planejamento.troca-modo` (P.O. ou SM, agente `sa-produto`) e não troque.
