---
name: sa-iniciar
description: "Start hub of the Sabiá flow — receives an already registered work item (FT-031, EP-03, AT-012, IM-003, a DF or IB the backlog knows, a [DEV] [REV] [APR] [VER] [ESP] [GB] [ATD] [IMPL] [BD] [INF] [OPE] [EXT] task) or \"minha próxima tarefa\", figures out its type and says which role skill to use: sa-desenvolver (Dev), sa-revisar (Revisor and [APR]), sa-verificar (QA), sa-especificar (Especificador), sa-atender (Atendimento), sa-executar (the other Sustentação categories), sa-codificar (verified AFK slice (fatia): open the PR), sa-consolidar (slice in pronta: PR merged) or sa-planejamento (mode switch, sprint); a new request or an item outside the backlog goes to sa-triar. Use when the user says \"iniciar\", \"começar\", \"pegar a task 123\", \"vamos trabalhar na FT-031\", \"iniciar o AT-012\", \"minha próxima tarefa\", \"o que eu pego agora?\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "1.1.3"
---

# sa-iniciar — Hub: qual skill faz este item

Cada tarefa do EWM tem um papel e uma skill dona, que pode ser chamada direto por quem tem o papel. Esta skill
descobre o tipo do item e diz qual é: não confere compromisso, não cria branch e não mexe no EWM — a skill do papel
faz isso, começando por assumir a própria tarefa (`elm_transicao(<id>, "assumir")`).

Leia antes: `.sabia/sabia.md`. Sem ele → ofereça a **`sa-setup`** ("configurar o Sabiá") e pare.

## Passo 1 — Identificar o item

**Ordem de consulta** — vale a primeira fonte que achar, e nunca se inventa dado de work item: (1) `status.md` nas
branches (atual, worktrees, remotas: `git grep -l '<id>' <ref> -- '.kiro/specs/*/status.md'`) e na base, pela regra
A base prevalece do [`status-template.md`](../sa-desenvolver/references/status-template.md); (2) o `backlog.md`
da base (ids locais e as colunas `origem` e `elm`, inclusive as `### <Categoria>` da `## Sustentação`); (3) o EWM
(`elm_ler_wi`), se a sessão tem o MCP `elm` (o título da tarefa traz o tipo: `[DEV] FT-031 …`); (4) perguntar à
pessoa. Id que não está em (1) nem (2) não está registrado. Fatia `concluida`, `dividida` ou `cancelada` no
`backlog.md` → mostre a situação (e a `obs`) e pare: o `status.md` de uma branch não vale.

**Número do EWM** (DF, IB): quem decide é o tipo do id local da linha que o tem na coluna `elm` (`FT-`, `EP-`, `AT-`,
`IM-`…), não o tipo do work item. O IB `Sustentação`, `Manutenção` ou de uma categoria não é item de trabalho:
diga o que ele é e peça o item.

## Passo 2 — Encaminhar

| Item informado | Skill | Papel / agente |
|---|---|---|
| pedido em texto, ou id que não está no backlog | **`sa-triar`** | P.O. / `sa-produto` |
| `EP-nn`, tarefa `[ESP]` (de épico, ou `[ESP] FT-nnn` de fatia `nova`) | **`sa-especificar`** | Especificador / `sa-especificador` |
| `FT-nnn` `nova` (não passa na DoR) | sem sprint → **`sa-triar`** (deixar a fatia pronta) · na sprint, com a `[ESP] FT` → **`sa-especificar`** | P.O. / `sa-produto` · Especificador / `sa-especificador` |
| `FT-nnn` (de épico ou de Manutenção), tarefa `[DEV]`, "próxima fatia" | **`sa-desenvolver`** | Dev / `sa-codificador` |
| tarefa `[REV]` | **`sa-revisar`** (rubrica C sobre o PR) | Revisor / `sa-revisor` |
| tarefa `[APR] FT-nnn Aprovar plano` | **`sa-revisar`** (seção "Aprovação do plano — a `[APR]`") | Aprovador (Dev Sênior) / `sa-revisor` |
| tarefa `[APR] FT-nnn Aprovar PR` | **`sa-revisar`** (seção "Aprovação do PR — a `[APR]`") | Aprovador (Dev Sênior) / `sa-revisor` |
| tarefa `[VER]` | **`sa-verificar`** | Verificador (QA) / `sa-verificador` |
| `AT-nnn`, tarefa `[ATD]` | **`sa-atender`** | quem atende / `sa-produto` |
| `IM-`, `BD-`, `IN-`, `OP-`, `EX-nnn` (as demais categorias da tabela **Sustentação** do `sabia.md`), tarefa `[IMPL]` `[BD]` `[INF]` `[OPE]` `[EXT]` | **`sa-executar`** | quem faz / `sa-produto` |
| fatia `iniciada` no `backlog.md` sem `status.md` em nenhuma branch (a sessão parou entre o registro e a branch) | **`sa-desenvolver`** (retomada pelo Passo 4 — só o `responsavel` da linha retoma) | Dev responsável / `sa-codificador` |
| fatia em `verificada` (AFK) | **`sa-codificar`** (Passo 5 — abrir o PR) | Dev / `sa-codificador` |
| fatia em `aceita` (HITL), ou em `aguardando-aprovacao-pr` (AFK) com a `[APR] Aprovar PR` concluída — qualquer item dela, menos a `[APR]` | **`sa-desenvolver`** (Passo 6 — merge do PR aprovado) | Dev responsável / `sa-codificador` |
| fatia em `aguardando-aprovacao-pr` (AFK) sem a `[APR] Aprovar PR` concluída | **`sa-revisar`** (seção "Aprovação do PR — a `[APR]`") | Aprovador (Dev Sênior) / `sa-revisor` |
| fatia em `bloqueada` com `aguardando troca para HITL` | **`sa-planejamento`** (Troca de modo, na base); feita a troca, o Dev retoma pela **`sa-desenvolver`** | P.O. ou SM / `sa-produto` · Dev / `sa-codificador` |
| fatia `pronta` (na base) | **`sa-consolidar`** (processo de produto, na `[GB]`) | P.O. ou SM / `sa-produto` |
| tarefa `[GB] Gerenciamento do backlog` | pedido de sprint (planejar, ritos, "sincroniza a sprint") → **`sa-planejamento`**; senão, fatias `pronta` → **`sa-consolidar`** (uma por vez); nenhuma → **`sa-triar`** | SM (o dono) ou P.O. / `sa-produto` |

As linhas `fatia …` valem sobre as do item (`FT-nnn`, `[DEV]`…) e leem a fase pela regra A base prevalece (Passo 1).
Tarefa `[DEV]` ou de Sustentação já fechada no EWM encaminha igual: a `sa-desenvolver`, a `sa-atender` e a
`sa-executar` mostram o estado e oferecem reabrir ou fechar o item
(a `[DEV]` com o PR mergeado, pelo Passo 6 da `sa-desenvolver`; o item de Sustentação, `concluido`).

```
🔀 <item> — <título> · <tipo> · <fase do status.md | status do backlog>
Próximo: use `<skill> <item>`   (agente: <agente>)
```

Pedido em texto: `🔀 pedido não registrado — <resumo em uma linha>` · `Próximo: use sa-triar`.

Responda com a instrução e **pare**: nunca invoque nem simule a skill do papel — ela começa na própria invocação.

## "Minha próxima tarefa"

1. Com o MCP `elm` e a sprint publicada: `elm_listar_wi(dono: "eu", iteracao: <a da sprint aberta>, tipo: "tarefa")`;
   sem ele, ou com `**Publicação no EWM:** pendente` no cabeçalho (nenhuma tool recebe a iteração dela antes da
   publicação — [elm.md](../sabia/references/elm.md), Regras de toda escrita, item 6): as linhas do `sprint-<nn>.md`
   aberto (Fatias, Especificação e as `### <Categoria>` da Sustentação) com `responsavel` = a pessoa (login do
   `sabia.md` ou `git config user.email`) — com o marcador, diga também "sprint não publicada no EWM → sincroniza a
   sprint (`sa-planejamento`)".
2. Mostre as tarefas abertas (não concluídas) de **qualquer tipo**, na ordem de prioridade do `backlog.md` (`crítica`
   → `baixa`, `—` no fim; empate pela ordem da linha) — as que já estão em andamento primeiro (sem o MCP: fatia e
   especificação `iniciada`, item `em-andamento`):
   ```
   📋 Suas tarefas na sprint <pai>/Sprint <nn> (<login>)
   | # | Tarefa | Item | Estado | Skill |
   |---|---|---|---|---|
   | 1 | [DEV] 669412 | FT-034 Exportar relatório | Em Desenvolvimento | sa-desenvolver |
   | 2 | [REV] 669401 | FT-031 Bloquear a conta | Novo | sa-revisar |
   Qual? (número)
   ```
   Tarefa sem tipo do Sabiá no título (`[DEV]`, `[REV]`, `[APR]`, `[VER]`, `[ESP]`, `[GB]` e os prefixos da Sustentação não aparecem): mostre no fim, com
   Skill `— (fora do Sabiá)`; escolhida → diga que ela ainda não está na sprint e indique "sincroniza a sprint"
   (`sa-planejamento`, P.O. ou SM), que a traz com o mesmo id — como item de Sustentação ou como tarefa de papel de
   uma fatia ou épico ([elm-sprint.md](../sa-planejamento/references/elm-sprint.md) §9).
3. A pessoa escolhe → Passo 2 com o item escolhido. Nenhuma tarefa → diga e ofereça "próxima fatia"
   (`sa-desenvolver`) ou a `sa-status`.

## Regras

- Só encaminha: o compromisso (DoR, sprint, WIP), a branch e o EWM são da skill do papel.
- Nunca invente dados de work item; na dúvida entre dois tipos, pergunte.
