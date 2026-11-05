---
{"resumo": "Um commit com o que a publicação gravou de volta; fatia nova: a DoR (passou → elegivel e a linha da sprint concluida) e a oferta do encaixe na sprint aberta, onde nasce a [DEV]; fatia iniciada: a linha concluida e o aviso ao Dev; a [ESP] concluída e o desdobramento."}
---
## Entrada

A ficha completa e, com artefato afetado, a especificação aprovada na base e publicada (passos `aprovacao` e
`publicar`); ou a ficha sem artefato afetado (passo `trabalho`).

## Faça

Os commits abaixo levam também o que o passo `publicar` gravou de volta nos conceitos.

1. **Fatia `nova`:** a DoR, pelo item 4 de [Completar uma fatia `nova`](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#completar-uma-fatia-nova).
   Passou → `elegivel` (saem o `falta: especificação` e o `em especificação`) e, no mesmo commit
   (`FT-<nnn> concluir especificação`), a linha da sprint com Situação `concluida` e os Créditos (a soma da `## Créditos` da ficha; na
   `[ESP] FT-<nnn> Revisão <n>`, só as linhas com Data depois da conclusão anterior). Na rápida AFK, ela segue como
   AFK padrão: o próximo GATE é o do PR. Não passou → a `[ESP]` segue; na virada, a linha migra.
2. **Fatia `iniciada`** (reaberta, Revisão ou a `[ESP] FT-<nnn> Especificação` que o encaixe criou na Volta), só com o artefato do Bloqueio aprovado na base (passo `aprovacao`;
   sem ele, a `[ESP]` segue aberta): o backlog não muda; a linha da sprint `concluida`, com os Créditos (como no item 1), no mesmo commit
   `FT-<nnn> concluir especificação`.
3. **Conclusão da `[ESP]`** (concluída a linha): como na Conclusão da `[ESP]` do passo
   `sa-especificar.especificar.concluir` (o saldo de horas e `concluir`); sem o MCP `elm`, a pendência no rodapé
   da ficha.
4. **Próximo**, exato:
   - fatia `elegivel` → `Próximo: encaixar a FT-<nnn> na sprint aberta — P.O. ou SM (sa-planejamento, agente sa-produto); a [DEV] nasce no encaixe. Sem encaixe, ela fica elegivel para o próximo planejamento.`
     (sem sprint aberta: só a última frase). O encaixe é o da `elegivel` comum do `sa-planejamento.durante.encaixe`
     (a aprovação do P.O. registrada); a `[REV]` e a `[VER]` nascem quando o Dev assume;
   - fatia `iniciada` → `Próximo: Dev da FT-<nnn> — traga a base para a branch (git merge origin/<base>, com "sim") e retome (sa-desenvolver FT-<nnn>, agente sa-desenvolvedor).`

**Algum desdobramento?** Pergunte antes de parar: alteração de outro item, artefato fora da lista sem autorização,
regra nova ou demanda que apareceu no trabalho → "avise o P.O.: registrar pela `sa-triar` (agente `sa-produto`), com
a origem `FT-<nnn>`"; nada → fim.

## Saída

Passou (ou a fatia `iniciada`, concluída) → a linha `concluida`, a `[ESP]` concluída e o próximo dito. Não passou
→ a `[ESP]` segue. O desdobramento dito, se houver. Aqui o fluxo termina.

## Pare se

Nenhum caso próprio deste passo: valem as Regras do fluxo.
