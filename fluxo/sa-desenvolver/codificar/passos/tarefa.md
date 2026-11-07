---
{"resumo": "Uma tarefa por vez em TDD: teste pelo ponto de teste, vermelho, verde, arrumar; backpressure do trecho tocado, marca e commit pequeno."}
---
## Entrada

A primeira tarefa não marcada do `tasks.md`; no trivial, a mudança pedida é a tarefa única.

## Faça

1. Grave Fase `implementando` (na primeira tarefa da sessão).
2. **Vermelho**: o teste pelo ponto de teste do `design.md` (interface pública, sem mock de detalhe interno), que
   falha pelo motivo certo. O teste de um cenário leva o `CT-nn` no nome (com `CT no teste: sim` no `acordos.md`, a
   marca `<FT-nnn> CT-nn`). Defeito: o teste que reproduz e a correção fecham no mesmo ciclo.
3. **Verde**: a menor mudança de produção, imitando o análogo do `design.md`.
4. **Arrumar** só o que acabou de escrever, com os testes verdes.
5. **Backpressure**: compile e rode os testes do trecho tocado (comandos do `AGENTS.md`). Lint e cobertura não rodam
   por tarefa. Vermelho → corrija antes de seguir.
6. Marque `- [x]` no `tasks.md`, atualize o Retomar do `status.md` e faça um commit pequeno (padrão de commit do
   `sabia.md`; o id da tarefa do EWM só com `Id no commit: sim` no `acordos.md`).
7. Refatoração preparatória só como tarefa do plano, em commit separado. Nunca enfraqueça, desabilite ou apague um
   teste para ficar verde.
8. **No manual**: este passo é da pessoa; o fluxo espera o "terminei".

**Toolkit na tarefa.** Quem decide é a configuração do agente: a tarefa que casa com um desvio do prompt vai ao
toolkit, sem marca no `tasks.md` e sem perguntar. Sem agente: carregue a skill do desvio e faça o ciclo por ela.
Com agente: delegue a tarefa (com o `design.md`, o `research.md`, os pontos de teste e os comandos) e receba código
e testes, sem commit, push nem MR. Depois, sempre o Sabiá: confira com `git status` que só mudaram arquivos da
tarefa, rode o backpressure e siga do item 6. Fora do escopo ou vermelho → devolva uma vez com a falha; de novo →
passo `desvio`.

## Saída

Tarefa marcada e commitada → a próxima tarefa, ou o passo da saída que casar.

## Pare se

- Teste que parece errado → pergunte à pessoa; no autopilot, passo `desvio`.
