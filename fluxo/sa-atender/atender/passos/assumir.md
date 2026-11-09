---
{"resumo": "Assume o item num commit '<ID> iniciar' na branch base: em-andamento, responsável e iniciada_em no backlog, o Responsável no registro e a linha atendimento no sprint aberto; oferece o item no ELM."}
---
## Entrada

O item puxado (passo `puxar`) e o usuário da sessão.

## Faça

1. Fora do `equipe.json` → "peça a inclusão na equipe (`sa-planejamento.inicial`)" e pare: o responsável é um
   `usuario` da equipe.
2. Responsável de outra pessoa → mostre de quem é e só assuma com o "sim"; registre a troca na Atividade do registro.
3. Já `em-andamento` com a mesma pessoa (retomada) → nada a gravar; siga.
4. Grave pelo commit direto na branch base (passo `commit-na-branch-base`), num commit `<ID> iniciar`:
   - no `backlog.md`: status `em-andamento`, `responsável` = `usuario`, `iniciada_em` = hoje e a `obs` da reserva de capacidade,
     se houve;
   - no registro: o Responsável;
   - no `sprint-<nn>.md` aberto, se falta: a linha Item · `atendimento` · Responsável.
5. Com ELM configurado: "quer criar o item no ELM?" → `sa-elm.item` (IB e tarefa ATD; o id da tarefa vai na coluna
   Tarefas da linha do sprint). Qualquer resposta segue.

## Saída

O item `em-andamento` com a pessoa → passo `executar`.

## Pare se

- Fora do `equipe.json`, ou responsável de outra pessoa sem o "sim" → a frase do caso e pare.
- A gravação na branch base parou → mostre o que gravaria e pare.
