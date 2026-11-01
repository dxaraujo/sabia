---
{"resumo": "Divide, junta, cancela ou cria fatias, cancela o épico e reaplica a Definition of Ready, no backlog.md e na sprint, num commit, com o EWM acompanhando."}
---
## Entrada

"Refinar o backlog", "a FT-033 está grande demais", "faltou uma fatia", "cancelar o EP-05" — fatia de Manutenção é da
`sa-triar`.

## Faça

Cada mudança vai ao `backlog.md` e, com a fatia numa sprint, à linha dela no `sprint-<nn>.md`, no mesmo
commit, pelas [Situações](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#situações). Épico na Fase `aprovado` com fatias já no backlog (o PRD
mudou depois do fatiamento) → o GATE do refinamento grava `Fase: fatiado` no `status.md` do épico, no mesmo commit.
Fatias novas ou alteradas seguem os critérios de boa fatia do passo `sa-fatiar.fatiar.rascunho`, e o GATE do
refinamento é o do passo `sa-fatiar.fatiar.perguntar`.

- **Dividir:** a original fica `dividida`, com `obs` `substituida-por FT-x, FT-y`; as novas entram no fim de
  `## Fatias`, `nova`, com `obs` `desmembrada de FT-<nnn>`, a `origem` e a `prioridade` dela, a cobertura repartida,
  as dependências e uma ficha cada. No EWM:
  [elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §3, "Fatia dividida".
- **Juntar:** só entre fatias não iniciadas (`nova`, `elegivel`, `planejada`); a absorvida fica `cancelada`, com `obs`
  `substituida-por FT-<a que fica>`, e a que fica herda a cobertura dela.
- **Cancelar** uma fatia não iniciada: `cancelada`, com o motivo na `obs`. Era a última não terminal de um épico com
  fatia `concluida` → no mesmo commit, o épico `concluido` no backlog, Fase `concluido` no `status.md` do épico e o
  IB do épico concluído (como no passo `sa-consolidar.consolidar.fechar`).
- **No EWM**, a fatia `cancelada` (inclusive a absorvida pelo juntar) tem o IB (e, se não foi iniciada, as tarefas)
  cancelado: `elm_transicao(<id>, "cancelar")`, um por id, com "sim". Na falha (sem o MCP, `precondicao`, erro) →
  `ELM pendente [FT-<nnn> cancelar]` no rodapé da ficha da fatia, onde moram as pendências da fatia não iniciada,
  `dividida` ou `cancelada`.
- **Dividir ou cancelar depois de `iniciada`** (juntar, nunca): conclua as tarefas abertas da fatia com as horas já
  lançadas (`elm_transicao(<id>, "concluir")`, com "sim"; sem o MCP, `ELM pendente` no rodapé da ficha) e avise o Dev
  para fechar o PR.
- **Cancelar o épico** (decisão do P.O.), numa gravação: `Fase: cancelado` no `status.md` do épico (se já está na
  base); no backlog, o épico `cancelado` (motivo na `obs`) e as fatias não iniciadas `cancelada`; na sprint, a linha
  da Especificação não concluída `cancelada`; a `[ESP]` aberta conclui com as horas já lançadas, e o IB do épico
  cancela como o das fatias (na falha, `ELM pendente [EP-<nn> cancelar]`, onde moram as do épico —
  [pendências](~/.sabia/framework/skills/sabia/references/elm.md#pendências)). As fatias `iniciada` em diante não mudam aqui: mostre-as ao
  P.O. (cancelar uma iniciada é o item acima).
- **Nova fatia:** no fim de `## Fatias`, como no passo `sa-fatiar.fatiar.gravar` (a linha no `backlog.md` e o IB no backlog do EWM, como lá).
- **Fatia nova com cenário novo** exige PRD alterado antes (`sa-prd.mudanca`).
- **Definition of Ready** ([critérios](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#definition-of-ready-o-que-faz-uma-fatia-elegivel)): a
  cada refinamento, grave `elegivel` nas `nova` que passam; a `elegivel` ou `planejada` que deixou de passar volta a
  `nova` com `falta:` — a `planejada` sai da sprint pela [Volta](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#situações) (no EWM, o IB e as
  tarefas voltam ao backlog, o IB no estado inicial: [elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §3).

## Saída

O refinamento gravado na base, num commit → os próximos passos do passo `sa-fatiar.fatiar.proximos`.

## Pare se

- Fatia de Manutenção → é da `sa-triar`: diga isso e pare.
- Fatia nova com cenário novo sem o PRD alterado → `sa-prd.mudanca` antes; pare.
- Fatia `pronta` ou `concluida` → nunca é alterada (Regras): mudança de comportamento entregue = fatia nova.
