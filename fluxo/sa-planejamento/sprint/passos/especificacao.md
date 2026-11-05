---
{"resumo": "Épicos elegivel que entram em especificação nesta sprint, com a DoR do épico e uma [ESP] por épico, e as pendências de especificação da [GB] (a [ESP] <id> Revisão <n>), dentro da capacidade de especificação."}
---
## Entrada

O `roadmap.md`, o `backlog.md` e a capacidade de especificação (passo `capacidade`).

## Faça

**Especificação:** épicos `elegivel` que entram em especificação nesta sprint (do `roadmap.md`, os "a
descobrir" do topo, e os do `backlog.md` que o roadmap ainda não tem — proponha a posição deles); épico `novo`
no topo → confira a Definition of Ready do épico e grave `elegivel` se passa; não passa → **não barre**: avise que
ele entra em especificação com o que falta (`falta: <o quê>`), que é trabalho da `[ESP]`. Uma `[ESP]` por épico,
com horas previstas dentro da capacidade de especificação (o responsável sai do passo `responsaveis`).

**Pendência de especificação** (da `[GB]`, [Volta à
especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação)): o item (épico `iniciado`
ou fatia) com a `obs` `falta: especificação (<motivo>, …)` e a `[ESP]` dele já concluída → entra com a
`[ESP] <id> Revisão <n>`, na seção Especificação (Observação `revisão <n>: <motivo>`, o motivo da `obs`), dentro da
capacidade de especificação; no mesmo commit, sai a `obs` `falta: especificação` da linha do item no `backlog.md` (na
fatia `nova` ela fica: é a DoR). No EWM, a Revisão nasce sob o IB do item
([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §4), e a concluída fica como está. Épico
`iniciado` sem essa `obs` (o PRD aprovado esperando o fatiamento) não ganha Revisão.

## Saída

A lista das especificações → passo `previsao`.

## Pare se

Sem condição de parada própria: épico que não passa na DoR não é barrado.
