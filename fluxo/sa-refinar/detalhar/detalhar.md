---
{"fluxo": "detalhar", "dono": "sa-especificador",
 "quando": ["fatia ou bug aceita ou pronta: três amigos, ficha com regras, cenários CT-nn e Cobre e, com ELM, a pasta elm/, até pronta", "refinar a FT-031", "detalhar a FT-031", "três amigos", "ficha da FT-031", "alterei FT-031"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa", "aprovacao-no-documento", "aprovacao-do-cliente", "artefato-exclusivo", "elm-pela-sa-elm"],
 "passos": [
   {"id": "entrada", "de": "entrada", "papel": "nenhuma", "branch": "nao", "saidas": {"volta da especificação manual ('alterei FT-nnn')": "elm"}},
   {"id": "regras", "chama": "sa-entrevistar.entrevistar"},
   {"id": "cenarios"},
   {"id": "cobre", "chama": "sa-elm.baixar"},
   {"id": "elm", "chama": "sa-especificar.elm"},
   {"id": "duvidas", "chama": ["sa-pesquisar.pesquisar", "sa-especificar.prototipo", "sa-especificar.reuniao"], "saidas": {"resposta que muda regras ou cenários": "regras", "muitas regras ou mais que G, com corte possível: dividir": "→ sa-refinar.ajustar", "mais que G sem corte: vira épico": "captura"}},
   {"id": "ficha"},
   {"id": "gravar-na-base", "de": "gravar-na-base"},
   {"id": "seguir", "saidas": {"virou épico: seguir no moldar": "→ sa-refinar.moldar", "refinar o próximo": "entrada", "não": "fim"}},
   {"id": "captura", "de": "captura", "saidas": {"linha do épico preparada, com a fatia cancelada": "gravar-na-base"}}
 ]}
---
# Detalhar — três amigos na fatia e no bug

Pouco antes de alguém puxar, o especificador (ou o P.O.) com o Dev, e QA ou UX se houver, transforma regras e
exemplos na ficha: regras, cenários `CT-nn`, o Cobre (requisitos tocados, com a versão lida) e, com ELM, a pasta
`elm/` dos artefatos tocados, no modo da especificação escolhido. Com a DoR completa e a ficha aprovada por quem tem
`produto`, a linha vai para `pronta`. Curto no bug e no P: o bug sem requisito tocado é do Dev sozinho, com a
ficha curta (passos · atual · esperado · reproduzido). Aceita fatia ou bug em `aceita` ou `pronta`.

## Entrada: vizinhos

- fatia ou bug `nova` → `sa-triar.triar`
- fatia ou bug `em-andamento` → `sa-desenvolver.codificar` (agente `sa-desenvolvedor`)
- épico `a-moldar` → `sa-refinar.moldar`
- épico `em-especificacao` → `sa-prd.prd`
- épico `fatiado` → `sa-refinar.ajustar`
- sustentação → `sa-atender.atender` (agente `sa-desenvolvedor`)
