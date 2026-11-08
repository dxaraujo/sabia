---
{"fluxo": "configurar", "dono": "sa-especificador",
 "quando": ["instalar ou atualizar o Sabiá no projeto: sabia.md, agentes.json, formato da spec, \"usa ELM?\", pasta do produto e os 5 agentes", "configurar o Sabiá", "atualizar a configuração do Sabiá", "regenerar os agentes", "ligar o toolkit", "aplicar os dados da sa-elm.setup"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "inicio", "saidas": {"dentro de um agente sa-*": "fim"}},
   {"id": "pre-checagem", "saidas": {"falta o uv ou as skills do Sabiá num alvo": "fim"}},
   {"id": "projeto"},
   {"id": "comandos"},
   {"id": "git"},
   {"id": "gitlab"},
   {"id": "banco"},
   {"id": "formato-spec"},
   {"id": "pasta-produto"},
   {"id": "elm", "chama": "sa-elm.setup"},
   {"id": "glossario"},
   {"id": "especificacao"},
   {"id": "sustentacao"},
   {"id": "toolkits"},
   {"id": "perfis"},
   {"id": "regras-perfis"},
   {"id": "verificacao"},
   {"id": "autonomia"},
   {"id": "sabia-md"},
   {"id": "ponteiros"},
   {"id": "agentes", "saidas": {"o gerador recusou (override ou caminho inválido)": "toolkits"}},
   {"id": "backlog"},
   {"id": "template-mr"},
   {"id": "codeowners"},
   {"id": "gitignore"},
   {"id": "conferir"},
   {"id": "commit"},
   {"id": "proximo", "saidas": {"sim, seguir para o planejamento": "→ sa-planejamento.inicial", "veio só aplicar os dados de uma sa-elm.setup": "fim"}}
 ]}
---
# Configurar — instalar ou atualizar o Sabiá no projeto

Instalação e atualização numa sequência só: com `.sabia/config/agentes.json` no projeto, cada passo mostra o que
está gravado e só pergunta o que muda. Pergunta "usa ELM?" e, com sim, chama a `sa-elm.setup` e aplica os dados que
ela devolve. Decide o `formato_spec`, grava o `.sabia/sabia.md` com seções fechadas (Projeto e Comandos por mescla) e gera os
5 agentes (primários `sa-desenvolvedor` e `sa-especificador`; subagentes `sa-pesquisador`, `sa-revisor` e
`sa-verificador`) nos formatos do opencode e do Kiro.

Os passos de `projeto` a `autonomia` só montam a configuração e mostram; nada que a ferramenta carrega é gravado
antes do passo `sabia-md`. Os cartões: [wizard.md](~/.sabia/framework/skills/sa-setup/references/wizard.md). O
`agentes.json` e o gerador: [agentes.md](~/.sabia/framework/skills/sa-setup/references/agentes.md). Toolkits:
[toolkits.md](~/.sabia/framework/skills/sa-setup/references/toolkits.md).
