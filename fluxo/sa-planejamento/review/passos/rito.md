---
{"resumo": "Mostra os concluídos com o link do MR e os abertos; registra o retorno por item; pedido novo vai ao cadastro."}
---
## Entrada

A sprint e o `backlog.md` da branch base.

## Faça

1. Mostre os itens concluídos no ciclo: linhas desenvolvimento e atendimento cujo item tem `concluida_em` dentro das
   datas da sprint, cada um com o link do MR, onde está a evidência. Depois, os abertos: vão para a virada do próximo
   planejamento.
2. Registre o retorno de quem está presente, uma linha por item concluído: `<id> · <retorno>`, ou `<id> · sem
   retorno`. Vai na `## Review` do `sprint-<nn>.md` (passo `gravar`).
3. Pedido novo vira item pelo passo `cadastro`, com `origem review <AAAA>/Sprint <nn>` na `obs`. Item concluído não
   reabre: o pedido sobre ele também entra pelo cadastro.

## Saída

Pedido novo → passo `cadastro`. Sem pedido novo → passo `regras-aprendidas`.

## Pare se

Sem condição própria: a review não trava.
