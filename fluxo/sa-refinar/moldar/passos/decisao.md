---
{"resumo": "Registra a decisão de investimento de quem tem produto no pitch.md e na linha do épico; o que cabe em G vira fatia aceita."}
---
## Entrada

O `pitch.md` do passo `pitch`.

## Faça

A decisão de investimento é de quem tem `produto` no `equipe.json`. Sem essa pessoa na sessão: mostre os nomes com `produto`; o
épico fica `a-moldar`, e só o pitch grava (`EP-nn pitch`).

| Decisão | Linha do épico | `pitch.md` | Commit |
|---|---|---|---|
| investir | status `em-especificacao`; na sprint aberta, a linha `EP-nn · especificação` com `iniciada_em` = hoje (se vazia; a linha nasce se falta) | `Decisão: investir` e, no topo, `**Aprovado:** <usuario> · AAAA-MM-DD` | `EP-nn investir` |
| cancelar | status `cancelado`, `obs` `não investir: <motivo>` | `Decisão: cancelar · <motivo>` e, no topo, `**Aprovado:** <usuario> · AAAA-MM-DD`; a pasta fica | `EP-nn cancelar` |
| cabe em G (não é épico) | status `cancelado`, `obs` `virou FT-nnn` | `Decisão: cancelar · cabe em G, virou FT-nnn` e, no topo, `**Aprovado:** <usuario> · AAAA-MM-DD` | `EP-nn cancelar` |

**Cabe em G**: a fatia nasce pelo passo `cadastro`, já `aceita` (com o tamanho), com `veio de EP-nn` na
`obs` e a ficha curta com a Entrada tirada do pitch. A linha do épico, a da fatia e o `pitch.md` vão no mesmo commit.

## Saída

Investir, cancelar ou sem quem tem `produto` → passo `commit-na-branch-base`, com o `pitch.md` e a linha do épico. Cabe em G → passo
`cadastro`.

## Pare se

Nenhuma condição própria: sem a decisão, o pitch grava e o fluxo segue para o fim.
