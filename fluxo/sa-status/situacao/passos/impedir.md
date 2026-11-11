---
{"resumo": "Status impedida (épico: impedido) e a coluna motivo com o que impede, quem, desde quando, até quando e o status anterior."}
---
## Entrada

O item e o pedido de impedir.

## Faça

1. Pergunte o que falta: o motivo numa linha e quem impede (`externo: <área ou nome>`, um id do Sabiá ou um `usuario`).
   A data "até" é opcional: use-a quando há previsão ou quando o pedido é adiar.
2. Prévia da linha do `backlog.md`:
   - status `impedida` (épico: `impedido`);
   - `motivo`: `<motivo> · por <quem> · desde <hoje> · até <AAAA-MM-DD> · de <status de agora>` (sem o `até`, a parte
     não entra).
3. Item `em-andamento`: nada é desfeito. Branch, worktree, MR, tarefa do EWM, responsável e a linha da sprint ficam
   como estão, e o WIP segue contando o item. Com autopilot rodando (`.sabia/local/wt/<id>`), peça para parar antes.
   Peça ao responsável a nota no Retomar do `status.md` (`impedida: <motivo>`); na sustentação, uma linha na
   Atividade do registro.
4. Peça o "sim".

## Saída

Com o "sim" → passo `gravar`, com a mensagem `<ID> impedir`.

## Pare se

Sem o motivo, sem quem impede ou sem o "sim" → nada é gravado; o fluxo termina.
