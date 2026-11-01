---
{"resumo": "Assume a tarefa no EWM e marca em-andamento na base, registra o que foi feito sem dado de cliente, lança horas e conclui tarefa e IB do item."}
---
## Entrada

O item e a ficha achados no passo `chegou`.

## Faça

O item 1 vem primeiro; com a tarefa já assumida, os demais valem em qualquer ordem e em várias sessões (lançar
horas ou concluir sem a tarefa assumida → o item 1 antes). Cada escrita no EWM com "sim". Ficha, backlog e sprint são
gravados na base (bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base)).

1. **Assumir a tarefa:** antes de tudo, item fora da sprint aberta (`sprint` `—`, sem linha viva na `### <Categoria>`
   do `sprint-<nn>.md` aberto: sem sprint, fora da reserva na triagem ou só a linha com `saiu da sprint` —
   [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), Linha viva) → pare (abaixo);
   com a linha viva na sprint, siga (a reserva já foi decidida ali). Falta o IB do item (`elm`
   `pendente`) ou a tarefa → crie o que faltar ([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §6) e
   grave os ids na coluna `elm` do `backlog.md` e em "Tarefa ELM" da linha do `sprint-<nn>.md`. Então
   `elm_transicao(id, "assumir")` na tarefa (já minha → `ja_estava`; de outra pessoa → `conflito`: pergunte e repita
   com `forcar: true`; já fechada → `precondicao` "já concluída: reabra antes": mostre o estado e, com "sim",
   `elm_transicao(id, "reabrir")` e de novo o `assumir`, ou o item a `concluido` como a sincronização faz — linha
   "tarefa concluída" da Sustentação ([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §9) — e pare). Na base,
   `em-andamento` no `status` do `backlog.md`, na Situação da linha do sprint e no `**Situação:**` da ficha — commit
   `<ID> iniciar` (assumir e concluir de uma vez, nesta sessão → um commit só, o `<ID> concluir`); já `em-andamento` (retomada) → nada a gravar.
2. **Registrar o trabalho:** em `## O que foi feito` da ficha, os passos e a evidência (o que foi executado, onde,
   resultado, link do chamado ou da mudança), **sem dado de cliente** — dado real fica em `.sabia/local/sustentacao/<pasta>/<ID>/`.
   Comentário ou anexo na própria tarefa (`elm_comentar`, `elm_anexo enviar`), se a pessoa quiser.
3. **Lançar horas:** a qualquer momento, `elm_lancar_horas(id, horas)`; cada lançamento é uma linha na tabela Horas
   da ficha. Lançar **não** conclui.
4. **Concluir:** mostre o já lançado (`elm_horas(id)`), pergunte só o saldo → `elm_lancar_horas`, depois
   `elm_transicao(id, "concluir")` na tarefa e no IB do item, numa confirmação. `**Situação:** concluido` e os
   créditos da sessão na ficha ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4); no `backlog.md`,
   `status` `concluido` e `concluida-em`; na `### <Categoria>` do `sprint-<nn>.md`, a Situação e os Créditos da
   linha (a soma da seção Créditos da ficha; o `creditos` do `backlog.md` é da virada da sprint). Um commit
   `<ID> concluir`. Desdobramento que muda o repositório → `sa-triar` com `origem` `<ID>`.

Sem o MCP `elm` ou com falha → `ELM pendente [<chave>]: <assumir | lançar <h>h | concluir tarefa e IB> <prefixo> <ID>`
no campo `**ELM:**` da ficha, e siga.

## Saída

Tarefa assumida e `em-andamento` na base; o trabalho e as horas registrados; ao concluir, tarefa e IB fechados e o
commit `<ID> concluir`.

## Pare se

- Item fora da sprint aberta (item 1) → a decisão é do P.O. (passo
  `sa-planejamento.durante.encaixe`) e pare.
- Tarefa já fechada e o item levado a `concluido` como a sincronização faz (item 1) → pare.
