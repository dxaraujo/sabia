---
{"fluxo": "moldar", "dono": "sa-especificador",
 "quando": ["épico a-moldar: pitch.md de uma página (Shape Up) e decisão de investimento de quem tem produto", "moldar o EP-04", "ideia nova grande", "pitch do épico", "investir ou cancelar o EP-04"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa", "aprovacao-no-documento", "aprovacao-do-cliente", "elm-pela-sa-elm"],
 "passos": [
   {"id": "entrada", "de": "entrada", "papel": "nenhuma", "branch": "nao", "saidas": {"ideia grande em texto, ainda não registrada: cadastro como épico": "cadastro"}},
   {"id": "pitch", "chama": ["sa-entrevistar.entrevistar", "sa-especificar.prototipo", "sa-elm.baixar"]},
   {"id": "decisao", "saidas": {"cabe em G: nasce a fatia": "cadastro"}},
   {"id": "commit-na-branch-base", "de": "commit-na-branch-base", "saidas": {"gravou o épico cadastrado na entrada": "pitch"}},
   {"id": "seguir", "saidas": {"investir: seguir para o PRD": "→ sa-prd.prd", "cabe em G: seguir para o detalhar": "→ sa-refinar.detalhar", "cancelar: moldar o próximo épico a-moldar": "entrada", "sem decisão, ou não": "fim"}},
   {"id": "cadastro", "de": "cadastro", "saidas": {"linha preparada": "commit-na-branch-base"}}
 ]}
---
# Moldar — pitch e decisão de investimento do épico

Shape Up antes do PRD: o épico `a-moldar` ganha o `pitch.md` de uma página na pasta
`.sabia/planejamento/epicos/EP-nn-<slug>/` (problema, limite de investimento, esboço da solução, riscos, fora do escopo), e quem tem
`produto` decide investir ou cancelar. Investir: `em-especificacao` e o PRD (`sa-prd.prd`). Cancelar: `cancelado`, e a pasta fica.
Aceita épico em `a-moldar`.

## Entrada: vizinhos

- épico `em-especificacao` → `sa-prd.prd`
- épico `fatiado` → `sa-refinar.ajustar`
- fatia ou bug → `sa-refinar.detalhar`
- sustentação → `sa-atender.atender` (agente `sa-desenvolvedor`)
