---
name: sa-atender
description: "Sustentação in the Sabiá flow, one flow for the six categories: AT (support), IM (deployment), BD (database), IN (infrastructure), OP (operations) and EX (help to other teams). Anyone registers a request here: the category is confirmed before saving, because the id comes from its series and never changes (no recategorizing). Whoever handles it pulls it within the sprint slack (over it, the product person decides), takes it on the base branch, does the work with the AI only as an aid (code facts from sa-pesquisar, database read-only, a reply draft on request; customer data stays out of git) and declares it resolved; the agent never runs scripts, deploys or commands in an environment and never answers the customer. A request that changes the code becomes a bug or slice through the common capture; follow-ups and lessons are recorded on closing. Use when the user says \"atender o AT-012\", \"registra um pedido de sustentação\", \"aplicar o BD-004\", \"conclui o IM-007\", \"enviei a resposta\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "2.1.8"
---

# sa-atender — Sustentação sem perder o rastro
