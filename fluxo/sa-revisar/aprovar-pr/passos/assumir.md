---
{"resumo": "Trava do papel antes do EWM (Dev Sênior ativo, não quem implementa), o PR lido e o sha anotado, e a [APR] assumida pela regra comum de assumir."}
---
## Entrada

A tarefa `[APR] FT-<nnn> Aprovar PR` e a fatia `Modo: AFK` em `fase: aguardando-aprovacao-pr`, na branch do PR
(passo `entrada`).

## Faça

1. **Trava do papel**, antes de tocar no EWM: quem está na sessão é **Dev Sênior** ativo (`senioridade` no
   `equipe.json` da base) e não é quem implementa a fatia (o `responsavel` da linha no `backlog.md` da base: no loop,
   quem disparou; o `Responsável` do `status.md` pode ser `agente:sa-orquestrador`): PR de um Sênior → outro Sênior
   aprova; ele mesmo só quando é o **único** Dev Sênior ativo. Sem o MCP `elm`, é também o aprovador registrado: o
   login da pendência `ELM pendente [APR FT-<nnn> criar]: <login>` no Histórico do `status.md`.
2. Leia o PR pelo `gitlab_obter_mr` (iid do link no `status.md`) e, na branch dele, `git pull --ff-only`. Anote o
   `sha` = `git rev-parse origin/<branch>` (o do PR).
3. **Assuma a `[APR]`** pela seção Assumir do passo `sa-revisar.aprovar-pr.entrada`. Já concluída (o PR mudou
   depois da aprovação: conflito no merge) → reabrir, na mesma confirmação.

## Saída

A `[APR]` assumida, na branch do PR, com o `sha` anotado → passo `ler`.

## Pare se

- Não é Dev Sênior ativo, é quem implementa sem ser o único Dev Sênior ativo, ou (sem o MCP) não é o aprovador
  registrado (item 1) → diga quem pode aprovar e pare.
- PR `closed` sem merge (item 2) → avise e pare (o mergeado é vizinho, no passo `entrada`).
- Árvore suja (item 2) → avise e pare.
- A regra comum de assumir parou (a `[APR]` é de outra pessoa; tarefa fechada sem o "sim") → a frase dela e pare.
