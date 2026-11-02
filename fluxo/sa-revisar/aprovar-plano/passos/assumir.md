---
{"resumo": "Trava do papel antes do EWM (Dev Sênior ativo, não quem implementa), a branch atualizada e a [APR] assumida pela regra comum de assumir."}
---
## Entrada

A tarefa `[APR] FT-<nnn> Aprovar plano` e a fatia em `fase: aguardando-aprovacao-plano`, na branch da fatia (passo
`entrada`).

## Faça

1. **Trava do papel**, antes de tocar no EWM: quem está na sessão é Dev Sênior ativo (`senioridade` no
   `equipe.json` da base) e não é quem implementa a fatia (o `responsavel`), salvo o único Dev Sênior ativo. Sem o MCP
   `elm`, é também o aprovador registrado: o `Responsável` do `status.md` (em `aguardando-aprovacao-plano`, quem
   aprova).
2. `git pull --ff-only` na branch da fatia.
3. **Assuma a `[APR]`** pela seção Assumir do passo `sa-revisar.aprovar-plano.entrada`. Já concluída (replanejar
   depois da aprovação) → reabrir, na mesma confirmação. Pendência sem o MCP `elm`: no Histórico do `status.md`.

## Saída

A `[APR]` assumida, na branch da fatia → passo `ler`.

## Pare se

- Não é Dev Sênior ativo, é quem implementa sem ser o único Dev Sênior ativo, ou (sem o MCP) não é o aprovador
  registrado (item 1) → diga quem pode aprovar e pare.
- Árvore suja (item 2) → avise e pare.
- A regra comum de assumir parou (a `[APR]` é de outra pessoa; tarefa fechada sem o "sim") → a frase dela e pare.
