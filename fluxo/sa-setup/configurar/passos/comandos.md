---
{"resumo": "Detecta e roda uma vez os comandos e mescla a tabela ## Comandos do .sabia/sabia.md (Ação × módulo)."}
---
## Entrada

Os tipos e módulos do passo `projeto`.

## Faça

1. Proponha (do build, do README, do `AGENTS.md` se houver, ou dos `comandos` do toolkit detectado): compilar, testes, teste do trecho tocado
   (`{alvo}`), lint e cobertura com o gate, uma coluna por módulo.
2. Com o "ok", rode cada um uma vez (o teste do trecho com um teste que já existe; diga qual) e mostre o status e o
   tempo. `pular` fecha sem rodar, com ⏸️. Falhou → o cartão de bloqueio; a pessoa decide.
3. Monte a tabela `## Comandos` do `.sabia/sabia.md` (Ação × módulo) por mescla: é o steering que o Kiro sempre
   carrega (o Kiro não lê o `AGENTS.md`). É a base do backpressure em camadas: o trecho tocado a cada alteração e a
   suíte completa antes do MR.
4. **CI.** Pergunte "o projeto tem CI cujo resultado um MCP configurado aqui consegue ler?". Sim: qual MCP e qual tool
   devolve o resultado do pipeline de um commit; confira que a tool existe no agente. Grave a linha
   `**CI:** MCP <nome> — <tool>` logo abaixo da tabela. Não, ou não sabe: `**CI:** não há`. Sem CI declarado, o fluxo
   vale igual: a validação é a suíte completa local.

## Saída

A tabela montada → passo `git`.

## Pare se

- Nunca feche com "não rodados" depois de um "ok".
