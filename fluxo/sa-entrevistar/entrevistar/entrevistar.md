---
{"fluxo": "entrevistar", "dono": "sa-especificador",
 "quando": ["esclarecimento proporcional do trecho tocado: árvore de decisões, rodadas de até 5 perguntas com recomendação e registro nas seções Decisões e Em aberto do documento do item (pitch.md, prd.md ou ficha); chamado pela sa-refinar.moldar, sa-refinar.detalhar, sa-prd.prd, sa-prd.mudanca, sa-desenvolver.codificar ou direto", "vamos alinhar o FT-031", "responder o em aberto do EP-03", "me entreviste", "o que falta definir"],
 "travas_gerais": ["decisao-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "papel": "nenhuma", "branch": "nao"},
   {"id": "arvore", "chama": "sa-pesquisar.pesquisar"},
   {"id": "rodadas", "saidas": {"resposta abriu ramos, ou a fronteira não está vazia": "rodadas"}},
   {"id": "registrar"},
   {"id": "linguagem", "saidas": {"chamada por outra skill (ela grava junto com o documento dela)": "devolver"}},
   {"id": "gravar", "de": "commit-na-branch-base"},
   {"id": "devolver"}
 ]}
---
# Entrevistar — alinhar antes de escrever

O esclarecer do Sabiá: a árvore de decisões só do trecho tocado, o que tem fonte respondido pela
`sa-pesquisar.pesquisar` e, para a pessoa, só a regra de negócio, em rodadas de até 5 perguntas, cada uma com a
recomendação. Grava nas seções Decisões e Em aberto do documento do item. Vale a decisão de uma pessoa, com quem e
quando; a lacuna de rotina vira suposição; o que fica em aberto bloqueia só o que depende dele.

Entrada: o item e o documento, de quem chama. Na chamada direta, o documento sai do id: `pitch.md` (épico em
`a-moldar`), `prd.md` (épico depois do go) ou a ficha (fatia ou bug).

## Entrada: vizinhos

- sustentação → "a Sustentação não passa pela entrevista: `sa-atender.atender` (agente `sa-desenvolvedor`)" ■

## Regras

- Sem pessoa presente (autopilot): não pergunte. Tudo sem fonte vai ao Em aberto com a recomendação, e quem chamou não
  trata recomendação como decisão.
- Decisão técnica entre alternativas equivalentes é do Dev e vai ao `design.md`, não aqui.
