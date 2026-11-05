---
{"resumo": "Publica no ELM, numa confirmação, os conceitos aprovados do elm/ do épico e os CT planejados (elm-publicar.md, escopo [ESP] EP), liga cada requisito à [ESP] (rastreia) e dá o roteiro da lixeira do excluído; o que volta (resource, id) vai no commit do passo concluir."}
---
## Entrada

O PRD aprovado na base (passo `fechamentos`; na retomada, o filtro dá `sem mudança` no que já subiu).

## Faça

Projeto sem ELM (seção ELM do `.sabia/sabia.md`) → pule para o passo `concluir`.

Com ELM, pela [publicação](~/.sabia/framework/skills/sa-consolidar/references/elm-publicar.md#requisitos-conceitos-okf-de-elm--doors-next)
(seções Requisitos, escopo `[ESP] EP`, e CT planejado), com prévia e **uma** confirmação:

1. Os conceitos de `<produto>/epicos/<EP>-<slug>/elm/` na base, fora a ATA (publicada na aprovação dela), que passam
   no filtro, e os CT planejados das HF.
2. `elm_ligar(wi = <id da [ESP]>, req = <id>, tipo rastreia)` por requisito criado ou atualizado
   ([vínculos](~/.sabia/framework/skills/sabia/references/elm.md#vínculos-cada-um-liga-o-que-gera)).
3. `exclui` → na prévia, `🗑️ mover para a lixeira no DOORS Next: <id> · <título>`, e no rodapé do PRD
   `ELM pendente [<sigla> <id> lixeira]: mover para a lixeira no DOORS Next`, até a pessoa confirmar.
4. CT planejado com `resource` alterado depois de publicado (filtro de atualização da seção CT planejado do
   `elm-publicar.md`) → na prévia, `✏️ atualizar no ETM: <id> · <título>`, e no rodapé do PRD
   `ELM pendente [CT-<nn> EP-<nn> atualizar]: atualizar o CT <id> no ETM`, até a pessoa confirmar.
5. Grave de volta `resource`, `id` e a entrada `elm` de `sources` nos conceitos (e o id no glossário): vão no commit
   do passo `concluir`.

Sem o MCP `elm` ou com falha → `ELM pendente [EP-<nn> publicar]: publicar <rótulos> e ligar à [ESP]` no rodapé do PRD
([pendências](~/.sabia/framework/skills/sabia/references/elm.md#pendências)), e siga.

## Saída

Publicado e ligado (ou `ELM pendente`), ou projeto sem ELM → passo `concluir`.

## Pare se

- Sem o "sim" → a `[ESP]` não conclui: feche a sessão (passo `fechar-sessao`) e pare; o próximo
  `sa-especificar EP-<nn>` volta a este passo pelo `entrada` e pelo `fechamentos`.
