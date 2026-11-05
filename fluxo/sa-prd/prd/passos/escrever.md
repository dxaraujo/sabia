---
{"resumo": "Preenche o prd.md (padrão sa-prd/prd.md) e cria em elm/ um conceito OKF por artefato novo, alterado ou excluído (com o impacto revisto), pelas regras de escrita e pelas políticas do sabia.md (ET inicial, REG com dados técnicos, Telas: a EL do protótipo aprovado, Casos de teste: o CT planejado de cada cenário) e o limite do acordos.md; o tipo com skill de toolkit no prompt sai por ela."}
---
## Entrada

O `decisoes.md` e as decisões do passo `similares`; a seção ELM do `.sabia/sabia.md` (linhas ET, REG com dados
técnicos, Telas e Casos de teste) e a linha Especificação do `<produto>/acordos.md`. Com Telas = `sim`, o protótipo aprovado: o
`D-nn` cuja Decisão começa por `Protótipo v<N> aprovado`, da última versão registrada (o maior `prototipo-v<N>-*` em
`prototipo/`), e o arquivo dela (passo `sa-especificar.prototipo.aprovacao`), ou o `D-nn` cuja Decisão começa por
`Épico sem tela`.

## Faça

Tipo com skill de toolkit no seu prompt (sem agente: a seção **Tipos com skill de toolkit** do `.sabia/sabia.md`) → o artefato desse tipo sai pela skill:
carregue-a, siga o fluxo e o padrão do tipo pelos caminhos da linha, se a linha os trouxer (senão, a skill), e volte a este passo ("Toolkit na
especificação", no passo `sa-especificar.especificar.encaminhar`).
Na volta, confira o artefato pelo contrato: arquivo pela coluna Arquivo do catálogo, envelope do `okf-elm.md`,
`status: draft`. Fora dele, complete aqui mesmo.
Os demais tipos seguem as regras abaixo; o `prd.md` e o contrato continuam deste passo.

Preencha o padrão `sa-prd/prd.md` (o `prd.md`) e crie, em `elm/`, um arquivo por artefato, de um tipo do
[catálogo](~/.sabia/framework/skills/sabia/references/tipos.md) que este passo cria, fora os pendentes (nome pela coluna Arquivo), com
`status: draft`, `sources` (PRD, decisões), `generated` e o corpo do padrão do tipo (envelope em
[references/okf-elm.md](~/.sabia/framework/skills/sa-prd/references/okf-elm.md)). O `prd.md` só aponta para eles. Regras de escrita:

- **Histórias** pequenas o bastante para caber em poucas fatias; cada uma com cenários que cubram: caminho feliz,
  o que **não** deve ser aceito, repetição/reexecução, erro em um item (a operação continua? o que fica
  registrado?). "Então" sempre verificável — nada de "corretamente".
- **Regras** testáveis, com valores, uma por bloco, citando a decisão de origem (`D-nn`) ou a fonte. Linha REG com
  dados técnicos = `sim` → a seção `## Dados` do padrão, quando a regra lê ou grava dado; `não` → sem ela.
- **Alteração** de comportamento documentado → traga o artefato do bundle da `sa-sync` pelo
  `elm_ler_req_local` (`id` = o id; o `markdown` devolvido é o arquivo inteiro) e grave-o em `elm/`, mantendo `resource`, `id` e o `sources` do ELM; ponha
  `status: draft` e um `generated` novo; reescreva no estado **depois** da mudança. Sem bundle, monte o envelope
  do `elm_ler_req(id)`: `type` = `tipo`, `title` = `titulo`, `tags` = `[pasta]`, `resource` = `url`, `id` = `id`,
  `sources` = os do PRD e das decisões + `{id: elm, resource: <url>, last_modified: <modificado>}`, `status: draft`,
  `generated` novo; o corpo é o Markdown devolvido; `links` não entra. A publicação atualiza o artefato existente em vez
  de criar outro. Na tabela do PRD, coluna "No ELM" = `altera <id>`.
- **Exclusão** (decisão do passo `similares`) → a cópia, como na Alteração, com `status: deprecated`, `generated` novo
  e o motivo em `## Relações` (o substituto, quando há); não é publicada: na conclusão da `[ESP]`, vai à lixeira do
  DOORS Next por roteiro manual ([okf-elm.md](~/.sabia/framework/skills/sa-prd/references/okf-elm.md#ciclo-de-vida)). Na tabela do PRD,
  coluna "No ELM" = `exclui <id>`.
- **Impacto** (passo `similares`) → o artefato que cita o alterado ou o excluído e muda é alterado no mesmo lote (a HF
  que embute a REG alterada; o CT do cenário da HF alterada); o que não muda fica na coluna Impacto do PRD.
- **Reutilizar** (decisão do passo `similares`) → não crie conceito: a HF embute a REG existente (`[<id>](<id>)`), linka o termo
  existente e cita a HF existente; a linha na tabela do PRD fica com o rótulo `<sigla>-<id do ELM>` (ex.: `REG-2101`), `reusa <id>` e sem arquivo
  em `elm/`.
- **HF → REG** sempre por link para o arquivo da regra: na publicação ele vira **embed**. Relações entre requisitos
  (restringe, satisfaz) vão na seção `## Relações` do conceito — ficam só no repositório.
- **Decisões de implementação** sem caminho de arquivo e sem código — módulos, interfaces e contratos.
- **ET inicial** — só com a linha ET = `inicial no PRD + as-built`: uma `ET-<slug>.md` do épico,
  no padrão `sa-prd/et.md` (título `ET - EP-<nn> <título>`), escrita das Decisões de implementação do `prd.md` e das
  `D-nn`, ligando as histórias que atende; entra na tabela do PRD como os outros artefatos. Com `só as-built`,
  nenhuma ET aqui (a as-built é do PR da fatia, passo `sa-codificar.codificar.pr`); com `não publica`, nenhuma ET.
- **Leiautes (EL)** — só com a linha Telas = `sim`: uma `EL-nn-<slug>.md` por tela que as histórias usam, no padrão
  `sa-prd/el.md`, lida da versão aprovada do protótipo, a última registrada (nunca de outra versão nem de memória). A HF cita a EL da tela
  (`**Telas:**`) e a EL lista as HFs que a usam (`## Histórias`): os dois sentidos, no mesmo lote. Campo, ação ou
  mensagem do protótipo sem história, regra ou `D-nn` → `em aberto`. Com `não`, ou com o `D-nn` cuja Decisão começa
  por `Épico sem tela`, nenhuma EL.
- **Decisões de teste:** proponha os **pontos de teste** (seams) — o mais alto possível, idealmente um por
  comportamento — e confirme com a pessoa: é por eles que as fatias vão provar que funcionam.
- **Casos de teste planejados (CT)** — da HF, no mesmo lote: um `CT-nn-<slug>.md` por cenário, no padrão
  `sa-prd/ct.md`, com o resultado esperado igual ao "Então" do cenário; entram na tabela do PRD e são aprovados no
  GATE com os demais. Pela linha Casos de teste: `ETM` → sobem ao ETM na publicação, na conclusão da `[ESP]`; `CSV` → ficam
  no repositório. A execução e a evidência são da verificação da fatia (`CT.csv`, passo `sa-verificar.verificar.casos`).
- Termos do glossário em todo o texto; termo novo já registrado pela entrevista.
- **Limite do épico:** o da linha Especificação do `acordos.md` (toda história conta, inclusive as desdobradas de
  outra); sem a linha, até 8 histórias e um objetivo de negócio. Passou (sem a linha: 9 ou mais histórias, ou mais de
  um objetivo) → proponha dividir em dois épicos antes de escrever.

## Saída

`prd.md` e os conceitos em `elm/` na pasta do PRD (a de trabalho; na mudança, a do épico na base) → passo `revisao`.

## Pare se

- Acima do limite do épico (linha Especificação do `acordos.md`; sem ela, 9 ou mais histórias ou mais de um objetivo de
  negócio) → a proposta de dividir vem antes da escrita (acima).
- Artefato que surgir na escrita passa pelo passo `similares` antes de virar arquivo.
- Telas = `sim` sem o `D-nn` cuja Decisão começa por `Protótipo v<N> aprovado`, da última versão registrada, e sem o
  `D-nn` cuja Decisão começa por `Épico sem tela` →
  `sa-especificar.prototipo` (chama e volta) antes do lote: aprovado ou sem tela, siga; aguardando o protótipo, o
  cliente ou a versão do ajuste, ali a sessão fecha.

Ao parar aqui (na sessão da `[ESP]`, feche-a: `sa-especificar.especificar.fechar-sessao`).
