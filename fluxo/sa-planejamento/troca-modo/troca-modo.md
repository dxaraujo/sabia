---
{"fluxo": "troca-modo", "dono": "sa-produto",
 "quando": ["trocar o modo de uma fatia viva na sprint, nos dois sentidos (AFK → HITL, HITL → AFK), só pelo P.O. ou pelo SM; inclusive a fatia AFK em bloqueada (de: planejando) com aguardando troca de modo", "trocar o modo da FT-031", "passar a FT-031 para HITL", "passar a FT-031 para AFK"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "mostrar", "saidas": {"segue no modo atual, ou HITL → AFK recusado (Júnior, PR aberto, o Pleno recusou)": "fim"}},
   {"id": "gravar"},
   {"id": "avisar"}
 ]}
---
# Troca de modo (AFK → HITL, HITL → AFK)

Entrada: o pedido do P.O. ou do SM, no agente `sa-produto`, para trocar o modo de uma fatia viva na sprint; ou a
fatia AFK em `bloqueada (de: planejando)` com `aguardando troca de modo` e o motivo (o plano mostrou risco, passo
`sa-plano.plano.gate`, ou o loop parou a fatia). O Dev não troca o modo: o fluxo dele orienta a falar com o P.O. ou
o SM (agente `sa-produto`) e para.

Ninguém aprova a troca: a regra vem da senioridade do responsável (`equipe.json`), e o Dev responde pela tarefa que
desenvolve.

| Sentido | Janela | Regra |
|---|---|---|
| AFK → HITL | qualquer fase viva, até `aguardando-aprovacao-pr` | sem aprovação: aumenta a verificação |
| HITL → AFK | só sem PR (campo PR do `status.md` = `—`), em qualquer fase até ele | Sênior: direto · Pleno: pergunta a ele e anota a resposta · Júnior: nunca (é sempre HITL) |

A primeira atribuição (fatia com responsável `—`, não iniciada) não é troca: quem assume define o modo pela
senioridade (`sa-planejamento.sprint.modo`).
