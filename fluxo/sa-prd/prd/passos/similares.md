---
{"resumo": "Antes de criar qualquer arquivo em elm/: busca similares no ELM para cada artefato proposto e registra a decisão da pessoa (reutilizar, alterar, criar novo)."}
---
## Entrada

O `decisoes.md` da entrevista e a lista dos artefatos que o PRD vai propor. Obrigatório, antes de criar qualquer
arquivo em `elm/`.

## Faça

Projeto com ELM: liste os artefatos que o PRD vai propor (tipo, título provisório, palavras-chave da entrevista e
do glossário) e rode [similares](~/.sabia/framework/skills/sa-prd/references/similares.md). Mostre a tabela à pessoa e peça
uma decisão por artefato com acerto:

| Relação encontrada | Decisões possíveis (recomendada primeiro) |
|---|---|
| igual | **reutilizar** o existente (não cria conceito) · criar novo só com o motivo da diferença registrado |
| sobrepõe | **alterar** o existente (caminho "Alteração" do passo `escrever`) · criar novo com o motivo registrado |
| relacionado | **criar novo**, citando o existente em `## Relações` |
| nenhum | criar novo |

Registre cada decisão no `decisoes.md` (`D-nn`: artefato, id do ELM encontrado, relação, decisão, motivo) e, na
tabela de artefatos do PRD, a coluna **No ELM**: `reusa <id>` · `altera <id>` · `novo (verificado <AAAA-MM-DD>)`.
Verificação ao vivo pendente (sem o MCP `elm`) → `novo (só bundle <data>)`: a publicação refaz a busca.
Artefato que surgir depois (na escrita, na revisão ou numa mudança depois de aprovado) passa por aqui antes de
virar arquivo. Projeto sem ELM → pule.

## Saída

Uma decisão registrada por artefato com acerto (ou o passo pulado, sem ELM) → passo `escrever`.

## Pare se

Nenhuma condição própria deste passo: projeto sem ELM pula o passo (acima).
