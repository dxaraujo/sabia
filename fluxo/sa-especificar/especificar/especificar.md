---
{"fluxo": "especificar", "dono": "sa-especificador",
 "quando": ["especificação de épico: EP-nn ou [ESP] EP-nn, da tarefa [ESP] à conclusão dela depois do GATE do backlog", "especificar o EP-03", "pegar a [ESP] do EP-03", "retomar a especificação", "fechar a sessão de especificação"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "chegou", "saidas": {"[ESP] FT-nnn: o fluxo fatia": "→ sa-especificar.fatia", "pedido em texto ou épico fora do backlog: não registrado": "→ sa-triar.triar", "não é deste papel, ou concluido/cancelado": "fim", "concluido com a linha da Especificação ainda iniciada": "fechamentos"}},
   {"id": "assumir", "saidas": {"nenhuma sprint aberta: o planejamento": "→ sa-planejamento.sprint"}},
   {"id": "pasta"},
   {"id": "encaminhar", "chama": ["sa-prd.prd", "sa-fatiar.fatiar"], "saidas": {"aprovado na pasta de trabalho, ou fatiado com a Especificação iniciada": "fechamentos", "fatiado com a Especificação concluida, para dividir, juntar ou cancelar fatias": "→ sa-fatiar.refinamento", "fatiado com a Especificação concluida, sem mais nada": "fim"}},
   {"id": "fechar-sessao", "saidas": {"sessão sem GATE novo": "fim"}},
   {"id": "fechamentos", "saidas": {"GATE do PRD: PRD aprovado na base": "→ sa-fatiar.fatiar"}}
 ]}
---
# Especificar — especificação de épico

A especificação de um épico é trabalho junto ao cliente — levantamento de regras e definições — que dura várias
sessões antes do GATE do PRD. Ele fica registrado na tarefa `[ESP]` do EWM, não na base: até o GATE, a base só
recebe a situação do épico (passo `assumir`); o resto vai com o PRD aprovado. Este fluxo é o do papel **Especificador**; o
épico chega `novo` ou `elegivel` pela `sa-triar` e `planejado` (com a `[ESP]`) pela `sa-planejamento`.

Leia antes: `.sabia/sabia.md`. Sem ele → ofereça a **`sa-setup`** ("configurar o Sabiá") e pare.

## Regras

- Até o GATE do PRD, nada da especificação vai para a base — só a situação do passo `assumir`: o registro é a `[ESP]`
  (comentários e anexos), atualizado ao fechar cada sessão.
- Nunca invente regra, valor ou ator: sem fonte e sem decisão de uma pessoa, é `em aberto`.
- Dado de cliente identificável não vai para os anexos: no rascunho, só o resumo anônimo.
- Toda escrita no EWM só com "sim"; sem o MCP `elm`, `ELM pendente` ([pendências](~/.sabia/framework/skills/sabia/references/elm.md#pendências)), e o fluxo segue.
- Não invoque outra skill por conta própria: diga a próxima e pare.
