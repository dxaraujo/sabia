---
{"resumo": "A pessoa tria cada achado (corrige · adia · volta-plano · volta-spec · descarta), oferece revisão humana quando o Risco pede e aprova no MR sem BLOQUEANTE aberto, ou pede mudanças."}
---
## Entrada

Os achados (passo `criterios-revisao`).

## Faça

1. A pessoa tria cada achado:

| Destino | O que acontece |
|---|---|
| corrige | thread no MR; ajuste pequeno vai como suggested change, que o autor aplica |
| adia | cadastro de um bug ou fatia com `origem FT-nnn` na `obs` (passo `cadastro`) |
| volta-plano | thread para o autor, que segue pela `sa-plano.replanejar` |
| volta-spec | thread; o autor registra em Em aberto do `status.md` a pergunta ao especificador, que decide (com ELM, ajusta o `elm/` pela `sa-especificar.elm`; sem ELM, a decisão entra nas Decisões da ficha) e a `sa-plano.replanejar` recopia o texto para o delta |
| descarta | o motivo vai na thread |

2. BLOQUEANTE só sai por `corrige` ou por `descarta` com o motivo.
3. Risco do MR pede revisão humana → ofereça a `sa-verificar.revisao-humana` antes de aprovar.
4. Sem BLOQUEANTE aberto → aprove no MR (com o "sim"). Com BLOQUEANTE aberto → peça mudanças no MR.

## Saída

Achados triados e o MR aprovado ou com mudanças pedidas. Algum `adia` → passo `cadastro`, um por achado adiado.

## Pare se

—
