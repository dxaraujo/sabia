---
name: sa-codificar
description: "Implements a slice (fatia) of the Sabiá flow from the approved plan (tasks.md), one task at a time, in a test cycle (red → green → refactor) with backpressure — build, tests, lint and the coverage set in sabia.md must pass before a task is checked off; small commits, progress in status.md and PR delivery (commit, push, check on the remote, PR via gitlabpr). HITL: automatic review (rubric C, subagent) before the PR; the official review and verification belong to people. AFK: review (up to 2 rounds) and verification by subagent before the PR. Ends at the PR: the merge and completing the [DEV] belong to sa-desenvolver. Fixes in the same PR the rework requested in the REV, the VER and the PR, and loads the coder toolkit skills before each artifact. Use when the user says \"implementa a FT-031\", \"executa as tasks\", \"continua a implementação\", \"Start task\", \"abre o PR\", \"corrige os achados\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "1.1.0"
---

# sa-codificar — Ciclo curto, verificação sempre

Entrada: `.kiro/specs/<ft>-<slug>/` com o plano aprovado (`status.md` com fase `implementando` ou `retrabalho (de:
…)`), na branch da fatia. O **modo** do `status.md` decide o caminho até o PR (Passo 5): **HITL** vai direto, depois
da revisão automática; **AFK** passa antes pela revisão e pela verificação por subagente (Passos 3–4). Nos dois, a skill
termina no PR: a `[DEV]` fica em andamento, e o merge do PR aprovado e a conclusão dela são da `sa-desenvolver` (Passo 6). No Kiro, cada tarefa também pode ser executada pelo **"Start task"** do `tasks.md` — as regras valem igual.

Leia antes: `design.md` inteiro, `research.md`, `.sabia/sabia.md` (comandos, regras críticas,
regras aprendidas).

## Passo 0 — Onde estou

- **Fase:** `implementando`, `revisando`, `retrabalho (de: …)` ou `verificada` (AFK: Passo 5); `aceita` (HITL) ou
  `aguardando-aprovacao-pr` (AFK) → o merge é da `sa-desenvolver` (Passo 6): diga isso e pare; outra fase ou sem
  `status.md` → "use `sa-desenvolver`" e pare — a entrada do Dev é ela, nunca esta skill.
  `implementando` sem a linha do GATE no Histórico (`plano aprovado por <login>`, `plano do Sênior` ou `Pleno
  dispensou o GATE do plano`, gravada pela `sa-plano` Passo 5) → o plano não passou pelo GATE: avise e pare.
- Branch = a do `status.md`, no checkout ou na worktree dela (regra da `sa-desenvolver`, Passo 1); senão avise e pare. `git status` limpo, **descontados** os relatórios que outros
  papéis gravaram na pasta da fatia (`revisao-*.md`, `analise-*.md`, `verificacao.md`, `CT.csv`, `evidencias/`,
  `massa/`) e o `status.md`/`tasks.md` com mudança só de fase, Rodadas, Histórico, Achados ou marcação de tarefa:
  commite-os primeiro (mensagem no padrão do `sabia.md`, `registrar revisão/verificação`). Qualquer outra alteração →
  avise e pare.
- Atualize: a branch tem upstream → `git pull --ff-only`; não tem (worktree nova) → `git fetch` basta.
- Retome do **primeiro item não marcado** do `tasks.md`. Achados abertos viram as próximas tarefas, numeradas em
  sequência no fim da seção `## Tasks` do `tasks.md` (`- [ ] 7. [R1] <achado> — origem: revisao-codigo-2.md`;
  e cada uma entra numa wave nova no fim do JSON do `## Task Dependency Graph`): os da seção "Achados
  abertos" do `status.md` (PR, pessoa), os do último `revisao-codigo-<N>.md` com `VEREDITO: REVISAR` e os cenários
  rejeitados do `verificacao.md`. Como as anteriores estão marcadas, elas são as primeiras não marcadas.
- **Retrabalho** (`fase: retrabalho (de: em-revisao | em-verificacao)`, HITL): a `[DEV]` ainda está em andamento (só
  é concluída no merge) — `elm_transicao(<id>, "assumir")` só confere (`ja_estava`). Os achados vêm do último `revisao-codigo-<N>.md` ou dos cenários rejeitados do
  `verificacao.md`; `fase: implementando`, linha no Histórico. Ao fim, o mesmo PR é atualizado (Passo 5).
  **AFK** (`retrabalho (de: aguardando-aprovacao-pr)` sem a linha `conflito no merge` no fim do Histórico: mudanças
  pedidas na `[APR] Aprovar PR`): o mesmo, com os achados de Achados abertos (origem: PR); a correção passa de novo
  pelos Passos 2–4 antes de atualizar o PR.
  **Conflito no merge** (`retrabalho (de: aceita | aguardando-aprovacao-pr)` com a linha `conflito no merge` no fim
  do Histórico, gravada pela `sa-desenvolver` no Passo 6): `fase: implementando` e, antes de tudo, a branch
  atualizada com a base (item 1 do Passo 5); depois, como acima — HITL: o PR atualizado volta a `pr-aberto`, e o
  revisor e o verificador reabrem a `[REV]` e a `[VER]`; AFK: Passos 2–4 de novo, e quem aprova reabre a
  `[APR] Aprovar PR` (`sa-revisar`).
- Rode o comando de **testes** uma vez antes de mexer: vermelho antes de começar = problema do ambiente ou da
  base, não seu. Registre e avise; não "conserte" o que não é da fatia.

## Passo 1 — Uma tarefa por vez

Para cada tarefa do `tasks.md`, nesta ordem:

1. **Carregue a skill** da stack que a tarefa cita (toolkit ligado ao agente) **antes** de escrever. Nunca escreva
   de memória o que uma skill do projeto padroniza.
2. **Vermelho:** escreva o teste do comportamento (um cenário ou critério por vez), **pelo ponto de teste do
   `design.md`** — interface pública, sem mock de detalhe interno, sem recalcular o esperado do jeito que o código
   calcula — e rode só ele (comando de teste único). Ele tem de **falhar pelo motivo certo**. Corretiva: o teste
   que reproduz o defeito vem primeiro, e ele e a correção são **um ciclo só** — marcados e commitados juntos, já
   verdes (o vermelho fica registrado no Histórico: `teste do defeito vermelho: <falha observada>`); os testes de
   preservação rodam verdes antes da correção.
3. **Verde:** a menor mudança de produção que faz o teste passar, imitando o análogo do `design.md`.
4. **Arrumar** só o que você acabou de escrever (nomes do glossário, duplicação), com os testes verdes.
   Refatorar código existente não é desta tarefa: vira sugestão para a revisão ou fatia própria.
5. **Backpressure:** `sh .sabia/verificar.sh` (compilar, testes, lint e cobertura do `sabia.md`, gravado pela
   setup). Falhou → corrija antes de seguir; não acumule vermelho. Sem o script → os comandos do `sabia.md`, um a
   um, e avise que falta rodar a setup.
6. Marque `- [x]` e acrescente a linha no Histórico do `status.md`: `<data> — tarefa N ok · <testes>`.
7. **Commit** pequeno, só com o `verificar.sh` verde (padrão do `sabia.md`, com o id da fatia) com o código, os testes, o `tasks.md` e o
   `status.md` — a árvore fica limpa a cada tarefa.

Regras do ciclo:
- **Nunca** apague, desabilite, pule ou enfraqueça um teste para ficar verde. Teste que parece errado → pare e
  pergunte (ou, autônomo, registre como bloqueio).
- O código real não bate com o plano → **pare** e reporte, sem improvisar:
  ```
  Divergência na tarefa N — Esperado: <o que o plano diz> · Encontrado: <o que o código tem, arquivo:linha>
  · Por que importa: <o que muda>
  ```
  Muda comportamento de negócio → P.O. (`sa-entrevistar` / `sa-prd`); muda o desenho → `sa-plano`
  (replanejar). Decisão técnica equivalente → decida e registre no `design.md` (Decisões técnicas).
- Nada de funcionalidade que a fatia não pediu, mesmo "aproveitando".
- Duas correções seguidas sem sair do lugar → pare de tentar variações: registre no `status.md` o que foi tentado e
  continue numa sessão nova a partir dele (contexto poluído piora a terceira tentativa); persistindo,
  `fase: bloqueada (de: implementando)`, com motivo e pergunta.
- Banco: somente leitura pelo MCP; DDL é do time de banco (registre no `status.md`, campo Banco).
- Contexto cheio ou sessão longa → atualize o `status.md` (o que foi feito, próximo passo, decisões), **commite-o**
  e continue numa sessão nova a partir dele. O estado vive nos arquivos, não na conversa.

## Passo 2 — Validação completa

Todas as tarefas `[x]`: rode compilar, a suíte **inteira** de testes e o lint; a cobertura, com o gate do
`sabia.md` (se houver), é medida no que a fatia criou ou alterou — as linhas e os ramos do diff. Falta de cobertura
que já existia no arquivo antes da fatia (fora do diff) não é tarefa dela: registre no Histórico (`cobertura
pré-existente: <arquivo> <o que falta>`) e siga. Erro de ambiente → `AMBIENTE` no `status.md`, não código.

## Passo 3 — Revisão independente

**HITL — revisão automática (backpressure):** peça ao agente **`sa-revisor`** (subagente) a rubrica **C**
passando id, pasta, branch e "pré-PR" — relatório só na conversa, sem `revisao-codigo-<N>.md` e sem contar rodada.
`REVISAR` → corrija os achados (tarefas `[R<n>]`) e repita, até 2 vezes; persistindo, mostre à pessoa, que decide
seguir para o PR (os achados vão listados no texto do PR) ou corrigir antes. `APROVADO` → **Passo 5**: a revisão
oficial (`[REV]`) e a verificação (`[VER]`) são das pessoas, sobre o PR. Sem subagente → siga para o Passo 5.

**AFK:** `fase: revisando`; incremente "revisão do código" em Rodadas. Peça ao agente **`sa-revisor`** (subagente) a
rubrica **C** passando só: id da fatia, pasta, branch/worktree e rodada — **nunca** o seu raciocínio. Ele grava o
`revisao-codigo-<N>.md`. Sem subagente disponível (você é um agente sem essa ferramenta) → pare aqui e devolva a
quem chamou: "aguardando revisão (rodada <N>)".

Assim que o `revisao-codigo-<N>.md` estiver gravado, grave no campo **Drift de negócio** do `status.md` a
penúltima linha do relatório (só sobe de `não` para `sim`) e **commite-o imediatamente com o `status.md`** (fase,
Rodadas, drift) antes de prosseguir — mensagem no padrão do `sabia.md`, `registrar revisão <N>`; não espere a próxima
sessão nem o Passo 0. O PR cita esse arquivo e
ele precisa estar na branch antes da abertura.

- `VEREDITO: APROVADO` → Passo 4.
- `REVISAR` → corrija **só** os achados (como tarefas `[R<n>]`, Passo 0) e volte ao Passo 2. Até 2 rodadas.
- 2ª reprovação → `fase: bloqueada (de: revisando)`; mostre à pessoa os relatórios e as opções: orientar a correção (zera as
  rodadas), voltar ao plano, ou aceitar explicitamente os achados restantes (quem e por quê no `status.md`).

## Passo 4 — Verificação de aceite (só AFK)

Incremente "verificação" em Rodadas e peça ao agente **`sa-verificador`** (subagente) a **`sa-verificar`** (cenários
de aceite executados de ponta a ponta, com evidência) — nunca a execute você: quem implementou não verifica. Sem
subagente disponível → pare aqui e devolva a quem chamou: "aguardando verificação (rodada <N>)". `ACEITO` → ela
deixa a fatia em `fase: verificada`; `REJEITADO` → devolve para cá os cenários reprovados (Passo 0). Teto de 2
rodadas, como na revisão: 2ª rejeição seguida → `fase: bloqueada (de: verificando)` com as mesmas opções do Passo 3.
Corrigida uma rejeição, volte ao Passo 2 e ao Passo 3 (a nova revisão conta no teto de rodadas) antes de verificar de
novo.

Com `ACEITO` ou `REJEITADO`: grave o **Drift de negócio** do relatório no `status.md` (como no Passo 3) e
**commite imediatamente** `verificacao.md`, `CT.csv`, `evidencias/`, `massa/` e o
`status.md` antes de prosseguir — mensagem no padrão do `sabia.md`, `registrar verificação`. O PR cita esses arquivos e eles precisam estar na branch antes da abertura.

## Passo 5 — PR

Com a revisão automática feita (HITL) ou com `fase: verificada` (AFK: revisão `APROVADO` e verificação `ACEITO`):

Push e PR são do Dev: o agente `sa-codificador` (o Kiro confirma cada um) ou a sessão da pessoa; no loop, o
`sa-orquestrador` (fase 8 da `sa-loop`). Modo autônomo: nada deste passo.

0. **ADRs:** cada decisão do `design.md` com "Vira ADR? sim" → um ADR curto em `.kiro/specs/<ft>-<slug>/adr/<slug-da-decisão>.md`
   (contexto · decisão · consequências · origem FT-<nnn>), descrevendo o que o código faz. Vai no PR: o Dev Sênior
   o julga na `[REV]` ou na `[APR]` (rubrica C15); a pasta de ADRs do projeto é artefato de produto (nunca em branch
   de fatia) — a consolidação o leva para lá.
   **ET as-built** (só se a linha ET da seção ELM do `sabia.md` diz `as-built no merge`): `.kiro/specs/<ft>-<slug>/elm/ET-<slug>.md`,
   conceito OKF no formato de [okf-elm.md](../sa-prd/references/okf-elm.md) (`type` = o tipo de ET do projeto, título
   `ET - FT-<nnn> <título>`, `status: draft`), escrito do `design.md` e do código do PR: interfaces, contratos, dados,
   integrações e decisões técnicas — nada do que não foi feito. Retrabalho que muda o que ela descreve a atualiza no
   mesmo PR. Vai no PR e é julgada com os ADRs (rubrica C15); quem a publica no ELM é a consolidação.
1. Branch atualizada com a base? `git fetch` e `git diff --name-only HEAD...origin/<base>`: vazio, ou só
   `<produto>/backlog.md`, `<produto>/sprints/**` e `.kiro/specs/` de outras fatias (os registros de situação que o
   time grava na base) → atualizada. Outro caminho (código, PRD, ficha) → desatualizada: numa sessão com a
   pessoa, com o "sim" dela, `git merge origin/<base>` (conflito → resolva e repita Passos 2–4); como agente,
   pare e devolva "branch desatualizada com a base". Esse merge (da base para a branch) é sempre de
   uma pessoa; o do PR é da `sa-desenvolver` (Passo 6). Atualizar é sempre por merge da base, nunca por rebase (nem
   pelo botão Rebase do GitLab): o rebase reescreve os commits, o `sha` aprovado some e a mudança volta à revisão.
2. Texto do PR:
   ```
   FT-<nnn> — <título>   (<EP-<nn> | Manutenção> · <IB | DF> <id ELM | —>)
   O quê: <1–3 linhas do comportamento entregue>
   Cobre: HF-01 · 1.1, 1.2 · REG-01   (ELM: <ids | pendente>)
   Plano: .kiro/specs/<ft>-<slug>/ (research · requirements · design · tasks)
   Revisão: <AFK: revisao-codigo-<N>.md (APROVADO) · Aceite: verificacao.md (ACEITO, <n> cenários) | HITL: revisão automática OK (achados aceitos: …) — revisão e aceite no PR>
   Backpressure: compilar ok · testes ok · lint ok · cobertura <x% | sem gate>
   Banco (DDL): <não se aplica | pendente — implantação bloqueada>
   ADRs: <adr/<arquivo>, … | nenhum> · ET as-built: <elm/ET-<slug>.md | não se aplica>
   Como ler: <ordem sugerida dos arquivos — do teste do cenário principal para o código que ele exercita>
   Reversível? <sim, só reverter o PR | não: dado migrado/contrato publicado — o que fazer>
   ```
   O PR é para uma pessoa **ler o código**: pequeno, com a evidência e o caminho de leitura, sem despejar o plano.
3. **Entrega**, nesta ordem — quem vem depois só acha no remoto o que você publicou:
   1. **Commit** do que faltar (árvore limpa).
   2. **Push** da branch da fatia: `git push -u origin <branch>` (nunca a base; o Kiro pergunta). Push recusado
      (pela pessoa ou pela regra) → entregue o comando pronto e espere a pessoa dizer que publicou. Push "não" →
      a branch não foi publicada e não há PR (nem PR atualizado): a fase não muda (AFK: `verificada`; HITL:
      `implementando`); pare em "aguardando o PR", com o título e a descrição do item 2.
   3. **Confira no remoto:** `git fetch` e `git rev-parse HEAD` = `git rev-parse origin/<branch>`. Diferente → não
      siga: diga o que falta.
   4. **PR** pelo MCP `gitlabpr`: `gitlab_listar_mrs(origem=<branch>, estado=opened)` — já existe (retrabalho) → é
      esse, e o push já o atualizou; senão `gitlab_criar_mr(titulo, destino=<base>, origem=<branch>, descricao=<texto
      do item 2>)`, que o Kiro confirma. Sem o MCP no `sabia.md`, ou com falha → título e descrição prontos, e a
      pessoa abre o PR e passa o link.
   5. **Confira o PR aberto:** `gitlab_listar_mrs(origem=<branch>, estado=opened)` devolve o PR; o link é a `url`.
      Sem o MCP → o link que a pessoa passou.
   6. **AFK — a `[APR] FT-<nnn> Aprovar PR`:** pergunte qual Dev Sênior aprova o PR (sugira outro que não quem
      implementa; ele mesmo só se for o único Dev Sênior ativo) → a `[APR]` de
      [elm-sprint.md](../sa-planejamento/references/elm-sprint.md) §8, com "sim". Sem o MCP `elm` → `ELM pendente [APR FT-<nnn>
      criar]: <login de quem aprova>` no Histórico.
   7. `status.md`: HITL → `fase: pr-aberto`; AFK → `fase: aguardando-aprovacao-pr`; link do PR (sem o MCP `gitlabpr`,
      item 4: o que a pessoa passou ou `PR: texto entregue` — o push foi feito, e a fase é a mesma; push "não" já parou
      no item 2); linha no Histórico e os **créditos da sessão** na seção Créditos
      ([`sa-status`](../sa-status/SKILL.md#fechar-a-sessão), item 4). Commit, push e conferência como nos itens 1–3
      (o `status.md` vai junto no PR).
   8. **Horas da sessão** na `[DEV]`: `elm_horas(<id>)` → desconte → `elm_lancar_horas(<id>, <h>)`, com "sim" — lança, não conclui (retrabalho: as horas
      também na tabela Retrabalho). Sem o MCP `elm` → `ELM pendente [DEV FT-<nnn> horas]: lançar <h>h` no
      Histórico. **A `[DEV]` não é concluída no PR:** fica em andamento até o merge (`sa-desenvolver`, Passo 6).
   9. **Avise:** HITL → o revisor, de que a `[REV]` está disponível; AFK → o Dev Sênior da `[APR]`, de que o PR
      espera a leitura dele (`sa-revisar`, Aprovação do PR).

**Aqui a skill termina:** mostre o link do PR e quem foi avisado, e pare. O que vem depois é de outros papéis e de
outro momento: a `[REV]` e a `[VER]` (HITL) ou a `[APR] Aprovar PR` (AFK); o merge do PR aprovado é do Dev, pela
**`sa-desenvolver`** (Passo 6), quando a fatia chegar a `aceita` (HITL) ou, no AFK, com a `[APR] Aprovar PR`
concluída em `aguardando-aprovacao-pr`; a consolidação, depois do merge, é do
P.O. ou do SM (`sa-consolidar`, agente `sa-produto`). Pedido de merge ou de consolidação nesta sessão ("o PR foi
aprovado", "mergeia", "consolida") → diga "use `sa-desenvolver FT-<nnn>`" (ou, para consolidar, quem consolida) e
pare: aprovação dita na conversa não vale — o merge confere a que está registrada.

## Toolkit na codificação

Passo `codificador` de [passos.md](../sabia/references/passos.md). Tarefa com `_Toolkit: <nome>_` no `tasks.md`
(anotada no plano e aprovada no GATE):

- **Sem agente** (coluna Agente `—` nos **Passos de toolkit** do `sabia.md`) → carregue a skill do passo e faça o
  ciclo do Passo 1 por ela.
- **Com agente** → delegue a tarefa com o briefing de codificação de
  [passos.md](../sabia/references/passos.md#sem-agente-e-com-agente) (a tarefa, `design.md`, `research.md`, os
  pontos de teste e os comandos) e o contrato: código e testes da tarefa, dentro do escopo, e o resumo dos
  arquivos; sem commit, push nem PR.
- **Depois, sempre o Sabiá:** confira que só mudaram arquivos da tarefa (`git status`), rode o
  `sh .sabia/verificar.sh` (evidência, não afirmação) e siga os itens 6 e 7 do Passo 1 (marcar, Histórico,
  commit). Fora do escopo ou vermelho → devolva uma vez com a falha; de novo → divergência (Passo 1).

## Modo autônomo

`AUTONOMO=true` (chamado pelo `sa-orquestrador`/`sa-loop`): sem perguntas; trabalhe só na worktree recebida;
**não** faça push nem abra PR (o orquestrador faz); bloqueio vira `fase: bloqueada (de: <fase>)` com o motivo e a pergunta, e você para.

## Regras

- Nunca `--force`; merge só o da base para a branch, por uma pessoa (Passo 5), e o do PR aprovado, pelo Dev
  responsável (`sa-desenvolver`, Passo 6); push, aqui, só da branch da fatia, nunca da base (os registros de situação
  na base são da `sa-desenvolver`), com confirmação (ou pelo orquestrador, com a autorização do lote); depois de todo
  push, conferir no remoto antes de seguir.
- Nada fora do escopo do `design.md`; melhoria vista no caminho vira sugestão de item no backlog (registrada pela `sa-triar`).
- Não invoque nem simule outra skill do fluxo: ao terminar (PR entregue, bloqueio, divergência), diga a próxima e
  pare. Os subagentes revisor e verificador, que os passos mandam chamar, fazem parte desta skill.
