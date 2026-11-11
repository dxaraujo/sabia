---
{"resumo": "Propõe o acordos.json (timebox, WIP, SLE, alertas, DoD, classes de serviço, reserva de capacidade, tamanhos, disjuntor, id no commit, CT no teste), validado pelo schema, e grava com a equipe."}
---
## Entrada

O `acordos.json` atual, se existe, e a equipe proposta (passo `equipe`).

## Faça

Proponha `.sabia/planejamento/acordos.json` pelo template `sa-planejamento/acordos.md`, com o `$schema` e estes
padrões quando o time não diz outro valor. Mostre a proposta à pessoa como tabela `Chave | Acordo`.

- **`timebox_semanas`**: padrão 2.
- **`wip`**: limite por status de fatia e bug (`aceita` · `elegivel` · `em-andamento` · `em-revisao`); padrão
  `em-andamento` e `em-revisao`.
- **`sle`** (opcional): o prazo esperado, `percentual` e `dias` (ex.: 85% dos itens em até 5 dias). Acima de `dias`, o
  item em andamento vira aviso crítico no painel e no Kanban.
- **`alertas`** (opcional): `mr_parado_dias` (padrão 1) e `impedimento_dias` (padrão 7).
- **`dod`**: CI verde · 1 aprovação de desenvolvedor ≠ autor · Evidência no MR · Artefatos afetados no MR · Lições aprendidas no `status.md`.
- **`classes_de_servico`**: `urgente` = prioridade `crítica` (vai ao topo e é puxada sem aprovação) ·
  `urgente_passa_wip` (padrão `true`: pode passar o WIP em 1). O resto segue a ordem das linhas.
- **`reserva_capacidade_pct`**: % da capacidade em itens, reservada ao atendimento (padrão 20).
- **`tamanhos`**: P = horas · M ≈ 1 dia · G = 2–3 dias; maior que G é épico.
- **`disjuntor`**: teto do autopilot por item, `tentativas` · `horas` · `creditos`; 2 reprovações seguidas disparam
  sempre.
- **`id_no_commit`**: `true` ou `false` (o id da tarefa do EWM na mensagem do commit).
- **`ct_no_teste`**: `true` ou `false` (a marca `<FT-nnn> CT-nn` do cenário no teste automatizado).

Valide contra o [acordos.schema.json](~/.sabia/framework/skills/sa-planejamento/assets/acordos.schema.json); o que
não passa volta à pessoa antes de gravar.

Mostre o `equipe.json` e o `acordos.json` juntos. Com o "ok", grave os dois pelo passo `commit-na-branch-base`, commit
`planejamento: equipe e acordos`.

## Saída

Com o "ok" → passo `commit-na-branch-base`. Ajuste → a proposta de novo.

## Pare se

Sem o "ok" → nada é gravado; o fluxo termina.
