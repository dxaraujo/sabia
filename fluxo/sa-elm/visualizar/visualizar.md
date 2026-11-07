---
{"fluxo": "visualizar", "dono": "sa-especificador",
 "quando": ["gera a visualização do bundle", "quero explorar o bundle", "o sim a indexar agora? na sa-elm.baixar"],
 "travas_gerais": ["elm-pela-sa-elm"],
 "passos": [
   {"id": "inicio", "chama": "sa-elm.regras", "saidas": {"ELM não configurado ou autopilot (sa-elm.regras)": "fim"}},
   {"id": "gerar", "saidas": {"gerado": "saida"}},
   {"id": "sem-indice", "saidas": {"indexado": "gerar", "sem bundle, com o sim a baixar": "→ sa-elm.baixar"}},
   {"id": "saida"}
 ]}
---
# Visualizar — o bundle em galáxias, offline

O `elm_explorar_local` gera o `explorar.html` offline a partir do índice, a pedido ou depois do "sim" da
indexação na `sa-elm.baixar`.
