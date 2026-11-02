---
{"resumo": "Nesta ordem: revisor e verificador da fatia que virou HITL na primeira atribuição, iniciada na base com push conferido, branch confirmada, pasta com status.md e .config.kiro, assumir a [DEV], commit e Próximo: sa-plano."}
---
## Entrada

O compromisso conferido (passo `compromisso`), ou a retomada da `iniciada` sem `status.md` em nenhuma branch (passo
`entrada`): só o `responsavel` da linha retoma, a partir do item 3, depois de conferir a `iniciada` em `origin/<base>`
(`git show origin/<base>:<produto>/backlog.md`; só no local → antes, o push da `iniciada` do item 2).

## Faça

Nesta ordem: a `iniciada` chega à base antes da branch — é ela que diz ao time (e a um segundo Dev) que a fatia
começou.

1. **Revisor e verificador** — só na fatia que virou **HITL na primeira atribuição** (passo `compromisso`), sem
   revisor nem verificador na linha da sprint. Pergunte quem revisa e quem verifica (sugira pelo `equipe.json`:
   papéis, `senioridade` e `horas-revisao-semana`): o revisor é um **Dev Sênior** ativo que não é quem implementa —
   quem implementa é o único Sênior ativo → ele mesmo, com `revisor único`; o verificador nunca é quem implementa.
2. **`iniciada` na base** — pelo bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base),
   variante do Dev: no `backlog.md`, `status` `iniciada` e, se estava `—`, `responsavel` = quem implementa (e o modo
   da primeira atribuição, com o `obs`); no `sprint-<nn>.md` aberto, na linha da fatia, Status `iniciada` (e, se o
   modo mudou, o Modo, o revisor e o verificador do item 1 ou `—` no AFK, mais `revisor único`, se for o caso).
   Commit `<FT> iniciar`. A branch só nasce com o push conferido (sem remoto: o Registro publicado do passo
   `compromisso`). Push recusado → o bloco desfaz o commit de registro e para: rode de novo (outra pessoa pode ter
   iniciado a fatia — o passo `entrada` mostra).
3. **Branch** — sugira e **aguarde**:
   ```
   Branch sugerida: <prefixo do sabia.md><ft>-<slug>   (ex.: feature/ft-031-bloquear-conta)
   Confirma, ou informe outro nome:
   ```
   Confirmado → `git fetch` e `git switch -c <branch> origin/<base>` (já com a `iniciada`).
4. **Pasta** `.kiro/specs/<ft>-<slug>/` com `status.md` do padrão `sa-desenvolver/status.md`
   e o `.config.kiro` da spec do Kiro (`specType` `feature` na trilha padrão, `bugfix` na rápida — formato no
   padrão `sa-plano/plano.md`).
5. **Assumir a `[DEV]`** (com o MCP `elm`; nunca sem "sim") — `elm_transicao(<id da [DEV]>, "assumir",
   iniciar_pai: true)`, com `estimativa_h` se faltar (regras: [elm.md](~/.sabia/framework/skills/sabia/references/elm.md)), pela
   seção Assumir do passo `sa-desenvolver.desenvolver.entrada`. O item de backlog continua do P.O. **Já fechada** (`precondicao` "já concluída:
   reabra antes": alguém a fechou à mão) com o PR da fatia mergeado (`gitlab_listar_mrs(origem=<branch>,
   estado=merged)`; sem o MCP, a pessoa diz) → **fluxo `sa-desenvolver.encerrar`**, da conferência do merge; sem o PR
   mergeado, a seção Assumir (reabrir com "sim").
   Tarefa ainda fora da sprint (a publicação do planejamento ou do encaixe falhou) → antes, o IB (ou o item de
   origem) sai do backlog do EWM para a iteração da sprint (`elm_atualizar_wi(id, iteracao)`; `elm` `pendente` →
   crie-o; id sem link, como `DF 4567` → complete o que a triagem não fez, como a publicação da sprint) e cada tarefa
   que já existe move na chamada dela, com o dono e a estimativa do papel — `elm_atualizar_wi([id], iteracao, dono,
   estimativa_h)`: a `[DEV]` com quem implementa, a `[REV]` e a `[VER]` com o revisor e o verificador da linha —; só
   nasce o papel que falta, conferido com `elm_listar_wi(pai = IB)`, sem contar a tarefa descartada nem a que tem
   pendência de cancelamento aberta ([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md), topo e
   §3–4; pai sempre definido):

   | Fatia | Tarefas | Pai |
   |---|---|---|
   | de épico (padrão) | `[DEV]` `[REV]` `[VER]` | IB da fatia, filho do épico |
   | sem épico, com item de origem (DF, IB) | `[DEV]` `[REV]` `[VER]` | o próprio item de origem, sob a Manutenção — **sem IB novo** |
   | sem épico, pedido em texto | `[DEV]` `[REV]` `[VER]` | IB `[FT-nnn]`, filho da Manutenção |

   Fatia **AFK**: só a `[DEV]`, em qualquer linha — revisão e verificação são subagentes, sem tarefa; a `[REV]` e a
   `[VER]` da fatia que virou AFK na primeira atribuição não movem: `elm_transicao(<id>, "cancelar")`, no mesmo "sim";
   sem o MCP, com `precondicao` ou erro → `ELM pendente [<tipo> <id> cancelar]` no `status.md` (elm-sprint.md, topo).
   Fatia que virou **HITL** na primeira atribuição: a `[REV]` e a `[VER]` nascem para o revisor e o verificador do
   item 1.

   Grave os ids das tarefas, as que moveram inclusive, no campo ELM do `status.md` (`DEV <id> · REV <id> · VER <id>`)
   e, se o item nasceu ou foi completado aqui, o dele (`IB <id>` ou `DF <id>`) — é por ele que as horas acham a
   tarefa; a `sa-consolidar` os leva à coluna `elm` do backlog e à Tarefa ELM da sprint. Sem o MCP `elm`:
   `ELM pendente [DEV FT-<nnn> assumir]` no `status.md`.
6. Commit pequeno do `status.md` e do `.config.kiro` e, com "sim", push da branch — publicada, quem retoma (e a
   `sa-status`) acha o `status.md`.
7. Mostre e pare:
   ```
   🚦 FT-<nnn> — <título>   ·   trilha <…> · modo <AFK|HITL> · fase pesquisando
   Origem: <EP-nn — título | Manutenção> · Cobre: <… | ficha C1–Cn> · Branch: <…> · Pasta: .kiro/specs/<ft>-<slug>/
   Próximo: sa-plano FT-<nnn>
   ```

## Saída

`iniciada` na base, branch, pasta com `status.md` e `[DEV]` assumida (ou `ELM pendente`), commitados → o bloco do
item 7: o próximo é o fluxo `sa-plano.plano`. `[DEV]` já fechada com o PR mergeado (item 5) → fluxo
`sa-desenvolver.encerrar`, da conferência do merge.

## Pare se

- Retomada da `iniciada` sem `status.md` por quem não é o `responsavel` da linha → "iniciada por <login> em <data do
  commit `<FT> iniciar`>, sem branch publicada" e pare.
- Push da `iniciada` recusado (item 2): o bloco desfaz o commit de registro e para.
- Depois do bloco do item 7: diga a próxima e **pare**; nunca invoque nem simule a `sa-plano`.
