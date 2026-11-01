---
{"resumo": "Grava na base a linha do épico, da fatia sem épico (com ficha) ou do item de Sustentação (com registro), o IB no EWM com \"sim\" e o commit único da sessão."}
---
## Entrada

A trilha decidida no passo `triagem` (ou a ação do passo `chegou` para o item que já existe), na base conferida no
passo `chegou`.

## Faça

Grava-se na base, conferida no passo `chegou`. Ids do EWM na coluna `elm` com o tipo antes de cada um (`IB [612010](…)`,
`DF [4567](…)` — formato do backlog).

Com ELM, **todo item triado tem o seu IB na iteração de backlog, no estado inicial** — épico, fatia, defeito ou IB de
origem e item de Sustentação (o de Sustentação que já entra na sprint vai na iteração dela). O que nasce já nasce
assim; o item de origem em outro estado volta a ele com `elm_transicao(<id>, "reabrir")`, na mesma confirmação. O IB
`Sustentação` e a `[GB]` já existem desde o fluxo `sa-planejamento.inicial`
([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §2).

- **Épico:** próximo `EP-nn` de "Próximos ids"; linha em `## Épicos` com prioridade `—` (quem
  prioriza é o planejamento), `sprint` e `prd` `—` e `po` = o P.O. ativo do `equipe.json` (outro, se a pessoa disser).
  Descrição mínima (a que a [Definition of Ready](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#definition-of-ready-o-que-faz-uma-fatia-elegivel)
  do épico confere): o problema, quem pede e o resultado esperado — falta algum → pergunte numa rodada. Completa →
  `status` `elegivel`; sem resposta, `novo` com `obs` `falta: <o quê>`. Com ELM:
  o épico nasce agora no backlog do EWM ([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §3, `iteracao = backlog`, com "sim"; `pa` sem
  backlog → §0 antes) e o id vai para a coluna `elm`; sem o MCP `elm` → `pendente`. Veio
  de um item do EWM: se ele já é do tipo de épico do `sabia.md`, ele é o épico (grave o id na coluna `elm` e leve-o
  para o backlog: `elm_atualizar_wi(id, iteracao = backlog)`) — quando
  esse tipo é o mesmo do item (Item de Backlog pai), pergunte se ele vira o épico ou o filho; filho (ou outro tipo)
  → `obs` `origem: <id>`, cria o épico e põe o item sob ele, no backlog (§3).

  **Pasta antecipada:** se o título tem mais de 3 palavras (slug formável), crie
  `<produto>/epicos/<EP>-<slug>/` com:
  - `rascunho.md`: o pedido original (nas palavras de quem pediu, sem dado inventado) + origem (EWM id,
    chamado, texto livre);
  - `decisoes.md`: o formato do padrão [`sa-entrevistar/decisoes.md`](~/.sabia/framework/padrao/sa-entrevistar/decisoes.md) (título `# Decisões — <EP-nn> <título>` e a tabela vazia);
  - `status.md`: o modelo do padrão [`sa-especificar/status-epico.md`](~/.sabia/framework/padrao/sa-especificar/status-epico.md),
    com `Fase` `rascunho` e `[ESP]`, Responsável e Início `—` (a especificação os preenche).
  A pasta só é criada aqui; o `sa-prd` completa com `prd.md`, `elm/` e os demais artefatos.
  Inclua o caminho relativo da pasta na coluna `pasta` do `backlog.md`:
  `[pasta](epicos/<EP>-<slug>/)` ou `—` se não criada.
- **Fatia sem épico** (padrão, rápida — a fatia de Manutenção): próximo `FT-nnn`; linha em `## Fatias` com:
  - `origem` `Manutenção`; `trilha`; `ficha` (`[ficha](fatias/FT-<nnn>-<slug>.md)`, sempre);
  - `tamanho` (padrão `P`/`M`/`G`; rápida `P`/`M`); `modo` proposto — `AFK` quando o esperado e o teste são claros
    e não há dado sensível, senão `HITL` (a fatia ainda não tem responsável: o modo final é gravado pela
    `sa-planejamento` quando ela ganha um, pela senioridade de quem implementa — Júnior → `HITL` · Pleno → estes
    critérios · Sênior → `AFK` por padrão); prioridade, `sprint` e `responsavel` `—`;
  - `status` `elegivel` se passa na Definition of Ready da trilha (formato do backlog — a ficha da trilha completa),
    senão `nova` com `obs` `falta: <o quê>`;
  - de onde veio: o item do EWM (DF, IB) vai na `elm` como o item da fatia (`DF [4567](…)`; sem o MCP `elm`,
    `DF 4567` — o id já é conhecido, nunca `pendente`); o pedido (texto, chamado) fica no `**Origem:**` da ficha;
    desdobramento de um item de Sustentação (origem `AT-012`, `IM-003`…) → `obs`
    `vinculada a [<ID>](sustentacao/<pasta>/<ID>-<slug>.md)`.
  - **Ficha** (`<produto>/fatias/FT-<nnn>-<slug>.md`, formato da trilha no padrão `sa-triar/ficha.md`;
    crie a pasta se não existir): sempre.
  - EWM (com ELM, com "sim"), pelo §3 do [elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) ("Fatia sem
    épico"; a Sustentação faltando → §2 antes): a primeira fatia de Manutenção (a linha da `## Sustentação` sem
    `Manutenção`) cria antes o IB `Manutenção`, com o id na linha. Item de origem → é o item da fatia, sem IB novo:
    `elm_atualizar_wi(origem, iteracao = backlog)`, com `pai` = a Manutenção se ele não tem pai (outro pai: mantenha e
    avise) e `dono` = o P.O. se não tem dono. Sem item de origem → o IB `[FT-nnn]` nasce agora sob a Manutenção, no
    backlog. Vinculada → `elm_ligar(wi = item da fatia, wi_destino = IB do <ID>, tipo relacionado)`. Sem o MCP
    `elm` → `pendente` (com item de origem, o id sem link).
- **Sustentação** (categorias sem mudança no repositório):
  - **Categoria:** proponha a da tabela **Sustentação** do `sabia.md` pelo pedido (consulta ou extração para o cliente →
    Atendimento; subida de versão → Implantação; script ou carga de dados → Banco de dados; ambiente, acesso →
    Infra; rotina de produção → Operação; ajuda a outra equipe → Apoio a outros times) e confirme. Muda o
    repositório → é fatia (de Manutenção): volte ao passo `triagem`.
  - **Entrevista curta:** Atendimento → `sa-entrevistar.atendimento` (uma rodada: o que o cliente precisa
    receber, origem, prazo, quem atende, critério de pronto). Demais categorias → sem entrevista: pergunte numa
    mensagem o pedido, a origem, o prazo, quem faz, o critério de pronto e a estimativa. Regra de negócio em aberto →
    não é item de categoria: volte ao passo `triagem`.
  - Próximo id da série da categoria em "Próximos ids" (`AT-`, `IM-`…; série que falta → começa em `001`).
  - **Sprint sugerida:** a aberta (`sprint-<nn>.md` com `**Situação:** aberta`), pela regra da reserva — a reserva
    (Sustentação + retrabalho) está na `## Sustentação` do `sprint-<nn>.md`; o usado é o retrabalho migrado mais a
    soma das estimativas dos itens das `### <Categoria>` dela, sem as linhas com `saiu da sprint` (o item
    saiu da sprint e não consome a reserva); cabe com a estimativa deste (A-6) → quem triou
    confirma; estourou → fica fora da sprint (`sprint` `—`), e a decisão é do P.O. pelo
    passo `sa-planejamento.durante.encaixe` (a Sustentação não tira fatia sozinha). Sem sprint aberta → `sprint` `—` e o aviso "sem sprint
    aberta: o item entra no próximo planejamento". Responsável sugerido: quem tem `atende: true` no `equipe.json`.
  - Linha na `### <Categoria>` da `## Sustentação` (a seção nasce com o primeiro item da categoria, aberta pelo IB
    dela), com `status` `aberto`, na sprint ou fora dela; `<produto>/sustentacao/<pasta>/<ID>-<slug>.md` (`<pasta>`
    da tabela **Sustentação** do `sabia.md`) no formato do padrão `sa-atender/registro.md`, com a
    categoria e as respostas no cabeçalho (estimativa em `**Estimativa:**`) e `**Situação:** aberto`; na sprint, a
    linha na `### <Categoria>` da `## Sustentação` do `sprint-<nn>.md` (criada se faltar).
  - EWM (com ELM, com "sim"): [elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §6 — o IB do item,
    `[<ID>] <pedido>` (dono = o P.O.), filho do IB da categoria; se o item já entra na sprint, na iteração dela e com
    a tarefa `<prefixo> <ID> <pedido>` (dono = quem faz); senão, só o IB, no backlog (a tarefa nasce quando o item
    entrar numa sprint). Veio de um IB ou DF do EWM → ele é o IB do item (sem IB novo), e a tarefa que já está sob ele
    (`elm_listar_wi(pai = <id>)`) é a do item, sem tarefa nova: sem pai, sob o IB da
    categoria (outro pai: mantenha e avise), e o título ganha o `[<ID>]` pelas opções do §9 (renomear · só incluir o
    prefixo · manter). Primeiro item da categoria → o IB `<Categoria>` nasce junto, na mesma confirmação, e o id dele
    abre a `### <Categoria>` (§6; §2 antes, se faltar a Sustentação). Sem o MCP `elm` → `pendente` (veio do EWM: o
    id sem link); a `sa-atender` ou a `sa-executar` criam o que faltar antes de assumir.

Atualize "Próximos ids". O commit é **um só, no fim da sessão de triagem** (passo `encaminhar`, resposta "não"), com o
`backlog.md` (também os ids do espelhamento do passo `chegou`), as fichas, as pastas dos épicos, os registros de Sustentação e, no `sprint-<nn>.md` aberto, as linhas
da Sustentação e a de créditos da sessão na seção **Créditos de gestão** (Atividade `triagem`;
([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4); sem sprint aberta, não há onde gravar) (padrão de
commit do `sabia.md`). A triagem não tem tarefa própria: o padrão é a tarefa **`[GB] Gerenciamento do backlog`** (o
`GB` da linha da `## Sustentação` do `backlog.md`): mostre-a e confirme (a pessoa pode indicar outra). Sem `GB` →
indique o fluxo `sa-planejamento.inicial` (ou crie-a pelo
[elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §2, com "sim") ou pergunte a tarefa. **Créditos e
horas**, antes do commit: os créditos da sessão (item 4 do Fechar a sessão) vão também num comentário na `[GB]`,
com "sim" — `elm_comentar(<id da [GB]>, "Créditos triagem <ids>: <créditos> (sessão <sessão>, <login>,
<AAAA-MM-DD>)")`, ex.: `Créditos triagem FT-040, AT-013: 2.40 (sessão 9ec1dcaa, ana.souza, 2026-10-29)`. Horas da
triagem, só o SM lança, na `[GB]` (`elm_lancar_horas`, com "sim"); o P.O. nunca lança — nem quando também é o SM:
o registro dele é o comentário. Sem tarefa, não commite: deixe os arquivos e o comando pronto; push direto na base
com o "sim" da pessoa (no agente `sa-produto`, que não faz push, entregue o comando pronto — a pessoa executa). **Conflito de id**
no push (outra pessoa registrou o mesmo número antes): o agente não faz merge nem rebase — peça à pessoa `git pull --rebase`; no
conflito do `backlog.md`, mantenha o remoto e, **antes de renumerar**, confira de novo de onde o item veio (DF, IB,
AT, chamado, pedido — colunas `origem`, `elm` e `obs`, `**Origem:**` da ficha ou do registro):
já está numa linha do remoto → pare (abaixo). Senão, pegue o próximo id livre para a sua linha (e para o nome
da ficha, do registro ou da pasta do épico) e, se o item já foi criado no EWM, troque o `[FT-nnn]`/`[EP-nn]`/`[<ID>]`
do título do IB, e da tarefa do item se ela já existe (`elm_atualizar_wi`, com "sim"). Id que ainda não chegou à
base pode mudar; o que já chegou, nunca.

## Saída

A linha (e a ficha, a pasta do épico ou o registro) gravada na base, sem commit ainda → passo `encaminhar`. Muda o
repositório ou tem regra de negócio em aberto (Sustentação) → passo `triagem`.

## Pare se

- Conflito de id no push com o item já numa linha do remoto → a outra pessoa triou o mesmo item; descarte o que você registrou dele, mostre a
  que existe e pare.
