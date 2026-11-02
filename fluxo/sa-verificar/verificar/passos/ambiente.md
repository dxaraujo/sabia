---
{"resumo": "Sobe a aplicação ou o job pelo comando Executar do sabia.md (nunca produção) e prepara a massa de teste pelos scripts de massa."}
---
## Entrada

O roteiro no `verificacao.md` (passo `roteiro`) e a seção **Verificação de aceite** do `sabia.md`.

## Faça

- Suba a aplicação/job como o `sabia.md` manda (comando **Executar**) — ambiente local ou de teste,
  **nunca produção**.
- Massa de teste: scripts da convenção do projeto (seção Verificação de aceite do `sabia.md`); sem convenção, crie-a
  em `.kiro/specs/<ft>-<slug>/massa/`. Escrita em banco **só** pelos scripts de massa; consultas pelo MCP de banco,
  somente leitura.

## Saída

A aplicação no ar e a massa criada → passo `executar`.

## Pare se

- Campo Banco do `status.md` = `pendente` → a verificação depende da DDL aplicada em dev: "DDL em dev: o Dev, ou o
  item BD pela `sa-executar`" e pare.
