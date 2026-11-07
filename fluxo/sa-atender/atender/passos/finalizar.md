---
{"resumo": "A pessoa declara resolvido: Resposta e Horas no registro, concluida e concluida_em no backlog (ou cancelada com o motivo); avisa a fatia de origem; oferece finalizar a tarefa no ELM."}
---
## Entrada

"resolvido", "conclui o `<ID>`" ou "o pedido foi retirado", dito pela pessoa que atende.

## Faça

1. Quem declara resolvido é a pessoa, nunca a IA. Não há confirmação do solicitante.
2. No registro: a Resposta enviada (sem dado de cliente) e, se a pessoa informar, a linha Data | Horas.
3. No `backlog.md`: status `concluida` e `concluida_em` = hoje. Pedido retirado: status `cancelada` com
   `motivo: <texto>` na `obs`.
4. O commit sai no passo `desdobramentos`.
5. Item com `origem FT-nnn` (ex.: a DDL de uma fatia) → avise que a `FT-nnn` pode seguir; quem desenvolve tira o
   `<ID>` do Em aberto do `status.md` dela.
6. Com ELM configurado: "finalizar a tarefa no ELM?" → `sa-elm.finalizar`, que oferece as horas. Qualquer resposta
   segue.

## Saída

Registro e backlog prontos, sem commit ainda → passo `desdobramentos`.

## Pare se

—
