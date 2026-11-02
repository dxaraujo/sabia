---
{"resumo": "Com a aprovação registrada: lê o PR, confere o sha aprovado, merge com confirmação, registro de pronta na base (lições, créditos), conclusão da [DEV], worktree e aviso ao P.O. ou SM."}
---
## Entrada

A fatia deste fluxo (passo `entrada`): em `aceita` (HITL) ou em `aguardando-aprovacao-pr` (AFK), o merge, o registro
na base e a conclusão da `[DEV]` são do Dev responsável, aqui. Também o PR já mergeado com a aprovação registrada
(abaixo; a sessão do merge parou): siga do item 5 — a `pronta` só com o merge conferido.

## Faça

**Já registrado?** `git fetch` e o `status.md` da fatia em
`origin/<base>` com `Fase: pronta` ou `concluida` → o merge já foi registrado — aqui ou pela sincronização
([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §9), que também grava `pronta` pela evidência do merge
feito por fora, com Créditos e lições `—`: com a `[DEV]` ainda aberta, siga do item 7. Vale
a aprovação **registrada**, nunca a dita na conversa ("o PR foi aprovado", "pode mergear"; o P.O. não aprova PR):
- **HITL:** revisão `APROVADO` e verificação `ACEITO` registradas (é o que leva a fatia a `aceita`);
- **AFK:** a `[APR] FT-<nnn> Aprovar PR` está **concluída** e tem o comentário `PR aprovado, sha <sha>` (`elm_ler_wi(<id>,
  comentarios: true)`, só leitura). Sem o MCP `elm` → a linha `PR aprovado por <login>, sha <sha>` que o
  aprovador entregou.

1. **Leia o PR:** `gitlab_obter_mr` pelo `iid` do link no `status.md`. Tem de estar aberto, sem WIP/Draft e sem
   conflito. `merged` → vá ao item 5; `closed` ou WIP → avise e pare. **Conflito** com a base → `fase: retrabalho
   (de: <aceita | aguardando-aprovacao-pr>)` e, no Histórico, a linha `conflito no merge` com os arquivos (é por ela
   que o passo `sa-codificar.codificar.onde` separa este caso das mudanças pedidas na `[APR]`, que gravam a mesma fase);
   commit, push e conferência no remoto (como na Entrega do passo `sa-codificar.codificar.pr`)
   e pare: a `sa-codificar` atualiza a branch, e a mudança passa de novo pela revisão.
2. **Commit aprovado:** o `sha` do PR = `git rev-parse origin/<branch>` e é o commit que foi aprovado — HITL: o da
   entrega da verificação (o último commit que mudou o `verificacao.md`, `git log -1 --format=%H -- <pasta da fatia>/verificacao.md`, e nele o veredito `ACEITO` — não depende do padrão de mensagem do projeto); AFK: o `sha` do
   comentário da `[APR]`. Commit depois da aprovação → só vale se a base só trouxe registros: o aprovado segue na
   história do PR (`git branch -r --contains <sha aprovado>` lista `origin/<branch>`; o `git merge-base` cai na
   negação do `git merge` dos agentes) e `git diff --name-only <sha aprovado>
   <sha do PR>` cabe no critério de branch atualizada com a base do passo `sa-codificar.codificar.pr` (a branch atualizada por merge da base,
   como em projeto com merge fast-forward ou semi-linear no GitLab); senão, não mergeie: a mudança volta à revisão.
   Branch rebaseada (botão Rebase do GitLab) também volta: o `sha` aprovado some (HITL: o commit da verificação
   reescrito, com data de commit diferente da de autoria) — o Sabiá atualiza a branch por merge da base.
3. **Resumo e confirmação:**
   ```
   🔀 Merge FT-<nnn> — <título>
   PR !<iid> <origem> → <destino> · sha <curto> · aprovado: <REV APROVADO + VER ACEITO | por <login>>
   Mergear? (sim/não)
   ```
4. **Merge:** `gitlab_mesclar_mr(iid, sha=<sha do PR, conferido no item 2>, remover_origem=true)` — o Kiro também
   confirma; a branch não guarda mais nada (o `status.md` chega à base com o merge, e o registro é lá: item 6). Sem
   o MCP, sem permissão de merge ou recusa do GitLab (conflito → item 1) → a pessoa faz o merge na UI do GitLab, sem
   o botão Rebase (item 2), e diz "mergeado".
5. **Confira:** `gitlab_obter_mr(iid)` (ou `gitlab_listar_mrs(origem=<branch>, estado=merged)`) com estado `merged`
   — inclusive no merge pela UI. Sem o MCP → `git fetch` e `git diff origin/<base> <branch> -- <arquivos que a fatia
   mudou>` vazio (a branch local: a remota sai no merge). Não mergeado → pare.
6. **Registro do merge na base** — pelo bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base),
   variante do Dev; o `status.md` já chegou à base com o merge:
   - **Lições candidatas** no `status.md` — antes de fechar a `[DEV]`: mantenha as linhas que a revisão, a
     verificação e a aprovação já gravaram na branch e acrescente a que o aprovador entregou com a `[APR]` (AFK);
     depois, liste as outras correções humanas que a fatia
     recebeu (tabela Retrabalho; Achados abertos de origem PR ou GATE do plano; bloqueio resolvido por uma pessoa;
     "não é assim" no Histórico) e, com a pessoa, grave uma linha por correção: feito × certo, onde estava o certo e
     a causa proposta (tabela de causas do passo `sa-aprender.registrar.causa`). Correção sem lição
     (ambiente, digitação) → causa `—`; `nenhuma` só com a seção vazia e nenhuma correção. O `licoes.md` é da base: quem o grava é a
     consolidação.
   - `Fase: pronta`; no Histórico, `merge do PR <link> por <login>` (AFK: antes, `PR aprovado por <login>, sha <sha>`,
     do comentário da `[APR]` ou a linha que o aprovador entregou); sem o MCP `elm`, também `ELM pendente [<chave>]:
     lançar <h>h e concluir [DEV] FT-<nnn>` e, no AFK, a `ELM pendente [APR FT-<nnn> concluir]: …` que o aprovador
     entregou.
   - **Créditos** na seção Créditos ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4): os desta
     sessão; no AFK, a linha da `[APR]` que veio no comentário `PR aprovado` (ou que o aprovador entregou); e a
     sessão do loop, que só fecha o consumo no fim do turno — o script a lista como sem registro: com o "sim",
     `rateio 1/<n>` pelas fatias do lote.
   - `pronta` na linha da fatia no `backlog.md` e na da sprint dela.

   Commit `<FT> registrar merge` só com o `status.md`, o `backlog.md` e o `sprint-<nn>.md`; push com a conferência.
   Na branch, nada: antes do merge, um commit nela mudaria o `sha` aprovado.
7. **Conclusão da `[DEV]`** (depois do push do item 6): mostre as horas já lançadas (`elm_horas(<id>)`) e pergunte
   só o saldo → `elm_lancar_horas(<id>, <saldo>)` e `elm_transicao(<id>, "concluir")`, numa confirmação (`[DEV]` já
   fechada, no Assumir a `[DEV]` do passo `sa-desenvolver.desenvolver.iniciar` → só o saldo). Sem o MCP
   `elm`, a pendência já foi no item 6.
8. **Worktree do loop** (`.sabia/local/wt/<ft>`): depois do merge, `git worktree remove .sabia/local/wt/<ft>` —
   **sem `--force`**; os agentes não podem (negado a todos): entregue o comando e a pessoa o roda. Falhou por arquivos
   não rastreados ou alterados → mostre quais (evidência com dado real fica em `.sabia/local/verificacao/`, fora da
   worktree) e deixe a pessoa decidir; nunca force.
9. **Avise o P.O. ou o SM** de que a fatia está `pronta` para a consolidação (**`sa-consolidar`**, no agente
   `sa-produto`, com os créditos num comentário na `[GB]`; horas, só do SM) e **pare**: a consolidação não é do Dev.

## Saída

A fatia `pronta` na base, a `[DEV]` concluída (ou `ELM pendente`) e o P.O. ou o SM avisado (item 9): aqui o fluxo
termina.

## Pare se

- **Já registrado** e a `[DEV]` não está mais aberta → diga isso e pare.
- Sem a aprovação registrada → avise que o PR espera a leitura do Dev Sênior e pare.
- PR `closed` ou WIP (item 1) → avise e pare; conflito com a base (item 1) → registre o retrabalho e pare.
- Commit depois da aprovação fora do critério, ou branch rebaseada (item 2) → não mergeie: a mudança volta à revisão.
- Não mergeado (item 5) → pare.
- Depois do aviso (item 9): a consolidação não é do Dev.
