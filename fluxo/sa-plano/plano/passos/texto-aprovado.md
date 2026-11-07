---
{"resumo": "Confere a aprovação do texto: cada arquivo de elm/ com ELM, a ficha sem ELM; sem ela, Em aberto e para."}
---
## Entrada

A ficha e, com ELM, os arquivos de `elm/` dos artefatos do Cobre.

## Faça

1. Com ELM: cada artefato do Cobre tem o arquivo inteiro em `elm/` com `**Aprovado:** <usuario> · AAAA-MM-DD` no
   topo (aprovado por quem tem `especificador`).
2. Sem ELM: a ficha tem `Aprovado: <usuario> · <data>` no topo (de quem tem `produto`).
3. Falta aprovação → registre Em aberto no `status.md` (ao especificador, com ELM; ao P.O., na ficha), com
   `Bloqueia: MR`, e pare: o texto é do refinamento (`sa-refinar.detalhar`). No autopilot, devolve à pessoa.

## Saída

Texto aprovado → passo `pesquisa`.

## Pare se

- Falta a aprovação.
