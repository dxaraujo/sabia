---
{"fluxo": "durante", "dono": "sa-produto",
 "quando": ["sprint aberta: sincronizar com o EWM ou puxar um item para a sprint (encaixe): fatia, épico ou item de Sustentação que o fluxo de quem executa parou com \"fale com o P.O. ou o SM\", a Sustentação com a reserva estourada ou a linha encaixe da sincronização", "sincroniza a sprint", "sincronizar com o EWM", "encaixe na sprint", "puxar a FT-031 para a sprint"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "sincronizar", "saidas": {"nenhuma linha encaixe": "fim"}},
   {"id": "encaixe", "saidas": {"a próxima linha encaixe da sincronização": "encaixe", "decidido: o executor retoma pela própria skill": "fim"}}
 ]}
---
# Durante a sprint

Entrada: a sprint aberta. "Sincroniza a sprint", "sincronizar com o EWM" → passo `sincronizar`; o pedido de puxar
um item para a sprint, o caso 3 da entrada de qualquer fluxo (o item fora da sprint aberta) ou a `sa-triar` (item
de Sustentação com a reserva estourada) → passo `encaixe`. "Como está a sprint?" é da `sa-status`.

**A sprint é cadência, não contêiner de escopo:** o time se compromete com a **meta**; a seleção do planejamento é
uma **previsão**. Dentro da sprint o fluxo é **puxado** — terminou uma fatia, a `elegivel` do topo entra enquanto o
WIP de revisão humana tiver folga —, e a puxada é sempre o encaixe (passo `encaixe`): feita pelo P.O., pelo SM ou
por quem puxa com a orientação ou a aprovação do P.O., registrada.
