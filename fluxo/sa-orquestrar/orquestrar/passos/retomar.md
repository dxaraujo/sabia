---
{"resumo": "Log de loop com fatias não finalizadas: mostra o estado e pergunta se retoma, cada fatia da fase registrada no status.md dela."}
---
## Entrada

Os logs `.sabia/local/loop-*.md`.

## Faça

Existe `.sabia/local/loop-*.md` com fatias não finalizadas → mostre o estado (fatia, fase, rodada, último resultado)
e pergunte se retoma. Retomar = continuar cada fatia da fase registrada no `status.md` dela.

## Saída

Retoma → passo `fases`, cada fatia da fase dela. Sem log com fatias não finalizadas, ou não retoma → passo `lote`.

## Pare se

—
