---
{"fluxo": "painel", "dono": "sa-desenvolvedor",
 "quando": ["daily, só leitura: WIP, vazão, lead time, idade, urgente, MRs esperando pessoa, topo puxável, refinamento, Sustentação e reserva de capacidade, fila de triagem, publicação pendente, trava de artefato e a sugestão", "status", "painel", "bom dia", "onde parei", "como está a sprint"],
 "travas_gerais": ["elm-pela-sa-elm"],
 "passos": [
   {"id": "inicio", "saidas": {"sem .sabia/sabia.md": "fim"}},
   {"id": "backlog-e-sprint"},
   {"id": "branches-e-status"},
   {"id": "mr"},
   {"id": "tasks"},
   {"id": "acordos-e-equipe"},
   {"id": "identidade"},
   {"id": "sustentacao"},
   {"id": "autopilot"},
   {"id": "publicacao-pendente"},
   {"id": "trava-de-artefato"},
   {"id": "metricas"},
   {"id": "urgente"},
   {"id": "fila-de-triagem"},
   {"id": "esperando-pessoa"},
   {"id": "retrabalho"},
   {"id": "topo-puxavel"},
   {"id": "refinamento-e-produto"},
   {"id": "reserva-capacidade"},
   {"id": "fim-do-ciclo"},
   {"id": "sugestao"},
   {"id": "mostrar", "chama": "sa-status.pendencias"}
 ]}
---
# Painel do fluxo

Coleta (backlog e sprint da branch base, branches `<id>`, `status.md`, MR, `tasks.md`, acordos, equipe, Sustentação,
autopilot, publicação, trava) → métricas → seções → sugestão → "seguir com a sugestão?". Não grava nada. Os passos
de coleta valem também para os outros fluxos da skill.
