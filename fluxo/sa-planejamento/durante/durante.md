---
{"fluxo": "durante", "dono": "sa-produto",
 "quando": ["sprint aberta: acompanhar, sincronizar com o EWM ou decidir um encaixe (fura a fila, WIP de revisão no limite, Sustentação com a reserva estourada)", "como está a sprint?", "sincroniza a sprint", "sincronizar com o EWM", "encaixe na sprint"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "acompanhar", "saidas": {"fura a fila, WIP de revisão no limite ou Sustentação com a reserva estourada": "encaixe", "só a situação da sprint": "fim"}},
   {"id": "sincronizar", "saidas": {"nenhuma linha encaixe": "fim"}},
   {"id": "encaixe", "saidas": {"a próxima linha encaixe da sincronização": "encaixe", "veio da sa-desenvolver": "→ sa-desenvolver.desenvolver.compromisso"}}
 ]}
---
# Durante a sprint

Entrada: a sprint aberta. "Como está a sprint?" → passo `acompanhar`; "sincroniza a sprint", "sincronizar com o
EWM" → passo `sincronizar`; a `sa-desenvolver` (fura a fila ou estoura o WIP) ou a `sa-triar` (item de Sustentação
com a reserva estourada) mandam para cá → passo `encaixe`.

**A sprint é cadência, não contêiner de escopo:** o time se compromete com a **meta**; a seleção do planejamento é
uma **previsão**. Dentro da sprint o fluxo é **puxado** — terminou uma fatia, a `elegivel` do topo entra, enquanto o
WIP de revisão humana tiver folga (a `sa-desenvolver` puxa, sem cerimônia). O Encaixe (passo `encaixe`) fica para
quem fura a fila ou estoura o WIP.
