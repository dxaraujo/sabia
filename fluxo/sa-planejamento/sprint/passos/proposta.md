---
{"resumo": "Proposta da sprint na tela, com as três seções (Fatias, Especificação, Reserva) e a capacidade; espera o ok."}
---
## Entrada

Os passos `senioridade` a `iteracao` feitos.

## Faça

**Proposta**, com as três seções:
```
🗓️ <pai>/Sprint <nn> · <início> → <fim> · iteração <pai>/<nome> · plano <nome> - <nome curto da meta> · meta: <…>
Fatias
| Prioridade | FT | Título | Origem | Tam. | Modo | Depende de | Responsável | Revisor | Verificador |   (— = sem responsável)
Especificação
| EP · FT | Falta (não pronto) | Responsável | Horas previstas |
Reserva (Sustentação + retrabalho): <h>h (<p>% da sprint) · retrabalho migrado <x>h · itens <AT-…> <y>h · livre <z>h
Capacidade: revisão <h>h (usa <x>h) · especificação <h>h (usa <x>h) · vazão prevista <n> fatias · lead time médio <d> dias · HITL <h>h
Próximas a puxar (fora da previsão, na ordem): <FT…>
```

## Saída

"ok" → passo `gravar`; ajuste pedido → a proposta de novo.

## Pare se

Sem o "ok", nada é gravado (regra de ouro).
