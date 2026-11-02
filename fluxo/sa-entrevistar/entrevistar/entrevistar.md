---
{"fluxo": "entrevistar", "dono": "sa-especificador",
 "quando": ["alinhar uma demanda, PRD ou fatia em rodadas até o entendimento confirmado, chamado direto ou pela sa-prd, a sa-fatiar e a sa-triar diante de uma decisão em aberto", "me entreviste", "grill me", "vamos alinhar", "quais decisões estão em aberto", "o que falta definir"],
 "travas_gerais": ["decisao-da-pessoa"],
 "passos": [
   {"id": "arvore"},
   {"id": "rodadas", "chama": "sa-pesquisar.pesquisar", "saidas": {"resposta abriu ramos novos ou a fronteira não está vazia": "rodadas"}},
   {"id": "registrar"},
   {"id": "linguagem", "travas": ["sim-da-pessoa"]}
 ]}
---
# Entrevistar — alinhar antes de escrever

O erro mais caro de um fluxo com agentes é escrever bem a coisa errada. Antes de qualquer PRD ou fatia, feche
as decisões que as fontes não respondem — o agente **não** preenche lacuna com suposição plausível.

## Entrada

- **O que está sendo alinhado:** demanda (texto, work item do EWM), PRD ou fatia.
- **Onde registrar:** a pasta do épico — até o GATE do PRD, a pasta de trabalho da `sa-especificar`
  (`.sabia/local/especificacao/<EP>-<slug>/decisoes.md`, fora do git); depois, `<produto>/epicos/<EP>-<slug>/` — ou, na triagem de uma fatia sem épico, a seção Decisões da ficha
  (`<produto>/fatias/FT-<nnn>-<slug>.md`). Quem chamou informa; chamada direta → pergunte uma vez.
- **Glossário:** o caminho está no `.sabia/sabia.md` (seção Projeto; padrão `.sabia/glossario.md`).

## Regras

- Nunca invente resposta para destravar a entrevista. Sem fonte e sem pessoa → `em aberto`.
- Decisão de negócio é de uma pessoa (P.O. ou quem ela delegou); decisão técnica entre alternativas equivalentes é
  do desenvolvedor e vai para o `design.md`, não para cá.
- Modo autônomo (`AUTONOMO=true`, chamado por um agente sem pessoa na conversa): não pergunte — monte a árvore,
  resolva o que tem fonte e registre o resto como `em aberto` com a opção recomendada na coluna Decisão entre
  parênteses (`(recomendada: …)`). Quem chamou não pode tratar recomendação como decisão.
