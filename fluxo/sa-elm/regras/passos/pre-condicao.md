---
{"resumo": "ELM configurado: chave elm do agentes.json, o pa e o MCP elm na sessão."}
---
## Entrada

O fluxo que incluiu as regras.

## Faça

1. Na `sa-elm.setup`, pule este passo: é ela que configura.
2. Leia a chave `elm` do `.sabia/config/agentes.json`. `elm: false`, sem o
   `.sabia/config/elm/pa_<nome>.json` do `elm.pa` ou sem o MCP `elm` nesta sessão → o resultado é "ELM não
   configurado": diga isso em uma linha.
3. O MCP respondeu erro `config` → mostre o campo que falta e ofereça a `sa-elm.setup` (na sessão sem agente). O
   resultado também é "ELM não configurado".

## Saída

Configurado ou não configurado → passo `autopilot`.

## Pare se

- Nunca pare por aqui: sem ELM, quem ofereceu segue sem ele.
