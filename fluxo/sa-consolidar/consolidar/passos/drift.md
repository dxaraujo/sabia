---
{"resumo": "Lê o campo Drift de negócio do status.md (marcado pela revisão e pela verificação) e, com sim, leva o PRD (versão de correção) ou a ficha a nova versão antes de publicar."}
---
## Entrada

Fatia `pronta` na base, já na base (passo `entrada`), e o campo **Drift de negócio** do `status.md`.

## Faça

Leia o campo **Drift de negócio** do `status.md` — marcado pela revisão (`sa-revisar`, rubrica C: achado aceito
ou decisão técnica que muda comportamento visível) e pela verificação (`sa-verificar`: cenário ajustado). Não
releia o `design.md` nem o `verificacao.md` atrás de drift: isso já foi julgado.

- `sim — <motivo>` → mostre o motivo: o código entregue não é o que a HF aprovada diz, e o PRD vai à versão de
  correção **antes** de publicar (passo `elm`): ele passa a descrever o que foi entregue. Com épico, pare e
  passe ao especificador (`sa-prd.mudanca`, com a revisão P e o GATE); depois do GATE, retome a consolidação aqui.
  Na fatia sem épico, a ficha, pela `sa-triar`.
- `não` → nada no PRD nem na ficha.
- vazio (`—`) → pergunte a quem revisou ou verificou (Histórico) e grave a resposta no campo; não procure você;
  sem REV nem VER no Histórico (fatia `pronta` pela sincronização, `merge do PR <link> por fora do Sabiá`) → pergunte
  ao Dev responsável (o dono da `[DEV]`) e grave a resposta no campo.

## Saída

O drift resolvido (PRD na versão de correção, ficha em nova versão, ou nada a mudar) → passo `elm`.

## Pare se

- Drift `sim` com épico → o PRD vai à versão de correção antes: passe ao especificador (`sa-prd.mudanca`) e pare.
