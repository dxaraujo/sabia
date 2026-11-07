---
{"resumo": "Devolve a quem chamou com a situação do protótipo; aprovado com o prd.md já aprovado, oferece a sa-prd.mudanca."}
---
## Entrada

A resposta registrada (passo `aprovacao`) ou nada a registrar (passo `registrar`).

## Faça

- **Aprovado.** Devolva a quem chamou, que segue. Se o `prd.md` já está aprovado e a EL muda, ofereça a
  `sa-prd.mudanca`.
- **Aguardando ou ajuste sem a versão nova.** Devolva com "aguardando o cliente": a pendência fica no Em aberto e
  bloqueia só as EL.
- **Pedido direto.** Termine com o resumo: versão, resposta e o que bloqueia.

## Saída

Devolvido a quem chamou, ou o resumo no pedido direto.

## Pare se

Nenhum caso próprio deste passo.
