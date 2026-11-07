---
{"resumo": "Entrada do setup: chamado pela sa-setup ou direto, sempre na sessão padrão."}
---
## Entrada

A `sa-setup.configurar`, com o "sim" a "usa ELM?", ou um pedido direto ("setup do ELM", "atualizar o pa").

## Faça

1. Inclua as regras (`sa-elm.regras`); a pré-condição delas não vale aqui.
2. Dentro de um agente `sa-*` → diga que o setup roda na sessão padrão (o harness nega `.sabia/config`) e pare.
3. Já existe `.sabia/config/elm/pa_<nome>.json` → modo atualização: leia o `pa` e mostre só o que muda em cada
   bloco.

## Saída

Sessão padrão → passo `mcp`. Dentro de um agente → fim.

## Pare se

- Dentro de um agente `sa-*` → diga e pare.
