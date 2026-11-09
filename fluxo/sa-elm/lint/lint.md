---
{"fluxo": "lint", "dono": "sa-especificador",
 "quando": ["só a pedido, uso raro", "lint do ELM", "o glossário contradiz os ADRs?"],
 "travas_gerais": ["sim-da-pessoa", "elm-pela-sa-elm", "decisao-da-pessoa"],
 "passos": [
   {"id": "inicio", "chama": "sa-elm.regras", "saidas": {"ELM não configurado ou autopilot (sa-elm.regras)": "fim"}},
   {"id": "comparar"},
   {"id": "achados", "saidas": {"nenhum a registrar": "gravar"}},
   {"id": "cadastro", "de": "cadastro"},
   {"id": "gravar", "de": "commit-na-branch-base"},
   {"id": "encerrar", "saidas": {"sim: seguir para a triagem": "→ sa-triar.triar"}}
 ]}
---
# Lint — contradições entre o DOORS e o repositório

Uso raro, só a pedido. Procura contradições entre o GL e os requisitos do DOORS e os artefatos do repositório
(ADRs, `glossario.md`, Regras aprendidas do `sabia.md`). O DOORS só muda pela `sa-elm.publicar` de uma fatia.
