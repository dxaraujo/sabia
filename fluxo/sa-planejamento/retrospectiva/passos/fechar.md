---
{"resumo": "Fecha a sprint: vazão, lead time e meta; migra para a próxima as linhas fora de situação terminal; no backlog.md só muda a sprint."}
---
## Entrada

As horas feitas (passo `horas`) e a pré-condição de novo antes da virada (passo `precondicao`).

## Faça

**Fechar:** concluídas — previstas e puxadas — contam na vazão e no lead time; a meta é avaliada (atingida ou
não, e por quê). **Migram** para a próxima sprint as linhas fora de situação terminal (`concluida`, `dividida`,
`cancelada`, `concluido`, `cancelado`) cujo item tem, no `backlog.md`, a `sprint` que fecha — fatias (inclusive
as do `**Fechamento sem consolidar:**`, com `não consolidada`), Especificação (pela Situação da linha, não pelo
`status` do épico: épico `iniciado` com a Especificação `concluida` não migra) e Sustentação: no `sprint-<nn>.md`
que fecha, a linha guarda a última situação e ganha `migrada para <próxima chave>` (`2026/Sprint 04` →
`2027/Sprint 01` na troca de pai; o histórico não é apagado), e ele fica com `**Situação:** fechada`; no da
próxima, a linha nasce na mesma seção, com a mesma situação e `migrada de <chave>`. A linha com `saiu da sprint`
não migra: é histórico; o item que voltou à sprint tem a linha viva, que migra se não está em situação terminal
([Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), Linha viva). No `backlog.md` só muda a
`sprint` (a próxima chave; no épico, quando a linha dele na Especificação migra), pelo bloco
[Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base).

## Saída

A sprint fechada (`**Situação:** fechada`) e as linhas migradas → passo `recalcular`.

## Pare se

Sem condição de parada própria.
