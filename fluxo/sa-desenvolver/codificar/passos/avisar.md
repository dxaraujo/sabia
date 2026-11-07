---
{"resumo": "Avisa que o MR espera a revisão de um desenvolvedor ≠ autor, sugere o UAT no risco alto, oferece as horas e o merge."}
---
## Entrada

O MR aberto e o `status.md`.

## Faça

1. Avise que o MR espera a revisão de qualquer desenvolvedor ≠ autor pela `sa-revisar.mr`, com o dono da área no
   `CODEOWNERS`.
2. Risco alto → sugira o UAT humano (`sa-verificar.uat`).
3. Fora do autopilot, com ELM: pergunte "deseja lançar horas?"; sim → `sa-elm.horas`.
4. Fora do autopilot: MR já aprovado com CI verde → ofereça "seguir para o merge?"; senão, o fluxo termina esperando
   a revisão.
5. Autopilot: devolva à pessoa o link do MR, os Desvios e os Em aberto (inclusive os `capturar: …` para ela gravar);
   as perguntas do ELM ficam para o encerrar.

## Saída

A saída do mestre: o merge, ou a espera da revisão.

## Pare se

Nunca: o fluxo termina aqui.
