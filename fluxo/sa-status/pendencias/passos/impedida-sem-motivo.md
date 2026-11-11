---
{"resumo": "Status impedida ou cancelada sem a coluna motivo, ou motivo preenchido com outro status."}
---
## Entrada

O `backlog.md`.

## Faça

- Item `impedida` ou `impedido` sem `motivo`, ou sem o `desde` ou o `de <status>` nele → quem impediu completa
  (`sa-status.situacao`).
- Coluna `motivo` preenchida num item que não está impedido nem cancelado → quem tem `produto` limpa
  (`sa-status.situacao`, liberar).

## Saída

→ o próximo passo da lista.

## Pare se

Sem condição própria: nenhuma pendência trava.
