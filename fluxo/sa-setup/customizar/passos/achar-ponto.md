---
{"resumo": "Casa o pedido com os fluxos compilados pelo id skill.fluxo.passo ou com o template."}
---
## Entrada

O pedido.

## Faça

Case o pedido com o "quando" dos fluxos (tabela Fluxos do `SKILL.md` compilado de cada `sa-*`; skill de um fluxo
só: a `description`) e com o resumo dos passos (a primeira linha, em itálico, de cada passo compilado). O resultado é
o id `<skill>.<fluxo>.<passo>` (ex.: `sa-desenvolver.codificar.tarefa`) ou o template `<skill>/<nome>.md`. Mostre a
tabela do fluxo (`npx sabia rota --fluxo <skill>.<fluxo>` na raiz a dá resolvida no projeto) com o ponto marcado e
confirme; mais de um candidato → numerados, o melhor com ⭐.

## Saída

O ponto confirmado → passo `forma`. Descustomizar → passo `regenerar`, com o arquivo a apagar.

## Pare se

- Nunca escolha o ponto sem a confirmação.
