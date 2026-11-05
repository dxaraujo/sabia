---
{"resumo": "Fase de verificação no status.md e o roteiro de cada cenário no verificacao.md, a partir do contrato de pronto do design.md, antes de executar."}
---
## Entrada

O contrato de pronto do `design.md` e os cenários que a fatia cobre (trilha rápida: o `bugfix.md`).

## Faça

`status.md`: AFK → `fase: verificando`; HITL (chamada pelo `sa-verificar.hitl`) → a fase continua `em-verificacao`;
linha no Histórico.

O roteiro parte do **contrato de pronto** do `design.md` (acordado no GATE do plano, antes do código) — não o
afrouxe agora. Cada rodada é uma seção acrescentada no fim do `verificacao.md`, sem apagar as anteriores, com os cenários
da rodada (padrão `sa-verificar/verificacao.md`, Rodada). Para cada cenário da rodada, escreva-o **antes** de executar
(trilha rápida: os comportamentos esperado e que não muda do `bugfix.md`), no padrão `sa-verificar/verificacao.md`
(roteiro). HF alterada na `[ESP] FT` → o cenário é o da cópia aprovada em `elm/` da pasta da fatia, não o do PRD nem
o do bundle.

## Saída

O roteiro de todos os cenários no `verificacao.md` → passo `ambiente`.

## Pare se

—
