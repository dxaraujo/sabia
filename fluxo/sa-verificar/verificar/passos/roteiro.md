---
{"resumo": "Fase de verificação no status.md e o roteiro de cada cenário no verificacao.md, a partir do contrato de pronto do design.md, antes de executar."}
---
## Entrada

O contrato de pronto do `design.md` e os cenários que a fatia cobre (trilha rápida: o `bugfix.md`).

## Faça

`status.md`: AFK → `fase: verificando`; HITL → a fase continua `em-verificacao`; linha no Histórico.

O roteiro parte do **contrato de pronto** do `design.md` (acordado no GATE do plano, antes do código) — não o
afrouxe agora. Para cada cenário que a fatia cobre, escreva-o em `verificacao.md` **antes** de executar
(trilha rápida: os comportamentos esperado e que não muda do `bugfix.md`), no padrão `sa-verificar/verificacao.md`
(roteiro).

## Saída

O roteiro de todos os cenários no `verificacao.md` → passo `ambiente`.

## Pare se

—
