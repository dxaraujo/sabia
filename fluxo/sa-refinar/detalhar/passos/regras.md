---
{"resumo": "Levanta as regras e os exemplos pela sa-entrevistar: rodada curta no bug e no P, Example Mapping no M e no G; cada regra vale pela decisão de uma pessoa."}
---
## Entrada

A linha e a ficha da fatia ou do bug (Entrada, e Objetivo e Cobre na fatia de épico); na fatia de épico, o
`prd.md` do pai.

## Faça

1. Use a `sa-entrevistar.entrevistar`: até 5 perguntas por rodada, cada uma com a recomendação; os fatos do código
   ela busca pela `sa-pesquisar`.
2. Bug ou P: uma rodada curta (a regra e os exemplos). M ou G: Example Mapping (regras, exemplos e perguntas).
3. Cada regra vira uma linha `R<n> · <texto> · fonte: <D-nn | <sigla>-<id>>`. A decisão de uma pessoa vai para a
   tabela Decisões da ficha (`D-nn | Decisão | Quem | Quando | Fonte`); sem fonte e sem decisão, a pergunta fica
   para o passo `duvidas`.
4. O que não pode mudar vai para Não muda.

## Saída

Regras, exemplos aceitos, Não muda, Decisões e as perguntas sem resposta → passo `cenarios`.

## Pare se

Nenhuma condição própria: pergunta sem resposta segue para o passo `duvidas`.
