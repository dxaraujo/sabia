---
{"resumo": "Gera o CT.csv na pasta da fatia, um caso por cenário verificado, no padrão sa-verificar/ct-csv.md, para a consolidação criar os casos no ETM."}
---
## Entrada

Os cenários verificados no `verificacao.md` (passo `executar`), **todos aceitos** — o `VERIFICACAO: ACEITO` do
passo `decisao`. Algum rejeitado ou ⚠️ → pule este passo: siga para o passo `decisao`.

## Faça

Gere `CT.csv` na pasta da fatia — um caso por cenário verificado — no formato do padrão `sa-verificar/ct-csv.md`.
Na consolidação, depois do merge, a `sa-consolidar`
cria a partir dele um caso de teste por cenário no ETM, já ligado à história (`elm_criar_ct`,
[elm-publicar.md](~/.sabia/framework/skills/sa-consolidar/references/elm-publicar.md)); o CSV também é a
alternativa para importar à mão quando a criação falha.

Rodadas: quem pediu a verificação incrementa "verificação" (a `sa-codificar` ou o orquestrador); só no
pedido direto de uma pessoa, incremente você.

## Saída

`CT.csv` na pasta da fatia → passo `decisao`, que o commita na entrega.

## Pare se

—
