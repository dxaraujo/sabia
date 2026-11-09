---
{"resumo": "Capacidade pela vazão das últimas 3 sprints, ajustada pelas horas disponíveis; a reserva de capacidade em itens fica para o atendimento."}
---
## Entrada

O `equipe.json`, o `acordos.md`, o `backlog.md` e as sprints anteriores.

## Faça

1. **Vazão**: a média de itens de desenvolvimento concluídos nas últimas 3 sprints fechadas: as linhas Trabalho =
   desenvolvimento cujo item tem `concluida_em` dentro das datas da sprint. Na primeira sprint, 1 item por
   desenvolvedor ativo por semana. Especificação não entra na vazão.
2. **Capacidade**: a vazão ajustada pela proporção das horas disponíveis (`horas_semana` × semanas do Timebox, menos
   as `ausencias` que caem no período) sobre as horas sem ausências.
3. **Reserva de capacidade**: o % do `acordos.md` aplicado à capacidade, em itens, reservado ao atendimento.
4. **Sobra** para o desenvolvimento = capacidade − reserva de capacidade. Os migrados da virada consomem a sobra primeiro.

No reabastecimento, a capacidade é a da sprint aberta menos as linhas de desenvolvimento que ela já tem.

## Saída

Vazão, capacidade, reserva de capacidade e sobra → passo `especificacao`.

## Pare se

Sem condição própria.
