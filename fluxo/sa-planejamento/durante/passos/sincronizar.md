---
{"resumo": "Sincronizar com o EWM (§9): traz as tarefas por fora, compara os itens conhecidos e mostra uma tabela com a solução proposta, ou a linha iguais."}
---
## Entrada

"sincroniza a sprint", "sincronizar com o EWM"; o painel da `sa-status` avisa quando há
tarefa por fora, divergência ou id `a conferir`.

## Faça

**Sincronizar com o EWM** — **leva o Sabiá até onde o trabalho chegou**: acabados os tokens, o time segue no
desenvolvimento tradicional (código, PR, merge, tarefas no EWM), e a sincronização põe os arquivos e o EWM em dia.
Rode o §9 do [elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md), passos 1 a 6,
nesta ordem (a rede de proteção inclusa). Sem o MCP `elm` → a linha `🔄 <chave> × EWM: sincronização com o EWM não feita (sem o MCP elm) — só as linhas Git e arquivos` (elm-sprint.md §9).

## Saída

A tabela aplicada, ou a linha `🔄 <chave> × EWM: iguais — <n> itens conferidos`. Linhas `encaixe` → passo
`encaixe`, uma a uma; nenhuma → o fluxo termina.

## Pare se

Sem condição de parada própria: as linhas que mudam o escopo, sem o "sim" do **P.O.**, ficam `manter` nesta rodada.
