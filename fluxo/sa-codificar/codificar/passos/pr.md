---
{"resumo": "ADRs e ET as-built (ligada à ET inicial do épico, se houver), branch atualizada pela base, texto do PR (padrão sa-codificar/pr.md), commit, push conferido, PR pelo gitlabpr, [APR] no AFK, status.md, horas e aviso."}
---
## Entrada

Com a revisão automática feita (HITL) ou com `fase: verificada` (AFK: revisão `APROVADO` e verificação `ACEITO`).

Push e PR são do Dev: o agente `sa-desenvolvedor` (o Kiro confirma cada um) ou a sessão da pessoa; no loop, o
`sa-orquestrador` (fase 8 do passo `sa-orquestrar.orquestrar.fases`). Modo autônomo: nada deste passo.

## Faça

0. **ADRs:** cada decisão do `design.md` com "Vira ADR? sim" → um ADR curto em `.kiro/specs/<ft>-<slug>/adr/<slug-da-decisão>.md`
   (corpo: `# <decisão>` · `## Contexto` · `## Decisão` · `## Consequências` · `Origem: FT-<nnn>`), descrevendo o que o código faz. Vai no PR: o Dev Sênior
   o julga na `[REV]` ou na `[APR]` (rubrica C15); a pasta de ADRs do projeto é artefato de produto (nunca em branch
   de fatia) — a consolidação o leva para lá.
   **ET as-built** (só se a linha ET da seção ELM do `sabia.md` diz `só as-built` ou `inicial no PRD + as-built`):
   `.kiro/specs/<ft>-<slug>/elm/ET-<slug>.md`, conceito OKF no formato de
   [okf-elm.md](~/.sabia/framework/skills/sa-prd/references/okf-elm.md) (`type` = o tipo de ET do projeto, título
   `ET - FT-<nnn> <título>`, `status: draft`) com o corpo do padrão `sa-prd/et.md`, escrito do `design.md` e do
   código do PR: interfaces, contratos, dados, integrações e decisões técnicas — nada do que não foi feito. Fatia de
   épico com ET inicial (`<produto>/epicos/<EP>-<slug>/elm/ET-*.md`) → ligada a ela: o **Elabora** aponta para a
   inicial (o id publicado, se houver, vira `[<id>](<id>)` na publicação) e ela entra em `sources` como as entradas
   `prd` e `d-nn` — `id: et-inicial`, `resource:` o caminho relativo da ET inicial e o título; nunca a URI do ELM
   nem `id: elm`, que é a do próprio artefato. Fatia sem épico, ou épico sem ET inicial → sem ligação. Retrabalho que muda o que ela descreve a atualiza no mesmo PR. Vai no PR e é julgada
   com os ADRs (rubrica C15); quem a publica no ELM é a consolidação.
1. Branch atualizada com a base? `git fetch` e `git diff --name-only HEAD...origin/<base>`: vazio, ou só
   `<produto>/backlog.md`, `<produto>/sprints/**` e `.kiro/specs/` de outras fatias (os registros de situação que o
   time grava na base) → atualizada. Outro caminho (código, PRD, ficha) → desatualizada: numa sessão com a
   pessoa, com o "sim" dela, `git merge origin/<base>` (conflito → resolva e repita os passos `validar`, `revisar` e
   `verificar`); como agente, pare e devolva "branch desatualizada com a base". Esse merge (da base para a branch) é sempre de
   uma pessoa; o do PR é do fluxo `sa-desenvolver.encerrar`. Atualizar é sempre por merge da base, nunca por rebase (nem
   pelo botão Rebase do GitLab): o rebase reescreve os commits, o `sha` aprovado some e a mudança volta à revisão.
2. Texto do PR: o padrão `sa-codificar/pr.md`.
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
      [elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §8, com "sim". Sem o MCP `elm` → `ELM pendente [APR FT-<nnn>
      criar]: <login de quem aprova>` no Histórico.
   7. `status.md`: HITL → `fase: pr-aberto`; AFK → `fase: aguardando-aprovacao-pr`; link do PR (sem o MCP `gitlabpr`,
      item 4: o que a pessoa passou ou `PR: texto entregue` — o push foi feito, e a fase é a mesma; push "não" já parou
      no item 3.2); linha no Histórico e os **créditos da sessão** na seção Créditos
      ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4). Commit, push e conferência como nos itens 3.1–3.3
      (o `status.md` vai junto no PR).
   8. **Horas da sessão** na `[DEV]`, como no item 3 de Fechar a sessão da
      [`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão): pergunte o tempo desta sessão →
      `elm_horas(<id>)` → desconte o que esta sessão já lançou → `elm_lancar_horas(<id>, <h>)`, com "sim" — lança,
      não conclui (retrabalho: as horas também na tabela Retrabalho). Sem o MCP `elm` → `ELM pendente [DEV FT-<nnn>
      horas]: lançar <h>h (<data>)` no Histórico. **A `[DEV]` não é concluída no PR:** fica em andamento até o merge (`sa-desenvolver.encerrar`).
   9. **Avise:** HITL → o revisor, de que a `[REV]` está disponível; AFK → o Dev Sênior da `[APR]`, de que o PR
      espera a leitura dele (`sa-revisar.aprovar-pr`).

## Saída

**Aqui o fluxo termina:** mostre o link do PR e quem foi avisado, e pare. O que vem depois é de outros papéis e de
outro momento: a `[REV]` e a `[VER]` (HITL) ou a `[APR] Aprovar PR` (AFK); o merge do PR aprovado é do Dev, pelo
fluxo **`sa-desenvolver.encerrar`**, quando a fatia chegar a `aceita` (HITL) ou, no AFK, com a `[APR] Aprovar PR`
concluída em `aguardando-aprovacao-pr`; a consolidação, depois do merge, é do
P.O. ou do SM (`sa-consolidar`, agente `sa-produto`).

## Pare se

- Branch desatualizada, como agente (item 1); push "não" (item 3.2); remoto diferente do local (item 3.3).
- Pedido de merge ou de consolidação nesta sessão ("o PR foi aprovado", "mergeia", "consolida") → diga "use
  `sa-desenvolver FT-<nnn>`" (ou, para consolidar, quem consolida) e pare: aprovação dita na conversa não vale — o
  merge confere a que está registrada.
