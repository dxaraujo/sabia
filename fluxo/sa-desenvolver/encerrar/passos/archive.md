---
{"resumo": "Rápida e completo: sa-especificar.archive na branch base (archive e oferta de publicação); trivial não tem spec."}
---
## Entrada

O item concluído na branch base e a pasta da spec (`formato_spec` do `agentes.json`).

## Faça

1. Trivial (sem pasta da spec) → nada a arquivar; siga.
2. Rápida e completo: chame a `sa-especificar.archive` na branch base; ela volta para cá. Ela faz:
   - sem ELM: no OpenSpec, `openspec archive ft-<nnn>-<slug> --yes` funde o delta na especificação vigente; no Kiro, as specs
     em `.kiro/specs/` continuam sendo o vigente;
   - com ELM: no OpenSpec, `openspec archive ft-<nnn>-<slug> --skip-specs --yes`, e a pergunta "publicar no DOORS?".
     Quem tem `especificador` roda a `sa-elm.publicar`; sem a booleana, grava `Publicação: pendente` no `status.md`
     arquivado.

## Saída

Spec arquivada (ou nada a arquivar) → passo `worktree`.

## Pare se

Nunca: o archive avisa e devolve.
