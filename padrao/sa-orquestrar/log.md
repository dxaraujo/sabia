---
{"resumo": "Log do loop AFK em .sabia/local/loop-<AAAA-MM-DD-HHMM>.md (passo lote da sa-orquestrar): uma linha por fatia, para retomar."}
---
```markdown
# Loop AFK <data> — paralelo <p> · push/PR: <sim|não> · [APR]: <h>h
| FT | Worktree | Branch | Fase | Rodada | Último resultado | Atualizado |
|---|---|---|---|---|---|---|
```

Uma linha por fatia, regravada a cada fase. Fase = a fase do lote, `<n> <nome>` (`1 pesquisa` … `8 entrega`, passo
`sa-orquestrar.orquestrar.fases`) · Rodada = o contador da fase em curso no campo Rodadas do `status.md` (`—` na fase
sem rodada) · Último resultado = o fecho recebido (`ANALISE: OK|AJUSTAR`, `VEREDITO: APROVADO|REVISAR|AMBIENTE`,
`VERIFICACAO: ACEITO|REJEITADO|AMBIENTE`), `aguardando-aprovacao-plano`, `verificada`, `aguardando-aprovacao-pr`
ou `bloqueada: <motivo>` · Atualizado = `AAAA-MM-DD HH:MM`.

Fatia finalizada = Último resultado `aguardando-aprovacao-pr`, `verificada` sem PR autorizado no lote, ou
`bloqueada: <motivo>`; as outras são não finalizadas (`aguardando-aprovacao-plano` retoma depois do GATE), e também
a finalizada em `aguardando-aprovacao-pr` cujo `status.md` voltou a `retrabalho (de: aguardando-aprovacao-pr)`
(mudanças pedidas na `[APR]`).
