---
{"fluxo": "baixar", "dono": "sa-especificador",
 "quando": ["baixar o bundle", "atualiza o bundle", "baixa os requisitos", "o bundle está desatualizado", "a sa-especificar.elm pede o original de um requisito (modo artefato)"],
 "travas_gerais": ["elm-pela-sa-elm"],
 "passos": [
   {"id": "inicio", "chama": "sa-elm.regras", "saidas": {"ELM não configurado ou autopilot (sa-elm.regras)": "fim"}},
   {"id": "pre-condicao", "saidas": {"modo artefato": "artefato", "sem ELM ou pa incompleto": "fim"}},
   {"id": "plano"},
   {"id": "baixar-bundle", "saidas": {"bundle no .gitignore": "indexar"}},
   {"id": "commit", "de": "gravar-na-base"},
   {"id": "indexar", "chama": "sa-elm.visualizar", "saidas": {"modo bundle": "saida"}},
   {"id": "artefato", "travas": ["artefato-exclusivo"]},
   {"id": "saida"}
 ]}
---
# Baixar — DOORS → repositório: o bundle ou o original de um requisito

Só no sentido DOORS → repositório, em dois modos. Bundle: baixa a cópia local, grava `sincronizado_em`, faz o
commit e oferece indexar. Artefato: lê o original de um requisito para a pasta `elm/` da fatia; quem grava o
arquivo e o commit de base é a `sa-especificar.elm`. Não envia nada e não tem conflito.
