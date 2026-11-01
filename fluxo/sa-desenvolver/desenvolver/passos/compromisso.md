---
{"resumo": "Antes de gravar na base, criar branch ou mexer no EWM: Definition of Ready, responsável, sprint (puxar ou encaixe), WIP, registro publicado e dono do item pai."}
---
## Entrada

A fatia, com a trilha (passo `trilha`).

## Faça

Vale para todas as trilhas. Tudo conferido **antes** de gravar na base, criar branch ou mexer no EWM.

1. **Definition of Ready** da trilha — a do formato do backlog
   ([backlog.md](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#definition-of-ready-o-que-faz-uma-fatia-elegivel),
   mais os itens próprios do `acordos.md`): a fatia está `elegivel` ou `planejada` e ainda passa (confira agora).
   - Falhou → a fatia ainda é especificação, não desenvolvimento: volta a `nova` com o `falta:` e é completada por
     [Completar uma fatia `nova`](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#completar-uma-fatia-nova) (no backlog, o
     `sa-produto`; na sprint, a `[ESP] FT-<nnn>` pela `sa-especificar`).
2. **Responsável.** A coluna `responsavel` do `backlog.md` é outra pessoa → pergunte se ela sabe; trocar é do
   planejamento, não grave aqui. É `—` (a fatia entrou sem responsável) → quem implementa a assume, e o modo final
   sai agora, pela senioridade (passo `sa-planejamento.sprint.modo`); mudou → grave-o no passo `iniciar`
   (backlog e linha da sprint, com o `obs`) e acerte as tarefas no mesmo "sim": AFK → HITL, nascem a `[REV]` e a
   `[VER]` (revisor e verificador como no passo `iniciar`); HITL → AFK, as duas são canceladas
   ([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md), topo). Quem vai implementar é **Júnior** (`senioridade` no `equipe.json`) e a fatia é
   `AFK` → não comece: avise que Júnior implementa sempre em HITL e mande para a **`sa-planejamento`** (o modo sai
   da senioridade de quem implementa).
3. **Sprint.** Nada começa sem item planejado: é na tarefa da sprint que as horas são lançadas. A
   fatia está `planejada` na sprint aberta (`sprint` do `backlog.md` = a chave do `sprint-<nn>.md` com
   `**Situação:** aberta`, como `2026/Sprint 03`)? Não está → **puxe** (fluxo puxado, a sprint é cadência): se ela
   é a `elegivel` do topo — nenhuma `elegivel` ou `planejada` de prioridade maior esperando (empate: a mais acima na
   tabela), dentro ou fora da sprint — e o WIP do item 4 tem folga, ela entra na sprint aberta sem cerimônia: a
   linha nasce na sprint com a `iniciada` (Observação `puxada`), e as tarefas vão para a iteração da sprint (passo `iniciar`:
   a que já existe move; só nasce a que falta). Fura a fila ou estoura o WIP → **Encaixe**: a decisão é do P.O., pelo
   passo **`sa-planejamento.durante.encaixe`**; sem a decisão registrada, não comece. Nenhuma sprint aberta
   (planejamento ainda não feito) → não é encaixe: ofereça a `sa-planejamento` e não comece.
4. **WIP** (`<produto>/acordos.md`; sem o arquivo, 2 fatias esperando pessoa). Conte as fatias em
   `aguardando-aprovacao-plano`, `pr-aberto`, `em-revisao`, `em-verificacao`, `aceita`, `verificada` e
   `aguardando-aprovacao-pr` nos `status.md` das branches, pela regra A base prevalece do
   padrão `sa-desenvolver/status.md` (`pronta` ou `concluida` na base não conta), como a
   `sa-status`. No limite, ou com PR
   parado há mais tempo que o acordo (padrão 1 dia) → mostre quais e recomende destravar antes (aprovar o plano,
   revisar o PR). A pessoa pode seguir mesmo assim: `WIP excedido: <motivo>` vai no Histórico do `status.md` ao
   criá-lo (passo `iniciar`).
5. **Registro publicado.** A linha da fatia, a ficha e o encaixe já estão em `origin/<base>`
   (`git grep -q '<FT>' origin/<base> -- <produto>/backlog.md`)? Só no local → peça o push
   antes: a branch nasce de `origin/<base>`, e um id que ainda não chegou lá pode mudar. Repositório sem remoto
   (ou base nunca publicada) → não há o que conferir: a branch nasce da base local; diga isso e siga.
6. **Dono do item pai** (com o MCP `elm`): o item da fatia no EWM — o IB, ou o item de origem (`DF`/`IB` da coluna
   `elm`) — tem dono (`elm_ler_wi`)? O `assumir` da `[DEV]` com `iniciar_pai` (passo `iniciar`) o exige. Sem dono → peça
   ao P.O. que se ponha como dono (o item é dele: [elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md)
   §3) e não comece; `elm` `pendente` ou id sem link (`DF 4567`) → o passo `iniciar` cria ou completa o item, já com o
   P.O. como dono.

## Saída

Todos os itens conferidos → passo `iniciar`.

## Pare se

Falhou um item → diga qual e o caminho, e não comece (Júnior em fatia `AFK`, item 2; fora da sprint sem a decisão de
encaixe ou sem sprint aberta, item 3; item pai sem dono, item 6).
