---
{"resumo": "Modo artefato: confere a trava artefato-exclusivo e lê o artefato pelo id, sem gravar."}
---
## Entrada

A fatia e o id do requisito (`<sigla>-<id>`).

## Faça

1. Trava `artefato-exclusivo`: outra fatia aberta tem o mesmo artefato no `elm/` dela (nem cancelada nem com
   `Publicação: publicada`) → diga qual e devolva sem baixar (a `sa-status` mostra a trava).
2. Livre → `elm_ler_req(<id>)`: o texto inteiro, o título e o `modificado_em`.

## Saída

Segue para o passo `saida`.

## Pare se

- Nunca grave o arquivo em `elm/` aqui: quem grava e faz o commit de base é a `sa-especificar.elm`.
