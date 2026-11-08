---
{"resumo": "Altera e exclui: grava em elm/ o original do DOORS pela sa-elm.baixar, com a versão lida; inclui: cria o arquivo novo com o id provisório."}
---
## Entrada

As linhas livres do Cobre (passo `trava`) que ainda não têm arquivo em `elm/`, e o padrão `sa-elm/elm-arquivo.md`.

## Faça

1. **Altera e exclui.** Peça à `sa-elm.baixar` (modo artefato) o texto inteiro, o título e o `modificado_em` pelo id.
   Grave `elm/<id do ELM>-<TIPO>-<slug>.md` pelo padrão `sa-elm/elm-arquivo.md`: o frontmatter (`type`, `title`
   do DOORS, `status: draft`, `sources` com o próprio requisito) e o corpo como veio. A versão lida vai também à linha do Cobre da ficha.
2. **Inclui.** Crie `elm/EP<nn>-<nn>-<TIPO>-<slug>.md` (fatia de épico, com o mesmo id do `prd.md`) ou
   `elm/FT<nnn>-<nn>-<TIPO>-<slug>.md` (ex.: `EP03-01-REG-limite-saque.md`), com o id provisório `<sigla>-EP<nn>-<nn>`
   ou `<sigla>-FT<nnn>-<nn>` (ex.: `REG-EP03-01`) no nome, o frontmatter com `status: draft` e o corpo vazio, pelo
   padrão do tipo. Na fatia de épico, o corpo vem do bloco do `prd.md`, com os títulos de volta ao nível do padrão
   (dois níveis acima).
3. **Sem o ELM.** A `sa-elm.baixar` não respondeu → diga quais ids faltam, deixe-os de fora e siga com os outros.

## Saída

Os originais gravados, ainda sem commit → passo `base`.

## Pare se

Nenhum caso próprio deste passo: o artefato que não veio do DOORS fica de fora.
