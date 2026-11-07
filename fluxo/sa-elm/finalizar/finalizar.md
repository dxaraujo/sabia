---
{"fluxo": "finalizar", "dono": "sa-desenvolvedor",
 "quando": ["o sim a \"finalizar a tarefa no ELM?\" ao concluir um trabalho", "finalizar a tarefa no ELM", "concluir a DEV 123", "cancelar no EWM", "o item foi cancelado, cancela o IB"],
 "travas_gerais": ["sim-da-pessoa", "elm-pela-sa-elm"],
 "passos": [
   {"id": "inicio", "chama": "sa-elm.regras", "saidas": {"ELM não configurado ou autopilot (sa-elm.regras)": "fim", "cancelamento": "cancelar"}},
   {"id": "achar-tarefa", "saidas": {"sem tarefa": "devolver"}},
   {"id": "horas-antes", "chama": "sa-elm.horas"},
   {"id": "concluir"},
   {"id": "ligar-cobre"},
   {"id": "ib", "saidas": {"feito": "devolver"}},
   {"id": "cancelar", "saidas": {"vira épico: copiar o ib para a linha EP-nn": "gravar", "demais casos": "devolver"}},
   {"id": "gravar", "de": "gravar-na-base"},
   {"id": "devolver"}
 ]}
---
# Finalizar — concluir ou cancelar no EWM

Ao concluir um trabalho: oferece lançar as horas que faltam, conclui a tarefa, liga aos requisitos do Cobre e
oferece concluir o IB e o IB do épico. Também cancela no EWM o que o Sabiá cancelou ou tirou da sprint.
