---
{"fluxo": "retrospectiva", "dono": "sa-produto",
 "quando": ["fim da sprint, depois da review: retrospectiva com dados, horas, fechamento com a migração, replanejamento e virada no EWM", "fechar a sprint", "virada de sprint"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "precondicao", "travas": ["po-decide-fechamento"], "saidas": {"P.O. disse não": "fim", "de novo, depois do passo horas (antes da virada)": "fechar"}},
   {"id": "retro", "chama": "sa-aprender.retrospectiva"},
   {"id": "horas", "saidas": {"antes da virada, a pré-condição de novo": "precondicao"}},
   {"id": "fechar"},
   {"id": "recalcular"},
   {"id": "virada"}
 ]}
---
# Retrospectiva e virada

Entrada: o fim da sprint ("fechar a sprint", "virada de sprint"), depois da review.
