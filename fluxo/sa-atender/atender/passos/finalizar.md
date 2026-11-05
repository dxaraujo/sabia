---
{"resumo": "Grava a resposta enviada, lança o saldo de horas, conclui a [ATD] e o IB do AT e marca concluido no registro, no backlog e na sprint."}
---
## Entrada

"enviei", "conclui o AT-012": a resposta já enviada pela pessoa.

## Faça

1. Grava no registro a resposta enviada (sem dado de cliente; o texto com dado real fica em `.sabia/local/`).
2. **Saldo de horas:** mostre o que já foi lançado na `[ATD]` (`elm_horas(id)`) e pergunte só o que falta →
   `elm_lancar_horas(id, horas)`; depois `elm_transicao(id, "concluir")` na `[ATD]` e no IB `[AT-nnn]`, com uma
   confirmação. Cada lançamento ganha uma linha na tabela Horas do registro. Sem o MCP `elm` ou com
   falha → uma linha por chave no campo `**ELM:**` do registro: `ELM pendente [ATD AT-<nnn> horas]: lançar <h>h
   (<AAAA-MM-DD>)` · `ELM pendente [ATD AT-<nnn> concluir]: concluir a tarefa` · `ELM pendente [IB AT-<nnn>
   concluir]: concluir o IB` (ex.: `[ATD AT-012 horas]`, `[IB AT-012 concluir]`).
3. Créditos desta sessão no registro (como no passo `executar`, item **Horas**); `**Situação:** concluido` no registro; na linha do AT
   no `backlog.md`, `status` `concluido` e `concluida-em`; na `### Atendimento` do `sprint-<nn>.md`, a Situação e os
   Créditos da linha do AT (a soma da seção Créditos; o `creditos` do `backlog.md` é da virada da sprint). O commit
   é **um só**, no fim do passo `desdobramentos` (com a Saída), pelos itens 3 e 4 do bloco Gravar na base.

## Saída

Registro, backlog e sprint com o AT `concluido`, sem commit ainda → passo `desdobramentos`.

## Pare se

Nenhuma parada própria: o commit e o fim do fluxo são no passo `desdobramentos`.
