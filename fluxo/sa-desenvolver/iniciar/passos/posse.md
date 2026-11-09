---
{"resumo": "Posse na branch base: em-andamento, responsável, iniciada_em, tamanho corrigido e a linha da sprint, num commit pequeno."}
---
## Entrada

As escolhas do passo `assumir` e o `usuario` da sessão no `equipe.json`.

## Faça

1. Pelo passo `gravar`, com a mensagem `<FT> iniciar`, escreva:
   - no `backlog.md`: status `em-andamento`, responsável = `usuario`, `iniciada_em` = hoje (AAAA-MM-DD; na volta da virada, a que já está fica) e o tamanho,
     se foi corrigido;
   - no `sprint-<nn>.md` aberto: Responsável na linha Item · `desenvolvimento`; no expedite, acrescente essa linha.
2. Depois do pull do passo `gravar`, a linha já está `em-andamento` com outro responsável, ou o push foi recusado
   porque outra pessoa gravou antes → mostre quem pegou e pare.
3. Item já `em-andamento` com o próprio usuário como responsável (retomada) → não regrave; siga.

## Saída

Posse gravada na branch base → passo `branch`.

## Pare se

- Outra pessoa pegou o item.
- A gravação na branch base parou (fora da branch base sem o "sim", árvore suja, pull ou push recusado duas vezes).
