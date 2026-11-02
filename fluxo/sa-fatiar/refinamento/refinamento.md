---
{"fluxo": "refinamento", "dono": "sa-especificador",
 "quando": ["o backlog do épico já existe (depois do GATE do backlog): cancelar fatias ou o épico, decisão do P.O.; as fatias não se alteram mais, e cenário novo vai à sa-triar", "refinar o backlog", "cancelar a FT-033", "cancelar o EP-05"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "refinar", "saidas": {"refinamento gravado": "→ sa-fatiar.fatiar.proximos", "fatia de Manutenção ou cenário novo: é da sa-triar": "→ sa-triar.triar", "dividir, juntar ou mudar uma fatia do backlog: não se faz": "fim"}}
 ]}
---
# Refinamento — o backlog já existe

Entrada: o backlog do épico já existe — épico na Fase `fatiado`, na base (`<produto>/epicos/<EP>-<slug>/`), depois
do GATE do backlog — e uma decisão do P.O.: cancelar fatias ou o épico. Os requisitos são voláteis (a necessidade
pode deixar de existir pela priorização do cliente), então o cancelamento continua; as fatias do backlog não se
alteram mais (dividir e juntar, só antes do GATE do backlog, no passo `sa-fatiar.fatiar.perguntar`), e cenário novo
é épico ou fatia nova pela `sa-triar`.

## Modo autônomo

O mesmo do fluxo `sa-fatiar.fatiar`: fatiar é decisão de uma pessoa (o GATE do backlog) — chamada em modo autônomo → pare.

## Regras

As do fluxo `sa-fatiar.fatiar`; os critérios de boa fatia estão no passo `sa-fatiar.fatiar.rascunho`.
