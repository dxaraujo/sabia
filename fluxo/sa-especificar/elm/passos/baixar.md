---
{"resumo": "Altera e exclui: grava em elm/ o original do DOORS pela sa-elm.baixar, com a versão de referência; inclui: cria o arquivo novo com o id provisório."}
---
## Entrada

As linhas livres dos artefatos afetados (passo `trava`) que ainda não têm arquivo em `elm/`, e o template `sa-elm/elm-arquivo.md`.

## Faça

1. **Altera e exclui.** Peça à `sa-elm.baixar` (modo artefato) o texto inteiro, o título e o `modificado_em` pelo id.
   Grave `elm/<id do ELM>-<TIPO>-<slug>.md` pelo template `sa-elm/elm-arquivo.md`: o frontmatter (`type`, `title`
   do DOORS, `status: draft`, `sources` com o próprio requisito) e o corpo como veio. A versão de referência vai também à linha dos artefatos afetados da ficha.
2. **Inclui.** Crie `elm/EP<nn>-<nn>-<TIPO>-<slug>.md` (fatia de épico, com o mesmo id do `prd.md`) ou
   `elm/FT<nnn>-<nn>-<TIPO>-<slug>.md` (ex.: `EP03-01-REG-limite-saque.md`), com o id provisório `<sigla>-EP<nn>-<nn>`
   ou `<sigla>-FT<nnn>-<nn>` (ex.: `REG-EP03-01`) no nome, o frontmatter com `status: draft` e o corpo vazio, pelo template do tipo. Na fatia de épico, o corpo vem do bloco do `prd.md`, igual, e os `sources`, da linha Fonte do bloco.
3. **Sem o ELM.** A `sa-elm.baixar` não respondeu → mostre, na sessão, `⚠️ <id>: o ELM não respondeu; o original viria do
   bundle de <data do generated.at do sync.md>, não do DOORS` e pergunte "usar o bundle como original provisório ou deixar de
   fora?". Provisório → grave o corpo do bundle (pelas tools `elm_*_local`) e acrescente ao Em aberto da ficha `<id>: original
   provisório do bundle de <data>; conferir no DOORS | <especificador> | <sigla>-<id>`. De fora → siga com os outros.

## Saída

Os originais gravados, ainda sem commit → passo `referencia`.

## Pare se

Nenhum caso próprio deste passo: o artefato sem o original do DOORS nem o provisório aceito fica de fora.
