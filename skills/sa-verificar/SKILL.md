---
name: sa-verificar
description: "Acceptance against the spec in the Sabiá flow. The verificar flow is the verifier: it runs in the sa-verificador subagent with isolated context, starts the application with the project's Executar commands, exercises every CT-nn scenario of the card and the spec like a real user (never production or real personal data), marks each one accepted, rejected, environment or possible change with expected × actual and evidence, writes CT.csv in the spec folder (its only writer) and returns the 🔎 block (ACEITO, REJEITADO or AMBIENTE) to the caller, who takes the evidence to the MR. Called by sa-desenvolver.codificar before the MR and by sa-verificar.revisao-humana. The revisao-humana flow is the human review (revisão humana), only when the risk asks for it, by anyone, on the open MR branch: the person picks the scenarios, confirms each result and triages them in the MR. Use when the user says \"verifica a FT-031\", \"testa a fatia\", \"executa os cenários\", \"teste de aceitação\", \"revisão humana da FT-031\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "2.1.15"
---

# sa-verificar — O comportamento existe de verdade?
