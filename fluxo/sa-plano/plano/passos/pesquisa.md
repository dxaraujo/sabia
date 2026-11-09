---
{"resumo": "Pede pistas, chama sa-pesquisar.pesquisar no sa-pesquisador e grava os fatos no research.md."}
---
## Entrada

A ficha, os artefatos afetados, o `elm/` e a trilha.

## Faça

1. Fora do autopilot, antes pergunte à pessoa se tem pistas de onde olhar (módulo, classe, tela, tabela).
2. Chame a `sa-pesquisar.pesquisar` no subagente `sa-pesquisador` com o escopo (ficha, artefatos afetados, `elm/`), as pistas e
   3 a 7 perguntas: pesquisa curta na rápida, factual na completo.
3. Grave os fatos no `research.md` pelo padrão `sa-plano/research.md`, como vieram, e faça commit.
4. Divergência entre documento e código: fora dos artefatos afetados → passo `captura` (`obs` `origem FT-nnn`); dentro dos artefatos afetados →
   Em aberto ao especificador, porque o texto aprovado pode precisar mudar.

## Saída

`research.md` gravado → passo `decisoes`.

## Pare se

- A pesquisa não achou o ponto de entrada do comportamento → mostre o Não encontrado e pergunte à pessoa; no
  autopilot, devolve.
