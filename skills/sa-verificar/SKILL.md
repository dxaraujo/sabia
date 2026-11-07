---
name: sa-verificar
description: "Acceptance against the spec in the Sabiá flow. The verificar flow is the verifier: it runs in the sa-verificador subagent with clean context, starts the application with the project's Executar commands, exercises every CT-nn scenario of the card and the spec like a real user (curl on the test URL, browser, job, data load; never production or real personal data), marks each one accepted, rejected, environment or possible change with expected × actual and evidence, writes CT.csv in the spec folder (its only writer) and returns the 🔎 block (ACEITO, REJEITADO or AMBIENTE) to the caller, who takes the proof to the MR. Called by sa-desenvolver.codificar before the MR and by sa-verificar.uat. The uat flow is the human UAT, only when the risk asks for it, by anyone, on the open MR branch: the person picks the scenarios, confirms each result and triages them in the MR. Use when the user says \"verifica a FT-031\", \"testa a fatia\", \"executa os cenários\", \"teste de aceitação\", \"UAT da FT-031\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "2.1.2"
---

# sa-verificar — O comportamento existe de verdade?
