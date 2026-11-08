---
{"fluxo": "publicar", "dono": "sa-especificador",
 "quando": ["o sim a \"publicar no DOORS?\" na sa-especificar.archive, depois do merge", "publicar no DOORS", "publicar a FT-031", "publicações pendentes", "subir os requisitos da fatia"],
 "travas_gerais": ["sim-da-pessoa", "elm-pela-sa-elm"],
 "passos": [
   {"id": "inicio", "chama": "sa-elm.regras", "saidas": {"ELM não configurado ou autopilot (sa-elm.regras)": "fim", "sem a booleana especificador": "fim"}},
   {"id": "fonte", "travas": ["aprovacao-no-documento"]},
   {"id": "conferir-versao"},
   {"id": "publicar"},
   {"id": "trocar-ids"},
   {"id": "ligar"},
   {"id": "ata"},
   {"id": "marcar"},
   {"id": "gravar", "de": "gravar-na-base"},
   {"id": "devolver", "chama": "sa-elm.baixar"}
 ]}
---
# Publicar — os arquivos aprovados de elm/ no DOORS, depois do merge

Depois do merge, publica no DOORS os arquivos aprovados da pasta `elm/` da fatia. Confere a versão de cada
artefato (mudou → avisa e pula), cria os novos, troca o id provisório pelo do ELM e grava `Publicação: publicada
<data>` no `status.md`. Arquivo com `publicado: manual` no frontmatter (especificação feita direto no DOORS) não é
reenviado. Ordem, embutidos e chamadas: [mcp.md](~/.sabia/framework/skills/sa-elm/references/mcp.md).
