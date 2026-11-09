---
{"fluxo": "inicial", "dono": "sa-especificador",
 "quando": ["começo do projeto, ou rever a equipe e os acordos: equipe, acordos, roadmap opcional", "monta o planejamento", "acordos do time", "rever a equipe", "roadmap"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "inicio", "saidas": {"equipe e acordos existem e nada mudou": "roadmap"}},
   {"id": "equipe"},
   {"id": "acordos"},
   {"id": "commit-na-branch-base", "de": "commit-na-branch-base", "saidas": {"pedido de rever a equipe e os acordos": "seguir", "gravou o roadmap": "seguir"}},
   {"id": "roadmap", "saidas": {"roadmap com o ok": "commit-na-branch-base"}},
   {"id": "seguir", "saidas": {"sim": "→ sa-planejamento.sprint"}}
 ]}
---
# Equipe, acordos e roadmap

Começo do projeto, ou rever a equipe e os acordos: equipe → acordos → gravação → roadmap (opcional) → "seguir para o
planejamento da sprint?".
