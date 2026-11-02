---
{"fluxo": "mudanca", "dono": "sa-especificador",
 "quando": ["mudar um PRD já aprovado na base (aprovado: na mesma [ESP]; fatiado: só a correção); volta à revisão e ao GATE de sa-prd.prd"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "mudanca", "saidas": {"o que mudou, para a revisão e o GATE": "→ sa-prd.prd.revisao", "PRD ainda na pasta de trabalho (sem o GATE, ou aprovado sem ir à base)": "→ sa-especificar.especificar", "fatiado: escopo novo": "→ sa-triar.triar"}}
 ]}
---
# Mudança depois de aprovado — o PRD aprovado muda

Entrada: épico com o PRD aprovado na base (`<produto>/epicos/<EP>-<slug>/`) e um pedido explícito de mudança.
Antes do fatiamento (Fase `aprovado`), a mudança segue na mesma `[ESP]`, ainda aberta: da pessoa ou da ATA de uma
reunião (`sa-especificar.reuniao`). Depois do fatiamento (Fase `fatiado`), só a correção do que o PRD já tem
(cenário errado ou que falta numa história existente, valor de regra), por pedido explícito: da pessoa, da ATA, do
drift (`sa-consolidar`: o código entregue não é o que a HF aprovada diz), da `sa-verificar`, do `sa-plano` ou de
completar a fatia (`sa-especificar.fatia`); as fatias do backlog não mudam com ela. Escopo novo (história, regra ou ator que o PRD não tem) depois do fatiamento não muda o PRD: é épico ou fatia
nova pela `sa-triar`.

Leia antes: `.sabia/sabia.md` (ELM, caminhos, papéis) e o steering de produto que ele aponta.

## Modo autônomo

O mesmo de `sa-prd.prd`: PRD é decisão de uma pessoa — chamada em modo autônomo → pare.

## Regras

As de `sa-prd.prd`.
