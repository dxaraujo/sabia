---
{"resumo": "Mapeia cada WI para a captura: tipo, relator, ib, obs e o corpo mínimo."}
---
## Entrada

Os WIs novos.

## Faça

Para cada WI, os dados da captura: tipo Defeito → `bug`, Item de Backlog → `fatia` (série `FT-nnn`); status
`nova`; pai vazio; relator = o `usuario` do `equipe.json` cujo `elm_login` criou o WI, senão o nome do criador
(`externo: <nome>`); `ib` = o número do WI; obs `origem EWM <n>`; a descrição do WI vira o corpo mínimo da
ficha (Entrada). Mostre a prévia do lote; uma confirmação vale para todos.

## Saída

O lote confirmado → passo `captura`, um WI por vez, e um commit único no passo `gravar`.

## Pare se

- Sem o "sim" → nada entra; encerre.
