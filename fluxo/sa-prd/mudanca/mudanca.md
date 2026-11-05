---
{"fluxo": "mudanca", "dono": "sa-especificador",
 "quando": ["mudar um PRD aprovado na base e ainda não fatiado (o intervalo GATE do PRD → fatiamento), pela regra da tarefa de especificação (a [ESP] aberta, reaberta na sprint corrente ou a [ESP] EP-nn Revisão n), numa versão nova do PRD; volta à revisão e ao GATE de sa-prd.prd; fatiado, o PRD não muda"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "mudanca", "saidas": {"transcrição nova sem ATA: a [ESP] aberta ou reaberta, a ATA primeiro": "→ sa-especificar.reuniao", "o que mudou, para a revisão e o GATE": "→ sa-prd.prd.revisao", "[ESP] concluída numa sprint fechada, com sprint aberta: a Revisão pelo encaixe, do P.O. ou do SM": "→ sa-planejamento.durante", "[ESP] concluída numa sprint fechada, sem sprint aberta: pendência do P.O. na [GB]": "→ sa-planejamento.sprint", "PRD ainda na pasta de trabalho (sem o GATE, ou aprovado sem ir à base)": "→ sa-especificar.especificar", "fatiado: alteração de artefato que uma fatia não terminal cobre": "→ sa-especificar.fatia", "fatiado: escopo novo, ou a fatia já terminal": "→ sa-triar.triar"}}
 ]}
---
# Mudança depois de aprovado — o PRD aprovado muda antes do fatiamento

Entrada: épico com o PRD aprovado na base (`<produto>/epicos/<EP>-<slug>/`), na Fase `aprovado` (ainda não
fatiado), e um pedido explícito de mudança: da pessoa ou da ATA de uma reunião (`sa-especificar.reuniao`). A mudança é
trabalho da tarefa de especificação do épico, pela regra da
[Volta à especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação): a `[ESP]`
aberta, a reaberta na sprint corrente ou a `[ESP] EP-<nn> Revisão <n>`. O PRD ganha uma versão nova (`1.1`, `1.2`…),
com a mudança registrada nele (seção Mudanças), e a conclusão da `[ESP]` publica a versão nova. Depois do
fatiamento (Fase `fatiado`) o PRD não muda: o DOORS Next é a fonte, e o PRD fica como registro do épico. A alteração
de artefato que uma fatia não terminal cobre é da `[ESP] FT` dela; escopo novo, ou a fatia já terminal, é épico ou
fatia nova pela `sa-triar`.

Leia antes: `.sabia/sabia.md` (ELM, caminhos, papéis) e o steering de produto que ele aponta.

## Modo autônomo

O mesmo de `sa-prd.prd`: PRD é decisão de uma pessoa — chamada em modo autônomo → pare.

## Regras

As de `sa-prd.prd`.
