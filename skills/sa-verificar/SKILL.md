---
name: sa-verificar
description: "Acceptance verification of a slice (fatia) in the Sabiá flow — runs end to end, on the real application, every scenario the slice covers (API, batch job, browser screen, data load — depending on the project type and the toolkit), with test data, evidence per scenario (response, count, log, screenshot) and an ACEITO/REJEITADO decision; generates the test cases (CT.csv) for ETM from the verified scenarios. A failed scenario goes back to sa-codificar with expected × actual. With the [VER] task (directly or through the sa-iniciar hub), first claims it in EWM (elm_transicao). Use when the user says \"verifica a FT-031\", \"pegar a [VER] da FT-031\", \"testa a fatia\", \"executa os cenários\", \"teste de aceitação\", \"gera os CTs\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "2.0.3"
---

# sa-verificar — O comportamento existe de verdade?
