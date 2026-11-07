---
{"resumo": "Autoverificação: sa-verificar.verificar no subagente sa-verificador, bloco 🔎 por CT-nn e CT.csv na quick e no completo."}
---
## Entrada

A branch revisada, sem BLOQUEANTE aberto.

## Faça

1. Grave Fase `verificando`.
2. Chame a `sa-verificar.verificar` no subagente `sa-verificador`: ele sobe a aplicação pelo Executar do `sabia.md`,
   exercita os cenários pela URL de teste e devolve o bloco 🔎.
3. Por cenário: ✅ aceito · ❌ rejeitado · ⚠️ ambiente · 🔁 possível alteração. Fecho: `ACEITO`, `REJEITADO` ou
   `AMBIENTE`. Quick e completo: o verificador grava o `CT.csv`; trivial: só a evidência, que vai ao MR.
4. ❌ → tarefa. 🔁 → decida antes do MR: código errado vira ❌; a spec muda → Em aberto ao especificador.
   "Fora dos cenários" do 🔎 → passo `captura` (`obs` `origem FT-nnn`).
5. `AMBIENTE`: fora do autopilot, a pessoa decide; no autopilot, devolve à pessoa.
6. Commit do `CT.csv` na branch.

## Saída

`ACEITO` → passo `licoes`.

## Pare se

- `AMBIENTE` sem o "sim" de seguir.
