---
{"resumo": "Cria a iteração '<pai>/Sprint <nn>' com as datas do cabeçalho do sprint."}
---
## Entrada

O `sprint-<nn>.md` aberto.

## Faça

Leia o cabeçalho (`# <AAAA>/Sprint <nn> · <início> → <fim>`). Prévia e "sim" → `elm_iteracao("<pai>/Sprint
<nn>", inicio, fim)`: acha ou cria a iteração dentro do pai (o pai é o `<AAAA>` da chave). `permissao` → peça a
quem administra a PA. `entrada` "ambígua" → mostre e peça que a pessoa resolva no EWM; nunca crie outra.

## Saída

A iteração → passo `mover`.

## Pare se

- Sem o "sim" → nada criado; devolva.
