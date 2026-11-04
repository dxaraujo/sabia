---
{"resumo": "Sem research.md, roda a sa-pesquisar (de preferência pelo sa-pesquisador) e grava o conteúdo na pasta da fatia; trabalha a partir do arquivo."}
---
## Entrada

A pasta `.kiro/specs/<ft>-<slug>/` da fatia, com ou sem `research.md`.

## Faça

Sem `research.md` → **`sa-pesquisar`** (de preferência pelo agente `sa-pesquisador`, que devolve o conteúdo: grave-o
como veio na pasta da fatia). Trabalhe a partir do
arquivo, não da memória da leitura.

## Saída

`research.md` na pasta da fatia → passo `decisoes`.

## Pare se

Divergência entre o ELM e o código apontada na pesquisa → pergunte antes de
seguir: defeito (o código muda) ou artefato velho (passo `decisoes`, Pare se: volta à especificação).
