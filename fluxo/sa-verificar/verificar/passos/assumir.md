---
{"resumo": "Só com a tarefa [VER] (HITL): trava do papel antes do EWM (não quem implementa), a branch atualizada e a [VER] assumida pela regra comum de assumir; como subagente, sem a tarefa, pula."}
---
## Entrada

Chamada com a tarefa `[VER] FT-nnn` (só existe no HITL) — direto, pela pessoa do papel, ou pelo hub `sa-iniciar`, com
`fase: em-verificacao`, na branch do PR (passo `entrada`).
Chamada como subagente por outra skill (a rodada de verificação do loop ou da implementação), sem a tarefa → pule este passo: quem chamou é o dono da
rodada.

## Faça

1. **Trava do papel**, antes de tocar no EWM: quem está na sessão **não pode ser quem implementa** a fatia (o
   `responsavel` do `backlog.md` ou o `Responsável` do `status.md`) — sem exceção, nem com "sim".
2. `git pull --ff-only` na branch do PR.
3. **Assuma a `[VER]`** pela seção Assumir do passo `sa-verificar.verificar.entrada`, com "sim" (regras:
   [elm.md](~/.sabia/framework/skills/sabia/references/elm.md)). Já concluída (o PR mudou depois do aceite: conflito
   no merge) → reabrir, na mesma confirmação. Pendência sem o MCP `elm`: no Histórico do `status.md`.

## Saída

A `[VER]` assumida (ou o passo pulado, como subagente) → passo `roteiro`.

## Pare se

- Quem está na sessão é quem implementa → diga isso, quem é o verificador da fatia (coluna Verificador no
  `sprint-<nn>.md`) e pare, sem assumir a `[VER]`.
- Árvore suja ou `git pull --ff-only` recusado (item 2) → avise e pare (nunca `reset`, `stash` ou rebase).
- A regra comum de assumir parou (a `[VER]` é de outra pessoa; tarefa fechada sem o "sim") → a frase dela e pare.
