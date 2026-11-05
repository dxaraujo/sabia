---
{"resumo": "Acordos do time (acordos.md): cadência Scrumban, WIP, DoR e DoD, tamanho, horas por tamanho, limites da especificação, reserva e cadência de horas; depois deles, grava a equipe."}
---
## Entrada

A equipe confirmada (passo `equipe`), ainda não gravada.

## Faça

**Acordos** (`acordos.md`) — proponha e ajuste:
- cadência **Scrumban**: sprints de N semanas (planejamento, review, retrospectiva, virada) com fluxo puxado e
  WIP limitado dentro da sprint; pergunte só a duração (padrão 2 semanas);
- **WIP:** uma fatia por sessão de agente; fatias esperando pessoa (`aguardando-aprovacao-plano`, `pr-aberto`,
  `em-revisao`, `em-verificacao`, `aceita`, `verificada`, `aguardando-aprovacao-pr`) ≤ capacidade de revisão
  (ex.: 2 por revisor); PR parado há mais de 1 dia → recomendar destravá-lo
  antes de começar fatia nova (seguir mesmo assim fica registrado: `WIP excedido`);
- **Definition of Ready** e **Definition of Done** (padrão no `arquivos.md`);
- tamanho: `P`/`M`/`G` — só para a Definition of Ready e para saber quando dividir (maior que G → dividir);
  pontos por tamanho, só se o time os quiser no EWM;
- **horas por tamanho** (linha `Horas por tamanho`): as horas de cada papel — `[DEV]`, `[REV]`, `[VER]` — em `P`, `M`
  e `G`, perguntadas ao time (sem padrão: o número é dele); são a estimativa das tarefas de papel da fatia na
  publicação ([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §4), ajustável
  por fatia na proposta (passo `sa-planejamento.sprint.proposta`);
- **especificação** (linha `Especificação`, lida no passo `sa-prd.prd.escrever`): o limite do épico (padrão até
  **8 histórias**, toda história conta, inclusive as desdobradas de outra, e um objetivo de negócio; passou →
  propor dividir em dois épicos);
- **reserva (Sustentação + retrabalho)** (padrão **20% das horas da sprint do time**) — cobre a
  **Sustentação** sem mudança no repositório (toda categoria: `[ATD]`, `[IMPL]`…; a Manutenção não: as fatias
  dela entram pela vazão, como as de épico) e o **retrabalho da sprint anterior** (o que falta das fatias
  migradas); e a **cadência de lançamento de horas** (padrão: ao fechar cada sessão; lançar ≠ concluir; na `[GB]`,
  só o SM lança, e o P.O. nunca — nem quando é também o SM).

## Saída

`acordos.md` com "ok" → commit `planejamento: acordos`; grave a equipe, como no passo `equipe` (agora com `duracao-sprint-semanas`), e siga para o
passo `roadmap`.

## Pare se

Sem condição de parada própria: sem o "ok" da pessoa, nada é gravado (regra de ouro).
