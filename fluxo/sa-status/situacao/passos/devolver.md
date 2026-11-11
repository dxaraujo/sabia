---
{"resumo": "Tira o item da sprint no meio dela: o em-andamento volta a elegivel (sustentação: nova); as tarefas abertas saem da sprint, com o rastro na obs do item."}
---
## Entrada

O item com linha na sprint aberta, sem `concluida_em`.

## Faça

1. Prévia da linha do `backlog.md`, como a virada faz:
   - `em-andamento` → `elegivel` (sustentação → `nova`); o responsável fica;
   - os outros status não mudam; o item impedido continua impedido, e o `de` do `motivo` passa a ser o status de
     volta;
   - a `obs` ganha `saiu da <AAAA>/Sprint <nn> em <hoje> (<trabalho> · iniciada em <data> · <tarefas>)`, com o que as
     tarefas abertas guardavam.
2. As tarefas abertas do item (linhas sem `concluida_em`) saem da sprint; as concluídas ficam. A branch, a ficha e a
   pasta ficam.
3. Peça o "sim".

## Saída

Com o "sim" → passo `gravar`, com a mensagem `<ID> devolver ao backlog`.

## Pare se

Sem o "sim" → nada é gravado; o fluxo termina.
