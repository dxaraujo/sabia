---
{"resumo": "Oferece o próximo na mesma sessão: o PRD ao investir, o próximo épico ao cancelar, o detalhar na fatia que cabe em G."}
---
## Entrada

O resultado do passo `decisao`, já gravado.

## Faça

| Resultado | Oferta |
|---|---|
| investir | "seguir para o PRD?" (`sa-prd.prd`, que cria o `prd.md` na pasta do épico) |
| cancelar | moldar o próximo épico `a-moldar`, na ordem do `backlog.md` |
| cabe em G | "seguir para o detalhar?" (`sa-refinar.detalhar`, com a fatia nova) |
| sem decisão | "o pitch está na branch base; a decisão de investimento é de <nomes com `produto`>" |

## Saída

Investir com o "sim" → passa à `sa-prd.prd`. Cabe em G com o "sim" → passa à `sa-refinar.detalhar`. Cancelar com o "sim" →
passo `entrada`, com o próximo épico. Sem decisão, ou "não" → fim.

## Pare se

Nenhuma condição própria.
