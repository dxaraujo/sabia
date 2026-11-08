---
{"fluxo": "replanejar", "dono": "sa-desenvolvedor",
 "quando": ["o plano aprovado não serve: divergência arquitetural, achado volta-plano ou texto novo aprovado pelo especificador; muda só o que mudou e devolve à codificação", "replaneja", "o plano não serve"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "papel": "desenvolvedor", "branch": "fatia"},
   {"id": "atualizar"},
   {"id": "revisar", "chama": "sa-revisar.revisar", "saidas": {"achado corrige: ajusta de novo": "atualizar"}},
   {"id": "aprovar", "saidas": {"aprovado: volta à tarefa": "→ sa-desenvolver.codificar.tarefa"}}
 ]}
---
# Replanejar — o plano não serve

Chamada pela `sa-desenvolver.codificar` com o plano já aprovado, quando há divergência arquitetural, achado
`volta-plano` ou texto novo aprovado pelo especificador. Muda só o que mudou, sem desmarcar o que foi feito, e
devolve à codificação.

Deste fluxo: rota rápida ou completo, Fase diferente de `—`, e o motivo de quem chamou (esperado × encontrado, o
achado ou o texto novo).

## Entrada: vizinhos

- rota trivial → `sa-desenvolver.codificar`
- Fase — (plano não aprovado) → `sa-plano.plano`
