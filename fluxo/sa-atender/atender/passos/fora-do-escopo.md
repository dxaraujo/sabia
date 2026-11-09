---
{"resumo": "Pedido que muda o código vira bug ou fatia pelo cadastro com 'origem <ID>'; categoria errada não se recategoriza: o item fica 'cancelada · virou <novo id>' e o certo nasce pelo cadastro."}
---
## Entrada

O que apareceu no passo `executar`: o pedido muda o código ou o comportamento do sistema, ou a categoria está
errada.

## Faça

1. **Muda o código ou o comportamento:** cadastre um bug ou uma fatia pelo cadastro comum (passo `cadastro`), com
   `origem <ID>` na `obs`. A triagem segue pela `sa-triar.triar`. O item de Sustentação
   pode seguir (ex.: responder ao cliente que virou `FT-nnn`).
2. **Categoria errada:** não se recategoriza. O item certo nasce pelo cadastro comum, com `origem <ID>` na `obs`, e
   este fica `cancelada` com `virou <novo id>` na `obs`, na mesma gravação.
3. Nos dois casos, o que já foi feito fica na Atividade.

## Saída

Item novo cadastrado. Categoria errada → o commit pelo commit direto na branch base (passo `commit-na-branch-base`), e o fluxo termina. O
item segue → passo `finalizar` quando a pessoa declarar resolvido.

## Pare se

—
