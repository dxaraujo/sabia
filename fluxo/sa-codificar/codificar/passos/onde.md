---
{"resumo": "Confere fase, GATE do plano, branch e árvore limpa; retoma da primeira tarefa não marcada, com os achados abertos como tarefas novas."}
---
## Entrada

`status.md` e `tasks.md` da fatia, na branch dela.

## Faça

- **Fase:** `implementando`, `revisando`, `retrabalho (de: …)` ou `verificada` (AFK: passo `pr`).
- Branch = a do `status.md`, no checkout ou na worktree dela (regra do passo `sa-desenvolver.desenvolver.chegou`). `git status` limpo, **descontados** os relatórios que outros
  papéis gravaram na pasta da fatia (`revisao-*.md`, `analise-*.md`, `verificacao.md`, `CT.csv`, `evidencias/`,
  `massa/`) e o `status.md`/`tasks.md` com mudança só de fase, Rodadas, Histórico, Achados ou marcação de tarefa:
  commite-os primeiro (mensagem no padrão do `sabia.md`, `registrar revisão/verificação`).
- Atualize: a branch tem upstream → `git pull --ff-only`; não tem (worktree nova) → `git fetch` basta.
- Retome do **primeiro item não marcado** do `tasks.md`. Achados abertos viram as próximas tarefas, numeradas em
  sequência no fim da seção `## Tasks` do `tasks.md` (`- [ ] 7. [R1] <achado> — origem: revisao-codigo-2.md`;
  e cada uma entra numa wave nova no fim do JSON do `## Task Dependency Graph`): os da seção "Achados
  abertos" do `status.md` (PR, pessoa), os do último `revisao-codigo-<N>.md` com `VEREDITO: REVISAR` e os cenários
  rejeitados do `verificacao.md`. Como as anteriores estão marcadas, elas são as primeiras não marcadas.
- **Retrabalho** (`fase: retrabalho (de: em-revisao | em-verificacao)`, HITL): a `[DEV]` ainda está em andamento (só
  é concluída no merge) — `elm_transicao(<id>, "assumir")` só confere (`ja_estava`). Os achados vêm do último `revisao-codigo-<N>.md` ou dos cenários rejeitados do
  `verificacao.md`; `fase: implementando`, linha no Histórico. Ao fim, o mesmo PR é atualizado (passo `pr`).
  **AFK** (`retrabalho (de: aguardando-aprovacao-pr)` sem a linha `conflito no merge` no fim do Histórico: mudanças
  pedidas na `[APR] Aprovar PR`): o mesmo, com os achados de Achados abertos (origem: PR); a correção passa de novo
  pelos passos `validar`, `revisar` e `verificar` antes de atualizar o PR.
  **Conflito no merge** (`retrabalho (de: aceita | aguardando-aprovacao-pr)` com a linha `conflito no merge` no fim
  do Histórico, gravada no fluxo `sa-desenvolver.encerrar`): `fase: implementando` e, antes de tudo, a branch
  atualizada com a base (item 1 do passo `pr`); depois, como acima — HITL: o PR atualizado volta a `pr-aberto`, e o
  revisor e o verificador reabrem a `[REV]` e a `[VER]`; AFK: passos `validar`, `revisar` e `verificar` de novo, e quem aprova reabre a
  `[APR] Aprovar PR` (`sa-revisar`).
- Rode o comando de **testes** uma vez antes de mexer: vermelho antes de começar = problema do ambiente ou da
  base, não seu. Registre e avise; não "conserte" o que não é da fatia.

## Saída

Branch atualizada, árvore limpa e a próxima tarefa não marcada → passo `tarefa`.

## Pare se

- `aceita` (HITL) ou `aguardando-aprovacao-pr` (AFK) → o merge é do fluxo `sa-desenvolver.encerrar`: diga isso e pare;
  outra fase ou sem `status.md` → "use `sa-desenvolver`" e pare — a entrada do Dev é ela, nunca este fluxo.
- `implementando` sem a linha do GATE no Histórico (`plano aprovado por <login>`, `plano do Sênior` ou `Pleno
  dispensou o GATE do plano`, gravada no passo `sa-plano.plano.gate`) → o plano não passou pelo GATE: avise e pare.
- A branch não é a do `status.md` → avise e pare.
- Qualquer outra alteração na árvore → avise e pare.
