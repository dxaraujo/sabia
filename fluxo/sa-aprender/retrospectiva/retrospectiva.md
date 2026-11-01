---
{"fluxo": "retrospectiva", "dono": "sa-produto",
 "quando": ["fim de fatia, de épico ou de sprint: retrospectiva com dados e, no épico ou na sprint, o lint do conhecimento; a de sprint vem da sa-planejamento", "retrospectiva", "resumo das lições"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "precondicao", "chama": ["sa-planejamento.review.sincronizar", "sa-planejamento.review.consolidacao"], "travas": ["po-decide-fechamento"], "saidas": {"retrospectiva de fatia ou de épico": "dados", "P.O. disse não": "fim"}},
   {"id": "dados", "chama": ["sa-aprender.registrar", "sa-aprender.promover"], "saidas": {"retrospectiva de fatia, sem pedido de lint": "fim"}},
   {"id": "lint"}
 ]}
---
# Retrospectiva (fim de fatia, épico ou sprint)

Entrada: o fim de uma fatia, de um épico ou da sprint ("retrospectiva", "resumo das lições"); a de sprint vem do
passo `sa-planejamento.retrospectiva.retro`.

## Regras

- Nunca promova sem "ok". Nunca apague lição (só acréscimo).
