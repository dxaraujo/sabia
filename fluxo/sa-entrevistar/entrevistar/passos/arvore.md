---
{"resumo": "Monta a árvore de decisões, sem perguntar nada ainda, e responde sozinho o que tem fonte (código, ELM, glossário, banco)."}
---
## Entrada

O que está sendo alinhado e onde registrar (entrada do fluxo).

## Faça

Montar a árvore de decisões (sem perguntar nada ainda):

1. Leia o que já existe: a demanda, o `decisoes.md` (se houver), o glossário, os ADRs que tratam do assunto, o
   steering de produto e o PRD/fatia em questão.
2. Liste as decisões necessárias como uma **árvore**: escopo → atores → comportamento principal → exceções →
   dados → integrações → não funcionais (volume, prazo, segurança, auditoria) → fora de escopo. Uma decisão pode
   depender de outra: ordene para que a resposta de cima mude as de baixo.
3. **Responda sozinho o que tiver fonte**, citando-a — não pergunte o que dá para descobrir:
   - comportamento atual → o código (`arquivo:linha`);
   - regra documentada → bundle do ELM, pelo `elm_buscar_req_local` e `elm_ler_req_local` (nunca lendo os
     arquivos; [sem bundle → ELM remoto](~/.sabia/framework/skills/sabia/references/elm.md#bundle-local));
   - termo do domínio → glossário;
   - dado → banco pelo MCP de consulta (somente leitura), se o `sabia.md` declarar um.
   Fato encontrado vira decisão `confirmada — fonte: <…>`; não ocupa a pessoa.

## Saída

A árvore ordenada, com as decisões confirmadas por fonte → passo `rodadas`.

## Pare se

Nenhum caso próprio deste passo.
