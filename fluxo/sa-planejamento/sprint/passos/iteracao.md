---
{"resumo": "Pai e número da sprint, nome da iteração e do plano no EWM (nada criado antes do ok); a [GB] move para a primeira sprint do pai."}
---
## Entrada

A sprint anterior (o pai dela) e a meta (passo `meta`).

## Faça

**Iteração e número:** o **pai** é o da sprint anterior (a nova herda); pai novo só quando a pessoa diz, com o
nome que ela der (`2026`, `Entrega 3`…); primeira sprint do projeto → pergunte o nome. A `<nn>` é a próxima
dentro do pai (pai novo → `01`). Na virada (chamado pelo passo `sa-planejamento.retrospectiva.recalcular`), a
chave é a do `sprint-<nn>.md` que o passo `sa-planejamento.retrospectiva.fechar` criou: não pergunte o pai.
Proponha o nome da iteração no EWM (padrão `Sprint <nn>`; é livre: a chave da
sprint vem do número do arquivo) e o do plano
(`<nome> - <nome curto da meta>`: `Sprint 01 - Exportar o relatório de contas`); nada é criado no EWM antes do
"ok" — a iteração, o pai que faltar e o plano nascem na publicação (passo `gravar`;
[elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §1), com as datas da sprint. A iteração é o `plannedFor` de
todos os IBs e tarefas desta sprint — os IBs que estão no backlog do EWM só mudam de iteração (§3), e a tarefa que
ficou lá (o item saiu de uma sprint sem começar) move com o dono e a estimativa do papel dela: só nasce o papel que
falta (elm-sprint.md, topo). A `[GB]`, que nasceu no backlog (`sa-planejamento.inicial.base-ewm`), move para a primeira sprint
do pai; pai novo → nasce a `[GB]` dele, e a antiga conclui (§2).

## Saída

A chave, o nome da iteração e o do plano → passo `proposta`.

## Pare se

Sem condição de parada própria: nada é criado no EWM antes do "ok".
