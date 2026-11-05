---
{"resumo": "Revisão independente do PRD pelo sa-revisor (rubrica P); na 2ª reprovação seguida, a pessoa decide achado a achado; decisão de negócio volta à entrevista."}
---
## Entrada

`prd.md` e `elm/` escritos (passo `escrever`).

## Faça

Peça ao agente **`sa-revisor`** a revisão do PRD (rubrica **P** do padrão `sa-revisar/rubricas.md`). Corrija
os achados e peça a rodada seguinte; o que for decisão de negócio volta para a entrevista. Na 2ª reprovação seguida (`RESULTADO: AJUSTAR`), não corrija:
passe à pessoa, que decide achado a achado — o aceito vai ao GATE (`achados aceitos`), o de negócio volta à
entrevista. Fase `em-revisao` no `status.md` do épico
(modelo: o padrão `sa-especificar/status-epico.md`) enquanto isso; na mudança, a `em-revisao (de: …)` do passo
`sa-prd.mudanca.mudanca` fica.

## Saída

Revisão OK (ou achados aceitos) → passo `gate`. Achado que é decisão de negócio → passo `entrevistar`.

## Pare se

Nenhuma condição própria deste passo.

Ao parar aqui (na sessão da `[ESP]`, feche-a: `sa-especificar.especificar.fechar-sessao`).
