---
{"resumo": "Toda escrita no ELM: prévia, o sim, idempotência e nunca apagar."}
---
## Entrada

Qualquer escrita no ELM que o fluxo fará.

## Faça

- **Prévia e "sim".** Antes de escrever, mostre `Ação (criar | atualizar | transição | ligar | lançar | sem
  mudança) | Alvo | Título` e espere o "sim" (um "sim" por lote). Nomes e números do EWM ou do DOORS, nunca ids
  internos. A escrita é `ask` nos primários `sa-desenvolvedor` e `sa-especificador` e `deny` nos subagentes e no
  autopilot.
- **Idempotente.** Id já gravado no Sabiá (coluna `ib`, coluna Tarefas) → use esse e não crie de novo. Sem id,
  procure uma criação interrompida pelo título (`elm_listar_wi` com `titulo_prefixo`, `elm_buscar_req`); achou →
  mostre e pergunte se é ele.
- **Nunca apaga.** Tarefa ou IB que deixou de valer é cancelado (`elm_transicao` cancelar). A exclusão de
  requisito vira roteiro manual da `sa-elm.publicar`. A remoção de horas (`elm_remover_horas`) só a pedido.

## Saída

Segue para o passo `leitura`.

## Pare se

- Sem o "sim" → nada é escrito; diga o que ficou de fora e devolva.
