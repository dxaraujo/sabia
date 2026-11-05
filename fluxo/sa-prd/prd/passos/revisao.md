---
{"resumo": "Revisão independente do PRD pelo sa-revisor (rubrica P), até 2 rodadas; decisão de negócio volta à entrevista."}
---
## Entrada

`prd.md` e `elm/` escritos (passo `escrever`).

## Faça

Peça ao agente **`sa-revisor`** a revisão do PRD (rubrica **P** do padrão `sa-revisar/rubricas.md`); sem o agente, aplique a rubrica
você mesmo, sem usar o raciocínio de quem escreveu como evidência. Corrija os achados (até 2 rodadas); o que for
decisão de negócio volta para a entrevista. Fase `em-revisao` no `status.md` do épico
(modelo: o padrão `sa-especificar/status-epico.md`) enquanto isso; na mudança, a `em-revisao (de: …)` do passo
`sa-prd.mudanca.mudanca` fica.

## Saída

Revisão OK (ou achados aceitos) → passo `gate`. Achado que é decisão de negócio → passo `entrevistar`.

## Pare se

Nenhuma condição própria deste passo.

Ao parar aqui (na sessão da `[ESP]`, feche-a: `sa-especificar.especificar.fechar-sessao`).
