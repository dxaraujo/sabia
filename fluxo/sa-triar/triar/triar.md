---
{"fluxo": "triar", "dono": "sa-especificador",
 "quando": ["triagem item a item: pedido em texto, número do EWM, id do backlog.md ou a fila de itens nova", "triagem", "triar a fila", "nova demanda", "chegou um pedido", "o cliente pediu", "registra o defeito 4567 e tria", "triar a FT-031"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa", "elm-pela-sa-elm"],
 "passos": [
   {"id": "entrada", "de": "entrada", "papel": "nenhuma", "branch": "nao", "saidas": {"sem .sabia/planejamento/backlog.md na branch base: diga 'rode a sa-setup'": "fim", "pedido em texto, número do EWM ou nada informado (não é o caso 'não registrado' da entrada comum)": "ler", "fatia ou bug em adiada até <data> (retriagem: o adiamento se trata no decidir)": "ler"}},
   {"id": "ler", "chama": "sa-elm.item"},
   {"id": "duplicado", "saidas": {"o mesmo de um item aberto, e a entrada é pedido em texto ou EWM": "encaminhar"}},
   {"id": "decidir", "saidas": {"duplicado, recusa, falta informação ou agora não": "registrar"}},
   {"id": "classificar"},
   {"id": "registrar", "saidas": {"item novo (pedido em texto ou EWM) ou troca de série": "captura"}},
   {"id": "commit-na-branch-base", "de": "commit-na-branch-base"},
   {"id": "encaminhar", "saidas": {"mais um item": "ler", "não": "fim"}},
   {"id": "captura", "de": "captura", "saidas": {"linha preparada, com a triagem aplicada": "commit-na-branch-base"}}
 ]}
---
# Triar — decidir se o item entra

Qualquer pessoa tria, item a item, direto na branch base (na prática, P.O. e SM; o Dev pode triar o que achou). A triagem
decide se o item entra (aceita, cancelada, falta informação ou adiada) e, no aceito, o tipo, o tamanho, a prioridade
e o pai. Todo ramo grava, um commit por item. O próximo passo do item é só sugestão de sessão nova. Aceita qualquer
tipo em `nova` e fatia ou bug em `aceita` ou `adiada até <data>` (retriagem). Item já registrado em outro estado é
de outro fluxo:

## Entrada: vizinhos

- fatia ou bug `pronta` → `sa-refinar.ajustar`
- fatia ou bug `em-andamento` → `sa-desenvolver.codificar` (agente `sa-desenvolvedor`)
- épico `a-moldar` → `sa-refinar.moldar`
- épico `em-especificacao` → `sa-prd.prd`
- épico `fatiado` → `sa-refinar.ajustar`
- sustentação `em-andamento` → `sa-atender.atender` (agente `sa-desenvolvedor`)
