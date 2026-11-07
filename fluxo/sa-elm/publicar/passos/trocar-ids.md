---
{"resumo": "Renomeia o arquivo do requisito novo e troca o id provisório pelo do ELM em todo lugar, num commit."}
---
## Entrada

Os ids novos do passo `publicar`.

## Faça

Para cada requisito novo:

1. Renomeie `elm/<EP|FT><nn>-<nn>-<TIPO>-<slug>.md` para `elm/<id do ELM>-<TIPO>-<slug>.md`, com o mesmo título
   (`# <sigla>-<id do ELM> · <título>`).
2. Troque o id provisório `<sigla>-<EP|FT>-nn` por `<sigla>-<id do ELM>` no `prd.md` do épico pai, nas fichas que
   o citam (Cobre e Regras) e no delta da spec (`### Requirement:`).

Tudo vai no mesmo commit do passo `gravar`.

## Saída

Segue para o passo `ligar`.

## Pare se

- Nunca.
