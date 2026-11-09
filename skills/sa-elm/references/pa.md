# Montar o `pa_<nome>.json`, bloco a bloco

O `pa` decide o que o MCP `elm` grava em cada work item: um valor errado só aparece quando a PA recusa a criação, a
transição ou o lançamento de horas. Por isso aqui não vale "padrão sem perguntar".

- **Dois lugares de onde vem um valor:** a descoberta (`elm_setup_descobrir`) ou a pessoa. Nunca deduza um nome, um
  `qname`, um time code ou um valor de enumeração; nunca copie de outro projeto sem mostrar a origem e pedir a
  confirmação daquele valor.
- **Formato:** leia o [schema publicado](https://dxaraujo.github.io/mcps/elm/pa.schema.json) antes do bloco 0 e monte
  o `pa` nele: chaves, aninhamento e obrigatórios vêm do schema, não da memória.
- **Um bloco por mensagem**, na ordem abaixo, no cartão:

  ```
  ### 🧩 ELM · Bloco <n>/9 · <nome do bloco>
  <o que este bloco decide, em uma frase>

  | # | Opção | Detalhe | Fonte |
  |---|---|---|---|
  | 1 | <valor> ⭐ (recomendado) | <…> | 🧩 |

  <n> de <n> da descoberta

  > ❓ **<pergunta do bloco>**
  > `<n>` escolhe · `ok` aceita a recomendada · `<n>: <valor>` muda uma linha
  ```

  Todas as opções que a descoberta trouxe aparecem na tabela, com a recomendada primeiro; a linha `<n> de <n> da
  descoberta` confere que nada foi cortado. Mais de 12 opções → duas colunas (`| # | Opção | # | Opção |`). Resposta
  que não deixa claro o que muda → repita o que entendeu, em tabela, e espere a confirmação; nunca passe ao bloco
  seguinte com uma pergunta aberta.
- **Nada é gravado** antes da conferência (passo `gravar-pa`).
- **Modo atualização** (já existe `.sabia/config/elm/pa_<nome>.json`): mostre o `pa` atual bloco a bloco e pergunte só
  o que muda.

## 0. Credencial e project areas

`elm_status(projeto)` (sem `pa`, `faltando` vem preenchido: normal). Erro `credencial` → peça o
`~/.config/mcp-elm/elm.properties` (`server`, `user`, `password`) e pare. Pergunte um trecho do nome da PA do EWM e se
o DOORS Next usa o mesmo nome (ou qual) → `elm_setup_descobrir(ccm, rm)`. Mostre as PAs achadas e confirme. Não há
bloco do ETM: os casos de teste ficam no `CT.csv`.

## 1. Time e categoria

Liste os times (`ccm.times`) com as categorias de cada um; recomende o de quem configura. A categoria
(`filedAgainst`) é a do time escolhido.

## 2. Tipos

| # | Uso no fluxo | Tipo do EWM | Fonte |
|---|---|---|---|
| 1 | `ib` — o IB de cada item do `backlog.md` (épico, fatia, bug, sustentação) | <Item de Backlog> | 🧩 |
| 2 | `tarefa` — `DEV`, `ESP` e `ATD` | <Tarefa> | 🧩 |
| 3 | `defeito` (opcional; a `sa-elm.importar-backlog` traz os Defeitos como bug) | <Defeito · não usa> | 🧩 |

## 3. Campos de cada tipo

Um tipo por mensagem (IB, tarefa, defeito se houver). Todos os campos da descoberta numa tabela `| | # | Campo | Tipo
do valor | Obrigatório |` com a caixa `[✅]`/`[ ]`. Já vêm marcados os do fluxo (Planejado para, Responsável,
Estimativa na tarefa) e, como 🔒, os que a descoberta trouxe em `obrigatorios` e os que a PA cobra por processo mesmo
marcados opcionais (no IB, `Categoria`; na tarefa, a categoria de integração de horas, o código do produto e a
classificação da tarefa, quando a PA os tem). `tirar <n>` tira (confirme: sem ele a PA recusa depois); `pôr <n>`
acrescenta. A categoria do time (`filedAgainst`) não é o campo `Categoria` do tipo: nunca use um como valor do outro.

## 4. Valores

Chame de novo `elm_setup_descobrir` com `valores_de` = todos os campos de enumeração marcados. Um campo por linha,
com o valor recomendado (⭐) marcado ✔ se estiver na lista da PA; fora da lista → mostre a lista inteira e pergunte.
Campo de texto (ex.: o código do produto) → pergunte o valor; nunca deixe obrigatório sem valor. "Planejado para"
nunca vai em `padroes`: é a iteração da sprint ou o backlog do produto.

## 5. Valor por item

O MCP aplica, na criação: os `padroes` do tipo, depois o `por-prefixo` cujo texto inicia o título, depois os campos da
chamada. Uma linha por prefixo:

| # | Item | Título começa por | Valores |
|---|---|---|---|
| 1 | IB | `[` | os do bloco 4 |
| 2 | tarefa de desenvolvimento | `[DEV]` | classificação de desenvolvimento |
| 3 | tarefa de especificação | `[ESP]` | classificação de análise e especificação |
| 4 | tarefa de atendimento (as seis categorias da Sustentação) | `[ATD]` | classificação de suporte |

Valor de enumeração só da lista da PA. Grave o comum em `padroes` e cada prefixo com valor diferente em
`por-prefixo`. Confira: todo campo de `obrigatorios` tem valor em `padroes` ou chega por parâmetro (iteração, dono,
estimativa).

## 6. Horas e links (sem pergunta)

Horas: `"horas": {"time-code": "Horas Diretas", "work-type": "Tarefa"}`. Links: os padrões do MCP (pai, filhos,
implementa, relacionado); só `depende`, e só se a descoberta trouxer um tipo de link de dependência (mostre e
confirme). Os dois viram uma linha `✔ Bloco 6 — …` no começo do bloco 7.

## 7. DOORS Next

Para cada sigla com ELM `DOORS` do catálogo de tipos (HF · REG · EL · GL · ATA; a ET fica para o passo `et`), pergunte
o tipo de artefato (lista `rm.tipos`) e a pasta (lista `rm.pastas`), com a recomendada pelo nome. Projeto sem uma
delas → a sigla fica de fora. `EL` só com Telas = sim na seção Especificação do `sabia.md`. **Bundle**
(`rm.download`): procure no repositório pastas com `index.md` de `okf_version`; senão sugira `docs/elm/<nome>` e
pergunte.

## 8. Backlog do produto

`elm_backlog()` → `atual` (o `ccm.backlog` do `pa`) e `candidatos`. Já há `atual` → mostre e confirme. Senão, pergunte
a linha de base do projeto (a iteração da timeline onde ficam o backlog e os pais das sprints) e se ela já tem a
iteração `Backlog` com o plano: tem → a pessoa escolhe o candidato ou cola o link do plano; não tem → com "sim",
`elm_backlog(nome = "Backlog", pai = <linha de base>)`. `permissao` → peça a quem administra a PA. É a iteração que a
`sa-elm.importar-backlog` usa e onde nasce o IB fora de sprint.

## 9. Conferência

Mostre o `pa` inteiro numa tabela legível (PA, time e categoria, cada tipo com campos, obrigatórios, padrões e
`por-prefixo`, horas, RM com cada sigla, bundle e backlog), com a origem de cada valor (descoberta, pessoa ou fixo), e
depois o JSON que será gravado, byte a byte, conferido contra o schema. Outra project area → repita tudo num outro
`pa_<nome>.json` e diga na seção ELM qual é o template.
