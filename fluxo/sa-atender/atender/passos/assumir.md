---
{"resumo": "Na base, cria no EWM o IB e a [ATD] que faltarem, assume a [ATD] pela regra comum e marca em-andamento (e o responsável, se faltava)."}
---
## Entrada

O AT registrado e na sprint aberta (passo `entrada`): a linha na `### Atendimento` do `backlog.md` e o registro
`AT-<nnn>-<slug>.md`, lidos e gravados na base (itens 1 e 5 do bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base):
o registro é gravado ali durante todo o atendimento).

## Faça

1. **EWM**, com "sim": falta o IB `[AT-nnn]` (`elm` `pendente`: AT registrado sem o MCP `elm`) ou a `[ATD]` → antes,
   crie o que faltar ([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §6) e grave os ids na coluna `elm`
   do `backlog.md` e em "Tarefa ELM" da linha do AT no `sprint-<nn>.md`; a `[ATD]` nasce com `estimativa_h` = o
   `**Estimativa:**` do registro e `dono` = quem assume (§6). Sem o MCP `elm`: não crie; grave `ELM pendente [ATD
   AT-<nnn> criar]: criar a tarefa (elm-sprint.md §6)` (e `ELM pendente [IB AT-<nnn> criar]: criar o IB`, se faltar o
   IB) no `**ELM:**` do registro e `pendente` na Tarefa ELM da sprint, e siga (o ELM nunca trava). Depois assuma a
   `[ATD]` pela seção Assumir de `sa-atender.atender.entrada` (item de Sustentação: de outra pessoa, pergunte e force
   com "sim").
2. **Base:** `em-andamento` no `status` do `backlog.md`, na Situação da linha do sprint e no `**Situação:**` do
   registro; `responsavel` `—` → o login de quem assumiu no `responsavel` do `backlog.md`, no Responsável da linha
   do sprint e no `**Responsável:**` do registro. Pelos itens 3 e 4 do bloco Gravar na base — commit `AT-<nnn>
   iniciar`, antes de executar (atender e concluir de uma vez, nesta sessão → um commit só, o do passo
   `desdobramentos`). Já `em-andamento` (retomada) → nada a gravar.

## Saída

`[ATD]` assumida e o AT `em-andamento` na base → passo `executar`.

## Pare se

- A seção Assumir manda parar (tarefa fechada sem o "sim" para reabrir) → a frase dela e pare.
