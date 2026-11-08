---
{"resumo": "Confere caminhos, GitLab, os Comandos do sabia.md e os agentes gerados."}
---
## Entrada

O que foi gravado.

## Faça

Rode e mostre o cartão W9 com o status de cada um:

1. Todo caminho que o `sabia.md` e o `agentes.json` citam existe, ou é `null`.
2. O GitLab que ficou ⏸️ no passo `gitlab`: teste de novo.
3. Os Comandos do `.sabia/sabia.md`, um a um: o status e o tempo; o primeiro que falha → ❌ com o erro em uma linha.
4. opencode nos alvos → `opencode debug agents` lista os `sa-*` (a primeira chamada pode voltar vazia: rode de
   novo).
5. Kiro nos alvos e `kiro-cli` disponível → `kiro-cli agent validate --path .kiro/agents/<agente>.json` para cada um
   e `kiro-cli agent list`: os 5 fixos e os de toolkit. Confira também que o agente de toolkit tem as permissões do
   dono do passo, que o workspace é confiável e que as ferramentas que varrem a raiz excluem `.sabia/local/`.
6. Com ELM: `elm_status(projeto=<raiz>)` → válido.

## Saída

→ passo `commit`.

## Pare se

- Nunca diga ✅ sem resposta real.
