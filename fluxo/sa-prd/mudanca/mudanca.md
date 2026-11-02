---
{"fluxo": "mudanca", "dono": "sa-especificador",
 "quando": ["mudar um PRD já aprovado (Fase aprovado ou fatiado), por um pedido explícito da pessoa, da sa-consolidar (drift) ou do sa-fatiar.refinamento (cenário novo); volta à revisão e ao GATE de sa-prd.prd"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "mudanca", "saidas": {"o que mudou, para a revisão e o GATE": "→ sa-prd.prd.revisao"}}
 ]}
---
# Mudança depois de aprovado — nova versão do PRD

Entrada: épico na Fase `aprovado` ou `fatiado`, com o PRD já na base (`<produto>/epicos/<EP>-<slug>/`), e um pedido
explícito de mudança — da pessoa, da `sa-consolidar` (drift), da `sa-verificar` (cenário errado) ou do
`sa-fatiar.refinamento` (fatia nova com cenário novo, que chama este fluxo e segue depois do GATE).

Leia antes: `.sabia/sabia.md` (ELM, caminhos, papéis) e o steering de produto que ele aponta.

## Modo autônomo

O mesmo de `sa-prd.prd`: PRD é decisão de uma pessoa — chamada em modo autônomo → pare.

## Regras

As de `sa-prd.prd`.
