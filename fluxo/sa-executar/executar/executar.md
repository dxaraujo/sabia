---
{"fluxo": "executar", "dono": "sa-produto",
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "chegou", "saidas": {"pedido novo ou id fora do backlog": "→ sa-triar.triar", "AT-nnn ou [ATD]": "→ sa-atender.atender", "item concluido ou cancelado": "fim"}},
   {"id": "registrar", "saidas": {"item fora da sprint aberta: a decisão é do P.O.": "→ sa-planejamento.durante.encaixe", "desdobramento que muda o repositório": "→ sa-triar.triar"}}
 ]}
---
# Executar — Sustentação sem fluxo próprio

Implantação `[IMPL]`, Banco de dados `[BD]`, Infra `[INF]`, Operação `[OPE]`, Apoio a outros times `[EXT]` — e toda
categoria da tabela **Sustentação** do `sabia.md` com Skill `sa-executar`. O trabalho acontece fora do repositório (a
pessoa executa; o agente não roda script, deploy nem comando em ambiente): aqui só se registra. A **`sa-triar`**
registra o item; este fluxo é o de quem **faz**.

Leia antes: `.sabia/sabia.md`. Sem ele → ofereça a **`sa-setup`** ("configurar o Sabiá") e pare.

## Regras

- O agente não executa o trabalho: script, deploy e comando em ambiente são da pessoa; aqui fica o registro.
- **Dado de cliente nunca vai para o git**: fica em `.sabia/local/sustentacao/<pasta>/<ID>/`.
- Registrar o item é da `sa-triar`; este fluxo nunca numera nem abre item (só cria no EWM o IB e a tarefa que
  faltam a um item registrado).
- Lançar horas é registro de empenho, a qualquer momento na tarefa assumida; concluir é o passo `registrar` (item **Concluir**), com o saldo.
