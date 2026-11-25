---
{"fluxo": "review", "dono": "sa-especificador",
 "quando": ["fim do ciclo, com os stakeholders quando disponíveis: o entregue com a evidência do MR, o feedback de cada entrega, as novas ideias e necessidades pelo cadastro, a repriorização do backlog, o Histórico de Entregas e as Métricas da sprint", "review da sprint"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa", "elm-pela-sa-elm"],
 "passos": [
   {"id": "inicio"},
   {"id": "rito", "saidas": {"sem ideia nem necessidade nova": "backlog"}},
   {"id": "cadastro", "de": "cadastro", "saidas": {"mais uma ideia ou necessidade": "cadastro"}},
   {"id": "backlog", "chama": "sa-elm.finalizar"},
   {"id": "historico"},
   {"id": "metricas"},
   {"id": "gravar"},
   {"id": "commit-na-branch-base", "de": "commit-na-branch-base"},
   {"id": "seguir", "saidas": {"sim": "→ sa-planejamento.retrospectiva"}}
 ]}
---
# Review da sprint

Fim do ciclo, com os stakeholders presentes e sem travar: o que foi entregue, com a evidência do MR → feedback de cada entrega e
novas ideias e necessidades no `sprint-<nn>.md` (pela página `sabia review`, em etapas que o apresentador libera) → cada
ideia ou necessidade vira item novo pelo cadastro → o que a repriorização do backlog mudou → Histórico de Entregas → Métricas da sprint → grava → "seguir para a
retrospectiva?". É a reunião de mostrar o que foi feito ao cliente e aos stakeholders: as Lições aprendidas, assunto
interno do time, ficam com a retrospectiva. Não há consolidação nem pré-condição de rito.
