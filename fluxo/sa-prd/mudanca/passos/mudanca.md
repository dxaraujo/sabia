---
{"resumo": "PRD aprovado só muda por pedido explícito: versão nova, rodapé, Fase em-revisao, conceitos alterados em draft e o GATE de novo."}
---
## Entrada

Épico na Fase `aprovado` ou `fatiado` e um pedido explícito de mudança no PRD.

## Faça

Épico na Fase `aprovado` ou `fatiado`: o PRD só muda por um pedido explícito — incremente a versão (`1.1` correção,
`2.0` mudança de escopo), registre no rodapé, Fase `em-revisao` enquanto o que mudou é revisto, e repita o GATE.
Conceito alterado: `status: draft`, `generated.at` novo; no GATE, um `verified` novo é acrescentado à lista. A
publicação atualiza os mesmos artefatos (pelo `resource`/`id` de cada conceito). Fatias já entregues (`pronta` ou
`concluida`) que dependem do que mudou → avise e proponha fatias novas; não as altere.

Artefato novo que a mudança trouxer passa antes pelo passo `sa-prd.prd.similares`; a escrita segue as regras do passo
`sa-prd.prd.escrever`.

## Saída

O que mudou é revisto pelo passo `sa-prd.prd.revisao` e aprovado pelo passo `sa-prd.prd.gate`, no caminho
"mudança depois de aprovado".

## Pare se

Sem pedido explícito de mudança → o PRD aprovado não muda: pare.
