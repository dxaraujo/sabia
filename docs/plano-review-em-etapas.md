# Plano: review em etapas, Histórico de Entregas e Métricas

Plano para aprovação. Nada aqui foi implementado: nenhum código, fluxo, template ou versão mudou.

Linhas conferidas na árvore de trabalho em 2026-11-25, com a **2.1.42 ainda sem commit** (retrospectiva em etapas:
`cli/cerimonia.mjs`, `cli/cerimonia.test.mjs`, `cli/sabia.mjs`, `fluxo/sa-planejamento/regras.md`, três arquivos da
retrospectiva, `template/sa-planejamento/sprint.md` e as versões). Depois do commit dela, os números de linha desses
arquivos podem deslocar. As entregas deste plano partem da **2.1.43**.

## 0. Decisões tomadas e andamento (2026-11-25)

Respostas do dono do projeto, que valem sobre o que o resto do documento recomenda:

- **D1**: o épico é entrega quando foi concluído no ciclo, quando a especificação dele fechou na sprint ou quando teve
  fatia entregue nela (a recomendada).
- **D2 e papéis**: na review, **só o apresentador registra** (inclui, dizendo de quem é, altera e remove). Os demais
  só acompanham a página.
- **D4**: sem tipo. Toda ideia ou necessidade entra como item novo e é triada depois com a IA. A linha gravada é
  `- ideia ou necessidade · <texto> — por <quem>`.
- **D6**: a repriorização e os cancelamentos só são gravados no Publicar (a recomendada).
- **D9**: métricas calculadas das sprints, com a `## Métricas` no `sprint-<nn>.md` e o comando `sabia metricas`; sem
  `metricas.json` (a recomendada).
- **Sem migração**: só há uma sprint concluída. Não se lê formato antigo, nem na review nem na retro ("retorno",
  "pedido novo", `Bom`/`Melhorar`, lição com votos).
- **`--propostas`** foi removida das duas cerimônias: onde este documento a cita, não vale.
- **D3, D5, D7, D8, D10, D11, D12**: seguem a recomendação, até aviso em contrário.

Andamento: **tudo entregue**, em menos versões do que a tabela da seção 6 previa.

| Versão | O que entrou |
|---|---|
| 2.1.44 | Feedback, ideias e necessidades, review em etapas com o apresentador, épico como entrega |
| 2.1.46 | `reordenar` e `prepararLote` no `acoes.mjs`; etapa 3 (repriorização do backlog) e o passo `backlog` |
| 2.1.49 | `cli/metricas.mjs` e `sabia metricas`; `**Capacidade:**` e `## Métricas` na sprint; passos `metricas` e `historico`; Histórico de Entregas |

Diferenças para o desenho abaixo:

- O `executar` do `acoes.mjs` não mudou: o commit do lote é feito pelo `publicar` da cerimônia, restrito aos caminhos
  tocados.
- A linha `- Números:` da `## Retro` deixou de existir (sem migração): a `## Métricas` a substitui.
- A tabela das entregas na `## Métricas` não traz Trilha nem Autonomia; tem uma coluna por trabalho.
- O painel "Dados do ciclo" continua só na retrospectiva.
- Ficaram por fazer: o item do `docs/a-fazer.md` sobre rodar os fluxos novos num agente, e a linha do `README.md`.

## 1. Contexto

### O que é hoje

**Página `sabia review`** (`cli/cerimonia.mjs`)

- Sem etapas: `etapas: modo === "retrospective" ? ETAPAS : []` (`cerimonia.mjs:168`), `desenharReview` (`:652-665`) e
  o ramo da review em `aplicar` (`:376-390`), que só aceita `incluir` e `remover`. Qualquer pessoa remove o ponto de
  qualquer pessoa (`:389`).
- Grupos montados em `cerimoniaDoProjeto` (`:155-167`): um por item com status `concluida`/`concluido` cuja linha do
  **trabalho principal** (`PRINCIPAL`, `:50`) tem `concluida_em`, mais o grupo `pedido` ("Pedidos novos", `:166`).
- A palavra é "Retorno": tag e cor do grupo (`:162`), `sem retorno` (`:217`, `:257`), textos da página (`:648`,
  `:658`, `:661`), CSS `[data-g="retorno"]` (`:442`).
- Formato gravado (`linhasDaSecao`, `:216-217`; lido por `importarSecao`, `:253-262`):
  `- <id> · <retorno> — por <quem>; <retorno> — por <quem>`, `- <id> · sem retorno` e
  `- pedido novo · <pedido> — por <quem>`.
- O `sprint-<nn>.md` só muda no Publicar (`publicar`, `:417-432`; rota `POST /acao`, `:971-979`), com commit só desse
  arquivo e push. `podePublicar` (`:133-141`) exige equipe e branch base, **não** exige árvore limpa.
- O épico quase nunca aparece como entrega: o trabalho principal dele é `especificação` (`:50`), mas o épico só fica
  `concluido` no merge da última fatia (`acoes.mjs:91-99`), em geral sem linha de especificação concluída naquela
  sprint; e o épico cuja especificação fechou na sprint está `fatiado`, fora de `CONCLUIDOS` (`:49`, `:159`).

**Retrospectiva em etapas (2.1.42, a reaproveitar)**

- `ETAPAS` (`:34-44`), `estado.etapa` (`:950`), `aplicarRetro` (regras por etapa e papel, `:276-355`), ação
  `avancar {de}` (`:285-291`), `visaoDe` (visão por pessoa no servidor, `:360-368`), apresentador = conexão local
  (`LOCAIS`, `:935`; `apresentador: local`, `:980`; `apresentador: local && retro`, `:856`), faixa `#etapas`
  (`:894`, desenhada em `:673-675`), popups `#modal-etapa` (`:904-910`) e `#modal-item` (`:911-918`), Publicar só na
  última etapa (`:973`, `:731-732`).

**Quadro Kanban, que já grava no backlog** (`cli/acoes.mjs`, usado por `cli/kanban.mjs:10`, `:793`)

- `preparar` (`acoes.mjs:72-169`): `ordenar {id, antes|depois}` (`:155-163`, só `produto`: `exige(true)`),
  `cancelar {id, motivo}` (`:117-130`: status `cancelada`/`cancelado`, `motivo · desde <hoje>`, fecha o épico na última
  fatia, tira a pasta da spec; recusa épico com fatia aberta, `:122`), `para-backlog`, `para-sprint`, `impedir`,
  `liberar`.
- `executar` (`:173-189`): `podeGravar` (`:58-68`, exige árvore limpa) → `git pull --ff-only` → grava → um commit por
  ação → push. Pela rede o quadro só mostra (`kanban.mjs:746-751`).
- Quem é quem: `usuarioDaMaquina` devolve `{usuario, nome, produto}` (`acoes.mjs:46-55`).

**Regras e fluxos**

- A ordem do backlog é de quem tem `produto` (`fluxo/sa-planejamento/regras.md:17-19`;
  `schemas/equipe.schema.json:24`). Reordenar e cancelar pelo agente é a `sa-refinar.ajustar`
  (`fluxo/sa-refinar/ajustar/ajustar.md:22-25`: fatia ou bug `aceita`/`elegivel`, épico `em-especificacao`/`fatiado`;
  passos `ordenar`, `cancelar-fatia`, `cancelar-epico`). Cancelar item `em-andamento` é da `sa-status.situacao`.
- `sa-planejamento.review` (`fluxo/sa-planejamento/review/review.md:5-12`): `inicio` → `rito` → `cadastro` → `gravar`
  → `commit-na-branch-base` → `seguir`. Não gera histórico nem métricas.
- Métricas: quem calcula hoje é o agente, em texto (`sprint/passos/capacidade.md:10-18`,
  `sa-status/painel/passos/metricas.md:10-17`), e a página da retro (`numerosDaSprint`, `cerimonia.mjs:63-70`;
  `resumoDaSprint`, `:117-130`). O único registro gravado é a linha `- Números:` da `## Retro`
  (`retrospectiva/passos/fechar.md:10`; `template/sa-planejamento/sprint.md:38`).
- Release notes / changelog / histórico de entregas: **não achei nada** no repositório (grep por `release notes`,
  `changelog`, `histórico de entregas`). O `roadmap.md` tem a coluna `Release` (`template/sa-planejamento/roadmap.md:7`),
  só de previsão.

### O que muda

1. A review passa a ter três etapas liberadas pelo apresentador: **Feedback** por entrega, **Novas ideias e
   necessidades**, **Repriorização do backlog** (reordenar e cancelar). "Retorno" vira "Feedback" em toda parte, com
   leitura do formato antigo.
2. De volta à IA, a `sa-planejamento.review` ganha os passos `backlog`, `historico` (Histórico de Entregas) e
   `metricas` (seção `## Métricas` do `sprint-<nn>.md`).
3. As métricas passam a ter um cálculo só, no CLI, e a sprint guarda o retrato dela; o histórico da equipe é derivado
   das sprints (recomendação da decisão D9).

## 2. Decisões em aberto

Cada uma com a recomendação. O resto do plano supõe as recomendadas.

| # | Decisão | Recomendação | Alternativa e o que muda |
|---|---|---|---|
| D1 | **O que é "entrega" na Etapa 1**, em especial o épico. | Fatia e bug: como hoje. Atendimento: como hoje. Épico: aparece quando (a) ficou `concluido` com `concluida_em` (do backlog) dentro da sprint, (b) a linha de especificação dele fechou na sprint (`fatiado`), ou (c) teve fatia entregue na sprint; nos casos (b) e (c) o bloco diz "em andamento · n de m fatias". As fatias entregues ficam abaixo do épico pai. | Só entrega concluída: o épico só aparece no caso (a); o feedback sobre épico em andamento vai na fatia. Mais simples, mas o stakeholder costuma falar do épico. |
| D2 | **Etapa 1 oculta ou à vista.** | À vista de todos, como hoje: review é conversa com o stakeholder, sem voto. Só o autor altera ou remove o próprio feedback enquanto a etapa dura (regra da retro), no lugar do "qualquer um remove" de hoje. | Oculto até liberar (como os pontos da retro): reaproveita `visaoDe` inteira, mas atrapalha a conversa. |
| D3 | **Etapas sem volta?** | Sem volta, como na retro (mesma ação `avancar {de}` e mesmo popup). Depois da etapa, o apresentador ainda inclui (regra `aplicarRetro:296`). | Permitir voltar na review (nada é oculto): exige ação e regra novas só para ela. |
| D4 | **Uma ou duas categorias na Etapa 2.** | Um bloco "Novas ideias e necessidades" com seletor **Ideia \| Necessidade** por linha: ajuda o cadastro a propor o tipo (ideia grande → épico `a-moldar`; necessidade → fatia, bug ou sustentação). | Categoria única: uma linha `- ideia ou necessidade · …`; o tipo sai só da pergunta do cadastro. |
| D5 | **Quem reordena e cancela na Etapa 3.** | Só o apresentador (conexão local) **e** com `produto: true` no `equipe.json`, a mesma regra do quadro (`acoes.mjs:82-86`, `:156`). Os demais veem a ordem mudar ao vivo. Sem `produto`, a etapa é só leitura e diz quem tem `produto`. | Aceitar a anuência nomeada de quem tem `produto`: hoje ela só vale no reabastecimento (`regras.md:18-19`); seria regra nova. |
| D6 | **A Etapa 3 grava na hora ou só no Publicar.** | Só no Publicar, num commit só com o `sprint-<nn>.md` e o `backlog.md` (regra da 2.1.40: a página só altera arquivo no Publicar). O cancelamento pede o motivo no popup e fica "a cancelar" até lá, com desfazer. | Gravar na hora, uma ação por commit (`executar` como está): nenhum código novo no `acoes.mjs`, mas vários commits no meio da reunião e sem desfazer. |
| D7 | **O que a Etapa 3 lista e o que pode cancelar.** | Lista todo item não terminal, na ordem do backlog, com o selo "na sprint" ou "em andamento". Reordena qualquer um. Cancela só o que a `sa-refinar.ajustar` cancela (antes de `em-andamento`); `em-andamento` segue na `sa-status.situacao` e o épico com fatia aberta na `sa-refinar.ajustar` (`acoes.mjs:122` já recusa). | Cancelar também o `em-andamento`, como o quadro: o `preparar` já devolve o aviso de fechar MR, branch e worktree (`acoes.mjs:130`), mas é efeito demais para uma reunião com o cliente. |
| D8 | **As ideias da Etapa 2 entram na ordem da Etapa 3?** | Não nesta entrega: elas ainda não têm id (nascem pelo passo `cadastro`, no fim da tabela, `fluxo/cadastro.md:23`) e entram como `nova`, antes da triagem. A posição é da `sa-refinar.ajustar` depois. | A página deixa posicionar a ideia; a linha da `## Review` guarda `· antes de <id>` e o passo `cadastro` grava a linha nessa posição. Muda a regra do cadastro comum. |
| D9 | **Onde ficam as métricas históricas** (velocidade/vazão da equipe). | Seção `## Métricas` em cada `sprint-<nn>.md` (o retrato do ciclo) e histórico **derivado** das sprints pelo CLI (`sabia metricas`, JSON). Sem `metricas.json` e sem mexer no `backlog.md`. Prós e contras na seção 5.3. | `metricas.json` próprio ou seção no `backlog.md`: seção 5.3. |
| D10 | **Onde mora o Histórico de Entregas.** | `.sabia/planejamento/historico-de-entregas.md`, cumulativo, a sprint mais nova no topo, com template próprio. | `CHANGELOG.md` na raiz do projeto-alvo (visível fora do `.sabia/`, mas pode colidir com um changelog técnico que o projeto já tenha); ou um arquivo por sprint. |
| D11 | **Histórico e métricas como passos da review ou fluxos próprios.** | Passos da `sa-planejamento.review` (`historico`, `metricas`): o pedido é "quando voltar para a IA". | Fluxos próprios (`sa-planejamento.historico`), chamáveis fora da review, para regerar o histórico de uma sprint antiga. Dá para acrescentar depois sem refazer nada. |
| D12 | **A linha `- Números:` da `## Retro`.** | Sai do formato novo: a `## Métricas` a substitui e o passo `fechar` da retrospectiva passa a conferir e completar a `## Métricas` (meta atingida). A linha antiga continua lida e preservada (`trocarSecao` com `manter`, `cerimonia.mjs:187`, `:408`). | Manter as duas: número duplicado em dois lugares do mesmo arquivo. |

## 3. Desenho: a página `sabia review` em três etapas

### 3.1 Etapas e papéis

Reaproveita o mecanismo da retro. `ETAPAS` (`cerimonia.mjs:34`) passa a ser por modo (`ETAPAS.retrospective` e
`ETAPAS.review`, ou `ETAPAS_REVIEW` ao lado); `dados.etapas` (`:168`) já leva a lista ao cliente.

| Etapa (`id`) | Quem faz o quê | Botão do apresentador (`liberar`) |
|---|---|---|
| 1 `feedback` · Feedback | Todos incluem feedback em cada entrega; só o autor altera ou remove o seu (popup `#modal-item`). | — (é a primeira) |
| 2 `ideias` · Novas ideias e necessidades | Todos incluem ideia ou necessidade (seletor do tipo); só o autor altera ou remove. Feedback: só o apresentador ainda inclui. | "Ir às novas ideias e necessidades" |
| 3 `backlog` · Repriorização do backlog | O apresentador com `produto` reordena e marca a cancelar; todos veem. Nada mais se altera nas etapas 1 e 2. | "Ir à repriorização do backlog" |

- Apresentador = quem abre a página na máquina do servidor (`LOCAIS`, `:935`): `paginaCerimonia` deixa de restringir
  `apresentador` à retro (`:856`); a faixa `#etapas` (`:894`) e o `#modal-etapa`/`#modal-item` (`:904-918`) saem do
  `retro ? … : ""`.
- Publicar só na última etapa: a checagem de `:973` e o botão (`:731-732`) passam a olhar a última etapa do modo.
- A review que já tem `## Review` gravada abre na última etapa, como a retro (`:950`).
- `visaoDe` (`:360`): na review nada é oculto (D2); a função devolve o estado inteiro e o cliente esconde os blocos
  das etapas que ainda não chegaram, como `desenharRetro` faz com `bloco.hidden` (`:717-718`).

### 3.2 Modelo de estado

```js
estado = {
  versao: 1, modo: "review", sprint: "<AAAA>/Sprint <nn>",
  etapa: "feedback" | "ideias" | "backlog",
  itens: [                       // como hoje (:383), com dois campos a mais
    { id, grupo: "<id da entrega>", texto, autor, em, votos: [] },                 // feedback
    { id, grupo: "ideia", tipo: "ideia" | "necessidade", texto, autor, em, votos: [], cadastrado: "FT-040" | null },
  ],
  backlog: { ordem: ["FT-052", "FT-040", …] | null, cancelar: { "FT-047": "motivo" } },   // novo; null = não mexeu
  nao_publicado: true | false,   // já existe (:954)
}
```

`dados` (de `cerimoniaDoProjeto`) ganha, na review: `grupos` das entregas por tipo (D1, com `pai` para aninhar a fatia
no épico), o grupo `ideia` no lugar de `pedido`, e `backlog`: os itens não terminais na ordem do `backlog.md`
(`id`, `titulo`, `tipo`, `status`, `prioridade`, `tamanho`, `pai`, `na_sprint`, `cancelavel`), tirados de
`st.quadro.itens` (`status.mjs:267-333`), além de `publicar.produto` (de `usuarioDaMaquina`).

### 3.3 Ações (`POST /acao`)

Uma função `aplicarReview(estado, acao, dados, agora, { nome, chave, apresentador })`, irmã de `aplicarRetro`, chamada
de `aplicar` (`:372-391`) no lugar do ramo atual.

| Ação | Etapa | Quem | Regra |
|---|---|---|---|
| `avancar {de}` | qualquer, menos a última | apresentador | igual à retro (`:285-291`) |
| `incluir {grupo, texto, tipo?}` | a do grupo; depois dela, só o apresentador | todos | limpa `;` e ` — ` como hoje (`:379`); `tipo` só no grupo `ideia` |
| `editar {id, texto, tipo?}` · `remover {id}` | a do grupo | o autor | regra `meu(item)` da retro (`:281`, `:345-346`) |
| `ordenar {id, antes \| depois}` | `backlog` | apresentador com `produto` | muda só `estado.backlog.ordem`; mesma assinatura do quadro (`acoes.mjs:155`) |
| `cancelar {id, motivo}` · `manter {id}` | `backlog` | apresentador com `produto` | marca ou desmarca em `estado.backlog.cancelar`; motivo obrigatório; só item `cancelavel` (D7) |
| `publicar {mensagem}` | última | local | abaixo |

No cliente: `desenharReview` (`:652`) passa a seguir a etapa; o bloco Backlog é uma lista com arrastar e os botões
"subir / descer / cancelar" por linha (teclado e toque), com o item marcado a cancelar riscado e o motivo à vista.

### 3.4 Publicar com o backlog (reaproveitando `acoes.mjs`)

- Sem mudança no backlog (`estado.backlog` nulo): `publicar` como está (`:417-432`).
- Com mudança: a página monta a lista de ações do quadro — um `reordenar` e os `cancelar` — e chama o `acoes.mjs`,
  que grava o `backlog.md` (e o `git rm` da pasta da spec do cancelado) **no mesmo commit** do `sprint-<nn>.md`.
- Duas extensões pequenas no `acoes.mjs`, sem reescrever regra nenhuma (funções **novas, a criar**):
  1. ação `reordenar { ids: [...] }` em `preparar`: permuta as linhas citadas entre as posições que elas já ocupam
     (o que a página não lista fica onde está); `exige(true)` como o `ordenar`. Serve também ao quadro.
  2. `prepararLote(raiz, acoes, ctx)`: aplica `preparar` em sequência sobre o texto em memória (hoje cada `preparar` lê
     o disco, `:73-76`) e junta `arquivos`, `remover` e `avisos`; e `executar` passa a aceitar a lista, os arquivos
     extras (o `sprint-<nn>.md`) e a mensagem, com o commit restrito aos caminhos tocados (`git commit -- <caminhos>`,
     como o `publicar` da cerimônia, `:427`).
- Sem commit possível (`dados.publicar.ok` falso): a Etapa 3 fica só leitura, como o quadro, e o botão segue gravando
  só o arquivo da sprint (`:975`).
- Os `avisos` de `preparar` (épico fechado pela última fatia, `acoes.mjs:98`) voltam na resposta do Publicar e
  aparecem na página.
- Mensagem do commit: continua `<AAAA>/Sprint <nn>: review` (`mensagemPadrao`, `:412`).

### 3.5 Formato da `## Review` no `sprint-<nn>.md`

```markdown
## Review

- EP-03 · bloqueio de conta ficou claro para o suporte — por Rui Prado
- FT-031 · cliente aprovou o extrato — por Rui Prado; faltou o total no rodapé — por Ana Souza
- FT-034 · sem feedback
- Ideia: painel de contas bloqueadas por mês — por Rui Prado (EP-06)
- Necessidade: filtro por data no extrato — por Rui Prado (FT-040)
- Backlog: ordem FT-052, FT-040, FT-047 · cancelada FT-049 (fora do escopo do contrato) — por bia.lima
```

- Feedback: mesma linha de hoje, uma por entrega; `sem feedback` no lugar de `sem retorno`.
- `- Ideia: …` e `- Necessidade: …` no lugar de `- pedido novo · …`; o `(<id>)` no fim continua sendo posto pelo
  passo `cadastro` (`review/passos/rito.md:21-22`).
- `- Backlog: …`: o rastro da Etapa 3 (a ordem final dos itens movidos e os cancelados com o motivo, por quem). O
  estado em si está no `backlog.md`; a linha serve ao passo `backlog` do fluxo e à leitura humana. Não é reimportada
  como ponto.

**Compatibilidade (`importarSecao`, `:253-262`)**

- `- <id> · sem retorno` → lido como sem feedback (hoje `:257`).
- `- pedido novo · <texto> — por <quem>` → lido como `Necessidade` (D4; com categoria única, como a própria).
- Correção que entra junto: hoje a linha já cadastrada, `… — por Rui Prado (FT-040)`, é reimportada com o autor
  "Rui Prado (FT-040)" (o `/ — por (.+)$/` de `:259` leva o sufixo). O leitor novo separa o `(<id>)` em
  `cadastrado` e o regrava, para republicar a página não perder nem duplicar o id.
- `--propostas` (`lerPropostas`, `:396-404`): `item` aceita `"ideia"` e `"necessidade"`; `"pedido"` continua aceito.
- Republicar não toca nas outras seções (`trocarSecao`, `:187-196`), inclusive a `## Métricas` nova.

### 3.6 O nome "Feedback" em toda parte

`cli/cerimonia.mjs` (`:48`, `:162`, `:166`, `:205-207`, `:217`, `:257`, `:442`, `:648`, `:651`, `:658`, `:661`),
`cli/sabia.mjs:1349-1352` (ajuda do `sabia review`), `fluxo/sa-planejamento/review/review.md:3,7,8,16-17`,
`review/passos/inicio.md:6`, `rito.md:2,15-21,27`, `gravar.md:6,13`, `template/sa-planejamento/sprint.md:24-25,65-67`,
`skills/sa-planejamento/SKILL.md:3` (a descrição cita "feedback, new requests") e os testes
(`cli/cerimonia.test.mjs:57-59`, `:180-192`, `:315`, `:322`). `fluxo/entrada.md:33` fala de "pedido novo" em outro
sentido (pedido sobre item terminal) e não muda.

## 4. Desenho: os passos novos da `sa-planejamento.review`

### 4.1 Definição do fluxo

No formato de hoje (`review.md:1-13`; validado por `cli/compilar.mjs:181-230`):

```json
{"fluxo": "review", "dono": "sa-especificador",
 "quando": ["fim do ciclo, com os stakeholders quando disponíveis: o entregue com a evidência do MR, o feedback, as novas ideias e necessidades pelo cadastro, a repriorização do backlog, o Histórico de Entregas e as Métricas da sprint", "review da sprint"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa", "elm-pela-sa-elm"],
 "passos": [
   {"id": "inicio"},
   {"id": "rito", "saidas": {"sem ideia nem necessidade nova": "backlog"}},
   {"id": "cadastro", "de": "cadastro", "saidas": {"mais uma ideia ou necessidade": "cadastro"}},
   {"id": "backlog", "chama": "sa-elm.finalizar"},
   {"id": "historico"},
   {"id": "metricas"},
   {"id": "gravar"},
   {"id": "commit-na-branch-base", "de": "commit-na-branch-base"},
   {"id": "seguir", "saidas": {"sim": "→ sa-planejamento.retrospectiva"}}
 ]}
```

`sa-elm.finalizar` já é chamada por um fluxo do mesmo dono (`sa-refinar/ajustar/ajustar.md:16`), e a trava
`elm-pela-sa-elm` existe em `fluxo/travas.json`.

### 4.2 Passos

| Passo | O que faz |
|---|---|
| `rito` (muda) | Descreve as três etapas e o apresentador, como o `retro.md` da 2.1.42. Com o "publicamos": lê a `## Review`; cada `- Ideia:` e `- Necessidade:` sem `(<id>)` vai ao `cadastro` com `origem review <AAAA>/Sprint <nn>` na `obs` (regra de hoje, `rito.md:21-23`). Sem a página: conduz na conversa no mesmo formato. |
| `backlog` (novo) | Lê a linha `- Backlog:` e o `backlog.md` já atualizado. Mostra o que mudou; item cancelado com `ib` → oferece a `sa-elm.finalizar`. Sem a página, ou sem `produto` na Etapa 3: diz que a repriorização é da `sa-refinar.ajustar` (não a refaz aqui) e segue. |
| `historico` (novo) | Monta a seção da sprint no Histórico de Entregas (4.3), mostra e ajusta com a pessoa. |
| `metricas` (novo) | Roda `sabia metricas` (5.2) e monta a `## Métricas` do `sprint-<nn>.md` (5.1); pergunta "meta atingida?" a quem tem `produto` se a sprint já passou do fim. |
| `gravar` (muda) | Mostra o que falta gravar — os ids do cadastro na `## Review`, o Histórico e a `## Métricas` — e, com o "ok", um commit `<AAAA>/Sprint <nn>: review`. |

### 4.3 Histórico de Entregas

- **Arquivo** (D10): `.sabia/planejamento/historico-de-entregas.md`; template novo
  `template/sa-planejamento/historico-de-entregas.md`; entra na lista de arquivos de `regras.md:8-13` e na de
  `fluxo/commit-na-branch-base.md:6-12`.
- **Formato**: uma seção por sprint, a mais nova no topo; regerar a mesma sprint troca a seção dela.

```markdown
# Histórico de entregas

## 2026/Sprint 03 · 2026-11-09 → 2026-11-20

**Meta:** o cliente consulta o extrato sem ligar para o suporte — atingida

### Novidades
- **Bloqueio de conta após 3 tentativas inválidas** — <o que muda para quem usa, numa frase> · FT-031 · EP-03 · MR !42

### Correções
- **Erro 500 no login com senha vazia** — <frase> · FT-034 · MR !45

### Atendimentos
- AT-012 · Extrair contas bloqueadas de outubro

### Épicos concluídos
- EP-03 · Bloqueio de conta por tentativas (FT-030, FT-031)
```

- **Fontes, todas já existentes**: entregas = as mesmas da Etapa 1 (linhas da sprint com `concluida_em` e status
  concluído no `backlog.md`: `título`, `tipo`, `pai`, `concluida_em`); o MR vem do campo `MR` do `status.md` da spec
  (`template/sa-desenvolver/status.md:11`), nas pastas que o `licoesDoCiclo` já percorre (`.kiro/specs/<id>-…/`,
  `openspec/changes/<id>-…/`, `openspec/changes/archive/…`, `cerimonia.mjs:87-92`); na trilha trivial (sem `status.md`)
  e para a frase, o MR lido pelo `gitlabpr` (seção "O quê", `template/sa-desenvolver/pr.md:7-8`); a meta é a
  `**Meta:**` da sprint.
- **Limites**: a frase é proposta do agente a partir do título e do "O quê" e só entra com o "ok" (regra de ouro,
  `regras.md:16`); sem MR legível, a linha sai só com o título e o id (nada inventado). Atendimento entra só com id e
  título: dado de cliente não vai ao git (`fluxo/cadastro.md:31-32`). O feedback da review não entra no histórico.

## 5. Desenho: métricas

### 5.1 O que fica no `sprint-<nn>.md`

**No cabeçalho, gravado no planejamento** (novo): a linha
`**Capacidade:** vazão prevista <n> · migrados <n> · sobra <n>`. Hoje esses três números só aparecem na tela da
proposta (`sprint/passos/proposta.md:16`) e se perdem: sem eles não há previsto × realizado. Escreve o passo `gravar`
da `sa-planejamento.sprint` (`gravar.md:10-13`); lê o `sprintsDe` (`status.mjs:53-64`, ao lado da reserva, `:60`).

**Seção `## Métricas`, no fim do arquivo** (nova; em sprint antiga, `trocarSecao` a acrescenta no fim, `:190`):

```markdown
## Métricas

- Medida em: 2026-11-20 · meta atingida
- Conclusão: 4 de 6 linhas (67%) · no prazo 3 · depois 1 · em aberto 2
- Vazão: desenvolvimento 3 (prevista 4) · atendimento 1 · especificação 2
- Lead time médio: desenvolvimento 3,5 dias · atendimento 1 dia · especificação 2 dias
- SLE: 75% em até 5 dias (alvo 85%)
- Reserva de capacidade: 1 de 2 itens

| Entrega | Tipo | Tam. | Trilha | Autonomia | Especificação (d) | Desenvolvimento (d) | Lead time (d) | No prazo |
|---|---|---|---|---|---|---|---|---|
| FT-031 | fatia | M | completo | IA supervisionada | 1 | 4 | 5 | sim |
| AT-012 | sustentação | | | | | | 1 | sim |
```

- As linhas da sprint são os campos de `resumoDaSprint` (`cerimonia.mjs:123-129`) e `numerosDaSprint` (`:63-70`),
  sem cálculo novo; "prevista" vem do cabeçalho.
- A tabela das entregas: lead time do item e por trabalho como o `status.mjs` já define (`:216-220`, `:322`,
  `:372-374`); `Tam.` do `backlog.md`; Trilha e Autonomia do `status.md` arquivado (campos lidos por `lerStatusMd`,
  `status.mjs:123-134`), vazios quando não há.
- Só "meta atingida" e "medida em" não são deriváveis: o resto é retrato do dia, para a retrospectiva e a virada
  lerem sem recalcular.
- Escrevem: `sa-planejamento.review` (passo `metricas`) e `sa-planejamento.retrospectiva` (passo `fechar`, que
  atualiza se a sprint andou depois da review).

### 5.2 Um cálculo só, no CLI

- Módulo novo `cli/metricas.mjs` (**a criar**): recebe `numerosDaSprint` e `resumoDaSprint` (hoje no
  `cerimonia.mjs`, que passa a importá-los) e ganha `historicoDe(sprints, backlog)`: por sprint fechada, vazão por
  trabalho, prevista, lead time médio; a média das últimas 3 sprints (a regra de `capacidade.md:10-12`); e a duração
  por tamanho (P, M, G: mediana e percentil 85 do lead time das linhas de desenvolvimento, cruzadas com o `tamanho`
  do backlog) — o que serve para estimar a próxima sprint e a duração das tarefas.
- Comando novo `sabia metricas [--projeto <pasta>] [--sprint <chave>] [--md]`: só lê arquivos (sem GitLab, mais
  leve que o `sabia status`); JSON estável com `versao`; `--md` imprime a seção `## Métricas` pronta. Entra no `USO`
  (`cli/sabia.mjs`, junto de `:1343`) e nos comandos (`:1434-1436`), e em `files` do `cli/package.json`.
- Os fluxos passam a ler o número do comando em vez de calcular à mão; sem o comando (`npx sabia` indisponível), vale
  o texto de hoje, que fica como definição.

### 5.3 Onde guardar o histórico da equipe (D9)

| Opção | Prós | Contras |
|---|---|---|
| **A. Derivar das sprints** (recomendada): `## Métricas` em cada `sprint-<nn>.md` + `sabia metricas` | Uma fonte só (as linhas da sprint e o backlog); corrigir uma data corrige o número; sem schema, sem migração, sem arquivo novo no commit; funciona em projeto antigo no dia da atualização | Recalcula a cada leitura (barato: só arquivos); o agente depende do CLI para o número (com a definição em texto de reserva) |
| B. `metricas.json` em `.sabia/planejamento/` | Leitura direta por agente e bot; formato estável; guarda o que se quiser (percentis, por pessoa) | Dado derivado e commitado: envelhece quando uma linha de sprint é corrigida depois; conflito de merge na branch base; pede schema novo (`schemas/metricas.schema.json`), dono da escrita, validação, entrada no `commit-na-branch-base` e na `sa-setup`; todo leitor da tabela abaixo passa a ter duas fontes |
| C. Seção no `backlog.md` | Nenhum arquivo novo | O backlog é "uma tabela única" e dono do status (`skills/sa-triar/references/backlog.md:3-8`); é o arquivo mais escrito do projeto (todo fluxo), o que multiplica o conflito; mistura estado com estatística |

A opção A entrega o que o pedido quer (estimar a próxima sprint e a duração das tarefas) com o menor impacto: o
"`metricas.json`" passa a ser a saída do `sabia metricas`, não um arquivo. Se um dia a leitura ficar cara ou um bot
precisar do arquivo, `sabia metricas --gravar` cria o B como cache, sem mudar os leitores.

### 5.4 Mapa de impacto no Sabiá

Quem lê e quem escreve vazão, lead time, capacidade e previsão hoje, e o que muda com a opção A.

| Onde | Hoje | Muda |
|---|---|---|
| `cli/cerimonia.mjs:63-70`, `:117-130`, `:170-172`, `:622-644` | calcula e desenha os números só na retro | importa do `cli/metricas.mjs`; o painel "Dados do ciclo" aparece também na review (Etapa 1) |
| `cli/cerimonia.mjs:187`, `:408` | preserva `- Números:` ao publicar a retro | continua (sprints antigas) |
| `cli/status.mjs:53-64` (`sprintsDe`) | lê cabeçalho, meta, reserva, Itens | lê também `**Capacidade:**` |
| `cli/status.mjs:216-220`, `:322`, `:372-374` | lead time do item e da tarefa no JSON | sem mudança; o `metricas.mjs` reusa a mesma definição. Se o JSON do `sabia status` ganhar campo, conferir a regra do `versao` (`:4`, `:356`) |
| `cli/status.mjs:348-349` | alerta de reserva estourada | sem mudança |
| `cli/kanban.mjs:339`, `:382` | mostra o lead time do card e da tarefa | sem mudança |
| `cli/acoes.mjs:131-154` | `para-sprint` e `para-backlog` mudam as linhas (e portanto os números) | sem mudança; ganha `reordenar` e o lote (3.4) |
| `sa-planejamento/sprint/passos/capacidade.md:10-18` | o agente calcula a vazão média de 3 sprints | lê `sabia metricas`; mostra também a duração por tamanho |
| `sprint/passos/previsao.md`, `proposta.md:16` | usa a sobra; mostra a capacidade | `proposta` sem mudança de tela |
| `sprint/passos/gravar.md:10-15` | grava cabeçalho, Itens, seções vazias `## Review` e `## Retro`, previsão do roadmap | grava `**Capacidade:**` e a `## Métricas` vazia |
| `sprint/passos/virada.md:25` | "os números dela ficam para a retrospectiva" | cita a `## Métricas` |
| `retrospectiva/passos/dados.md:10-11` | chama a `sa-status.painel` para os números | lê a `## Métricas` da sprint (e o `sabia metricas`), e segue chamando o painel para WIP e pendências |
| `retrospectiva/passos/fechar.md:10-12`, `gravar.md:10-14` | grava a linha `- Números:` | confere e atualiza a `## Métricas` (D12) |
| `retrospectiva/passos/reserva-capacidade.md:10` | compara a reserva consumida | lê da `## Métricas` |
| `review/*` | não toca em métrica | passo `metricas` (4.2) |
| `sa-status/painel/passos/metricas.md:10-17`, `fim-do-ciclo.md:10-12` | o agente calcula; avisa review e retro pendentes | `metricas` pode ler `sabia metricas`; `fim-do-ciclo` sem mudança |
| `sa-planejamento/inicial/passos/roadmap.md:12`, `template/.../roadmap.md:15` | previsão pela vazão | cita o `sabia metricas` como fonte |
| `sa-atender/atender/passos/puxar.md:12-13` | reserva consumida contra o cabeçalho | sem mudança |
| `template/sa-planejamento/sprint.md:4-39`, `:64-80` | formato, com `- Números:` na Retro | `**Capacidade:**`, `## Métricas`, Review nova; quem escreve (`:78-80`) |
| `template/sa-planejamento/acordos.md:27`, `schemas/acordos.schema.json` (`sle`, `reserva_capacidade_pct`, `timebox_semanas`) | políticas lidas pelos números | sem mudança (nenhuma chave nova) |
| `schemas/equipe.schema.json:24-26` (`produto`, `horas_semana`, `ausencias`) | permissão e capacidade | sem mudança |
| `fluxo/sa-planejamento/regras.md:8-13`, `:21-34`, `:35-36` | arquivos, página da cerimônia, previsão pela vazão | arquivo do Histórico, etapas da review, fonte dos números |
| `README.md:22`, `:67` | cita os ritos e o painel | uma linha sobre review em etapas, histórico e `sabia metricas` |
| Site (citado em `docs/a-fazer.md:13`) | — | **não achei** a pasta do site neste repositório: conferir à parte |

## 6. Entregas e arquivos a alterar

Cada entrega sobe a versão em `cli/package.json`, `cli/package-lock.json` e `plugin.json`, e o commit é
`<versão>: <descrição>`. Cada uma fica de pé sozinha, na ordem.

| Versão | Entrega | Arquivos |
|---|---|---|
| 2.1.43 | **Retorno vira Feedback**; pedido novo vira Ideia/Necessidade; leitura do formato antigo e do `(<id>)` no fim da linha. Sem etapas ainda. | `cli/cerimonia.mjs`, `cli/cerimonia.test.mjs`, `cli/sabia.mjs` (ajuda), `fluxo/sa-planejamento/review/review.md`, `review/passos/{inicio,rito,gravar}.md`, `template/sa-planejamento/sprint.md`, `skills/sa-planejamento/SKILL.md` |
| 2.1.44 | **Review em etapas 1 e 2**: apresentador, `aplicarReview`, faixa e popups, entregas por tipo com o épico (D1). | `cli/cerimonia.mjs`, `cli/cerimonia.test.mjs`, `cli/sabia.mjs` (ajuda), `fluxo/sa-planejamento/regras.md`, `review/passos/rito.md` |
| 2.1.45 | **Ações em lote no `acoes.mjs`**: `reordenar`, `prepararLote`, `executar` com lista, extras e mensagem. O quadro segue igual. | `cli/acoes.mjs`, `cli/sabia.test.mjs` (o teste do quadro que grava, `:901-991`) |
| 2.1.46 | **Etapa 3: repriorização do backlog** na página e o passo `backlog` do fluxo. | `cli/cerimonia.mjs`, `cli/cerimonia.test.mjs`, `cli/sabia.mjs` (ajuda), `review/review.md`, `review/passos/backlog.md` (novo), `review/passos/rito.md`, `regras.md`, `template/sa-planejamento/sprint.md` (linha `- Backlog:`) |
| 2.1.47 | **`sabia metricas`**: `cli/metricas.mjs` com o cálculo movido e o histórico; comando e ajuda. Nenhum fluxo muda. | `cli/metricas.mjs` (novo), `cli/metricas.test.mjs` (novo), `cli/cerimonia.mjs` (importa), `cli/sabia.mjs`, `cli/package.json` (`files`) |
| 2.1.48 | **Métricas na sprint**: `**Capacidade:**`, `## Métricas`, passo `metricas` da review, `fechar` e `dados` da retro, `capacidade` e `gravar` do planejamento. | `cli/status.mjs` (`sprintsDe`), `template/sa-planejamento/sprint.md`, `review/review.md`, `review/passos/{metricas (novo),gravar}.md`, `retrospectiva/passos/{dados,fechar,gravar,reserva-capacidade}.md`, `sprint/passos/{capacidade,gravar,virada}.md`, `sa-status/painel/passos/metricas.md`, `inicial/passos/roadmap.md`, `template/sa-planejamento/roadmap.md`, `regras.md` |
| 2.1.49 | **Histórico de Entregas**: template e passo `historico`. | `template/sa-planejamento/historico-de-entregas.md` (novo), `review/review.md`, `review/passos/{historico (novo),gravar}.md`, `regras.md`, `fluxo/commit-na-branch-base.md`, `README.md` |

A 2.1.49 não depende da 2.1.47 nem da 2.1.48 e pode vir antes delas, se o histórico for mais urgente que as métricas.

## 7. Testes e verificação

- **Sempre**: `cd cli && npm test` (inclui `compilar.test.mjs` e `prova.test.mjs`, que validam a definição dos
  fluxos: passo novo precisa do arquivo em `passos/`, `chama` existente e `saidas` para passo do fluxo).
- **2.1.43** (`cerimonia.test.mjs`): `linhasDaSecao` grava `sem feedback`, `- Ideia:`, `- Necessidade:`;
  `importarSecao` lê `sem retorno`, `- pedido novo · …` e a linha com `(FT-040)` sem levar o id para o autor; ida e
  volta `.md` → estado → `.md` sem diferença; `lerPropostas` com `item: "pedido"`.
- **2.1.44**: `aplicarReview` por etapa e papel (incluir fora da etapa, editar de outro autor, `avancar` com `de`
  velho, publicar antes da última etapa); grupos do épico nos três casos de D1; no servidor, a pessoa da rede não
  avança etapa (como o teste de `:242`).
- **2.1.45** (`sabia.test.mjs`): `reordenar` permuta só as linhas citadas e recusa id fora do backlog e quem não tem
  `produto`; o lote com reordenar + cancelar gera um `backlog.md` só, fecha o épico na última fatia e junta os
  `remover`; commit falho devolve todos os arquivos ao que eram.
- **2.1.46**: `ordenar` e `cancelar` só na etapa `backlog`, só local e com `produto`; Publicar faz **um** commit com o
  `sprint-<nn>.md` e o `backlog.md`; backlog mudado no pull entre abrir e publicar → erro claro, nada gravado; sem
  commit possível, a etapa é só leitura.
- **2.1.47**: os casos de `cerimonia.test.mjs:39-56` passam a valer para o `metricas.mjs`; histórico com 0, 1 e 3
  sprints fechadas; duração por tamanho com item sem `tamanho`; `--md` gera a seção do template.
- **2.1.48**: `sprintsDe` lê `**Capacidade:**` e segue lendo sprint sem ela; publicar a retro e a review preserva a
  `## Métricas`.
- **Manual, na página** (um projeto de exemplo, `sabia review --rede`, duas abas: local e pelo IP da rede): as três
  etapas, o popup de confirmação, arrastar e os botões de ordem no teclado, cancelar e desfazer, Publicar e o
  `git show --stat` do commit; tema claro e escuro; largura de celular.
- **Fluxos num agente**: rodar a `sa-planejamento.review` inteira num projeto de exemplo, com e sem a página, e
  conferir o Histórico e a `## Métricas` gravados. Acrescentar esse item ao `docs/a-fazer.md`, como os outros "fluxos
  novos num agente".

## 8. Riscos

- **2.1.42 em andamento na mesma árvore**: este plano mexe nos mesmos arquivos (`cerimonia.mjs`, `regras.md`,
  `template/.../sprint.md`). Começar só depois do commit dela.
- **Backlog mudado durante a reunião**: outra pessoa grava no `backlog.md` entre abrir a página e o Publicar. O
  `reordenar` é relativo às linhas citadas e o Publicar faz o pull antes; item que sumiu ou ficou terminal → o
  Publicar recusa e a página pede para recarregar a Etapa 3.
- **Cancelar numa reunião com o cliente** é difícil de desfazer (o `cancelar` tira a pasta da spec, `acoes.mjs:125-128`):
  por isso só no Publicar, com motivo, popup e desfazer até lá (D6), e nunca item `em-andamento` (D7).
- **Árvore suja**: o `podePublicar` não exige árvore limpa e o `podeGravar` exige (`acoes.mjs:66`). Com o commit
  restrito aos caminhos tocados (3.4) isso deixa de importar, mas é a parte mais delicada da 2.1.45: precisa de teste
  com arquivo alheio modificado.
- **Sprints antigas**: `## Review` no formato antigo e `- Números:` na `## Retro` continuam lidas; ao republicar, a
  review antiga é regravada no formato novo (diff maior que o esperado numa sprint velha).
- **Métrica congelada × linha corrigida**: a `## Métricas` é retrato com data ("Medida em"); o `sabia metricas`
  sempre recalcula. Se os dois divergirem, vale o cálculo, e o passo `fechar` da retrospectiva regrava.
- **Tamanho do `cerimonia.mjs`** (1021 linhas, um arquivo só com servidor, CSS e cliente): a review em etapas
  acrescenta bastante. Mover os números para o `metricas.mjs` alivia; se passar do razoável, separar o cliente da
  review é assunto de outra entrega.
- **Histórico de Entregas escrito pelo agente**: risco de frase inventada. Mitigação: fonte obrigatória (título do
  backlog e "O quê" do MR) e "ok" da pessoa antes de gravar; sem fonte, só id e título.
