---
{"resumo": "Grava o pa_<nome>.json com o sim, conferido contra o schema."}
---
## Entrada

O `pa` montado e as respostas dos passos `et` e `gl`.

## Faça

Mostre o `pa` inteiro em tabela (com a origem de cada valor: descoberta, pessoa ou fixo) e depois o JSON que
será gravado, byte a byte, conferido contra o schema do `pa`. Com o "sim", grave
`.sabia/config/elm/pa_<nome>.json` (`<nome>` = nome da PA do EWM em minúsculas, sem acento, com hífen; sem
segredo: vai para o git). O `mcp-elm` procura o `pa` em `.sabia/config/elm`, depois em `.kiro/config/elm` e em
`.kiro/config/sdd`.

## Saída

O `pa` gravado → passo `validar`.

## Pare se

- Sem o "sim" → nada é gravado; volte ao bloco que a pessoa quer mudar.
