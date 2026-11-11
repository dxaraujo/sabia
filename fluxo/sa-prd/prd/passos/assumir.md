---
{"resumo": "Grava a pessoa como responsável do épico, oferece a linha (EP-nn · especificação) no sprint aberto e a tarefa ESP no ELM."}
---
## Entrada

A linha do épico no `backlog.md` (`em-especificacao`), o `usuario` da pessoa no `equipe.json` e o `sprint-<nn>.md`
aberto, se houver.

## Faça

1. **Responsável.** Linha de outra pessoa → mostre de quem é e só assuma com o "sim". Grave o `usuario` na coluna
   responsável.
2. **Sprint.** Abra a tarefa de especificação pela regra do template `sa-planejamento/sprint.md`: na linha
   `EP-nn · especificação` do `sprint-<nn>.md` aberto, Responsável = a pessoa e `iniciada_em` = hoje, só se está vazia.
   A linha nasce se falta (Tarefas vazio); sem sprint aberta, siga.
3. **ELM.** Com ELM, "quer criar o item no ELM?"; sim → `sa-elm.item` com a tarefa `ESP`. A resposta não muda o
   fluxo.
4. **Gravar.** Tudo pelo commit direto na branch base (passo `gravar`, commit `backlog: especificação EP-nn`), e volte aqui.

## Saída

Responsável gravado → passo `abrir`.

## Pare se

- Linha de outra pessoa sem o "sim" → pare.
