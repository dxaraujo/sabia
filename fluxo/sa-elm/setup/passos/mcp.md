---
{"resumo": "Confere o MCP elm e a credencial; o que falta vira instrução, sem travar."}
---
## Entrada

A sessão sem agente.

## Faça

1. MCP `elm`: no Kiro vem com o power; no opencode, o `sabia instalar` o instala de forma global. Faltou → diga
   o comando de instalação.
2. Credencial: `~/.config/mcp-elm/elm.properties` (`server`, `user`, `password`). O agente não lê esse arquivo:
   rode `elm_status(projeto)`; erro `credencial` → diga o que preencher.
3. Não suponha rede: o ELM pode responder sem VPN quando o GitLab não responde. Diga o que respondeu.

## Saída

Tudo certo → passo `montar-pa`. Faltou algum → passo `devolver`, com `elm: false`.

## Pare se

- Nunca: o que falta vira `elm: false` e a `sa-setup` segue.
