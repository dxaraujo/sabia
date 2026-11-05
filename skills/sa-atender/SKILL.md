---
name: sa-atender
description: "Skill for whoever handles support in the Sabiá flow — carries out an atendimento (a ticket or customer request; the Atendimento category of Sustentação) already registered by sa-triar (AT-nnn: IB [AT-nnn] and task [ATD]): claims the [ATD] in EWM (creating any missing IB and task) and records the AT as em-andamento on the base branch, queries the database (read-only) and the ELM bundle, touches code only within a closed scope, keeps extractions out of git (.sabia/local/sustentacao/atendimento/), drafts the reply for the person's \"ok\" and wraps up — records the reply, logs the remaining hours, closes the [ATD] and the AT's IB, and asks about follow-ups (nothing · change or undecided rule via sa-triar). A new request does not start here: it goes through sa-triar. Use when the user says \"atender o AT-012\", \"pegar a [ATD] 669380\", \"extrai os dados do AT-012\", \"enviei a resposta\", \"conclui o AT-012\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "2.0.0"
---

# sa-atender — Atender sem perder o rastro
