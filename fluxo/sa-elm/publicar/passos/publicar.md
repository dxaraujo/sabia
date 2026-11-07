---
{"resumo": "Prévia de tudo e um sim: altera, inclui e o roteiro manual do exclui."}
---
## Entrada

O lote conferido.

## Faça

Mostre a prévia de tudo (`altera | inclui | exclui · <sigla>-<id> · <título>`) e peça um "sim". Na ordem de
publicação do catálogo de tipos (cada um nasce com os ids que cita):

- `altera` → `elm_publicar_req` com o id, o texto do arquivo e o `modificado_em` lido. `conflito` → avise e
  pule.
- `inclui` → `elm_publicar_req` sem id: cria o requisito no DOORS, com o título do arquivo. Guarde o id novo.
- `exclui` → o MCP não apaga: mostre o roteiro `🗑️ mover para a lixeira no DOORS Next: <id> · <título>` e
  pergunte se foi feito.
- ET as-built → `elm_publicar_req` com o texto das seções do `design.md`.

## Saída

Os ids novos e o que foi feito, pulado ou deixado → passo `trocar-ids`.

## Pare se

- Sem o "sim" → nada publicado; `Publicação` continua `pendente`; devolva.
