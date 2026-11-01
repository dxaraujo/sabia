---
{"resumo": "Acha a fatia pela ordem de consulta (status.md, backlog, EWM, pessoa), decide se é deste papel e se começa, retoma ou trata a troca AFK → HITL."}
---
## Entrada

Um id (`FT-031`, número do EWM), uma tarefa `[DEV]`, "próxima fatia" ou um pedido em texto.

## Faça

**Ordem de consulta** para qualquer id (`FT-031`, número do EWM) — vale a primeira fonte que achar, e nunca se
inventa dado de work item: (1) o `status.md` da fatia nas branches (atual, worktrees, remotas) e na base, pela regra
A base prevalece do padrão `sa-desenvolver/status.md`; (2) o `backlog.md` da base (ids locais e a
coluna `elm`); (3) o EWM (`elm_ler_wi`), se a sessão tem o MCP `elm`; (4) perguntar à pessoa. O EWM e a pessoa só
completam dados: id que não está em (1) nem (2) não está registrado → `sa-triar`. A `fase` do `status.md` decide
se o papel pode começar.

| Entrada | Como ler |
|---|---|
| `FT-nnn` | `<produto>/backlog.md` e a ficha da fatia (coluna `ficha`; de épico, também o PRD que ela cobre) |
| número do EWM (DF, IB) | a linha do `backlog.md` com esse id na coluna `elm`, depois do rótulo (`DF [4567](…)`, `IB [612010](…)`; registrado sem o MCP, `DF 4567`); linha de épico ou da `## Sustentação` → as linhas abaixo |
| tarefa `[DEV] FT-nnn` | a fatia do pai |
| "próxima fatia" | a `planejada` de maior prioridade da sprint aberta (empate: a mais acima na tabela) sem `status.md` em nenhuma branch; nenhuma → a `elegivel` do topo do backlog, também sem `status.md` em branch ou worktree (puxada) |
| `[REV]`, `[VER]`, `EP-nn`/`[ESP]`, item de Sustentação pelo tipo de id (`AT-nnn`, `IM-nnn`…: o IB `[AT-nnn]` ou a tarefa `[ATD]`, `[IMPL]`…) | não é deste papel → "use `sa-iniciar <item>`" e pare (a fatia de Manutenção, `FT-nnn`, é deste papel) |
| pedido em texto, ou id que não está no backlog | não está registrado → "use `sa-triar`" e pare |

Fatia já iniciada (tem pasta em `.kiro/specs/` nesta branch, em worktrees ou em branches remotas —
`git grep -l '<id>' <ref> -- '.kiro/specs/*/status.md'`) → leia o `status.md` e **retome**: o Assumir a `[DEV]` do passo `iniciar`
(já minha e em andamento → `ja_estava`, nada a fazer; já fechada → o `precondicao` de lá) e passo `encaminhar`,
sem repetir o passo `compromisso`; `pronta` ou `concluida` na base → só o passo `encaminhar`. `iniciada` no `backlog.md` sem `status.md` em nenhuma branch (a sessão parou
entre o registro e a branch) → só o `responsavel` da linha retoma, pelo passo `iniciar` a partir da Branch, depois de
conferir a `iniciada` em `origin/<base>` (`git show origin/<base>:<produto>/backlog.md`; só no local → antes, o push
da `iniciada` na base do passo `iniciar`, variante do Dev). Branch
diferente da atual → pergunte se troca (nunca ofereça descartar,
`stash` ou `reset`). **Branch aberta numa worktree** (`git worktree list` mostra `.sabia/local/wt/<ft>` com ela —
fatia do `sa-orquestrar`): não troque, o `git switch` falha; trabalhe na worktree — comandos com
`cd .sabia/local/wt/<ft> && <comando>`, arquivos pelo caminho `.sabia/local/wt/<ft>/<caminho>` — e passe isso à
próxima skill. Vale para todas as skills de papel que precisam da branch da fatia.

**Troca AFK → HITL** (fatia em `bloqueada (de: <fase>)` com `aguardando troca para HITL`, ou com `Modo: AFK` no
`status.md` e `HITL` no `backlog.md`): leia a base sem trocar de branch — `git fetch` e `git show origin/<base>:<produto>/backlog.md` e
`…/sprints/<pai>/sprint-<nn>.md`. A troca só vale registrada lá pelo P.O. (ou SM): `modo` `HITL` no backlog e a
Observação `modo: AFK → HITL (…)` na linha da fatia. Registrada → mostre, com o revisor e o verificador das colunas
Revisor e Verificador da linha da sprint (a Troca de modo, `sa-planejamento.troca-modo`, grava ali; o Histórico não é a fonte), e, com "sim", grave
no `status.md` `Modo: HITL`, os ids da `[REV]` e da `[VER]` (campo ELM, da coluna "Tarefa ELM"), `Bloqueio: —` e a
fase de origem (`planejando`); commit e push. A `[DEV]` é retomada por
`elm_transicao(<id>, "assumir")` (já minha e em andamento → nada a fazer; já fechada → o Assumir a `[DEV]` do passo `iniciar`). Siga no HITL: passo `sa-plano.plano.gate`, com o GATE pela
senioridade. Recusada (Observação `modo: AFK mantido`) → `Bloqueio: —`, fase de origem, segue no AFK. Na troca, o Dev
não grava na base nem cria ou cancela tarefa. **HITL → AFK nunca:** `Modo: HITL` no `status.md` e `AFK` no backlog →
avise a divergência ao P.O. e siga no HITL.

## Saída

Fatia registrada e não iniciada → passo `trilha`. Já iniciada → passo `iniciar` (só o Assumir a `[DEV]`) e passo `encaminhar`; `iniciada`
sem `status.md`, pelo `responsavel` → passo `iniciar`, da Branch; `pronta` ou `concluida` na base → passo `encaminhar`.
Troca AFK → HITL registrada → passo `sa-plano.plano.gate`.

## Pare se

- Item que não é deste papel, ou não registrado (tabela acima) → "use `sa-iniciar <item>`" ou "use `sa-triar`" e pare.
- `iniciada` sem `status.md` em nenhuma branch e quem pede não é o `responsavel` da linha (outra pessoa) →
  "iniciada por <login> em <data do commit `<FT> iniciar`>, sem branch publicada" e pare.
- `dividida` ou `cancelada` no `backlog.md` → nada a retomar: diga isso (a `obs` aponta a substituta) e pare.
- Branch diferente da atual, com alterações locais não commitadas → avise e pare.
- Troca AFK → HITL nem registrada nem recusada (nenhuma das duas) → diga que a troca é do P.O. (`sa-planejamento.troca-modo`) e pare.
