---
{"resumo": "Devolve o relatório a quem chamou, sem gravar arquivo nem commit: uma linha por achado com severidade e destino sugerido, uma tabela por eixo na C, e o fecho exato na última linha."}
---
## Entrada

Os achados e as verificações (passo `evidencia`).

## Faça

1. Monte o relatório no formato do padrão `sa-revisar/rubricas.md`: uma linha por achado, com # · severidade
   (BLOQUEANTE · IMPORTANTE · SUGESTÃO) · achado · evidência · correção · origem (L: plano · ficha · PRD; C:
   código · ambiente) · destino sugerido (corrige · adia · volta-plano · volta-spec · descarta). Na rubrica C, uma
   tabela por eixo.
2. A última linha é exata. L: `ANALISE: OK` ou `ANALISE: AJUSTAR`. C: `VEREDITO: APROVADO`, `VEREDITO: REVISAR` ou
   `VEREDITO: AMBIENTE`. Só o BLOQUEANTE reprova. C3 sem rodar por ambiente → `VEREDITO: AMBIENTE`, nunca
   `APROVADO`.
3. Devolva o relatório a quem chamou. Não grave arquivo e não faça commit. Quem chamou tria e grava: a
   `sa-plano.plano` corrige o plano; a `sa-desenvolver.codificar` transforma cada `corrige` em tarefa `[R<n>]` e
   leva o resumo à Prova do MR; a `sa-revisar.mr` abre as threads no MR.

## Saída

O relatório, com o fecho na última linha, devolvido a quem chamou. Aqui o fluxo termina.

## Pare se

—
