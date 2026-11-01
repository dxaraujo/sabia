---
{"fluxo": "replanejar", "dono": "sa-desenvolvedor",
 "quando": ["a implementação descobriu que o plano não serve: muda só o que mudou e repete a análise e o GATE do fluxo plano", "replaneja"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "replanejar", "saidas": {"plano atualizado: análise e GATE da parte alterada": "→ sa-plano.plano.analise", "lacuna de negócio: é do P.O.": "fim"}}
 ]}
---
# Replanejar — o plano não serve

Entrada: a implementação descobriu que o plano da fatia não serve (esperado × encontrado), em `.kiro/specs/<ft>-<slug>/`,
na branch da fatia.

Leia: o mesmo do fluxo `sa-plano.plano`, mais o plano atual da fatia.

## Modo autônomo

O do fluxo `sa-plano.plano`.

## Regras

As do fluxo `sa-plano.plano`.
