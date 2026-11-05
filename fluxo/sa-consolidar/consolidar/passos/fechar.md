---
{"resumo": "Na base: fatia concluida no status.md, no backlog.md e na sprint, épico concluído na última fatia, lições pela sa-aprender e o commit de consolidação; depois do push conferido, a conclusão do IB (e do épico) e os créditos na [GB]."}
---
## Entrada

Na base (desde a Entrada do fluxo), com o ELM e o conhecimento feitos (passos `elm` e `conhecimento`).

## Faça

- Na **base** (já nela desde a Entrada; commit direto — várias fatias podem ir no mesmo commit de
  consolidação): `status.md` da fatia com `Fase: concluida` e, no Histórico, `- <AAAA-MM-DD HH:MM> — fatia concluida
  (sa-consolidar) · <login>`; no `backlog.md`, `status` `concluida`, `concluida-em` e os ids do campo ELM do
  `status.md` (o item e as tarefas) que a coluna `elm` ainda não tem, no lugar de `pendente` ou do id sem link, com o
  tipo antes e a `url` do `elm_ler_wi(<id>)` (`REV [<id>](<url>)`; sem o MCP, o id sem link: `REV 669411`); na linha da fatia no
  `sprint-<nn>.md` aberto, Status `concluida`, os ids que faltam na Tarefa ELM (`DEV <id> · REV <id>`…) e Créditos = a soma da seção **Créditos** do `status.md` da base (com as
  linhas que o Dev gravou com a `pronta`) — o `creditos` do `backlog.md` é da virada da sprint; ADRs e glossário do
  passo `conhecimento`. Sem sprint aberta → grave só o `status.md` e o `backlog.md` (sem a linha da sprint e sem a
  linha em Créditos de gestão); os créditos da sessão vão só no comentário da `[GB]` (sa-status, Fechar a sessão,
  item 4).
- Última fatia do épico concluída (as demais `concluida`, `dividida` ou `cancelada`) → épico `concluido` no
  `backlog.md` e Fase `concluido` no `status.md` do épico, no mesmo commit, e, com ELM, o IB do épico no EWM
  concluído depois do push (abaixo; sem o MCP → `ELM pendente [IB EP-<nn> concluir]: concluir o IB do épico <id>
  (<atributo exigido>)` no rodapé do PRD, no commit); sugira a retrospectiva do épico (`sa-aprender`), com o lint do
  conhecimento. Épico `cancelado` não conclui: fica `cancelado` no `backlog.md`, na Fase e no EWM.
- **`sa-aprender.registrar`** para cada linha das **Lições candidatas** que o Dev gravou com a `pronta`
  (`status.md` da base): transcreva sem reclassificar — os fatos e a causa são de quem recebeu a correção — e grave
  o L-nnn na linha. Feito × certo → `Feito` e `Certo`; Onde estava o certo → `fonte`; Causa proposta (um valor da
  tabela do passo `sa-aprender.registrar.causa`) → `<causa>` do título; `Correção na fonte` = a coluna Correção na
  fonte dessa causa na tabela; `Situação: proposta`. Causa fora da tabela → pergunte à pessoa. Causa `—` ou
  `nenhuma` → nada a registrar. Promoção proposta (passo `sa-aprender.registrar.promocao`) → anote o L-nnn e siga, sem
  passar à `sa-aprender.promover`: o fecho a mostra.
- Créditos da sessão (passo `elm`, *créditos*): a linha em Créditos de gestão.
- Commit (padrão do `sabia.md`, `<id> consolidar`) com `status.md`, `backlog.md`, `sprint-<nn>.md` e o que mudou.
- **Push** pelo item 4 do [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base) (o
  `sa-produto` não faz push: entregue o comando e espere a pessoa publicar) e confira no remoto (`git fetch`;
  `git rev-parse <base>` = `git rev-parse origin/<base>`). Só então, numa confirmação: a conclusão do IB da fatia e,
  na última fatia, a do IB do épico ([conclusão](~/.sabia/framework/skills/sa-consolidar/references/elm-publicar.md#conclusão-do-ib-e-do-épico)),
  e o comentário dos créditos na `[GB]` (passo `elm`, *créditos*). Na falha, as `ELM pendente` gravadas agora vão
  num commit `<id> consolidar`, com o push e a conferência acima.

## Saída

A fatia `concluida` na base, commitada e no remoto, com o IB concluído (ou a pendência) → passo `proximo`.

## Pare se

- Remoto diferente do local depois do push → não conclua o IB nem comente os créditos: diga o que falta.
