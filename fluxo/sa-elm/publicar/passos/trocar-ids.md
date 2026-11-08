---
{"resumo": "Renomeia o arquivo do requisito novo e troca o id provisório pelo do ELM em todo lugar, num commit."}
---
## Entrada

Os ids novos do passo `publicar`.

## Faça

Para cada requisito novo:

1. Renomeie `elm/<EP|FT><nn>-<nn>-<TIPO>-<slug>.md` para `elm/<id do ELM>-<TIPO>-<slug>.md`; o frontmatter fica.
2. Troque o id provisório `<sigla>-<EP|FT>-nn` por `<sigla>-<id do ELM>` no `prd.md` do épico pai, nas fichas que
   o citam (Cobre e Regras), no delta da spec (`### Requirement:`), no `design.md` (a ET) e nos arquivos de `elm/`
   que o citam, agora com o link para o arquivo (`[<sigla>-<id> <título>](<id>-<TIPO>-<slug>.md)`).

Tudo vai no mesmo commit do passo `gravar`.

## Saída

Segue para o passo `ligar`.

## Pare se

- Nunca.
