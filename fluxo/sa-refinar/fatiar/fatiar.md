---
{"fluxo": "fatiar", "dono": "sa-especificador",
 "quando": ["PRD aprovado → fatias verticais P/M/G com artefatos afetados, aprovadas e ordenadas por quem tem produto, num commit", "fatiar o PRD", "fatiar o EP-04", "quebrar em histórias", "gerar o backlog do épico"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa", "aprovacao-no-documento", "artefato-exclusivo"],
 "passos": [
   {"id": "entrada", "de": "entrada", "papel": "nenhuma", "branch": "nao"},
   {"id": "rascunho", "chama": "sa-pesquisar.pesquisar"},
   {"id": "perguntar", "saidas": {"ajuste pedido: repita até o ok": "perguntar", "conceito do PRD que muda": "→ sa-prd.mudanca", "sem quem tem produto na sessão": "fim"}},
   {"id": "gravar"},
   {"id": "commit-na-branch-base", "de": "commit-na-branch-base"},
   {"id": "proximos", "saidas": {"detalhar a primeira": "→ sa-refinar.detalhar", "não": "fim"}}
 ]}
---
# Fatiar — PRD aprovado em fatias verticais

O especificador propõe as fatias com o Dev, com os fatos do código pela `sa-pesquisar`; quem tem `produto` aprova e
ordena. As fatias nascem `aceita`, com ficha (Objetivo, artefatos afetados e os cenários do PRD que cobrem), num commit, e o
épico vai para `fatiado`. Cada uma ainda passa pelo detalhar para chegar a `pronta`. Aceita épico em
`em-especificacao` com o `prd.md` na branch base aprovado (`**Aprovado:** <usuario> · AAAA-MM-DD` de quem tem `produto`).

## Regras

- Nunca crie fatia por camada técnica ou por papel ("criar a tabela", "testar X"): o trabalho de todos na mesma
  entrega é a mesma fatia.
- O fatiamento não muda conceito do PRD: o que precisa mudar vai à `sa-prd.mudanca` antes.
- Tamanho é o sinal de que a fatia cabe num MR revisável, não promessa de prazo.

## Entrada: vizinhos

- épico `em-especificacao` sem o `prd.md` aprovado → `sa-prd.prd`
- épico `a-moldar` → `sa-refinar.moldar`
- épico `fatiado` → `sa-refinar.ajustar`
- fatia ou bug → `sa-refinar.detalhar`
