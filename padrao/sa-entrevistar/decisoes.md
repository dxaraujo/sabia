---
{"resumo": "Formato único do decisoes.md (triagem, especificação, PRD e entrevista criam por este; passo registrar da sa-entrevistar)."}
---
```markdown
# Decisões — <EP-xx | FT-xxx> <título>

| D | Pergunta | Decisão | Fonte / quem decidiu | Data | Situação |
|---|---|---|---|---|---|
| D-01 | Reprocessar registros já pagos? | Não: ignora e registra no log | ana.souza (P.O.) | 2026-10-13 | decidida |
| D-02 | Qual o limite diário? | 3 tentativas | código: `LoginService.java:42` | 2026-10-13 | confirmada |
| D-03 | Como notificar o bloqueio? | — · bloqueia: sim | — | 2026-10-13 | em aberto |
| D-04 | (revisa D-01) Reprocessar os pagos de ontem? | Sim, só D-1 | ana.souza | 2026-10-14 | decidida — substitui D-01 |
```

Colunas: D = `D-nn` (o próximo livre do arquivo ou da seção) · Pergunta · Decisão (`—` se em aberto; no modo
autônomo, `(recomendada: …)`; em aberto, termina em ` · bloqueia: sim` (muda o comportamento) ou ` · bloqueia: não`
(detalhe de apresentação)) · Fonte / quem decidiu = `<login> (<papel>)` | `código: <arquivo:linha>` |
`ATA-nn [mm:ss]` | `<tipo> <id>` do ELM | `—` · Data `AAAA-MM-DD` · Situação: `decidida` (uma pessoa respondeu) ·
`confirmada` (fonte encontrada) · `em aberto` (sem resposta) · `em aberto — ATA-<nn> draft` (reservada pela ATA
ainda não aprovada) · `decidida — substitui D-nn` (revisão, na linha nova; a antiga não muda).
