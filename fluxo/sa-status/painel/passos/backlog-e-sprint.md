---
{"resumo": "Lê da branch base remota o backlog.md e a sprint aberta."}
---
## Entrada

O repositório do projeto.

## Faça

Rode `git fetch --quiet` e leia de `origin/<branch_base>` (a chave `branch_base` do `agentes.json`):
- `.sabia/planejamento/backlog.md`: id · título · tipo · status · prioridade · tamanho · responsável · pai · relator ·
  ib · obs · entrou_em · concluida_em. A ordem das linhas é a prioridade.
- a sprint aberta: o `.sabia/planejamento/sprints/<AAAA>/sprint-<nn>.md` de maior chave (datas, meta, reserva de capacidade e as
  linhas Item · Trabalho · Responsável · Tarefas · iniciada_em · concluida_em).

## Saída

Backlog e sprint → passo `branches-e-status`.

## Pare se

Sem `backlog.md` na branch base → "rode a `sa-setup.configurar`" e pare.
