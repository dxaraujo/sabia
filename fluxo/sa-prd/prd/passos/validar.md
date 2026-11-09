---
{"resumo": "Roda o sabia validar-spec (avisa, não trava) e, a 'quer revisar agora?', o checklist do template prd.md."}
---
## Entrada

O `prd.md` escrito.

## Faça

1. **Validador.** `sabia validar-spec <pasta do épico>` (forma e ligações). O comando ainda não existe → diga e siga.
   Achados só avisam.
2. **Checklist.** A "quer revisar agora?", aplique o Checklist do template `sa-prd/prd.md`: seções preenchidas, todo
   requisito com id e ação, nenhuma regra sem fonte e todo em aberto com Bloqueia.
3. **Achado.** Forma → corrija no `prd.md`. Decisão de negócio → passo `esclarecer`.

## Saída

Sem achado de negócio → passo `aprovar`. Achado de negócio → passo `esclarecer`.

## Pare se

Nenhum caso próprio deste passo: o validador nunca trava.
