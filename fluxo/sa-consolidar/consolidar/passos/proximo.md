---
{"resumo": "Mostra o fecho da consolidação: ELM, débito de especificação, créditos, situação do épico com a próxima fatia e as lições registradas."}
---
## Entrada

A fatia `concluida` na base (passo `fechar`).

## Faça

```
✅ FT-<nnn> concluída — <título>
ELM: <publicado (ET · CT <ids | CSV>) | pendente: …> · Débito de especificação: <n linhas | —>
Créditos: <x.xx> (<n> sessões · power sabia <versões>)
Épico EP-<nn>: <c>/<t> fatias · próxima: FT-<…> (<planejada | elegivel> · <AFK|HITL>, desbloqueada agora)
Lições: <n> registradas
```

Linha ELM: `ET <id>` só quando a linha ET do `sabia.md` publica as-built; `CT <ids>` ou `CSV`. Linha Épico: só na
fatia de épico (Manutenção → omita). Próxima = a primeira fatia do épico em `planejada`, senão em `elegivel`, pela
ordem do `backlog.md` (prioridade; no empate, a linha); `, desbloqueada agora` só se a FT consolidada estava no
`bloqueada-por` dela; nenhuma → `próxima: —`.

## Saída

Aqui o fluxo termina: mostre o fecho e pare.

## Pare se

—
