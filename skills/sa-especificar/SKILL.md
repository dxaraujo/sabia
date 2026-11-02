---
name: sa-especificar
description: "Skill for the Especificador (specifier) role in the Sabiá flow — drives the specification of an epic (épico, EP-nn) from the [ESP] task, and the [ESP] of a slice (fatia) that entered the sprint not yet ready (FT-nnn): claims the [ESP] in EWM (the epic becomes iniciado on the base branch), sets up the local working folder outside git (.sabia/local/especificacao/), routes by the Fase in the epic's status.md (sa-entrevistar → sa-prd → PRD GATE → sa-fatiar), brings the approved PRD to the base branch, completes the [ESP] after the backlog GATE and, at the end of each session with the client, records the elicitation in the [ESP] (comment + .md attachments with the latest version of each artifact) and logs the session's hours. Each client meeting during the open [ESP] becomes an ATA (meeting minutes) written from its transcript (.vtt or .md in reunioes/, kept only on this machine), approved by the person and published to DOORS Next on approval, with its decisions recorded as D-nn. In a project with screens (Telas = sim), the PRD starts only after the client approves a prototype: each version (fictitious data only) is attached to the [ESP] as prototipo-vN, and the approval (who, date, version, evidence: ATA or e-mail) becomes a D-nn. Another machine resumes by downloading the attachments. Use when the user says \"especificar o EP-03\", \"pegar a [ESP] do EP-03\", \"retomar a especificação\", \"fechar a sessão de especificação\", \"tenho a transcrição da reunião\", \"registrar a ata\", \"tenho o protótipo\", \"o cliente aprovou o protótipo\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "2.0.0-alpha.1"
---

# sa-especificar — Especificação de épico
