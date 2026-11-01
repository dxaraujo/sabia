---
{"resumo": "Confere que quem está na sessão é o Dev Sênior da [APR], vai para a branch da fatia (fase aguardando-aprovacao-plano) e assume (ou reabre) a [APR]."}
---
## Entrada

A tarefa `[APR] FT-<nnn> Aprovar plano` e a fatia em `fase: aguardando-aprovacao-plano`.

## Faça

1. Quem está na sessão é Dev Sênior ativo (`senioridade` no `equipe.json` da base) **e** é o responsável pela `[APR]`
   (no EWM; sem o MCP `elm`, o `Responsável` do `status.md`)?
2. Branch da fatia (`git switch <branch>` com "sim"; aberta numa worktree → trabalhe
   nela, regra do passo `sa-desenvolver.desenvolver.chegou`) e `git pull --ff-only`; a fase tem
   de ser `aguardando-aprovacao-plano`.
3. `elm_transicao(<id da [APR]>, "assumir")`; já concluída (replanejar depois da aprovação) → antes,
   `elm_transicao(<id>, "reabrir")`, na mesma confirmação (sem o MCP `elm` → `ELM pendente [APR FT-<nnn> assumir]`
   no Histórico).

## Saída

A `[APR]` assumida, na branch da fatia → passo `ler`.

## Pare se

- Não é Dev Sênior ativo e responsável pela `[APR]` (item 1) → diga quem é e pare (trocar quem aprova é de
  quem implementa, no passo `sa-plano.plano.gate`).
- Árvore suja (item 2) → avise e pare.
- A fase não é `aguardando-aprovacao-plano` (item 2) → diga qual é e pare.
