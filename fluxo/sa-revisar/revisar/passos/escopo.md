---
{"resumo": "Escolhe a rubrica (L ou C) no padrão, lê a rubrica inteira e depois a entrada dela: a pasta da spec pelo formato, a ficha, o diff e o MR, o sabia.md (Projeto, Comandos e Regras aprendidas)."}
---
## Entrada

O pedido de quem chamou: a rubrica, o item `FT-nnn` e a parte do plano (L) ou o diff (C).

## Faça

1. Leia inteira a rubrica do pedido, no padrão `sa-revisar/rubricas.md`, com os itens de rubrica do toolkit que o
   seu prompt traz. As Regras aprendidas do `.sabia/sabia.md` entram como itens da rubrica.
2. Leia a entrada da rubrica. A pasta da spec sai do `formato_spec` do `agentes.json`: `.kiro/specs/ft-<nnn>-<slug>/`
   (Kiro) ou `openspec/changes/ft-<nnn>-<slug>/` (OpenSpec).

| Rubrica | Entrada |
|---|---|
| L | Kiro: `requirements.md` (no bug, `bugfix.md`), `design.md` e `tasks.md`. OpenSpec: `proposal.md`, o delta `specs/<cap>/spec.md`, `tasks.md` e, no completo, `design.md`. Nos dois: `research.md`, a ficha `.sabia/planejamento/fatias/FT-<nnn>-<slug>.md` (Regras, Cenários CT-nn, Não muda, artefatos afetados, Decisões), o `prd.md` do épico na fatia com pai e, com ELM, os arquivos aprovados de `elm/` da pasta da spec |
| C | `git diff origin/<base>...HEAD` (no autopilot, `cd .sabia/local/wt/<id> && git diff origin/<base>...HEAD`; no apoio ao `sa-revisar.mr`, `git diff origin/<base>...origin/<id>`), a mesma pasta da spec e a ficha. Com o MR aberto, os campos O quê · Porquê · Prova · Risco · Foco · Artefatos afetados. Na trivial, só o diff, a ficha e o MR |

3. Sempre: o `.sabia/sabia.md` (Projeto e Comandos). O delta já traz o texto completo dos requisitos
   tocados: não leia o ELM.

## Saída

A rubrica e a entrada dela lidas → passo `ci`.

## Pare se

- A pasta da spec não existe numa rota rápida ou completo (rubrica L) → devolva "nada a revisar: o plano é da
  `sa-plano.plano`" e pare.
