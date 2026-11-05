---
{"resumo": "Sobe uma severidade do achado cujo tipo já escapou de uma revisão (lição revisao-branda) e aplica as regras aprendidas como itens da rubrica."}
---
## Entrada

Os achados do passo `evidencia`.

## Faça

Para cada achado IMPORTANTE ou SUGESTÃO, leia o `licoes.md` da base (`git show
origin/<base>:<produto>/aprendizado/licoes.md`): o mesmo tipo de problema já escapou de uma revisão — lição com a
mesma causa (`revisao-branda`) cujo Feito trata do mesmo item de rubrica do achado (o mesmo `P<n>`, `L<n>` ou
`C<n>`) → suba uma severidade (SUGESTÃO → IMPORTANTE → BLOQUEANTE). Lições promovidas
(seção Regras aprendidas do `sabia.md`) valem como itens da rubrica — o revisor é quem mais as usa.

## Saída

Os achados com a severidade calibrada → passo `relatorio`.

## Pare se

—
