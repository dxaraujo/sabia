---
name: sa-orquestrar
description: "Autonomous (AFK) execution of several slices (fatias) of the Sabiá flow — takes the frontier of planned (planejada), unblocked AFK slices, records the batch as iniciada on the base branch, creates one worktree and one branch per slice (under .sabia/local/wt/) and carries each one from research to an open PR, one phase per clean-context subagent of sa-orquestrador (pesquisador, desenvolvedor, revisor, verificador), with backpressure, up to 2 review rounds, a stop on blockers and a WIP limit set by human review capacity. Resumable from the log in .sabia/local/. Use when the user says \"roda as fatias AFK\", \"modo AFK\", \"leva a FT-031 e a FT-032 até o PR\", \"trabalha sozinho nas fatias da sprint\", \"retoma o loop\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "2.0.3"
---

# sa-orquestrar — Fatias AFK até o PR
