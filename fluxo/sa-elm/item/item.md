---
{"fluxo": "item", "dono": "sa-desenvolvedor",
 "quando": ["o sim a \"quer criar o item no ELM?\" ao assumir um trabalho (DEV, ESP ou ATD)", "criar o item no ELM", "criar a tarefa no EWM", "criar o IB dos itens sem IB", "ler o WI 4567", "comentar na minha tarefa", "anexar na tarefa"],
 "travas_gerais": ["sim-da-pessoa", "elm-pela-sa-elm"],
 "passos": [
   {"id": "inicio", "chama": "sa-elm.regras", "saidas": {"ELM não configurado ou autopilot (sa-elm.regras)": "fim", "pedido de IB em lote": "ib-em-lote", "ler um WI": "ler-wi", "comentar ou anexar": "comentar"}},
   {"id": "ib"},
   {"id": "linha-no-sprint", "saidas": {"sem sprint aberta": "gravar-ids"}},
   {"id": "tarefa"},
   {"id": "gravar-ids", "saidas": {"ids prontos": "gravar"}},
   {"id": "ib-em-lote"},
   {"id": "gravar", "de": "commit-na-branch-base", "saidas": {"gravado": "devolver"}},
   {"id": "ler-wi", "saidas": {"lido": "devolver"}},
   {"id": "comentar"},
   {"id": "devolver"}
 ]}
---
# Item — IB e tarefa ao assumir um trabalho

Ao assumir um trabalho: cria o IB se faltar, cria e assume a tarefa do trabalho (`DEV` · `ESP` · `ATD`) e grava
os ids. A pedido, também cria IB em lote, lê um WI e comenta ou anexa na tarefa da própria pessoa.
