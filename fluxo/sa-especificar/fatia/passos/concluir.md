---
{"resumo": "Fatia nova: a DoR do bloco Completar uma fatia nova (passou → elegivel e a linha da sprint concluida no mesmo commit); reaberta: só a linha concluida e o aviso a quem retoma; a [ESP] concluída e o desdobramento."}
---
## Entrada

A ficha completa e, com artefato afetado, a especificação aprovada na base (passo `aprovacao`); ou a ficha sem
artefato afetado (passo `trabalho`).

## Faça

1. **Fatia `nova`:** a DoR, pelo item 4 de [Completar uma fatia `nova`](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#completar-uma-fatia-nova).
   Passou → `elegivel` (saem o `falta: especificação` e o `em especificação`) e, no mesmo commit
   (`FT-<nnn> concluir especificação`), a linha da sprint com Situação `concluida`. Na rápida AFK, ela segue como
   AFK padrão: o próximo GATE é o do PR. Não passou → a `[ESP]` segue; na virada, a linha migra.
2. **Reaberta** (fatia `iniciada` ou `pronta`), só com o artefato do Bloqueio ou do Drift aprovado na base (passo
   `aprovacao`; sem ele, a `[ESP]` segue aberta): o backlog não muda; a linha da sprint `concluida`, no mesmo commit
   `FT-<nnn> concluir especificação`. Aviso a quem retoma: `iniciada` → "Dev: traga a base para a branch
   (`git merge origin/<base>`, com "sim") e retome"; `pronta` → "P.O. ou SM: retome pela `sa-consolidar FT-<nnn>`".
3. **Conclusão da `[ESP]`** (concluída a linha): como na Conclusão da `[ESP]` do passo
   `sa-especificar.especificar.fechamentos` (o saldo de horas e `concluir`); sem o MCP `elm`, a pendência no rodapé
   da ficha.

**Algum desdobramento?** Pergunte antes de parar: alteração de outro item, artefato fora da lista sem autorização,
regra nova ou demanda que apareceu no trabalho → "avise o P.O.: registrar pela `sa-triar` (agente `sa-produto`), com
a origem `FT-<nnn>`"; nada → fim.

## Saída

Passou (ou reaberta concluída) → a linha `concluida`, a `[ESP]` concluída e o aviso dito. Não passou → a `[ESP]`
segue. O desdobramento dito, se houver. Aqui o fluxo termina.

## Pare se

Nenhum caso próprio deste passo: valem as Regras do fluxo.
