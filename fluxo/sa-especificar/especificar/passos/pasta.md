---
{"resumo": "Monta a pasta de trabalho fora do git (.sabia/local/especificacao/) pela primeira fonte: a pasta local, os anexos da [ESP] ou a base."}
---
## Entrada

O épico `iniciado` e a `[ESP]` assumida (passo `assumir`).

## Faça

Pasta de trabalho (fora do git): `.sabia/local/especificacao/<EP>-<slug>/` — é ali que a `sa-entrevistar`, a `sa-prd` e a revisão P trabalham até
o GATE. Monte-a pela primeira fonte que existir:

1. **Já existe nesta máquina** → use-a, mas compare antes com a `[ESP]`: último comentário de sessão mais novo que
   a última sessão registrada no `rascunho.md` local (outra máquina trabalhou depois) — compare as duas em UTC (o
   EWM devolve UTC; o rascunho, hora local) e nunca pelo mtime dos arquivos, que muda a cada download → mostre as duas datas e pergunte se baixa os anexos (item 2)
   por cima da pasta local.
2. **A `[ESP]` tem anexos** (`elm_anexo(id, "listar")`) → outra pessoa ou máquina já trabalhou: baixe cada `.md`
   (`elm_anexo(id, "baixar", caminho)`) para a pasta (os de `elm/` para `elm/`, pelo prefixo `elm-` do nome do anexo). Mostre a
   data do último comentário de sessão.
3. **Só a base** → copie `rascunho.md`, `decisoes.md` e `status.md` de `<produto>/epicos/<EP>-<slug>/` em
   `origin/<base>` (`git show origin/<base>:<caminho>`, depois de `git fetch`; criados pela triagem).
   Sem essa pasta na base → crie-os: `rascunho.md` com o título e a descrição do item do EWM (sem dado inventado),
   `decisoes.md` no formato do padrão [`sa-entrevistar/decisoes.md`](~/.sabia/framework/padrao/sa-entrevistar/decisoes.md) (título `# Decisões — <EP-nn> <título>` e a tabela vazia)
   e o `status.md` pelo padrão `sa-especificar/status-epico.md`.

Em qualquer das três, a pasta tem o **`status.md` do épico** — a Fase (o detalhe do épico, como o da fatia; a
situação fica no `backlog.md`), o início e os créditos de cada sessão. A triagem o cria com Fase `rascunho` e
`[ESP]`, Responsável e Início `—`, que você preenche aqui; a fonte não o trouxe → crie-o pelo padrão
`sa-especificar/status-epico.md`.

O `rascunho.md` é o **caderno do levantamento**: o que o cliente contou, exemplos reais, dúvidas para a próxima
reunião, com a data de cada sessão. Decisões vão para o `decisoes.md` (`D-nn`), nunca só para o rascunho.

## Saída

A pasta de trabalho com `rascunho.md`, `decisoes.md` e o `status.md` do épico → passo `encaminhar`.

## Pare se

Nenhum caso próprio deste passo: a pasta local mais velha que a `[ESP]` é pergunta à pessoa (item 1), não parada.
