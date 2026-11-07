---
{"resumo": "Branch certa, árvore limpa, pull --ff-only da própria branch e o baseline do último pipeline da base."}
---
## Entrada

A branch `<id>` (ou a worktree do autopilot).

## Faça

1. Confira a branch `<id>` (no autopilot, a worktree), a árvore limpa e `git pull --ff-only` da própria branch.
2. **Baseline**: o último pipeline da base; sem CI, a suíte local rodada antes de mexer (comandos do `AGENTS.md`).
   Teste vermelho herdado entra no baseline e não bloqueia. A regra é que nenhum teste verde fique vermelho.

## Saída

Branch pronta e baseline anotado → passo `retrabalho`.

## Pare se

- Árvore suja ou `pull --ff-only` falhou → avise e pare (nunca `stash`, `reset` nem rebase).
