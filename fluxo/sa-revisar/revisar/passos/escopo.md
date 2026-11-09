---
{"resumo": "Escolhe os critérios de revisão (L ou C) no template, lê os critérios de revisão inteiros e depois a entrada dela: a pasta da spec pelo formato, a ficha, o diff e o MR, o sabia.md (Projeto, Comandos e Regras aprendidas)."}
---
## Entrada

O pedido de quem chamou: os critérios de revisão, o item `FT-nnn` e a parte do plano (L) ou o diff (C).

## Faça

1. Leia inteira os critérios de revisão do pedido, no template `sa-revisar/criterios-revisao.md`, com os itens de critério de revisão do toolkit que o
   seu prompt traz. As Regras aprendidas do `.sabia/sabia.md` entram como itens dos critérios de revisão.
2. Leia a entrada dos critérios de revisão. A pasta da spec sai do `formato_spec` do `agentes.json`: `.kiro/specs/ft-<nnn>-<slug>/`
   (Kiro) ou `openspec/changes/ft-<nnn>-<slug>/` (OpenSpec).

| Critérios de revisão | Entrada |
|---|---|
| L | Kiro: `requirements.md` (no bug, `bugfix.md`), `design.md` e `tasks.md`. OpenSpec: `proposal.md`, o delta `specs/<cap>/spec.md`, `tasks.md` e, no completo, `design.md`. Nos dois: `research.md`, a ficha `.sabia/planejamento/fatias/FT-<nnn>-<slug>.md` (Regras, Cenários CT-nn, Não muda, artefatos afetados, Decisões), o `prd.md` do épico na fatia com pai e, com ELM, os arquivos aprovados de `elm/` da pasta da spec |
| C | `git diff origin/<branch_base>...HEAD` (no autopilot, `cd .sabia/local/wt/<id> && git diff origin/<branch_base>...HEAD`; no apoio ao `sa-revisar.mr`, `git diff origin/<branch_base>...origin/<id>`), a mesma pasta da spec e a ficha. Com o MR aberto, os campos O quê · Porquê · Evidência · Risco · Foco · Artefatos afetados. Na trivial, só o diff, a ficha e o MR |

3. Sempre: o `.sabia/sabia.md` (Projeto e Comandos). O delta já traz o texto completo dos requisitos
   tocados: não leia o ELM.

## Saída

Os critérios de revisão e a entrada dela lidas → passo `ci`.

## Pare se

- A pasta da spec não existe numa trilha rápida ou completo (critérios de revisão L) → devolva "nada a revisar: o plano é da
  `sa-plano.plano`" e pare.
