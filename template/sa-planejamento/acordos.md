---
{"resumo": "Exemplo do .sabia/planejamento/acordos.json, validado pelo acordos.schema.json da sa-planejamento."}
---
```json
{
  "$schema": "https://dxaraujo.github.io/json-schemas/sabia/acordos.schema.json",
  "timebox_semanas": 2,
  "wip": {"em-andamento": 3, "em-revisao": 2},
  "sle": {"percentual": 85, "dias": 5},
  "alertas": {"mr_parado_dias": 1, "impedimento_dias": 7},
  "reserva_capacidade_pct": 20,
  "tamanhos": {"P": "horas", "M": "≈ 1 dia", "G": "2–3 dias"},
  "dod": ["CI verde", "1 aprovação de desenvolvedor ≠ autor", "Evidência no MR", "Artefatos afetados no MR", "Lições aprendidas no status.md"],
  "classes_de_servico": {"urgente": "prioridade crítica", "urgente_passa_wip": true},
  "disjuntor": {"tentativas": 3, "horas": 4, "creditos": 50},
  "id_no_commit": false,
  "ct_no_teste": true
}
```

| Chave | Valores | Quem lê |
|---|---|---|
| `timebox_semanas` | semanas da sprint | `sa-planejamento.sprint` (datas) |
| `wip` | limite por status ∈ `aceita` · `elegivel` · `em-andamento` · `em-revisao` (derivado do MR aberto); conta fatia e bug | `sa-status.painel`, `sa-desenvolver.iniciar`, `sabia status` |
| `sle` | o prazo esperado (SLE do Kanban): `percentual`% dos itens em até `dias` dias, ex. `{"percentual": 85, "dias": 5}`. O item em andamento com idade acima de `dias` vira aviso crítico. Opcional: sem a chave, não há aviso | `sa-status.painel` (idade), `sa-status.pendencias`, `sabia status` e `sabia kanban` |
| `alertas` | `mr_parado_dias` (padrão 1) · `impedimento_dias` (padrão 7); opcional | `sa-status.painel`, `sabia status` |
| `reserva_capacidade_pct` | % da capacidade, em itens, para o atendimento | `sa-planejamento.sprint`, `sa-atender.atender` |
| `tamanhos` | o que vale `P` · `M` · `G` (maior que G é épico) | `sa-triar.triar`, `sa-desenvolver.iniciar` |
| `dod` | o checklist, um item por elemento | `sa-desenvolver.codificar`, `sa-revisar.mr` |
| `classes_de_servico` | `urgente` = o que torna o item urgente (vai ao topo, puxado sem aprovação) · `urgente_passa_wip`: `true` = pode passar o WIP em 1 | `sa-triar.triar`, `sa-desenvolver.iniciar` |
| `disjuntor` | teto do autopilot por item: `tentativas` · `horas` · `creditos`; 2 reprovações seguidas disparam sempre | `sa-desenvolver.codificar` (autopilot) |
| `id_no_commit` | `true` · `false` (o id da tarefa do EWM na mensagem do commit) | commit direto na branch base, `sa-status.pendencias` |
| `ct_no_teste` | `true` · `false` (a marca `<FT-nnn> CT-nn` no teste automatizado) | `sa-desenvolver.codificar`, `sa-status.pendencias` |

Cria: `sa-planejamento.inicial`. Ajusta: `sa-planejamento.retrospectiva` (com o "ok" de quem tem `produto`). Para
mostrar os acordos à pessoa, use uma tabela `Chave | Acordo`; o arquivo é sempre o JSON.
