---
{"resumo": "Pergunta o desdobramento (arquivar, alteração, regra, lição), grava a Saída no registro e faz o commit único; só instrui e para."}
---
## Entrada

O AT `concluido` no passo `finalizar`, sem commit ainda.

## Faça

Pergunte o que mais sai do atendimento e registre a resposta em **Saída** no registro:

```
✅ AT-<nnn> concluído. Algum desdobramento?
  1. arquivar — nada mais a fazer
  2. gerar alteração (defeito ou mudança) → use `sa-triar` com origem AT-<nnn>
  3. regra que ninguém decidiu → use `sa-entrevistar`
  4. consulta reaproveitável → lição pela `sa-aprender`
```

Grave a resposta em **Saída** e faça agora o commit único do passo `finalizar` (registro, backlog e sprint).

## Saída

O commit único do atendimento e a instrução do desdobramento escolhido. Aqui o fluxo termina.

## Pare se

Só instrui e para: **nunca invoque nem simule outra skill**.
