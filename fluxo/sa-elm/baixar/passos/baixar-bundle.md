---
{"resumo": "Baixa o bundle para a pasta da chave bundle, mesmo sem novidade, para gravar a data no sync.md."}
---
## Entrada

O plano.

## Faça

`elm_sync(direcao "baixar")` para a pasta da chave `elm.bundle` do `agentes.json` (ex.: `docs/elm/<pa>/`). Baixe
mesmo sem novidade: grava o `generated.at` no `sync.md`. Só lê do ELM: não pede "sim". `erros` → mostre e
avise que a data não mudou. O bundle nunca é editado à mão. Prepare o commit (o bundle e o `sync.md`, mensagem
`elm: bundle <AAAA-MM-DD>`) para o passo `commit`.

## Saída

Segue para o passo `commit`. Bundle no `.gitignore` → sem commit: passo `indexar`.

## Pare se

- Nunca.
