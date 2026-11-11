---
{"resumo": "Branch certa, árvore limpa, pull --ff-only da própria branch e o baseline do último pipeline da branch base."}
---
## Entrada

A branch `<id>` (ou a worktree do autopilot).

## Faça

1. Confira a branch `<id>` (no autopilot, a worktree), a árvore limpa e `git pull --ff-only` da própria branch.
2. **Baseline**: com CI declarado no `.sabia/sabia.md` (linha CI dos Comandos), o último pipeline da branch base, lido
   pelo MCP do CI; sem CI, a suíte local rodada antes de mexer (Comandos do `.sabia/sabia.md`).
   Teste vermelho herdado entra no baseline e não bloqueia. A regra é que nenhum teste verde fique vermelho.

## Saída

Branch pronta e baseline anotado → passo `retrabalho`.

## Pare se

- Árvore suja ou `pull --ff-only` falhou → avise e pare (nunca `stash`, `reset` nem rebase).
