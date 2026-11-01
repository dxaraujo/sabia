---
{"resumo": "Recalcula vazão, lead time e horas por tipo (historico do equipe.json), propõe o % da reserva e replaneja a próxima pelo fluxo `sa-planejamento.sprint`."}
---
## Entrada

A sprint fechada (passo `fechar`).

## Faça

Recalcule vazão média, lead time médio e horas por tipo (`equipe.json` → `historico`). Reserva (Sustentação +
retrabalho): o % é o do `acordos.md`; mostre o consumido da sprint (horas das tarefas de Sustentação +
retrabalho) contra ela e, se ficou muito acima ou abaixo, **proponha** um novo % ao P.O. — muda o acordo só com
"ok". Replaneje a próxima pelo fluxo `sa-planejamento.sprint` (migradas consomem capacidade primeiro); o `sprint-<nn>.md` dela nasce
com `**Publicação no EWM:** pendente` no cabeçalho (o §1 dela ainda não rodou; a publicação vem no passo `virada`).

## Saída

O `historico` atualizado e a próxima sprint planejada → passo `virada`.

## Pare se

Sem o "ok" do P.O., o % da reserva não muda.
