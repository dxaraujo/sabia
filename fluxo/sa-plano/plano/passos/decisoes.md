---
{"resumo": "Artefato do ELM ou do PRD que precisa mudar volta à especificação ([ESP] FT, fatia bloqueada); lacuna da ficha sem épico vai ao P.O.; escolha técnica com alternativas reais vai à pessoa (HITL) ou é decidida e registrada (AFK)."}
---
## Entrada

O `research.md` e as fontes da fatia (PRD, ficha ou defeito, e os conceitos aprovados em `elm/` da pasta da fatia).

## Faça

Escolhas **técnicas** com alternativas reais (ex.: onde guardar o contador) → apresente-as à pessoa com a
recomendada (HITL) ou decida e registre (AFK) em "Decisões técnicas".

## Saída

Decisões técnicas resolvidas ou registradas → passo `escrever`.

## Pare se

Nunca decida regra no plano.

- **Artefato que precisa mudar** — regra sem valor, exceção sem comportamento, cenário que contradiz o código ou outro
  artefato, artefato do ELM ou do PRD que a fatia altera e não está na seção Artefatos afetados da ficha → o bloco
  [Volta à especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação) (`de: planejando`)
  e **pare**: o próximo é o do `Próximo:` do bloco (a `[ESP]`, do especificador; o encaixe ou a pendência na `[GB]`,
  do P.O. ou do SM).
- **Lacuna da ficha sem épico** fora dos artefatos (`C<n>`, decisão) → `fase: bloqueada (de: planejando)` com a
  pergunta e **pare**: é do P.O. (agente `sa-produto`), pela `sa-triar` (decisão em aberto → `sa-entrevistar`).
