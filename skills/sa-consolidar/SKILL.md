---
name: sa-consolidar
description: "Closes a pronta slice (fatia) of the Sabiá flow (PR merged and recorded on the base branch by the Dev) — a product process, by the P.O. or the SM (business analyst) in the sa-produto agent, under the [GB] Gerenciamento do backlog task (hours only for the SM; credits in a comment on it): reads the Drift de negócio field in status.md (set by review and verification) and, with drift, bumps the PRD or the ficha (rule sheet) to a new version; sends to ELM via the elm MCP, in one confirmation, the requirements, the as-built ficha rule, the as-built technical spec (written by the Dev in the PR), the test cases (created by the agent in ETM, one per verified scenario) and the backlog item's completion; moves the PR's ADRs to the ADR folder, fixes the glossary, marks the slice concluida in the backlog and sprint, records the lessons (sa-aprender) and says what comes next in the epic (épico). Use when the user says \"PR mergeado\", \"fecha a FT-031\", \"consolidar\", \"concluir a fatia\", \"a fatia foi entregue\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "1.1.3"
---

# sa-consolidar — Documentação viva depois do merge
