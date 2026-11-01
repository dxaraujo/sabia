---
{"resumo": "Executa cenário por cenário como um usuário real (API, job, browser, carga), com repetição e erro em um item, e registra resultado, obtido e evidência."}
---
## Entrada

A aplicação no ar e a massa criada (passo `ambiente`).

## Faça

Execute cenário por cenário e registre logo abaixo do roteiro, no padrão `sa-verificar/verificacao.md` (resultado).

- Por tipo de projeto: **backend** → chamada HTTP (pelo `sh .sabia/http.sh <MÉTODO> <caminho> [corpo]`, se o
  `sabia.md` o registra — o corpo vem da pasta `massa/`; senão `curl`, que pede confirmação) e estado no
  banco; **batch** → execução do job com a massa, status da execução e contagens; **frontend** → navegação real
  no browser (Playwright ou MCP de browser ligado ao agente), screenshot em `evidencias/`; **dados** → carga e
  consultas de verificação.
- Rode também os cenários de **repetição** (execute duas vezes; conte de novo) e de **erro em um item**.
- Falha por ambiente (serviço fora do ar, credencial de teste) → `⚠️ ambiente`, não rejeição; diga o que faltou.

## Saída

O resultado de cada cenário no `verificacao.md` → passo `decisao`.

## Pare se

—
