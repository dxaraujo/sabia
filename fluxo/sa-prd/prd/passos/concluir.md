---
{"resumo": "Oferece finalizar a tarefa ESP no ELM e seguir para o fatiamento na mesma sessão; o épico fica em-especificacao até o fatiamento."}
---
## Entrada

O `prd.md` aprovado e gravado.

## Faça

1. **Tarefa.** Com tarefa `ESP` na linha do `sprint-<nn>.md`, "finalizar a tarefa no ELM?"; sim → `sa-elm.finalizar`,
   que oferece as horas. A resposta não muda o fluxo.
2. **Próximo.** "Seguir para o fatiamento?" (`sa-refinar.fatiar`) na mesma sessão. O épico fica `em-especificacao`
   até a `sa-refinar.fatiar` gravar `fatiado`. Os requisitos sobem ao DOORS pelas fatias, não daqui.

## Saída

Sim → passa à `sa-refinar.fatiar`. Senão, termine com o resumo.

## Pare se

Nenhum caso próprio deste passo.
