---
{"fluxo": "item", "dono": "sa-desenvolvedor",
 "quando": ["consulta do item: recebe '<id>' (EP, FT, AT…, ib ou tarefa do EWM), mostra o estado e diz a skill.fluxo dona, com 'seguir agora?'", "<id>", "vamos trabalhar na FT-031", "pegar a AT-012", "retomar a FT-031"],
 "travas_gerais": ["elm-pela-sa-elm"],
 "passos": [
   {"id": "inicio", "saidas": {"sem .sabia/sabia.md": "fim"}},
   {"id": "identificar", "saidas": {"não registrado ou fora do Sabiá": "fora-do-sabia"}},
   {"id": "estado"},
   {"id": "terminal", "saidas": {"terminal": "fim"}},
   {"id": "triagem-e-refinamento", "saidas": {"casou": "mostrar-e-seguir"}},
   {"id": "desenvolvimento", "saidas": {"casou": "mostrar-e-seguir", "trava de artefato": "fim"}},
   {"id": "epico", "saidas": {"casou": "mostrar-e-seguir"}},
   {"id": "sustentacao"},
   {"id": "mostrar-e-seguir", "saidas": {"seguiu ou terminou": "fim"}},
   {"id": "fora-do-sabia"}
 ]}
---
# Item

Recebe `<id>` (FT, EP, AT…, `ib` ou tarefa do EWM): identifica o item, mostra o estado (status, branch, MR, Fase,
trava) e diz a `skill.fluxo` dona pela tabela única de estado → skill (os passos de caso, na ordem), com "seguir
agora?". Não grava nada.
