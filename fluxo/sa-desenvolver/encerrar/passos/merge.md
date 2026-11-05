---
{"resumo": "Com a aprovação registrada e sem possível alteração pendente: lê o PR, confere o sha aprovado, merge com confirmação, registro de pronta na base (lições, créditos), conclusão da [DEV] com o vínculo aos requisitos que a fatia cobre (HITL), worktree e aviso ao P.O. ou SM."}
---
## Entrada

A fatia deste fluxo (passo `entrada`): em `aceita` (HITL) ou em `aguardando-aprovacao-pr` (AFK), o merge, o registro
na base e a conclusão da `[DEV]` são do Dev responsável, aqui. Também o PR já mergeado com a aprovação registrada
(abaixo; a sessão do merge parou): siga do item 5 — a `pronta` só com o merge conferido. Quem está na sessão não é o
`responsavel` da linha da fatia no `backlog.md` da base (no loop, quem disparou) → avise (`a fatia é de <login>`) e
siga; as horas da `[DEV]` (item 7) ficam com o dono: o saldo é o dele.

## Faça

**Já registrado?** `git fetch` e o `status.md` da fatia em
`origin/<base>` com `Fase: pronta` ou `concluida` → o merge já foi registrado — aqui ou pela sincronização
([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §9), que também grava `pronta` pela evidência do merge
feito por fora, com Créditos e lições `—`: com a `[DEV]` ainda aberta, siga do item 7. Vale
a aprovação **registrada**, nunca a dita na conversa ("o PR foi aprovado", "pode mergear"; o P.O. não aprova PR):
- **HITL:** revisão `APROVADO` e verificação `ACEITO` registradas (é o que leva a fatia a `aceita`);
- **AFK:** a `[APR] FT-<nnn> Aprovar PR` está **concluída** e tem o comentário `PR aprovado, sha <sha>` (`elm_ler_wi(<id da [APR]>,
  comentarios = -1)`: todos; só leitura). Sem o MCP `elm` → a linha `PR aprovado por <login>, sha <sha>` do
  comentário do aprovador no MR. O que o aprovador entregou (a lição, os créditos, as pendências) está nesse
  comentário: o da `[APR]` ou, sem o MCP `elm`, o do MR.

1. **Leia o PR:** `gitlab_obter_mr` pelo `iid` do link no `status.md`. Tem de estar aberto, sem WIP/Draft e sem
   conflito. `merged` → vá ao item 5; `closed` ou WIP → avise e pare. **Conflito** com a base → `fase: retrabalho
   (de: <aceita | aguardando-aprovacao-pr>)` e, no Histórico, a linha `conflito no merge` com os arquivos (é por ela
   que o passo `sa-codificar.codificar.onde` separa este caso das mudanças pedidas na `[APR]`, que gravam a mesma fase);
   commit `<FT> registrar bloqueio`, push e conferência no remoto (como na Entrega do passo `sa-codificar.codificar.pr`)
   e pare: a `sa-codificar` atualiza a branch, e a mudança passa de novo pela revisão. Sem o MCP `gitlabpr`, ou com
   o campo PR `texto entregue` → a pessoa confere na UI do GitLab e diz: aberto, sem Draft e sem conflito, e o link
   (grave-o no campo PR); o `sha` do PR é `git rev-parse origin/<branch>` (item 2).
2. **Commit aprovado:** o `sha` do PR = `git rev-parse origin/<branch>` e é o commit que foi aprovado — HITL: o da
   entrega da verificação (o último commit que mudou o `verificacao.md`, `git log -1 --format=%H -- <pasta da fatia>/verificacao.md`, e nele o veredito `ACEITO` — não depende do padrão de mensagem do projeto); AFK: o `sha` do
   comentário da `[APR]`. Commit depois da aprovação → só vale se a base só trouxe registros: o aprovado segue na
   história do PR (`git branch -r --contains <sha aprovado>` lista `origin/<branch>`; o `git merge-base` cai na
   negação do `git merge` dos agentes) e `git diff --name-only <sha aprovado>
   <sha do PR>` cabe no critério de branch atualizada com a base do passo `sa-codificar.codificar.pr` (a branch atualizada por merge da base,
   como em projeto com merge fast-forward ou semi-linear no GitLab); senão, não mergeie: a mudança volta à revisão.
   Branch rebaseada (botão Rebase do GitLab) também volta: o `sha` aprovado some (HITL: o commit da verificação
   reescrito, com data de commit diferente da de autoria) — o Sabiá atualiza a branch por merge da base.
3. **Resumo e confirmação** — antes, a possível alteração: o Drift de negócio do `status.md` com `possível
   alteração — …` sem ` · especificação:`, ou com a `[ESP] FT` dele ainda não `concluida` (a linha dela na seção
   Especificação do `sprint-<nn>.md` da base) → `Possível alteração pendente: <artefatos> — o merge espera a decisão
   (HITL: revisor/verificador; AFK: Dev Sênior na [APR]) ou a [ESP] FT-<nnn>.` e pare.
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
     verificação e a aprovação já gravaram na branch e acrescente a que o aprovador entregou (AFK);
     depois, liste as outras correções humanas que a fatia
     recebeu (tabela Retrabalho; Achados abertos de origem PR ou GATE do plano; bloqueio resolvido por uma pessoa;
     "não é assim" no Histórico) e, com a pessoa, grave uma linha por correção: feito × certo, onde estava o certo e
     a causa proposta (tabela de causas do passo `sa-aprender.registrar.causa`). Correção de ambiente (build, dado
     ou serviço de teste) → causa `ambiente`; digitação ou engano sem causa no processo → `—`; `nenhuma` só com a
     seção vazia e nenhuma correção. O `licoes.md` é da base: quem o grava é a
     consolidação.
   - `Fase: pronta`; no Histórico, `merge do PR <link> por <login>` (AFK: antes, `PR aprovado por <login>, sha <sha>`,
     do comentário da `[APR]` ou a linha que o aprovador entregou); sem o MCP `elm`, pergunte o saldo de horas e
     grave também `ELM pendente [DEV FT-<nnn> concluir]: lançar <saldo>h e concluir a [DEV] FT-<nnn>` e, no AFK, a `ELM pendente [APR FT-<nnn> concluir]: …` que o aprovador
     entregou; e `ELM pendente [DEV FT-<nnn> ligar]: ligar a [DEV] a <rótulos>` — HITL: sem o MCP, ou com o
     requisito que a fatia cobre ainda sem `id` (a `[ESP]` dele com `ELM pendente … publicar`); AFK: a que o
     aprovador entregou.
   - **Créditos** na seção Créditos ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4): os desta
     sessão; no AFK, a linha da `[APR]` que veio no comentário `PR aprovado` (ou que o aprovador entregou); e a
     sessão do loop, que só fecha o consumo no fim do turno: sessão sem registro com o título do loop do
     `sa-orquestrador` que levou esta fatia → com o "sim", Sessão `<id> (rateio 1/<n>)`, com `<n>` = o número de
     fatias do lote no log `.sabia/local/loop-<AAAA-MM-DD-HHMM>.md` (padrão `sa-orquestrar/log.md`).
   - `pronta` na linha da fatia no `backlog.md` e na da sprint dela.

   Commit `<FT> registrar merge` só com o `status.md`, o `backlog.md` e o `sprint-<nn>.md`; push com a conferência.
   Na branch, nada: antes do merge, um commit nela mudaria o `sha` aprovado.
7. **Conclusão da `[DEV]`** (depois do push do item 6): mostre as horas já lançadas (`elm_horas(<id>)`) e pergunte
   só o saldo → `elm_lancar_horas(<id>, <saldo>)`, `elm_transicao(<id>, "concluir")` e, no HITL, `elm_ligar(wi = <id
   da [DEV]>, req = <id>, tipo implementa)` por requisito que a fatia cobre
   ([vínculos](~/.sabia/framework/skills/sabia/references/elm.md#vínculos-cada-um-liga-o-que-gera)), numa confirmação
   (`[DEV]` já fechada, no Assumir a `[DEV]` do passo `sa-desenvolver.desenvolver.iniciar` → só o saldo e os
   vínculos). No AFK, os vínculos são da `[APR]` (passo `sa-revisar.aprovar-pr.decidir`). Sem o MCP `elm`, as
   pendências já foram no item 6.
8. **Worktree do loop** (`.sabia/local/wt/<ft>`): depois do merge, `git worktree remove .sabia/local/wt/<ft>` —
   **sem `--force`**; os agentes não podem (negado a todos): entregue o comando e a pessoa o roda. Falhou por arquivos
   não rastreados ou alterados → mostre quais (evidência com dado real fica em `.sabia/local/verificacao/`, fora da
   worktree) e deixe a pessoa decidir; nunca force.
9. **Avise o P.O. ou o SM** de que a fatia está `pronta` para a consolidação (**`sa-consolidar`**, agente
   `sa-produto`) e **pare**: a consolidação não é do Dev, e o Dev não comenta nem lança horas na `[GB]`.

## Saída

A fatia `pronta` na base, a `[DEV]` concluída (ou `ELM pendente`) e o P.O. ou o SM avisado (item 9): aqui o fluxo
termina.

## Pare se

- **Já registrado** e a `[DEV]` não está mais aberta → diga isso e pare.
- Sem a aprovação registrada → avise que o PR espera a leitura do Dev Sênior e pare.
- Possível alteração pendente (item 3) → avise e pare: o merge só sai com ela decidida ou com a `[ESP]` concluída.
- PR `closed` ou WIP (item 1) → avise e pare; conflito com a base (item 1) → registre o retrabalho e pare.
- Commit depois da aprovação fora do critério, ou branch rebaseada (item 2) → não mergeie: a mudança volta à revisão.
- Não mergeado (item 5) → pare.
- Depois do aviso (item 9): a consolidação não é do Dev.
