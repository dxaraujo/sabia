---
{"resumo": "Mostra os arquivos aprovados, pendentes e travados, avisa quem desenvolve quando o texto mudou e oferece finalizar a tarefa ESP; devolve a quem chamou."}
---
## Entrada

A situação de cada arquivo de `elm/`, o `backlog.md` e o `sprint-<nn>.md` aberto.

## Faça

1. **Resumo.** Aprovados · pendentes de aprovação · travados por outra fatia (com a dona) · pendentes de mescla.
2. **Em andamento.** Fatia `em-andamento` com texto aprovado de novo → avise o responsável (coluna responsável do
   `backlog.md`) que a `sa-plano.replanejar` recopia o texto para o delta.
3. **Concluida.** Fatia `concluida` com `Publicação: pendente` e a mescla aprovada → ofereça a `sa-elm.publicar`.
4. **Tarefa.** Com tarefa `ESP` na linha do `sprint-<nn>.md` e tudo aprovado → "finalizar a tarefa no ELM?"; sim →
   `sa-elm.finalizar`. A resposta não muda o fluxo.

## Saída

Devolva a quem chamou (a `sa-refinar.detalhar` segue com o DoR). No pedido direto, termine com o resumo.

## Pare se

Nenhum caso próprio deste passo.
