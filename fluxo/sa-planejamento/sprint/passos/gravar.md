---
{"resumo": "Com o ok: grava o sprint-<nn>.md e o backlog.md na base, publica sempre no EWM (§1–4 e §6) e sincroniza (§9)."}
---
## Entrada

A proposta com "ok" (passo `proposta`).

## Faça

"ok" → grave `sprints/<pai>/sprint-<nn>.md` (com `**Power sabia:**` = o `metadata.version` da `sa-planejamento`,
em `~/.sabia/framework/skills/sa-planejamento/SKILL.md`; as linhas
novas nascem `planejada`, e as da Sustentação, `aberto`) e, no `backlog.md`, `status` `planejada` (no épico da
`[ESP]`, `planejado`; a fatia `nova` com a `[ESP]` segue `nova`, com `obs` `em especificação`), `sprint`,
`responsavel` (o definido, ou `—`) e o `modo` final (sem responsável, o do backlog), pelo bloco
[Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), e **publique sempre no EWM** ([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §1–4 e §6), para a sprint e o EWM ficarem iguais — **também sem responsáveis**: os IBs com o P.O. como dono e todas as tarefas de cada item, sem dono onde não há responsável. Sem o MCP `elm` ou com
falha, a coluna "Tarefa ELM" fica `pendente` e é publicada depois. O `sprint-<nn>.md` gravado antes do §1 — sem o
MCP, com falha ou sessão parada antes da publicação; e o da próxima, no passo
`sa-planejamento.retrospectiva.recalcular` da virada — leva no cabeçalho
`**Publicação no EWM:** pendente`, que o §1 tira no commit da publicação. Publicada, **sincronize** (Sincronizar
com o EWM: `sa-planejamento.durante.sincronizar`): as tarefas por fora entram na sprint, e os itens que os arquivos já conhecem são comparados
(estado, iteração, dono, estimativa); o resultado é a tabela ou a linha
`🔄 <chave> × EWM: iguais — <n> itens conferidos`. Na virada, a publicação da próxima e a sincronização dela seguem
a ordem do §5 — o §1 da próxima antes do movimento, o §3–4 e o §6 das linhas novas depois dele e então o §9 dela
(Retrospectiva e virada: `sa-planejamento.retrospectiva.virada`).

## Saída

A sprint gravada, publicada e sincronizada (ou com `**Publicação no EWM:** pendente`): o fluxo termina.

## Pare se

Sem o "ok", nada é gravado nem publicado (regra de ouro).
