---
{"resumo": "Lint do conhecimento (épico, sprint ou pedido; nunca a cada fatia): contradições entre glossário, ADRs, bundle do ELM e steering, como achados."}
---
## Entrada

Retrospectiva de épico — a consolidação da última fatia o sugere — ou de sprint, ou quando a pessoa pedir.

## Faça

**Lint do conhecimento** (retrospectiva de épico — a consolidação da última fatia o sugere — ou de sprint, ou
quando a pessoa pedir; nunca a cada fatia): procure contradições entre glossário, ADRs, bundle do ELM (pelo
`elm_buscar_req_local`) e steering — termo com duas definições, ADR superado sem marcação, regra do ELM que o código não
segue. Liste como achados na retrospectiva; cada um vira correção na fonte ou fatia nova.

## Saída

Os achados na retrospectiva: o fluxo termina.

## Pare se

Retrospectiva de fatia sem pedido da pessoa → não rode o lint.
