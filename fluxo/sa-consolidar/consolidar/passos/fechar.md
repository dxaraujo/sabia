---
{"resumo": "Na base: fatia concluida no status.md, no backlog.md e na sprint, épico concluído na última fatia, lições pela sa-aprender, créditos na [GB] e o commit de consolidação."}
---
## Entrada

Na base (desde a Entrada do fluxo), com o ELM e o conhecimento feitos (passos `elm` e `conhecimento`).

## Faça

- Na **base** (já nela desde a Entrada; commit direto — várias fatias podem ir no mesmo commit de
  consolidação): `status.md` da fatia com `Fase: concluida` e data; no `backlog.md`, `status` `concluida`,
  `concluida-em` e os ids do campo ELM do `status.md` (o item e as tarefas) que a coluna `elm` ainda não tem, no
  lugar de `pendente` ou do id sem link (com o tipo antes: `REV [<id>](<url>)`); na linha da fatia no `sprint-<nn>.md` aberto, Status `concluida`, os ids que faltam na
  Tarefa ELM (`DEV <id> · REV <id>`…) e Créditos = a soma da seção **Créditos** do `status.md` da base (com as
  linhas que o Dev gravou com a `pronta`) — o `creditos` do `backlog.md` é da virada da sprint; ADRs e glossário do
  passo `conhecimento`.
- Última fatia do épico concluída (as demais `concluida`, `dividida` ou `cancelada`) → épico `concluido` no
  `backlog.md` e Fase `concluido` no `status.md` do épico, no mesmo commit, e, com ELM, o IB do épico no EWM
  concluído ([conclusão](~/.sabia/framework/skills/sa-consolidar/references/elm-publicar.md#conclusão-do-ib-e-do-épico), na mesma confirmação do passo `elm`; sem o MCP → `ELM pendente
  [EP-<nn> concluir]` no rodapé do PRD); sugira a retrospectiva do épico (`sa-aprender`), com o lint do
  conhecimento. Épico `cancelado` não conclui: fica `cancelado` no `backlog.md`, na Fase e no EWM.
- **`sa-aprender.registrar`** para cada linha das **Lições candidatas** que o Dev gravou com a `pronta`
  (`status.md` da base): transcreva sem reclassificar — os fatos e a causa são de quem recebeu a correção — e grave
  o L-nnn na linha. Causa `—` ou `nenhuma` → nada a registrar.
- Créditos da sessão (passo `elm`, *créditos*): o comentário na `[GB]` e a linha em Créditos de gestão.
- Commit (padrão do `sabia.md`, `<id> consolidar`) com `status.md`, `backlog.md`, `sprint-<nn>.md` e o que mudou.

## Saída

A fatia `concluida` na base, commitada → passo `proximo`.

## Pare se

—
