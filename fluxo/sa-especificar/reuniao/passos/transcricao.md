---
{"resumo": "Converte o .vtt ou o .md em falas '[mm:ss] papel: fala' pelo transcricao.py, com o papel de cada falante dito pela pessoa."}
---
## Entrada

A transcrição `.sabia/local/reunioes/<id>-<AAAA-MM-DD>.<vtt|md>` sem ATA (nenhuma ATA em
`.sabia/planejamento/atas/` nem rascunho ao lado com o mesmo nome de origem).

## Faça

1. **Converter.** Da raiz do projeto:
   `uv run --no-project python ~/.sabia/framework/skills/sa-especificar/scripts/transcricao.py .sabia/local/reunioes/<arquivo>`.
   Grava `<arquivo>.transcricao.md` ao lado e lista no stderr os falantes sem papel e as falas sem falante (`?`: não
   as atribua a ninguém).
2. **Papéis.** Pergunte o papel de cada falante (P.O., cliente — `<área>`, analista…); nunca deduza. Rode de novo com
   `--papel "Nome=papel"` por falante.

## Saída

O `.transcricao.md` com o papel de cada falante → passo `escrever`.

## Pare se

- Código 1 (nenhuma fala reconhecida) → mostre o formato aceito (o cabeçalho do script) e pare.
- Código 2 (arquivo, codificação ou `--papel` inválido) → mostre a mensagem e pare; `--papel` errado, corrija e rode
  de novo.
