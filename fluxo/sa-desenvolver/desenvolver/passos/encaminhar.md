---
{"resumo": "Mostra a fatia (trilha, modo, fase) e diz a próxima skill pela fase; oferece o sa-orquestrar no AFK; a exceção é o merge, do fluxo encerrar."}
---
## Entrada

A fatia com o `status.md` (iniciada agora, retomada ou já `pronta` na base).

## Faça

```
🚦 FT-<nnn> — <título>   ·   trilha <…> · modo <AFK|HITL> · fase <…>
Origem: <EP-nn — título | Manutenção> · Cobre: <… | ficha C1–Cn> · Branch: <…> · Pasta: .kiro/specs/<ft>-<slug>/
Próximo: <skill>
```

| Fase | Próxima skill |
|---|---|
| `pesquisando`, `planejando`, `aguardando-aprovacao-plano` | `sa-plano` (que começa pela `sa-pesquisar`) |
| `implementando`, `revisando`, `retrabalho (de: …)` | `sa-codificar` |
| `verificando` | `sa-verificar` (AFK) |
| `verificada` | AFK: passo `sa-codificar.codificar.pr` (abrir o PR) |
| `pr-aberto`, `em-revisao` | HITL: com o revisor — `[REV]` pela `sa-revisar` |
| `em-verificacao` | HITL: com o verificador — `[VER]` pela `sa-verificar` |
| `aceita` | HITL: Dev — **fluxo `sa-desenvolver.encerrar`** desta skill (merge do PR aprovado e conclusão da `[DEV]`) |
| `aguardando-aprovacao-pr` | AFK: com o Dev Sênior da `[APR] Aprovar PR` — pelo fluxo `sa-revisar.aprovar-pr`; `[APR]` concluída → Dev, **fluxo `sa-desenvolver.encerrar`** desta skill |
| `pronta` (na base) | `[DEV]` ainda aberta → **fluxo `sa-desenvolver.encerrar`**, só a conclusão da `[DEV]`; senão nada para o Dev: a consolidação é do P.O. ou do SM — `sa-consolidar` (agente `sa-produto`); `concluida` → já consolidada |
| `bloqueada (de: <fase>)` | mostre o motivo e a pergunta; resolvido → volta à skill da fase de origem. `aguardando troca para HITL` → a troca é do P.O. (`sa-planejamento.troca-modo`); registrada, a Troca AFK → HITL do passo `chegou` |

Modo AFK e várias fatias padrão ou rápida planejadas na sprint → ofereça o **`sa-orquestrar`** (o agente leva cada uma até
o PR).

## Saída

O bloco acima, com a próxima skill.

## Pare se

Sempre, depois do bloco: diga a próxima e **pare**: nunca invoque nem simule a skill da fase — ela começa na própria invocação. A
exceção é o merge (`aceita`, ou `aguardando-aprovacao-pr` com a `[APR]` concluída): o fluxo `sa-desenvolver.encerrar` é desta skill.
