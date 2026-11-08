---
{"resumo": "Mostra a tabela e ajusta até o ok e a ordem de quem tem produto; conceito do PRD que muda vai à sa-prd.mudanca."}
---
## Entrada

A tabela do passo `rascunho`.

## Faça

Mostre a tabela e ajuste (dividir, juntar, mudar os artefatos afetados ou o tamanho) até o ok de quem tem `produto`, que também
ordena as fatias. O ok não congela nada: a fatia segue editável pela `sa-refinar.ajustar` até alguém puxar.

## Saída

Ajuste pedido → este passo de novo. Conceito do PRD que muda → passa à `sa-prd.mudanca`; o fatiamento volta depois da
nova aprovação. Sem quem tem `produto` na sessão → mostre os nomes com a booleana e termine sem gravar (o rascunho se
refaz na próxima vez). Ok e ordem → passo `gravar`.

## Pare se

- `prd.md` sem a linha Aprovado (em mudança) → diga "o PRD está em mudança: `sa-prd.mudanca`" e pare sem gravar.
