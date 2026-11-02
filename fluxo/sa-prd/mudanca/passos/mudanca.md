---
{"resumo": "PRD aprovado só muda por pedido explícito: antes do fatiamento, na mesma [ESP], com versão nova só se já subiu ao ELM; depois, só a versão de correção (escopo novo → sa-triar); Fase em-revisao (de: aprovado|fatiado), conceitos alterados em draft e o GATE de novo."}
---
## Entrada

Épico com o PRD aprovado na base, na Fase `aprovado` (com a `[ESP]` aberta) ou `fatiado`, e um pedido explícito de
mudança no PRD.

## Faça

O PRD aprovado só muda por um pedido explícito. A versão sai da Fase do `status.md` do épico na base:

- **`aprovado` (antes do fatiamento)** — a mudança segue na mesma `[ESP]`. Versão nova só se o PRD já subiu ao ELM
  (publicação `na-aprovacao` feita: conceitos de `elm/` com `resource`): versão de correção (sobe o número depois do
  ponto: `1.1`, `2.1`…) ou, na mudança de escopo, sobe o de antes do ponto (`2.0`).
  Sem nada publicado, a versão segue `1.0` e o PRD é reescrito no lugar; a publicação, quando vier, sobe o estado
  aprovado.
- **`fatiado` (depois do fatiamento)** — só a correção do que o PRD já tem (cenário errado ou que falta numa
  história existente, valor de regra), na versão de correção (sobe o número depois do ponto: `1.1`, `2.1`…), por
  pedido explícito: da pessoa, da ATA (`sa-especificar.reuniao`), do drift (`sa-consolidar`), da `sa-verificar`, do
  `sa-plano` ou de completar a fatia (`sa-especificar.fatia`). Escopo novo (história,
  regra ou ator que o PRD não tem) → o PRD não muda: épico ou fatia nova pela `sa-triar` (`origem EP-<nn>`).

Registre no rodapé (versão, quando há, data e o que mudou), Fase `em-revisao (de: aprovado|fatiado)`, com a Fase
de antes, enquanto o que mudou é revisto (o GATE lê o `de:`), e repita o GATE. Conceito alterado: `status: draft`, `generated.at` novo; no GATE, um `verified` novo é acrescentado à
lista. A publicação atualiza os mesmos artefatos (pelo `resource`/`id` de cada conceito). Fatias já entregues
(`pronta` ou `concluida`) que dependem do que mudou → avise e proponha fatias novas; não as altere.

Artefato novo que a mudança trouxer passa antes pelo passo `sa-prd.prd.similares`; a escrita segue as regras do passo
`sa-prd.prd.escrever`.

## Saída

- O que mudou é revisto pelo passo `sa-prd.prd.revisao` e aprovado pelo passo `sa-prd.prd.gate`, no caminho
  "mudança depois de aprovado".
- PRD ainda na pasta de trabalho (sem o GATE, ou `aprovado` sem ir à base) → não é mudança: "use
  `sa-especificar EP-<nn>`" (a sessão da `[ESP]` segue no `sa-prd.prd`, ou leva o PRD para a base antes).
- `fatiado` com escopo novo → "use `sa-triar` com origem EP-<nn>" (agente `sa-produto`).

## Pare se

- Sem pedido explícito de mudança → o PRD aprovado não muda: pare.
- PRD na pasta de trabalho, ou `fatiado` com escopo novo → diga a próxima e pare.
