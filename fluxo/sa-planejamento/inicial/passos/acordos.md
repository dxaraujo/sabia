---
{"resumo": "Propõe o acordos.md (timebox, WIP, SLE, DoD, classes de serviço, folga, tamanhos, disjuntor, id no commit, CT no teste) e grava com a equipe."}
---
## Entrada

O `acordos.md` atual, se existe, e a equipe proposta (passo `equipe`).

## Faça

Proponha `.sabia/planejamento/acordos.md` pelo padrão `sa-planejamento/acordos.md`: a tabela `Item | Acordo`, com as
chaves nesta ordem e estes padrões quando o time não diz outro valor:

- **Timebox**: `<n> semanas` (padrão 2).
- **WIP**: `<status>: <n>`, com status de fatia e bug (`aceita` · `pronta` · `em-andamento` · `em-revisao`); padrão
  `em-andamento` e `em-revisao`.
- **SLE** (opcional): `<p>% em até <n> dias`.
- **DoD**: CI verde · 1 aprovação de desenvolvedor ≠ autor · Prova no MR · Artefatos afetados no MR · Lições no `status.md`.
- **Classes de serviço**: expedite = prioridade `crítica` (vai ao topo, é puxada sem aprovação e pode passar o WIP em
  1) · padrão = ordem das linhas.
- **Folga**: `<n>%` da capacidade em itens, reservada ao atendimento (padrão 20%).
- **Tamanhos**: P = horas · M ≈ 1 dia · G = 2–3 dias; maior que G é épico.
- **Disjuntor**: teto do autopilot por item, `tentativas <n> · tempo <n> h · custo <n> créditos`; 2 reprovações
  seguidas disparam sempre.
- **Id no commit**: `sim` ou `não` (o id da tarefa do EWM na mensagem do commit).
- **CT no teste**: `sim` ou `não` (a marca `<FT-nnn> CT-nn` do cenário no teste automatizado).

Mostre o `equipe.json` e o `acordos.md` juntos. Com o "ok", grave os dois pelo passo `gravar-na-base`, commit
`planejamento: equipe e acordos`.

## Saída

Com o "ok" → passo `gravar-na-base`. Ajuste → a proposta de novo.

## Pare se

Sem o "ok" → nada é gravado; o fluxo termina.
