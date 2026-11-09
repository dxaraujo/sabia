---
{"resumo": "Pergunta 'algum desdobramento?': cada um vira captura com 'origem <ID>'; a lição vai em Lições do registro; um commit '<ID> concluir' leva o registro, o backlog e as capturas."}
---
## Entrada

O item `concluida` ou `cancelada`, sem commit ainda (passo `finalizar`).

## Faça

1. Pergunte "algum desdobramento?".
   - Nada → siga para o commit.
   - Defeito, mudança ou outro item de Sustentação → captura comum (passo `captura`) com `origem <ID>` na `obs`.
2. Lição, se houver, numa linha da seção Lições do registro: lição · regra proposta. A resposta que se repete também
   vira lição. As lições vão para a curadoria na `sa-planejamento.review` (agente `sa-especificador`).
3. O commit `<ID> concluir` pelo commit direto na branch base (passo `commit-na-branch-base`) leva o registro, o `backlog.md` e as
   capturas.
4. Ofereça "seguir para a próxima?".

## Saída

Desdobramento → passo `captura`, um por item; depois, o commit no passo `commit-na-branch-base`. Nada → passo
`commit-na-branch-base`. Depois do commit, o fluxo termina.

## Pare se

—
