---
{"resumo": "Passa a decidida, no decisoes.md, os D-nn que a ATA reservou e no rascunho.md o que ficou em aberto; com o PRD já aprovado, a decisão que o muda segue a mudança (antes do fatiamento, pela regra da tarefa de especificação) ou, depois dele, a [ESP] FT da fatia ou a triagem."}
---
## Entrada

A ATA aprovada (passo `publicar`) e o `decisoes.md` da pasta do épico.

## Faça

1. **Decisões** — cada linha que a ATA reservou no `decisoes.md` (padrão `sa-entrevistar/decisoes.md`,
   `em aberto — ATA-<nn> draft`) passa a: Decisão, Fonte / quem decidiu = `<nome> (<papel>) · ATA-<nn> [mm:ss]`,
   Situação `decidida` (a que revisa outra, `decidida — substitui D-nn`). O que ficou em aberto → `D-nn` novo
   `em aberto` e as dúvidas da próxima reunião no `rascunho.md`, com a data.
2. **Pasta na base** (a linha do épico no `backlog.md` já tem o link `prd`) → a ATA e o `decisoes.md` num
   commit `EP-<nn> registrar ATA-<nn>`, pelo bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base).
   Senão, tudo fica na pasta de trabalho e vai à `[ESP]` no passo `sa-especificar.especificar.fechar-sessao`.
3. **PRD já aprovado** (Fase `aprovado` ou `fatiado` no `status.md` do épico na base): decisão que muda o que o PRD diz →
   antes do fatiamento (`aprovado`), `sa-prd.mudanca`, pela tabela da
   [Volta à especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação) (a `[ESP]`
   aberta é esta); depois (`fatiado`) o PRD não muda (o
   DOORS Next é a fonte): alteração de artefato que uma fatia não terminal cobre → a `[ESP] FT` dela,
   `sa-especificar.fatia` (a [Volta à especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação); fatia iniciada: item Pedido de fora da fatia);
   escopo novo, ou a fatia já terminal → épico ou fatia pela `sa-triar.triar` (`origem EP-<nn> ATA-<nn>`). Decisão
   que não muda o PRD → só o registro do item 1.

## Saída

Os `D-nn` gravados → outra transcrição sem ATA aprovada, passo `transcricao`; senão, volte a quem chamou com os
`D-nn` novos (a entrevista os põe na árvore). PRD já aprovado com decisão que o muda → a saída do item 3.

## Pare se

- Decisão que muda o PRD aprovado ou fatiado (item 3) → diga a próxima e pare.
