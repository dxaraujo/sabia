---
{"resumo": "Entrada: modo bundle (oferta ou pedido) ou modo artefato (sa-especificar.elm); inclui as regras."}
---
## Entrada

Modo bundle: a oferta da `sa-elm.setup`, da `sa-elm.publicar` ou da skill que busca o vigente e não acha bundle
(ou acha um desatualizado, pelo critério da `sa-elm.regras`), ou pedido direto. Modo artefato:
a `sa-especificar.elm`, com a fatia e o id do requisito.

## Faça

Inclua as regras (`sa-elm.regras`).

## Saída

Configurado → passo `pre-condicao`. ELM não configurado → fim.

## Pare se

- Nunca: o ELM não configurado devolve a quem chamou, que segue.
