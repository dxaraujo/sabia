---
{"resumo": "Lê a trilha registrada no backlog (padrão ou rápida) e o caminho que ela dá; trilha que não serve volta à sa-triar."}
---
## Entrada

A linha da fatia no `backlog.md`.

## Faça

A trilha vem do registro, não de uma triagem nova: a coluna `trilha` da linha da fatia no `backlog.md` (de épico,
sempre **padrão**).

| Trilha | Caminho depois daqui |
|---|---|
| **padrão** | pesquisa → plano → **GATE do plano** → implementação → PR → revisão → verificação (AFK: revisão e verificação antes do PR) |
| **rápida** | pesquisa curta → `bugfix.md` + `tasks.md` (o teste que reproduz primeiro) → implementação → PR → revisão → verificação (AFK: antes do PR) |

## Saída

A trilha da fatia → passo `compromisso`.

## Pare se

Ao ler o item, a trilha registrada não serve (a "rápida" tem regra de negócio nova)
→ pare e devolva à `sa-triar` para refazer a triagem.
