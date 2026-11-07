---
{"resumo": "Entrada: depois do merge, do archive ou de pedido direto; só quem tem especificador publica."}
---
## Entrada

O "sim" a "publicar no DOORS?" na `sa-especificar.archive`, sempre depois do merge, ou um pedido direto. No
pedido direto, liste as fatias com `Publicação: pendente` no `status.md` (o arquivado, no OpenSpec; o de
`.kiro/specs/`, no Kiro) e pergunte qual.

## Faça

1. Inclua as regras (`sa-elm.regras`). Sem ELM, não há o que publicar: devolva.
2. Só publica quem tem a booleana `especificador` no `equipe.json`. Sem ela → diga quem tem e devolva (o
   archive já gravou `pendente`).

## Saída

Especificador, com ELM → passo `fonte`. Sem ELM ou sem a booleana → fim.

## Pare se

- Nunca: o ELM não configurado devolve a quem chamou, que segue.
