---
{"resumo": "Mantém a seção Regras aprendidas curta (o que virou checagem, rubrica, ADR ou skill sai) e guarda as lições reais como casos de avaliação."}
---
## Entrada

A seção Regras aprendidas atualizada (passo `gravar`).

## Faça

Mantenha a seção curta: regras que viraram checagem determinística, rubrica, ADR ou skill saem dele com
`→ movida para <destino>` no `licoes.md`. Lições reais também viram **casos de avaliação** do fluxo: guarde o
pedido e o resultado esperado em `<produto>/aprendizado/avaliacoes/` para conferir, quando o modelo ou o fluxo mudar,
que o erro não voltou.

## Saída

A seção enxuta e os casos de avaliação guardados: o fluxo termina.

## Pare se

Sem condição de parada própria.
