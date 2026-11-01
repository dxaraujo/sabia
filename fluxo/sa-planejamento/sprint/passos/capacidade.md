---
{"resumo": "Capacidade da sprint: revisão humana (o limite principal), HITL, vazão e lead time, especificação e a reserva (Sustentação + retrabalho)."}
---
## Entrada

O `equipe.json`, o `acordos.md`, o `backlog.md` e as sprints anteriores.

## Faça

**Capacidade**, da `equipe.json` (horas da sprint menos ausências):
- **revisão humana** (horas de revisão e verificação) — o limite principal;
- **HITL**: fatias HITL consomem horas de dev acompanhando;
- **vazão**: média de fatias concluídas nas últimas 3 sprints, incluídas as puxadas (primeira sprint: comece
  com 1 fatia por dev por semana e ajuste na virada), e o lead time médio por fatia;
- **especificação**: horas de especificação da sprint (`horas-especificacao-semana`); zero no time inteiro e
  épico a especificar no topo → avise antes de seguir (sem horas não há `[ESP]`: alguém ganha horas de
  especificação no `equipe.json`, ou o épico fica para depois);
- **reserva (Sustentação + retrabalho)**: o percentual do `acordos.md` sobre as **horas da sprint do time
  inteiro** (todos os ativos, menos ausências), descontado antes de selecionar fatias. Dentro dela entram primeiro
  as **fatias migradas** da sprint anterior (horas que faltam, pela estimativa da `[DEV]` restante); o resto fica
  para a Sustentação da sprint, a começar pelos itens `aberto` com `sprint` `—` do `backlog.md` (triados sem
  sprint aberta, fora da reserva ou que saíram de uma sprint). Migradas que passam da reserva consomem a
  capacidade das fatias novas.

## Saída

As capacidades da sprint → passo `especificacao`.

## Pare se

Sem condição de parada própria: a falta de horas de especificação é aviso.
