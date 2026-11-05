---
{"fluxo": "hitl", "dono": "sa-verificador",
 "quando": ["fatia HITL com a tarefa [VER] e a fase em-verificacao: a verificação oficial, depois da REV", "pegar a [VER] da FT-031", "verifica a FT-031"],
 "travas_gerais": ["sim-da-pessoa", "aceite-independente"],
 "passos": [
   {"id": "entrada", "de": "entrada", "sprint": "nao"},
   {"id": "assumir", "saidas": {"quem está na sessão implementa a fatia": "fim"}},
   {"id": "cenarios", "chama": "sa-verificar.verificar", "saidas": {"bloqueada no verificar (só ⚠️ ambiente, ou cenário errado na ficha sem épico): a entrega, sem a decisão": "entrega"}},
   {"id": "decisao"},
   {"id": "entrega", "saidas": {"ACEITO: a fatia aceita espera o merge do Dev": "→ sa-desenvolver.encerrar", "REJEITADO: o retrabalho é do Dev": "→ sa-codificar.codificar", "volta à especificação, [ESP] FT aberta ou reaberta: bloqueada, é do especificador": "→ sa-especificar.fatia", "volta à especificação, [ESP] FT concluída numa sprint fechada (com sprint aberta) ou inexistente: o encaixe, do P.O. ou do SM": "→ sa-planejamento.durante", "volta à especificação, sem sprint aberta: pendência do P.O. na [GB]": "→ sa-planejamento.sprint", "bloqueada por ambiente: você retoma quando o Bloqueio se resolve": "fim", "bloqueada pela pergunta da ficha: é do P.O.": "→ sa-triar.triar"}}
 ]}
---
# Verificação HITL — a `[VER]` sobre o PR

Entrada: fatia `Modo: HITL` com a tarefa `[VER]` e `fase: em-verificacao` — a REV aprovou antes (retomando uma
verificação interrompida, também) —, na branch do PR (passo `entrada`), e a rodada de verificação é sua. Também
`bloqueada (de: em-verificacao)` com o Bloqueio do ambiente ou da pergunta da ficha (passo `cenarios`): resolvido — o
ambiente de volta, ou a ficha respondida em `origin/<base>` (`git show`) —, `Bloqueio: —`, `fase: em-verificacao` e
siga; sem resolver, mostre o motivo e a pergunta e pare.

Quem implementou não verifica: prefira o agente **`sa-verificador`** (contexto limpo; não implementou a fatia). Os
cenários rodam pelo fluxo `verificar` (passo `cenarios`); a possível alteração o agente indica, e quem decide se volta
à especificação é você (passo `decisao`).

## Entrada: vizinhos

- `pr-aberto` ou `em-revisao` → "a `[VER]` espera a revisão (agente `sa-revisor`)" ■
- `retrabalho (de: em-revisao)` ou `(de: em-verificacao)` → `sa-codificar.codificar` (agente `sa-desenvolvedor`: o retrabalho é do Dev, no mesmo PR)
- `bloqueada (de: em-verificacao)` com Bloqueio `aguardando especificação [ESP] FT-<nnn>` ([De quem é a Volta](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação)): de quem especifica → `sa-especificar.fatia` (agente `sa-especificador`); do Dev → `sa-codificar.codificar` (agente `sa-desenvolvedor`)
- `aceita`, ou o PR mergeado pelo Sabiá (com a aprovação registrada) sem `pronta` na base → `sa-desenvolver.encerrar` (agente `sa-desenvolvedor`: o merge e o registro dele são do Dev)
- PR mergeado por fora do Sabiá, sem `pronta` na base → "sincroniza a sprint (P.O. ou SM, agente `sa-produto`)" ■

## Regras

- Não invoque nem simule outra skill do fluxo: termine com a decisão e o aviso ao Dev e pare.
