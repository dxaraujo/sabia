---
{"resumo": "Fatia bloqueada segue o lote; problema sistêmico para o lote inteiro; resumo final, horas numa pergunta só, créditos no merge e worktrees até o merge."}
---
## Entrada

O resultado de cada fatia do lote (passo `fases`).

## Faça

- **Fatia bloqueada** (lacuna de negócio, divergência com o plano, 2 reprovações, verificação rejeitada duas
  vezes) → registre o motivo e a pergunta exata no `status.md`; siga com as outras.
- Bloqueio `⚠️ ambiente` numa fatia só (da validação, da revisão ou da verificação) → ela fica `bloqueada (de:
  <fase>)` e o lote segue com as outras.
- Ao fim, o resumo:
  ```
  🤖 Loop AFK — resultado
  | FT | Resultado | PR | Rodadas (plano/código/aceite) | Observação |
  Aguardando pessoa: <planos para aprovar ([APR] de <login>) · PRs para ler e aprovar ([APR] de <login>) · trocas
  de modo (P.O. ou SM, agente `sa-produto`: `sa-planejamento.troca-modo`) · bloqueios com pergunta>
  Merge: cada PR com a [APR] concluída → você, pela `sa-desenvolver`, fluxo `encerrar` ("mergeia a FT-<nnn>")
  ELM pendente [<chave>]: <o que falhou ou ficou sem o MCP `elm`>
  Lições para registrar: <correções que o loop precisou — sa-aprender>
  ```
- **Horas, numa pergunta só** (com o MCP `elm`): uma tabela `tarefa | horas sugeridas` com a `[DEV]` de toda fatia
  que o lote tocou, inclusive as paradas no GATE do plano e as bloqueadas; horas sugeridas = o tempo da sessão em
  partes iguais entre elas; a pessoa ajusta e confirma de uma vez → `elm_horas(<id>)` →
  desconte → `elm_lancar_horas` (lança, não conclui). A conclusão da `[DEV]` é no merge de cada fatia (`sa-desenvolver.encerrar`), com
  o saldo. No AFK, revisão e verificação por subagente não têm tarefa nem horas; as das `[APR]` são lançadas por
  quem aprova, na sessão dele.
- **Créditos:** o Kiro grava o consumo do turno só quando ele termina, por isso o lote não os registra: no resumo,
  `Créditos: no merge de cada fatia, rateio 1/<n> desta sessão (<FT…>)` — o Dev grava a parte de cada fatia no
  fluxo `sa-desenvolver.encerrar` ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4).
- Worktrees ficam até o merge; quem conduz o merge as remove logo depois (Worktree do loop, no fluxo
  `sa-desenvolver.encerrar`), sem `--force` — os agentes não podem (`git worktree remove` é negado a todos): entregam o
  comando e a pessoa o roda.

## Saída

O resumo, as horas lançadas (ou `ELM pendente`) e o log atualizado: aqui o fluxo termina. O merge de cada PR aprovado
é de quem disparou o loop.

## Pare se

**Problema sistêmico** (build quebrado na base, o mesmo `⚠️ ambiente` ou o mesmo erro em **duas** fatias) →
**pare o lote inteiro**: o loop não conserta ambiente.
