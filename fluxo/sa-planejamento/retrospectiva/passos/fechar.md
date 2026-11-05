---
{"resumo": "Fecha a sprint: vazão, lead time e meta; decide a chave da próxima e cria o sprint-<nn>.md dela com o cabeçalho mínimo; migra as linhas fora de situação terminal e o débito de especificação sem tarefa; no backlog.md só muda a sprint."}
---
## Entrada

As horas feitas (passo `horas`) e a pré-condição de novo antes da virada (passo `precondicao`).

## Faça

**Fechar:** concluídas — previstas e puxadas — contam na vazão e no lead time. Grave a primeira linha de
`## Números`: concluídas (previstas = sem Observação `encaixe:`; por encaixe = com ela), a meta (`atingida` ou
`não — <por quê>`), o lead time médio e, do bloco 🔁 da retrospectiva (passo `retro`), as rodadas de revisão por
fatia e as correções humanas.

**Próxima chave:** o pai é o da sprint que fecha; pai novo só se a pessoa disser agora, com o nome que ela der
(`2027`, `Entrega 3`…). A `<nn>` é a próxima dentro do pai (pai novo → `01`). Crie
`sprints/<pai>/sprint-<nn>.md` da próxima com o cabeçalho mínimo do modelo — `# <pai>/Sprint <nn>`,
`**Situação:** aberta`, `**Publicação no EWM:** pendente` — e só as seções que recebem linha migrada; o
replanejamento (passo `recalcular`) completa o resto.

**Migram** para a próxima sprint as linhas fora de situação terminal (`concluida`, `dividida`,
`cancelada`, `concluido`, `cancelado`) cujo item tem, no `backlog.md`, a `sprint` que fecha — fatias (inclusive
as do `**Fechamento sem consolidar:**`, com `não consolidada`), Especificação (pela Situação da linha, não pelo
`status` do épico: épico `iniciado` com a Especificação `concluida` não migra) e Sustentação: no `sprint-<nn>.md`
que fecha, a linha guarda a última situação e ganha `migrada para <próxima chave>` (`2026/Sprint 04` →
`2027/Sprint 01` na troca de pai; o histórico não é apagado), e ele fica com `**Situação:** fechada`; no da
próxima, a linha nasce na mesma seção, com a mesma situação e `migrada de <chave>`. A linha com `saiu da sprint`
não migra: é histórico; o item que voltou à sprint tem a linha viva, que migra se não está em situação terminal
([Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), Linha viva). Na seção Débito de
especificação, a linha com Tarefa `—` migra também: Tarefa `migrada para <próxima chave>` na que fecha, e a linha
igual, com Tarefa `—` e ` · migrada de <chave>` no Registrado, na próxima
([arquivos.md](~/.sabia/framework/skills/sa-planejamento/references/arquivos.md#sprintspaisprint-nnmd)). No `backlog.md` só muda a
`sprint` (a próxima chave; no épico, quando a linha dele na Especificação migra).

Grave pelo bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), sem
commit ainda: o da virada fecha no passo `recalcular`.

## Saída

A sprint fechada (`**Situação:** fechada`) e o `sprint-<nn>.md` da próxima, com as linhas migradas → passo
`recalcular`.

## Pare se

Sem condição de parada própria.
