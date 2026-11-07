---
{"resumo": "Quem tem produto vê o prd.md e aprova; o sim grava Aprovado: <usuário> · <data> no topo."}
---
## Entrada

O `prd.md` e o `equipe.json`. Pelo pedido "aprovar o PRD do EP-nn", este passo é a entrada do P.O.

## Faça

1. **Papel.** Só quem tem `produto` no `equipe.json` aprova.
2. **Mostrar.** O `prd.md` e o Em aberto, com o que cada um bloqueia, e pergunte "aprova o PRD? (sim | ajuste: <o
   quê>)". Em aberto não impede a aprovação: bloqueia só o que depende dele.
3. **Sim.** `**Aprovado:** <usuario> · <AAAA-MM-DD>` no topo; o commit é o do passo `gravar` (`EP-nn aprovar PRD`).
4. **Ajuste** → passo `escrever`.

## Saída

Aprovado → passo `gravar`. Ajuste → passo `escrever`.

## Pare se

- Sem a booleana `produto` → mostre quem tem `produto` no `equipe.json` ("o P.O. aprova com 'aprovar o PRD do
  EP-nn'") e pare.
