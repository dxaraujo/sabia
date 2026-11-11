---
{"resumo": "Cancela a fatia ou o bug, tira a pasta da spec da branch base e fecha o épico quando era a última fatia aberta."}
---
## Entrada

A fatia ou o bug e o motivo aprovados no passo `previa`.

## Faça

1. Status `cancelada`, coluna `motivo` `<texto> · desde <hoje>`.
2. A pasta da spec da fatia (com `elm/`), se existe na branch base, sai no mesmo commit (`git rm`), para não valer como
   vigente nem prender artefato.
3. Era a última fatia aberta do épico (aberta = não `concluida` nem `cancelada`)?
   - Com alguma `concluida`: o épico fica `concluido`, com `concluida_em` = hoje.
   - Sem nenhuma `concluida`: o épico fica `cancelado`, `motivo` `fatias canceladas · desde <hoje>`.

## Saída

O cancelamento → passo `gravar`.

## Pare se

Nenhuma condição própria: a entrada já recusou a fatia `em-andamento` (o cancelamento dela é da `sa-status.situacao`).
