---
{"resumo": "Mostra os concluídos com o link do MR e os abertos; o retorno por item e os pedidos novos entram pela página sabia review; pedido novo vai ao cadastro."}
---
## Entrada

A sprint e o `backlog.md` da branch base.

## Faça

1. Mostre os itens concluídos no ciclo: linhas desenvolvimento e atendimento com `concluida_em` dentro das
   datas da sprint, cada um com o link do MR, onde está a evidência. Depois, os abertos: vão para a virada do próximo
   planejamento.
2. Peça à pessoa que conduz para abrir a página, no terminal dela, na branch base: `sabia review` (`--rede` para os
   stakeholders abrirem o link). Ela tem um bloco por item entregue (o trabalho principal concluído na sprint), com o
   MR, e o bloco Pedidos novos; cada um entra com o nome e registra o retorno. Cada mudança regrava a `## Review` do
   `sprint-<nn>.md`: uma linha por item, `<id> · <retorno> — por <quem>; <retorno> — por <quem>` ou `<id> · sem retorno`,
   e `pedido novo · <pedido> — por <quem>`. A review não tem votação.
3. Sem a página: registre na conversa o retorno de quem está presente, no mesmo formato; vai na `## Review` pelo passo
   `gravar`.
4. Com o "terminamos", leia a `## Review`. Cada linha `pedido novo` vira item pelo passo `cadastro`, com `origem review
   <AAAA>/Sprint <nn>` na `obs`; depois do cadastro, a linha ganha o id no fim: `… (FT-040)`. Item concluído não reabre: o
   pedido sobre ele também entra pelo cadastro.

## Saída

Pedido novo → passo `cadastro`. Sem pedido novo → passo `gravar`.

## Pare se

Sem condição própria: a review não trava.
