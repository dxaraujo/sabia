---
{"fluxo": "codificar", "dono": "sa-desenvolvedor",
 "travas_gerais": ["sim-da-pessoa", "backpressure", "sem-force"],
 "passos": [
   {"id": "onde", "saidas": {"fatia `verificada` (AFK)": "pr", "aceita (HITL) ou aguardando-aprovacao-pr (AFK): o merge é da sa-desenvolver": "→ sa-desenvolver.encerrar", "outra fase ou sem status.md": "→ sa-desenvolver.desenvolver", "sem a linha do GATE do plano": "fim"}},
   {"id": "tarefa", "desvio": true, "travas": ["toolkit-sem-commit"], "saidas": {"ainda há tarefa não marcada": "tarefa", "divergência com o plano que muda o desenho": "→ sa-plano.replanejar"}},
   {"id": "validar"},
   {"id": "revisar", "chama": "sa-revisar.revisar", "travas": ["revisao-independente"], "saidas": {"HITL, APROVADO ou a pessoa decide seguir": "pr", "REVISAR": "tarefa", "AFK, 2ª reprovação: bloqueada": "fim"}},
   {"id": "verificar", "chama": "sa-verificar.verificar", "travas": ["aceite-independente"], "saidas": {"REJEITADO": "tarefa", "2ª rejeição seguida: bloqueada": "fim"}},
   {"id": "pr", "saidas": {"HITL, PR aberto": "→ sa-revisar.hitl", "AFK, PR aberto": "→ sa-revisar.aprovar-pr", "pedido de merge nesta sessão": "→ sa-desenvolver.encerrar"}}
 ]}
---
# Codificar — ciclo curto, verificação sempre

Entrada: `.kiro/specs/<ft>-<slug>/` com o plano aprovado (`status.md` com fase `implementando` ou `retrabalho (de:
…)`), na branch da fatia. O **modo** do `status.md` decide o caminho até o PR (passo `pr`): **HITL** vai direto, depois
da revisão automática; **AFK** passa antes pela revisão e pela verificação por subagente (passos `revisar` e
`verificar`). Nos dois, o fluxo termina no PR: a `[DEV]` fica em andamento, e o merge do PR aprovado e a conclusão
dela são do fluxo `sa-desenvolver.encerrar`. No Kiro, cada tarefa também pode ser executada pelo **"Start task"** do `tasks.md` — as regras valem igual.

Leia antes: `design.md` inteiro, `research.md`, `.sabia/sabia.md` (comandos, regras críticas,
regras aprendidas).

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
