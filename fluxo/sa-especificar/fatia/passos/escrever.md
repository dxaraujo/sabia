---
{"resumo": "Escreve cada artefato da seção no estado depois, desviável por tipo para a skill de um toolkit: altera edita a cópia, inclui cria o conceito, exclui marca a cópia, pelas regras de escrita do PRD."}
---
## Entrada

A pasta de trabalho com as cópias e o impacto revisto (passo `artefatos`), ou o ajuste pedido na aprovação (passo
`aprovacao`).

## Faça

Tipo com skill de toolkit no seu prompt (**Tipos com skill de toolkit**) → o artefato desse tipo sai pela skill, como
no passo `sa-prd.prd.escrever` (o contrato da volta inclusive: arquivo pela coluna Arquivo do catálogo, envelope do
`okf-elm.md`, `status: draft`; o `exclui`, `status: deprecated`). Os demais, aqui, no estado **depois** da mudança:

- **`altera`** → edite a cópia: `status: draft`, `generated` novo.
- **`inclui`** → conceito novo: o corpo do padrão do tipo (coluna Padrão do
  [catálogo](~/.sabia/framework/skills/sabia/references/tipos.md)), o envelope do
  [okf-elm.md](~/.sabia/framework/skills/sa-prd/references/okf-elm.md), `status: draft`, `sources` com a ficha e as
  decisões; na ficha, a coluna Artefato troca `novo · <título>` pelo rótulo local (`REG-01`).
- **`exclui`** → a cópia com `status: deprecated`, `generated` novo e o motivo em `## Relações` (o substituto, quando
  há).

Valem as regras de escrita do passo `sa-prd.prd.escrever` (HF → REG por link, `reusa` embute o existente, CT de cada
cenário da HF alterada, EL nos dois sentidos, termos do glossário), com a ficha no lugar do PRD.

## Saída

Um conceito por linha da seção na pasta de trabalho → passo `revisao`.

## Pare se

- Decisão que a escrita pede e ninguém tomou → `em aberto` na ficha; volta pelo passo `revisao` (decisão de negócio).
