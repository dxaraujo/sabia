---
{"resumo": "Confere a reserva de capacidade consumida (as linhas de atendimento do sprint aberto) contra a reserva de capacidade do acordos.json; dentro dela ou com prioridade crítica, segue; estourada, quem tem produto decide."}
---
## Entrada

O item de Sustentação `nova` ou `em-andamento` (passos `entrada` ou `registrar`).

## Faça

1. Item já `em-andamento`: pule este passo.
2. Sem sprint aberto: não há reserva de capacidade a conferir; siga.
3. Reserva de capacidade consumida = a contagem das linhas `atendimento` do `sprint-<nn>.md` aberto, contra o `**Reserva de capacidade:**` dele
   (o `reserva_capacidade_pct` do `acordos.json`). Dentro da reserva de capacidade, ou com prioridade `crítica` (urgente), siga.
4. Reserva de capacidade estourada → mostre o estouro. Decide quem tem `produto` no `equipe.json`: puxar assim mesmo ou esperar. A
   decisão vai na `obs`: `reserva de capacidade estourada: <decisão> (<usuario>, AAAA-MM-DD)`, gravada com o passo `assumir` (ou
   logo, pelo commit direto na branch base, se a decisão é esperar).

## Saída

Dentro da reserva de capacidade, urgente ou puxar assim mesmo → passo `assumir`.

## Pare se

- Reserva de capacidade estourada sem quem tem `produto` na sessão → diga quem tem `produto` e pare, com o item ainda `nova`.
- A decisão é esperar → grave a `obs` e pare.
