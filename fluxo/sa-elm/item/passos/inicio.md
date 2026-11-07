---
{"resumo": "Entrada: o sim de quem assume o trabalho, ou pedido direto; inclui as regras."}
---
## Entrada

O "sim" a "quer criar o item no ELM?" na skill que assume o trabalho: `sa-desenvolver.iniciar` (`DEV`),
`sa-atender.atender` (`ATD`), `sa-refinar.detalhar` ou `sa-prd.prd` ao começar a especificação (`ESP`). Ou um
pedido direto. Recebe o id do Sabiá e o trabalho (desenvolvimento · especificação · atendimento).

## Faça

Inclua as regras (`sa-elm.regras`). Sem o trabalho no pedido direto, pergunte qual é.

## Saída

Configurado → passo `ib` (ou o modo pedido). ELM não configurado ou autopilot → fim, e quem ofereceu segue.

## Pare se

- Nunca: o ELM não configurado devolve a quem chamou, que segue.
