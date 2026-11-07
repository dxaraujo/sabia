---
{"fluxo": "iteracao", "dono": "sa-especificador",
 "quando": ["só a pedido, ou oferta da sa-planejamento.sprint depois de gravar o sprint", "criar a iteração no EWM", "mover as tarefas para a sprint no EWM"],
 "travas_gerais": ["sim-da-pessoa", "elm-pela-sa-elm"],
 "passos": [
   {"id": "inicio", "chama": "sa-elm.regras", "saidas": {"ELM não configurado ou autopilot (sa-elm.regras)": "fim"}},
   {"id": "criar"},
   {"id": "mover"},
   {"id": "devolver"}
 ]}
---
# Iteração — a sprint no EWM, só a pedido

Só a pedido: cria no EWM a iteração da sprint e move para ela o IB e as tarefas. Não faz parte do rito e nunca
é pré-condição de planejamento, review ou retrospectiva.
