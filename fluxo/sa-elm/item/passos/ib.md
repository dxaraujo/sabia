---
{"resumo": "Cria o IB '[<id>] <título>' se a coluna ib está vazia; senão usa o existente."}
---
## Entrada

O id do Sabiá e a linha dele no `backlog.md` da base.

## Faça

Coluna `ib` vazia → crie o IB `[<id>] <título>` com o título do `backlog.md` (`elm_criar_wi`, tipo do IB no
`pa`, iteração `backlog` fora de sprint), com prévia. Guarde o número para o passo `gravar-ids`. Já tem `ib` →
use esse. O item tem pai `EP-nn` com IB → o IB nasce filho dele.

## Saída

O número do IB → passo `linha-no-sprint`.

## Pare se

- Sem o "sim" → passo `devolver`, sem nada criado.
