---
name: sa-revisar
description: "Plan and code review in the Sabiá flow. The revisar flow is the independent reviewer: it runs in the read-only sa-revisor subagent with isolated context, judges the files against their source (never the author's explanation) with review criteria L (slice plan) or C (code, on the spec, standards and security axes), plus the toolkit rubrics and the learned rules, and returns the report to the caller without writing files or committing; only a BLOQUEANTE finding fails it. Called by sa-plano.plano, sa-plano.replanejar, sa-desenvolver.codificar and sa-revisar.mr. The mr flow is the official human review of a code MR by any developer who is not the author: reads the MR and its CI, gets the review criteria C report, triages each finding in the MR (corrige, adia, volta-plano, volta-spec, descarta) and approves or requests changes; the merge stays with the author. Use when the user says \"revisa o plano da FT-031\", \"revisa o código da FT-031\", \"code review\", \"revisa o MR da FT-031\", \"aprovar o MR !42\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "2.1.26"
---

# sa-revisar — Revisão de plano e de código
