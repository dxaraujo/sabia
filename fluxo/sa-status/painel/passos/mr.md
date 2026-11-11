---
{"resumo": "Lê o MR de cada branch <id> pelo gitlabpr, só leitura; em-revisao é derivado."}
---
## Entrada

As branches `<id>`.

## Faça

Para cada branch `<id>`, leia pelo MCP `gitlabpr` (só leitura) o MR: estado, Draft, aprovações, threads abertas,
conflito e link; com CI declarado no `.sabia/sabia.md`, também o pipeline, pelo MCP do CI. `em-revisao` é derivado (MR aberto, fora de Draft, sem aprovação) e não se grava. Sem o
MCP, use o link do campo MR do `status.md` e diga "MR não conferido".

## Saída

MRs por item → passo `tasks`.

## Pare se

Sem condição própria.
