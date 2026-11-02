---
{"resumo": "Trava do papel antes do EWM (Dev Sênior ativo, não quem implementa) e a [REV] assumida pela regra comum de assumir."}
---
## Entrada

A tarefa `[REV] FT-nnn` (passo `entrada`), direto, pela pessoa do papel, ou pelo hub `sa-iniciar`. Como subagente
(a rodada de revisão do plano, do PRD ou do código no loop), sem a tarefa, o fluxo é o `sa-revisar.revisar`, sem
este passo: quem chamou é o dono da rodada.

## Faça

1. **Trava do papel**, antes de tocar no EWM: quem está na sessão tem de ser **Dev Sênior** ativo (`papeis` com
   `Dev` e `senioridade` `Sênior` no `equipe.json` da base) — a `[REV]` é sempre de um Dev Sênior — e não pode ser
   quem implementa a fatia (o `responsavel`), salvo o único Dev Sênior ativo (`revisor único` na Observação da fatia
   no `sprint-<nn>.md`).
2. **Assuma a `[REV]`** pela seção Assumir do passo `sa-revisar.hitl.entrada`, com "sim" (regras:
   [elm.md](~/.sabia/framework/skills/sabia/references/elm.md)). Já concluída (o PR mudou depois da aprovação:
   retrabalho pedido pela VER, conflito no merge) → reabrir, na mesma confirmação. Pendência sem o MCP `elm`: no
   Histórico do `status.md`.

## Saída

A `[REV]` assumida → passo `pr`.

## Pare se

- Não é Dev Sênior ativo → diga isso, quem são os Dev Sêniores ativos, e pare.
- É quem implementa a fatia, sem ser o único Dev Sênior ativo → diga quem pode revisar e pare.
- A regra comum de assumir parou (a `[REV]` é de outra pessoa; tarefa fechada sem o "sim") → a frase dela e pare.
