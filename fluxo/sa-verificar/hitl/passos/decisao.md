---
{"resumo": "Possível alteração indicada → a pessoa decide (volta à especificação: bloqueada; código errado: cenário rejeitado); ACEITO → fase aceita; REJEITADO → retrabalho (de: em-verificacao), Rodadas e linha na tabela Retrabalho; volta: o bloco Volta à especificação."}
---
## Entrada

O bloco `🔎 Verificação` no fim do `verificacao.md` e o Drift de negócio do `status.md` (passo `cenarios`).

## Faça

**Possível alteração** (`possível alteração — … · artefatos: …` sem ` · especificação:`) → antes do resultado,
mostre-a e pergunte: `Possível alteração: <motivo> · <artefatos>. Volta à especificação, ou o código está errado?` A
decisão é sua, não do agente:

- **código errado** → o cenário é rejeitado (o `🔁` provisório vira `❌`, e o fecho, `VERIFICACAO: REJEITADO`), o
  Drift fica `não` e o Histórico ganha `drift descartado: código errado (<login>)`;
- **volta** → ` · especificação: [ESP] FT-<nnn>` no Drift e o bloco [Volta à especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação) (`de: em-verificacao`), só na branch do PR (nada na base); a `[VER]` fica em andamento e o resultado abaixo
  não se aplica.

- **`ACEITO`** → `fase: aceita`.
- **`REJEITADO`** → `fase: retrabalho (de: em-verificacao)`; incremente "retrabalho" em Rodadas e grave uma linha na
  tabela **Retrabalho** do `status.md` (papel `VER`). A `[VER]` fica em andamento.

## Saída

A fase do resultado (ou `bloqueada`, na volta à especificação) no `status.md` → passo `entrega`.

## Pare se

—
