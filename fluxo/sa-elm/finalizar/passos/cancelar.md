---
{"resumo": "Cancela no EWM o que o Sabiá cancelou, virou épico ou saiu da sprint."}
---
## Entrada

O id do item e o caso.

## Faça

1. **Cancelado** (status `cancelada` no `backlog.md`: `sa-triar.triar`, kill na `sa-refinar.moldar`,
   `sa-refinar.ajustar`) → ofereça cancelar o IB e as tarefas abertas.
2. **Virou épico** (obs `cancelada · virou EP-nn`, na `sa-desenvolver.iniciar`) → cancele as tarefas abertas,
   mantenha o IB e prepare a cópia do número dele para a coluna `ib` da linha `EP-nn` (mensagem `elm: ib do
   EP-nn`).
3. **Tirado da sprint** (`sa-planejamento.sprint`, na virada) → cancele a tarefa daquela sprint e mantenha o IB.

Tudo com prévia e um "sim" (`elm_transicao` cancelar). Já cancelada → `ja_estava`; concluída → diga e pule.

## Saída

Caso 2 → passo `gravar`. Demais → passo `devolver`.

## Pare se

- Workflow sem cancelamento (`precondicao`) → diga e devolva.
