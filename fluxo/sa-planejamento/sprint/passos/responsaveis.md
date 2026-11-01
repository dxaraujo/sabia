---
{"resumo": "Responsáveis das fatias e das [ESP] (no HITL, revisor e verificador): pergunta, nunca aloca sozinho; sugestão só a pedido."}
---
## Entrada

A lista do passo `previsao` e a das especificações (passo `especificacao`).

## Faça

**Responsáveis — pergunte, nunca aloque sozinho.** Com a lista do passo `previsao` e das especificações, primeiro
pergunte se já há alguém definido para algum item (responsável da fatia ou da `[ESP]`; na HITL, revisor e
verificador): `FT-031: <login>`, `EP-04: <login>`. Para os que sobrarem, pergunte se quer atribuir agora — a
sugestão pelo `equipe.json` (papéis, senioridade, horas) só aparece se a pessoa pedir. Não quer → `—`: o item
entra assim, e quem o assumir vira o responsável (`sa-desenvolver`, `sa-especificar`, `sa-revisar`,
`sa-verificar`). Com responsável, o modo final sai da senioridade dele (Modo pela
senioridade, passo `modo`) e a capacidade de cada pessoa é conferida; sem, vale o `modo` do backlog
até alguém assumir, e só a capacidade do time.

## Saída

Os responsáveis (ou `—`) de cada item → passo `modo`.

## Pare se

Sem condição de parada própria: sem resposta, o item entra com `—`.
