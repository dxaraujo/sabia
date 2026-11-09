---
{"resumo": "Lista as fatias do épico que citam os requisitos mudados e leva a mudança a cada uma pelo status: ajuste, aviso ao responsável ou cadastro."}
---
## Entrada

Os requisitos mudados (ids) e as linhas do `backlog.md` com pai = `EP-nn`.

## Faça

Para cada fatia do épico cujos artefatos afetados ou cenários citam um requisito mudado:

- **`nova`, `aceita` ou `elegivel`** → ofereça a `sa-refinar.ajustar` (atualizar ficha e artefatos afetados, dividir, juntar ou
  cancelar).
- **`em-andamento`** → avise o responsável (coluna responsável do `backlog.md`); com ELM, o texto do `elm/` volta ao
  especificador pela `sa-especificar.elm`.
- **`concluida`** → o que muda vira item novo pelo cadastro comum (passo `cadastrar`): tipo fatia, pai `EP-nn`, obs
  `veio de EP-nn v<N>`.

## Saída

Alguma fatia `concluida` atingida → passo `cadastrar`. Nenhuma → passo `devolver`.

## Pare se

Nenhum caso próprio deste passo.
