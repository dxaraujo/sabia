---
{"resumo": "WIP por status contra o limite, vazão, lead time médio e idade contra o SLE."}
---
## Entrada

A coleta e o `acordos.json`.

## Faça

Linha de topo:
- WIP por status contra o limite do `acordos.json` (`em-revisao` contado pelos MRs abertos);
- vazão do ciclo: itens de desenvolvimento com `concluida_em` nas datas da sprint, e atendimento à parte;
- lead time médio do ciclo: `concluida_em` − `iniciada_em`, em dias corridos;
- idade dos itens `em-andamento` (hoje − `iniciada_em`) contra o SLE, quando existe.

## Saída

As métricas → passo `urgente`. Chamado pela retrospectiva → devolva as métricas e a reserva de capacidade consumida a ela.

## Pare se

Sem condição própria.
