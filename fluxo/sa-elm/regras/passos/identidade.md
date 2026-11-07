---
{"resumo": "Quem age no ELM: o elm_login do equipe.json, ou o usuario do GitLab."}
---
## Entrada

A pessoa da sessão, pelo `usuario` do `equipe.json` (o usuário do GitLab).

## Faça

Quem age no ELM é o `elm_login` da pessoa no `equipe.json`; sem ele, vale o `usuario`. A credencial fica em
`~/.config/mcp-elm/elm.properties`, que o agente nunca lê nem grava. Dono de tarefa, autor de horas e de
comentário são sempre a própria pessoa.

## Saída

Segue para o passo `ids`.

## Pare se

- Pessoa fora do `equipe.json` → diga que falta a linha dela (`sa-planejamento.inicial`) e devolva.
