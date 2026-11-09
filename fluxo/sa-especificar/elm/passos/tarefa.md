---
{"resumo": "Oferece a linha (item · especificação) no sprint aberto e a tarefa ESP no ELM; segue com qualquer resposta."}
---
## Entrada

A fatia ou o bug, o `sprint-<nn>.md` aberto (se houver) e a chave `elm` do `agentes.json`.

## Faça

Resposta já dada no bloco da especificação (`sa-refinar.detalhar.elm`) → execute, sem perguntar de novo.

1. **Sprint.** Sem a linha `<id> · especificação` no `sprint-<nn>.md` aberto, pergunte "acrescento a linha de
   especificação na sprint?". Sim: Item `<id>`, Trabalho `especificação`, Responsável = o `usuario` da pessoa,
   Tarefas vazio; grave pelo commit direto na branch base (passo `gravar`, commit `backlog: especificação <id>`) e volte
   aqui. Sem sprint aberta ou sem o "sim": siga.
2. **ELM.** Pergunte "quer criar o item no ELM?". Sim → `sa-elm.item` com a tarefa `ESP`. A resposta não muda o
   fluxo. O ELM fora do ar não dispensa a pergunta: com o sim, avise que ficou pendente e siga.

## Saída

A linha e a tarefa oferecidas → passo `pasta`.

## Pare se

Nenhum caso próprio deste passo: a sprint e o ELM nunca param o fluxo.
