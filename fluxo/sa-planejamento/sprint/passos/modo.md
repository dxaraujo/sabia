---
{"resumo": "Modo pela senioridade: o modo final da fatia sai da senioridade de quem implementa; a [REV] é sempre de um Dev Sênior; HITL → AFK nunca."}
---
## Entrada

A fatia ganha responsável — na seleção da sprint (passo `responsaveis`), no encaixe
(`sa-planejamento.durante.encaixe`) ou, se ela entrou sem responsável, quando alguém a assume (`sa-desenvolver.desenvolver.compromisso`).

## Faça

O `modo` que a triagem ou o fatiamento gravaram é a proposta para a **fatia** (critérios da `sa-fatiar`). O modo
final sai quando a fatia ganha responsável — na seleção da sprint, no encaixe ou, se ela entrou sem responsável,
quando alguém a assume (`sa-desenvolver.desenvolver.compromisso`) —, pela `senioridade` de quem implementa no `equipe.json`:

| Senioridade | Modo da fatia |
|---|---|
| `Júnior` | sempre `HITL` |
| `Pleno` | o Sabiá aplica os critérios da `sa-fatiar` (inclusive "tipo de trabalho novo começa `HITL`") e propõe; a pessoa confirma |
| `Sênior` | `AFK` por padrão; `HITL` só com motivo forte da fatia — decisão de produto ou de UX no caminho, dado sensível, risco alto (diga qual) |

Modo final diferente do backlog → grave-o com `obs` `modo pela senioridade (<login>)`; o `HITL` do Sênior leva o
motivo: `modo pela senioridade (<login>): HITL — <motivo>`.

**Revisor** (fatia HITL): a `[REV]` é sempre de um **Dev Sênior** ativo — o Sênior revisa os PRs do Pleno e do
Júnior. PR de um Sênior → outro Sênior; se ele for o **único** Sênior ativo, ele mesmo, com `revisor único` na
Observação da linha da fatia no `sprint-<nn>.md`. Conte essas revisões, e as aprovações (`[APR]`), nas horas de
revisão dos Sêniores. A senioridade também decide o GATE do plano (Júnior sempre, Pleno se pedir, Sênior nunca —
passo `sa-plano.plano.gate`).

Fatia `iniciada` só troca de **AFK para HITL**, pela Troca de modo (fluxo `sa-planejamento.troca-modo`);
**HITL → AFK nunca** — nem sugerido nem aceito.

## Saída

O modo final de cada fatia (sem responsável, o do backlog) e, no HITL, o revisor → passo `meta`. Fora deste fluxo,
volte a quem chamou.

## Pare se

Pedido de HITL → AFK, ou de troca de modo de fatia `iniciada` fora da Troca de modo → diga que é pelo fluxo
`sa-planejamento.troca-modo` (só AFK → HITL) e não troque.
