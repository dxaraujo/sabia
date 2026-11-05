---
{"resumo": "Por fatia, uma fase por subagente de contexto limpo (pesquisa, plano, análise, GATE, implementação, revisão, verificação, entrega), com commit imediato dos relatórios de cada fase."}
---
## Entrada

As worktrees das fatias do lote (passo `worktree`), ou as fatias retomadas da fase registrada (passo `retomar`).
Fatias diferentes em paralelo até o limite.

## Faça

Cada fase é um subagente novo recebendo **só**: `AUTONOMO=true`, id da fatia, o caminho da worktree
(`.sabia/local/wt/<ft>`) e da pasta da fatia dentro dela, como rodar comandos ali (passo `worktree`) e a rodada. Nunca o
raciocínio de outra fase. Delegação que roda em segundo plano → espere a de cada fase terminar (artefato gravado,
`status.md` atualizado) antes de abrir a seguinte da mesma fatia.

| # | Fase | Subagente | Sai quando |
|---|---|---|---|
| 1 | pesquisa | `sa-pesquisador` (`sa-pesquisar`) | `research.md` devolvido e gravado por você na pasta da fatia |
| 2 | plano | `sa-desenvolvedor` (passos `sa-plano.plano.decisoes` e `sa-plano.plano.escrever`) | spec do Kiro gravada · ou `bloqueada` |
| 3 | análise do plano | `sa-revisor` (rubrica L) → `sa-desenvolvedor` corrige | `ANALISE: OK` · 2 rodadas sem OK → `bloqueada` |
| 4 | troca e GATE do plano | você | o passo `sa-plano.plano.gate`, sem pessoa: plano com risco → `fase: bloqueada (de: planejando)`, `aguardando troca de modo` com o risco, commit, horas da sessão na `[DEV]` no fim do lote, o P.O. ou o SM no resumo, e siga com as outras · GATE pela escolha do lote: Sênior, ou Pleno que dispensou → `fase: implementando` (Histórico `plano do Sênior` · `Pleno dispensou o GATE do plano`) e siga · Pleno que pediu → `fase: aguardando-aprovacao-plano` (`Responsável` = o Dev Sênior do lote), a `[APR] FT-<nnn> Aprovar plano` ([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §8), commit do plano e, com push autorizado no lote, push e conferência; **pare esta fatia** e siga com as outras (retoma depois do GATE) |
| 5 | implementação | `sa-desenvolvedor` (passos `sa-codificar.codificar.onde`, `sa-codificar.codificar.tarefa` e `sa-codificar.codificar.validar`) | tarefas `[x]` e backpressure verde · ou `bloqueada` |
| 6 | revisão do código | `sa-revisor` (rubrica C) → volta à 5 com os achados | `VEREDITO: APROVADO` · 2ª reprovação → `bloqueada` |
| 7 | verificação | `sa-verificador` (`sa-verificar`) | `ACEITO` (`fase: verificada`) · `REJEITADO` → volta à 5 com os cenários rejeitados (retrabalho: linha na tabela Retrabalho do `status.md`, Rodadas `retrabalho` + 1) e **passa de novo pela 6** antes da 7; de novo rejeitado → `bloqueada` |
| 8 | entrega | você | de `verificada`: commit do que faltar; push, conferência no remoto (`git rev-parse HEAD` = `git rev-parse origin/<branch>`, na worktree) e PR se autorizado no lote (ADRs, texto e `gitlab_criar_mr` do passo `sa-codificar.codificar.pr`, com `origem` = a branch da worktree — o MCP roda no checkout principal e não a enxerga; o Kiro ainda pode pedir confirmação a cada push e a cada PR, conforme as permissões) → a `[APR] FT-<nnn> Aprovar PR` para o Dev Sênior do lote ([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §8) → `fase: aguardando-aprovacao-pr` com o link do PR no `status.md`, commit, push e conferência (como na Entrega do passo `sa-codificar.codificar.pr`); a `[DEV]` fica em andamento; sem PR autorizado → fica `verificada` |

Depois de cada fase: grave a fase seguinte (`planejando` depois da pesquisa, `revisando` antes da revisão do
código), atualize o log, as Rodadas e o Histórico do `status.md` — nas fases 6 e 7, também o campo **Drift de
negócio** com a linha do relatório (só sobe de `não` para `possível alteração`; na 7, com os cenários `🔁`, que não voltam à 5); **commite imediatamente** na worktree os
relatórios que chegaram nesta fase — `analise-plano-<N>.md` (fase 3), `revisao-codigo-<N>.md` (fase 6),
`verificacao.md`, `CT.csv`, `evidencias/` e `massa/` (fase 7) — antes de iniciar a fase seguinte. Esses arquivos não são commitados
pelos subagentes que os geram; o orquestrador é o responsável pelo commit deles.

**Aprovação de plano pausado:** é do Dev Sênior da `[APR]`, na sessão dele, pelo fluxo `sa-revisar.aprovar-plano`
(no mesmo checkout do loop, ele trabalha na worktree — `cd .sabia/local/wt/<ft>` — em vez do `git switch`; sem push
autorizado, só assim). Ao retomar: `git pull --ff-only` na worktree (com upstream) e leia a fase — `implementando` →
fase 5 (passo `sa-codificar.codificar.onde`); `planejando` com o ajuste pedido → desenvolvedor (`sa-plano.replanejar`), nova análise e fase 4.
Aprovação dita nesta sessão não vale.

**Aprovação do PR:** é do Dev Sênior da `[APR]`, pelo fluxo `sa-revisar.aprovar-pr`. Mudanças pedidas →
`retrabalho (de: aguardando-aprovacao-pr)`: a fatia volta à fase 5 com os achados (retome-a num lote, ou o Dev pela
`sa-codificar`).

## Saída

Cada fatia em `aguardando-aprovacao-pr`, `verificada`, `aguardando-aprovacao-plano` ou `bloqueada` → passo `parada`.

## Pare se

- Plano que pede o GATE (fase 4) → pare esta fatia e siga com as outras (retoma depois do GATE).
- Fatia `bloqueada` ou problema sistêmico → passo `parada`.
