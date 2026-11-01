---
{"fluxo": "atendimento", "dono": "sa-produto",
 "quando": ["uma rodada curta para registrar um AT na triagem, chamado pela sa-triar"],
 "travas_gerais": ["decisao-da-pessoa"],
 "passos": [
   {"id": "rodada"}
 ]}
---
# Entrevistar — modo atendimento (chamado pela `sa-triar`)

Entrada: o pedido de atendimento (`AT-<nnn>`) que a `sa-triar` está registrando. Uma rodada só, no mesmo formato
de `sa-entrevistar.entrevistar` (numerada, com recomendação, "sim" aceita tudo), sem árvore nem glossário.

## Regras

As Regras de `sa-entrevistar.entrevistar` valem aqui.
