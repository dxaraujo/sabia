---
name: sa-fatiar
description: "Breaks an approved PRD of the Sabiá flow into vertical slices (fatias, tracer bullets) — each slice cuts through every layer, delivers a behavior verifiable end to end, and cites the stories and scenarios it covers, its dependencies (blocked by), its size (P/M/G, never larger) and its autonomy mode (AFK: the agent works alone up to the PR · HITL: needs a person in the middle). Writes the backlog to <produto>/backlog.md, runs the backlog GATE and leaves the EWM tasks for when the slices enter the sprint; splitting and merging happen only before the backlog GATE; after it the slices no longer change, and refinement only cancels slices or the epic (épico), by the P.O.'s decision (a new scenario goes to sa-triar). Use when the user says \"fatiar o PRD\", \"quebrar em histórias\", \"gerar o backlog\", \"criar os itens de backlog\", \"PRD para issues\", \"refinar o backlog\", \"cancelar a FT-033\", \"cancelar o EP-05\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "2.0.0-alpha.1"
---

# sa-fatiar — PRD → fatias verticais
