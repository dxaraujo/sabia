---
{"resumo": "Grava o agentes.json e roda o gerador, que escreve os 5 agentes e os de toolkit nos alvos."}
---
## Entrada

Tudo o que os passos montaram e os dados do passo `elm`.

## Faça

1. Grave o `.sabia/config/agentes.json` no esquema do
   [agentes.md](~/.sabia/framework/skills/sa-setup/references/agentes.md): `alvos`, `sabia` (a versão instalada),
   `formato_spec`, `produto`, `branch_base`, `prefixo_branch`, `glossario`, `adr`, `elm` (`false` ou `{pa, bundle, regras}`),
   `toolkits`, `passos` e `agentes.<agente>.{modelo, mcp, skills, subagentes}`.
2. `npx sabia agentes gerar --projeto <raiz>` sem `--gravar` imprime
   a tabela dos agentes (é a do cartão W8). Diferente do combinado → corrija o `agentes.json` e rode de novo.
3. Com o "ok" do cartão W8, o mesmo comando com `--gravar`: `.kiro/agents/sa-<nome>.json` e `.opencode/agents/sa-<nome>.md`
   conforme os alvos, os agentes de toolkit e as regras ELM quando `elm` não é `false`. Mostre os avisos.
   O Kiro pede confirmação para cada arquivo em `.kiro/agents/`: avise antes.

## Saída

Gravado → passo `backlog`. O gerador recusou (override ou caminho inválido) → passo `toolkits`, com o motivo.

## Pare se

- Nunca edite os agentes à mão.
