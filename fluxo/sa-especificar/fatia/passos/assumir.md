---
{"resumo": "Linha da fatia iniciada na seção Especificação da sprint (um commit; a concluida volta a iniciada na reabertura) e a [ESP] assumida pela regra comum de assumir."}
---
## Entrada

A `[ESP] FT-nnn` na sprint aberta (passo `entrada`): da fatia `nova`, ou da fatia que voltou à especificação.

## Faça

**Assumir:** a linha da fatia na seção Especificação do `sprint-<nn>.md` com Situação `iniciada` — a nova, ou a
`concluida` que volta a `iniciada` na reabertura — (bloco
[Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), commit `FT-<nnn> iniciar especificação`;
no `backlog.md` a fatia `nova` segue `nova`, e `responsavel` `—` vira quem assume; na reabertura, o backlog não muda)
e a `[ESP]` pela seção Assumir do passo `sa-especificar.fatia.entrada`, com "sim" (fechada → `reabrir`). Já
`iniciada` (retomada) → nada a gravar.

## Saída

A linha `iniciada` e a `[ESP]` assumida → passo `trabalho`.

## Pare se

- A regra comum de assumir parou (a `[ESP]` é de outra pessoa; tarefa fechada sem o "sim") → a frase dela e pare.
