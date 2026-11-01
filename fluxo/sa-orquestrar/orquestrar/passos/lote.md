---
{"resumo": "Fronteira das fatias AFK planejadas, limite (paralelismo e WIP de revisão humana), uma confirmação para o lote, iniciada do lote na base com push conferido, EWM e log."}
---
## Entrada

As fatias pedidas, ou a sprint aberta.

## Faça

1. Candidatas: as fatias pedidas, ou as `planejada` + `AFK` da sprint aberta, em ordem de prioridade (empate: a mais
   acima na tabela) — sempre não iniciadas: **sem `status.md`** em nenhuma branch ou worktree. Fatia pedida fora da
   sprint aberta → a regra de puxar do passo `sa-desenvolver.desenvolver.compromisso` (Sprint): é a `elegivel` do topo e o WIP tem
   folga → entra no lote como **puxada** (a linha nasce na sprint com a `iniciada`, item 4); fura a fila → fica de
   fora até o encaixe (`sa-planejamento.durante.encaixe`).
2. Fica de fora (diga o motivo): HITL; `EP-nn`, PRD, fatiamento e os itens da Sustentação ("PRD, backlog e itens de
   Sustentação (`AT-`, `IM-`…) nunca são AFK"; a fatia de Manutenção, `FT-`, pode ser); Definition of Ready não
   atendida; `bloqueada-por` nem `pronta` nem `concluida` e não presente antes no lote; já iniciada (`iniciada` na
   base ou `status.md` numa branch); item pai sem dono no EWM (o `assumir` com `iniciar_pai` o exige — Dono do item pai, no passo
   `sa-desenvolver.desenvolver.compromisso`).
3. **Limite:** paralelismo do `sabia.md` (padrão 1, máximo 3) **e** vagas de WIP de revisão humana (limite
   dos acordos menos as fatias já esperando pessoa: `aguardando-aprovacao-plano`, `pr-aberto`, `em-revisao`,
   `em-verificacao`, `aceita`, `verificada`, `aguardando-aprovacao-pr`, pela regra A base prevalece do
   padrão `sa-desenvolver/status.md`). PR que ninguém vai
   revisar hoje não deve ser produzido hoje.
4. Proposta — **uma confirmação para o lote todo**:
   ```
   🤖 Loop AFK — <n> fatias · paralelo <p> · base <branch>
   | FT | Título | Branch | Worktree |
   |---|---|---|---|
   | FT-031 | Bloquear a conta após 3 tentativas | feature/ft-031-bloquear-conta | .sabia/local/wt/ft-031 |
   GATE do plano (senioridade de quem dispara): Sênior → sem GATE (plano do Sênior) · Pleno → quer a aprovação de
   um Dev Sênior nos planos deste lote? (sim: [APR] para <login> | não) — a escolha vale para o lote
   Aprovação dos PRs: [APR] Aprovar PR para <Dev Sênior> (sugestão: outro que não quem dispara; ele mesmo só se
   for o único Dev Sênior ativo)
   Plano com risco (regra sensível, muitos cenários, integração externa, mudança de dado) → a fatia para em
   bloqueada com a sugestão de troca para HITL, o P.O. é avisado e o loop segue com as outras
   Ao fim de cada fatia aprovada e verificada: push + PR? (sim/não)   — nunca merge; só se o sabia.md diz
   "perguntar a cada lote" (com "não — a pessoa abre", omita a linha: o loop para em `verificada`)
   Base: `iniciada` das <n> fatias no backlog e na sprint (puxadas: a linha nasce com `puxada`), num commit
   `<FT…> iniciar` e push na <base> (com "não — a pessoa abre": o push é seu, com o comando pronto)
   EWM: nas puxadas, antes, o IB e a [DEV] que já existe vão para a sprint, a que falta nasce e a [REV] e a [VER]
   de um planejamento HITL anterior são canceladas; assumir as [DEV]
   do lote (responsável: <login de quem dispara>) e colocá-las em andamento; criar cada
   [APR] quando a fatia chegar ao gate — no AFK não há [REV] nem [VER]: revisão e verificação são dos subagentes
   Confirma?
   ```
   Com "sim", primeiro a **`iniciada` do lote na base**, num commit só, pelo bloco
   [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), variante do Dev, sem trocar de branch: o
   checkout principal tem de estar já na base e limpo (outra sessão pode estar trabalhando nele) — não está → peça à
   pessoa que troque e pare antes das worktrees. Cada fatia como na `iniciada` na base do passo `sa-desenvolver.desenvolver.iniciar`
   (`responsavel` = quem dispara, se `—`; na puxada, Revisor e Verificador `—`). Commit com os ids do lote
   (`FT-031, FT-032 iniciar`); o "sim" do lote vale para ele e para o push, e as worktrees só nascem com o push
   conferido. Sem push no loop ("não — a pessoa abre"): entregue o comando pronto (`git push origin <base>`) e
   espere a publicação — `git fetch` mostra o commit em `origin/<base>` — antes das worktrees. Push que você tentou
   e o remoto recusou → o bloco desfaz o commit e para: refaça a fronteira (outra pessoa pode ter iniciado uma delas).
   Depois, com o MCP `elm`: fatia sem `[DEV]` na sprint (puxada, ou publicação que falhou) → antes do `assumir`, o IB
   sai do backlog do EWM para a iteração da sprint, só com `iteracao` (`pendente`, crie-o; id sem link, complete-o;
   pai sempre definido), e a `[DEV]` que já existe (a fatia saiu de uma sprint sem começar) move com quem dispara
   como `dono` e a estimativa dela; só nasce a que falta, conferida com `elm_listar_wi(pai = IB)`, sem contar a
   descartada nem a que tem pendência de cancelamento aberta ([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md),
   topo e §3–4). Das tarefas, só a `[DEV]`, AFK: a `[REV]` e a `[VER]` de um planejamento HITL anterior não movem →
   `elm_transicao(<id>, "cancelar")`; sem o MCP, com `precondicao` ou erro → `ELM pendente [<tipo> <id> cancelar]`
   no `status.md`. Depois `elm_transicao(<id>, "assumir", iniciar_pai: true)`
   em cada `[DEV]`; sem o MCP `elm` ou com falha → `ELM pendente [<chave>]: assumir a tarefa` no `status.md`
   de cada fatia. Essas pendências entram no Histórico do `status.md` de cada fatia quando ele nasce (passo `worktree`).
5. Log `.sabia/local/loop-<AAAA-MM-DD-HHMM>.md` (o padrão `sa-orquestrar/log.md`).

## Saída

Lote confirmado, `iniciada` publicada na base, EWM tratado (ou `ELM pendente`) e o log criado → passo `worktree`.

## Pare se

- Checkout principal fora da base ou sujo (item 4) → peça à pessoa que troque e pare antes das worktrees.
- Push do lote recusado pelo remoto (item 4) → o bloco desfaz o commit e para: refaça a fronteira.
- Sem push no loop: até a publicação aparecer em `origin/<base>` (item 4), nenhuma worktree.
