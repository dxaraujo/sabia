---
{"resumo": "Confere alvos, versão do Sabiá e uv; com agentes.json existente, entra em atualização."}
---
## Entrada

A raiz do repositório.

## Faça

1. **Alvos** (`alvos` do `agentes.json`: `kiro` · `opencode`): os que o projeto usa (`.kiro/`, `.opencode/`,
   `opencode.json`, detectados por `ls -A` na raiz) mais a ferramenta desta sessão. Confira que as skills do Sabiá
   estão instaladas em cada alvo; faltando → o comando `npx sabia instalar --alvo <alvo>`. O Kiro vale só no motor
   v3 (a IDE ou `kiro-cli chat --agent-engine v3`).
2. **Versão:** a instalada é o `version` de `~/.sabia/framework/plugin.json`. Projeto configurado com outra (o
   `sabia` do `agentes.json`) → ⚠️: atualize a sua (`npx sabia atualizar`) ou regenere com a sua.
3. **uv** (`uv --version`): o gerador dos agentes precisa dele. `kiro-cli --version` só com o Kiro nos alvos
   (opcional: valida os agentes no passo `conferir`).
4. **Modo:** com `.sabia/config/agentes.json` → atualização: mostre a configuração atual (cartão W0-A) e pergunte o
   que muda ("nada: só regenerar os agentes" é resposta válida). Nos passos seguintes, só o que muda é perguntado; o
   resto vem do que está gravado.

## Saída

Pré-checagem com o "ok" → passo `projeto`. Falta o uv ou as skills num alvo → diga como instalar e fim.

## Pare se

- Falta o uv: sem ele, o gerador não roda.
