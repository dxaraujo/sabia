---
{"fluxo": "prd", "dono": "sa-especificador",
 "quando": ["o PRD do épico depois da decisão de investir no pitch.md: prd.md na pasta do épico, direto na branch base, proporcional ao tamanho, com a aprovação do P.O. gravada no topo; chamado pela sa-refinar.moldar ao investir ou direto", "escrever o PRD do EP-03", "aprovar o PRD do EP-03", "retomar o PRD do EP-03"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa", "elm-pela-sa-elm"],
 "passos": [
   {"id": "entrada", "de": "entrada", "papel": "nenhuma", "branch": "nao", "saidas": {"pedido de aprovação ('aprovar o PRD do EP-nn')": "aprovar"}},
   {"id": "assumir", "chama": "sa-elm.item"},
   {"id": "abrir"},
   {"id": "entender", "chama": "sa-pesquisar.pesquisar"},
   {"id": "esclarecer", "chama": ["sa-entrevistar.entrevistar", "sa-especificar.reuniao"]},
   {"id": "similares"},
   {"id": "escrever", "chama": "sa-especificar.prototipo"},
   {"id": "validar", "saidas": {"achado que é decisão de negócio": "esclarecer"}},
   {"id": "aprovar", "travas": ["aprovacao-no-documento"], "saidas": {"ajuste pedido": "escrever"}},
   {"id": "gravar", "de": "commit-na-branch-base"},
   {"id": "concluir", "chama": "sa-elm.finalizar", "saidas": {"seguir para o fatiamento": "→ sa-refinar.fatiar"}}
 ]}
---
# PRD — o quê e por quê do épico

Depois da decisão de investir no `pitch.md`, o `prd.md` nasce em `.sabia/planejamento/epicos/EP-nn-<slug>/`, ao lado do pitch, direto
na branch base. Entender (fatos pela `sa-pesquisar.pesquisar`) → esclarecer (`sa-entrevistar.entrevistar`) → similares →
escrever → validar (avisa) → aprovação do P.O. gravada no topo do `prd.md` → "seguir para o fatiamento?"
(`sa-refinar.fatiar`). Sem MR e sem publicar: os requisitos sobem ao DOORS pelas fatias (`sa-especificar.elm` e
`sa-especificar.archive`).

## Entrada: vizinhos

- fatia ou bug → `sa-refinar.detalhar` ("PRD é só do épico")
- épico `a-moldar` (sem decisão de investir) → `sa-refinar.moldar`
- épico `fatiado`, ou `em-especificacao` com o `prd.md` aprovado → `sa-prd.mudanca` ou `sa-refinar.fatiar` (pergunte qual)
- sustentação → "PRD é só do épico" ■
- sem pessoa presente (subagente) → "PRD é decisão de pessoa" ■

## Regras

- Nunca invente regra, valor ou ator: sem fonte, vai ao Em aberto.
- O PRD não tem caminho de arquivo, classe nem SQL: o como técnico é do `design.md` da fatia.
- Escreva no idioma do projeto; nomes de sistemas, tabelas e campos na forma original.
