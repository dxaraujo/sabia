---
name: sa-triar
description: "Sabiá intake and triage, open to anyone, on the base branch. cadastrar is the direct 'register without triaging' entry: it runs the common capture, which records the type, the backlog.md line (epic EP-nn, slice or bug FT-nnn, support item <category>-nnn) and the minimal body. triar goes item by item: reads a text request, an EWM number (read offered through sa-elm.item) or the queue of nova items, looks for duplicates, decides (cancelada, falta informação, adiada até <date> or aceita), classifies the accepted item (type, size P/M/G, priority crítica or empty, parent epic), records it, one small commit per item, and only suggests the next step (sa-refinar.detalhar, sa-refinar.moldar or sa-atender.atender) as a new session. Starts no work; no ELM or sprint writes. Use when the user says \"triagem\", \"triar\", \"triar a fila\", \"nova demanda\", \"chegou um pedido\", \"o cliente pediu\", \"registra o defeito 4567\", \"coloca no backlog\", \"registra isso\", \"anota no backlog\", \"abre um bug\", \"registrar sem triar\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "2.1.17"
---

# sa-triar — Cadastro e triagem
