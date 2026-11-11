---
{"resumo": "Com ct_no_teste: true: CT-nn do CT.csv que não aparece nos testes alterados pela branch."}
---
## Entrada

O `acordos.json`. Só com `ct_no_teste: true`.

## Faça

Linha do `CT.csv` da fatia aberta cujo `CT-nn` não aparece (`git grep`) nos testes alterados pela branch
(`git diff --name-only origin/<branch_base>...origin/<id>`) → `sa-desenvolver.codificar`.

## Saída

→ o próximo passo da lista.

## Pare se

Sem condição própria: nenhuma pendência trava.
