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

- Campo Banco do `status.md` = `pendente` e a DDL ainda não aplicada no ambiente da verificação (pelo MCP de banco,
  somente leitura; sem ele, a pessoa diz — AFK, sem pergunta: não aplicada, salvo a fatia que já saiu desse Bloqueio
  pela pessoa, no Histórico: aplicada) → `fase: bloqueada (de: verificando)` (HITL: `de: em-verificacao`), Bloqueio
  `aguardando aplicação de baseline de banco` — a aplicação é da Sustentação (item BD/Implantação), nunca à mão — e
  pare (HITL: devolva ao `sa-verificar.hitl`, que faz a entrega).
