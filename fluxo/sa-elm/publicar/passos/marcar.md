---
{"resumo": "Grava Publicação: publicada, ou mantém pendente e lista o que falta."}
---
## Entrada

O resultado dos passos `publicar` e `ata`.

## Faça

Tudo publicado (contando os arquivos com `publicado: manual`) → `Publicação: publicada <AAAA-MM-DD>` no
`status.md` da fatia. Algum artefato pulado ou exclusão não feita → mantenha `Publicação: pendente` e liste o que
falta. O artefato pulado volta ao especificador: a `sa-elm.conferir` mostra a diferença, ele mescla na
`sa-especificar.elm` e roda a `sa-elm.publicar` de novo. Mensagem do commit: `elm: publicar FT-<nnn>`.

## Saída

Segue para o passo `gravar`.

## Pare se

- Nunca.
