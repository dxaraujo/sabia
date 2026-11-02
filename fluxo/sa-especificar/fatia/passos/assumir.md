---
{"resumo": "Linha da fatia iniciada na seção Especificação da sprint (um commit) e a [ESP] assumida pela regra comum de assumir."}
---
## Entrada

A `[ESP] FT-nnn` de uma fatia `nova` na sprint aberta (passo `entrada`).

## Faça

**Assumir:** a linha da fatia na seção Especificação do `sprint-<nn>.md` com Situação `iniciada` (bloco
[Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), commit `FT-<nnn> iniciar especificação`; no
`backlog.md` a fatia segue `nova`, e `responsavel` `—` vira quem assume) e a `[ESP]` pela seção Assumir do passo
`sa-especificar.fatia.entrada`, com "sim". Já `iniciada` (retomada) → nada a gravar.

## Saída

A linha `iniciada` e a `[ESP]` assumida → passo `trabalho`.

## Pare se

- A regra comum de assumir parou (a `[ESP]` é de outra pessoa; tarefa fechada sem o "sim") → a frase dela e pare.
