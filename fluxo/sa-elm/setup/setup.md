---
{"fluxo": "setup", "dono": "sa-especificador",
 "quando": ["a sa-setup.configurar perguntou \"usa ELM?\" e a resposta foi sim", "setup do ELM", "atualizar o pa", "configurar o ELM"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "inicio", "chama": "sa-elm.regras", "saidas": {"dentro de um agente sa-*": "fim"}},
   {"id": "mcp", "saidas": {"falta o MCP ou a credencial": "devolver"}},
   {"id": "montar-pa"},
   {"id": "et"},
   {"id": "gl"},
   {"id": "gravar-pa"},
   {"id": "validar", "saidas": {"erro no elm_status": "montar-pa"}},
   {"id": "dados"},
   {"id": "bundle", "chama": "sa-elm.baixar"},
   {"id": "devolver", "saidas": {"chamada direta, com o sim a seguir para a sa-setup": "→ sa-setup.configurar"}}
 ]}
---
# Setup — o ELM como dados para a sa-setup

Roda na sessão sem agente `sa-*`: o harness dos agentes nega `.sabia/config`. Só produz dados: grava o
`pa` e devolve à `sa-setup.configurar` a chave `elm` do `agentes.json` (com o `bundle`), o texto da seção ELM do
`sabia.md` e as regras ELM dos agentes. Quem aplica e regenera os agentes é a `sa-setup`. Roteiro do `pa`: [pa.md](~/.sabia/framework/skills/sa-elm/references/pa.md).
