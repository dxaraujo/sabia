---
{"resumo": "Cancela fatias ou o épico, ou segue com o plano acima do limite (decisão do P.O.), e reaplica a Definition of Ready, no backlog.md e na sprint, num commit, com o EWM acompanhando; as fatias do backlog não se alteram, cenário novo vai à sa-triar e alteração de artefato pela Volta à especificação."}
---
## Entrada

"Refinar o backlog", "cancelar a FT-033", "cancelar o EP-05", "seguir com o plano da FT-033" — decisão do P.O. Fatia de Manutenção, ou cenário novo,
é da `sa-triar`.

## Faça

Cada mudança vai ao `backlog.md` e, com a fatia numa sprint, à linha dela no `sprint-<nn>.md`, no mesmo
commit, `backlog: refinamento <ids>`, pelas [Situações](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#situações). O GATE do refinamento é o
"sim" do P.O. à prévia do que muda.

- **As fatias do backlog não se alteram:** dividir, juntar ou mudar escopo, cobertura ou tamanho de uma fatia é só
  antes do GATE do backlog (passo `sa-fatiar.fatiar.perguntar`). Pedido disso aqui → "depois do GATE do backlog, a
  fatia não muda: cancele-a e registre o novo pela `sa-triar`, ou siga com ela" e pare.
- **Cenário novo** (inclusive o que falta numa história) → épico ou fatia nova pela `sa-triar` (`obs`
  `origem EP-<nn>`, agente `sa-produto`): diga isso e pare.
- **Alteração de artefato** (regra, termo, leiaute, história) que uma fatia não terminal cobre → a
  [Volta à especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação). Fatia terminal → `sa-triar`.
- **Cancelar** uma fatia não iniciada: `cancelada`, com o motivo na `obs`. Era a última não terminal de um épico com
  fatia `concluida` → no mesmo commit, o épico `concluido` no backlog, a linha `| Fase | concluido |` no `status.md`
  do épico e o IB do épico concluído (como no passo `sa-consolidar.consolidar.fechar`).
- **No EWM**, a fatia `cancelada` tem o IB (e, se não foi iniciada, as tarefas) cancelado:
  `elm_transicao(<id>, "cancelar")`, um por id, com "sim". Na falha (sem o MCP, `precondicao`, erro) →
  `ELM pendente [FT-<nnn> cancelar]` no rodapé da ficha da fatia, onde moram as pendências da fatia não iniciada ou
  `cancelada`.
- **Cancelar depois de `iniciada`:** conclua as tarefas abertas da fatia com as horas já lançadas
  (`elm_transicao(<id>, "concluir")`, com "sim"; sem o MCP, `ELM pendente` no rodapé da ficha) e avise o Dev para
  fechar o PR.
- **Plano acima do limite** (fatia de épico `iniciada`, `bloqueada (de: planejando)` com o Bloqueio `plano acima
  do limite: …` no `status.md` da branch — passo `sa-plano.plano.escrever`): o P.O. decide. Seguir → a `obs`
  `plano acima do limite: seguir (<P.O.>, <data>)` na linha da fatia no `backlog.md` (formato do backlog), no commit do
  refinamento, e avise o Dev responsável: ele retoma pela `sa-plano`; cancelar → o item Cancelar depois de `iniciada`, e as partes como fatia nova pela
  `sa-triar` (`origem EP-<nn>`).
- **Cancelar o épico** (decisão do P.O.), numa gravação: a linha `| Fase | cancelado |` no `status.md` do épico (se
  já está na base); no backlog, o épico `cancelado` (motivo na `obs`) e as fatias não iniciadas `cancelada`; na sprint, a linha
  da Especificação não concluída `cancelada`; a `[ESP]` aberta conclui com as horas já lançadas, e o IB do épico
  cancela como o das fatias (na falha, `ELM pendente [EP-<nn> cancelar]`, onde moram as do épico —
  [pendências](~/.sabia/framework/skills/sabia/references/elm.md#pendências)). As fatias `iniciada` em diante não mudam aqui: mostre-as ao
  P.O. (cancelar uma iniciada é o item Cancelar depois de `iniciada`).
- **Definition of Ready** ([critérios](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#definition-of-ready-o-que-faz-uma-fatia-elegivel)): a
  cada refinamento, grave `elegivel` nas `nova` que passam; a `elegivel` ou `planejada` que deixou de passar volta a
  `nova` com `falta:` — a `planejada` sai da sprint pela [Volta](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#situações) (no EWM, o IB e as
  tarefas voltam ao backlog, o IB no estado inicial: [elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §3).
- **Créditos** da sessão (e as horas, só do SM) na `[GB]`, como no passo `sa-consolidar.consolidar.elm` (*horas* e
  *créditos*), com a Atividade `refinamento` (os ids vão só no comentário: `Créditos refinamento <ids>: …`), no commit do refinamento.

## Saída

O refinamento gravado na base, num commit → os próximos passos do passo `sa-fatiar.fatiar.proximos`. Fatia de
Manutenção, ou cenário novo → `sa-triar`. Alteração de artefato de fatia não terminal → pela linha da Volta à
especificação: `sa-especificar.fatia` (a `[ESP] FT` aberta ou reaberta), o encaixe `sa-planejamento.durante` (sem
`[ESP] FT`, ou concluída numa sprint fechada) ou o próximo planejamento `sa-planejamento.sprint` (sem sprint aberta).

## Pare se

- Fatia de Manutenção, ou cenário novo → é da `sa-triar`: diga isso e pare.
- Dividir, juntar ou mudar uma fatia do backlog → não se faz depois do GATE do backlog: diga isso e pare.
- Fatia `pronta` ou `concluida` → nunca é alterada nem cancelada: mudança de comportamento entregue = fatia nova
  pela `sa-triar`.
- Id que não está no `backlog.md` da base → "use `sa-triar`" e pare; fatia ou épico terminal (`cancelada`,
  `dividida`, `concluida`, `concluido`, `cancelado`) → mostre a situação e a `obs` e pare.
