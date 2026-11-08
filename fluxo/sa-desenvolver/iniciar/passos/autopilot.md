---
{"resumo": "Lança o sa-desenvolvedor como subagente na worktree com o id, a rota e o teto do disjuntor; a pessoa fica livre na base."}
---
## Entrada

O item com modo IA autopilot, a worktree `.sabia/local/wt/<id>` e a linha Disjuntor do `acordos.md`.

## Faça

1. Lance o `sa-desenvolvedor` como subagente com: o id, a rota, a worktree e o teto do disjuntor (tentativas,
   tempo, custo; 2 reprovações seguidas disparam sempre).
2. O subagente roda a `sa-plano.plano` (rápida e completo) e depois a `sa-desenvolver.codificar`, até o MR aberto.
   Os comandos rodam sempre como `cd .sabia/local/wt/<id> && <comando>`, e os arquivos são acessados pelo caminho da
   worktree.
3. Liberado ao subagente: push da própria branch (sem `--force`), `git merge origin/<base>` nela e abrir ou
   atualizar o MR dela. Bloqueado: merge do MR, ELM e rede. Ele não grava na base.
4. Os contadores ficam em `.sabia/local/loop-<id>.md`, pelo padrão `sa-desenvolver/loop.md`.
5. Diga à pessoa que ela está livre na base e pode puxar outro item: várias tarefas em paralelo, sem lote.

## Saída

Subagente lançado → o fluxo termina. A devolução à pessoa vem no fim do codificar (MR aberto) ou no disjuntor.

## Pare se

- A worktree não existe ou está suja → mostre e pare.
