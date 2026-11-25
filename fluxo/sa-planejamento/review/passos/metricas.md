---
{"resumo": "Grava na sprint a seção Métricas: conclusão, vazão contra a prevista, lead time, SLE, reserva de capacidade e as entregas, calculadas pelo sabia metricas."}
---
## Entrada

A sprint e o `backlog.md` da branch base.

## Faça

1. Rode `sabia metricas --md` na raiz do projeto (`--sprint "<AAAA>/Sprint <nn>"` se a review é de uma sprint já
   fechada): ele imprime a seção `## Métricas` pronta, calculada das linhas da sprint e do backlog. Sem o comando,
   monte as mesmas linhas pelo template `sa-planejamento/sprint.md`, com as definições da `sa-status.painel`.
2. Se a sprint já passou do fim, pergunte a quem tem `produto`: "a meta foi atingida?". A resposta entra na primeira
   linha: `- Medida em: AAAA-MM-DD · meta atingida` ou `· meta não atingida — <por quê>`. Sem a resposta, a linha fica
   só com a data, e a retrospectiva pergunta de novo.
3. Mostre a seção. Ela troca o corpo da `## Métricas` do `sprint-<nn>.md` (a seção que falta entra no fim do arquivo).
   É o retrato do dia da medida: a retrospectiva a atualiza se a sprint andou depois.

## Saída

A seção `## Métricas` → passo `gravar`.

## Pare se

Sem condição própria.
