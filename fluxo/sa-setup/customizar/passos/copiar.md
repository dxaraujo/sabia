---
{"resumo": "Copia para .sabia/fluxo/ ou .sabia/template/, com a base pelo --base do gerador."}
---
## Entrada

O ponto e a forma.

## Faça

A `base` vem sempre de `uv run --no-project python <pasta desta skill>/scripts/gerar_agentes.py --base <id>` (o sha
do original no framework), e o corpo, do arquivo compilado:

- trocar → `.sabia/fluxo/<skill>/<fluxo>/passos/<passo>.md` = `{"base": "<saída do --base>"}` + o passo compilado,
  inteiro;
- inserir → `.sabia/fluxo/<skill>/<fluxo>/passos/<novo>.md` com `{"resumo": "<uma frase>"}` e as quatro seções
  (`## Entrada`, `## Faça`, `## Saída`, `## Pare se`), e em `.sabia/fluxo/<skill>/<fluxo>/<fluxo>.md`
  `{"inserir": [{"id": "<novo>", "depois": "<passo>"}]}`;
- remover → `{"remover": ["<passo>"]}` no mesmo `<fluxo>.md` do projeto;
- template → `.sabia/template/<skill>/<nome>.md` = `{"base": "<saída do --base <skill>/<nome>.md>"}` + o template
  compilado;
- template de um tipo de artefato → `.sabia/template/requisitos/template-<tipo>.md`, sobre o template em vigor do tipo: o do
  toolkit que desvia o tipo (`{"base": "<saída do --base ~/.sabia/toolkits/<toolkit>/<template do tipo>>"}` + o template
  do toolkit) ou, sem toolkit, o do Sabiá (`--base requisitos/template-<tipo>.md`).

Cópia que já existe → não sobrescreva: mostre e ofereça editar. A pessoa edita (ou a `sa-setup`, a pedido dela,
mostrando o diff). As travas continuam valendo.

## Saída

Editado → passo `regenerar`.

## Pare se

- Nunca calcule a `base` de outro jeito.
