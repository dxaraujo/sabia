---
{"resumo": "Preenche o prd.md (padrão sa-prd/prd.md) e cria em elm/ um conceito OKF por artefato, mais index.md e log.md, pelas regras de escrita; o tipo com fluxo de toolkit no prompt sai por esse fluxo."}
---
## Entrada

O `decisoes.md` e as decisões do passo `similares`.

## Faça

Tipo com fluxo de toolkit no seu prompt (**Tipos com fluxo de toolkit**) → o artefato desse tipo sai pelo fluxo do
toolkit: rode-o em linha e volte a este passo ("Toolkit na especificação", no passo `sa-especificar.especificar.encaminhar`).
Na volta, confira o artefato pelo contrato: arquivo pela coluna Arquivo do catálogo, envelope do `okf-elm.md`,
`status: draft`, entrada no `index.md` e no `log.md`. Fora dele, complete aqui mesmo e registre no `status.md`.
Os demais tipos seguem as regras abaixo; o `prd.md`, o `index.md`, o `log.md` e o contrato continuam deste passo.

Preencha o padrão `sa-prd/prd.md` (o `prd.md`) e crie, em `elm/`, um arquivo por artefato, de um tipo do
[catálogo](~/.sabia/framework/skills/sabia/references/tipos.md) que este passo cria, fora os pendentes (nome pela coluna Arquivo), com
`status: draft`, `sources` (PRD, decisões), `generated` e o corpo do padrão do tipo (envelope em
[references/okf-elm.md](~/.sabia/framework/skills/sa-prd/references/okf-elm.md)), mais o `index.md` e uma entrada no `log.md`. O `prd.md`
só aponta para eles. Regras de escrita:

- **Histórias** pequenas o bastante para caber em poucas fatias; cada uma com cenários que cubram: caminho feliz,
  o que **não** deve ser aceito, repetição/reexecução, erro em um item (a operação continua? o que fica
  registrado?). "Então" sempre verificável — nada de "corretamente".
- **Regras** testáveis, com valores, uma por bloco, citando a decisão de origem (`D-nn`) ou a fonte.
- **Alteração** de comportamento documentado → traga o artefato do bundle da `sa-sync` pelo
  `elm_ler_req_local` (`id` = o id; o `markdown` devolvido é o arquivo inteiro) e grave-o em `elm/`, mantendo `resource`, `id` e o `sources` do ELM; ponha
  `status: draft` e um `generated` novo; reescreva no estado **depois** da mudança. Sem bundle, leia o artefato
  pelo `elm_ler_req(id)` e grave a mesma estrutura. A publicação atualiza o artefato existente em vez
  de criar outro. Na tabela do PRD, coluna "No ELM" = `altera <id>`.
- **Reutilizar** (decisão do passo `similares`) → não crie conceito: a HF embute a REG existente (`[<id>](<id>)`), linka o termo
  existente e cita a HF existente; a linha na tabela do PRD fica com `reusa <id>` e sem arquivo em `elm/`.
- **HF → REG** sempre por link para o arquivo da regra: na publicação ele vira **embed**. Relações entre requisitos
  (restringe, satisfaz) vão na seção `## Relações` do conceito — ficam só no repositório.
- **Decisões de implementação** sem caminho de arquivo e sem código — módulos, interfaces e contratos.
- **Decisões de teste:** proponha os **pontos de teste** (seams) — o mais alto possível, idealmente um por
  comportamento — e confirme com a pessoa: é por eles que as fatias vão provar que funcionam.
- Termos do glossário em todo o texto; termo novo já registrado pela entrevista.
- Mais de ~8 histórias ou mais de um objetivo de negócio → proponha dividir em dois épicos antes de escrever.

## Saída

`prd.md`, os conceitos em `elm/`, o `index.md` e o `log.md` na pasta de trabalho → passo `revisao`.

## Pare se

- Mais de ~8 histórias ou mais de um objetivo de negócio → a proposta de dividir vem antes da escrita (acima).
- Artefato que surgir na escrita passa pelo passo `similares` antes de virar arquivo.
