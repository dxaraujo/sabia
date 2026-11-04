---
{"resumo": "Revisão independente dos artefatos da fatia pelo sa-revisor (rubrica P sobre os conceitos e a seção da ficha), até 2 rodadas; decisão de negócio volta ao trabalho."}
---
## Entrada

Os conceitos da pasta de trabalho escritos (passo `escrever`).

## Faça

Peça ao agente **`sa-revisor`** a revisão (rubrica **P** do padrão `sa-revisar/rubricas.md`) sobre os conceitos da
pasta de trabalho e a seção Artefatos afetados da ficha: P1, P10 e P13 não se aplicam; P6 lê a seção (a ação e o
impacto de cada linha). Sem o agente, aplique a rubrica você mesmo, sem usar o raciocínio de quem escreveu como
evidência. Corrija os achados (até 2 rodadas); o que for decisão de negócio volta ao trabalho.

## Saída

Revisão OK (ou achados aceitos) → passo `aprovacao`. Achado que é decisão de negócio → passo `trabalho`.

## Pare se

Nenhuma condição própria deste passo.
