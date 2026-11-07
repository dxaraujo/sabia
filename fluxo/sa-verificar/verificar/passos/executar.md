---
{"resumo": "Roda cenário por cenário como usuário real, pelo tipo de projeto, e marca cada um ✅ aceito · ❌ rejeitado · ⚠️ ambiente · 🔁 possível alteração, com esperado × obtido e a evidência."}
---
## Entrada

A aplicação no ar e os dados prontos (passo `ambiente`).

## Faça

1. Rode cenário por cenário como um usuário real:

| Tipo de projeto | Como |
|---|---|
| backend | chamada HTTP com `curl` na URL de teste e o estado no banco, em leitura |
| batch | o job, o status da execução e as contagens |
| frontend | navegador (Playwright ou MCP de browser) |
| dados | a carga e as consultas |
| mobile | emulador, ou roteiro com a pessoa |
| biblioteca | testes de contrato públicos |
| infra | `plan`, `lint` ou `dry-run`, nunca `apply` |

2. Resultado por cenário: ✅ aceito · ❌ rejeitado · ⚠️ ambiente (falha do ambiente, não do código; diga o que
   faltou) · 🔁 possível alteração (a spec parece errada, não o código). Sempre com esperado × obtido e a evidência
   (comando com a saída, contagem ou captura de tela).
3. Evidência com dado real fica na máquina; no resultado vai só um resumo, sem identificar pessoas.

## Saída

O resultado de cada cenário → passo `fora-dos-cenarios`.

## Pare se

—
