---
{"resumo": "WIP por status contra o limite, vazão, lead time médio e idade contra o SLE."}
---
## Entrada

A coleta e o `acordos.json`.

## Faça

Linha de topo:
- WIP por status contra o limite do `acordos.json` (`em-revisao` contado pelos MRs abertos);
- vazão do ciclo: linhas de desenvolvimento com `concluida_em` nas datas da sprint, e atendimento à parte;
- lead time médio do ciclo, em dias corridos: o do item (do primeiro `iniciada_em` das linhas do trabalho principal dele
  — fatia e bug: desenvolvimento; sustentação: atendimento; épico: especificação — até o `concluida_em` do `backlog.md`)
  e o de cada trabalho (`concluida_em` − `iniciada_em` da linha), especificação e desenvolvimento à parte;
- idade dos itens `em-andamento` (hoje − o primeiro `iniciada_em` do trabalho principal) contra o SLE, quando existe.

## Saída

As métricas → passo `urgente`. Chamado pela retrospectiva → devolva as métricas e a reserva de capacidade consumida a ela.

## Pare se

Sem condição própria.
