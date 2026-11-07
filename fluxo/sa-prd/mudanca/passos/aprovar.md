---
{"resumo": "Como na aprovação do PRD: só quem tem produto; o sim volta a linha Aprovado ao topo, com o commit da versão."}
---
## Entrada

O `prd.md` mudado e o `equipe.json`.

## Faça

Igual ao `sa-prd.prd.aprovar`: só quem tem `produto` aprova. Sim → `**Aprovado:** <usuario> · <AAAA-MM-DD>` no topo; o
commit é o do passo `gravar` (`EP-nn aprovar PRD v<N>`). Ajuste → passo `editar`.

## Saída

Aprovado → passo `gravar`. Ajuste → passo `editar`.

## Pare se

- Sem a booleana `produto` → mostre quem tem `produto` no `equipe.json` e pare; o PRD fica sem aprovação, e a
  `sa-refinar.fatiar` não grava fatias novas até ela.
