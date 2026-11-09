---
{"resumo": "Propõe o equipe.json: membros com usuario do GitLab, booleanas, horas, ausências e ativo; valida contra o schema."}
---
## Entrada

O `equipe.json` atual, se existe, e o que a pessoa disse que mudou.

## Faça

Proponha `.sabia/planejamento/equipe.json` (exemplo no template `sa-planejamento/equipe.md`) com
`membros[]` = `{nome, usuario, elm_login, desenvolvedor, especificador, produto, horas_semana, ausencias, ativo}`:

- `usuario` = o usuário do GitLab: o autor do MR, o `@dono` no CODEOWNERS e o nome do CSV de créditos.
- `elm_login` só se o `.sabia/sabia.md` tem a seção ELM (opcional; só a `sa-elm` lê).
- `desenvolvedor`: puxa item para desenvolvimento e revisa MR de outro autor. `especificador`: aprova os arquivos de
  `elm/` e publica no ELM. `produto`: go/kill, ordena o backlog e aprova pitch, PRD e ficha.
- `horas_semana` no time; `ausencias` = `[{"inicio": "AAAA-MM-DD", "fim": "AAAA-MM-DD"}]` (vazio: `[]`).
- Quem sai do time fica `ativo: false` e nunca é apagado.

Valide contra o [equipe.schema.json](~/.sabia/framework/skills/sa-planejamento/assets/equipe.schema.json). Avise se
nenhum membro ativo tem `produto` (ninguém aprovaria go/kill, PRD e ficha) ou se só um tem `desenvolvedor` (o revisor
do MR precisa ser outro desenvolvedor). O aviso não trava.

## Saída

A equipe proposta → passo `acordos`. A gravação vem junto com os acordos.

## Pare se

Sem condição própria: nada é gravado aqui.
