---
{"fluxo": "especificar", "dono": "sa-especificador",
 "quando": ["especificação de épico: EP-nn ou [ESP] EP-nn, da tarefa [ESP] à conclusão dela no GATE do PRD", "especificar o EP-03", "pegar a [ESP] do EP-03", "retomar a especificação", "fechar a sessão de especificação", "tenho a transcrição da reunião", "registrar a ata da reunião", "tenho o protótipo", "o cliente aprovou o protótipo"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "sprint": "exige", "saidas": {"PRD na base na Fase aprovado, com a Especificação ainda iniciada": "fechamentos"}},
   {"id": "assumir"},
   {"id": "pasta"},
   {"id": "encaminhar", "chama": ["sa-especificar.reuniao", "sa-especificar.prototipo", "sa-prd.prd"], "saidas": {"aprovado na pasta de trabalho": "fechamentos"}},
   {"id": "fechar-sessao", "saidas": {"sessão sem GATE novo": "fim"}},
   {"id": "fechamentos", "saidas": {"GATE do PRD: PRD na base, [ESP] concluída": "→ sa-fatiar.fatiar"}}
 ]}
---
# Especificar — especificação de épico

A especificação de um épico é trabalho junto ao cliente — levantamento de regras e definições — que dura várias
sessões antes do GATE do PRD. Ele fica registrado na tarefa `[ESP]` do EWM, não na base: até o GATE, a base só
recebe a situação do épico (passo `assumir`); o resto vai com o PRD aprovado. A `[ESP]` termina no GATE do PRD: o
fatiamento e o backlog são do P.O. ou do SM (`sa-fatiar`). Este fluxo é o do papel **Especificador**; o
épico chega `novo` ou `elegivel` pela `sa-triar` e `planejado` (com a `[ESP]`) pela `sa-planejamento`.

Entrada: `EP-nn` ou `[ESP] EP-nn` — a linha do épico em `## Épicos` do `backlog.md` da base, com a linha viva na seção
Especificação do `sprint-<nn>.md` aberto (fora da sprint, a entrada manda ao P.O. ou ao SM).

Leia antes: `.sabia/sabia.md`. Sem ele → ofereça a **`sa-setup`** ("configurar o Sabiá") e pare.

## Entrada: vizinhos

- `[ESP] FT-nnn` (fatia `nova` em especificação na sprint, ou de volta à especificação) → `sa-especificar.fatia`
- `aprovado` na base com a Especificação `concluida` e transcrição sem ATA aprovada (reabre a `[ESP]`, depois a reunião) → `sa-prd.mudanca`
- `aprovado` na base com a Especificação `concluida` (o fatiamento, do P.O. ou do SM, agente `sa-produto`) → `sa-fatiar.fatiar`
- `fatiado` (cancelar fatias ou o épico, do P.O. ou do SM, agente `sa-produto`) → `sa-fatiar.refinamento`

## Regras

- Até o GATE do PRD, nada da especificação vai para a base — só a situação do passo `assumir`: o registro é a `[ESP]`
  (comentários e anexos), atualizado ao fechar cada sessão.
- Nunca invente regra, valor ou ator: sem fonte e sem decisão de uma pessoa, é `em aberto`.
- Dado de cliente identificável não vai para os anexos: no rascunho, só o resumo anônimo.
- A transcrição de reunião (`reunioes/` da pasta de trabalho) fica só nesta máquina: nunca vai para anexo, base nem
  ELM; o que sobe é a ATA (`sa-especificar.reuniao`).
- Toda escrita no EWM só com "sim"; sem o MCP `elm`, `ELM pendente` ([pendências](~/.sabia/framework/skills/sabia/references/elm.md#pendências)), e o fluxo segue.
- Não invoque outra skill por conta própria: diga a próxima e pare.
