---
name: sa-consolidar
description: "Closes a pronta slice (fatia) of the Sabiá flow (PR merged and recorded on the base branch by the Dev) — a product process, by the P.O. or the SM (business analyst) in the sa-produto agent, under the [GB] Gerenciamento do backlog task (hours only for the SM; credits in a comment on it): reads the Drift de negócio field in status.md (indicated by review and verification, decided by the person) and, with drift, sends the slice back to its [ESP] FT (sa-especificar) before publishing; sends to ELM via the elm MCP, in one confirmation, after the merge, the requirements the specification approved that the slice covers (Cobre, the ficha's affected artifacts and the ones they cite), the backlog item linked to its stories (implementa), a manual script to move excluded requirements to the DOORS Next trash (ELM pendente), the as-built technical spec (written by the Dev in the PR), the test cases (created by the agent in ETM, one per verified scenario) and the backlog item's completion; moves the PR's ADRs to the ADR folder, fixes the glossary, marks the slice concluida in the backlog and sprint, records the lessons (sa-aprender) and says what comes next in the epic (épico). Use when the user says \"PR mergeado\", \"fecha a FT-031\", \"consolidar\", \"concluir a fatia\", \"a fatia foi entregue\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "2.0.0-alpha.1"
---

# sa-consolidar — Documentação viva depois do merge
