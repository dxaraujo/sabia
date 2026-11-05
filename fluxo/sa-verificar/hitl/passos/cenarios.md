---
{"resumo": "Rodada de verificação da [VER] (Rodadas +1), os cenários pelo fluxo verificar (passos roteiro a resultado) e o Drift de negócio no status.md."}
---
## Entrada

A `[VER]` assumida (passo `assumir`), na branch do PR, com `fase: em-verificacao`.

## Faça

1. Incremente "verificação" em Rodadas — a rodada é sua.
2. Cenários pelo fluxo `verificar` (passos `sa-verificar.verificar.roteiro`, `sa-verificar.verificar.ambiente`,
   `sa-verificar.verificar.executar`, `sa-verificar.verificar.casos` e `sa-verificar.verificar.resultado`): a fase
   continua `em-verificacao`, e o bloco `🔎 Verificação` fica no fim do `verificacao.md`.
3. Possível alteração indicada no bloco → grave-a no campo **Drift de negócio** do `status.md` (só sobe de `não` para
   `possível alteração`; sobre um campo já decidido, o padrão `sa-desenvolver/status.md`) — é a indicação do agente;
   a decisão é do passo `decisao`.

## Saída

O bloco `🔎 Verificação` no `verificacao.md` e o Drift de negócio no `status.md` → passo `decisao`. O verificar parou
com a fatia `bloqueada (de: em-verificacao)` (`VERIFICACAO: AMBIENTE`, a DDL não aplicada, ou cenário errado na ficha
sem épico) → passo `entrega`, sem a decisão.

## Pare se

—
