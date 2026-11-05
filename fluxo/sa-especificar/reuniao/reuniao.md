---
{"fluxo": "reuniao", "dono": "sa-especificador",
 "quando": ["ata de reunião com o cliente durante a [ESP] aberta: transcrição (.vtt ou .md) em reunioes/ da pasta de trabalho sem ATA aprovada, ou ATA aprovada não registrada; só chamado pelo encaminhar da especificação ou pela entrevista do PRD, e volta (o pedido direto entra pelo sa-especificar.especificar)"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "transcricao", "saidas": {"sem a pasta de trabalho do épico": "→ sa-especificar.especificar", "ATA draft já escrita para a transcrição": "aprovar", "ATA aprovada sem publicar": "publicar", "ATA aprovada com os D-nn só reservados": "decisoes"}},
   {"id": "escrever"},
   {"id": "aprovar", "saidas": {"ajuste pedido pela pessoa": "escrever", "sem o \"sim\" (a ATA fica draft)": "fim"}},
   {"id": "publicar"},
   {"id": "decisoes", "saidas": {"outra transcrição sem ATA aprovada": "transcricao", "aprovado: decisão que muda o PRD, pela regra da tarefa de especificação": "→ sa-prd.mudanca", "fatiado: alteração de artefato que uma fatia não terminal cobre": "→ sa-especificar.fatia", "fatiado: escopo novo, ou a fatia já terminal": "→ sa-triar.triar"}}
 ]}
---
# Reunião — ata da reunião com o cliente

Cada reunião com o cliente durante a `[ESP]` aberta vira uma **ATA**, a fonte da especificação ao lado do
`decisoes.md`. A ATA nasce da transcrição, é aprovada por uma pessoa e sobe sozinha ao DOORS Next, sem esperar o GATE
do PRD; a transcrição fica nesta máquina. Não há comando de conversão: o gatilho é a transcrição sem ATA aprovada
(ou a ATA aprovada ainda não registrada), no encaminhar da especificação ou no meio da entrevista do PRD; o pedido
direto ("tenho a transcrição da reunião") entra pelo `sa-especificar.especificar`. O fluxo volta a quem chamou.

Entrada: o épico com a `[ESP]` aberta (a linha dele na seção Especificação do `sprint-<nn>.md` aberto, `iniciada`) e a
pasta de trabalho com a transcrição em `reunioes/`.

Leia antes: `.sabia/sabia.md` (ELM, caminhos, papéis).

## Regras

- Só enquanto a `[ESP]` está aberta: reunião fora dela (antes da triagem, depois da conclusão, de vários épicos) não
  tem ATA por este fluxo.
- A transcrição (o arquivo da reunião e o `.transcricao.md`) nunca vai para anexo, base nem ELM.
- Nunca invente fala, decisão ou participante: o que a transcrição não diz não entra na ATA.
- Não invoque outra skill por conta própria: volte a quem chamou, ou diga a próxima e pare.
