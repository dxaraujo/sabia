---
{"resumo": "Completa a DoR do épico, grava na base o épico iniciado e a linha da Especificação (um commit) e assume a [ESP] pela regra comum de assumir."}
---
## Entrada

O épico na sprint aberta (passo `entrada`): a linha em `## Épicos` do `backlog.md` da base e a `[ESP]` pela Tarefa
ELM da linha dele na seção Especificação do `sprint-<nn>.md` (a Revisão, quando há) ou pela coluna `elm` (`ESP <id>`)
(sem id → `pendente`).

## Faça

1. **DoR do épico** — a do [`backlog.md`](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#definition-of-ready-o-que-faz-uma-fatia-elegivel)
   (o problema, quem pede, o resultado e o `po`): `elegivel` ou adiante já passou; `novo`, confira agora. Faltando →
   liste e complete com a pessoa, na linha do épico do `backlog.md`, o que falta (o `po`; a descrição mínima: o
   problema, quem pede, o resultado esperado), sem id novo (passou → `elegivel`) — é trabalho desta `[ESP]`, que
   entrou na sprint assim —, no commit do item 2.
2. **Situação na base** — a exceção ao "nada vai à base antes do GATE do PRD" (Regras): pelo bloco
   [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), o épico `iniciado` no `backlog.md` e a linha
   dele na seção Especificação do `sprint-<nn>.md` aberto com Situação `iniciada` (Responsável `—` → quem assume);
   um commit, `EP-<nn> iniciar`. Já `iniciado` (retomada) → nada a gravar.
3. **EWM** — `[ESP]` ainda fora da iteração da sprint (a publicação ou o encaixe falhou) → antes, mova-a com o IB do
   épico ([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) topo e §3), com "sim".
   Depois, a `[ESP]` pela seção Assumir do passo `sa-especificar.especificar.entrada`, com "sim". Pendência sem o
   MCP `elm`: na seção ELM pendente do `rascunho.md` da pasta de trabalho.

## Saída

A DoR conferida, o épico `iniciado` na base e a `[ESP]` assumida (ou `ELM pendente`) → passo `pasta`.

## Pare se

- A regra comum de assumir parou (a `[ESP]` é de outra pessoa; tarefa fechada sem o "sim") → a frase dela e pare.
