---
{"resumo": "Lê o PR pelo gitlab_obter_mr, vai para a branch dele, grava fase em-revisao e incrementa a rodada de revisão do código."}
---
## Entrada

A `[REV]` assumida (passo `assumir`) e o link do PR no `status.md`.

## Faça

1. Leia o PR pelo `gitlab_obter_mr` (iid do link no `status.md`): `conflitos` → anote no relatório. Vá para a branch
   do PR (`git switch <branch>` com "sim"; aberta numa worktree → trabalhe nela, regra do passo
   `sa-desenvolver.desenvolver.chegou`) e `git pull --ff-only`.
2. `fase: em-revisao`; incremente "revisão do código" em Rodadas — a rodada é sua (retomando `em-revisao` sem o
   relatório desta rodada gravado, não incremente de novo).
3. PR atualizado com a `[REV]` já concluída (retrabalho pedido pela VER, conflito no merge) → o passo `assumir`
   a reabre (modo *assumir* com retrabalho): toda mudança no PR passa de novo pela revisão.

## Saída

Na branch do PR, `fase: em-revisao` e a rodada `<N>` → passo `rubrica`.

## Pare se

- PR `merged` ou `closed` → avise e pare.
- Árvore suja → avise e pare.
