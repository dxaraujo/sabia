---
{"resumo": "Só a pedido: cria o IB de todas as linhas sem ib, com uma confirmação para o lote."}
---
## Entrada

Pedido direto ("criar o IB dos itens sem IB"). Nunca oferecido na triagem.

## Faça

Liste as linhas do `backlog.md` sem `ib`, menos as canceladas e as concluídas. Mostre a prévia do lote e, com
um "sim", crie os IBs `[<id>] <título>` (iteração `backlog`). Prepare a coluna `ib` de cada linha para o passo
`gravar`, com a mensagem `elm: IB em lote`.

## Saída

Segue para o passo `gravar`.

## Pare se

- Falha no meio → grave os que nasceram (o próximo lote retoma pelos que ficaram sem `ib`).
