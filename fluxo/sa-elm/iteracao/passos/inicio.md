---
{"resumo": "Entrada: pedido direto ou oferta da sa-planejamento.sprint; inclui as regras."}
---
## Entrada

Pedido direto ("criar a iteração no EWM") ou a oferta da `sa-planejamento.sprint` depois de gravar o
`sprint-<nn>.md`.

## Faça

Inclua as regras (`sa-elm.regras`).

## Saída

Configurado → passo `criar`. ELM não configurado → fim.

## Pare se

- Nunca: o ELM não configurado devolve a quem chamou, que segue.
