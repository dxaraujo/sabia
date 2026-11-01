---
{"resumo": "Grava na base o épico iniciado e a linha da Especificação na sprint aberta (um commit) e assume a [ESP] no EWM."}
---
## Entrada

O épico e a `[ESP]` do passo `chegou`.

## Faça

1. **Situação na base** — a exceção ao "nada vai à base antes do GATE do PRD" (Regras): pelo bloco
   [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), o épico `iniciado` no `backlog.md` e a linha
   dele na seção Especificação do `sprint-<nn>.md` aberto com Situação `iniciada`; um commit, `EP-<nn> iniciar`.
   Épico não planejado → no backlog, `sprint` = a chave da sprint aberta, e a linha nasce agora (quem assume, Horas
   previstas `—`, `ESP <id>` — a que ficou no backlog do EWM — ou `pendente`, Observação `puxada`), nova mesmo se a
   sprint tem a dele com `saiu da sprint` (histórico, pela Linha viva); nenhuma sprint aberta (planejamento ainda não
   feito) → ofereça a `sa-planejamento` e não comece (nada na base nem no EWM). Já `iniciado` (retomada) → nada a
   gravar.
2. **EWM** — `elm_transicao(id, "assumir")`, com "sim" (já minha → `ja_estava`, nada a fazer; de outra pessoa →
   `conflito`: pergunte e repita com `forcar: true`). Épico não planejado → antes, no mesmo "sim", o IB do épico vai
   para a iteração da sprint, só com `iteracao`, e a `[ESP]` que ficou no backlog do EWM (passo `chegou`) move com ele:
   `elm_atualizar_wi([id], iteracao = a da sprint, dono = quem assume)`, com `estimativa_h` se faltar
   ([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md), topo e §3). Sem o MCP `elm` →
   `ELM pendente [<chave>]: assumir [ESP] EP-<nn>` no `rascunho.md` da pasta de trabalho.

## Saída

O épico `iniciado` na base e a `[ESP]` assumida (ou `ELM pendente`) → passo `pasta`.

## Pare se

Nenhuma sprint aberta (planejamento ainda não feito) → ofereça a `sa-planejamento` e não comece (nada na base nem no EWM).
