---
{"resumo": "Registra o go ou o kill de quem tem produto no pitch.md e na linha do épico; o que cabe em G vira fatia aceita."}
---
## Entrada

O `pitch.md` do passo `pitch`.

## Faça

O go/kill é de quem tem `produto` no `equipe.json`. Sem essa pessoa na sessão: mostre os nomes com `produto`; o
épico fica `a-moldar`, e só o pitch grava (`EP-nn pitch`).

| Decisão | Linha do épico | `pitch.md` | Commit |
|---|---|---|---|
| go | status `em-especificacao`, `iniciada_em` = hoje | `Decisão: go` e, no topo, `**Aprovado:** <usuario> · AAAA-MM-DD` | `EP-nn go` |
| kill | status `cancelado`, `obs` `não investir: <motivo>` | `Decisão: kill · <motivo>` e, no topo, `**Aprovado:** <usuario> · AAAA-MM-DD`; a pasta fica | `EP-nn kill` |
| cabe em G (não é épico) | status `cancelado`, `obs` `virou FT-nnn` | `Decisão: kill · cabe em G, virou FT-nnn` e, no topo, `**Aprovado:** <usuario> · AAAA-MM-DD` | `EP-nn kill` |

**Cabe em G**: a fatia nasce pelo passo `cadastro`, já `aceita` (com `aceita_em` e o tamanho), com `veio de EP-nn` na
`obs` e a ficha curta com a Entrada tirada do pitch. A linha do épico, a da fatia e o `pitch.md` vão no mesmo commit.

## Saída

Go, kill ou sem quem tem `produto` → passo `commit-na-branch-base`, com o `pitch.md` e a linha do épico. Cabe em G → passo
`cadastro`.

## Pare se

Nenhuma condição própria: sem a decisão, o pitch grava e o fluxo segue para o fim.
