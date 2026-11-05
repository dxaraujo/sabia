---
{"resumo": "Confere responsável, [DEV], fase, modo, GATE do plano, branch e árvore limpa; retoma da primeira tarefa não marcada, com os achados abertos como tarefas novas."}
---
## Entrada

`status.md` e `tasks.md` da fatia, na branch dela.

## Faça

- **Quem retoma** (no loop, `AUTONOMO`, pule este item inteiro: o lote já conferiu e assumiu): quem está na sessão
  não é o `responsavel` da linha viva da fatia na sprint (base) → "é de <login>; trocar é do P.O. ou do SM" e pare.
  A `[DEV]`, pela seção Assumir do passo `sa-codificar.codificar.entrada`
  (já é dele → nada; fechada sem o PR mergeado → reabrir com "sim"; com o PR mergeado → `sa-desenvolver.encerrar`).
- **Fase:** `implementando`, `revisando`, `verificando` (AFK: passo `verificar`, uma rodada nova, sem nova revisão),
  `retrabalho (de: …)` ou `verificada` (AFK: passo `pr`);
  `bloqueada (de: <fase>)` → mostre o motivo e a pergunta; resolvido, `Bloqueio: —` e a fase de origem. Bloqueio
  `aguardando especificação [ESP] FT-<nnn>` ([Volta à especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação)) com a linha da
  Especificação `concluida` na base e o motivo do Bloqueio na Observação ([De quem é a Volta](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação); sem ele, é do
  especificador → diga isso e pare) → `git merge origin/<base>` com "sim" (traz os conceitos aprovados de
  `.kiro/specs/<ft>-<slug>/elm/`), `Bloqueio: —` e: de `implementando`, `revisando` ou `verificando`, a fase de origem;
  de `em-revisao`, `em-verificacao` ou `aguardando-aprovacao-pr`, `retrabalho (de: <fase>)`, com o ajuste ao artefato
  aprovado como achado aberto (origem: `[ESP] FT-<nnn>`). O **Modo** é
  o da base (regra A base prevalece do padrão `sa-desenvolver/status.md`): diverge do `status.md` (troca de modo do
  P.O. ou do SM) → sincronize como ela manda, num commit (`<FT> sincronizar modo`), antes de seguir. `aguardando-aprovacao-pr` com Modo HITL na
  base (AFK → HITL com o PR aberto; a `[APR] Aprovar PR` foi cancelada) → sincronize o Modo e os ids da `[REV]` e da
  `[VER]` pela base, `fase: pr-aberto`, linha no Histórico; commit `<FT> sincronizar modo`, push e conferência no remoto (como na Entrega do
  passo `sa-codificar.codificar.pr`); avise o revisor (`sa-revisar.hitl`) e pare.
- **Pedido de fora da fatia** ([Volta à especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação)): a ficha
  com linha de Especificado `—` e a `[ESP] FT` aberta → `bloqueada (de: <fase>)` com o Bloqueio
  `aguardando especificação [ESP] FT-<nnn>: …`, commit `<FT> registrar bloqueio`, push, e pare.
- Branch = a do `status.md`, no checkout ou na worktree dela (passo `entrada`). `git status` limpo, **descontados** os relatórios que outros
  papéis gravaram na pasta da fatia (`revisao-*.md`, `analise-*.md`, `verificacao.md`, `CT.csv`, `evidencias/`,
  `massa/`) e o `status.md`/`tasks.md` com mudança só de fase, Rodadas, Histórico, Achados ou marcação de tarefa:
  commite-os primeiro (mensagem no padrão do `sabia.md`, `<FT> registrar revisão <N>` ou `<FT> registrar verificação`,
  conforme o relatório).
- Atualize: a branch tem upstream → `git pull --ff-only`; não tem (worktree nova) → `git fetch` basta.
- Retome do **primeiro item não marcado** do `tasks.md`. A seção "Achados abertos" do `status.md` é a fonte única:
  antes, os achados do último `revisao-codigo-<N>.md` com `VEREDITO: REVISAR` e os cenários rejeitados do
  `verificacao.md` (o último resultado de cada um) que ainda não estão nela entram como linhas `aberto` (origem: o nome do relatório). Viram as
  próximas tarefas só os `aberto` de origem `revisao-codigo-<N>.md`, `verificacao.md`, `PR` ou `[ESP] FT-<nnn>` sem
  tarefa `[R<n>]` no `tasks.md` (os de `GATE do plano` são do plano), numeradas em
  sequência no fim da seção `## Tasks` do `tasks.md` (`- [ ] 7. [R1] <achado> — origem: revisao-codigo-2.md`;
  e cada uma entra numa wave nova no fim do JSON do `## Task Dependency Graph`). Como as anteriores estão marcadas,
  elas são as primeiras não marcadas.
- **Retrabalho** (`fase: retrabalho (de: em-revisao | em-verificacao)`, HITL): a `[DEV]` ainda está em andamento (só
  é concluída no merge) — `elm_transicao(<id>, "assumir")` só confere (`ja_estava`). Os achados, pela regra acima, são os do último `revisao-codigo-<N>.md` ou os cenários rejeitados do
  `verificacao.md`; `fase: implementando`, linha no Histórico. Ao fim, o mesmo PR é atualizado (passo `pr`).
  **AFK** (`retrabalho (de: aguardando-aprovacao-pr)` sem a linha `conflito no merge` no fim do Histórico: mudanças
  pedidas na `[APR] Aprovar PR`): o mesmo, com os achados de origem `PR`; a correção passa de novo
  pelos passos `validar`, `revisar` e `verificar` antes de atualizar o PR.
  **Conflito no merge** (`retrabalho (de: aceita | aguardando-aprovacao-pr)` com a linha `conflito no merge` no fim
  do Histórico, gravada no fluxo `sa-desenvolver.encerrar`): `fase: implementando` e, antes de tudo, a branch
  atualizada com a base (item 1 do passo `pr`); depois, como acima — HITL: o PR atualizado volta a `pr-aberto`, e o
  revisor e o verificador reabrem a `[REV]` e a `[VER]`; AFK: passos `validar`, `revisar` e `verificar` de novo, e quem aprova reabre a
  `[APR] Aprovar PR` (`sa-revisar`).
- Rode o comando de **testes** uma vez antes de mexer: vermelho antes de começar = problema do ambiente ou da
  base, não seu → `fase: bloqueada (de: <fase>)`, Bloqueio `⚠️ ambiente: <o que faltou>` (o comando e a falha), avise e
  pare; não "conserte" o que não é da fatia.

## Saída

Branch atualizada, árvore limpa e a próxima tarefa não marcada → passo `tarefa`.

## Pare se

- Fora do loop, quem está na sessão não é o `responsavel` da fatia → "é de <login>; trocar é do P.O. ou do SM" e pare.
- A branch não é a do `status.md` (no checkout ou na worktree dela) → avise e pare.
- `aguardando-aprovacao-pr` que virou HITL → `pr-aberto` gravado, revisor avisado, e pare.
- Pedido de fora da fatia (linha de Especificado `—` com a `[ESP] FT` aberta) → `bloqueada` gravada, e pare.
- `bloqueada (de: <fase>)` ainda sem resposta (ou a Volta ainda de quem especifica) → mostre o motivo e a
  pergunta e pare.
- `implementando` sem a linha do GATE no Histórico (`plano aprovado por <login>`, `plano do Sênior` ou `Pleno
  dispensou o GATE do plano`, gravada no passo `sa-plano.plano.gate`) → o plano não passou pelo GATE: avise e pare.
- Vermelho antes de mexer → `bloqueada` com o `⚠️ ambiente`, e pare.
- Qualquer outra alteração na árvore → avise e pare.
