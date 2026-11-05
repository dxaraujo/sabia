---
{"resumo": "Formato do status.md da fatia (passo iniciar da sa-desenvolver): campos, fases por modo, regra A base prevalece, Achados, Retrabalho, Lições, Créditos e Histórico."}
---
# FT-<nnn> — <título>

| Campo | Valor |
|---|---|
| Fatia | FT-<nnn> · <épico EP-nn — título \| Manutenção> |
| Origem | <PRD EP-nn \| ficha \| DF 4567 \| IB 611 \| pedido: …> |
| Trilha | <padrão \| rápida> (como na coluna `trilha` do backlog) |
| Modo | <AFK \| HITL> (o da fatia no `backlog.md`; vale para todos os papéis) |
| Cobre | <HF-01#1.1, HF-01#1.2, REG-01 \| —> |
| Branch | `<branch>` |
| Fase | pesquisando |
| Responsável | <login \| agente:sa-orquestrador> |
| Rodadas | revisão do plano 0 · revisão do código 0 · verificação 0 · retrabalho 0 |
| PR | — |
| Bloqueio | — (ou: `<motivo>` · pergunta: `<pergunta exata>` · ou `aguardando especificação [ESP] FT-<nnn>: <artefato> (<tipo>, <ação>) — <motivo>` — junto com `Fase: bloqueada (de: <fase>)`) |
| ELM | <IB <id> (DF <id>, se o item da fatia é o defeito de origem) · DEV <id> · REV <id> · VER <id> (AFK: só DEV) · APR <id> (criadas nos gates) · CT <ids> \| CT CSV <caminho> (consolidação, pela linha Casos de teste) \| sem ELM \| pendente> — os rótulos da coluna `elm` do backlog |
| Banco (DDL) | <não se aplica \| pendente \| aplicada em dev \| aplicada em prod> |
| Drift de negócio | — (indicado pela REV, pela VER ou pelo Dev, decidido pela pessoa: `não` \| `possível alteração — <motivo> · artefatos: <id\|rótulo> (<tipo>)` \| `… · especificação: [ESP] FT-<nnn>` \| `… · débito de especificação (<chave da sprint>)`) |

<!-- Fases por modo:
     HITL  pesquisando → planejando → [aguardando-aprovacao-plano: pela senioridade] → implementando → pr-aberto
           ([DEV] em andamento) → em-revisao ([REV] assumida; concluída ao aprovar) → em-verificacao ([VER]
           assumida; concluída ao aceitar) → aceita → pronta (merge pelo Dev, [DEV] concluída) → concluida
           (consolidação)
           reprovada na REV ou na VER → retrabalho (de: em-revisao | em-verificacao), com a [DEV] ainda aberta
           → implementando → pr-aberto (mesmo PR)
     AFK   pesquisando → planejando → [aguardando-aprovacao-plano: pela senioridade] → implementando → revisando
           → verificando → verificada → aguardando-aprovacao-pr (PR aberto; espera a [APR] Aprovar PR de um Dev
           Sênior) → pronta (merge pelo Dev, [DEV] concluída) → concluida (consolidação)
           mudanças pedidas na [APR] → retrabalho (de: aguardando-aprovacao-pr) → implementando → …
           → aguardando-aprovacao-pr
     Troca de modo: só pelo P.O. ou pelo SM (agente sa-produto, sa-planejamento fluxo troca-modo), na base; o Dev
           nunca troca. AFK com risco no plano → bloqueada (de: planejando), "aguardando troca de modo", [DEV]
           interrompida (horas lançadas, sem conclusão) → o P.O. ou o SM troca (AFK → HITL: revisor e verificador na
           linha da sprint; HITL → AFK, só antes do PR: a [REV] e a [VER] canceladas) → o Dev retoma pela sa-plano
           (passo gate): Modo e ids pela base, fase planejando → GATE pela senioridade → segue no modo novo
     Conflito no merge (sa-desenvolver, fluxo encerrar) → retrabalho (de: aceita | aguardando-aprovacao-pr), com a linha
           `conflito no merge` no Histórico: a sa-codificar atualiza a branch e segue — HITL volta a pr-aberto, e
           o revisor e o verificador reabrem a [REV] e a [VER] concluídas (passo assumir da sa-revisar e da
           sa-verificar); AFK volta a revisando (subagentes), e quem aprova reabre a [APR] Aprovar PR (sa-revisar,
           fluxo aprovar-pr).
     Merge (sa-desenvolver, fluxo encerrar): HITL em aceita; AFK em aguardando-aprovacao-pr com a [APR] Aprovar PR
     concluída (a aprovação não grava fase: o sha não muda). Merge feito por fora do Sabiá → a sincronização da sprint
     (elm-sprint.md §9) também grava pronta, pela evidência do merge (Créditos e lições —).
     A base prevalece: pronta e concluida só existem no status.md da base (a pasta da fatia chega lá com o merge).
     O status.md de origin/<base> em pronta ou concluida vale sobre o da branch, que fica parado na fase do merge;
     e o da branch de fatia dividida ou cancelada no backlog.md da base não conta. O Modo, o revisor e o
     verificador também: os do backlog.md e da linha da sprint na base valem sobre os do status.md (a troca de modo
     grava lá); quem retoma a fatia grava no status.md o Modo e os ids da [REV] e da [VER] (ou os tira, canceladas),
     num commit, antes de seguir. Painel, WIP (sa-desenvolver, sa-orquestrar) e roteamento (sa-iniciar, o passo de
     entrada dos fluxos) leem por esta regra.
     Entrega (todo papel do HITL): commit → push → conferir no remoto → só então concluir a tarefa e avisar.
     Desvio: `bloqueada (de: <fase>)`, com motivo e a pergunta exata; resolvido, a fatia volta à fase de origem.
     aguardando-aprovacao-plano = o plano espera a [APR] Aprovar plano de um Dev Sênior; durante a análise
     independente a fase é planejando. GATE pela senioridade de quem implementa: Júnior sempre, Pleno se pedir,
     Sênior nunca.
     WIP esperando pessoa = aguardando-aprovacao-plano + pr-aberto + em-revisao + em-verificacao + aceita
     + verificada + aguardando-aprovacao-pr.
     Quem grava a fase: quem conduz a sessão (a skill da fase) ou, no loop, o orquestrador; o pesquisador nunca
     grava o status.md; o revisor só no HITL (a rodada é dele); o verificador grava a fase do resultado também como
     subagente do AFK (`verificada` ou `implementando`, sa-verificar), e o resto, só no HITL; o Dev Sênior da [APR]
     na aprovação do plano e nas mudanças pedidas no PR (o PR aprovado não ganha commit: o sha não muda); pronta, o
     Dev, na base (sa-desenvolver, fluxo encerrar), ou a sincronização da sprint, pela evidência do merge por fora
     (elm-sprint.md §9), que também grava a fase do PR (ou implementando) no status.md da iniciada por fora, na
     branch; concluida, a consolidação, na base.
     Rodadas: incrementadas por quem pede a rodada — sa-plano (análise), sa-codificar (revisão e
     verificação) ou, no loop, o orquestrador.
     O revisor e o verificador não incrementam — exceto no HITL, em que eles mesmos conduzem a rodada sobre o PR.
     Drift de negócio: a possível alteração é a indicação de que o código mudou ou diverge de um artefato — da REV
     (rubrica C: achado aceito ou decisão técnica que muda comportamento visível), da VER (comportamento entregue
     diverge do artefato aprovado; no AFK, os cenários `🔁 possível alteração`) ou do próprio Dev na codificação:
     `possível alteração — <motivo> · artefatos: <id|rótulo> (<tipo>)`; no AFK o subagente põe a linha no relatório
     e quem conduz grava aqui. A pessoa revisora ou verificadora decide (no AFK, o Dev Sênior na [APR]): volta →
     acrescenta ` · especificação: [ESP] FT-<nnn>` e roda a Volta à especificação (backlog.md); código errado → o
     motivo vira achado (retrabalho do Dev), o campo fica `não` e o Histórico recebe `drift descartado: código errado
     (<login>)`. Outra possível alteração acrescenta o motivo; sobre um campo já decidido (com `especificação:`), o
     decidido vai ao Histórico (`drift <motivo> · especificação: [ESP] FT-<nnn>`) e o campo recomeça com a possível
     alteração nova, sem `especificação:`, para a pessoa decidir de novo. O merge só sai sem possível alteração
     pendente (decidida como código errado, ou com a [ESP] concluída). Depois do merge não há volta: a consolidação
     registra a divergência como débito de especificação (` · débito de especificação (<chave da sprint>)`).
     Retrabalho: incrementado por quem reprova (revisor ou verificador, HITL) ou, no AFK, pelo orquestrador ou, sem o loop,
     pelo desenvolvedor no passo `sa-codificar.codificar.verificar` que registra a verificação REJEITADA. -->

## Achados abertos

<!-- Da revisão (plano/código), da verificação e do PR. A sa-codificar os transforma em tarefas [R<n>] e
     marca a Situação `resolvido — tarefa <n>` quando a tarefa fica verde. -->

| # | Origem | Achado | Situação |
|---|---|---|---|

## Retrabalho

<!-- HITL: uma linha por reprovação na REV ou na VER, gravada por quem reprovou; as horas, pelo desenvolvedor ao
     entregar o PR atualizado (a [DEV] segue aberta até o merge). AFK: uma linha por verificação REJEITADA (Papel `verificação (AFK)`), gravada pelo
     orquestrador ou, sem o loop, pelo desenvolvedor (passo `sa-codificar.codificar.verificar`); e uma por mudanças pedidas na [APR] Aprovar PR
     (Papel `APR`), gravada por quem aprova; a [DEV] só é concluída no merge, Horas `—`. -->

| # | Papel | Motivo (relatório) | Data | Horas na [DEV] (retrabalho) |
|---|---|---|---|---|

## Lições candidatas

<!-- A revisão, a verificação e a aprovação acrescentam as suas na branch, no commit delas; o Dev responsável, depois
     do merge, no status.md da base (sa-desenvolver, fluxo encerrar, item 6), antes de concluir a [DEV], mantém
     essas, acrescenta a que o aprovador entregou (AFK) e uma linha por outra correção humana. Correção sem lição
     (ambiente, digitação) → `—` na causa; seção vazia e nenhuma correção → uma linha `nenhuma`. A sa-consolidar as leva para o licoes.md
     (sa-aprender) e grava o L-nnn. -->

| # | Correção (origem) | Feito × certo | Onde estava o certo | Causa proposta | L-nnn |
|---|---|---|---|---|---|

## Créditos

<!-- Créditos do Kiro, uma linha por sessão, gravada por quem fecha a sessão (o mesmo que lança as horas, com ou sem
     ELM), na máquina dele — o Kiro só guarda o consumo localmente. Como: sa-status, Fechar a sessão, item
     Créditos (script creditos.py). Data = o `ate` do script (o --desde do próximo fechamento) · Power sabia = o
     metadata.version da skill · sessão do loop com várias fatias → `<id> (rateio 1/<n>)` · sem sessão do Kiro →
     `informado` (o número que a pessoa leu). Depois do merge, a linha vai no status.md da base. A sa-consolidar
     soma a seção na sprint; a virada a copia para o backlog.md. -->

| Data | Papel | Login | Sessão Kiro | Power sabia | Créditos |
|---|---|---|---|---|---|

## Histórico

<!-- Só acréscimo, sempre no fim. É o arquivo de progresso: quem retoma a fatia (pessoa, agente, sessão nova)
     começa por aqui. Pendências de ELM: "ELM pendente [<chave>]: <ação>" → depois "ELM feito [<chave>]: <ação>". -->

- <AAAA-MM-DD HH:MM> — fatia iniciada (sa-desenvolver) · trilha <…> · modo <…>
