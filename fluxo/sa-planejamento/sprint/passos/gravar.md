---
{"resumo": "Com o ok: grava o sprint-<nn>.md e o backlog.md na base, publica sempre no EWM (§1–4 e §6) e sincroniza (§9)."}
---
## Entrada

A proposta com "ok" (passo `proposta`).

## Faça

**Chamado pelo `sa-planejamento.retrospectiva.recalcular` (virada):** grave o `sprint-<nn>.md` com
`**Publicação no EWM:** pendente` e o `backlog.md` (itens 1 e 2); não publique nem sincronize (é o passo
`sa-planejamento.retrospectiva.virada`, na ordem do §5) e volte a quem chamou.

"ok" →

1. **Arquivo:** grave `sprints/<pai>/sprint-<nn>.md`, com `**Power sabia:**` = o `metadata.version` da
   `sa-planejamento`, em `~/.sabia/framework/skills/sa-planejamento/SKILL.md`.
2. **`backlog.md`**, pelo bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base):
   em todas as linhas novas, `sprint` = a chave, `responsavel` (o definido, ou `—`) e, na fatia, o `modo` final (sem
   responsável, o do backlog); o `status`, pela tabela:

   | Linha nova | `status` no backlog | Situação na sprint |
   |---|---|---|
   | fatia em Fatias | `planejada` | `planejada` |
   | fatia `nova` como especificação | segue `nova`, `obs` `em especificação` | `planejada` (Especificação) |
   | épico `novo`/`elegivel` com a `[ESP]` | `planejado` | `planejada` |
   | Revisão (`[ESP] <id> Revisão <n>`) de épico ou fatia | não muda | `planejada`, Observação `revisão <n>: <motivo>` |
   | Sustentação | não muda (`aberto`) | `aberto` |

3. **Publique sempre no EWM** ([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §1–4 e §6),
   para a sprint e o EWM ficarem iguais — **também sem responsáveis**: os IBs com o P.O. como dono e todas as tarefas
   de cada item, sem dono onde não há responsável.
4. **Sem o MCP `elm` ou com falha:** a coluna "Tarefa ELM" fica `pendente` e é publicada depois. O `sprint-<nn>.md`
   gravado antes do §1 — sem o MCP, com falha ou sessão parada antes da publicação; e o da próxima, na virada —
   leva no cabeçalho `**Publicação no EWM:** pendente`, que o §1 tira no commit da publicação.
5. **Publicada, sincronize** (Sincronizar com o EWM: `sa-planejamento.durante.sincronizar`): as tarefas por fora
   entram na sprint, e os itens que os arquivos já conhecem são comparados (estado, iteração, dono, estimativa); o
   resultado é a tabela ou a linha `🔄 <chave> × EWM: iguais — <n> itens conferidos`.

## Saída

A sprint gravada, publicada e sincronizada (ou com `**Publicação no EWM:** pendente`): o fluxo termina; chamado pela
virada, volte ao passo `sa-planejamento.retrospectiva.recalcular`.

## Pare se

Sem o "ok", nada é gravado nem publicado (regra de ouro).
