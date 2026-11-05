# Publicar no ELM (requisitos, exclusão, CT planejado, ATA, ET, casos de teste, conclusão)

Quem publica: requisitos, exclusão e CT planejado, o especificador na conclusão da `[ESP]`; a ATA, na aprovação dela;
a ET as-built, os casos de teste da fatia e a conclusão do IB, o P.O. ou o SM na consolidação. Vínculos:
[elm.md](../../sabia/references/elm.md#vínculos-cada-um-liga-o-que-gera).

Regras comuns (prévia, um "sim", idempotência, pendências): [../../sabia/references/elm.md](../../sabia/references/elm.md).
Formato dos conceitos: [../../sa-prd/references/okf-elm.md](../../sa-prd/references/okf-elm.md).

## Requisitos (conceitos OKF de `elm/` → DOORS Next)

Um comportamento só: aprovado na `[ESP]` (GATE do PRD ou da `[ESP] FT`) → na base → publicado no ELM na conclusão
da `[ESP]` (passo `sa-especificar.especificar.publicar` ou `sa-especificar.fatia.publicar`), numa confirmação.

**Escopo:**
- `[ESP] EP`: os conceitos do `elm/` do épico (`<produto>/epicos/<EP>-<slug>/elm/`), fora a ATA;
- `[ESP] FT`: os conceitos de `.kiro/specs/ft-<nnn>-<slug>/elm/`;
- nos dois: os CT planejados (seção CT planejado);
- a cópia da fatia (`.kiro/specs/ft-<nnn>-<slug>/elm/`) vale sobre a do épico (mesmo arquivo), e o `resource`/`id`
  volta aos dois.

**Filtro:** `status: stable` com um `verified` humano posterior ao `generated.at` e, além disso, sem `resource` ou
com o `verified` mais novo que o `last_modified` da entrada `elm` em `sources`. Na prévia, o já publicado na versão
aprovada é `sem mudança`, e o resto do escopo, "aguardando aprovação". Os tipos com Requisito `não` no catálogo ficam fora (a
ATA e o CT planejado têm a seção deles, abaixo).
Ordem: a **de publicação** do [catálogo de tipos](../../sabia/references/tipos.md), de baixo para cima, para cada um
nascer com os ids que cita (GL → REG → EL → HF → ET), com a **2ª passada HF ↔ EL** (item 5) logo depois das HFs e
antes da ET. A ET inicial do épico (linha ET = `inicial no PRD + as-built`) entra nessa ordem, com os requisitos; a
as-built da fatia segue a seção ET as-built abaixo.

1. **Conceito novo** (sem `resource`): no PRD, a coluna "No ELM" diz `novo (verificado <data>)`; na fatia, a linha
   `inclui` da seção Artefatos afetados, com o conceito aprovado na `[ESP] FT`; sem isso →
   [similares](../../sa-prd/references/similares.md) só para ele. Acerto `igual`/`sobrepõe` → não cria: volta à
   escrita da `[ESP]` (`sa-prd.prd.escrever` no épico, `sa-especificar.fatia.escrever` na fatia); o lote segue.
2. **Texto:** o corpo sem a seção `## Relações`; regra, termo ou leiaute já publicado → `[<id>](<id>)` (na HF, a
   linha **Telas:** já sai com o id da EL); conceito sem id → só o título. Os conceitos dos tipos da coluna Embute do
   catálogo (as regras citadas por uma história) vão em `embutir` (embed); o resto fica hyperlink.
3. `elm_publicar_req(sigla = o prefixo do conceito, titulo, texto_md, id?, modificado_em = last_modified da entrada
   do ELM em sources, embutir = ids dos conceitos embutidos)`. Erro `conflito` → mostre os dois lados e pergunte
   (regra 5).
4. **Grave de volta** no conceito: `resource`, `id` e `{id: elm, resource, last_modified}` em `sources`;
   termos, o id também na coluna ELM do glossário.
5. **2ª passada HF ↔ EL** (só com EL no lote): a EL sobe antes da HF e nasce com as HFs só pelo título. Publicadas
   as HFs, republique cada EL que cita uma HF sem id no texto publicado, com o `id` dela e `modificado_em` = o
   `last_modified` gravado no item 4: as HFs passam a `[<id>](<id>)`, como no item 2 (o sentido HF → EL já sai no
   item 2). Na mesma confirmação do lote; sem o "sim" para ela ou com falha → `ELM pendente [EL-<nn> <EP-nn|FT-nnn>
   ligar HF]`. O link tipado HF ↔ EL não existe: a relação é a citação nos dois corpos.

**Exclusão** (`status: deprecated`, ação `exclui`): não publica — o ELM não apaga, move para a lixeira, e o MCP não
tem essa operação. Na prévia, `🗑️ mover para a lixeira no DOORS Next: <id> · <título>`, e no lugar das pendências
do item ([pendências](../../sabia/references/elm.md#pendências)), `ELM pendente [<sigla> <id> lixeira]: mover para a
lixeira no DOORS Next`, até a pessoa confirmar.

**Depois**, na mesma confirmação: `elm_ligar(wi = <id da [ESP]>, req = <id>, tipo rastreia)` por requisito criado
ou atualizado. Sugira a `sa-sync` (baixar) para o bundle receber a versão oficial.

## CT planejado (`CT-nn-<slug>.md` de `elm/` → ETM)

Na mesma publicação e no mesmo "sim" dos requisitos (a conclusão da `[ESP]`), depois das HFs (o CT nasce ligado a
elas), pela linha **Casos de teste** da seção ELM do `sabia.md`:
- **`ETM`**, com `qm` no `pa`: cada CT `stable`, com um `verified` humano posterior ao `generated.at` e sem
  `resource` → `elm_criar_ct(titulo = title, cenario_md = o corpo sem a seção `## Relações`, reqs = ids das HFs que
  ele prova)`, sem `wi`; grave de volta como no item 4 dos requisitos. Erro `permissao` → `ELM pendente [CT-<nn>
  <EP-nn|FT-nnn> criar]`.
- **`CSV`**, ou o `pa` sem `qm`: o CT planejado fica no repositório — nada sobe e nenhuma `ELM pendente`.

## ATA (reunião da `[ESP]`)

Fora da ordem de publicação dos requisitos: cada ATA sobe na aprovação dela, pelo passo
`sa-especificar.reuniao.publicar`. Entrada: a `elm/ATA-nn-<slug>.md` `stable`, com um `verified` humano posterior ao
`generated.at`; a transcrição nunca sobe.

1. **Texto:** o corpo da ATA; o `D-nn` fica como texto (o `decisoes.md` não sobe sozinho).
2. `elm_publicar_req(sigla = "ATA", titulo, texto_md, id?, modificado_em?)` — o tipo de reunião da PA, pela sigla
   `ATA` em `rm.artefatos` — e `elm_ligar(wi = id da [ESP], req = id da ATA, tipo rastreia)`, numa confirmação.
3. **Grave de volta** na ATA, como no item 4 dos requisitos.

## ET as-built (só se a linha ET da seção ELM do `sabia.md` disser `só as-built` ou `inicial no PRD + as-built`)

A ET chega no PR (`.kiro/specs/<ft>-<slug>/elm/ET-<slug>.md`); publique como um requisito (sigla `ET`), com a linha
`Código: PR <link> · merge <sha curto>` no fim do texto publicado, e `elm_ligar(wi = <id da [DEV]>, req = <id da ET>,
tipo implementa)`. O MCP não tem vínculo tipado com o código: a relação é a linha `Código:`. Uma ET por fatia: nunca sobre o id da inicial. A entrada `et-inicial` do `sources`
(caminho relativo da inicial, sem URI) não entra no `modificado_em` nem no conflito: esses vêm só da `id: elm`.

- **Fatia de épico com ET inicial:** o **Elabora** dela vira `[<id da inicial>](<id da inicial>)` no texto, como
  um requisito já publicado (item 2 dos requisitos). Inicial ainda sem id (a `[ESP] EP` com `ELM pendente`) → a
  as-built sobe com o título da inicial e `ELM pendente [ET FT-<nnn> ligar]`.
- **Fatia sem épico** (ou épico sem ET inicial): sem ligação.

## Casos de teste da fatia (o `CT.csv`, com as evidências dos cenários `✅ aceito` do `verificacao.md`)

Pela linha **Casos de teste** da seção ELM do `sabia.md`:
- **`CSV`**, ou o `pa` sem `qm`: o `CT.csv` da fatia é a entrega — nenhum `elm_criar_ct` e nenhuma `ELM pendente`.
  Diga o caminho dele (o time o importa no ETM se quiser); no campo ELM do `status.md`, `CT CSV <caminho>`.
- **`ETM`**, com `qm` no `pa`: como abaixo.

Linha do `CT.csv` ligada a um CT planejado → o id vem do `resource`/`id` do `CT-nn-<slug>.md` em `elm/` do épico
ou da fatia (`.kiro/specs/ft-<nnn>-<slug>/elm/`, que vale sobre a do épico), publicado na conclusão da `[ESP]` (seção
CT planejado, acima), nunca da Descrição do `CT.csv` (informativa). Com id → não cria: `elm_ligar(wi = IB, ct = id)`
e o id ao lado do cenário; ainda sem id (a `[ESP]` com `ELM pendente`) → crie-o como na seção CT planejado e grave de
volta no conceito, depois `elm_ligar(wi = IB, ct = id)`. Só a linha de CT novo é criada do CSV: `elm_criar_ct(titulo = Resumo do CT.csv, cenario_md = Descrição, reqs = ids das
histórias que ele cobre — sem HF: as REG da fatia —, wi = IB)`. Grave o id ao lado do cenário e no campo ELM do
`status.md` (`CT <id>, …`). Erro `permissao` → `ELM pendente [CT FT-<nnn> criar]` e o `CT.csv`
para importar à mão no ETM; com os ids que a pessoa informar, `elm_ligar(ct, req)` e `elm_ligar(wi, ct)`.

## Conclusão do IB e do épico

IB da fatia: `elm_comentar(id, "PR <link> · pasta <pasta> · publicados: <ids de ET, CT>")` e
`elm_transicao(id, "concluir")`, na mesma confirmação. Na última fatia do épico (as demais `concluida`, `dividida`
ou `cancelada`), também o IB do épico (`elm_transicao(id, "concluir")`), junto com o `concluido` no `backlog.md` e
na Fase do `status.md` do épico (passo `sa-consolidar.consolidar.fechar`); épico `cancelado` não conclui (fica como está). Erro
`precondicao` → `ELM pendente [IB FT-<nnn> concluir]` (no épico, `[EP-<nn> concluir]`) com o atributo.
