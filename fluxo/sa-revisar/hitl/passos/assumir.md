---
{"resumo": "Com a tarefa [REV]: confere que quem está na sessão é Dev Sênior ativo e não quem implementa, e assume (ou reabre) a [REV] no ELM."}
---
## Entrada

Chamada com a tarefa `[REV] FT-nnn` — direto, pela pessoa do papel, ou pelo hub `sa-iniciar`. Como subagente (a
rodada de revisão do plano, do PRD ou do código no loop), sem a tarefa, o fluxo é o `revisar`, sem este passo: quem
chamou é o dono da rodada.

## Faça

Antes de tudo, quem está na sessão tem de ser **Dev Sênior** ativo (`papeis` com `Dev` e `senioridade` `Sênior` no
`equipe.json` da base) — a `[REV]` é sempre de um Dev Sênior. Numa sessão com o
MCP `elm`: `elm_transicao(<id da [REV]>, "assumir")`, com "sim" (regras: [elm.md](~/.sabia/framework/skills/sabia/references/elm.md)); já
concluída (o PR mudou depois da aprovação: retrabalho pedido pela VER, conflito no merge) → antes,
`elm_transicao(<id>, "reabrir")`, na mesma confirmação. Sem o MCP `elm` → `ELM pendente [<chave>]: assumir [REV] FT-<nnn>` no Histórico do `status.md`, e siga.

## Saída

A `[REV]` assumida → passo `pr`.

## Pare se

- Não é Dev Sênior ativo → diga isso, quem são os Dev Sêniores ativos, e pare.
- É quem implementa a fatia (o `responsavel`) → só se for o único Dev Sênior ativo (`revisor único` na Observação da fatia no
  `sprint-<nn>.md`, que a puxada também tem); senão diga quem pode revisar e pare.
