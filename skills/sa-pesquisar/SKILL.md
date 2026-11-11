---
name: sa-pesquisar
description: "Neutral, read-only research in the sa-pesquisador subagent of the Sabiá flow: receives scope, questions and hints from the caller (sa-plano, sa-prd, sa-refinar, sa-entrevistar, sa-atender), builds 3 to 7 questions when none come, investigates structure, current flow, analogous features, reuse, data (read-only, counts only), tests and documentation (the slice's spec folder, repository specs, the ELM bundle, live ELM in read mode), and returns only facts with file:line in the research.md sections, up to about 150 lines. Writes nothing: the caller keeps the result (research.md belongs to sa-plano). Never invents a file, class, column or route; what it did not find goes to Não encontrado. Use when the user says \"pesquisa o código da FT-031\", \"onde isso está implementado\", \"research\", \"entender o código antes de planejar\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "2.1.30"
---

# sa-pesquisar — Fatos antes de decidir
