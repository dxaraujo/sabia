---
{"resumo": "Pergunta qual tool do MCP de banco só faz consulta; só ela entra nos agentes, em leitura."}
---
## Entrada

Os servidores MCP do projeto e do usuário.

## Faça

1. Liste os servidores de `.kiro/settings/mcp.json` e `~/.kiro/settings/mcp.json` (Kiro) e da chave `mcp` do
   `opencode.json` do projeto e de `~/.config/opencode/opencode.json` (opencode).
2. Pergunte qual **tool** só faz consulta (ou "não há"). Só ela entra nos agentes (`<servidor>/<tool>` em
   `agentes.<agente>.mcp`), sempre em leitura; nunca o servidor inteiro se ele tem tool de escrita. Recomende um
   usuário de banco só leitura.

## Saída

→ passo `formato-spec`.

## Pare se

- Nunca libere tool de escrita do banco.
