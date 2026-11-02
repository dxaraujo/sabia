---
{"fluxo": "prd", "dono": "sa-especificador",
 "quando": ["escrever o PRD de um épico e passar pelo GATE do PRD (o primeiro, na pasta de trabalho)", "escreve o PRD", "documenta a demanda", "especificar a demanda", "aprova o PRD"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "entender", "chama": "sa-pesquisar.pesquisar", "saidas": {"sem registro na triagem": "→ sa-triar.triar", "sem a pasta de trabalho": "→ sa-especificar.especificar"}},
   {"id": "entrevistar", "chama": ["sa-entrevistar.entrevistar", "sa-especificar.reuniao"]},
   {"id": "similares"},
   {"id": "escrever", "chama": "sa-especificar.prototipo"},
   {"id": "revisao", "chama": "sa-revisar.revisar", "saidas": {"achado que é decisão de negócio": "entrevistar"}},
   {"id": "gate", "saidas": {"decisão em aberto que muda comportamento": "entrevistar", "primeiro GATE aprovado, ou mudança de: aprovado aprovada (a [ESP] segue)": "→ sa-especificar.especificar", "correção de: fatiado, aprovada: volta a quem chamou, ou o P.O. retoma pela sa-consolidar": "fim"}}
 ]}
---
# PRD — O quê e por quê (épico)

Saída, na **pasta de trabalho** da especificação — `.sabia/local/especificacao/<EP>-<slug>/`, fora do git, montada
pela **`sa-especificar`** — até o GATE; depois dele, a `sa-especificar` a leva para `<produto>/epicos/<EP>-<slug>/`: o `prd.md` no formato do
padrão `sa-prd/prd.md`, o `decisoes.md` e a pasta `elm/` com **um conceito OKF
v0.2 por artefato novo**, de um tipo do [catálogo](~/.sabia/framework/skills/sabia/references/tipos.md) — o formato de [references/okf-elm.md](~/.sabia/framework/skills/sa-prd/references/okf-elm.md), o mesmo do
bundle que a `sa-sync` mantém. São esses arquivos que sobem para o DOORS Next depois do GATE; até lá, ficam aqui.

O PRD é um **registro de decisões** e a **proposta de mudança** da documentação oficial — não um documento vivo.
Depois de aprovado, os artefatos vão para o DOORS Next ([publicação](~/.sabia/framework/skills/sa-consolidar/references/elm-publicar.md)), que é a fonte
oficial; o que vale a longo prazo é o ELM, o glossário e os ADRs. Se o PRD afirma algo que ninguém decidiu, é um
defeito do PRD. Toda demanda entra pela `sa-triar`; só o que ela classifica como **épico** chega aqui. Uma fatia
com regra clara é trilha padrão sem épico, com uma ficha no lugar do PRD.

Leia antes: `.sabia/sabia.md` (ELM, caminhos, papéis) e o steering de produto que ele aponta.

## Modo autônomo

PRD é decisão de uma pessoa (o GATE do PRD): chamada em modo autônomo (`AUTONOMO=true`, pelo loop ou por um agente
sem pessoa na conversa) → "PRD, backlog e itens de Sustentação (`AT-`, `IM-`…) nunca são AFK — especifique numa
sessão com o P.O." e pare.

## Regras

- Nunca invente regra, valor ou ator: sem fonte e sem decisão de uma pessoa, é `em aberto`.
- O PRD não tem caminho de arquivo, nome de classe nem SQL — isso é do plano da fatia. Nomes técnicos só na ET
  inicial e na seção de dados da REG, pelas políticas da seção ELM do `sabia.md`.
- Escreva no idioma do projeto; nomes de sistemas, tabelas e campos na forma original.
- Não invoque nem simule outra skill além das que os passos mandam chamar (`sa-entrevistar`, o subagente revisor): depois do GATE, diga a próxima e pare.
