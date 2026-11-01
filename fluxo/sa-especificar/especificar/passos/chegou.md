---
{"resumo": "Lê o que chegou (EP-nn, [ESP] EP-nn ou [ESP] FT-nnn) e confere a DoR do épico; o que não é deste papel ou não está registrado é encaminhado."}
---
## Entrada

O item que a pessoa trouxe: `EP-nn`, `[ESP] EP-nn`, `[ESP] FT-nnn`, outro item ou um pedido em texto.

## Faça

| Entrada | Como ler |
|---|---|
| `EP-nn` ou `[ESP] EP-nn` | linha do épico em `## Épicos` do `backlog.md` da base; a `[ESP]` pela coluna `elm` (`ESP <id>`) ou pela Tarefa ELM da seção Especificação do `sprint-<nn>.md` |
| `[ESP] FT-nnn` (fatia `nova` que entrou na sprint para ficar pronta) | `sa-especificar.fatia` (Especificação de fatia) |
| `FT-nnn` sem `[ESP]`, `[DEV]`, `[REV]`, `[VER]`, `AT-nnn` | não é deste papel → "use `sa-iniciar <item>`" e pare |
| pedido em texto, ou épico fora do backlog | não está registrado → "use `sa-triar`" e pare |

**DoR do épico:** a do [`backlog.md`](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#definition-of-ready-o-que-faz-uma-fatia-elegivel)
(o problema, quem pede, o resultado e o `po`) — `elegivel` ou adiante já passou; `novo`, confira agora. Faltando →
liste e complete com a pessoa pela `sa-triar` (retomar o registro) — é trabalho desta `[ESP]`, que entrou na sprint
assim — e siga. `concluido` ou `cancelado` → nada a especificar; pare —
salvo `concluido` com a linha da Especificação ainda `iniciada`: só os itens 2–3 de "Depois do GATE do backlog"
(passo `fechamentos`), que gravam `concluida` e concluem a `[ESP]`. Épico
não planejado (`novo` ou `elegivel`, sem `[ESP]`) → ofereça o passo `sa-planejamento.sprint.especificacao`; a pessoa
pode seguir sem tarefa — a linha dele nasce na sprint aberta (passo `assumir`), como a da fatia puxada, e as horas ficam
`ELM pendente`. O `elegivel` que saiu de uma sprint sem começar (a linha dele nessa sprint tem `saiu da sprint`, e o
`elm` do épico no `backlog.md` guarda o `ESP <id>`) não conta como sem `[ESP]`: a dele ficou no backlog do EWM, é a
`[ESP]` da linha e move com o IB do épico para a iteração da sprint (passo `assumir`).

## Saída

O épico, a `[ESP]` (ou `pendente`) e a DoR conferida → passo `assumir`. `[ESP] FT-nnn` → `sa-especificar.fatia`.
`concluido` com a linha da Especificação ainda `iniciada` → passo `fechamentos` (só os itens 2–3 de "Depois do GATE
do backlog").

## Pare se

- `FT-nnn` sem `[ESP]`, `[DEV]`, `[REV]`, `[VER]`, `AT-nnn` → "use `sa-iniciar <item>`" e pare.
- Pedido em texto, ou épico fora do backlog → "use `sa-triar`" e pare.
- `concluido` ou `cancelado` → nada a especificar; pare (salvo o caso da Saída).
