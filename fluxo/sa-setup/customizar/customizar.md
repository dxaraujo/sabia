---
{"fluxo": "customizar", "dono": "sa-especificador",
 "quando": ["trocar, inserir ou remover um passo, ou trocar um padrão, neste projeto; ver o que ele mudou; descustomizar", "customizar o passo …", "trocar o padrão …", "o que este projeto mudou?", "descustomizar …"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "inicio", "saidas": {"dentro de um agente sa-*": "fim", "sem .sabia/config/agentes.json": "→ sa-setup.configurar", "o que este projeto mudou?": "fim"}},
   {"id": "achar-ponto", "saidas": {"descustomizar": "regenerar"}},
   {"id": "forma", "saidas": {"remover um passo com trava": "forma"}},
   {"id": "copiar"},
   {"id": "regenerar", "saidas": {"o gerador recusou o override": "copiar"}},
   {"id": "o-que-mudou"}
 ]}
---
# Customizar — o override do projeto

Trocar, inserir ou remover um passo e trocar um padrão, em `.sabia/fluxo/` e `.sabia/padrao/`, com a base pelo
`--base` do gerador. O delta vai ao prompt do agente que roda a skill do passo; na sessão sem agente, o compilado
abre o override antes do arquivo da skill. Cartões C1 a C4 do
[wizard.md](~/.sabia/framework/skills/sa-setup/references/wizard.md).
