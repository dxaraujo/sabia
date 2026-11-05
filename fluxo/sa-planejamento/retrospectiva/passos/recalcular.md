---
{"resumo": "Recalcula vazão, lead time e horas por tipo (historico do equipe.json), propõe o % da reserva e replaneja a próxima pelo fluxo `sa-planejamento.sprint`."}
---
## Entrada

A sprint fechada (passo `fechar`).

## Faça

Recalcule vazão média, lead time médio e horas por tipo (`equipe.json` → `historico`). Reserva (Sustentação +
retrabalho): o % é o do `acordos.md`; mostre o consumido da sprint (horas das tarefas de Sustentação +
retrabalho) contra ela e, se ficou muito acima ou abaixo, **proponha** um novo % ao P.O. — muda o acordo só com
"ok". Replaneje a próxima pelo fluxo `sa-planejamento.sprint` (migradas consomem capacidade primeiro); o `sprint-<nn>.md` dela,
criado no passo `fechar`, segue com `**Publicação no EWM:** pendente` no cabeçalho (o §1 do [elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md), iteração e plano da sprint no EWM, ainda não rodou para ela; a publicação vem no passo `virada`).

Grave pelo bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), num
commit só — o da virada, `<pai>/Sprint <nn>: virada`, com a chave da sprint que fecha —: o que os passos `horas` e
`fechar` gravaram, o `historico` do `equipe.json`, o % do `acordos.md` (se mudou) e a próxima sprint (passo
`sa-planejamento.sprint.gravar`).

## Saída

O `historico` atualizado e a próxima sprint planejada → passo `virada`.

## Pare se

Sem o "ok" do P.O., o % da reserva não muda.
