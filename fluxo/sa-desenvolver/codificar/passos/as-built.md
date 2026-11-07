---
{"resumo": "Decisão que atravessa fatias vira ADR no próprio MR; o design.md fica as-built onde o projeto mantém ET."}
---
## Entrada

O `design.md` (Decisões técnicas) e o código da branch.

## Faça

1. Decisão que atravessa fatias (banco, framework, padrão de integração) → ADR em `docs/adr/NNNN-<titulo>.md` (chave
   `adr` do `agentes.json`; NNNN = maior da pasta + 1), no formato Nygard: Status · Context · Decision ·
   Consequences · Origem `FT-nnn`. As outras decisões ficam no `design.md`.
2. Onde o projeto mantém ET (seção ELM do `sabia.md`: `ET as-built: sim`), ajuste no `design.md` as seções
   Components and Interfaces, Data Models e Decisões técnicas ao que foi feito (OpenSpec: Decisions). A publicação é
   do archive, depois do merge.
3. Commit na branch.

## Saída

ADRs e as-built no MR → passo `mr`.

## Pare se

Nunca.
