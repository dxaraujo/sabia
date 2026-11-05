---
{"fluxo": "refinamento", "dono": "sa-produto",
 "quando": ["o backlog do épico já existe (depois do GATE do backlog): cancelar fatias ou o épico, decisão do P.O.; as fatias não se alteram mais, e cenário novo vai à sa-triar", "cancelar um épico ainda não fatiado", "refinar o backlog", "cancelar a FT-033", "cancelar o EP-05"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "refinar", "saidas": {"refinamento gravado": "→ sa-fatiar.fatiar.proximos", "fatia de Manutenção ou cenário novo: é da sa-triar": "→ sa-triar.triar", "alteração de artefato: a [ESP] FT aberta, ou reaberta nesta sprint": "→ sa-especificar.fatia", "alteração de artefato: sem [ESP] FT, ou concluída numa sprint fechada, com sprint aberta (o encaixe)": "→ sa-planejamento.durante", "alteração de artefato sem sprint aberta: pendência do P.O. na [GB]": "→ sa-planejamento.sprint", "dividir, juntar ou mudar uma fatia do backlog: não se faz": "fim"}}
 ]}
---
# Refinamento — o backlog já existe

Entrada: o backlog do épico já existe, com o épico na Fase `fatiado` (depois do GATE do backlog), na base
(`<produto>/epicos/<EP>-<slug>/`), e uma decisão do P.O.: cancelar fatias ou o épico; ou o épico ainda não fatiado,
em qualquer situação não terminal (`novo` a `iniciado`), só para cancelá-lo. Os requisitos são voláteis (a necessidade
pode deixar de existir pela priorização do cliente), então o cancelamento continua; as fatias do backlog não se
alteram mais (dividir e juntar, só antes do GATE do backlog, no passo `sa-fatiar.fatiar.perguntar`), e cenário novo
é épico ou fatia nova pela `sa-triar`.

## Modo autônomo

O mesmo do fluxo `sa-fatiar.fatiar`: fatiar é decisão de uma pessoa (o GATE do backlog) — chamada em modo autônomo → pare.

## Regras

As do fluxo `sa-fatiar.fatiar`; os critérios de boa fatia estão no passo `sa-fatiar.fatiar.rascunho`.
