---
{"fluxo": "importar-backlog", "dono": "sa-especificador",
 "quando": ["só a pedido, uso raro", "importar do EWM", "trazer os defeitos do time", "importar os itens de backlog do EWM"],
 "travas_gerais": ["sim-da-pessoa", "elm-pela-sa-elm"],
 "passos": [
   {"id": "inicio", "chama": "sa-elm.regras", "saidas": {"ELM não configurado ou autopilot (sa-elm.regras)": "fim"}},
   {"id": "filtro"},
   {"id": "so-os-novos"},
   {"id": "mapear"},
   {"id": "captura", "de": "captura"},
   {"id": "gravar", "de": "commit-na-branch-base"},
   {"id": "seguir", "saidas": {"sim: seguir para a triagem": "→ sa-triar.triar"}}
 ]}
---
# Importar backlog — Defeitos e Itens de Backlog do EWM

Uso raro, só a pedido. Traz do EWM os Defeitos e os Itens de Backlog que ainda não estão no `backlog.md` e grava
cada um como linha `nova` pela captura comum. A triagem vem depois.
