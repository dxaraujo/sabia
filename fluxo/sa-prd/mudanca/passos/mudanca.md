---
{"resumo": "PRD aprovado e não fatiado só muda por pedido explícito, na [ESP] do épico (reaberta, se concluída), reescrito no lugar; Fase em-revisao (de: aprovado), conceitos alterados em draft e o GATE de novo. Fatiado: a [ESP] FT da fatia ou a sa-triar."}
---
## Entrada

Épico com o PRD aprovado na base, na Fase `aprovado` ou `fatiado`, e um pedido explícito de mudança no PRD.

## Faça

O PRD aprovado só muda por um pedido explícito, e só antes do fatiamento:

- **`fatiado`** → o PRD não muda (o DOORS Next é a fonte). Alteração de artefato que uma fatia não terminal cobre →
  a [Volta à especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação) dessa fatia
  (não iniciada: a linha na seção Artefatos afetados, com Especificado `—`, e a DoR volta a `nova` com
  `falta: especificação`; iniciada: item Pedido de fora da fatia) e "use `sa-especificar FT-<nnn>`"; escopo novo (história, regra ou ator que o PRD não tem), ou a fatia já terminal → "use
  `sa-triar` com origem EP-<nn>" (agente `sa-produto`).
- **`aprovado`** → a mudança é trabalho da `[ESP]` do épico:
  1. **`[ESP]`** aberta → segue nela. Concluída → `reabrir` e `assumir`, com "sim" (seção Assumir do passo
     `sa-especificar.especificar.entrada`), e a linha do épico na seção Especificação do `sprint-<nn>.md` aberto volta
     a `iniciada` (bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), commit
     `EP-<nn> reabrir especificação`). Sem a linha viva na sprint aberta → "a `[ESP]` entra pelo encaixe (P.O. ou SM,
     agente `sa-produto`)" e pare. A transcrição nova de uma reunião, sem ATA aprovada, é pedido explícito: reaberta a
     `[ESP]`, a reunião registra a ATA antes de reescrever o PRD (`sa-especificar.reuniao`), e a decisão que muda o
     PRD volta aqui.
  2. **Reescrita no lugar** — nada foi publicado: a versão segue a mesma; o rodapé registra a data e o que mudou.
     Fase `em-revisao (de: aprovado)` enquanto o que mudou é revisto, e o GATE de novo. Conceito alterado:
     `status: draft`, `generated.at` novo; no GATE, um `verified` novo é acrescentado à lista.

Artefato novo, alterado ou excluído que a mudança trouxer passa antes pelo passo `sa-prd.prd.similares`; a escrita
segue as regras do passo `sa-prd.prd.escrever`.

## Saída

- `aprovado` com a transcrição nova → a `[ESP]` reaberta e `sa-especificar.reuniao` (a ATA primeiro).
- `aprovado` → o que mudou é revisto pelo passo `sa-prd.prd.revisao` e aprovado pelo passo `sa-prd.prd.gate`, no
  caminho "mudança antes do fatiamento".
- PRD ainda na pasta de trabalho (sem o GATE, ou `aprovado` sem ir à base) → não é mudança: "use
  `sa-especificar EP-<nn>`" (a sessão da `[ESP]` segue no `sa-prd.prd`, ou leva o PRD para a base antes).
- `fatiado` → a `[ESP] FT` da fatia (`sa-especificar.fatia`, agente `sa-especificador`) ou a `sa-triar` (agente
  `sa-produto`).

## Pare se

- Sem pedido explícito de mudança → o PRD aprovado não muda: pare.
- PRD na pasta de trabalho, `fatiado`, ou a `[ESP]` fora da sprint aberta → diga a próxima e pare.
