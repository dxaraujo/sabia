---
{"resumo": "Preenche o prd.md (padrão sa-prd/prd.md) e cria em elm/ um conceito OKF por artefato, mais index.md e log.md, pelas regras de escrita e pelas políticas do sabia.md (ET inicial, REG com dados técnicos, Telas: a EL do protótipo aprovado) e o limite do acordos.md; o tipo com fluxo de toolkit no prompt sai por esse fluxo."}
---
## Entrada

O `decisoes.md` e as decisões do passo `similares`; a seção ELM do `.sabia/sabia.md` (linhas ET, REG com dados
técnicos e Telas) e a linha Especificação do `<produto>/acordos.md`. Com Telas = `sim`, o protótipo aprovado: o
`D-nn` `Protótipo v<N> aprovado` da última versão registrada (o maior `prototipo-v<N>-*` em `prototipo/`) e o arquivo
dela (passo `sa-especificar.prototipo.aprovacao`), ou o `D-nn` `Épico sem tela`.

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
- **Regras** testáveis, com valores, uma por bloco, citando a decisão de origem (`D-nn`) ou a fonte. Linha REG com
  dados técnicos = `sim` → a seção `## Dados` do padrão, quando a regra lê ou grava dado; `não` → sem ela.
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
- **ET inicial** — só com a linha ET = `inicial no PRD + as-built`: uma `ET-<slug>.md` do épico,
  no padrão `sa-prd/et.md` (título `ET - EP-<nn> <título>`), escrita das Decisões de implementação do `prd.md` e das
  `D-nn`, ligando as histórias que atende; entra na tabela do PRD como os outros artefatos. Com `só as-built` ou
  `não publica`, nenhuma ET aqui: a as-built é do PR da fatia (passo `sa-codificar.codificar.pr`).
- **Leiautes (EL)** — só com a linha Telas = `sim`: uma `EL-nn-<slug>.md` por tela que as histórias usam, no padrão
  `sa-prd/el.md`, lida da versão aprovada do protótipo, a última registrada (nunca de outra versão nem de memória). A HF cita a EL da tela
  (`**Telas:**`) e a EL lista as HFs que a usam (`## Histórias`): os dois sentidos, no mesmo lote. Campo, ação ou
  mensagem do protótipo sem história, regra ou `D-nn` → `em aberto`. Com `não`, ou com o `D-nn` `Épico sem tela`,
  nenhuma EL.
- **Decisões de teste:** proponha os **pontos de teste** (seams) — o mais alto possível, idealmente um por
  comportamento — e confirme com a pessoa: é por eles que as fatias vão provar que funcionam.
- Termos do glossário em todo o texto; termo novo já registrado pela entrevista.
- **Limite do épico:** o da linha Especificação do `acordos.md` (toda história conta, inclusive as desdobradas de
  outra); sem a linha, ~8 histórias e um objetivo de negócio. Passou → proponha dividir em dois épicos antes de escrever.

## Saída

`prd.md`, os conceitos em `elm/`, o `index.md` e o `log.md` na pasta de trabalho → passo `revisao`.

## Pare se

- Acima do limite do épico (linha Especificação do `acordos.md`; sem ela, ~8 histórias ou mais de um objetivo de
  negócio) → a proposta de dividir vem antes da escrita (acima).
- Artefato que surgir na escrita passa pelo passo `similares` antes de virar arquivo.
- Telas = `sim` sem o `D-nn` `Protótipo v<N> aprovado` da última versão registrada e sem o `D-nn` `Épico sem tela` →
  `sa-especificar.prototipo` (chama e volta) antes do lote: aprovado ou sem tela, siga; aguardando o protótipo, o
  cliente ou a versão do ajuste, ali a sessão fecha.
