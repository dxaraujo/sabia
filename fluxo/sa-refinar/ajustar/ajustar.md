---
{"fluxo": "ajustar", "dono": "sa-especificador",
 "quando": ["o P.O. mexe no backlog refinado até alguém puxar: ordenar, dividir, juntar, editar, cancelar a fatia ou o épico; também a mudança do PRD nas fatias atingidas", "reordenar o backlog", "dividir a FT-033", "juntar a FT-033 e a FT-034", "editar a ficha da FT-033", "cancelar a FT-033", "cancelar o EP-05"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa", "aprovacao-no-documento", "artefato-exclusivo", "elm-pela-sa-elm"],
 "passos": [
   {"id": "entrada", "de": "entrada", "papel": "produto", "branch": "nao"},
   {"id": "previa", "saidas": {"ordenar": "ordenar", "dividir": "dividir", "juntar": "juntar", "editar": "editar", "cancelar a fatia ou o bug": "cancelar-fatia", "cancelar o épico": "cancelar-epico", "sem o ok do P.O.": "seguir"}},
   {"id": "ordenar", "saidas": {"ordem pronta": "gravar"}},
   {"id": "dividir", "saidas": {"partes novas": "captura"}},
   {"id": "juntar", "saidas": {"a soma passa de G": "previa", "junção pronta": "gravar"}},
   {"id": "editar", "saidas": {"cenário novo em fatia já entregue": "captura", "edição pronta": "gravar"}},
   {"id": "cancelar-fatia", "saidas": {"cancelamento pronto": "gravar"}},
   {"id": "cancelar-epico", "saidas": {"fatia em-andamento": "seguir", "cancelamento pronto": "gravar"}},
   {"id": "gravar"},
   {"id": "gravar-na-base", "de": "gravar-na-base"},
   {"id": "seguir", "chama": "sa-elm.finalizar", "saidas": {"mais um ajuste": "previa", "não": "fim"}},
   {"id": "captura", "de": "captura", "saidas": {"linhas novas preparadas": "gravar"}}
 ]}
---
# Ajustar — o backlog refinado até alguém puxar

Quem tem `produto` mexe no backlog refinado até alguém puxar (status antes de `em-andamento`): ordenar, dividir,
juntar, editar, cancelar a fatia ou o épico. Também recebe a mudança do PRD nas fatias atingidas (pela
`sa-prd.mudanca`, com as fatias pelos artefatos afetados). Cada ajuste mostra a prévia, só grava com o ok do P.O. e vai num commit.
Aceita fatia ou bug em `aceita` ou `pronta`, e épico em `em-especificacao` ou `fatiado` (para ordenar e cancelar).

## Entrada: vizinhos

- fatia, bug ou sustentação `nova` → `sa-triar.triar`
- fatia ou bug `em-andamento` → `sa-desenvolver.codificar` (agente `sa-desenvolvedor`; a mudança vira descoberta na spec da própria fatia, e quem ajusta avisa o responsável da linha)
- épico `a-moldar` → `sa-refinar.moldar`
- sustentação `em-andamento` → `sa-atender.atender` (agente `sa-desenvolvedor`)
