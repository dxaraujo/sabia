---
{"resumo": "Confere quem revisa pelo equipe.json: booleana desenvolvedor e usuario diferente do autor do MR; senão, diz quem pode (o dono no CODEOWNERS e os desenvolvedores) e para."}
---
## Entrada

O item com o MR aberto (passo `entrada`) e o usuário da sessão, que é o usuário do GitLab.

## Faça

1. Procure a pessoa no `equipe.json` pelo `usuario`. Para revisar, ela precisa de `desenvolvedor = true` e de
   `usuario` diferente do autor do MR (o autor sai do MR pelo `gitlab_obter_mr`; sem o MCP, a pessoa informa).
2. Não pode → diga quem pode: o `@dono` da área no `CODEOWNERS` (pelos arquivos do diff) e os desenvolvedores
   ativos do `equipe.json`, menos o autor.

## Saída

A pessoa pode revisar → passo `ler`.

## Pare se

- A pessoa é o autor do MR ou não tem a booleana `desenvolvedor` → a frase de quem pode e pare.
