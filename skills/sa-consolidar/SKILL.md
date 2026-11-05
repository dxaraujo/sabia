---
name: sa-consolidar
description: "Closes a pronta slice (fatia) of the Sabiá flow (PR merged and recorded on the base branch by the Dev) — a product process, by the P.O. or the SM (business analyst) in the sa-produto agent, under the [GB] Gerenciamento do backlog task (hours only for the SM; credits in a comment on it): reads the Drift de negócio field in status.md (indicated by review and verification, decided by the person) and records a divergence found after the merge as specification debt (débito de especificação) in the sprint file, read by the review and the retrospective, without reopening the specification; the requirements and planned test cases were already published to ELM when the [ESP] concluded; sends to ELM via the elm MCP, in one confirmation, the as-built technical spec (written by the Dev in the PR, with the PR and merge in its text) linked to the [DEV] task (implementa), the slice's test cases (ETM: links each planned test case, already published with the [ESP], to the backlog item and creates only the new ones; CSV: the CT.csv is the deliverable) and the backlog item's completion; moves the PR's ADRs to the ADR folder, fixes the glossary, marks the slice concluida in the backlog and sprint, records the lessons (sa-aprender) and says what comes next in the epic (épico). Use when the user says \"PR mergeado\", \"fecha a FT-031\", \"consolidar\", \"concluir a fatia\", \"a fatia foi entregue\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "2.0.0-alpha.1"
---

# sa-consolidar — Documentação viva depois do merge
