---
{"resumo": "Sugere o commit, na branch base, dos arquivos gravados; a pessoa confirma."}
---
## Entrada

Os arquivos gravados.

## Faça

Mostre o `git status` e sugira o commit na branch base, no padrão de commit do projeto, com a descrição `configurar o
Sabiá`: `.sabia/` (sem `local/`), os agentes e ponteiros de cada alvo, `.gitlab/`, `.gitignore` e `.gitattributes`.
Grave com o "ok" e ofereça o push (sem `--force`).

## Saída

→ passo `proximo`.

## Pare se

- Commit ou push sem o "sim".
