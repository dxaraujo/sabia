---
{"fluxo": "mudanca", "dono": "sa-especificador",
 "quando": ["mudar um PRD aprovado na base e ainda não fatiado, na [ESP] do épico (reaberta, se já concluída); volta à revisão e ao GATE de sa-prd.prd; fatiado, o PRD não muda"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "mudanca", "saidas": {"transcrição nova sem ATA: a [ESP] reaberta, a ATA primeiro": "→ sa-especificar.reuniao", "o que mudou, para a revisão e o GATE": "→ sa-prd.prd.revisao", "PRD ainda na pasta de trabalho (sem o GATE, ou aprovado sem ir à base)": "→ sa-especificar.especificar", "fatiado: alteração de artefato que uma fatia não terminal cobre": "→ sa-especificar.fatia", "fatiado: escopo novo, ou a fatia já terminal": "→ sa-triar.triar"}}
 ]}
---
# Mudança depois de aprovado — o PRD aprovado muda antes do fatiamento

Entrada: épico com o PRD aprovado na base (`<produto>/epicos/<EP>-<slug>/`), na Fase `aprovado` (ainda não
fatiado), e um pedido explícito de mudança: da pessoa ou da ATA de uma reunião (`sa-especificar.reuniao`). A mudança é
trabalho da `[ESP]` do épico, reaberta se já concluída. Nada foi publicado ainda (a publicação vem depois do merge das
fatias), então o PRD é reescrito no lugar. Depois do fatiamento (Fase `fatiado`) o PRD não muda: o DOORS Next é a
fonte, e o PRD fica como registro do épico. A alteração de artefato que uma fatia não terminal cobre é da `[ESP] FT`
dela; escopo novo, ou a fatia já terminal, é épico ou fatia nova pela `sa-triar`.

Leia antes: `.sabia/sabia.md` (ELM, caminhos, papéis) e o steering de produto que ele aponta.

## Modo autônomo

O mesmo de `sa-prd.prd`: PRD é decisão de uma pessoa — chamada em modo autônomo → pare.

## Regras

As de `sa-prd.prd`.
