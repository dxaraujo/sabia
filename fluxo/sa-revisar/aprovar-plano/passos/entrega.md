---
{"resumo": "Créditos (e a lição, se houver), commit, push e conferência no remoto; só então horas (e conclusão da [APR], se aprovado) e o aviso ao Dev."}
---
## Entrada

O `status.md` com a decisão (passo `decidir`).

## Faça

Créditos da sessão no `status.md` ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4) e, se a pessoa corrigiu algo nesta sessão, uma linha nas **Lições candidatas** (a consolidação a registra) → commit (`registrar aprovação do plano`) → push → conferir no remoto (como na entrega do passo
`sa-codificar.codificar.pr`) → só então: aprovado → saldo de horas e conclusão da `[APR]` (`elm_horas` → `elm_lancar_horas` do saldo →
`elm_transicao(<id>, "concluir")`, numa confirmação; sem o MCP `elm` → `ELM pendente [APR FT-<nnn> concluir]: lançar <h>h e
concluir`); ajuste → horas da sessão na `[APR]` (lança, não conclui) → avise o Dev (aprovado → `sa-codificar`; ajuste →
`sa-plano`).

## Saída

O `status.md` no remoto, a `[APR]` concluída (aprovado) ou em andamento (ajuste) e o Dev avisado. Aqui o fluxo
termina.

## Pare se

- Remoto diferente do local → não siga: diga o que falta.
