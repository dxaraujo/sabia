---
{"resumo": "acordos.json que não passa no acordos.schema.json."}
---
## Entrada

O `.sabia/planejamento/acordos.json` da branch base.

## Faça

Valide contra o [acordos.schema.json](~/.sabia/framework/skills/sa-planejamento/assets/acordos.schema.json). Chave
que falta, chave desconhecida ou valor fora do tipo → quem tem `produto` corrige (`sa-planejamento.inicial`). Sem o
arquivo, não há pendência: o painel já sugere o planejamento inicial.

## Saída

→ o próximo passo da lista.

## Pare se

Sem condição própria: nenhuma pendência trava.
