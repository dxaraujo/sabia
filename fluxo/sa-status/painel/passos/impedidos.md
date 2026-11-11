---
{"resumo": "Itens impedidos, do mais antigo ao mais novo, com o motivo, quem impede e o aviso acima do limite dos acordos."}
---
## Entrada

O backlog e o `acordos.json`.

## Faça

Itens `impedida` ou `impedido`, do impedimento mais antigo (`desde` do `motivo`) ao mais novo: o motivo, quem
impede, há quantos dias, o `até` e o status anterior. Acima de `alertas.impedimento_dias` do `acordos.json` (padrão 7)
→ marque como crítico. Com o `até` vencido → "pode ser liberado" (`sa-status.situacao`).

## Saída

Impedidos → passo `fila-de-triagem`.

## Pare se

Sem condição própria.
