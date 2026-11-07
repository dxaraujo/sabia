---
{"resumo": "Entrada: 'confere com o EWM' (tarefas) ou 'o DOORS mudou?' (artefatos); inclui as regras."}
---
## Entrada

Pedido direto: "confere com o EWM" (modo tarefas) ou "o DOORS mudou?" (modo artefatos). A
`sa-especificar.elm` também chama o modo artefatos, com a fatia.

## Faça

Inclua as regras (`sa-elm.regras`). Modo artefatos sem a fatia → pergunte qual.

## Saída

Modo tarefas → passo `tarefas`. Modo artefatos → passo `artefatos`. ELM não configurado → fim.

## Pare se

- Nunca: o ELM não configurado devolve a quem chamou, que segue.
