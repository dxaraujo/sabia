---
name: sa-desenvolver
description: "Sabiá developer cycle for a slice or bug (FT-nnn), from pulling to merge, in the sa-desenvolvedor agent. iniciar: take the task in one step (confirm size P/M/G, route trivial/quick/complete, coding mode AI supervised/AI autopilot/manual, fixed to the end), ownership on the base branch, branch <id> and spec folder with status.md. codificar: TDD with layered backpressure, self-review in the sa-revisor subagent, self-verification in the sa-verificador subagent, lessons and MR with proof and Cobre; manual mode resumes from validation on 'terminei'; autopilot runs as a subagent in a worktree with a circuit breaker. encerrar: merge with one approval from a developer other than the author and green CI, concluida on the base, epic closed on its last slice, spec archive. Only offers ELM (sa-elm). Use when the user says \"vamos trabalhar na FT-031\", \"próxima\", \"implementa a FT-031\", \"retoma a FT-031\", \"terminei\", \"corrige os achados do MR\", \"abre o MR\", \"mergeia a FT-031\", \"MR mergeado\", \"fecha a FT-031\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "2.1.5"
---

# sa-desenvolver — Do puxar ao merge
