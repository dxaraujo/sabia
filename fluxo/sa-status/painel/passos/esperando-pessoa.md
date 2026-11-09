---
{"resumo": "MRs esperando revisão ou merge, Em aberto que bloqueia e documentos sem Aprovado."}
---
## Entrada

MRs, `status.md`, pitch, PRD, fichas e `elm/`.

## Faça

- MR esperando revisão → qualquer desenvolvedor ≠ autor, com o dono por área pelo CODEOWNERS (`sa-revisar.mr`).
- MR aprovado com CI verde → o autor faz o merge (`sa-desenvolver.encerrar`).
- Em aberto do `status.md` que bloqueia → quem tem `produto` responde, nas Decisões da ficha.
- Documento sem `Aprovado: <usuário> · <data>` no topo: `pitch.md` esperando decisão de investimento (`sa-refinar.moldar`), `prd.md`
  (`sa-prd.prd`) e ficha (`sa-refinar.detalhar`) → quem tem `produto`.
- Arquivo de `elm/` sem aprovação → quem tem `especificador` (`sa-refinar.detalhar`).

## Saída

Esperando pessoa → passo `retrabalho`.

## Pare se

Sem condição própria.
