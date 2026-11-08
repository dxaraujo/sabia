---
{"resumo": "Commit do status.md e do .config.kiro e push da branch: o push mostra a posse ao time."}
---
## Entrada

A branch `<id>` com a pasta da spec (rápida e completo) ou sem commit novo (trivial).

## Faça

Volta da virada (a branch já está publicada) → nada a fazer; siga.

1. Rápida e completo: commit do `status.md` e do `.config.kiro` (`<FT> iniciar`).
2. Mostre o comando e pergunte "publico a branch?". Sim → `git push -u origin <branch>` (no autopilot, de dentro da
   worktree: `cd .sabia/local/wt/<id> && git push -u origin <branch>`). No trivial, a branch vai sem commit novo.
3. Não → a branch fica só local: avise que ninguém vê a posse (nem a `sa-status`) e siga.

## Saída

Branch publicada (ou só local, com o aviso) → passo `elm`.

## Pare se

- O push falhou por permissão ou rede → mostre o erro e o comando pronto, e siga com a branch local.
