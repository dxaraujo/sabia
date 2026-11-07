---
{"resumo": "Detecta e roda uma vez os comandos e mescla a tabela ## Comandos do AGENTS.md (Ação × módulo)."}
---
## Entrada

Os tipos e módulos do passo `projeto`.

## Faça

1. Proponha (do build, do README ou dos `comandos` do toolkit detectado): compilar, testes, teste do trecho tocado
   (`{alvo}`), lint e cobertura com o gate, uma coluna por módulo.
2. Com o "ok", rode cada um uma vez (o teste do trecho com um teste que já existe; diga qual) e mostre o status e o
   tempo. `pular` fecha sem rodar, com ⏸️. Falhou → o cartão de bloqueio; a pessoa decide.
3. Monte a tabela `## Comandos` do `AGENTS.md` (Ação × módulo) por mescla. É a base do backpressure em camadas: o
   trecho tocado a cada alteração, a suíte completa antes do MR e o CI do MR.

## Saída

A tabela montada → passo `git`.

## Pare se

- Nunca feche com "não rodados" depois de um "ok".
