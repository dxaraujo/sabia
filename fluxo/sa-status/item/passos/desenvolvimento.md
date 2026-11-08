---
{"resumo": "Pronta, em andamento, retrabalho, MR em revisão, aprovado ou fechado, revisão humana e trava."}
---
## Entrada

O estado.

## Faça

- `pronta` sem branch, ou `pronta` com branch (voltou na virada: a posse volta e a branch é reaproveitada) →
  `sa-desenvolver.iniciar`.
- `em-andamento` sem MR → `sa-desenvolver.codificar`, pelo Retomar.
- `em-andamento` sem branch publicada (a sessão parou antes do push) → só o responsável retoma
  (`sa-desenvolver.iniciar`).
- Retrabalho ou autopilot devolvido → `sa-desenvolver.codificar`.
- MR esperando revisão → qualquer desenvolvedor ≠ autor (`sa-revisar.mr`); ao autor, diga que espera.
- MR aprovado com CI verde, ou mergeado sem o item `concluida` → o autor (`sa-desenvolver.encerrar`).
- MR fechado sem merge → mostre e aponte `sa-desenvolver.codificar`.
- Aceite humano (revisão humana) pedido → qualquer pessoa (`sa-verificar.revisao-humana`).
- Trava de artefato → mostre quem tem a precedência e pare.

## Saída

Casou → passo `mostrar-e-seguir`. Trava de artefato → o fluxo termina. Não casou → passo `epico`.

## Pare se

Trava de artefato → mostre a precedência e pare.
