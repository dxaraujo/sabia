---
{"resumo": "Roda o gerador, que leva o delta ao prompt do agente que roda a skill do passo."}
---
## Entrada

O override editado, ou o arquivo a apagar (descustomizar).

## Faça

1. Descustomizar → apague o arquivo (ou a operação no `<fluxo>.md` do projeto, que é apagado se ficar vazio).
2. Rode o gerador sem `--gravar`: ele valida o override e põe o delta no prompt do agente que roda a skill do passo.
   Recusa → mostre o arquivo e o motivo.
3. Com o "ok", o mesmo comando com `--gravar`.

## Saída

Gravado → passo `o-que-mudou`. O gerador recusou → passo `copiar`.

## Pare se

- Gravar os agentes com o override recusado.
