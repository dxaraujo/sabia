---
{"fluxo": "regras", "dono": "sa-desenvolvedor",
 "quando": ["incluído pelo passo inicio de cada um dos outros fluxos da sa-elm; nunca roda sozinho"],
 "travas_gerais": ["sim-da-pessoa", "elm-pela-sa-elm"],
 "passos": [
   {"id": "inicio"},
   {"id": "pre-condicao"},
   {"id": "autopilot"},
   {"id": "escrita"},
   {"id": "leitura"},
   {"id": "identidade"},
   {"id": "ids"},
   {"id": "titulos"},
   {"id": "erros"},
   {"id": "volta"}
 ]}
---
# Regras — o que vale em todo fluxo da sa-elm

Pré-condição, autopilot, escrita com prévia, leitura livre, identidade, onde os ids moram, títulos e erros
do MCP. O passo `inicio` de cada fluxo da `sa-elm` inclui estas regras e segue com o resultado. Nenhuma falha
aqui trava a skill que ofereceu o ELM: ela segue com qualquer resposta. Tools, retornos e erros do MCP `elm`: [mcp.md](~/.sabia/framework/skills/sa-elm/references/mcp.md).
