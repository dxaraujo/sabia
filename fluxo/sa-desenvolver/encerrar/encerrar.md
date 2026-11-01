---
{"fluxo": "encerrar", "dono": "sa-desenvolvedor",
 "quando": ["PR aprovado (`aceita` no HITL; `[APR]` concluída no AFK) ou mergeado por fora: merge, `pronta` na base e conclusão da `[DEV]`", "mergeia a FT-031", "o PR da FT-031 foi aprovado"],
 "travas_gerais": ["sim-da-pessoa", "sem-force"],
 "passos": [
   {"id": "merge", "travas": ["pr-lido-por-pessoa"], "saidas": {"conflito com a base: retrabalho registrado": "→ sa-codificar.codificar", "pronta, P.O. ou SM avisado": "→ sa-consolidar.consolidar"}}
 ]}
---
# Encerrar a `[DEV]` — merge do PR aprovado

Entrada: a fatia em `aceita` (HITL) ou em `aguardando-aprovacao-pr` (AFK), ou o PR já mergeado por fora; chega pelo
passo `sa-desenvolver.desenvolver.encaminhar`, pelo passo `sa-desenvolver.desenvolver.iniciar` (`[DEV]` já fechada com o PR mergeado) ou pela
`sa-consolidar`.

## Regras

- Nunca invente dados de work item.
- Não invoque nem simule outra skill do fluxo: diga a próxima e pare.
