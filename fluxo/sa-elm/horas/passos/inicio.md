---
{"resumo": "Entrada: o sim a 'deseja lançar horas?' ou pedido direto; inclui as regras."}
---
## Entrada

O "sim" a "deseja lançar horas?" em qualquer skill (inclusive a `sa-elm.finalizar`), ou pedido direto.

## Faça

Inclua as regras (`sa-elm.regras`). Guarde de onde veio.

## Saída

Pedido completo → passo `direto`. Relatório → passo `relatorio`. O resto → passo `perguntar`.

## Pare se

- Nunca: o ELM não configurado devolve a quem chamou, que segue.
