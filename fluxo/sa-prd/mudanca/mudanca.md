---
{"fluxo": "mudanca", "dono": "sa-especificador",
 "quando": ["mudar o prd.md aprovado, antes ou depois de fatiar: tira a aprovação, registra a versão em Mudanças, reescreve, o P.O. reaprova e a mudança chega às fatias atingidas; chamado pela sa-prd.prd, sa-refinar.fatiar, sa-refinar.ajustar, sa-especificar.reuniao, sa-especificar.prototipo ou direto", "mudar o PRD do EP-03"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "papel": "nenhuma", "branch": "nao"},
   {"id": "versao"},
   {"id": "editar"},
   {"id": "aprovar", "travas": ["aprovacao-no-documento"], "saidas": {"ajuste pedido": "editar"}},
   {"id": "gravar", "de": "commit-na-branch-base"},
   {"id": "fatias", "saidas": {"nenhuma fatia concluida atingida": "devolver"}},
   {"id": "cadastrar", "de": "cadastro"},
   {"id": "devolver", "saidas": {"fatia atingida e o pedido direto: seguir para o ajuste das fatias": "→ sa-refinar.ajustar"}}
 ]}
---
# Mudança — o PRD aprovado muda

O `prd.md` aprovado muda no mesmo arquivo, antes ou depois de fatiar: a aprovação sai, a versão entra em Mudanças, o
texto muda só no que muda, o P.O. reaprova no documento e a mudança chega às fatias atingidas
(`sa-refinar.ajustar`, aviso ao responsável ou cadastro).

Entrada: o `prd.md` aprovado e o épico `em-especificacao` ou `fatiado`.

## Entrada: vizinhos

- épico `a-moldar` → `sa-refinar.moldar`
- épico `em-especificacao` sem o `prd.md` aprovado → `sa-prd.prd`
- fatia ou bug → `sa-refinar.ajustar`
- sustentação → "PRD é só do épico" ■
- sem pessoa presente (subagente) → "mudar o PRD é decisão de pessoa" ■

## Regras

As do fluxo `sa-prd.prd`, e:

- Os ids ficam estáveis. Requisito que sai é marcado exclui, e o id dele nunca é reaproveitado.
- Enquanto o PRD estiver sem aprovação, a `sa-refinar.fatiar` não grava fatias novas.
