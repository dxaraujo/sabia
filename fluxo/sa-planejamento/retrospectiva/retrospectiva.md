---
{"fluxo": "retrospectiva", "dono": "sa-especificador",
 "quando": ["fim do ciclo, independente da review: dados, pontos positivos · negativos · de melhoria · ações propostas, a curadoria das Lições aprendidas em Regras aprendidas, números da sprint e a reserva de capacidade revista", "retrospectiva", "fechar a sprint"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "inicio"},
   {"id": "dados", "chama": ["sa-status.painel", "sa-status.pendencias"]},
   {"id": "retro"},
   {"id": "regras-aprendidas", "chama": "sa-status.licoes-aprendidas"},
   {"id": "fechar"},
   {"id": "reserva-capacidade"},
   {"id": "gravar"},
   {"id": "commit-na-branch-base", "de": "commit-na-branch-base"},
   {"id": "seguir", "saidas": {"sim": "→ sa-planejamento.sprint"}}
 ]}
---
# Retrospectiva

Independente da review: dados da `sa-status` e propostas de quem conduz → página `sabia retrospective`: pontos positivos · negativos · de melhoria · ações propostas e as lições a considerar → Regras aprendidas (curadoria das Lições aprendidas) → números da sprint → reserva de capacidade revista → grava →
"seguir para o planejamento da próxima?". O que ficou em aberto é perguntado na virada do próximo planejamento.
