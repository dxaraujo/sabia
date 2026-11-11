---
{"resumo": "Detecta a branch base, confere que ela aceita push e mostra o padrão de commit."}
---
## Entrada

O repositório.

## Faça

1. **Base:** `git symbolic-ref refs/remotes/origin/HEAD`, as remotas `develop`, `desenvolvimento`, `dev`, `main`,
   `master` e o destino dos últimos merges (`git log --merges -30 --format=%s`). Sinais divergentes → pergunte, com
   os candidatos.
2. **Push na branch base:** o estado e os documentos de planejamento vão direto nela (`fluxo/commit-na-branch-base.md`). Base
   protegida contra o push de quem trabalha → avise e peça outra branch base.
3. **Prefixo da branch** (`prefixo_branch` do `agentes.json`): das branches remotas; a branch de trabalho é
   `<prefixo><id>-<slug>`.
4. **Padrão de commit:** o que aparece no `git log`. O id do WI só entra no commit se o `acordos.json` pedir
   (`id_no_commit: true`).

## Saída

Base, prefixo e padrão com o "ok" → passo `gitlab`.

## Pare se

- A branch base não aceita push e a pessoa não indica outra.
