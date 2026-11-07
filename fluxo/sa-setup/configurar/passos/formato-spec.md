---
{"resumo": "Decide o formato_spec: Kiro com alvo Kiro; só opencode, pergunta Kiro ou OpenSpec."}
---
## Entrada

Os alvos do passo `pre-checagem`.

## Faça

1. Algum alvo é Kiro → `formato_spec: kiro`, sem perguntar.
2. Só opencode → pergunte: Kiro (padrão da empresa, `.kiro/specs/`) ou OpenSpec (`openspec/changes/`).
3. Vai no `agentes.json` e na seção Especificação do `sabia.md`. As skills compiladas leem a chave quando rodam.

## Saída

→ passo `pasta-produto`.

## Pare se

- Nunca pergunte com o Kiro nos alvos.
