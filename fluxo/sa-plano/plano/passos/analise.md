---
{"resumo": "Análise independente do plano pelo sa-revisor (rubrica L, subagente); na 2ª rodada em AJUSTAR, uma pessoa decide (HITL: achado a achado; AFK: GATE obrigatório do Dev Sênior); commita o analise-plano-<N>.md com o status.md."}
---
## Entrada

Os artefatos do plano (passo `escrever`).

## Faça

Incremente "revisão do plano" em Rodadas. Peça ao agente **`sa-revisor`** (subagente) a rubrica **L**
(o padrão `sa-revisar/rubricas.md`) — passe só a pasta da fatia e a
rodada; ele grava o `analise-plano-<N>.md`.
Assim que o relatório chegar (última linha `ANALISE: OK` ou `ANALISE: AJUSTAR`), commite-o **com o `status.md`** (Rodadas, Histórico) —
mensagem no padrão do `sabia.md`, `<FT> registrar análise do plano <N>`. O GATE e a implementação citam esse
arquivo; ele precisa estar na branch.
- `ANALISE: OK` → passo `gate`.
- `ANALISE: AJUSTAR`: falta **do plano** → corrija e peça nova análise; falta **do PRD ou da ficha** →
  passo `decisoes`.
- 2ª rodada seguida em `ANALISE: AJUSTAR` com falta do plano → não peça a 3ª: Histórico `análise AJUSTAR na rodada
  2` e uma pessoa decide. **HITL:** a pessoa decide achado a achado (o aceito vai ao GATE, no resumo 🧭; o que ela
  manda corrigir, corrija antes do GATE). **AFK:** o GATE de um Dev Sênior vira obrigatório (como o do Júnior, passo
  `gate`), com o `analise-plano-2.md` no resumo.

## Saída

`ANALISE: OK` → passo `gate`. `ANALISE: AJUSTAR`: falta do plano → passo `escrever`; falta do PRD ou da ficha →
passo `decisoes`; 2ª rodada em `AJUSTAR` com falta do plano → passo `gate`, com a decisão da pessoa (HITL) ou com
GATE (AFK).

## Pare se

—
