---
{"resumo": "Confere a reserva: a folga consumida (as linhas de atendimento do sprint aberto) contra a folga do acordos.md; dentro dela ou com prioridade crítica, segue; estourada, quem tem produto decide."}
---
## Entrada

O item de Sustentação `nova` ou `em-andamento` (passos `entrada` ou `registrar`).

## Faça

1. Item já `em-andamento`: pule este passo.
2. Sem sprint aberto: não há reserva a conferir; siga.
3. Folga consumida = a contagem das linhas `atendimento` do `sprint-<nn>.md` aberto, contra o `**Folga:**` dele
   (o % do `acordos.md`). Dentro da reserva, ou com prioridade `crítica` (expedite), siga.
4. Reserva estourada → mostre o estouro. Decide quem tem `produto` no `equipe.json`: puxar assim mesmo ou esperar. A
   decisão vai na `obs`: `reserva estourada: <decisão> (<usuario>, AAAA-MM-DD)`, gravada com o passo `assumir` (ou
   logo, pelo commit direto na branch base, se a decisão é esperar).

## Saída

Dentro da reserva, expedite ou puxar assim mesmo → passo `assumir`.

## Pare se

- Reserva estourada sem quem tem `produto` na sessão → diga quem tem `produto` e pare, com o item ainda `nova`.
- A decisão é esperar → grave a `obs` e pare.
