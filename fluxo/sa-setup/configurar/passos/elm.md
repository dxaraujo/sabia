---
{"resumo": "Pergunta 'usa ELM?' e, com sim, chama a sa-elm.setup e guarda os dados que ela devolve."}
---
## Entrada

O modo (inicial ou atualização) e, se vieram, os dados de uma `sa-elm.setup` direta.

## Faça

1. Dados já trazidos pela `sa-elm.setup` (passo `inicio`) → use-os, sem perguntar de novo.
2. Senão, pergunte "usa ELM?". Com sim, chame a `sa-elm.setup`. Ela grava o `pa` e devolve: a chave `elm` do
   `agentes.json` (`{pa, bundle, regras {allow, ask, deny}}`), o texto da seção ELM do `sabia.md` e as regras ELM dos
   agentes.
3. Com não, ou se a `sa-elm.setup` voltar sem ELM → `elm: false`. O fluxo funciona igual; só não há a seção ELM.
4. Guarde os dados: os passos `sabia-md` e `agentes` os aplicam.

## Saída

→ passo `glossario`.

## Pare se

- Nunca escreva em `.sabia/config/elm/`: é da `sa-elm.setup`.
