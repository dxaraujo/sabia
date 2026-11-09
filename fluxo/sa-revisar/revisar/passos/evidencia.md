---
{"resumo": "Junta a evidência de cada item: na L, cruza cenário → critério → tarefa e confere o texto copiado; na C, lê o diff inteiro, avalia os eixos spec · padrões · segurança em separado e caça teste enfraquecido."}
---
## Entrada

Os critérios de revisão, a entrada dela (passo `escopo`) e, na C, o C3 (passo `ci`).

## Faça

- **L:** cruze item a item: cenário CT-nn → critério → tarefa; regra → origem. Confira que o texto dos requisitos no
  delta é igual ao texto aprovado da ficha, do `prd.md` ou de `elm/`, sem reescrita. Abra os caminhos citados (L4).
- **C:** comece por `git diff --stat` e leia o diff inteiro, de produção e de teste. Avalie os três eixos em
  separado (spec · padrões · segurança); um não compensa o outro. Com subagentes disponíveis, um por eixo. Procure
  teste removido ou enfraquecido (C4): `git diff --diff-filter=D --name-only`, `@Disabled`, `@Ignore`, `skip`,
  `xit`, assert apagado, `assertTrue(true)`, `catch` vazio.
- Banco só pelo MCP de consulta, em leitura (`SELECT`, `WITH`).
- Vale como evidência `arquivo:linha`, um comando com a saída ou "procurado em X, não encontrado".
- O que diverge da spec é achado com destino `volta-spec`. Problema fora do escopo da fatia é SUGESTÃO com destino
  `adia`.

## Saída

Os achados, cada um com evidência, e o resultado de cada item dos critérios de revisão → passo `relatorio`.

## Pare se

—
