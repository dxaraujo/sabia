---
{"resumo": "OpenSpec: openspec archive ft-<nnn>-<slug> --yes (sem ELM) ou --skip-specs --yes (com ELM), na branch base atualizada; Kiro: nada se move."}
---
## Entrada

A fatia ou o bug `concluida`, o `formato_spec` e a chave `elm` do `agentes.json`, e a pasta da spec na branch base.

## Faça

1. **Nada a arquivar.** Sem pasta da spec (trilha trivial) ou sem delta → passo `devolver`.
2. **Já feito.** Spec já em `openspec/changes/archive/`, ou com a linha Publicação no `status.md` → passo `publicar`.
3. **Kiro.** A pasta fica em `.kiro/specs/ft-<nnn>-<slug>/`, que é o vigente; nada se move → passo `publicar`.
4. **OpenSpec.** Pelo commit direto na branch base (passo `gravar`), com o comando no lugar do Escrever dela, depois do
   pull:
   - sem ELM: `openspec archive ft-<nnn>-<slug> --yes`, que funde o delta na especificação vigente (`openspec/specs/`);
   - com ELM: `openspec archive ft-<nnn>-<slug> --skip-specs --yes`, porque a especificação vigente é o DOORS.

   Commit `FT-nnn archive`.

## Saída

OpenSpec arquivado → passo `gravar`. Kiro ou já arquivado → passo `publicar`. Nada a arquivar → passo `devolver`.

## Pare se

- O comando `openspec archive` falhou → mostre a mensagem e pare, sem commit; a branch base fica como estava.
