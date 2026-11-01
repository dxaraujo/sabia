---
{"fluxo": "lote-ewm", "dono": "sa-produto",
 "quando": ["\"importar do EWM\", \"triar os defeitos do time\": os itens novos do EWM de uma vez"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "lote", "saidas": {"lote registrado: \"Mais algum item para triar?\"": "→ sa-triar.triar.encaminhar"}}
 ]}
---
# Lote do EWM — triar os itens novos do EWM de uma vez

"Importar do EWM", "triar os defeitos do time": o lote lista os itens novos do EWM, propõe a triagem numa tabela e,
com uma confirmação, registra cada linha pelo passo `sa-triar.triar.registrar`. Item a item (pedido em texto, um
número do EWM) é o fluxo `sa-triar.triar`.

## Regras

As do fluxo `sa-triar.triar` valem igual aqui.
