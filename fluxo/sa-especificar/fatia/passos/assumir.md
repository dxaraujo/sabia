---
{"resumo": "Linha da fatia iniciada na seção Especificação da sprint (um commit) e a [ESP] assumida no EWM."}
---
## Entrada

A `[ESP] FT-nnn` de uma fatia `nova` na sprint aberta.

## Faça

**Assumir:** a linha da fatia na seção Especificação do `sprint-<nn>.md` com Situação `iniciada` (bloco
[Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), commit `FT-<nnn> iniciar especificação`; no
`backlog.md` a fatia segue `nova`, e `responsavel` `—` vira quem assume) e `elm_transicao(id, "assumir")`, com
"sim", como no passo `sa-especificar.especificar.assumir`.

## Saída

A linha `iniciada` e a `[ESP]` assumida → passo `trabalho`.

## Pare se

Os mesmos casos do passo `sa-especificar.especificar.assumir`.
