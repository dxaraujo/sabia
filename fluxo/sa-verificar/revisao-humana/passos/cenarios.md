---
{"resumo": "Mostra os cenários CT-nn da spec e o 🔎 da Prova do MR; a pessoa escolhe os do risco e a sa-verificar.verificar os roda com ela, que exercita e confirma cada resultado."}
---
## Entrada

A branch `<id>` atualizada (passo `branch`).

## Faça

1. Mostre os cenários CT-nn da spec (na trivial, os da ficha) e o 🔎 da Prova do MR.
2. A pessoa escolhe os cenários do risco; o padrão são todos os que o Risco do MR cita.
3. Chame a `sa-verificar.verificar` no subagente `sa-verificador` com os cenários escolhidos, dizendo que quem chama é
   a revisão humana (o `CT.csv` não é reescrito). A pessoa acompanha: exercita a tela ou a chamada e confirma cada resultado
   (✅ · ❌ · ⚠️ · 🔁).

## Saída

O 🔎 da revisão humana, com o resultado confirmado pela pessoa em cada cenário → passo `decisao`.

## Pare se

—
