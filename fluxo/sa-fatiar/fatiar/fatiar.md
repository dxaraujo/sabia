---
{"fluxo": "fatiar", "dono": "sa-especificador",
 "quando": ["o primeiro fatiamento de um PRD aprovado: rascunho, GATE do backlog e gravação na base", "fatiar o PRD", "quebrar em histórias", "gerar o backlog", "criar os itens de backlog", "PRD para issues"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "rascunho", "chama": "sa-pesquisar.pesquisar"},
   {"id": "perguntar", "saidas": {"ajuste pedido: repita até o ok": "perguntar"}},
   {"id": "gravar"},
   {"id": "proximos", "saidas": {"primeiro fatiamento, ou a linha da Especificação ainda iniciada": "→ sa-especificar.especificar", "alocar as fatias na sprint: fale com o P.O. ou o SM (agente sa-produto)": "fim"}}
 ]}
---
# Fatiar — PRD → fatias verticais

Entrada: o PRD aprovado — `Fase: aprovado` no `status.md` do épico, na base (`<produto>/epicos/<EP>-<slug>/`, com o
`prd.md`; no refinamento, `fatiado`, ou `aprovado` depois de uma mudança no PRD). Saída: fatias no
`<produto>/backlog.md` (formato em [references/backlog.md](~/.sabia/framework/skills/sa-fatiar/references/backlog.md)) e a ficha de cada uma (`<produto>/fatias/FT-<nnn>-<slug>.md`, formato
"padrão de épico" do padrão `sa-triar/ficha.md`).

## Modo autônomo

Fatiar é decisão de uma pessoa (o GATE do backlog): chamada em modo autônomo (`AUTONOMO=true`, pelo loop ou por um
agente sem pessoa na conversa) → "PRD, backlog e itens de Sustentação (`AT-`, `IM-`…) nunca são AFK — fatie numa
sessão com o P.O." e pare.

## Regras

- Nunca crie fatia por camada técnica ou por papel ("especificar X", "testar X") — o trabalho de todos os papéis
  na mesma fatia é a mesma fatia.
- Nunca altere fatia `pronta` ou `concluida` (já na base). Mudança de comportamento entregue = fatia nova.
- Tamanho não é promessa de prazo: é o sinal de que a fatia cabe num PR revisável.
- Não invoque nem simule outra skill além das que os passos mandam chamar (subagente pesquisador): depois
  do GATE do backlog, diga os próximos passos (passo `proximos`) e pare.
