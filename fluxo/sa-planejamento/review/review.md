---
{"fluxo": "review", "dono": "sa-produto",
 "quando": ["fim da sprint, antes da retrospectiva: a pré-condição dos ritos de fechamento e a review com a evidência de cada fatia concluída", "review da sprint"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "sincronizar"},
   {"id": "consolidacao", "travas": ["po-decide-fechamento"], "saidas": {"P.O. disse não": "fim"}},
   {"id": "rito", "chama": "sa-triar.triar", "removivel": true}
 ]}
---
# Review

Entrada: o fim da sprint ("review da sprint"). Os passos `sincronizar` e `consolidacao` são a **pré-condição dos
ritos de fechamento**: valem antes da review, da retrospectiva da sprint e da virada — em cada um (passo
`sa-planejamento.retrospectiva.precondicao`).
