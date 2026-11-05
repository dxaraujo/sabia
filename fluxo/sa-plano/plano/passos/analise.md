---
{"resumo": "Análise independente do plano pelo sa-revisor (rubrica L, subagente), até 2 rodadas; commita o analise-plano-<N>.md com o status.md."}
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
- `ANALISE: AJUSTAR`: falta **do plano** → corrija e peça nova análise (até 2 rodadas); falta **do PRD ou da ficha** →
  passo `decisoes`.

## Saída

`ANALISE: OK` → passo `gate`. `ANALISE: AJUSTAR`: falta do plano → passo `escrever`; falta do PRD ou da ficha →
passo `decisoes`.

## Pare se

Sem subagente disponível (agente sem essa ferramenta)
→ pare e devolva a quem chamou: "plano pronto para análise".
