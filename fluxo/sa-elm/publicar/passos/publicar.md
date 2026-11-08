---
{"resumo": "Prévia de tudo e um sim: altera, inclui e o roteiro manual do exclui."}
---
## Entrada

O lote conferido.

## Faça

Mostre a prévia de tudo (`altera | inclui | exclui · <sigla>-<id> · <título>`) e peça um "sim". Na ordem de
publicação do catálogo de tipos (cada um nasce com os ids que cita):

- **Texto:** o corpo do arquivo, sem o frontmatter. Link para arquivo de requisito
  (`[REG-2087 <título>](2087-REG-<slug>.md)`) vira `[REG-2087 <título>](2087)`; o id provisório de um requisito novo
  fica como texto até ele ganhar o id.
- `altera` → `elm_publicar_req` com o id, o texto e o `modificado_em` lido. `conflito` → avise e
  pule.
- `inclui` → `elm_publicar_req` sem id: cria o requisito no DOORS, com o `title` do frontmatter. Guarde o id novo.
- `exclui` → o MCP não apaga: mostre o roteiro `🗑️ mover para a lixeira no DOORS Next: <id> · <título>` e
  pergunte se foi feito.
- ET as-built → `elm_publicar_req` com o texto das seções do `design.md`; os links da linha **Atende:** viram
  `(<id>)` como os outros.

## Saída

Os ids novos e o que foi feito, pulado ou deixado → passo `trocar-ids`.

## Pare se

- Sem o "sim" → nada publicado; `Publicação` continua `pendente`; devolva.
