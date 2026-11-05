---
{"resumo": "Uma worktree e uma branch por fatia em .sabia/local/wt/<ft>, com a pasta e o status.md da fatia; como rodar comandos dentro dela."}
---
## Entrada

O lote confirmado, com a `iniciada` publicada na base (passo `lote`).

## Faça

As worktrees ficam **dentro** do workspace, em `.sabia/local/wt/<ft>/` (ignorado pelo git), para que os agentes
alcancem os arquivos com as permissões deles:

```bash
git fetch --quiet
git worktree add .sabia/local/wt/<ft> -b <branch> origin/<base>     # nova
git worktree add .sabia/local/wt/<ft> <branch>                      # já existe
```

Dentro da worktree, faça só a Pasta e o commit do passo **`sa-desenvolver.desenvolver.iniciar`** (pasta, `status.md` com
`Responsável: agente:sa-orquestrador`, o campo ELM com os ids que o passo `lote` tratou (`IB <id>` ou `DF <id>`, se o
item nasceu ou foi completado; `DEV <id>`) e, no Histórico, as `ELM pendente` que o passo `lote` deixou para esta
fatia — `[<tipo> <id> cancelar]`, `[DEV FT-<nnn> assumir]` —, `.config.kiro`), sem perguntas — o lote já foi confirmado. A
`iniciada` e o EWM já foram tratados na confirmação do lote (passo `lote`), e não há push nesta hora.

**Comandos dentro da worktree** — diga isto a cada subagente: git, build e testes com
`cd .sabia/local/wt/<ft> && <comando>` (o `git -C` é bloqueado nos agentes: com ele as regras de permissão não
enxergam o subcomando); arquivos pelo caminho `.sabia/local/wt/<ft>/<caminho>`. Ferramentas que varrem a raiz
(alguns test runners, linters) podem enxergar `.sabia/local/`: se o projeto tiver esse risco, a setup registra a
exclusão.

## Saída

Uma worktree por fatia, com a pasta e o `status.md` commitados → passo `fases`.

## Pare se

—
