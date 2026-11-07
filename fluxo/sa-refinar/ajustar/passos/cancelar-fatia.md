---
{"resumo": "Cancela a fatia ou o bug, tira a pasta da spec da base e fecha o épico quando era a última fatia aberta."}
---
## Entrada

A fatia ou o bug e o motivo aprovados no passo `previa`.

## Faça

1. Status `cancelada`, `obs` `motivo: <texto>`.
2. A pasta da spec da fatia (com `elm/`), se existe na base, sai no mesmo commit (`git rm`), para não valer como
   vigente nem prender artefato.
3. Era a última fatia aberta do épico (aberta = não `concluida` nem `cancelada`)?
   - Com alguma `concluida`: o épico fica `concluido`, com `concluida_em` = hoje.
   - Sem nenhuma `concluida`: o épico fica `cancelado`, `obs` `motivo: fatias canceladas`.

## Saída

O cancelamento → passo `gravar`.

## Pare se

Nenhuma condição própria: a entrada já recusou a fatia `em-andamento`.
