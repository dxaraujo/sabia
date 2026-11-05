---
{"fluxo": "codificar", "dono": "sa-desenvolvedor",
 "travas_gerais": ["sim-da-pessoa", "backpressure", "sem-force"],
 "passos": [
   {"id": "entrada", "de": "entrada", "sprint": "nao"},
   {"id": "onde", "saidas": {"fatia `verificada` (AFK)": "pr", "sem a linha do GATE do plano": "fim", "aguardando-aprovacao-pr que virou HITL: pr-aberto, revisor avisado": "→ sa-revisar.hitl"}},
   {"id": "tarefa", "desvio": true, "travas": ["toolkit-sem-commit"], "saidas": {"ainda há tarefa não marcada": "tarefa", "divergência com o plano que muda o desenho": "→ sa-plano.replanejar"}},
   {"id": "validar"},
   {"id": "revisar", "chama": "sa-revisar.revisar", "travas": ["revisao-independente"], "saidas": {"HITL, APROVADO ou a pessoa decide seguir": "pr", "REVISAR": "tarefa", "AFK, 2ª reprovação: bloqueada": "fim"}},
   {"id": "verificar", "chama": "sa-verificar.verificar", "travas": ["aceite-independente"], "saidas": {"REJEITADO": "tarefa", "2ª rejeição seguida: bloqueada": "fim"}},
   {"id": "pr", "saidas": {"HITL, PR aberto": "→ sa-revisar.hitl", "AFK, PR aberto": "→ sa-revisar.aprovar-pr", "pedido de merge nesta sessão": "→ sa-desenvolver.encerrar"}}
 ]}
---
# Codificar — ciclo curto, verificação sempre

Deste fluxo: `.kiro/specs/<ft>-<slug>/` com o plano aprovado (`status.md` com fase `implementando`, `revisando`,
`verificando`, `verificada` ou `retrabalho (de: …)`, ou `bloqueada` de uma delas; `bloqueada (de: em-revisao |
em-verificacao | aguardando-aprovacao-pr)` com Bloqueio `aguardando especificação` que é do Dev ([De quem é a Volta](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação): a linha `concluida` com o motivo do Bloqueio na Observação); ou `aguardando-aprovacao-pr` com
Modo HITL na base: a troca de modo do P.O. ou do SM cancelou a `[APR] Aprovar PR`), na branch da fatia. O **modo** do `status.md` decide o caminho até o PR (passo `pr`): **HITL** vai direto, depois
da revisão automática; **AFK** passa antes pela revisão e pela verificação por subagente (passos `revisar` e
`verificar`). Nos dois, o fluxo termina no PR: a `[DEV]` fica em andamento, e o merge do PR aprovado e a conclusão
dela são do fluxo `sa-desenvolver.encerrar`. No Kiro, cada tarefa também pode ser executada pelo **"Start task"** do `tasks.md` — as regras valem igual.

Leia antes: `design.md` inteiro, `research.md`, `.sabia/sabia.md` (comandos, regras críticas,
regras aprendidas).

## Entrada: vizinhos

- sem `status.md` em nenhuma branch (fatia não iniciada) → `sa-desenvolver.desenvolver`
- `pesquisando`, `planejando`, `aguardando-aprovacao-plano` sem a `[APR]` ou `bloqueada (de: pesquisando | planejando)` → `sa-plano.plano`
- `aguardando-aprovacao-plano` com a `[APR] Aprovar plano` criada → `sa-revisar.aprovar-plano` (agente `sa-revisor`)
- `aguardando-aprovacao-pr` (Modo AFK na base) com a `[APR] Aprovar PR` aberta → `sa-revisar.aprovar-pr` (agente `sa-revisor`)
- `aceita`, ou `aguardando-aprovacao-pr` com a `[APR] Aprovar PR` concluída: o merge → `sa-desenvolver.encerrar`
- `bloqueada (de: …)` com Bloqueio `aguardando especificação [ESP] FT-<nnn>` que é de quem especifica ([De quem é a Volta](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação)) → `sa-especificar.fatia` (agente `sa-especificador`)
- `bloqueada (de: em-verificacao)` com o Bloqueio do ambiente ou da pergunta da ficha → `sa-verificar.hitl` (agente `sa-verificador`: a retomada é do verificador)

## Modo autônomo

`AUTONOMO=true` (chamado pelo `sa-orquestrador`/`sa-orquestrar`): sem perguntas; trabalhe só na worktree recebida;
**não** faça push nem abra PR (o orquestrador faz); bloqueio vira `fase: bloqueada (de: <fase>)` com o motivo e a pergunta, e você para.

## Regras

- Nunca `--force`; merge só o da base para a branch, por uma pessoa (passo `pr`), e o do PR aprovado, pelo Dev
  responsável (`sa-desenvolver.encerrar`); push, aqui, só da branch da fatia, nunca da base (os registros de situação
  na base são da `sa-desenvolver`), com confirmação (ou pelo orquestrador, com a autorização do lote); depois de todo
  push, conferir no remoto antes de seguir.
- Nada fora do escopo do `design.md`; melhoria vista no caminho vira sugestão de item no backlog (registrada pela `sa-triar`).
- Não invoque nem simule outra skill do fluxo: ao terminar (PR entregue, bloqueio, divergência), diga a próxima e
  pare. Os subagentes revisor e verificador, que os passos mandam chamar, fazem parte deste fluxo.
