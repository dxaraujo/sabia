---
{"resumo": "Para cada requisito proposto, o vigente da busca define a ação (inclui, altera, exclui) e o id; registra o impacto de cada altera e exclui."}
---
## Entrada

Os requisitos que o PRD vai propor (das decisões e do pitch) e o vigente do passo `entender`.

## Faça

Para cada requisito proposto (tipo, título provisório, palavras-chave), procure o vigente parecido e mostre à pessoa
a ação recomendada:

| Vigente | Ação | Id |
|---|---|---|
| nenhum | inclui | provisório `<sigla>-EP<nn>-<nn>` (ex.: `REG-EP03-01`), sequencial no `prd.md` |
| o mesmo, e muda | altera | `<sigla>-<id do ELM>` (sem ELM, o id da spec viva) |
| deixa de valer | exclui | `<sigla>-<id do ELM>` (sem ELM, o id da spec viva) |
| o mesmo, sem mudar | — (só citado) | `<sigla>-<id do ELM>` |

- **Impacto.** Para cada altera e exclui, quem cita o requisito (a HF que embute a REG, a EL da tela) e se muda
  também: muda → linha própria; não muda → só citado no texto.
- A decisão da pessoa vai à tabela Decisões do `prd.md`.
- A versão lida não fica no PRD: entra no Cobre da ficha, no detalhar.

## Saída

A ação e o id de cada requisito → passo `escrever`.

## Pare se

Nenhum caso próprio deste passo: requisito que surgir depois volta aqui antes de virar bloco.
