---
{"fluxo": "review", "dono": "sa-especificador",
 "quando": ["fim do ciclo, com os stakeholders quando disponíveis: o entregue com a prova do MR, o retorno, pedidos novos pela captura e a curadoria das Regras aprendidas", "review da sprint"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "inicio"},
   {"id": "rito", "saidas": {"sem pedido novo": "regras-aprendidas"}},
   {"id": "captura", "de": "captura", "saidas": {"mais um pedido novo": "captura"}},
   {"id": "regras-aprendidas", "chama": "sa-status.licoes"},
   {"id": "gravar"},
   {"id": "commit-na-branch-base", "de": "commit-na-branch-base"},
   {"id": "seguir", "saidas": {"sim": "→ sa-planejamento.retrospectiva"}}
 ]}
---
# Review da sprint

Fim do ciclo, com os stakeholders presentes e sem travar: o que foi entregue, com a prova do MR → retorno no
`sprint-<nn>.md` → pedido novo pela captura → Regras aprendidas (curadoria das Lições) → grava → "seguir para a
retrospectiva?". Não há consolidação nem pré-condição de rito.
