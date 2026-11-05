---
name: sa-prd
description: "Writes the PRD of an epic (épico) or demand in the Sabiá flow — the what and the why in business language: problem, solution, actors, stories with acceptance scenarios (Gherkin), business rules, module-level implementation and testing decisions, non-functional requirements and out of scope. Explores the code and the ELM documentation first, interviews the person (sa-entrevistar), lists the new, changed and excluded ELM artifacts with their impact (the story that embeds a changed rule, the test case of a changed story) and runs the PRD GATE (the specifier's approval, which approves the PRD and every artifact); the approved artifacts go to the base branch with the PRD and are published to DOORS Next when the epic's [ESP] completes, right after the GATE. An approved PRD changes only before slicing, in a new version (1.1, 1.2…) that records the change; after it, DOORS Next is the source of truth and a changed artifact goes through the slice's [ESP]. Use when the user says \"escreve o PRD\", \"documenta a demanda\", \"épico\", \"especificar a demanda\", \"aprova o PRD\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "2.0.0"
---

# sa-prd — O quê e por quê (épico)
