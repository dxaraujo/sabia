---
name: sa-fatiar
description: "Breaks an approved PRD of the Sabiá flow into vertical slices (fatias, tracer bullets) — a product process, by the P.O. or the SM in the sa-produto agent, under the [GB] Gerenciamento do backlog task (hours only for the SM; credits in a comment on it). Each slice cuts through every layer, delivers a behavior verifiable end to end, and cites the stories and scenarios it covers, the affected ELM artifacts approved at the PRD GATE (Artefatos afetados: includes, changes, excludes, with links to the epic's elm/ folder), its dependencies (blocked by), its size (P/M/G, never larger) and its autonomy mode (AFK: the agent works alone up to the PR · HITL: needs a person in the middle). Writes the backlog to <produto>/backlog.md, runs the backlog GATE (the P.O. or the SM) and leaves the EWM tasks for when the slices enter the sprint; splitting and merging happen only before the backlog GATE; after it the slices no longer change, and refinement only cancels slices or the epic (épico) or records the go-ahead for a plan above the limit, by the P.O.'s decision (a new scenario goes to sa-triar; an artifact change of a non-terminal slice goes to its [ESP] FT, sa-especificar). Use when the user says \"fatiar o PRD\", \"quebrar em histórias\", \"gerar o backlog\", \"criar os itens de backlog\", \"PRD para issues\", \"refinar o backlog\", \"cancelar a FT-033\", \"cancelar o EP-05\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "2.0.2"
---

# sa-fatiar — PRD → fatias verticais
