---
name: sa-triar
description: "Entry point for all new work in Sabiá — takes a text request or EWM items, looks for duplicates and triages: épico (several stories or an open product decision), padrão (clear business rule, ficha (rule sheet) approved by the P.O.), rápida (defect or tweak ≤ 1 day, no new rule) or sustentação (no repository change, in a category: Atendimento, Implantação, Banco de dados, Infra, Operação, Apoio a outros times). For every slice without an epic, maps the ELM artifacts it includes, changes or excludes (every catalog type, bundle and live, with the impact on who cites them), warns to run sa-sync first when the bundle is more than 7 days old, sets bloqueada-por when an artifact is already in another open ficha, and asks whoever triages to confirm the list, recording the authorization; a slice with affected artifacts waits for its [ESP] FT (falta: especificação). Registers it in backlog.md on the base branch — epic EP-nn, slice (fatia) with ficha (one without epic goes under Manutenção) or Sustentação item (AT-nnn, IM-nnn…) with its record and IB ([AT-nnn]; the category task, [ATD], [IMPL]…, is created in the sprint); EWM after confirmation — and starts nothing: points to the sa-iniciar hub and asks for more items. Use when the user says \"nova demanda\", \"chegou um pedido\", \"o cliente pediu\", \"nova funcionalidade\", \"registra o defeito 4567\", \"coloca no backlog\", \"triagem\", \"aprova a ficha da FT-040\", \"importar do EWM\", \"triar os defeitos do time\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "2.0.0-beta.1"
---

# sa-triar — Triagem e registro
