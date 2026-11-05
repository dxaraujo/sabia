---
{"resumo": "HITL: revisão automática (rubrica C, subagente) antes do PR. AFK: revisão oficial pelo sa-revisor, com teto de 2 reprovações desde o último desbloqueio."}
---
## Entrada

Todas as tarefas `[x]` e o passo `validar` verde (validação completa).

## Faça

**HITL — revisão automática (backpressure):** peça ao agente **`sa-revisor`** (subagente) a rubrica **C**
passando id, pasta, branch e "pré-PR" — relatório só na conversa, sem `revisao-codigo-<N>.md` e sem contar rodada.
`REVISAR` → corrija os achados (tarefas `[R<n>]`) e repita; na 2ª reprovação seguida, mostre à pessoa, que decide
seguir para o PR (os achados vão listados no texto do PR) ou corrigir antes. `APROVADO` → passo `pr`: a revisão
oficial (`[REV]`) e a verificação (`[VER]`) são das pessoas, sobre o PR. `AMBIENTE` (o C3 não rodou) → mostre à
pessoa o que falhou (o ambiente não é da fatia), e ela decide seguir para o PR ou esperar o ambiente.

**AFK:** `fase: revisando`; incremente "revisão do código" em Rodadas. Peça ao agente **`sa-revisor`** (subagente) a
rubrica **C** passando só: id da fatia, pasta, branch/worktree e rodada — **nunca** o seu raciocínio. Ele grava o
`revisao-codigo-<N>.md`.

Assim que o `revisao-codigo-<N>.md` estiver gravado, grave no campo **Drift de negócio** do `status.md` a
penúltima linha do relatório (só sobe de `não` para `possível alteração`; sobre um campo já decidido, com
`especificação:`, o decidido vai ao Histórico e o campo recomeça com a possível alteração nova, padrão
`sa-desenvolver/status.md`; `possível alteração — <motivo> · artefatos: <id|rótulo> (<tipo>)` é a indicação do
agente: quem decide se volta à especificação é a pessoa revisora no HITL, `sa-revisar.hitl`, ou o Dev
Sênior na `[APR] Aprovar PR`, no AFK) e **commite-o imediatamente com o `status.md`** (fase,
Rodadas, drift) antes de prosseguir — mensagem no padrão do `sabia.md`, `<FT> registrar revisão <N>`; não espere a próxima
sessão nem o passo `onde`. O PR cita esse arquivo e
ele precisa estar na branch antes da abertura.

- `VEREDITO: APROVADO` → passo `verificar`.
- `REVISAR` → os achados viram tarefas `[R<n>]` pela regra do passo `onde` (fim de `## Tasks`) e siga para o passo
  `tarefa`, que corrige **só** eles; depois, `validar` e `revisar`. Teto: 2 reprovações (`VEREDITO: REVISAR`) desde
  o último desbloqueio, contadas pelos `revisao-codigo-<N>.md`; a revisão depois de uma rejeição na verificação conta
  igual.
- `VEREDITO: AMBIENTE` (o C3 não rodou por ambiente) → `fase: bloqueada (de: revisando)`, Bloqueio `⚠️ ambiente: <o
  que faltou>`, commit com o relatório; não conta como reprovação.

## Saída

HITL → passo `pr`. AFK, `APROVADO` → passo `verificar`; `REVISAR` → tarefas `[R<n>]` e passo `tarefa`;
`AMBIENTE` → `bloqueada`.

## Pare se

- 2ª reprovação desde o último desbloqueio → `fase: bloqueada (de: revisando)`; mostre à pessoa os relatórios e as
  opções: orientar a correção (o desbloqueio recomeça a contagem de reprovações; o campo Rodadas não muda), voltar
  ao plano, ou aceitar explicitamente os achados restantes (quem e por quê no `status.md`).
- `VEREDITO: AMBIENTE` → `bloqueada` com o `⚠️ ambiente`, e pare.
