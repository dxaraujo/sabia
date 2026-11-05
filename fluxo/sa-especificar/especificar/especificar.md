---
{"fluxo": "especificar", "dono": "sa-especificador",
 "quando": ["especificação de épico: EP-nn ou [ESP] EP-nn, da tarefa [ESP] à conclusão dela depois do GATE do PRD, com a publicação no ELM", "especificar o EP-03", "pegar a [ESP] do EP-03", "retomar a especificação", "fechar a sessão de especificação", "tenho a transcrição da reunião", "registrar a ata da reunião", "tenho o protótipo", "o cliente aprovou o protótipo"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "sprint": "exige", "saidas": {"PRD na base na Fase aprovado, com a Especificação ainda iniciada, sem mudança aberta e ainda não registrada e sem transcrição sem ATA aprovada": "fechamentos"}},
   {"id": "assumir"},
   {"id": "pasta"},
   {"id": "encaminhar", "chama": ["sa-especificar.reuniao", "sa-especificar.prototipo", "sa-prd.prd"], "saidas": {"aprovado na pasta de trabalho": "fechamentos"}},
   {"id": "fechar-sessao", "saidas": {"sessão sem GATE novo, ou fechada pelo Pare se do publicar": "fim"}},
   {"id": "fechamentos"},
   {"id": "publicar"},
   {"id": "concluir", "saidas": {"PRD publicado e a [ESP] concluída: o fatiamento, do P.O. ou do SM": "→ sa-fatiar.fatiar"}}
 ]}
---
# Especificar — especificação de épico

A especificação de um épico é trabalho junto ao cliente — levantamento de regras e definições — que dura várias
sessões antes do GATE do PRD. Ele fica registrado na tarefa `[ESP]` do EWM, não na base: até o GATE, a base só
recebe a situação do épico (passo `assumir`); o resto vai com o PRD aprovado. A `[ESP]` termina com a publicação no
ELM do que o GATE do PRD aprovou, ligado a ela (passos `publicar` e `concluir`): logo em seguida vem o fatiamento, que,
com o backlog, é do P.O. ou do SM (`sa-fatiar`). Este fluxo é o do papel **Especificador**; o
épico chega `novo` ou `elegivel` pela `sa-triar` e `planejado` (com a `[ESP]`) pela `sa-planejamento`.

Entrada: `EP-nn` ou `[ESP] EP-nn` — a linha do épico em `## Épicos` do `backlog.md` da base, com a linha viva na seção
Especificação do `sprint-<nn>.md` aberto (fora da sprint, a entrada manda ao P.O. ou ao SM).

Leia antes: `.sabia/sabia.md`. Sem ele → ofereça a **`sa-setup`** ("configurar o Sabiá") e pare.

## Entrada: vizinhos

- `[ESP] FT-nnn` (fatia `nova` em especificação na sprint, ou de volta à especificação) → `sa-especificar.fatia`
- `aprovado` na base com a linha viva da Especificação `planejada` de uma `[ESP] EP-nn Revisão <n>` (a mudança antes do fatiamento) → `sa-prd.mudanca`
- `aprovado` na base com a Especificação `concluida` e transcrição sem ATA aprovada (a `[ESP]` reaberta ou a Revisão, depois a reunião) → `sa-prd.mudanca`
- `aprovado` na base com a Especificação `iniciada` e transcrição sem ATA aprovada (a `[ESP]` já reaberta ou a Revisão já assumida, antes da reunião) → `sa-prd.mudanca`
- `aprovado` na base com a Especificação `iniciada` de uma mudança aberta e ainda não registrada — a linha com a Observação `reaberta: <motivo>` ou `revisão <n>: <motivo>` e nenhum commit `EP-<nn> registrar mudança do PRD` depois do commit dela (`EP-<nn> reabrir especificação` ou `EP-<nn> iniciar especificação`; `git log --format=%s origin/<base>`) → `sa-prd.mudanca`
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
