---
{"resumo": "Testa o MCP gitlabpr e mostra o modelo da credencial; sem GitLab, o MR sai como título e descrição."}
---
## Entrada

O `origin` da raiz.

## Faça

1. Teste uma vez `gitlab_listar_mrs(pasta=<raiz>, limite=1)` pelo MCP `gitlabpr`. Respondeu → ✅. Erro de rede →
   ⏸️ (testado de novo no passo `conferir`).
2. Erro de credencial → mostre as variáveis `GITLAB_API_URL` e `GITLAB_API_TOKEN` (token pessoal com
   escopo `api`): a pessoa as define no `env` do MCP; o agente não lê nem grava credencial.
3. A identidade é o usuário do GitLab (o `usuario` do `equipe.json`).
4. `origin` fora do GitLab, ou sem credencial → o MR sai como título e descrição. Nunca `gh` nem `glab`.

## Saída

→ passo `banco`.

## Pare se

- Nunca leia o arquivo de credencial.
