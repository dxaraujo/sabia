---
{"fluxo": "fatia", "dono": "sa-especificador",
 "quando": ["especificação de fatia: a [ESP] FT-nnn de uma fatia nova que entrou na sprint para ficar pronta", "pegar a [ESP] da FT-031", "especificar a FT-031"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "sprint": "nao"},
   {"id": "assumir"},
   {"id": "trabalho"},
   {"id": "concluir", "saidas": {"desdobramento: alteração, regra ou demanda nova": "→ sa-triar.triar"}}
 ]}
---
# Especificar — especificação de fatia (`[ESP] FT-nnn`)

A fatia `nova` (não passa na DoR) entra na sprint com a `[ESP]` dela, para ficar pronta; a `[DEV]`, a `[REV]` e a
`[VER]` nascem quando ela, `elegivel`, entrar numa sprint.

Entrada: `[ESP] FT-nnn` de uma fatia `nova` na sprint aberta.

Leia antes: `.sabia/sabia.md`. Sem ele → ofereça a **`sa-setup`** ("configurar o Sabiá") e pare.

## Entrada: vizinhos

- `EP-nn` ou `[ESP] EP-nn` → `sa-especificar.especificar`
- fatia `nova` no backlog, sem a `[ESP]` → "completar é do P.O., pela `sa-triar` (agente `sa-produto`)" ■
- fatia `elegivel` (já passou na DoR) → "é do Dev: `sa-desenvolver FT-nnn` (agente `sa-desenvolvedor`)" ■

## Regras

As Regras de `sa-especificar.especificar` valem aqui.
