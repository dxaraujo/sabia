---
{"resumo": "Lê o PR pelo gitlab_obter_mr, atualiza a branch dele, grava fase em-revisao e incrementa a rodada de revisão do código."}
---
## Entrada

A `[REV]` assumida (passo `assumir`), na branch do PR (passo `entrada`), e o link do PR no `status.md`.

## Faça

1. Leia o PR pelo `gitlab_obter_mr` (iid do link no `status.md`): `conflitos` → guarde e escreva no Resumo do
   `revisao-codigo-<N>.md` (passo `rubrica`). Sem o MCP `gitlabpr` → pergunte à pessoa o estado do PR (aberto,
   mergeado ou closed) e se há conflito, e siga com a resposta. Na branch do PR, `git pull --ff-only`.
2. `fase: em-revisao`; incremente "revisão do código" em Rodadas — a rodada é sua (retomando `em-revisao` sem o
   relatório desta rodada gravado, não incremente de novo).

## Saída

Na branch do PR, `fase: em-revisao` e a rodada `<N>` → passo `rubrica`.

## Pare se

- PR `closed` sem merge → avise e pare (o mergeado é vizinho, no passo `entrada`).
- Árvore suja → avise e pare.
