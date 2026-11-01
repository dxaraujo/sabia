---
{"fluxo": "fatia", "dono": "sa-especificador",
 "quando": ["fatia nova que entrou na sprint para ficar pronta ([ESP] FT-nnn), encaminhada por sa-especificar.especificar.chegou"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "assumir"},
   {"id": "trabalho"},
   {"id": "concluir"}
 ]}
---
# Especificar — especificação de fatia (`[ESP] FT-nnn`)

A fatia `nova` (não passa na DoR) entra na sprint com a `[ESP]` dela, para ficar pronta; a `[DEV]`, a `[REV]` e a
`[VER]` nascem quando ela, `elegivel`, entrar numa sprint ou for puxada.

Entrada: `[ESP] FT-nnn`, encaminhada pelo passo `sa-especificar.especificar.chegou`.

Leia antes: `.sabia/sabia.md`. Sem ele → ofereça a **`sa-setup`** ("configurar o Sabiá") e pare.

## Regras

As Regras de `sa-especificar.especificar` valem aqui.
