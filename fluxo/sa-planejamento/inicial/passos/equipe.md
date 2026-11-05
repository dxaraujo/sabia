---
{"resumo": "Equipe: pessoas, papéis, senioridade, horas (revisão, especificação), Sustentação e ausências; grava o equipe.json depois dos acordos."}
---
## Entrada

`<produto>/equipe.json`, se existir.

## Faça

**Equipe** (`equipe.json` existe → mostre e pergunte só o que mudou): nome do projeto, data de
início da sprint 1, pessoas (todas `ativo: true`; quem sai fica
`false`, nunca é apagado), papéis (um ou mais por
pessoa: `P.O.`, `Especificador`, `Dev`, `QA`, `SM`; exatamente um P.O. e um SM ativos — a mesma pessoa pode ter
os dois —; o SM é o dono da `[GB]`), **senioridade** de quem é Dev
(`Júnior`, `Pleno` ou `Sênior` — decide o modo das fatias da pessoa e quem revisa PR: Modo pela
senioridade, `sa-planejamento.sprint.modo`; arquivo existente com Dev sem ela → pergunte só isso, para cada um; nenhum Dev
Sênior ativo → avise: nenhum PR teria quem o revise), login do ELM, horas por
semana, ausências. Pergunte também, por pessoa, quantas horas por semana vão para **revisar** (planos, PRs) e
**verificar** — somadas em `horas-revisao-semana` —, para **especificar** (entrevista, PRD, especificação de fatia:
`horas-especificacao-semana`; P.O. e Especificador) e quem faz **Sustentação** (`atende`). Grave o `equipe.json`
(commit `planejamento: equipe`) — **só depois dos acordos (passo `acordos`)**, que dão `duracao-sprint-semanas` (antes deles o JSON não
valida), com `atualizado` = hoje, `historico: []` e `ausencias: []` em quem não tem; confirme que há
**exatamente um** P.O. e **exatamente um** SM ativos — e valide contra
`~/.sabia/framework/skills/sa-planejamento/assets/equipe.schema.json` (formato:
[arquivos.md](~/.sabia/framework/skills/sa-planejamento/references/arquivos.md#equipejson)).

## Saída

A equipe confirmada → passo `acordos`; a gravação dela vem com os acordos (passo `acordos`).

## Pare se

Sem condição de parada própria: sem o "ok" da pessoa, nada é gravado (regra de ouro).
