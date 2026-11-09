---
{"resumo": "Só rápida e completo: pasta da spec pelo formato_spec, status.md pelo padrão e, no Kiro, o .config.kiro."}
---
## Entrada

A trilha, a autonomia, o `formato_spec` do `agentes.json`, o tipo da linha (fatia ou bug) e a branch (ou a worktree).

## Faça

Trilha `trivial`, ou volta da virada (a pasta e o `status.md` já estão na branch) → nada a fazer; siga.

1. **Pasta**: `.kiro/specs/ft-<nnn>-<slug>/` no Kiro; `openspec/changes/ft-<nnn>-<slug>/` no OpenSpec (`<nnn>` e
   `<slug>` da ficha, em minúsculas). Já existe na branch base (o `elm/` nasceu no refinamento) → reaproveite.
2. **`status.md`** pelo padrão `sa-desenvolver/status.md`: Trilha, Autonomia, Fase `—` (fica assim até o plano ser
   aprovado), MR `—`, sem a linha Publicação, as seções Desvios, Em aberto e Lições aprendidas vazias e o Retomar `Feito:
   item assumido · Próximo: sa-plano.plano`.
3. **Só no Kiro**: `.config.kiro` pelo padrão `sa-plano/plano.md`, com `specId` = um UUID novo, `workflowType`
   `requirements-first` e `specType` `feature` (fatia) ou `bugfix` (bug).

## Saída

Pasta e `status.md` prontos na branch → passo `push`.

## Pare se

- A pasta existe na branch base com o `status.md` de outra branch → mostre e pare.
