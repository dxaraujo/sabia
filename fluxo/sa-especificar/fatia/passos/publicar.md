---
{"resumo": "Publica no ELM, numa confirmação, os conceitos aprovados da fatia e os CT planejados (elm-publicar.md, escopo [ESP] FT), liga cada requisito à [ESP] FT (rastreia) e dá o roteiro da lixeira do excluído; o que volta (resource, id) vai no commit do passo concluir."}
---
## Entrada

A especificação aprovada na base (passo `aprovacao`); ou, pelo passo `entrada`, a linha `iniciada` com conceito da
fatia aprovado na base e ainda não publicado, pelo filtro do `elm-publicar.md` (retomada: o filtro dá `sem mudança`
no que já subiu).

## Faça

Como o passo `sa-especificar.especificar.publicar`, com o escopo `[ESP] FT`: os conceitos de
`.kiro/specs/ft-<nnn>-<slug>/elm/` e os CT planejados das HF deles, numa confirmação;
`elm_ligar(wi = <id da [ESP] FT>, req = <id>, tipo rastreia)` por requisito criado ou atualizado; as pendências
(`[FT-<nnn> publicar]`, `[<sigla> <id> lixeira]`, `[CT-<nn> FT-<nnn> atualizar]`) no rodapé da ficha, na base, também na fatia `iniciada` (Regras do
fluxo). O que volta (`resource`, `id`, `sources`) vai no
commit do passo `concluir`, gravado também no conceito de mesmo nome em `<produto>/epicos/<EP>-<slug>/elm/`, quando a
cópia veio dele. Projeto sem ELM → pule.

## Saída

Publicado e ligado (ou `ELM pendente`), ou projeto sem ELM → passo `concluir`.

## Pare se

- Sem o "sim" → a `[ESP]` não conclui: a sessão fecha (Regras do fluxo) e pare.
