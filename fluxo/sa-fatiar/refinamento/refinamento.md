---
{"fluxo": "refinamento", "dono": "sa-especificador",
 "quando": ["o backlog do épico já existe: dividir, juntar, cancelar ou criar fatias, ou cancelar o épico", "refinar o backlog", "a FT-033 está grande demais", "faltou uma fatia", "cancelar o EP-05"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "refinar", "saidas": {"refinamento gravado": "→ sa-fatiar.fatiar.proximos", "fatia de Manutenção: é da sa-triar": "→ sa-triar.triar", "fatia nova com cenário novo sem o PRD alterado": "→ sa-prd.mudanca"}}
 ]}
---
# Refinamento — o backlog já existe

Entrada: o backlog do épico já existe — épico na Fase `fatiado`, ou `aprovado` depois de uma mudança no PRD, na base
(`<produto>/epicos/<EP>-<slug>/`) — e um pedido de refinamento: dividir, juntar, cancelar ou acrescentar fatias, ou
cancelar o épico.

## Modo autônomo

O mesmo do fluxo `sa-fatiar.fatiar`: fatiar é decisão de uma pessoa (o GATE do backlog) — chamada em modo autônomo → pare.

## Regras

As do fluxo `sa-fatiar.fatiar`; os critérios de boa fatia estão no passo `sa-fatiar.fatiar.rascunho`.
