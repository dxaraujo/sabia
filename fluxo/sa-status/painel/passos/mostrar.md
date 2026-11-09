---
{"resumo": "Mostra o painel na ordem fixa, com a contagem das pendências, e oferece seguir com a sugestão."}
---
## Entrada

A coleta, as métricas, as seções e a sugestão.

## Faça

Chame a `sa-status.pendencias` para a contagem. Mostre, nesta ordem, só as seções com conteúdo:
cabeçalho (projeto · `<AAAA>/Sprint <nn>` · dias restantes · meta) · métricas · urgente · em andamento (Item ·
Título · Fase · Autonomia · Tarefas · MR · Idade · Retomar) · esperando pessoa · retrabalho · topo puxável ·
refinamento e produto · Sustentação e reserva de capacidade · fila de triagem · publicação pendente · trava de artefato · pendências
(a contagem) · fim do ciclo · sugestão. Termine com "seguir com a sugestão?".

## Saída

Sim → a skill da sugestão, na mesma sessão. Sem o sim → o fluxo termina.

## Pare se

Sem condição própria.
