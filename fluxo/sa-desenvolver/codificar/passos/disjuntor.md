---
{"resumo": "Só no autopilot: conta tentativas, tempo, custo e reprovações em .sabia/local/loop-<id>.md e devolve à pessoa no teto."}
---
## Entrada

Uma etapa do autopilot terminou (tarefa, revisar, verificar) ou uma reprovação. A linha Disjuntor do
`acordos.md`.

## Faça

Fora do autopilot → nada a fazer; siga.

1. Acrescente a linha da etapa em `.sabia/local/loop-<id>.md`, pelo padrão `sa-desenvolver/loop.md`.
2. Dispara no teto do `acordos.md` (tentativas, tempo ou custo) ou em 2 reprovações seguidas na mesma etapa
   (revisar ou verificar).
3. Disparou: grave a linha `Devolvido: <motivo> · AAAA-MM-DD HH:MM`, o Retomar do `status.md`, commit e push da
   branch, e devolva à pessoa o resumo (motivo, Desvios, Em aberto).
4. A pessoa resolve o motivo na worktree e relança o autopilot (`sa-desenvolver.iniciar.autopilot`), que
   zera as reprovações; o modo não muda.

## Saída

Não disparou → volte ao passo `tarefa` com a correção; disparou → o fluxo termina.

## Pare se

- Disparou.
