---
{"resumo": "Entrada: o sim ao concluir um trabalho, o cancelamento ou pedido direto; inclui as regras."}
---
## Entrada

O "sim" a "finalizar a tarefa no ELM?" em três pontos: `sa-desenvolver.encerrar` depois do merge (`DEV`),
`sa-atender.atender` ao concluir o atendimento (`ATD`), e a especificação aprovada (`ESP`: os arquivos de `elm/`
aprovados na `sa-especificar.elm`, ou o PRD aprovado na `sa-prd.prd`). Ou pedido direto. O cancelamento vem de
quem cancela ou tira da sprint.

## Faça

Inclua as regras (`sa-elm.regras`). Guarde o id do Sabiá e o trabalho.

## Saída

Conclusão → passo `achar-tarefa`. Cancelamento → passo `cancelar`. ELM não configurado ou autopilot → fim.

## Pare se

- Nunca: o ELM não configurado devolve a quem chamou, que segue.
