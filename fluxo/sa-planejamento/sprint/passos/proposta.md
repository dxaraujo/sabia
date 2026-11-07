---
{"resumo": "Mostra a proposta (chave, datas, meta, tabela, folga e capacidade) e espera o ok de quem tem produto."}
---
## Entrada

Virada, capacidade, linhas, responsáveis e meta.

## Faça

Mostre na tela:

```
<AAAA>/Sprint <nn> · <início> → <fim> · <meta>
| Item | Título | Tipo | Tam. | Trabalho | Responsável |     (migrados primeiro)
Folga: <n> itens (<p>%)
Capacidade: vazão prevista <n> · migrados <n> · sobra <n>
```

`<AAAA>` é o ano de início; `<nn>` é a próxima sprint do ano, com 2 dígitos (ano novo → 01). O início é o dia
seguinte ao fim da anterior; sem anterior, pergunte a data. O fim = início + Timebox − 1 dia. No reabastecimento,
mostre só as linhas novas, com a chave e a meta da sprint aberta.

Peça o "ok" a quem tem `produto`. Sem a booleana: diga quem aprova (nomes do `equipe.json`) e não grave.

## Saída

"ok" → passo `gravar`. Ajuste → esta proposta de novo. Sem o "ok", ou sem a booleana → o fluxo termina sem gravar.

## Pare se

Sem o "ok" → nada é gravado.
