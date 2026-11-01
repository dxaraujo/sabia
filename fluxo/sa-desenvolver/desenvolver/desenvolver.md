---
{"fluxo": "desenvolver", "dono": "sa-desenvolvedor",
 "quando": ["começar ou retomar uma fatia já no backlog (compromisso, `iniciada` na base, branch, pasta, `[DEV]`) e encaminhar pela fase", "vamos trabalhar na FT-031", "pegar a [DEV] da FT-031", "corrigir o defeito 4567", "próxima fatia", "retomar a FT-031"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "chegou", "saidas": {"fatia já iniciada, ou iniciada sem status.md (o responsavel retoma)": "iniciar", "pronta ou concluida na base": "encaminhar", "troca AFK → HITL registrada": "→ sa-plano.plano.gate", "troca AFK → HITL nem registrada nem recusada: a troca é do P.O.": "→ sa-planejamento.troca-modo", "item não registrado": "→ sa-triar.triar", "item fora do papel, dividida ou cancelada": "fim"}},
   {"id": "trilha", "saidas": {"trilha registrada não serve": "→ sa-triar.triar"}},
   {"id": "compromisso", "saidas": {"fora da sprint, fura a fila ou estoura o WIP, sem o encaixe decidido": "→ sa-planejamento.durante.encaixe", "falhou outro item": "fim"}},
   {"id": "iniciar", "saidas": {"[DEV] já fechada e PR mergeado": "→ sa-desenvolver.encerrar", "push da iniciada recusado": "fim"}},
   {"id": "encaminhar", "saidas": {"pesquisando, planejando ou aguardando-aprovacao-plano": "→ sa-plano.plano", "implementando, revisando ou retrabalho": "→ sa-codificar.codificar", "verificando (AFK)": "→ sa-verificar.verificar", "verificada (AFK)": "→ sa-codificar.codificar.pr", "pr-aberto ou em-revisao (HITL)": "→ sa-revisar.hitl", "em-verificacao (HITL)": "→ sa-verificar.verificar", "aguardando-aprovacao-pr (AFK)": "→ sa-revisar.aprovar-pr", "aceita, [APR] concluída, ou pronta com a [DEV] aberta: o merge é desta skill": "→ sa-desenvolver.encerrar", "pronta, sem [DEV] aberta": "→ sa-consolidar.consolidar", "aguardando troca para HITL": "→ sa-planejamento.troca-modo", "AFK com várias fatias planejadas na sprint (oferta)": "→ sa-orquestrar.orquestrar"}}
 ]}
---
# Desenvolver — compromisso e início do código

Começar é um compromisso: daqui em diante a fatia consome a capacidade do time e o lead time corre. Por isso este
fluxo só começa o que já está registrado e planejado; a entrada de trabalho novo é da **`sa-triar`**. É o fluxo do
papel **Dev**: grava `iniciada` na base e assume a `[DEV]` da fatia (passo `iniciar`), encaminha cada fase para a skill dela
(passo `encaminhar`) e, no merge do PR aprovado, grava `pronta` na base e encerra a `[DEV]` (`sa-desenvolver.encerrar`). Revisão (`[REV]`),
verificação (`[VER]`), especificação (`[ESP]`) e os itens `AT-`, `IM-`… da Sustentação (`[ATD]`, `[IMPL]`…) têm
skill própria; a fatia de Manutenção (`FT-`) é deste papel. Na dúvida sobre o item, o hub **`sa-iniciar`** diz qual.

## Regras

- Só começa o que está registrado e planejado: pedido novo ou item fora do backlog vai para a `sa-triar`; fatia
  fora da sprint, para o encaixe.
- O EWM (ou a pessoa) é a fonte dos dados do item; o código, do comportamento atual; o `status.md`, da fase (regra A
  base prevalece).
- Nunca invente dados de work item.
- Não invoque nem simule outra skill do fluxo: diga a próxima (passo `encaminhar`) e pare.
