---
{"resumo": "Commit direto na branch base de desenvolvimento: troca com o sim, árvore limpa, pull --ff-only, commit pequeno só dos arquivos do fluxo, push com o sim e volta à branch anterior."}
---
## Entrada

Os arquivos que o fluxo grava e a mensagem do commit. Grava direto na branch base: as linhas de estado (`backlog.md` e
`sprint-<nn>.md`), o `equipe.json`, o `acordos.md`, o `roadmap.md`, as Regras aprendidas do `.sabia/sabia.md`, os
documentos de planejamento (`pitch.md`, `prd.md`, ficha, registro de Sustentação, ATA, protótipos), os arquivos de
`elm/` da pasta da spec da fatia, o `status.md` arquivado (Publicação), o bundle do ELM (`sa-elm.baixar`) e, numa
sessão sem branch (Sustentação), o `.sabia/creditos/<usuario>.csv`. Código e o resto da spec (delta, design, tasks,
`research.md`, `status.md`, `CT.csv`) vão na branch `<id>`, com MR. A branch base é a chave `branch_base` do `agentes.json` e
precisa aceitar push (ex.: `develop`).

## Faça

1. **Autopilot.** O subagente do autopilot (worktree `.sabia/local/wt/<id>`) não grava na branch base: anote em Em aberto
   do `status.md` `cadastrar: <tipo> · <título> · origem <id>` (ou a linha que gravaria), devolva isso no resumo à
   pessoa e volte. Ela grava pela skill que pediu ou pela `sa-triar.cadastrar`.
2. **Base.** Fora da branch base → pergunte "troco para `<branch_base>`?". Antes de trocar, `git status --porcelain` com qualquer
   alteração → avise e pare. Nunca faça `stash`, `reset` nem descarte nada.
3. **Atualizar.** Base local à frente do remoto (commit de gravação ainda não publicado) → mostre o commit e peça o
   "sim" do push antes de seguir. Depois, `git pull --ff-only`; falhou → avise e pare.
4. **Escrever.** Leia o `backlog.md` já atualizado (o próximo id se calcula aqui) e escreva só as linhas e os
   arquivos do fluxo.
5. **Commit.** `git add` só desses caminhos e um commit pequeno com a mensagem do fluxo (ex.: `backlog: triagem
   FT-031`, `backlog: refinamento FT-031`, `EP-04 go`). O id da tarefa do EWM entra na mensagem só se o `acordos.md`
   pedir (chave `id no commit`).
6. **Push.** Mostre `git show --stat` e pergunte "publico na `<branch_base>`?". Sim: `git push` (nunca `--force`). Push
   recusado porque a branch base andou: desfaça só o próprio commit (`git reset --keep HEAD~1`), volte ao Atualizar,
   regrave (o id se recalcula) e pergunte de novo; na segunda recusa, avise e pare. Sem o "sim": o commit fica
   local, e a próxima gravação na branch base oferece o push primeiro.
7. **Voltar.** Volte à branch anterior (`git switch -`) sempre que trocou, inclusive depois de uma parada.

## Saída

O commit publicado na branch base (ou local, sem o "sim" do push) e a sessão de volta à branch anterior → o passo que
incluiu a gravação segue.

## Pare se

- Fora da branch base sem o "sim" à troca → pare sem gravar e mostre o que gravaria.
- Árvore suja, `pull --ff-only` falhou ou push recusado duas vezes → avise e pare (de volta à branch anterior).
