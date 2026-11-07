---
{"resumo": "Devolve o resumo (decisões, suposições e em aberto com o que bloqueia) a quem chamou, sem oferta; na chamada direta, mostra e termina."}
---
## Entrada

O que os passos `registrar` e `linguagem` gravaram.

## Faça

Monte o resumo:

```
Entrevista — <id> · <n> decisões · <s> suposições · <a> em aberto
Em aberto: <pergunta> · para <quem> · bloqueia <ids | nada>
Termos: <novos> · <alterados>
```

## Saída

Chamada por outra skill → devolva o resumo sem oferta, e quem chamou segue. Chamada direta → mostre o resumo e
termine.

## Pare se

Nenhum caso próprio deste passo.
