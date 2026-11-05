---
{"fluxo": "triar", "dono": "sa-produto",
 "quando": ["toda demanda nova, item a item: pedido em texto, número do EWM (DF, IB), Sustentação, ficha a aprovar, item que voltou", "nova demanda", "o cliente pediu", "registra o defeito 4567", "coloca no backlog", "aprova a ficha da FT-040"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "chegou", "saidas": {"lote do EWM": "→ sa-triar.lote-ewm", "épico novo que voltou, registro completo": "encaminhar", "fatia sem épico que vira épico, se divide ou é cancelada; item de Sustentação cancelado": "registrar", "item de Sustentação devolvido por categoria errada": "triagem", "fatia nova no backlog com só falta: especificação (entra na sprint como especificação)": "→ sa-planejamento.durante.encaixe", "fatia com a [ESP] FT aberta na sprint": "→ sa-especificar.fatia", "fatia nova de épico completada (Completar uma fatia nova)": "encaminhar", "cancelar fatia de épico (ou o épico)": "→ sa-fatiar.refinamento", "o resto (começar ou retomar: hub sa-iniciar)": "fim"}},
   {"id": "triagem", "chama": "sa-entrevistar.entrevistar", "saidas": {"não fazer": "encaminhar"}},
   {"id": "registrar", "chama": "sa-entrevistar.atendimento", "saidas": {"Sustentação que muda o repositório ou com regra de negócio em aberto": "triagem"}},
   {"id": "encaminhar", "saidas": {"sim: mais um item": "chegou", "não": "fim"}}
 ]}
---
# Triar — triagem e registro

Toda demanda nova entra por aqui. Triar é decidir **se** ela entra, **em que trilha** e **com que informação** —
sem começar nada. O que sai é uma linha no `backlog.md` (e, em toda fatia sem épico, a ficha; na Sustentação, o
registro do item e o IB dele no EWM), que o planejamento puxa para a sprint. Começar é pelo hub **`sa-iniciar`**, que
encaminha o item para a skill do papel. O lote do EWM ("importar do EWM", "triar os defeitos do time") é o fluxo
`sa-triar.lote-ewm`.

## Regras

- Toda fatia sem épico sai com a seção Artefatos afetados (padrão `sa-triar/ficha.md`): quem tria autoriza a
  alteração e se compromete com a lista, registrados no fecho dela. Com linha `inclui`, `altera` ou `exclui`, a
  fatia espera a `[ESP] FT` (`sa-especificar.fatia`) com `falta: especificação`.
- Ficha aprovada só muda por pedido explícito: volta a `rascunho` (e a fatia, pela Volta das
  [Situações](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#situações)), mostre a diferença e peça a aprovação de novo; fatia
  `iniciada` ou adiante que dependa da mudança → avise quem a conduz.
