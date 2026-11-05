---
{"fluxo": "desenvolver", "dono": "sa-desenvolvedor",
 "quando": ["começar uma fatia planejada na sprint aberta (compromisso, `iniciada` na base, branch, pasta, `[DEV]`) ou retomar a que parou entre o registro e a branch", "vamos trabalhar na FT-031", "pegar a [DEV] da FT-031", "corrigir o defeito 4567", "próxima fatia", "retomar a FT-031"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "sprint": "exige", "saidas": {"iniciada sem status.md em nenhuma branch: só o responsavel retoma": "iniciar"}},
   {"id": "compromisso", "saidas": {"trilha registrada não serve": "→ sa-triar.triar", "outro item falhou (responsável, Júnior em AFK, DoR, registro, dono do pai)": "fim"}},
   {"id": "iniciar", "saidas": {"fatia iniciada: Próximo sa-plano": "→ sa-plano.plano", "[DEV] já fechada e PR mergeado": "→ sa-desenvolver.encerrar", "push da iniciada recusado": "fim"}}
 ]}
---
# Desenvolver — compromisso e início do código

Começar é um compromisso: daqui em diante a fatia consome a capacidade do time e o lead time corre. Por isso este
fluxo só começa o que já está registrado e planejado na sprint aberta; a entrada de trabalho novo é da **`sa-triar`**,
e a puxada para a sprint, do encaixe (P.O. ou SM, agente `sa-produto`). É o fluxo do papel **Dev**: confere o
compromisso, grava `iniciada` na base e assume a `[DEV]` da fatia (passo `iniciar`); o merge do PR aprovado, a
`pronta` na base e a conclusão da `[DEV]` são a outra linha do tempo (`sa-desenvolver.encerrar`). Revisão (`[REV]`),
verificação (`[VER]`), especificação (`[ESP]`) e os itens `AT-`, `IM-`… da Sustentação (`[ATD]`, `[IMPL]`…) têm
skill própria; a fatia de Manutenção (`FT-`) é deste papel.

Deste fluxo: a fatia registrada, `planejada` na sprint aberta e sem `status.md` em nenhuma branch; ou `iniciada` no
`backlog.md` sem `status.md` em nenhuma branch (a sessão parou entre o registro e a branch: passo `iniciar`). "Próxima
fatia" → a `planejada` de maior prioridade da sprint aberta (empate: a mais acima na tabela), de quem pede ou com
`responsavel` `—`, sem `status.md` em nenhuma branch ou worktree; nenhuma → "fale com o P.O. ou o SM (agente
`sa-produto`)" e pare.

## Entrada: vizinhos

- `bloqueada (de: …)` com Bloqueio `aguardando especificação [ESP] FT-<nnn>` que é de quem especifica ([De quem é a Volta](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação)) → `sa-especificar.fatia` (agente `sa-especificador`)
- `pesquisando`, `planejando`, `aguardando-aprovacao-plano` sem a `[APR]` ou `bloqueada (de: pesquisando | planejando)`, inclusive "aguardando troca de modo" → `sa-plano.plano`
- `aguardando-aprovacao-plano` com a `[APR] Aprovar plano` criada → `sa-revisar.aprovar-plano` (agente `sa-revisor`)
- `implementando`, `revisando`, `verificando`, `verificada`, `retrabalho (de: …)`, `bloqueada (de: implementando | revisando | verificando)` ou `aguardando-aprovacao-pr` com Modo HITL na base (troca de modo) → `sa-codificar.codificar`
- `aceita`, `aguardando-aprovacao-pr` com a `[APR] Aprovar PR` concluída, ou `pronta` com a `[DEV]` aberta → `sa-desenvolver.encerrar`

## Regras

- Só começa o que está registrado e na sprint aberta (passo `entrada`); nunca puxe item para a sprint: é do encaixe.
- O EWM (ou a pessoa) é a fonte dos dados do item; o código, do comportamento atual; o `status.md`, da fase (regra A
  base prevalece).
- Nunca invente dados de work item.
- Não invoque nem simule outra skill do fluxo: diga a próxima e pare.
