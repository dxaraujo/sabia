---
{"fluxo": "sprint", "dono": "sa-especificador",
 "quando": ["seleção do ciclo, no início (com a virada) ou no reabastecimento: capacidade, folga, especificação, previsão, responsáveis, meta e o sprint-<nn>.md", "planejar a sprint", "reabastecer a sprint", "virada de sprint"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa", "elm-pela-sa-elm"],
 "passos": [
   {"id": "inicio", "saidas": {"sem equipe.json ou acordos.md": "→ sa-planejamento.inicial", "reabastecimento": "capacidade"}},
   {"id": "virada", "chama": ["sa-elm.finalizar", "sa-elm.iteracao"]},
   {"id": "capacidade"},
   {"id": "especificacao"},
   {"id": "previsao"},
   {"id": "responsaveis"},
   {"id": "meta"},
   {"id": "proposta", "saidas": {"ajuste": "proposta", "sem o ok, ou sem a booleana produto": "fim"}},
   {"id": "gravar"},
   {"id": "gravar-na-base", "de": "gravar-na-base"},
   {"id": "seguir", "chama": "sa-elm.iteracao", "saidas": {"sim": "→ sa-desenvolver.iniciar"}}
 ]}
---
# Planejamento da sprint

Seleção do ciclo, no início ou no reabastecimento: virada (só no início) → capacidade e folga → especificação →
previsão pela ordem das linhas → responsáveis → meta → proposta → grava o `sprint-<nn>.md` (e o `backlog.md` dos
itens que a virada tirou) → "seguir para puxar o topo?". Dentro do ciclo, o trabalho é puxado com sinal de WIP: item
fora da seleção (expedite, captura puxada na hora, especificação que fechou) ganha a linha pela skill que o puxa.
