---
{"fluxo": "retrospectiva", "dono": "sa-especificador",
 "quando": ["fim do ciclo, independente da review: dados, bom · melhorar · ações, números da sprint e a reserva de capacidade revista", "retrospectiva", "fechar a sprint"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "inicio"},
   {"id": "dados", "chama": ["sa-status.painel", "sa-status.pendencias"]},
   {"id": "retro"},
   {"id": "fechar"},
   {"id": "reserva-capacidade"},
   {"id": "gravar"},
   {"id": "commit-na-branch-base", "de": "commit-na-branch-base"},
   {"id": "seguir", "saidas": {"sim": "→ sa-planejamento.sprint"}}
 ]}
---
# Retrospectiva

Independente da review: dados da `sa-status` → bom · melhorar · ações → números da sprint → reserva de capacidade revista → grava →
"seguir para o planejamento da próxima?". O que ficou em aberto é perguntado na virada do próximo planejamento.
