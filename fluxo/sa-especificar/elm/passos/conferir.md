---
{"resumo": "Antes de aprovar e em toda retomada, compara o DOORS atual com a versão lida do commit de base; mudou, o especificador escolhe mesclar ou seguir."}
---
## Entrada

Os arquivos altera e exclui de `elm/`, menos os que têm `**Publicado:** manual`. Na fatia `concluida` com
`Publicação: pendente`, só o artefato que a publicação pulou.

## Faça

1. **Comparar.** Peça à `sa-elm.baixar` a versão atual de cada um, sem gravar, e compare o `modificado_em` com a versão
   lida do Cobre da ficha.
2. **Mudou.** Mostre o que mudou no DOORS e pergunte "mesclar ou seguir?".
   - **Mesclar:** novo commit de base com o original atual e a nova Versão lida (passo `gravar`, commit
     `FT-nnn elm: original <ids>`), e a edição reaplicada por cima (passo `gravar`, commit `FT-nnn elm: edita <ids>`).
     O arquivo volta a `status: draft` e perde o `verified`.
   - **Seguir:** nada muda; a `sa-elm.publicar` vai avisar e pular esse artefato.
3. **Igual.** Siga.

## Saída

Tudo conferido → passo `aprovar`. Na fatia `concluida`, mesclado e aprovado, o passo `devolver` oferece a
`sa-elm.publicar`.

## Pare se

- A `sa-elm.baixar` não respondeu → avise que a conferência ficou para a próxima sessão e siga.
