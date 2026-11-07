---
{"resumo": "Devolve a quem chamou o bloco 🔎 (tabela por CT-nn, contagem, Fora dos cenários e VERIFICACAO na última linha); no pedido direto, a sessão da pessoa faz o commit do CT.csv, o push e o comentário no MR."}
---
## Entrada

Os resultados por cenário (passo `executar`), a seção Fora dos cenários (passo `fora-dos-cenarios`) e o `CT.csv`
(passo `casos`).

## Faça

1. Monte o bloco:

```
🔎 Verificação FT-<nnn> · <AAAA-MM-DD>
| CT-nn | Resultado | Esperado × obtido | Evidência |
|---|---|---|---|
Cenários: <a> ✅ · <r> ❌ · <e> ⚠️ · <p> 🔁
Fora dos cenários: — | <tipo> · <passos · atual · esperado>
VERIFICACAO: ACEITO | REJEITADO | AMBIENTE
```

2. Algum ❌ → `REJEITADO`; sem ❌ e com algum ⚠️ → `AMBIENTE`; o resto → `ACEITO`. A última linha é exata.
3. Quem chamou decide cada 🔁 antes de abrir o MR: código errado vira ❌; spec que muda é `volta-spec` (o
   especificador). Regra sem fonte vai marcada "em aberto ao P.O.", e quem chamou a grava no Em aberto do
   `status.md`.
4. Devolva o bloco a quem chamou. No pedido direto, a sessão da pessoa faz o commit do `CT.csv` na branch `<id>` e
   o push da própria branch (com o "sim"), põe o 🔎 como comentário no MR, se ele já existir, e oferece "seguir para
   a próxima?".

## Saída

O bloco 🔎, com o fecho na última linha, devolvido a quem chamou. Aqui o fluxo termina.

## Pare se

—
