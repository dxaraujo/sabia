---
{"fluxo": "review", "dono": "sa-especificador",
 "quando": ["fim do ciclo, com os stakeholders quando disponíveis: o entregue com a evidência do MR, o retorno, pedidos novos pelo cadastro e a curadoria das Regras aprendidas", "review da sprint"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "inicio"},
   {"id": "rito", "saidas": {"sem pedido novo": "regras-aprendidas"}},
   {"id": "cadastro", "de": "cadastro", "saidas": {"mais um pedido novo": "cadastro"}},
   {"id": "regras-aprendidas", "chama": "sa-status.licoes-aprendidas"},
   {"id": "gravar"},
   {"id": "commit-na-branch-base", "de": "commit-na-branch-base"},
   {"id": "seguir", "saidas": {"sim": "→ sa-planejamento.retrospectiva"}}
 ]}
---
# Review da sprint

Fim do ciclo, com os stakeholders presentes e sem travar: o que foi entregue, com a evidência do MR → retorno no
`sprint-<nn>.md` → pedido novo pelo cadastro → Regras aprendidas (curadoria das Lições aprendidas) → grava → "seguir para a
retrospectiva?". Não há consolidação nem pré-condição de rito.
