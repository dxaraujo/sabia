---
{"fluxo": "orquestrar", "dono": "sa-orquestrador",
 "travas_gerais": ["sim-da-pessoa", "pr-lido-por-pessoa", "sem-force"],
 "passos": [
   {"id": "retomar", "saidas": {"retoma o loop": "fases"}},
   {"id": "lote", "saidas": {"checkout principal fora da base ou sujo, ou push do lote recusado": "fim"}},
   {"id": "worktree"},
   {"id": "fases", "chama": ["sa-pesquisar.pesquisar", "sa-plano.plano", "sa-revisar.revisar", "sa-codificar.codificar", "sa-verificar.verificar"], "travas": ["backpressure", "revisao-independente", "aceite-independente"]},
   {"id": "parada", "saidas": {"PR com a [APR] concluída: o merge é de quem disparou": "→ sa-desenvolver.encerrar", "PR para ler e aprovar": "→ sa-revisar.aprovar-pr", "plano para aprovar": "→ sa-revisar.aprovar-plano", "troca de modo: P.O. ou SM (agente sa-produto)": "→ sa-planejamento.troca-modo"}}
 ]}
---
# Loop — fatias AFK até o PR

Quem executa é o agente **`sa-orquestrador`** (ou a sessão da pessoa, com os mesmos passos). Ele coordena e
registra; cada fase é feita por um subagente que começa do zero e lê o estado do disco. A pessoa fica **sobre** o
loop, não dentro: aprova o lote no início, um Dev Sênior aprova os planos que pedem GATE e lê cada PR no fim (tarefas
`[APR]`); quem disparou o loop é o Dev responsável e faz o merge de cada PR aprovado (`sa-desenvolver.encerrar`).

Leia antes: `.sabia/sabia.md` (seções Git, banco e autonomia e Comandos) e
`<produto>/acordos.md` (WIP por revisor; sem o arquivo, 2 por revisor).

**Quem dispara** tem de ser Dev **Pleno** ou **Sênior** (`senioridade` no `equipe.json` da base): é o responsável
das `[DEV]` do lote. Júnior → diga que Júnior implementa sempre em HITL, uma fatia por vez pela `sa-desenvolver`,
e pare.

## Regras

- O orquestrador nunca faz merge (é de quem disparou o loop, depois da aprovação do PR), nunca `--force`, nunca
  push sem a autorização do lote (na base, só o da `iniciada` do lote, passo `lote`); todo push é conferido no remoto
  antes do PR.
- ELM só pelo que o lote confirmou (mover ou criar o IB e a `[DEV]` que faltam na sprint, cancelar a `[REV]` e a `[VER]` HITL que ficaram, assumir `[DEV]`, estados, criar as `[APR]` nos gates) e pelas horas do fim; nada mais (a conclusão da `[DEV]` é no merge). Sem o MCP `elm` ou com
  falha → `ELM pendente [<chave>]: …` no `status.md`.
- Nunca relaxe um gate para o loop andar: bloqueio é informação, não falha.
- Tipo de fatia que bloqueia com frequência → sugira na retrospectiva tratá-lo como HITL.
