---
{"resumo": "Compacta os fatos no research.md (padrão sa-pesquisar/research.md), curto e só com evidência; o agente pesquisador devolve, não grava."}
---
## Entrada

Os fatos do passo `investigar`.

## Faça

Escreva o `research.md` pelo padrão `sa-pesquisar/research.md`.

- Só fatos com evidência; nada de solução ou recomendação (isso é do plano).
- Curto: o objetivo é caber inteiro no contexto de quem planeja. Mais de ~150 linhas → corte o que o plano não usa.
- `status.md`: fase `planejando`, linha no Histórico — **só** quando você não é o agente `sa-pesquisador`
  (sessão da pessoa). O agente pesquisador nunca grava o `status.md`: quem o chamou registra (`sa-plano`,
  `sa-orquestrar`).
- Fora de uma fatia → nada gravado: os fatos vão na resposta, e quem chamou os guarda (Entrada do fluxo).

## Saída

O `research.md`: gravado na pasta da fatia (sessão da pessoa) ou inteiro na resposta (agente `sa-pesquisador`); fora
de uma fatia, os fatos na resposta.
Aqui o fluxo termina.

## Pare se

Nenhum caso próprio deste passo.
