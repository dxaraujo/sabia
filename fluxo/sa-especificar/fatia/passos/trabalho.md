---
{"resumo": "Completa a ficha pelos itens 1–3 do bloco Completar uma fatia nova, quando falta mais que a especificação; sem artefato afetado, segue à conclusão."}
---
## Entrada

A fatia com a `[ESP]` assumida (passo `assumir`), ou o achado da revisão P que é decisão de negócio (passo `revisao`).

## Faça

**Trabalho:** fatia `nova` com falta além de `especificação` → [Completar uma fatia `nova`](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#completar-uma-fatia-nova),
itens 1–3 (nunca pela `sa-fatiar`). Decisão em aberto (da ficha ou da revisão P) → **`sa-entrevistar`**, com a
pessoa.

Depois, a seção **Artefatos afetados** da ficha: alguma linha `inclui`, `altera` ou `exclui` → passo `artefatos`;
nenhuma (a linha "Nenhum artefato afetado…") → passo `concluir`.

## Saída

A ficha completa, com linha de artefato → passo `artefatos`; sem artefato afetado → passo `concluir`.

## Pare se

Nenhum caso próprio deste passo: valem as Regras do fluxo.
