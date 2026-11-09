---
{"resumo": "Junta o trabalho aberto da pessoa: atribuição, revisões, sprint, Sustentação e aprovações pelas booleanas."}
---
## Entrada

A coleta e a pessoa.

## Faça

- Itens com branch `<id>` da pessoa e trabalho aberto (em andamento, retrabalho, autopilot devolvido, MR aprovado
  para mergear).
- Com `desenvolvedor`: os MRs de outros esperando revisão (primeiro aqueles em que ela é `@dono` no CODEOWNERS).
- Linhas da sprint aberta com Responsável igual à pessoa e item não terminal (especificação, desenvolvimento,
  atendimento).
- Itens sustentação com ela como responsável.
- Com `produto`: documentos esperando `Aprovado:` e go/kill.
- Com `especificador`: `elm/` sem aprovação e `Publicação: pendente`.

## Saída

A lista → passo `mostrar`.

## Pare se

Sem condição própria.
