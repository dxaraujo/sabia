---
{"resumo": "O que sai do plano: desvio leve se registra, fora do escopo vira captura, regra sem decisão e texto novo viram Em aberto, arquitetural para e pergunta."}
---
## Entrada

A divergência achada na tarefa: esperado (o plano) × encontrado (o código, `arquivo:linha`) e por que importa.

## Faça

| Caso | Faça | Para? |
|---|---|---|
| desvio leve (decisão técnica equivalente) | corrija, registre em Desvios do `status.md` e em Decisões técnicas do `design.md` | não |
| melhoria ou trabalho fora do escopo | passo `captura`, linha nova com `obs` `origem FT-nnn` (no autopilot, vai ao Em aberto) | não |
| regra sem decisão | Em aberto ao P.O. com `Bloqueia: tarefa N.M`; ofereça a `sa-entrevistar.entrevistar` (agente `sa-especificador`) | só essa tarefa |
| texto do requisito aprovado precisa mudar | Em aberto ao especificador; a tarefa espera o texto novo, que a `sa-plano.replanejar` copia | só essa tarefa |
| mudança arquitetural ou irreversível | pare e pergunte; decidido, `sa-plano.replanejar` | sim |

No autopilot, o caso arquitetural ou irreversível devolve à pessoa: grave o Retomar, commit e push da branch e
o resumo.

## Saída

Tratado → a próxima tarefa livre; o caso arquitetural → a saída do mestre.

## Pare se

- Mudança arquitetural ou irreversível sem a decisão da pessoa.
