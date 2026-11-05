---
name: sa-status
description: "Sabiá flow dashboard, read-only — where I left off and what to do now: slices (fatias) in progress (on this branch, in the worktrees and on remote branches; after the merge, the base branch is what counts) with phase, track, AFK/HITL mode, tasks.md progress, open findings and PR; human review WIP against the team agreement; current sprint and goal, with specification and Sustentação (reserved × consumed); slices eligible to start, started without a branch, and ready ones waiting for consolidation; epics (épicos) by phase; pending ELM items; proposed lessons; and inconsistencies. Also closes a work session on a slice (updates status.md, logs the session hours with confirmation, records the Kiro credits, leaves git ready to commit and says how to resume). ALWAYS use this skill (read it before answering) when the user says \"onde parei\", \"status\", \"painel\", \"bom dia\", \"o que tem pendente\", \"qual a próxima fatia\", \"como está a sprint\", \"retomar\", \"fechar a sessão\", \"encerrar por hoje\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "2.0.0-alpha.1"
---

# sa-status — Onde parei

O painel é somente leitura: não altera arquivo, branch nem ELM. Pedido de **fechar a sessão** → modo da última
seção. Sem `.sabia/sabia.md` → diga que o fluxo não está configurado e ofereça a `sa-setup`.

## Coleta

1. `git fetch --quiet`. Pastas `.kiro/specs/*/status.md` da branch atual, de cada worktree (`git worktree list`),
   de cada branch remota (`git for-each-ref --format='%(refname:short)' refs/remotes/origin/`, ignorando
   `HEAD`; `git ls-tree -r --name-only <ref> -- .kiro/specs/` e `git show <ref>:<caminho>`) e de `origin/<base>`
   (só as das fatias `iniciada` ou `pronta` no `backlog.md`). Antes do merge, a pasta da fatia só existe na branch
   dela; qual `status.md` vale (a base sobre a branch; o de fatia `concluida`, `dividida` ou `cancelada`
   no `backlog.md` não conta) → a regra A base prevalece do
   o padrão [`sa-desenvolver/status.md`](~/.sabia/framework/padrao/sa-desenvolver/status.md).
2. De cada `status.md`: fatia, título, trilha, modo, fase, responsável, rodadas, achados abertos, PR, ELM,
   Banco, Drift de negócio (`possível alteração — …` sem ` · especificação:`), última linha do Histórico (data) e pendências `ELM pendente [<chave>]:` sem `ELM feito` com a **mesma chave** (também
   no rodapé das fichas de `fatias/`, no campo `**ELM:**` dos registros de `sustentacao/**`, na `## Sustentação` e nas
   `### <Categoria>` do `backlog.md` e na coluna "Tarefa ELM" da sprint aberta com `pendente`, fora das linhas com `saiu da sprint`). Também as do Histórico do `status.md` de
   `origin/<base>` de toda fatia `concluida` com pendência aberta (o item 1 não conta esse `status.md` para o resto):
   entram na lista 🏛️ e na contagem dela. Com ELM, também a linha não terminal do `backlog.md` (épico, fatia, item de
   Sustentação) com `elm` `—`, `pendente` ou id sem link: o item ainda sem IB no backlog do EWM, que a triagem ou a
   sincronização cria (espelhamento, §0 passo 4 do `elm-sprint.md`).
   PR das fatias em `pr-aberto`, `em-revisao`, `em-verificacao`, `retrabalho`, `aceita` ou `aguardando-aprovacao-pr`:
   `gitlab_listar_mrs(origem=<branch>, estado=all)` (MCP `gitlabpr`, só leitura) — estado, conflitos e link;
   `merged` sem `Fase: pronta` na base → o Dev responsável registra o merge (`sa-desenvolver.encerrar`: `pronta` na
   base e conclusão da `[DEV]`; merge por fora do Sabiá → a sincronização da sprint grava a `pronta`); `closed` sem
   merge → inconsistência. Sem o MCP, ou no agente sem a tool (`sa-especificador`, `sa-verificador`) → o link do
   `status.md`.
3. De cada `tasks.md`: `[x]`/total e o primeiro item pendente.
4. `<produto>/backlog.md` (da base), pelas [situações](../sa-fatiar/references/backlog.md#situações): fatias
   `planejada` (sprint aberta) e `elegivel` sem `status.md` em nenhuma branch, `iniciada` (em andamento; a data é a
   do commit que a gravou na base) e `pronta` (esperando a consolidação); épicos, com a Fase do `status.md` de cada
   um (o de `epicos/<EP>-<slug>/`; antes do GATE do PRD, o da pasta de trabalho
   `.sabia/local/especificacao/<EP>-<slug>/`, se houver nesta máquina);
   sprint atual (em `<produto>/sprints/<pai>/`, a de início mais recente com `**Situação:** aberta`) e a meta.
   PRDs (`epicos/*/prd.md`; antes do GATE, o `rascunho.md`): pendências `ELM pendente [<chave>]:` do rodapé e a
   data da linha `Versão <x.y> · <AAAA-MM-DD>`. A `obs` `falta: especificação (<motivo>, …)` do épico `iniciado` e da fatia que
   não está `nova` (pendência do P.O. na `[GB]`: a `[ESP] <id> Revisão <n>` pelo encaixe ou no próximo planejamento).
5. `<produto>/acordos.md`: limites de WIP (sem o arquivo: 2 fatias esperando pessoa, e sugira a
   fluxo `sa-planejamento.inicial`). Sem `<produto>/equipe.json` → sugira o mesmo fluxo: sem ele não há
   senioridade (modo da fatia, GATE do plano, quem revisa).
6. `<produto>/aprendizado/licoes.md`: lições com situação `proposta`.
   Sprint aberta (`sprint-<nn>.md`): seções Especificação, Débito de especificação (as linhas com Tarefa `—`; sem sprint aberta, a `obs`
   `débito de especificação` das fatias no `backlog.md`) e
   Sustentação (reserva × consumido; a linha com `saiu da sprint` não conta no consumido) e as linhas `ELM pendente [<chave>]:`, cada item pela linha viva, a sem
   `saiu da sprint` ([Gravar na base](../sa-fatiar/references/backlog.md#gravar-na-base)). Sustentação aberta: as
   linhas `aberto` e `em-andamento` de cada `### <Categoria>` da `## Sustentação` do `backlog.md` (na sprint ou com
   `sprint` `—`). Com o MCP `elm`: **conferência com o EWM** — só leitura, numa listagem (a sincronização inteira é o
   §9 do [elm-sprint.md](../sa-planejamento/references/elm-sprint.md)). Cabeçalho com o marcador
   `**Publicação no EWM:** pendente` → não liste nem rode o §1: sprint não publicada. Senão,
   `elm_listar_wi(iteracao da sprint, limite 200)`, **sem `tipo`** (tarefas, IBs, defeitos e épicos); `truncado` →
   de novo com `limite 1000`; `total` = 1000 → não conte (a listagem pode estar incompleta); erro `nao_encontrado` ou
   `entrada` → sprint não publicada. Pelos conjuntos do §9, passo 2 (da sprint, do backlog, terminal de fora, por
   fora), conte, sem gravar nada:
   - **por fora** — id da listagem que nenhum arquivo cita, de `tipo` do `pa` (o de outro tipo só conta nos itens da
     listagem);
   - **divergências** — pelas tabelas do §9 (Soluções propostas) e pelo papel, como no §9, passo 3 (na linha com duas
     tarefas do mesmo papel, o estado e o dono das abertas), o que a listagem sozinha mostra: o estado e o dono dos
     ids da sprint que estão nela (do IB de épico citado no `backlog.md`, só o estado) e a **entrada** (id conhecido
     que está na listagem e era esperado no backlog ou na iteração de outra sprint, uma por item, com os ids dele que
     estão nela; a iteração que cobre duas sprints não é entrada) e o estado das tarefas da fatia (`[DEV]`, `[REV]`,
     `[VER]`, `[APR]`) fora do esperado pela fase do `status.md` (item 2; a tabela do §9). A estimativa fica para a
     sincronização (a listagem não a traz), e o IB do backlog fora do estado inicial também (o painel não lista o
     backlog do EWM);
   - **a conferir** — id do conjunto "da sprint" ausente da listagem, quando a linha dele não tem `migrada de` (o da
     linha migrada é, em geral, tarefa que fechou na sprint anterior e ficou lá: fica para a sincronização);
   - **fora de toda contagem** — o que o §9, passo 2, deixa fora da comparação: as pendências registradas (itens 2
     e 4, inclusive as das fatias `concluida` e a `[<tipo> <id> sumiu]`, até o `ELM feito`), o id com pendência de cancelamento (aberta ou já com `ELM feito`) e a
     linha com a publicação pendente.
7. Lotes autônomos em andamento: `.sabia/local/loop-*.md`.
8. "Minhas" = responsável igual ao login da pessoa: `git config user.name` cruzado com `nome`/`login` do
   `equipe.json`; sem correspondência, pergunte o login uma vez.

## Painel

```
📊 Sabiá — <projeto> · <pai>/Sprint <nn> (<dias> dias restantes) · meta: <…>

🔨 Em andamento
| FT | Título | Fase | Modo | Tarefas | Achados | PR | Parada há | Próximo passo |
⏸️ Iniciadas sem branch publicada: FT-035 (iniciada por joao.lima em 2026-10-20) → só ele retoma (sa-desenvolver)

👀 Esperando pessoa (WIP de revisão: <n>/<limite> — aguardando-aprovacao-plano + pr-aberto + em-revisao + em-verificacao + aceita + verificada + aguardando-aprovacao-pr)
- FT-031 aguardando-aprovacao-plano há 1 dia → aprovar o plano: [APR] de <Dev Sênior> (sa-revisar, fluxo aprovar-plano)
- FT-029 pr-aberto há 2 dias → esperando revisão: [REV] de <revisor> (sa-revisar) <link>
- FT-028 em-verificacao → esperando verificação: [VER] de <verificador> (sa-verificar)
- FT-027 aceita → merge pelo Dev responsável (<login>, sa-desenvolver, fluxo encerrar) <link>
- FT-032 aguardando-aprovacao-pr → [APR] Aprovar PR de <Dev Sênior> (sa-revisar); aprovada, o merge pelo Dev (sa-desenvolver, fluxo encerrar) <link>
- FT-030 verificada → abrir o PR (sa-codificar)
- FT-026 bloqueada: aguardando troca de modo → P.O. ou SM (agente sa-produto, sa-planejamento, fluxo troca-modo)
- FT-033 bloqueada: aguardando especificação [ESP] FT-033 → especificador (sa-especificar, agente sa-especificador)
- FT-034 aguardando-aprovacao-pr · possível alteração: 2101 (REG) → Dev Sênior na [APR] decide
🔁 Retrabalho: FT-026 (de: em-revisao) → o desenvolvedor retoma no mesmo PR (sa-codificar)
📦 Prontas esperando consolidação: FT-025 (merge há 1 dia) → P.O. ou SM (sa-consolidar, agente sa-produto, [GB])

✅ Elegíveis para começar — as planejadas da sprint, depois as elegivel, que entram pelo encaixe (P.O. ou SM) (por prioridade; empate: a ordem da linha)
| FT | Título | Situação | Prioridade | Tam. | Modo | Depende de |

📄 Produto (épicos pela Fase do status.md)
- EP-04 em-revisao → GATE do PRD (<especificador>, sa-prd) · EP-05 rascunho (a descobrir)
- ⏳ EP-06: PRD aprovado aguardando fatiamento há 3 dias → P.O. ou SM (sa-fatiar, agente sa-produto)
- Especificação na sprint: EP-05 (rita.melo) iniciada · 8/16 h · FT-040 (—) planejada · falta: decisão do limite
- 📝 Pendência de especificação: FT-029 (sem sprint aberta) → P.O. ou SM ([GB]): a [ESP] FT-029 Revisão 1 no próximo planejamento
- 📝 Débito de especificação: 1 sem tarefa (FT-025)

🎧 Reserva (Sustentação + retrabalho): <h>h · consumido <h>h (retrabalho <x>h · Sustentação <y>h)
- Atendimento: AT-012 em-andamento (joao.lima, prazo 2026-10-16) · AT-014 aberto · Implantação: IM-003 aberto (ana.souza)

🔄 EWM: <n> por fora · <m> divergências · <k> a conferir (<ids>) → sincroniza a sprint (sa-planejamento)
⛔ Fechamento (último dia da sprint ou depois): <n> fatias prontas esperando consolidação (FT-…) → consolide antes da review (sa-consolidar)
🏛️ ELM pendente: <n> (lista; <m> itens do backlog sem IB → sa-triar ou sincroniza a sprint) · 🔁 Lições propostas: <n>
⚠️ Inconsistências: <lista | nenhuma>

👉 Sugestão: <a ação de maior alavanca agora>
```

**EWM** — a linha 🔄 sai da Coleta, item 6 (a parte com zero pode ser omitida). Nada encontrado →
`🔄 EWM: sem diferença na listagem (<n> itens)`: o painel nunca diz "iguais", que é da sincronização (ela também
compara a estimativa e lê o que saiu da listagem). Marcador, `nao_encontrado` ou `entrada` →
`🔄 EWM: sprint não publicada → sincroniza a sprint`; sem o MCP → `🔄 EWM: não conferido (sem o MCP elm)`;
`total` = 1000 → `🔄 EWM: não conferido (listagem no teto de 1000 itens)`. A 🏛️ conta também as pendências das
fatias `concluida` (Coleta, item 2).

**Possível alteração** — a linha `· possível alteração: <artefatos> → <quem> decide` vem do Drift (Coleta, item 2);
quem decide, pela fase: `pr-aberto` ou `em-revisao` → o revisor; `em-verificacao` → o verificador; AFK → o Dev Sênior
na `[APR]`. O merge espera a decisão.

**Produto** — `⏳`: épico `iniciado` no `backlog.md`, com a Fase `aprovado` no `status.md` da base, sem a `obs`
`falta: especificação` e sem linha viva `planejada` ou `iniciada` na seção Especificação da sprint aberta (a linha
`concluida` da sprint fechada não migra); `<n>` = hoje − a data do rodapé do `prd.md`. As linhas `📝` vêm da Coleta, itens 4 (pendência) e 6 (débito); sem nenhuma, omita-as.

**Sugestão** — nesta ordem: desbloquear quem espera uma pessoa (plano ou PR parado, WIP de revisão estourado, PR
mergeado sem `pronta` na base) → item de Sustentação com prazo vencendo → terminar a fatia em andamento → começar a
próxima elegível (a planejada do topo; nenhuma → a `elegivel` do topo, pelo encaixe com o P.O. ou o SM, agente `sa-produto`; AFK em quantidade → ofereça o `sa-orquestrar`) →
PRD aprovado aguardando fatiamento (a linha ⏳) → trabalho de produto (PRD/fatiar) para manter o backlog com fatias
elegíveis.

## Inconsistências a apontar

- fase `pr-aberto` sem PR (nem `PR: texto entregue`), ou com tarefas pendentes no `tasks.md`;
- fatia `elegivel`, `planejada` ou `iniciada` sem ficha (coluna `ficha` `—` ou arquivo inexistente);
- fatia `elegivel` ou `planejada` com `status.md` numa branch: a `iniciada` não chegou à base (a sincronização da
  sprint corrige, [elm-sprint.md](../sa-planejamento/references/elm-sprint.md) §9);
- fatia `iniciada` sem `status.md` em nenhuma branch nem na base (sessão interrompida antes da branch): vai na
  linha ⏸️ do painel;
- PR `merged` sem `Fase: pronta` no `status.md` da base: o Dev responsável registra o merge (fluxo
  `sa-desenvolver.encerrar`); merge por fora do Sabiá → a sincronização da sprint (§9);
- situação diferente no `backlog.md` e na linha viva da sprint aberta (fatia ou item de Sustentação; a com
  `saiu da sprint` é histórico — [Gravar na base](../sa-fatiar/references/backlog.md#gravar-na-base)), ou
  `pronta`/`concluida` no `status.md` da base e não no `backlog.md` (ou o contrário) — a sincronização da sprint
  (§9) propõe a solução;
- fatia em andamento sem commit há mais de 3 dias úteis;
- `concluida` com Banco = `pendente` ou `aplicada em dev` (implantação bloqueada);
- Histórico fora de ordem cronológica ou fase que não bate com a última linha (conflito mal resolvido);
- conceito aprovado (`stable`, `verified` humano) sem `resource`, com a `[ESP]` dele concluída e sem `ELM pendente
  [… publicar]` (no `elm/` do épico ou no da fatia): a `[ESP]` não o publicou;
- conceito de `elm/` alterado (`generated.at`) depois do último `verified` e ainda `stable` (falta reaprovar);
- `backlog.md` alterado numa branch de fatia (deve mudar só na base);
- reserva (Sustentação + retrabalho) estourada (consumido > reserva; o consumido não conta as linhas com
  `saiu da sprint`) sem decisão do P.O. registrada no `sprint-<nn>.md`;
- arquivo com dado de cliente versionado (extração, CSV ou evidência fora de `.sabia/local/`).

Tarefa concluída **sem horas lançadas** não é apontada aqui: só no fechamento da sprint (passo
`sa-planejamento.retrospectiva.horas`). A `[GB]` sem horas (a dona também é o P.O., que nunca lança) é normal: nem aqui nem no relatório de horas.

## Fechar a sessão

Ao encerrar uma sessão numa fatia, para que a próxima — sua, de outra pessoa ou de um agente — retome sem perder o
fio (sessão num item de Sustentação — `AT-`, `IM-`…, sem `status.md` → horas e registro pela skill dele:
`sa-atender` no Atendimento, `sa-executar` nas demais; aqui, só os créditos do item 4). Fatia com o PR mergeado:
o `status.md` que vale é o da base — os itens 1 e 4 gravam nele pelo bloco
[Gravar na base](../sa-fatiar/references/backlog.md#gravar-na-base), nunca na branch.

1. Acrescente ao Histórico do `status.md` da fatia o que foi feito, o **próximo passo exato** e as decisões desta
   sessão.
2. Marque no `tasks.md` só o que está realmente pronto e verde.
3. **Horas da sessão** (com ELM): "Quanto tempo nesta sessão em `<tarefa>`?" — a tarefa do papel de quem fecha,
   pelo campo ELM do `status.md` → `elm_horas(<id>)` → desconte → `elm_lancar_horas(<id>, <h>)`, com "sim" (lança, não conclui).
   Sem o MCP `elm` → `ELM pendente [<DEV|REV|VER|APR> FT-<nnn> horas]: lançar <h>h (<data>)` no Histórico.
4. **Créditos da sessão** (sempre, com ou sem ELM) — o Kiro grava o consumo de cada turno só na máquina de quem
   conversou (`~/.kiro`), por isso é quem fecha que registra, aqui, e o número chega aos outros pelo commit. O
   Kiro só grava o consumo de um turno quando ele **termina**: leia sempre **na resposta a uma pergunta**, e assim o
   turno do trabalho já está gravado. Se a pessoa acabou de responder `sim` a `💳 Registrar os créditos desta
   sessão? (sim)` (steering) ou a `💳 Registrar os créditos e entregar? (sim)` (nas entregas das skills de papel,
   antes do commit), rode o script já; senão, pergunte `💳 Registrar os créditos desta sessão? (sim)` e rode na
   resposta. O script é o `scripts/creditos.py` desta skill:
   `uv run --no-project python <caminho>/creditos.py --pasta <cada pasta do git worktree
   list> --desde <AAAA-MM-DDTHH:MM:SS>` — a Data da última linha com o seu login na seção onde vai gravar; sem linha
   sua, a data e hora do commit de início do item (`<id> iniciar` ou `<id> iniciar especificação`: `git log -1
   --format=%cd --date=format:%Y-%m-%dT%H:%M:%S --grep="^<id> iniciar"`); gestão sem sprint aberta: a regra do
   comentário da `[GB]`, abaixo. Sai uma linha por sessão do Kiro
   com consumo, a mais recente primeiro — é a atual; as outras são sessões que ninguém fechou: mostre-as com o
   título e pergunte quais são deste item (nenhuma é atribuída sem "sim").
   ```
   💳 Créditos — FT-<nnn> · power sabia <metadata.version desta skill>
   Esta sessão: <id> · <x.xx> créditos (até <ate>)
   Sem registro: <id> "<título>" · <x.xx> — é desta fatia? (sim/não)
   Gravar? (sim)
   ```
   Com "sim", uma linha por sessão na seção **Créditos** do `status.md`: `| <ate> | <papel> | <login> | <id> |
   <versão> | <x.xx> |` — Data é o `ate` do script (o `--desde` da próxima vez). Sessão com várias fatias (loop)
   → rateio igual entre elas, Sessão `<id> (rateio 1/<n>)`. Script sem sessão (código 1, outro editor) → pergunte
   o número que o Kiro mostra, Sessão `informado`; nunca estime. Sobra só o turno do próprio registro, pequeno: o
   próximo fechamento do item o pega pelo `--desde`.

   O mesmo vale fora da fatia, mudando só onde a linha vai: Sustentação → seção Créditos do registro `<ID>` (`AT-<nnn>`,
   `IM-<nnn>`…); especificação → `status.md` do épico (`sa-especificar`); especificação de fatia (`[ESP] FT`) → seção
   Créditos da ficha da fatia; gestão (Atividade: `inicial` · `planejamento` · `encaixe` · `sincronização` · `troca de modo` · `review` · `retrospectiva` · `virada` · `triagem` · `consolidação` · `fatiamento` · `refinamento`) → seção **Créditos de gestão** do `sprint-<nn>.md` aberto, com Atividade no lugar de Papel,
   quando há sprint aberta. Sem sprint aberta (só o comentário na `[GB]`) → `--desde` = a data e hora do último
   comentário `Créditos` da `[GB]` (`elm_ler_wi(<id da [GB]>, comentarios = -1)`). Toda sessão do P.O. ou do SM no
   agente de produto grava também, com o mesmo "sim", um comentário na `[GB]`: `elm_comentar(<id da [GB]>, "Créditos
   <atividade> <ids>: <créditos> (sessão <sessão>, <login>, <AAAA-MM-DD>)")` — ex.: `Créditos triagem FT-040, AT-013:
   2.40 (sessão 9ec1dcaa, ana.souza, 2026-10-29)`. Horas na `[GB]`, só o SM lança; o P.O. nunca, nem quando também
   é o SM. Sem o MCP `elm` ou com falha → `ELM pendente [GB <id> créditos]: comentar "Créditos <atividade> <ids>: …"` no lugar das pendências da `[GB]`
   ([elm.md](../sabia/references/elm.md#pendências)).
5. Mostre o `git status` e proponha o commit do que está pronto (padrão do `sabia.md`); grave só com "ok" e nunca
   faça push — na fatia com o PR mergeado, o commit e o push são os do Gravar na base.
6. Termine com a frase para retomar numa sessão nova (ex.: "vamos trabalhar na FT-031").
