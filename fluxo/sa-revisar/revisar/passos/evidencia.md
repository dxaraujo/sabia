---
{"resumo": "Coleta a evidência de cada verificação da rubrica: cruza item a item (P/L) ou lê o diff inteiro, executa o backpressure e caça testes enfraquecidos (C), cada eixo separado."}
---
## Entrada

A rubrica do pedido e a entrada dela (passo `escopo`).

## Faça

- **P/L:** cruze item a item (cenário → critério → tarefa; regra → origem). Para L4 abra os caminhos citados.
- **C:** comece por `git diff --stat`; leia o diff inteiro dos arquivos de produção e de teste. **Execute** os
  comandos de backpressure (C3) — não confie em "os testes passaram" de ninguém. Procure no diff por testes
  removidos ou enfraquecidos (`git diff --diff-filter=D --name-only`, `@Disabled`, `@Ignore`, `skip`, `xit`,
  `assertTrue(true)`, asserts apagados, `catch` vazio) — C4. Avalie os dois eixos separadamente; com subagentes
  disponíveis, um revisor por eixo, em paralelo.
- Banco só por MCP de consulta, somente leitura (`SELECT`/`WITH`).

## Saída

Os achados, cada um com evidência (`arquivo:linha`, comando + saída, ou "procurado em X, não encontrado") → passo
`calibrar`.

## Pare se

—
