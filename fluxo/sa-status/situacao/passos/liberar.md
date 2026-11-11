---
{"resumo": "O item impedido volta ao status anterior; o motivo sai da coluna e o período fica na obs."}
---
## Entrada

O item `impedida` ou `impedido` e a coluna `motivo`.

## Faça

1. Mostre o `motivo` e pergunte "o que impedia foi resolvido?".
2. Prévia da linha do `backlog.md`:
   - status = o `de <status>` do `motivo` (sem o `de`, pergunte qual);
   - `motivo` vazia;
   - `obs` ganha `impedida <desde> a <hoje>: <motivo>`, separado por ` · ` do que já havia.
3. Peça o "sim". Depois de gravar, diga a `skill.fluxo` dona do status que voltou (`sa-status.item`).

## Saída

Com o "sim" → passo `gravar`, com a mensagem `<ID> liberar`.

## Pare se

Sem o "sim" → nada é gravado; o fluxo termina.
