---
{"resumo": "No autopilot o ELM fica bloqueado; a pergunta do ELM espera a pessoa retomar o item."}
---
## Entrada

O resultado do passo `pre-condicao`.

## Faça

No autopilot da `sa-desenvolver` (o `sa-desenvolvedor` como subagente na worktree `.sabia/local/wt/<id>`), o MCP
`elm` é negado e a `sa-elm` não roda: o resultado é "autopilot". Anote no resumo que o subagente devolve à
pessoa o que ficou do ELM ("criar o item", "finalizar a tarefa", "publicar"); a pergunta é feita quando a
pessoa retoma o item.

## Saída

Segue para o passo `escrita`.

## Pare se

- Nunca tente o ELM no autopilot, nem por outro caminho.
