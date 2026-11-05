---
{"resumo": "Log de loop com fatias não finalizadas: mostra o estado e pergunta se retoma, cada fatia da fase registrada no status.md dela."}
---
## Entrada

Os logs `.sabia/local/loop-*.md`.

## Faça

Existe `.sabia/local/loop-*.md` com fatias não finalizadas → mostre o estado (fatia, fase, rodada, último resultado)
e pergunte se retoma. Retomar = continuar cada fatia da fase registrada no `status.md` dela, por esta tabela:

| Fase do `status.md` | Fase do lote |
|---|---|
| `pesquisando` | 1 |
| `planejando` sem `analise-plano-*.md` | 2 |
| `planejando` com o último `analise-plano-<N>.md` em `ANALISE: AJUSTAR` | 3 (correção e nova análise) |
| `planejando` com `ANALISE: OK` | 4 |
| `planejando` com ajuste pedido no GATE (Achados abertos, origem `GATE do plano`) | `sa-plano.plano` (passo `sa-plano.plano.escrever`), nova análise e 4 |
| `aguardando-aprovacao-plano` | fica parada (a `[APR]` é do Dev Sênior) |
| `implementando` · `retrabalho (de: …)` | 5 |
| `revisando` | 6 |
| `verificando` | 7 |
| `verificada` | 8 |
| `bloqueada (de: …)` | mostre o motivo e a pergunta; respondida → `Bloqueio: —`, a fase de origem e a linha dela |

## Saída

Retoma → passo `fases`, cada fatia da fase dela. Sem log com fatias não finalizadas, ou não retoma → passo `lote`.

## Pare se

—
