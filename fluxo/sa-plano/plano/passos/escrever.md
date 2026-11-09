---
{"resumo": "Escreve pela matriz trilha × formato: Quick Spec, Bugfix Spec ou spec completa no Kiro; proposal, delta, design e tasks no OpenSpec."}
---
## Entrada

O delta, o `research.md`, as decisões, a trilha (`status.md`), o tipo (fatia ou bug) e o `formato_spec`.

## Faça

1. Escreva pela matriz (modelos no template `sa-plano/plano.md`):

   | Trilha | Kiro | OpenSpec |
   |---|---|---|
   | rápida fatia | Quick Spec: `requirements.md`, `design.md` e `tasks.md` numa passada, sem portões | `proposal.md` + delta + `tasks.md` |
   | rápida bug | Bugfix Spec: `bugfix.md`, `design.md`, `tasks.md` | `proposal.md` + delta MODIFIED + `tasks.md` |
   | completo | `requirements.md` → `design.md` → `tasks.md` | `proposal.md` + delta + `design.md` + `tasks.md` |

2. Completo: uma parte por vez, com o passo `revisar` entre elas.
3. `design.md`: os títulos fixos do formato, Decisões técnicas e os critérios de pronto (Cenário `CT-nn` · Como
   executar · Esperado · Onde verificar).
4. `tasks.md`: uma tarefa por comportamento, teste primeiro, comando de pronto e o `CT-nn`; no Kiro com
   `_Requirements: N.M_`, no OpenSpec com `- [ ] 1.1`. Refatoração preparatória entra como tarefa. A última tarefa é
   a suíte completa.
5. Aplique as Regras aprendidas do `.sabia/sabia.md`.
6. O plano mostra que a fatia passa de G → pare e ofereça "vira épico", como no `sa-desenvolver.iniciar.assumir`:
   pelo passo `gravar`, a linha `EP-nn` (`a-moldar`, `obs` `veio de FT-nnn`) e a FT `cancelada` com `virou EP-nn`.

## Saída

Parte escrita (ou o plano inteiro, na rápida) → passo `revisar`.

## Pare se

- Passa de G: vira épico (a saída passa ao pitch).
