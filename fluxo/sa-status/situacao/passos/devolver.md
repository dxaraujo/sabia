---
{"resumo": "Tira o item da sprint no meio dela: o em-andamento volta a elegivel (sustentação: nova); a linha da sprint fica, sem concluida_em."}
---
## Entrada

O item com linha na sprint aberta, sem `concluida_em`.

## Faça

1. Prévia da linha do `backlog.md`, como a virada faz:
   - `em-andamento` → `elegivel` (sustentação → `nova`); o responsável fica;
   - os outros status não mudam; o item impedido continua impedido, e o `de` do `motivo` passa a ser o status de
     volta.
2. A linha da sprint não é apagada (a tarefa do EWM mora nela) e fica sem `concluida_em`: o item deixa de contar como
   trabalho da sprint porque o status saiu de `em-andamento`. A branch, a ficha e a pasta ficam.
3. Peça o "sim".

## Saída

Com o "sim" → passo `gravar`, com a mensagem `<ID> devolver ao backlog`.

## Pare se

Sem o "sim" → nada é gravado; o fluxo termina.
