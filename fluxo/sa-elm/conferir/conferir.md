---
{"fluxo": "conferir", "dono": "sa-especificador",
 "quando": ["confere com o EWM", "o DOORS mudou?", "a sa-especificar.elm confere os artefatos da fatia", "as tarefas do sprint batem com o EWM?"],
 "travas_gerais": ["sim-da-pessoa", "elm-pela-sa-elm"],
 "passos": [
   {"id": "inicio", "chama": "sa-elm.regras", "saidas": {"ELM não configurado ou autopilot (sa-elm.regras)": "fim", "modo artefatos": "artefatos"}},
   {"id": "tarefas", "saidas": {"divergências listadas": "corrigir"}},
   {"id": "artefatos", "saidas": {"o especificador quer baixar de novo e mesclar (pedido direto)": "→ sa-especificar.elm", "seguir": "devolver"}},
   {"id": "corrigir", "chama": "sa-elm.finalizar", "saidas": {"corrigir o id na linha": "gravar", "nada a gravar": "devolver"}},
   {"id": "gravar", "de": "gravar-na-base"},
   {"id": "devolver"}
 ]}
---
# Conferir — sprint × EWM ou elm/ × DOORS, só leitura

Só leitura. Compara as tarefas do `sprint-<nn>.md` com o EWM (modo tarefas), ou os arquivos de `elm/` da fatia
com o DOORS atual (modo artefatos). O EWM nunca decide o status do `backlog.md`.
