---
{"fluxo": "encerrar", "dono": "sa-desenvolvedor",
 "quando": ["PR aprovado (`aceita` no HITL; `[APR]` concluída no AFK): merge, `pronta` na base e conclusão da `[DEV]`", "mergeia a FT-031", "o PR da FT-031 foi aprovado"],
 "travas_gerais": ["sim-da-pessoa", "sem-force"],
 "passos": [
   {"id": "entrada", "de": "entrada", "sprint": "nao"},
   {"id": "merge", "travas": ["pr-lido-por-pessoa"], "saidas": {"conflito com a base: retrabalho registrado": "→ sa-codificar.codificar", "pronta, P.O. ou SM avisado": "→ sa-consolidar.consolidar"}}
 ]}
---
# Encerrar a `[DEV]` — merge do PR aprovado

Deste fluxo: a fatia em `aceita` (HITL), em `aguardando-aprovacao-pr` com a `[APR] Aprovar PR` concluída (AFK), em
`pronta` com a `[DEV]` ainda aberta, ou o PR já mergeado com a aprovação registrada (a sessão do merge parou).

## Entrada: vizinhos

- `implementando`, `revisando`, `verificando`, `verificada` ou `retrabalho (de: …)` → `sa-codificar.codificar`
- `aguardando-aprovacao-pr` com a `[APR] Aprovar PR` aberta → `sa-revisar.aprovar-pr` (agente `sa-revisor`)
- PR mergeado por fora do Sabiá (sem a aprovação registrada), sem `pronta` na base → "sincroniza a sprint (P.O. ou SM, agente `sa-produto`)" ■
- `pronta` com a `[DEV]` já concluída → "nada para o Dev: a consolidação é do P.O. ou do SM (agente `sa-produto`)" ■

## Regras

- Nunca invente dados de work item.
- Não invoque nem simule outra skill do fluxo: diga a próxima e pare.
