---
{"resumo": "Lança o saldo de horas, conclui a tarefa e o IB do item, marca concluido na base, pergunta o desdobramento e faz o commit único."}
---
## Entrada

"concluir o <ID>": o trabalho feito e registrado na ficha (passo `registrar`).

## Faça

1. **Concluir:** mostre o já lançado (`elm_horas(id)`), pergunte só o saldo → `elm_lancar_horas`, depois
   `elm_transicao(id, "concluir")` na tarefa e no IB do item, numa confirmação. `**Situação:** concluido` e os
   créditos da sessão na ficha ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4); no `backlog.md`,
   `status` `concluido` e `concluida-em`; na `### <Categoria>` do `sprint-<nn>.md`, a Situação e os Créditos da
   linha (a soma da seção Créditos da ficha; o `creditos` do `backlog.md` é da virada da sprint).
2. **Desdobramento**, registrado em **Saída** na ficha:

   ```
   ✅ <ID> concluído. Algum desdobramento?
     1. nada
     2. alteração (muda o repositório) ou regra que ninguém decidiu → use `sa-triar` com origem <ID>
     3. algo a não repetir ou a reaproveitar → lição pela `sa-aprender`
   ```

3. Um commit `<ID> concluir` (ficha, backlog e sprint), pelos itens 3 e 4 do bloco Gravar na base.

## Saída

Tarefa e IB fechados, o item `concluido` na base, o commit `<ID> concluir` e a instrução do desdobramento escolhido.
Aqui o fluxo termina.

## Pare se

Só instrui e para: **nunca invoque nem simule outra skill**.
