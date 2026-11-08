---
{"resumo": "Acha ou cria <spec>/ft-<nnn>-<slug>/elm/ pelo formato_spec e diz, na retomada, onde cada arquivo está."}
---
## Entrada

O `formato_spec` do `agentes.json` e o `<nnn>` e o `<slug>` da ficha, em minúsculas.

## Faça

1. **Caminho.** `formato_spec` = `kiro` → `.kiro/specs/ft-<nnn>-<slug>/elm/`; `openspec` →
   `openspec/changes/ft-<nnn>-<slug>/elm/`. Fatia `concluida` no OpenSpec: a pasta arquivada,
   `openspec/changes/archive/<AAAA-MM-DD>-ft-<nnn>-<slug>/elm/`.
2. **Criar.** A pasta da spec ainda não existe → ela nasce aqui só com `elm/`; a `sa-desenvolver.iniciar` a
   reaproveita depois.
3. **Retomada.** Para cada linha dos artefatos afetados com inclui, altera ou exclui, diga onde o arquivo está: sem arquivo ou sem
   commit de base → passo `baixar`; editado sem a linha Aprovado → passo `conferir` antes de aprovar; aprovado →
   nada a fazer.

## Saída

A pasta existente e a situação de cada arquivo → passo `trava`. Fatia `concluida` com `Publicação: pendente` →
passo `conferir`, só para o artefato que a publicação pulou.

## Pare se

- `formato_spec` ausente no `agentes.json` → "configure o formato da spec pela `sa-setup.configurar`" e pare.
