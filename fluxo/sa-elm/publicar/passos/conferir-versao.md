---
{"resumo": "Para cada altera e exclui, compara o modificado_em do DOORS com a versão de referência; mudou → avisa e pula."}
---
## Entrada

A lista de artefatos.

## Faça

Para cada `altera` e cada `exclui`, `elm_ler_req(<id>)` e compare o `modificado_em` atual com a versão de referência do
Artefatos afetados. Diferente → avise (`⚠️ <sigla>-<id> mudou no DOORS depois da leitura`) e tire aquele artefato do lote. O
resto segue.

## Saída

O lote conferido → passo `publicar`.

## Pare se

- Nunca.
