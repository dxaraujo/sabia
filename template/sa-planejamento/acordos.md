---
{"resumo": "Formato do .sabia/planejamento/acordos.md: a tabela Item | Acordo com as chaves nesta ordem."}
---
```markdown
# Acordos do time

| Item | Acordo |
|---|---|
| Timebox | 2 semanas |
| WIP | em-andamento: 3 · em-revisao: 2 |
| SLE | 85% em até 5 dias |
| DoD | CI verde · 1 aprovação de desenvolvedor ≠ autor · Evidência no MR · Artefatos afetados no MR · Lições aprendidas no status.md |
| Classes de serviço | expedite = prioridade crítica (vai ao topo, puxada sem aprovação, pode passar o WIP em 1) · padrão = ordem das linhas |
| Reserva de capacidade | 20% |
| Tamanhos | P = horas · M ≈ 1 dia · G = 2–3 dias (maior que G é épico) |
| Disjuntor | tentativas 3 · tempo 4 h · custo 50 créditos |
| Id no commit | não |
| CT no teste | sim |
```

| Chave | Valores | Quem lê |
|---|---|---|
| Timebox | `<n> semanas` | `sa-planejamento.sprint` (datas) |
| WIP | `<status>: <n>`, status ∈ `aceita` · `elegivel` · `em-andamento` · `em-revisao` (derivado do MR aberto) | `sa-status.painel`, `sa-desenvolver.iniciar` |
| SLE | `<p>% em até <n> dias` · vazio (opcional) | `sa-status.painel` (idade) |
| DoD | checklist separado por ` · ` | `sa-desenvolver.codificar`, `sa-revisar.mr` |
| Classes de serviço | expedite = `crítica` · padrão = ordem das linhas | `sa-triar.triar`, `sa-desenvolver.iniciar` |
| Reserva de capacidade | `<n>%` da capacidade, em itens, para o atendimento | `sa-planejamento.sprint`, `sa-atender.atender` |
| Tamanhos | `P` · `M` · `G` com o que cada um vale (editável) | `sa-triar.triar`, `sa-refinar.detalhar` |
| Disjuntor | `tentativas <n> · tempo <n> h · custo <n> créditos`; 2 reprovações seguidas disparam sempre | `sa-desenvolver.codificar` (autopilot) |
| Id no commit | `sim` · `não` | commit direto na branch base, `sa-status.pendencias` |
| CT no teste | `sim` · `não` (a marca `<FT-nnn> CT-nn` no teste automatizado) | `sa-desenvolver.codificar`, `sa-status.pendencias` |

Cria: `sa-planejamento.inicial`. Ajusta: `sa-planejamento.retrospectiva` (com o "ok" de quem tem `produto`).
