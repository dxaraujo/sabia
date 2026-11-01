---
{"resumo": "Confere que quem está na sessão é o Dev Sênior da [APR], lê o PR, vai para a branch dele, anota o sha e assume (ou reabre) a [APR]."}
---
## Entrada

A tarefa `[APR] FT-<nnn> Aprovar PR` e a fatia `Modo: AFK` em `fase: aguardando-aprovacao-pr`.

## Faça

1. Quem está na sessão é **Dev Sênior** ativo (`senioridade` no `equipe.json` da base) e o responsável pela `[APR]`
   (sem o MCP `elm`, quem o Dev indicou)? PR de um Sênior (o `Responsável` da fatia) →
   outro Sênior aprova; ele mesmo só quando é o **único** Dev Sênior ativo.
2. Leia o PR pelo `gitlab_obter_mr` (iid do link no `status.md`). Vá para a
   branch do PR (`git switch <branch>` com "sim"; aberta numa worktree → trabalhe nela,
   regra do passo `sa-desenvolver.desenvolver.chegou`) e `git pull --ff-only`; a fase tem de
   ser `aguardando-aprovacao-pr`. Anote o `sha` = `git rev-parse origin/<branch>` (o do PR).
3. `elm_transicao(<id da [APR]>, "assumir")` — já concluída (o PR mudou depois da aprovação: conflito no merge) →
   antes, `elm_transicao(<id>, "reabrir")`, na mesma confirmação.

## Saída

A `[APR]` assumida, na branch do PR, com o `sha` anotado → passo `ler`.

## Pare se

- Não é o Dev Sênior ativo responsável pela `[APR]` (item 1) → diga quem é e pare.
- PR `merged` ou `closed` (item 2) → avise e pare.
- Árvore suja (item 2) → avise e pare.
