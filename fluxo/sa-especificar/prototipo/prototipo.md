---
{"fluxo": "prototipo", "dono": "sa-especificador",
 "quando": ["opcional, para dúvida grande de tela no shaping, no refinamento ou no PRD: registrar a versão vN do protótipo que o cliente vê (só dado fictício) e a resposta dele no documento do item; chamado pela sa-refinar.moldar, pela sa-refinar.detalhar, pela sa-prd.prd e pela sa-prd.mudanca, ou direto", "tenho o protótipo do EP-03", "o cliente respondeu a v2", "o cliente aprovou o protótipo"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "papel": "nenhuma", "branch": "nao", "saidas": {"resposta do cliente a uma versão já registrada": "aprovacao"}},
   {"id": "registrar", "saidas": {"nenhum arquivo novo e nenhuma versão aguardando o cliente": "devolver"}},
   {"id": "aprovacao", "travas": ["aprovacao-do-cliente"], "saidas": {"ajuste com a versão nova já na pasta": "registrar"}},
   {"id": "gravar", "de": "gravar-na-base"},
   {"id": "devolver", "saidas": {"aprovado e a EL muda num prd.md já aprovado": "→ sa-prd.mudanca"}}
 ]}
---
# Protótipo — a versão que o cliente vê

Opcional. Registra a versão `v<N>` do protótipo que o cliente vê, um conjunto de arquivos só com dado fictício, em
`.sabia/planejamento/prototipos/<id>-<slug>/v<N>/`, e grava a resposta do cliente no documento do item: o `pitch.md`
(épico em `a-moldar`), o `prd.md` (épico depois do go) ou a ficha (fatia ou bug). Não condiciona o PRD: só a EL
depende dele.

## Entrada: vizinhos

- sustentação → "o protótipo é de épico, fatia ou bug" ■
- sem pessoa presente (subagente) → "a resposta do cliente é com uma pessoa" ■

## Regras

- Só dado fictício. Nome, documento, conta ou valor de cliente real → não registra.
- Só arquivo (PDF, imagens, HTML exportado), nunca link: o link muda depois da aprovação.
- A aprovação é do cliente, com evidência; nunca deduzida de silêncio nem dada por quem especifica.
