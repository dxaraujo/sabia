---
{"resumo": "HITL: revisão automática (rubrica C, subagente) antes do PR. AFK: revisão oficial pelo sa-revisor, até 2 rodadas."}
---
## Entrada

Todas as tarefas `[x]` e o passo `validar` verde (validação completa).

## Faça

**HITL — revisão automática (backpressure):** peça ao agente **`sa-revisor`** (subagente) a rubrica **C**
passando id, pasta, branch e "pré-PR" — relatório só na conversa, sem `revisao-codigo-<N>.md` e sem contar rodada.
`REVISAR` → corrija os achados (tarefas `[R<n>]`) e repita, até 2 vezes; persistindo, mostre à pessoa, que decide
seguir para o PR (os achados vão listados no texto do PR) ou corrigir antes. `APROVADO` → passo `pr`: a revisão
oficial (`[REV]`) e a verificação (`[VER]`) são das pessoas, sobre o PR. Sem subagente → siga para o passo `pr`.

**AFK:** `fase: revisando`; incremente "revisão do código" em Rodadas. Peça ao agente **`sa-revisor`** (subagente) a
rubrica **C** passando só: id da fatia, pasta, branch/worktree e rodada — **nunca** o seu raciocínio. Ele grava o
`revisao-codigo-<N>.md`.

Assim que o `revisao-codigo-<N>.md` estiver gravado, grave no campo **Drift de negócio** do `status.md` a
penúltima linha do relatório (só sobe de `não` para `possível alteração`; sobre um campo já decidido, com
`especificação:`, o decidido vai ao Histórico e o campo recomeça com a possível alteração nova, padrão
`sa-desenvolver/status.md`; `possível alteração — <motivo> · artefatos: <id|rótulo> (<tipo>)` é a indicação do
agente: quem decide se volta à especificação é a pessoa revisora no HITL, `sa-revisar.hitl`, ou o Dev
Sênior na `[APR] Aprovar PR`, no AFK) e **commite-o imediatamente com o `status.md`** (fase,
Rodadas, drift) antes de prosseguir — mensagem no padrão do `sabia.md`, `registrar revisão <N>`; não espere a próxima
sessão nem o passo `onde`. O PR cita esse arquivo e
ele precisa estar na branch antes da abertura.

- `VEREDITO: APROVADO` → passo `verificar`.
- `REVISAR` → os achados viram tarefas `[R<n>]` pela regra do passo `onde` (fim de `## Tasks`) e siga para o passo
  `tarefa`, que corrige **só** eles; depois, `validar` e `revisar`. Até 2 rodadas.

## Saída

HITL → passo `pr`. AFK, `APROVADO` → passo `verificar`; `REVISAR` → tarefas `[R<n>]` e passo `tarefa`.

## Pare se

- AFK sem subagente disponível (você é um agente sem essa ferramenta) → pare aqui e devolva a quem chamou:
  "aguardando revisão (rodada <N>)".
- 2ª reprovação → `fase: bloqueada (de: revisando)`; mostre à pessoa os relatórios e as opções: orientar a correção (zera as
  rodadas), voltar ao plano, ou aceitar explicitamente os achados restantes (quem e por quê no `status.md`).
