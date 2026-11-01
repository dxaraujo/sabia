---
{"resumo": "Só com a tarefa [VER] (HITL): confere que quem está na sessão não implementa a fatia e assume (ou reabre) a [VER] no ELM; como subagente, sem a tarefa, pula."}
---
## Entrada

Chamada com a tarefa `[VER] FT-nnn` (só existe no HITL) — direto, pela pessoa do papel, ou pelo hub `sa-iniciar`, com
`fase: em-verificacao`.
Chamada como subagente por outra skill (a rodada de verificação do loop ou da implementação), sem a tarefa → pule este passo: quem chamou é o dono da
rodada.

## Faça

Antes de tudo, quem está na sessão **não pode ser quem implementa** a fatia (o `responsavel` do `backlog.md` ou o
`Responsável` do `status.md`) — sem exceção, nem com "sim". Numa sessão com o
MCP `elm`: `elm_transicao(<id da [VER]>, "assumir")`, com "sim" (regras: [elm.md](~/.sabia/framework/skills/sabia/references/elm.md)); já
concluída (o PR mudou depois do aceite: conflito no merge) → antes, `elm_transicao(<id>, "reabrir")`, na mesma
confirmação. Sem o MCP `elm` → `ELM pendente [<chave>]: assumir [VER] FT-<nnn>` no Histórico do `status.md`, e siga.

## Saída

A `[VER]` assumida (ou o passo pulado, como subagente) → passo `roteiro`.

## Pare se

- HITL sem `fase: em-verificacao` (fora a retomada de uma verificação interrompida) → diga que a `[VER]` espera a
  revisão e pare, sem assumir a `[VER]`.
- Quem está na sessão é quem implementa → diga isso, quem é o verificador da fatia (coluna Verificador no
  `sprint-<nn>.md`, que a puxada também tem) e pare, sem assumir a `[VER]`.
