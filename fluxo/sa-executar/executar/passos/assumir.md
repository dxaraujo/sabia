---
{"resumo": "Na base, cria no EWM o IB e a tarefa que faltarem, assume a tarefa pela regra comum e marca em-andamento (e o responsável, se faltava)."}
---
## Entrada

O item registrado e na sprint aberta (passo `entrada`): a linha na `### <Categoria>` do `backlog.md` e a ficha,
lidas e gravadas na base (itens 1 e 5 do bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base)).

## Faça

1. **EWM**, com "sim": falta o IB do item (`elm` `pendente`) ou a tarefa → crie o que faltar
   ([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §6) e grave os ids na coluna `elm` do `backlog.md` e
   em "Tarefa ELM" da linha do `sprint-<nn>.md`. Depois assuma a tarefa pela seção Assumir de
   `sa-executar.executar.entrada` (item de Sustentação: de outra pessoa, pergunte e force com "sim").
2. **Base:** `em-andamento` no `status` do `backlog.md`, na Situação da linha do sprint e no `**Situação:**` da
   ficha; `responsavel` `—` → o login de quem assumiu no `responsavel` do `backlog.md`, no Responsável da linha do
   sprint e no `**Responsável:**` da ficha. Commit `<ID> iniciar` (assumir e concluir de uma vez, nesta sessão → um
   commit só, o `<ID> concluir`). Já `em-andamento` (retomada) → nada a gravar.

## Saída

Tarefa assumida e o item `em-andamento` na base → passo `registrar`.

## Pare se

- A seção Assumir manda parar (tarefa fechada sem o "sim" para reabrir) → a frase dela e pare.
