---
{"resumo": "Fatos verificados da correção: o que foi feito × o certo, e onde a informação certa estava (ou que não estava)."}
---
## Entrada

A correção (um dos gatilhos da Entrada do fluxo `sa-aprender.registrar`).

## Faça

**Fatos** (só verificados; o que a pessoa disse é registrado como dito por ela):
- o que foi feito (`arquivo:linha`, trecho) × o que era o certo;
- onde a informação certa estava — ou que não estava em lugar nenhum.

## Saída

Os fatos → passo `causa`. Chamada pela `sa-consolidar` (fatos e causa já vêm) → passo `gravar`.

## Pare se

Sem condição de parada própria: fato não verificado não entra.
