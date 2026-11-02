# Publicar no ELM (requisitos, ATA, ET, casos de teste, conclusão)

Regras comuns (prévia, um "sim", idempotência, pendências): [../../sabia/references/elm.md](../../sabia/references/elm.md).
Formato dos conceitos: [../../sa-prd/references/okf-elm.md](../../sa-prd/references/okf-elm.md).

## Requisitos (conceitos OKF de `elm/` → DOORS Next)

Entrada: a pasta `elm/` do épico ou, numa fatia padrão sem épico, a da fatia. Publica só conceito `status: stable`
com um `verified` humano posterior ao `generated.at`; o resto aparece na prévia como "aguardando aprovação". Os tipos
com Requisito `não` no catálogo ficam fora (a ATA tem a seção dela, abaixo).
Ordem: a **de publicação** do [catálogo de tipos](../../sabia/references/tipos.md), de baixo para cima, para cada um
nascer com os ids que cita (GL → REG → EL → HF → ET), com a **2ª passada HF ↔ EL** (item 5) logo depois das HFs e
antes da ET. A ET inicial do épico (linha ET = `inicial no PRD + as-built`) entra nessa ordem, com os requisitos; a
as-built da fatia segue a seção ET as-built abaixo.

1. **Conceito novo** (sem `resource`): a coluna "No ELM" do PRD/ficha tem de dizer `novo (verificado <data>)`; sem
   isso → [similares](../../sa-prd/references/similares.md) só para ele. Acerto `igual`/`sobrepõe` → não cria: devolve
   à `sa-prd`; o lote segue.
2. **Texto:** o corpo sem a seção `## Relações`; regra, termo ou leiaute já publicado → `[<id>](<id>)` (na HF, a
   linha **Telas:** já sai com o id da EL); conceito sem id → só o título. Os conceitos dos tipos da coluna Embute do
   catálogo (as regras citadas por uma história) vão em `embutir` (embed); o resto fica hyperlink.
3. `elm_publicar_req(sigla = o prefixo do conceito, titulo, texto_md, id?, modificado_em = last_modified da entrada
   do ELM em sources, embutir = ids dos conceitos embutidos)`. Erro `conflito` → mostre os dois lados e pergunte
   (regra 5).
4. **Grave de volta** no conceito: `resource`, `id` e `{id: elm, resource, last_modified}` em `sources`; `**Publication**`
   no `log.md`; termos, o id também na coluna ELM do glossário.
5. **2ª passada HF ↔ EL** (só com EL no lote): a EL sobe antes da HF e nasce com as HFs só pelo título. Publicadas
   as HFs, republique cada EL que cita uma HF sem id no texto publicado, com o `id` dela e `modificado_em` = o
   `last_modified` gravado no item 4: as HFs passam a `[<id>](<id>)`, como no item 2 (o sentido HF → EL já sai no
   item 2). Na mesma confirmação do lote; sem o "sim" para ela ou com falha → `ELM pendente [EL-<nn> EP-<nn> ligar
   HF]`. O link tipado HF ↔ EL não existe: a relação é a citação nos dois corpos.

Depois: sugira a `sa-sync` (baixar) para o bundle receber a versão oficial.

## ATA (reunião da `[ESP]`)

Fora da ordem de publicação e da política Publicar requisitos: cada ATA sobe na aprovação dela, pelo passo
`sa-especificar.reuniao.publicar`. Entrada: a `elm/ATA-nn-<slug>.md` `stable`, com um `verified` humano posterior ao
`generated.at`; a transcrição nunca sobe.

1. **Texto:** o corpo da ATA; o `D-nn` fica como texto (o `decisoes.md` não sobe sozinho).
2. `elm_publicar_req(sigla = "ATA", titulo, texto_md, id?, modificado_em?)` — o tipo de reunião da PA, pela sigla
   `ATA` em `rm.artefatos` — e `elm_ligar(wi = id da [ESP], req = id da ATA)`, numa confirmação.
3. **Grave de volta** na ATA, como no item 4 dos requisitos; `**Publication**` no `log.md`.

## ET as-built (só se a linha ET da seção ELM do `sabia.md` disser `só as-built` ou `inicial no PRD + as-built`)

A ET chega no PR (`.kiro/specs/<ft>-<slug>/elm/ET-<slug>.md`); publique como um requisito (sigla `ET`) e
`elm_ligar(wi = IB, req = ET)`. Uma ET por fatia: nunca sobre o id da inicial. A entrada `et-inicial` do `sources`
(caminho relativo da inicial, sem URI) não entra no `modificado_em` nem no conflito: esses vêm só da `id: elm`.

- **Fatia de épico com ET inicial:** o **Elabora** dela vira `[<id da inicial>](<id da inicial>)` no texto, como
  um requisito já publicado (item 2 dos requisitos). Inicial ainda sem id → publique-a antes, pela ordem dos
  requisitos; sem o "sim" para ela → `ELM pendente [ET FT-<nnn> ligar]` e a as-built sobe com o título da inicial.
- **Fatia sem épico** (ou épico sem ET inicial): sem ligação.

## Casos de teste (cenários `✅ aceito` do `verificacao.md`)

Pela linha **Casos de teste** da seção ELM do `sabia.md`:
- **`CSV`**, ou o `pa` sem `qm`: o `CT.csv` da fatia é a entrega — nenhum `elm_criar_ct` e nenhuma `ELM pendente`.
  Diga o caminho dele (o time o importa no ETM se quiser); no campo ELM do `status.md`, `CT CSV <caminho>`.
- **`ETM`**, com `qm` no `pa`: como abaixo.

Para cada cenário sem id ao lado: `elm_criar_ct(titulo = Resumo do CT.csv, cenario_md = Descrição, reqs = ids das
histórias que ele cobre — sem épico: a regra da ficha —, wi = IB)` → grave o id ao lado do cenário e no campo ELM do
`status.md` (`CT <id>, …`). Erro `permissao` → `ELM pendente [CT FT-<nnn> criar]` e o `CT.csv`
para importar à mão no ETM; com os ids que a pessoa informar, `elm_ligar(ct, req)` e `elm_ligar(wi, ct)`.

## Conclusão do IB e do épico

IB da fatia: `elm_comentar(id, "PR <link> · pasta <pasta> · publicados: <ids de requisitos, ET, CT>")` e
`elm_transicao(id, "concluir")`, na mesma confirmação. Na última fatia do épico (as demais `concluida`, `dividida`
ou `cancelada`), também o IB do épico (`elm_transicao(id, "concluir")`), junto com o `concluido` no `backlog.md` e
na Fase do `status.md` do épico (passo `sa-consolidar.consolidar.fechar`); épico `cancelado` não conclui (fica como está). Erro
`precondicao` → `ELM pendente [IB FT-<nnn> concluir]` (no épico, `[EP-<nn> concluir]`) com o atributo.
