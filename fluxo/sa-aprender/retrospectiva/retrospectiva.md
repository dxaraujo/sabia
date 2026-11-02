---
{"fluxo": "retrospectiva", "dono": "sa-produto",
 "quando": ["fim de fatia ou de épico: retrospectiva com dados e, no épico ou na sprint, o lint do conhecimento; a de sprint é chamada só pela sa-planejamento (retrospectiva)", "retrospectiva", "resumo das lições"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "precondicao", "saidas": {"retrospectiva de sprint pedida direto: use a sa-planejamento (retrospectiva)": "fim"}},
   {"id": "dados", "chama": ["sa-aprender.registrar", "sa-aprender.promover"], "saidas": {"retrospectiva de fatia, sem pedido de lint": "fim"}},
   {"id": "lint"}
 ]}
---
# Retrospectiva (fim de fatia, épico ou sprint)

Entrada: o fim de uma fatia ou de um épico ("retrospectiva", "resumo das lições"); a de sprint vem só do passo
`sa-planejamento.retrospectiva.retro`, que já cumpriu a pré-condição dos ritos de fechamento.

## Regras

- Nunca promova sem "ok". Nunca apague lição (só acréscimo).
