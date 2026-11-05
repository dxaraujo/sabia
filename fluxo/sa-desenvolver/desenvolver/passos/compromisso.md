---
{"resumo": "Antes de gravar na base, criar branch ou mexer no EWM: Definition of Ready e trilha, responsável e modo da primeira atribuição, WIP, registro publicado e dono do item pai."}
---
## Entrada

A fatia registrada e na sprint aberta (passo `entrada`), ainda sem `status.md` em nenhuma branch.

## Faça

Vale para todas as trilhas. Tudo conferido **antes** de gravar na base, criar branch ou mexer no EWM.

1. **Definition of Ready e trilha** — a DoR do formato do backlog
   ([backlog.md](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#definition-of-ready-o-que-faz-uma-fatia-elegivel),
   mais os itens próprios do `acordos.md`): a fatia ainda passa (confira agora).
   - Falhou → a fatia ainda é especificação, não desenvolvimento: não grave nada na base nem no EWM; diga
     `FT-<nnn> não passa na DoR: <item que falhou>` e que o rebaixamento a `nova` com o `falta:` é do P.O. ou do SM
     (agente `sa-produto`), pela [Volta](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#situações), e a fatia
     se completa por [Completar uma fatia `nova`](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#completar-uma-fatia-nova)
     (no backlog, o `sa-produto`; na sprint, a `[ESP] FT-<nnn>` pela `sa-especificar`); e pare.
   - A trilha vem do registro, não de uma triagem nova: a coluna `trilha` da linha (de épico, sempre **padrão**).
     **padrão**: pesquisa → plano → GATE do plano → implementação → PR → revisão → verificação; **rápida**: pesquisa
     curta → `bugfix.md` + `tasks.md` (o teste que reproduz primeiro) → implementação → PR → revisão → verificação
     (AFK, nas duas: revisão e verificação antes do PR). A "rápida" com regra de negócio nova não serve → devolva à
     `sa-triar` para refazer a triagem.
2. **Responsável e modo.** A coluna `responsavel` do `backlog.md`:
   - outra pessoa → "é de <login>; trocar é do P.O. ou do SM (agente `sa-produto`)" e pare;
   - `—` (a fatia entrou sem responsável) → quem implementa a assume. É a primeira atribuição, não troca: o modo final
     sai agora, pela senioridade de quem implementa (passo `sa-planejamento.sprint.modo`). Mudou → o passo `iniciar`
     grava o modo e o responsável (backlog e linha da sprint, com o `obs`) e acerta as tarefas no mesmo "sim": AFK →
     HITL, nascem a `[REV]` e a `[VER]` (revisor e verificador escolhidos no passo `iniciar`); HITL → AFK, as duas são
     canceladas ([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md), topo);
   - quem implementa e é **Júnior** (`senioridade` no `equipe.json`), com a fatia `AFK` e o responsável já definido →
     não comece (nada na base, nem `[DEV]`, nem branch): "Júnior implementa sempre em HITL; a troca de modo é do P.O.
     ou do SM (agente `sa-produto`)" e pare.
3. **WIP** (`<produto>/acordos.md`; sem o arquivo, 2 fatias esperando pessoa por revisor). Conte, por revisor, as
   fatias em `aguardando-aprovacao-plano`, `pr-aberto`, `em-revisao`, `em-verificacao`, `aceita`, `verificada` e
   `aguardando-aprovacao-pr` nos `status.md` das branches, pela regra A base prevalece do
   padrão `sa-desenvolver/status.md` (`pronta` ou `concluida` na base não conta), como a
   `sa-status`: cada uma conta contra quem ela espera, pela linha WIP do
   [arquivos.md](~/.sabia/framework/skills/sa-planejamento/references/arquivos.md#acordosmd). O revisor desta fatia no limite (HITL: o da coluna Revisor; AFK, com o aprovador ainda não escolhido: todos os Dev
   Sênior ativos no limite), ou PR parado — aberto (`gitlab_listar_mrs(estado=opened)`) com `atualizado_em` há mais
   de 1 dia (ou o prazo do acordo) — → mostre quais e recomende destravar antes (aprovar o plano, revisar o PR). A fatia já está planejada: a pessoa pode seguir mesmo assim, e
   `WIP excedido: <motivo>` vai no Histórico do `status.md` ao criá-lo (passo `iniciar`).
4. **Registro publicado.** A linha da fatia, a ficha e a linha da sprint já estão em `origin/<base>`
   (`git fetch`; `git show origin/<base>:<produto>/backlog.md | grep -q '^| FT-<nnn> |'`,
   `git cat-file -e origin/<base>:<produto>/<caminho da coluna ficha>` e
   `git show origin/<base>:<produto>/sprints/<pai>/sprint-<nn>.md | grep -q '^| FT-<nnn> |'`)? Só no local → peça o push
   antes: a branch nasce de `origin/<base>`, e um id que ainda não chegou lá pode mudar. Repositório sem remoto
   (ou base nunca publicada) → não há o que conferir: a branch nasce da base local; diga isso e siga.
5. **Dono do item pai** (com o MCP `elm`): o item da fatia no EWM — o IB, ou o item de origem (`DF`/`IB` da coluna
   `elm`) — tem dono (`elm_ler_wi`)? O `assumir` da `[DEV]` com `iniciar_pai` (passo `iniciar`) o exige. Sem dono → peça
   ao P.O. que se ponha como dono (o item é dele: [elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md)
   §3) e não comece; `elm` `pendente` ou id sem link (`DF 4567`) → o passo `iniciar` cria ou completa o item, já com o
   P.O. como dono.

## Saída

Todos os itens conferidos → passo `iniciar`.

## Pare se

Falhou um item → diga qual e o caminho, e não comece: DoR ou trilha que não serve (item 1), fatia de outra pessoa
ou Júnior numa fatia `AFK` (item 2), registro só no local (item 4: peça o push e pare), item pai sem dono (item 5).
