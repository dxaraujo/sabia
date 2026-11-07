---
{"resumo": "Monta a árvore só do trecho tocado, responde sozinho o que tem fonte pela sa-pesquisar.pesquisar e separa a regra de negócio da lacuna de rotina."}
---
## Entrada

O item e o documento (Decisões, Em aberto) e a ATA do item, se existir.

## Faça

1. **Ler.** As Decisões e o Em aberto já gravados e a ATA. Para "responder o em aberto", a árvore são as linhas do Em
   aberto.
2. **Árvore.** Só do trecho tocado: escopo → atores → comportamento → exceções → dados → integrações → não funcionais
   → fora de escopo. Ordene para que a resposta de cima mude as de baixo.
3. **Pistas.** Com a pessoa presente, pergunte antes da busca o que ela já sabe (telas, regras, ids, sistemas).
4. **Fatos.** O que tem fonte, responda sozinho com a `sa-pesquisar.pesquisar` (subagente `sa-pesquisador`): o
   vigente (specs arquivadas → bundle → ELM ao vivo), o código, os ADRs e o GL ou o glossário. Fato encontrado vira
   Decisão com a fonte e não ocupa a pessoa.
5. **Separar.** Regra de negócio sem fonte → vai à pessoa. Lacuna de rotina → suposição, com a recomendação.

## Saída

A árvore ordenada, com o que tem fonte respondido → passo `rodadas`.

## Pare se

Nenhum caso próprio deste passo.
