---
{"fluxo": "minha-proxima", "dono": "sa-desenvolvedor",
 "quando": ["o trabalho da pessoa, na ordem de prioridade (posse, revisão, responsável na sprint, aprovações pelas booleanas); a escolha segue como o item", "minha próxima", "o que eu pego agora?", "minhas tarefas"],
 "travas_gerais": ["elm-pela-sa-elm"],
 "passos": [
   {"id": "inicio"},
   {"id": "coletar"},
   {"id": "mostrar", "saidas": {"nada para a pessoa": "nada"}},
   {"id": "escolher", "saidas": {"escolheu": "→ sa-status.item.estado"}},
   {"id": "nada"}
 ]}
---
# Minha próxima

Lista o trabalho da pessoa (posse, revisão, responsável na sprint, aprovações pelas booleanas) na ordem de
prioridade; a escolha segue como a `sa-status.item`. Não lê o EWM.
