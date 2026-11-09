---
{"resumo": "Confere sprint ou expedite, DoR, WIP, trava de artefato e o registro publicado na branch base antes de assumir."}
---
## Entrada

O item da entrada comum (fatia ou bug, sem branch `<id>` publicada ou com a branch que voltou na virada), a linha dele no `backlog.md` da branch base, o
`sprint-<nn>.md` aberto (o de maior chave), o `acordos.md` e a ficha `.sabia/planejamento/fatias/FT-nnn-<slug>.md`.

## Faça

1. **Sprint ou expedite.** O item tem linha no `sprint-<nn>.md` aberto com Trabalho `desenvolvimento` → segue. Fora
   da sprint com prioridade `crítica` → é expedite, pela Classe de serviço do `acordos.md`, sem aprovação do P.O.; a
   linha da sprint nasce no passo `posse`. Fora da sprint sem `crítica` → "não está na sprint; o reabastecimento é do
   P.O. (`sa-planejamento.sprint`)" e pare.
2. **DoR.** Status `pronta` → segue. Status `aceita` (ainda não refinado) → mostre o que falta no checklist DoR da
   ficha e ofereça a `sa-refinar.detalhar`. Só siga com o "sim" de quem puxa.
3. **WIP.** Conte o WIP por coluna do `acordos.md` com os valores de status (`em-andamento`; `em-revisao` é derivado
   do MR aberto) e os MRs parados. Acima do limite → mostre e recomende destravar antes (revisar um MR). Não trava; o
   expedite pode passar o WIP em 1.
4. **Trava de artefato.** Só com ELM. Um `<sigla>-<id>` com `altera` ou `exclui` nos artefatos afetados da ficha está no `elm/` de
   outra fatia que não está `cancelada` nem com `Publicação: publicada` (a que gravou o `elm/` primeiro tem a
   precedência) → "FT-<x> tem o mesmo `<sigla>-<id>`; espere ela ser publicada ou cancelada" e pare.
5. **Registro publicado.** `git fetch` e confira que a linha do item e a ficha estão em `origin/<branch_base>`. Só no local →
   peça antes o push pelo passo `gravar`. Sem remoto, vale a branch base local.

## Saída

Item puxável → passo `assumir`.

## Pare se

- Fora da sprint sem prioridade `crítica`.
- `aceita` sem o "sim" de quem puxa (a saída leva ao refinamento).
- Trava de artefato, ou registro só local sem o push.
