---
{"resumo": "Equipe: pessoas, papéis, senioridade, horas (revisão, especificação), Sustentação e ausências; grava no formato detectado depois dos acordos."}
---
## Entrada

`<produto>/equipe.json` ou `equipe.md`, se existir.

## Faça

**Equipe** (`equipe.json` ou `equipe.md` existe → mostre e pergunte só o que mudou): nome do projeto, data de
início da sprint 1, pessoas (todas `ativo: true`; quem sai fica
`false`, nunca é apagado), papéis (um ou mais por
pessoa: `P.O.`, `Especificador`, `Dev`, `QA`, `SM`; exatamente um P.O. e um SM ativos — a mesma pessoa pode ter
os dois —; o SM é o dono da `[GB]`), **senioridade** de quem é Dev
(`Júnior`, `Pleno` ou `Sênior` — decide o modo das fatias da pessoa e quem revisa PR: Modo pela
senioridade, `sa-planejamento.sprint.modo`; arquivo existente com Dev sem ela → pergunte só isso, para cada um; nenhum Dev
Sênior ativo → avise: nenhum PR teria quem o revise), login do ELM, horas por
semana, ausências. Pergunte também, por pessoa, quantas horas por semana vão para **revisar** (planos, PRs) e
**verificar** — somadas em `horas-revisao-semana` —, para **especificar** (entrevista, PRD, fatiamento:
`horas-especificacao-semana`; P.O. e Especificador) e quem faz **Sustentação** (`atende`). Grave no formato
detectado — **só depois dos acordos (passo `acordos`)**, que dão `duracao-sprint-semanas` (antes deles o JSON não
valida), com `atualizado` = hoje, `historico: []` e `ausencias: []` em quem não tem; confirme que há
**exatamente um** P.O. e **exatamente um** SM ativos — (`equipe.json` → validado contra
`~/.sabia/framework/skills/sa-planejamento/assets/equipe.schema.json`; `equipe.md` → valide só pela presença
das colunas obrigatórias: Login, Papéis, Horas/semana e, para Dev, Senioridade). Se nenhum arquivo existir ainda, prefira `equipe.json`
(padrão com validação de schema); só use `equipe.md` se o time preferir edição direta em Markdown.

**equipe.md** (formato Markdown, alternativo): o formato é o padrão `sa-planejamento/equipe.md` (cabeçalho com
duração e início; tabelas
Pessoas — com `Ativo` —, Ausências e Histórico), que mapeia 1:1 para os campos do schema. Não valide contra
`equipe.schema.json` neste caso — valide pela presença das colunas obrigatórias (Login, Nome, Papéis,
Horas/semana e, para Dev, Senioridade).

## Saída

A equipe confirmada → passo `acordos`; a gravação dela vem com os acordos (passo `acordos`).

## Pare se

Sem condição de parada própria: sem o "ok" da pessoa, nada é gravado (regra de ouro).
