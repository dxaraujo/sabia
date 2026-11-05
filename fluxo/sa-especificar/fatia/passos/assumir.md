---
{"resumo": "Linha da fatia iniciada na seção Especificação da sprint (um commit; a reaberta fora da branch já volta iniciada pela Volta à especificação, a achada na branch é gravada iniciada aqui; a Revisão nasce planejada) e a [ESP] assumida pela regra comum de assumir."}
---
## Entrada

A `[ESP] FT-nnn` na sprint aberta (passo `entrada`): da fatia `nova`, ou da fatia que voltou à especificação.

## Faça

**Assumir:** a linha da fatia na seção Especificação do `sprint-<nn>.md` com Situação `iniciada` e Responsável `—` →
quem assume — a nova (a `[ESP] FT-<nnn> Especificação` ou a `[ESP] FT-<nnn> Revisão <n>`, que nascem `planejada` pelo
planejamento ou pelo encaixe) — (bloco
[Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), commit `FT-<nnn> iniciar especificação`;
o `backlog.md` não muda: a fatia `nova` segue `nova`, e a `[ESP]` não toca o `responsavel` dela, que é de quem
implementa: quem especifica fica só na linha da sprint) e a `[ESP]` da Tarefa ELM da linha
pela seção Assumir do passo `sa-especificar.fatia.entrada`, com "sim" (fechada, concluída nesta sprint → `reabrir`; a
concluída numa sprint fechada não reabre: a linha é a da Revisão). Já `iniciada` (a retomada, ou a reaberta, que a
[Volta à especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação) grava `iniciada` com
a Observação `reaberta: <motivo>`) → nada a gravar na base; a `[ESP]` fechada reabre aqui. Linha `concluida` nesta
sprint com a fatia `iniciada` e o Bloqueio `aguardando especificação [ESP] FT-<nnn>: …`, sem o motivo dele na
Observação (achado na branch: a Volta não grava na base; [De quem é a Volta](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação)) → grave você a linha `iniciada` com a Observação `reaberta: <motivo>` (o motivo do Bloqueio do
`status.md` da fatia, `git show origin/<branch>:.kiro/specs/<ft>-<slug>/status.md`), commit
`FT-<nnn> reabrir especificação`; a `[ESP]` que quem achou já reabriu no EWM → nada; fechada → reabra aqui.
Fatia `iniciada` com o artefato do Bloqueio na seção Artefatos afetados e Especificado preenchido (a Volta achada na
branch) → a linha dele volta a Especificado `—`, no commit deste passo (sem nenhum, um
`FT-<nnn> reabrir especificação` só com ela): é ela que guia a `[ESP]` (passo `artefatos`).

## Saída

A linha `iniciada` e a `[ESP]` assumida → passo `trabalho`.

## Pare se

- A regra comum de assumir parou (a `[ESP]` é de outra pessoa; tarefa fechada sem o "sim") → a frase dela e pare.
