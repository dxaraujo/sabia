---
{"resumo": "Erros do MCP elm: corrigir uma vez, perguntar, ou dizer e devolver."}
---
## Entrada

Um erro do MCP `elm` (`{"ok": false, "erro": {"codigo", "detalhe", "campo"}}`).

## Faça

- `entrada` → corrija pelo schema da tool e tente mais uma vez.
- `nao_encontrado` → mostre o id e pergunte qual é; nunca troque de id por conta própria.
- `credencial` → peça que a pessoa confira as variáveis `ELM_SERVER`, `ELM_USER` e `ELM_PASSWORD` do MCP.
- `indisponivel` → tente mais uma vez; falhou de novo → diga e devolva.
- `config` → o campo do `pa` que falta e a oferta da `sa-elm.setup`.
- `permissao` ou `precondicao` → mostre o atributo ou o campo e pergunte o valor; nunca chute.
Os demais códigos: [mcp.md](~/.sabia/framework/skills/sa-elm/references/mcp.md).

## Saída

Segue para o passo `volta`.

## Pare se

- Erro que persiste → diga o que não foi feito e devolva; quem ofereceu segue.
