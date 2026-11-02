---
{"resumo": "Escolhe a rubrica pelo pedido (P, L ou C), com a entrada de cada uma, e lê a rubrica inteira, o sabia.md, o steering e as regras aprendidas."}
---
## Entrada

O pedido: PRD de um épico, plano de uma fatia ou código de uma fatia.

## Faça

| Pedido | Rubrica | Entrada |
|---|---|---|
| PRD de um épico | **P** | `prd.md`, os conceitos de `elm/`, `decisoes.md`, glossário, bundle do ELM pelo `elm_buscar_req_local` (para P6); com a linha Telas = `sim` do `sabia.md`, ela e o arquivo do protótipo aprovado em `prototipo/` (o da última versão registrada, com o `D-nn` `Protótipo v<N> aprovado`) (para P12) |
| plano de uma fatia | **L** | `.kiro/specs/<ft>/`: `research.md`, `requirements.md`, `design.md`, `tasks.md`; PRD do épico; `backlog.md` (`cobre`) |
| código de uma fatia | **C** | diff `git diff origin/<base>...HEAD` (worktree: `cd <worktree> && git diff origin/<base>...HEAD`), a pasta da fatia, o PRD |

Rubricas no padrão `sa-revisar/rubricas.md` — leia a do pedido inteira antes de começar.
Sempre: `.sabia/sabia.md` (comandos, regras críticas), o steering de tecnologia e estrutura que ele
aponta e as regras aprendidas (última seção do `sabia.md`).

## Saída

A rubrica do pedido e a entrada dela lidas → passo `evidencia`.

## Pare se

—
