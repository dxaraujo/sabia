---
{"resumo": "Toda sessão, antes de parar: créditos no status.md do épico, comentário e anexos na [ESP] e as horas da sessão, numa pergunta só."}
---
## Entrada

Toda sessão de especificação, antes de parar: a pasta de trabalho com a última versão de cada artefato.

## Faça

Fechar a sessão (toda sessão, antes de parar). Pergunta única, com prévia do que vai:

```
📝 Sessão de especificação — EP-<nn> · <data>
Comentário na [ESP] <id>: <resumo do levantamento · decisões D-nn novas · dúvidas para a próxima reunião>
Anexos (última versão, substituem os anteriores): rascunho.md · decisoes.md · status.md · prd.md · elm-<arquivo>.md …
Horas desta sessão na [ESP]: <h> h em <data>   (pergunte à pessoa; nunca estime por ela)
Créditos desta sessão: <x.xx> (sessão <id>) · power sabia <versão>   (script da sa-status, item 4)
Registrar? (sim)
```

Com "sim": primeiro a linha de créditos no `status.md` do épico ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4) — o da pasta de
trabalho até o PRD ir à base; depois, o da base, no commit do passo `fechamentos` ou, na sessão sem GATE, pelo bloco
[Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), commit `EP-<nn> registrar sessão` —; então `elm_comentar` (o resumo), `elm_anexo(id, "enviar", caminho)` para cada `.md` da pasta de trabalho fora de `reunioes/` e de `prototipo/` (a transcrição não
sobe; o protótipo já subiu no registro da versão; os de `elm/`, com as atas, com o prefixo `elm-`, para não colidir com o nome de outro arquivo) e `elm_lancar_horas(id, horas)` (lança;
não conclui). Sem o MCP `elm` ou com falha → `ELM pendente [<chave>]: registrar sessão [ESP] EP-<nn> (<data>)` no `rascunho.md`, e o
próximo fechamento registra.

## Saída

A sessão registrada na `[ESP]` (ou `ELM pendente`). Depois do GATE do PRD (Fase `aprovado`) → passo `fechamentos`;
senão, aqui a sessão termina.

## Pare se

Nenhum caso próprio deste passo: sem o MCP `elm`, `ELM pendente` e o fluxo segue.
