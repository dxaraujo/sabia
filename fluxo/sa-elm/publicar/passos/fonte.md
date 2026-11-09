---
{"resumo": "Junta a fonte: os arquivos aprovados de elm/, a ET as-built do design.md e os artefatos afetados da ficha."}
---
## Entrada

A fatia (`ft-<nnn>-<slug>`).

## Faça

1. A pasta `elm/` da spec da fatia: `openspec/changes/archive/<AAAA-MM-DD>-ft-<nnn>-<slug>/elm/` ou
   `.kiro/specs/ft-<nnn>-<slug>/elm/`, um arquivo inteiro por artefato (HF, UC, REG, MSG, EL, GL), cada um
   com `status: stable` e o `verified` de quem tem `especificador`. Sem a aprovação → fora da prévia, listado como
   pendente.
2. Arquivo com `publicado: manual` no frontmatter → fora da prévia, conta como publicado.
3. Onde a seção ELM do `sabia.md` diz `ET as-built: sim`, a ET sai das seções Components and Interfaces · Data
   Models · Decisões técnicas do `design.md` da spec (OpenSpec: Decisions).
4. A ação (`inclui` · `altera` · `exclui`) e a versão de referência de cada artefato vêm dos artefatos afetados da ficha
   (`.sabia/planejamento/fatias/FT-<nnn>-<slug>.md`).

## Saída

A lista de artefatos a publicar → passo `conferir-versao`.

## Pare se

- Pasta `elm/` vazia e sem ET → nada a publicar: grave `Publicação: publicada <data>` só se havia o que
  publicar; senão devolva.
