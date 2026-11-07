---
name: sa-plano
description: "Plans a Sabiá slice or bug (FT-nnn) on the quick and complete routes (trivial skips it), in the sa-desenvolvedor agent. Gathers facts through sa-pesquisar (sa-pesquisador subagent) and writes research.md, takes the technical decisions with the recommended option, copies the approved requirement text into the spec delta without rewriting it (OpenSpec ADDED/MODIFIED/REMOVED or Kiro requirements.md/bugfix.md with the full block of each touched requirement), and writes design and tasks by the route x format matrix: Kiro Quick Spec, Bugfix Spec or requirements -> design -> tasks; OpenSpec proposal + delta (+ design) + tasks. Offers 'quer revisar agora?' with rubric L in the sa-revisor subagent; the developer approves the plan (in autopilot, the subagent approves and records). replanejar changes only what changed when the approved plan no longer fits. Use when the user says \"planeja a FT-031\", \"gera a spec\", \"cria as tasks\", \"replaneja\", \"o plano não serve\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "2.1.3"
---

# sa-plano — Decidir o como antes de codar
