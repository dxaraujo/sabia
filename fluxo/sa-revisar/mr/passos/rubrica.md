---
{"resumo": "Chama a sa-revisar.revisar no subagente sa-revisor, com a rubrica C sobre o diff da branch do MR; o relatório apoia a pessoa e não substitui a revisão dela."}
---
## Entrada

O MR lido (passo `ler`).

## Faça

1. Chame a `sa-revisar.revisar` no subagente `sa-revisor`, com a rubrica C, o item `FT-nnn`, o diff
   `git diff origin/<base>...origin/<id>`, o link do MR e o resultado do CI lido.
2. Mostre o relatório à pessoa junto com os achados do passo `ler`. Ele apoia a revisão dela e não a substitui: a
   pessoa lê o diff (pela ordem do Foco) e acrescenta os próprios achados.

## Saída

A lista de achados, do relatório e da pessoa → passo `veredito`.

## Pare se

—
