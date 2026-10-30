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
| Bloqueio | — (ou: `<motivo>` · pergunta: `<pergunta exata>` — junto com `Fase: bloqueada (de: <fase>)`) |
| ELM | <IB <id> (DF <id>, se o item da fatia é o defeito de origem) · DEV <id> · REV <id> · VER <id> (AFK: só DEV) · APR <id> (criadas nos gates) · CT <ids> (consolidação) \| sem ELM \| pendente> — os rótulos da coluna `elm` do backlog |
| Banco (DDL) | <não se aplica \| pendente \| aplicada em dev \| aplicada em prod> |
| Drift de negócio | — (marcado pela REV e pela VER: `não` \| `sim — <motivo>`) |

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
     AFK → HITL (nunca o contrário): plano com risco → bloqueada (de: planejando), "aguardando troca para HITL",
           [DEV] interrompida (horas lançadas, sem conclusão) → o P.O. troca na base (sa-planejamento: revisor e
           verificador na linha da sprint) → o Dev retoma pela sa-desenvolver: Modo HITL, ids da [REV] e da [VER],
           fase planejando → GATE pela senioridade → segue o HITL até pronta → concluida
     Conflito no merge (sa-desenvolver Passo 6) → retrabalho (de: aceita | aguardando-aprovacao-pr), com a linha
           `conflito no merge` no Histórico: a sa-codificar atualiza a branch e segue — HITL volta a pr-aberto, e
           o revisor e o verificador reabrem a [REV] e a [VER] concluídas (Passo 0 da sa-revisar e da
           sa-verificar); AFK volta a revisando (subagentes), e quem aprova reabre a [APR] Aprovar PR (sa-revisar,
           Aprovação do PR).
     Merge (sa-desenvolver Passo 6): HITL em aceita; AFK em aguardando-aprovacao-pr com a [APR] Aprovar PR
     concluída (a aprovação não grava fase: o sha não muda). Merge feito por fora do Sabiá → a sincronização da sprint
     (elm-sprint.md §9) também grava pronta, pela evidência do merge (Créditos e lições —).
     A base prevalece: pronta e concluida só existem no status.md da base (a pasta da fatia chega lá com o merge).
     O status.md de origin/<base> em pronta ou concluida vale sobre o da branch, que fica parado na fase do merge;
     e o da branch de fatia dividida ou cancelada no backlog.md da base não conta. Painel, WIP (sa-desenvolver,
     sa-loop) e roteamento (sa-iniciar, sa-desenvolver Passo 1) leem por esta regra.
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
     Dev, na base (sa-desenvolver Passo 6), ou a sincronização da sprint, pela evidência do merge por fora
     (elm-sprint.md §9), que também grava a fase do PR (ou implementando) no status.md da iniciada por fora, na
     branch; concluida, a consolidação, na base.
     Rodadas: incrementadas por quem pede a rodada — sa-plano (análise), sa-codificar (revisão e
     verificação) ou, no loop, o orquestrador.
     O revisor e o verificador não incrementam — exceto no HITL, em que eles mesmos conduzem a rodada sobre o PR.
     Drift de negócio: a REV (rubrica C: achado aceito ou decisão técnica que muda comportamento visível) e a VER
     (cenário ajustado na verificação) marcam; no AFK o subagente põe a linha no relatório e quem conduz grava aqui.
     Só passa de `não` para `sim`; outro `sim` acrescenta o motivo. A consolidação só lê (sim → nova versão do PRD
     ou da ficha antes de publicar).
     Retrabalho: incrementado por quem reprova (revisor ou verificador, HITL) ou, no AFK, pelo orquestrador ou pelo
     passo do workflow que registra a verificação REJEITADA. -->

## Achados abertos

<!-- Da revisão (plano/código), da verificação e do PR. A sa-codificar os transforma em tarefas [R<n>] e
     marca a Situação `resolvido — tarefa <n>` quando a tarefa fica verde. -->

| # | Origem | Achado | Situação |
|---|---|---|---|

## Retrabalho

<!-- HITL: uma linha por reprovação na REV ou na VER, gravada por quem reprovou; as horas, pelo codificador ao
     entregar o PR atualizado (a [DEV] segue aberta até o merge). AFK: uma linha por verificação REJEITADA (Papel `verificação (AFK)`), gravada pelo
     orquestrador ou pelo passo registrar_verificacao do workflow; e uma por mudanças pedidas na [APR] Aprovar PR
     (Papel `APR`), gravada por quem aprova; a [DEV] só é concluída no merge, Horas `—`. -->

| # | Papel | Motivo (relatório) | Data | Horas na [DEV] (retrabalho) |
|---|---|---|---|---|

## Lições candidatas

<!-- Gravadas pelo Dev responsável depois do merge, no status.md da base (sa-desenvolver Passo 6, item 6), antes
     de concluir a [DEV]: uma linha por correção humana que a fatia recebeu. Correção sem lição (ambiente,
     digitação) → `—` na causa; nenhuma correção → uma linha `nenhuma`. A sa-consolidar as leva para o licoes.md
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
