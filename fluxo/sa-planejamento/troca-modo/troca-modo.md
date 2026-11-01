---
{"fluxo": "troca-modo", "dono": "sa-produto",
 "quando": ["fatia AFK em bloqueada (de: planejando) com aguardando troca para HITL: a decisão do P.O. ou do SM, na base (só AFK → HITL)"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "mostrar", "saidas": {"não troca: o Dev retoma no AFK": "→ sa-plano.plano.gate"}},
   {"id": "gravar"},
   {"id": "avisar", "saidas": {"o Dev avisado retoma pela sa-iniciar": "→ sa-desenvolver.desenvolver"}}
 ]}
---
# Troca de modo (AFK → HITL)

Entrada: o plano de uma fatia AFK mostrou risco e o Dev aceitou a sugestão (passo `sa-plano.plano.gate`), ou o loop
parou a fatia: ela está em `bloqueada (de: planejando)` com `aguardando troca para HITL` e o motivo. A decisão é do
P.O. (ou do SM), aqui, na base.

**HITL → AFK nunca.**
