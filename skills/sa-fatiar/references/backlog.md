# Backlog do produto — `<produto>/backlog.md`

Fonte única dos ids locais (`EP-nn`, `FT-nnn` e os da Sustentação — `AT-nnn`, `IM-nnn`… uma série por categoria), do
**planejamento** (o que existe, em que ordem, em que sprint, em que situação) e do mapeamento com o ELM. Versionado.
Só markdown: editado direto, sem arquivo JSON por trás.

**Onde é escrito:** só na **branch base**, com commit direto nela — **nunca numa branch de fatia**, para que fatias em
paralelo não disputem o mesmo arquivo. Cada situação é gravada aqui por quem a causa ([Situações](#situações)); o
detalhe da fatia em andamento (fase, branch, PR) mora no `status.md` da pasta dela — na branch até o merge, depois na
base (regra A base prevalece do padrão `sa-desenvolver/status.md`) —, e o
`sa-status` o lê de lá.

## Formato

```markdown
# Backlog — Gestão de Acessos

Próximos ids: EP-04 · FT-035 · AT-013 · IM-004 · BD-001 · IN-002 · OP-001 · EX-001

## Épicos

| id | título | status | prioridade | po | sprint | prd | pasta | elm | creditos | obs |
|---|---|---|---|---|---|---|---|---|---|---|
| EP-03 | Bloqueio por tentativas de login | iniciado | alta | ana.souza | 2026/Sprint 02 | [prd](epicos/EP-03-bloqueio-login/prd.md) | [pasta](epicos/EP-03-bloqueio-login/) | IB [612001](https://elm.exemplo/ccm/resource/itemName/com.ibm.team.workitem.WorkItem/612001) · ESP [669377](https://elm.exemplo/ccm/resource/itemName/com.ibm.team.workitem.WorkItem/669377) | 18.40 | — |

## Fatias

| id | título | origem | trilha | cobre | ficha | bloqueada-por | tamanho | modo | prioridade | status | sprint | responsavel | elm | concluida-em | creditos | obs |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| FT-031 | Bloquear a conta após 3 tentativas inválidas | EP-03 | padrão | HF-01#1.1, HF-01#1.2, REG-01 | [ficha](fatias/FT-031-bloquear-conta.md) | — | M | AFK | alta | iniciada | 2026/Sprint 03 | joao.lima | IB [612010](https://elm.exemplo/ccm/resource/itemName/com.ibm.team.workitem.WorkItem/612010) · DEV [612011](https://elm.exemplo/ccm/resource/itemName/com.ibm.team.workitem.WorkItem/612011) | — | — | — |
| FT-034 | Corrigir juros no atraso | Manutenção | rápida | — | [ficha](fatias/FT-034-juros-atraso.md) | — | P | AFK | crítica | nova | — | — | DF [4567](https://elm.exemplo/ccm/resource/itemName/com.ibm.team.workitem.WorkItem/4567) | — | — | falta: especificação · vinculada a [AT-012](sustentacao/atendimento/AT-012-contas-bloqueadas.md) |

## Sustentação

IB [612000](https://elm.exemplo/ccm/resource/itemName/com.ibm.team.workitem.WorkItem/612000) · GB [612006](https://elm.exemplo/ccm/resource/itemName/com.ibm.team.workitem.WorkItem/612006) · Manutenção IB [612030](https://elm.exemplo/ccm/resource/itemName/com.ibm.team.workitem.WorkItem/612030)

### Atendimento

IB [612020](https://elm.exemplo/ccm/resource/itemName/com.ibm.team.workitem.WorkItem/612020)

| id | título | origem | status | sprint | responsavel | elm | registro | concluida-em | creditos |
|---|---|---|---|---|---|---|---|---|---|
| AT-012 | Extração de contas bloqueadas em setembro | chamado 4521 | em-andamento | 2026/Sprint 03 | joao.lima | IB [669379](https://elm.exemplo/ccm/resource/itemName/com.ibm.team.workitem.WorkItem/669379) · ATD [669380](https://elm.exemplo/ccm/resource/itemName/com.ibm.team.workitem.WorkItem/669380) | [AT-012](sustentacao/atendimento/AT-012-contas-bloqueadas.md) | — | — |
```

Seções nesta ordem: `## Épicos`, `## Fatias` (uma tabela para todas, de épico e de Manutenção) e `## Sustentação`, com
uma `### <Categoria>` por categoria, na ordem da tabela **Sustentação** do `sabia.md`, **criada quando o primeiro item
dela é triado** (junto com o IB da categoria, cujo id abre a seção); sem coluna `categoria` (a seção diz). Épicos e
fatias: a ordem é a `prioridade` (`crítica` → `baixa`, `—` no fim) e, no empate, a ordem da linha na tabela (o P.O.
ordena as linhas). Itens de Sustentação na ordem dos ids. Célula vazia é `—`. Listas (`cobre`, `bloqueada-por`)
separadas por vírgula. Cada item é **uma** linha da tabela — sem quebra de linha nem `|` dentro de célula (troque por
`/`).

| Coluna | Valores |
|---|---|
| `status` | a situação do item — listas, transições e quem grava em [Situações](#situações) |
| `prioridade` | épico e fatia: `crítica` · `alta` · `média` · `baixa` · `—` (sem prioridade; a ordem, acima). A fatia criada pela `sa-fatiar` nasce com a do épico. Não vai ao EWM |
| épico `po` | login do P.O. do épico (padrão: o P.O. ativo do `equipe.json`); é o responsável do épico no EWM |
| épico `sprint` | a da `[ESP]` (formato na coluna `sprint` abaixo) |
| épico `prd` · `pasta` | `[prd](epicos/<EP>-<slug>/prd.md)` (gravado no GATE do PRD) · `[pasta](epicos/<EP>-<slug>/)` (criada pela `sa-triar`; sem a pasta antecipada, no GATE do PRD), ou `—` |
| épico `obs` | `falta: <…>` (o que impede a DoR do épico), `origem: <id>` (item do EWM posto sob o épico — [elm-sprint.md](../../sa-planejamento/references/elm-sprint.md) §3), o motivo do cancelamento |
| fatia `origem` | `EP-nn` (fatia do épico) ou `Manutenção` (sem épico; no EWM, sob o IB Manutenção); dividida → a da original. O item do EWM de onde ela veio fica na coluna `elm`; o atendimento, na `obs` (`vinculada a`); o pedido, na ficha |
| `trilha` | `padrão` · `rápida` (fatia de épico é sempre `padrão`) |
| `ficha` | toda fatia: `[ficha](fatias/FT-<nnn>-<slug>.md)` — formato por trilha no padrão `sa-triar/ficha.md` (de Manutenção: escrita pela `sa-triar`; de épico: pela `sa-fatiar`) |
| `cobre` | `HF-nn#c.c` (cenário) e `REG-nn` do PRD do épico; `—` na fatia de Manutenção (os cenários da padrão ficam na ficha, `C<n>`) |
| `bloqueada-por` | as fatias de que ela depende, por qualquer motivo — código, ordem de execução, especificação (o artefato do ELM já na ficha de outra fatia aberta, gravado pela `sa-triar`) — (toda fatia; `—` quando não há) |
| fatia `obs` | texto livre; convenções: `falta: <…>` (o que impede a DoR); `vinculada a [AT-012](sustentacao/atendimento/AT-012-<slug>.md)` (veio de um atendimento; no EWM, o link `relacionado` com o IB do item: `elm_ligar(wi, wi_destino, tipo relacionado)`); `desmembrada de FT-…` (nas novas) e `substituida-por FT-…` (na dividida) — só na divisão da fatia de Manutenção; o motivo do cancelamento |
| `tamanho` | `P` · `M` · `G` |
| `modo` | `AFK` · `HITL` — proposto na triagem ou no fatiamento (critérios da `sa-fatiar`); o modo final é gravado pela `sa-planejamento` quando a fatia ganha responsável e, na fatia `—` não iniciada, por quem a assume (`sa-desenvolver.desenvolver.iniciar`; no loop, o orquestrador), pela senioridade dele (Júnior → `HITL` · Pleno → os critérios · Sênior → `AFK` por padrão) |
| `sprint` | chave da sprint `<pai>/Sprint <nn>` (`2026/Sprint 03`: o pai e o número do arquivo `sprints/<pai>/sprint-<nn>.md` — [arquivos.md](../../sa-planejamento/references/arquivos.md#sprintspaisprint-nnmd)) ou `—` (fora de sprint); gravada com `planejada`/`planejado` (`sa-planejamento`: o planejamento ou o encaixe durante a sprint). Na virada (`sa-planejamento.retrospectiva`), o item que migra passa à chave da próxima (o épico acompanha a linha dele na Especificação, que migra só se não está `concluida` nem `cancelada`) |
| `elm` | o item no EWM e as tarefas, com o tipo antes de cada id, separados por ` · ` — o backlog do EWM é a cópia deste arquivo: o item nasce no backlog do produto ao registrar (triagem, GATE do backlog), no estado inicial — onde fica enquanto está fora de sprint —, e muda de iteração ao entrar na sprint; as tarefas nascem na sprint ([elm-sprint.md](../../sa-planejamento/references/elm-sprint.md)). Épico: `IB [<id>](<url>) · ESP [<id>](<url>)`; fatia: `IB [<id>](<url>) · DEV [<id>](<url>) · REV … · VER … · APR …`; item de Sustentação: `IB [<id>](<url>) · ATD [<id>](<url>)` (a tarefa pelo prefixo da categoria, sem colchetes). Fatia ou item de Sustentação que veio de um defeito ou IB do EWM: esse item fica no lugar do IB, com o tipo dele como rótulo (`DF [4567](<url>) · DEV …` · `DF [4567](<url>) · ATD …`). `pendente` (registrado sem o MCP `elm`; criado depois); id sem link (`DF 4567`, nunca `pendente`): item conhecido cujo tratamento no EWM ficou pendente (registrado sem o MCP) — o espelhamento do §0 e a publicação da sprint fazem o que faltou (pai, dono, prefixo no título, link `relacionado`) e gravam o link; `—` (sem ELM) |
| `concluida-em` | data `AAAA-MM-DD` ou `—` |
| `creditos` | créditos do Kiro do item, copiados da coluna Créditos do `sprint-<nn>.md` na virada da sprint (`sa-planejamento`; a conclusão grava só na sprint); `—` antes. Fatia: a seção Créditos do `status.md`; épico: só a especificação (a `[ESP]`, do `status.md` do épico), na virada da sprint em que a linha dele na Especificação ficou `concluida`; item de Sustentação: o registro |
| Sustentação `origem` | chamado, e-mail, `DF 4567`, `IB 615`, `pedido` ou `EWM <id>` (tarefa criada direto no EWM e trazida para a sprint — [elm-sprint.md](../../sa-planejamento/references/elm-sprint.md) §9) |
| Sustentação `registro` | `[<ID>](sustentacao/<pasta>/<ID>-<slug>.md)` — o registro do item, na pasta da categoria (tabela **Sustentação** do `sabia.md`) (formato no padrão `sa-atender/registro.md`; o mesmo para toda categoria) |
| linha da `## Sustentação` | `IB [<id>](<url>) · GB [<id>](<url>) · Manutenção IB [<id>](<url>)`: o IB `Sustentação` (um por produto, fica no backlog do EWM; pai da `[GB]`, da Manutenção e dos IBs de categoria), a tarefa `[GB] Gerenciamento do backlog` do pai atual (dona: o SM ativo do `equipe.json`; só ele lança horas nela, e o P.O. nunca — nem quando também é o SM —; os créditos de toda sessão do P.O. ou do SM no agente de produto vão nela num comentário) e o IB `Manutenção` (pai das fatias de Manutenção) — cada um entra quando nasce (`pendente` sem o MCP); `—` até o fluxo `sa-planejamento.inicial` criar o IB `Sustentação` e a `[GB]`, no backlog do EWM (a `[GB]` move para a iteração da primeira sprint do pai): a setup grava o backlog mínimo com `## Épicos`, `## Fatias` e `## Sustentação` vazias. Pai novo (virada para `2027`) → só a `GB` é trocada pela do pai novo ([elm-sprint.md](../../sa-planejamento/references/elm-sprint.md) §2) |
| linha da `### <Categoria>` | `IB [<id>](<url>)`: o IB `<Categoria>` (filho da Sustentação, pai dos IBs dos itens dela), que nasce com o primeiro item triado da categoria, junto com a seção ([elm-sprint.md](../../sa-planejamento/references/elm-sprint.md) §6) |

## Situações

Valores sem acento, como `concluida`; fatia no feminino, épico e item de Sustentação no masculino. Cada transição é
gravada por quem a causa, pelo bloco [Gravar na base](#gravar-na-base); a que muda o `backlog.md` e a sprint vai **no
mesmo commit** nos dois arquivos.

### Fatia — `status` no backlog · Status na sprint

`nova` → `elegivel` → `planejada` → `iniciada` → `pronta` → `concluida` · desvios `dividida` e `cancelada`

| Situação | Quando | Quem grava | Onde |
|---|---|---|---|
| `nova` | registrada (triagem, fatiamento) ou DoR que deixou de valer (`obs` `falta: …`) | `sa-triar` · `sa-fatiar` · `sa-planejamento` (`sa-planejamento.sprint.previsao`) | backlog |
| `elegivel` | passou na [Definition of Ready](#definition-of-ready-o-que-faz-uma-fatia-elegivel) da trilha | `sa-triar` · `sa-fatiar` (no fatiamento do PRD) · `sa-planejamento` · `sa-especificar` (`[ESP] FT`) — [completar](#completar-uma-fatia-nova) | backlog |
| `planejada` | entrou numa sprint (planejamento, encaixe) | `sa-planejamento` | backlog (+ `sprint`) · a linha nasce na sprint |
| `iniciada` | a `sa-desenvolver` começou: grava na base **e então** cria a branch | `sa-desenvolver.desenvolver.iniciar` · no loop, o orquestrador · a sincronização da `sa-planejamento` ([elm-sprint.md](../../sa-planejamento/references/elm-sprint.md) §9, com a rede de proteção: PR aberto, branch com commits ou `status.md` numa branch) | backlog (+ `responsavel`, se `—`) · sprint |
| `pronta` | PR mergeado | `sa-desenvolver.encerrar`, na base · a sincronização da `sa-planejamento` (§9: merge por fora do Sabiá, Créditos e lições `—`) | backlog · sprint · `status.md` da base |
| `concluida` | consolidada | `sa-consolidar` | backlog (+ `concluida-em`) · sprint (+ Créditos) · `status.md` |
| `dividida` · `cancelada` | desvios (`obs` `substituida-por FT-…` · o motivo) | `dividida`: só a `sa-triar` (Manutenção) · `cancelada`: `sa-fatiar` (P.O.) · `sa-triar` (Manutenção) | backlog e a linha da sprint |

- **Em especificação na sprint:** a fatia `nova` que entrou na sprint sem passar na DoR — inclusive a de
  `falta: especificação`, pelo planejamento (`sa-planejamento.sprint.previsao`, "entra como especificação") ou pelo
  encaixe — fica `nova`, com `sprint` e `obs` `em especificação`, e a linha dela na seção Especificação da sprint, com a
  `[ESP] FT-<nnn>` (`sa-planejamento`). Ela é completada por [Completar uma fatia `nova`](#completar-uma-fatia-nova)
  e, com artefato afetado, especificada pela `sa-especificar.fatia`. Concluída a `[ESP] FT` → `elegivel` (saem o
  `falta: especificação` e o `em especificação`); a rápida AFK segue como AFK padrão, e o próximo GATE é o do PR. A
  `[DEV]` nasce quando ela, `elegivel`, entrar numa sprint.
- **Fase:** o detalhe de `iniciada` é a Fase do `status.md` da fatia
  (padrão `sa-desenvolver/status.md`); `pronta` e `concluida` só existem no
  `status.md` da base (regra A base prevalece do padrão).
- **Volta.** A DoR que deixou de valer (ficha devolvida, decisão em aberto) rebaixa a `nova` só a fatia
  `elegivel` ou `planejada`. A `planejada` que sai da sprint (DoR perdida, troca no encaixe — `sa-planejamento.durante.encaixe` — ou movida no EWM e
  aceita pelo P.O. na sincronização, [elm-sprint.md](../../sa-planejamento/references/elm-sprint.md) §9) fica
  `nova` ou `elegivel`, com `sprint` `—`, e a linha dela na sprint recebe a mesma situação e `saiu da sprint:
  <motivo> (<quem>, <data>)`; no EWM, o IB e as tarefas voltam ao backlog, o IB no estado inicial
  (`elm_transicao(<IB>, "reabrir")`, se saiu dele), e ficam lá até ela voltar a uma sprint, quando movem (elm-sprint.md, topo e §3).
  De `iniciada` em diante nada volta: a fatia para em `bloqueada (de: <fase>)` no `status.md`, com o motivo, até o
  P.O. decidir — ou, com artefato a mudar, até a `[ESP] FT` concluir
  ([Volta à especificação](#volta-à-especificação)). A fatia de épico se divide ou se junta só antes do GATE do
  backlog (no rascunho, passo `sa-fatiar.fatiar.perguntar`); no backlog, não se altera mais: o P.O. ainda a cancela (`sa-fatiar.refinamento`), e
  cenário novo é épico ou fatia nova pela `sa-triar`.
- **Cancelada depois de `iniciada`** (ou dividida, na de Manutenção): a `sa-fatiar` (ou a `sa-triar`, na de
  Manutenção) conclui as tarefas abertas da fatia com as horas lançadas, avisa o Dev para fechar o PR, e as novas da
  divisão nascem `nova` com `obs` `desmembrada de FT-…`. Os leitores ignoram o `status.md` da branch de fatia `dividida` ou `cancelada` na base.
- **Cancelar no EWM** é `elm_transicao(<id>, "cancelar")`, um por id, com "sim": o IB da fatia `cancelada` (e as
  tarefas, se ela não foi iniciada); na falha (sem o MCP, `precondicao`, erro), `ELM pendente [FT-… cancelar]`.
  As pendências da fatia não iniciada, `dividida` ou `cancelada` — inclusive a conclusão das tarefas sem o MCP —
  moram no rodapé da ficha dela.

### Volta à especificação

Artefato que precisa mudar depois do fatiamento (achado no plano, na revisão, na verificação ou na consolidação) muda
pela `[ESP] FT-<nnn>` da fatia (`sa-especificar.fatia`); o PRD fica como registro do épico. Fatia terminal não
reabre: o pedido vira fatia nova pela `sa-triar` (`origem FT-<nnn>`). A `[ESP] EP` só reabre pela `sa-prd.mudanca`
(PRD `aprovado`, não fatiado). Quem acha roda o bloco: o Dev no `sa-plano`; o revisor ou o verificador na REV ou na
VER; o Dev Sênior na `[APR] Aprovar PR` (AFK); o P.O. ou o SM na consolidação.

```
🔁 Volta à especificação — FT-<nnn> · <artefato> (<tipo>, <inclui|altera|exclui>) · <motivo>
Fatia: bloqueada (de: <fase>) · Bloqueio: aguardando especificação [ESP] FT-<nnn>: <artefato> (<tipo>, <ação>) — <motivo>
[ESP] FT-<nnn>: <aberta | concluída com a linha na sprint aberta → reabrir (sim) | sem a linha viva na sprint aberta → encaixe pelo P.O. ou SM (a tarefa que existe move e reabre)>
Próximo: sa-especificar FT-<nnn> (agente sa-especificador)
```

- **Reabrir:** `elm_transicao(<id>, "reabrir")`, com "sim" (como a seção Assumir do `fluxo/entrada.md`); sem o MCP →
  `ELM pendente [ESP FT-<nnn> reabrir]`.
- **Sem a linha viva na seção Especificação da sprint aberta** (a `[ESP] FT` concluída numa sprint anterior, ou
  nunca criada) → o `sa-planejamento.durante.encaixe` cria a linha `planejada` na Especificação (capacidade de
  especificação), sem mexer na linha da fatia; no EWM, a `[ESP] FT` que existe move e reabre, ou nasce.
- **`pronta`** (consolidação) não muda de fase: o Drift do `status.md` recebe ` · especificação: [ESP] FT-<nnn>` (na
  base, pelo bloco [Gravar na base](#gravar-na-base)).
- **Pedido de fora da fatia** (refinamento, `sa-prd.mudanca`, reunião, triagem) com a fatia `iniciada`: quem pede
  não toca na branch; grava na base só a linha na seção Artefatos afetados (Especificado `—`, autorização do P.O. ou
  do SM) e a `[ESP] FT` (reabrir ou encaixe), e avisa o Dev responsável. O Dev, ao retomar (`sa-plano.plano` e
  `sa-codificar.codificar.onde`: linha com Especificado `—` na ficha e a `[ESP] FT` aberta), grava
  `bloqueada (de: <fase>)` com o Bloqueio `aguardando especificação [ESP] FT-<nnn>: …` e para.
- **Fatia não iniciada** (`nova`, `elegivel`, `planejada`): não para em `bloqueada`; a linha entra na seção
  Artefatos afetados com Especificado `—`, e a DoR volta a `nova` com `falta: especificação` (a `planejada` sai da
  sprint pela [Volta](#situações), ou fica nela com a `[ESP] FT`, pelo encaixe).
- O artefato fora da seção Artefatos afetados entra nela pela `[ESP] FT`, com a autorização do P.O. ou do SM registrada na
  linha. Concluída a `[ESP] FT`: `iniciada` → o Dev traz a base para a branch
  (`git merge origin/<base>`, com "sim") e retoma; `pronta` → a `sa-consolidar`.

### Épico — `status` no backlog · Situação da Especificação na sprint

`novo` → `elegivel` → `planejado` → `iniciado` → `concluido` · desvio `cancelado`

| Épico | Especificação | Quando | Quem grava |
|---|---|---|---|
| `novo` | — | triado; sem informação para o PRD, a pasta antecipada guarda o `rascunho.md` | `sa-triar` |
| `elegivel` | — (a linha que saiu da sprint: `elegivel`, com `saiu da sprint`) | passou na DoR do épico ([uma só](#definition-of-ready-o-que-faz-uma-fatia-elegivel): o problema, quem pede, o resultado e o `po`); ou `planejado` cuja `[ESP]` saiu da sprint sem começar (movida no EWM e aceita pelo P.O. na sincronização, §9 do `elm-sprint.md`; ela e o IB do épico, no estado inicial, ficam no backlog do EWM até voltar) | `sa-triar` · `sa-planejamento` |
| `planejado` (+ `sprint`) | `planejada` | `[ESP]` planejada | `sa-planejamento` |
| `iniciado` | `iniciada` | `[ESP]` assumida: só a situação vai à base; a `concluida` volta a `iniciada` quando a `sa-prd.mudanca` reabre a `[ESP]` (PRD `aprovado`, não fatiado) | `sa-especificar.especificar.assumir` · `sa-prd.mudanca` |
| `iniciado` | `concluida` (+ Créditos) | GATE do PRD: o PRD na base e a `[ESP]` concluída; o épico segue com o fatiamento (`sa-fatiar`, P.O. ou SM) e as fatias | `sa-especificar.especificar.fechamentos` |
| `concluido` | — | última fatia concluída, ou a última não terminal cancelada com outra `concluida` (backlog, Fase do `status.md` do épico e EWM); nunca o épico `cancelado`, que fica como está | `sa-consolidar` · `sa-fatiar.refinamento` |
| `cancelado` | `cancelada` | decisão do P.O.: as fatias não iniciadas ficam `cancelada` e a `[ESP]`, se ainda aberta, conclui com as horas lançadas, na mesma gravação | `sa-fatiar` |

- O GATE do PRD grava no backlog só o link `prd` (e a `pasta`, se estava `—`) e, na sprint, a linha da
  Especificação `concluida` com os Créditos, pela `sa-especificar`, no commit que leva a pasta à base; o épico segue
  `iniciado`.
- **Fase do `status.md` do épico** — o detalhe, como a da fatia (modelo no
  padrão `sa-especificar/status-epico.md`): `rascunho`
  (triado, entrevista e escrita do PRD: `sa-triar` · `sa-especificar`) → `em-revisao` (revisão P, ou mudança depois
  de aprovado: `sa-prd`) → `aprovado` (GATE do PRD: `sa-prd`) → `fatiado` (GATE do backlog: `sa-fatiar`, P.O. ou SM) →
  `concluido` (`sa-consolidar` · `sa-fatiar`, ao cancelar a última não terminal) · `cancelado` (`sa-fatiar`).

### Item de Sustentação sem mudança no repositório — `status` no backlog · Situação na sprint

`aberto` → `em-andamento` → `concluido` · desvio `cancelado`

| Situação | Quando | Quem grava |
|---|---|---|
| `aberto` | triado (na sprint ou fora dela: `sprint` `—`); o item `aberto` que sai da sprint (movido no EWM e aceito pelo P.O. na sincronização) segue `aberto`, com `sprint` `—` e a linha da sprint com `saiu da sprint` (no EWM, o IB volta ao backlog e ao estado inicial) | `sa-triar` · `sa-planejamento` ([elm-sprint.md](../../sa-planejamento/references/elm-sprint.md) §9) |
| `em-andamento` | tarefa assumida — antes, cria o IB e a tarefa que faltarem; commit `<ID> iniciar` (concluído na mesma sessão → um commit só) | `sa-atender` · `sa-executar` · `sa-planejamento` (§9: tarefa trazida do EWM já nesse estado, ou a conhecida que entrou em andamento no EWM) |
| `concluido` | tarefa e IB do item concluídos (+ `concluida-em` no backlog; Créditos na sprint e, na virada, no backlog) | `sa-atender` · `sa-executar` · `sa-planejamento` (§9: tarefa trazida do EWM já nesse estado, ou a conhecida concluída no EWM — `concluida-em` = a data da sincronização, Observação `concluído no EWM`) |
| `cancelado` | correção do registro; o IB e a tarefa cancelam no EWM (`elm_transicao(<id>, "cancelar")`, com "sim"; na falha, `ELM pendente [<ID> cancelar]` no campo `**ELM:**` do registro) | `sa-triar` · `sa-planejamento` (§9: tarefa descartada no EWM, Observação `cancelado no EWM`) |

## Quem escreve o quê

| O quê | Skill |
|---|---|
| `status` | quem causa a transição — [Situações](#situações) |
| épico registrado (`po`, `pasta`, `obs`) | `sa-triar` |
| épico `prd` e `pasta` (se estava `—`), no GATE do PRD | `sa-especificar` |
| fatias de épico criadas (no GATE do backlog, com `origem` `EP-nn` e a `prioridade` do épico) e canceladas; as fichas delas, com a seção Artefatos afetados do PRD | `sa-fatiar` (P.O. ou SM) |
| fatia de Manutenção (`trilha`, ficha com a seção Artefatos afetados, `bloqueada-por`, `obs` `falta:` e `vinculada a`), dividida ou cancelada | `sa-triar` |
| a coluna Especificado da seção Artefatos afetados e os conceitos aprovados (`.kiro/specs/ft-<nnn>-<slug>/elm/`) | `sa-especificar.fatia` (`[ESP] FT`) |
| `sprint`, `responsavel`, `modo` final (pela senioridade), `prioridade` e a ordem das linhas · encaixe durante a sprint · `sprint` dos itens que migram na virada · na sincronização com o EWM, a saída e a entrada aceitas pelo P.O. e o `responsavel` pelo dono da tarefa (§9 do `elm-sprint.md`) | `sa-planejamento` |
| `responsavel` e `modo` da primeira atribuição (se `—`) da fatia que inicia, e o revisor e o verificador se ela virou HITL | `sa-desenvolver.desenvolver.iniciar` (no loop, o orquestrador) |
| `responsavel` (se `—`) do item de Sustentação, ao assumir | `sa-atender`/`sa-executar` |
| item de Sustentação registrado (id da série, `origem`, `sprint`, `responsavel`, `registro`) e a `### <Categoria>` do primeiro | `sa-triar`; tarefa trazida do EWM: `sa-planejamento` (§9 do `elm-sprint.md`) |
| `concluida-em` | `sa-consolidar` (fatia) · `sa-atender`/`sa-executar` (item de Sustentação) · `sa-planejamento` (§9: tarefa trazida do EWM já concluída, ou a conhecida concluída no EWM) |
| `creditos` | a virada da sprint (`sa-planejamento`) |
| linhas da `## Sustentação` e da `### <Categoria>` | IB `Sustentação` e `GB`: o fluxo `sa-planejamento.inicial` (faltando, quem cria pelo §2: o espelhamento do §0, a `sa-triar` ou a publicação da sprint, §4); `GB` do pai novo: a publicação da sprint; IB `Manutenção` e IB da categoria: quem cria no EWM o primeiro item deles ([elm-sprint.md](../../sa-planejamento/references/elm-sprint.md) §2, §3, §6) |
| `elm` (ids e urls) | `sa-triar` (épico, fatia de Manutenção, IB do item de Sustentação), `sa-fatiar` (IB das fatias de épico), a publicação da sprint e o encaixe — `sa-planejamento.durante.encaixe` — (tarefas e o que estava `pendente` ou sem link), o espelhamento do §0 (o que estava `—`, `pendente` ou sem link: pela setup, pelo passo `sa-triar.triar.chegou`, e pela sincronização, §9), `sa-consolidar` (item e tarefas do campo ELM do `status.md`), `sa-atender`/`sa-executar` (IB e tarefa que faltarem, ao assumir) ([elm-sprint.md](../../sa-planejamento/references/elm-sprint.md) §2–6) |

## Definition of Ready (o que faz uma fatia `elegivel`)

A única do fluxo — triagem, fatiamento, planejamento, `sa-especificar` (épico e `[ESP]` de fatia) e `sa-desenvolver` conferem por aqui.
Passou → `elegivel`; deixou de valer → a [Volta](#situações) (`nova`, com `obs` `falta: …`).

| Trilha | Elegível quando |
|---|---|
| épico (DoR única do épico) | o problema, quem pede, o resultado esperado e o `po` preenchido |
| padrão de épico | ficha com Objetivo, Cobre e Como verificar; cenários de aceite do PRD em `cobre`, com o épico na Fase `aprovado` ou `fatiado` (`status.md` do épico) |
| padrão sem épico | ficha `aprovada por` o P.O., com cenários `C<n>` |
| rápida | ficha com o atual (com evidência), o esperado (com fonte), o que não muda e como verificar; sem regra nova (`inclui` de `REG` ou `HF`); tamanho ≤ M |
| todas | a ficha existe no caminho da coluna `ficha`; a seção Artefatos afetados com a lista confirmada (ou a linha Nenhum…); toda linha com Especificado preenchido (a `[ESP] FT` concluída); `bloqueada-por` em `pronta` ou `concluida` (já na base) ou planejada antes dela na mesma sprint (ela só **começa** quando o que precisa está na base); nenhuma decisão bloqueante `em aberto` (`decisoes.md` ou ficha); tamanho ≤ G; modo declarado (AFK/HITL); cabe numa janela de contexto |

Faltas da seção Artefatos afetados, exatas no `obs`: `falta: especificação` (linha `inclui`, `altera` ou `exclui` com
Especificado `—`) · `falta: artefatos afetados` (a lista sem a confirmação de quem tria).

### Completar uma fatia `nova`

Deixar pronta a fatia que não passa na DoR (`obs` `falta: …`) — nunca pela `sa-fatiar`, que só quebra um PRD
aprovado. Quem faz depende de onde ela está:

| Onde | Quem | Horas |
|---|---|---|
| no backlog (`sprint` `—`) | P.O., no agente `sa-produto`, pela `sa-triar` (retomar a fatia); só `falta: especificação` → entra na sprint como especificação (planejamento ou encaixe) | sem tarefa: os créditos vão no comentário da `[GB]` |
| na sprint, com a `[ESP] FT-<nnn>` (`obs` `em especificação`) | quem especifica, no agente `sa-especificador`, pela `sa-especificar.fatia` | na `[ESP]` |

1. Decisão em aberto → **`sa-entrevistar`**, com a pessoa.
2. Ficha incompleta (Objetivo, Cobre, Artefatos afetados, Como verificar) → complete-a no formato da
   ficha (o padrão `sa-triar/ficha.md`). Na fatia de épico, o Cobre é o do GATE do backlog e não muda.
3. Cenário de aceite que a fatia de épico não cobre → ela não ganha cenário nem cobertura: o cenário novo vai à
   **`sa-triar`** (épico ou fatia nova, `origem EP-<nn>`). O `falta: especificação` não se completa aqui: é a
   `[ESP] FT` (`sa-especificar.fatia`).
4. Confira a DoR acima. Passou → `elegivel` no `backlog.md` (sem o `falta:` e o `em especificação`), pelo bloco
   [Gravar na base](#gravar-na-base); não passou → atualize o `falta:`.

## Gravar na base

O bloco único para todo artefato de produto (`backlog.md`, fichas, PRD e `status.md` do épico, `sprint-<nn>.md`,
registro de Sustentação, glossário, ADRs, lições, `sabia.md` Regras aprendidas, os conceitos aprovados na `[ESP] FT`
em `.kiro/specs/ft-<nnn>-<slug>/elm/`) e para o `status.md` da fatia depois do merge. Na base, a pasta da fatia sem
`status.md` não é fatia iniciada. As skills citam este bloco em vez de repetir:

1. **Base:** fora dela → "Troco para `<base>`? (sim)" — sem "sim", pare; árvore com alterações não commitadas →
   avise e pare (nunca ofereça descartar, `stash` ou `reset`). Na base: `git pull --ff-only`; falhou (divergiu) →
   avise e pare, sem merge nem rebase. Base sem upstream (repositório só local, ou branch nunca publicada) →
   `git fetch` basta, e diga que o registro fica só local até alguém publicar.
2. **Grave** só o que a skill manda.
3. **Commit** pequeno, só com o que gravou, mensagem no padrão do `sabia.md`.
4. **Publicar:** push direto na base, com o "sim" da pessoa (agente sem push → entregue o comando pronto).
   Conflito de id no push → a regra de conflito abaixo.
5. Ao terminar, ofereça voltar à branch anterior.

**Linha viva.** O item que volta à sprint de onde saiu (encaixe — `sa-planejamento.durante.encaixe` — ou sincronização com o EWM)
ganha linha nova no `sprint-<nn>.md`; com duas linhas do mesmo id na sprint aberta, a **viva** — a que se lê e se
escreve (Status ou Situação, Tarefa ELM, Responsável, Créditos) — é a sem `saiu da sprint`. A com `saiu da sprint` é
histórico: nunca é editada e não migra na virada. O item que só tem essa linha na sprint está fora dela.

**Pelo Dev** (o agente do Dev e o orquestrador do loop gravam só os registros de situação — `iniciada`, `pronta` — e o
`status.md` da fatia na base; quem desenvolve tem push na base, requisito do Sabiá), o bloco muda assim:
- item 1: `git fetch` antes de tudo. No loop, o orquestrador não troca de branch: grava só com o checkout principal
  já na base e limpo (senão, pede à pessoa que troque — `sa-orquestrar.orquestrar.lote`);
- item 3: pergunte antes do commit;
- item 4: antes do push, confira o que sobe — `git diff --name-only origin/<base>..<base>` só com
  `<produto>/backlog.md`, `<produto>/sprints/**` e o `status.md` da fatia; outro arquivo → pare (o Kiro não restringe
  o push por arquivo). E `git log --oneline origin/<base>..<base>` só com o commit de registro; outro commit não
  publicado → pare: a pessoa o publica antes (o `reset` do push recusado o descartaria junto). Push pelo agente, com "sim", sempre `git push origin <base>` (os agentes negam o push sem a
  branch nomeada); depois `git fetch` e `git rev-parse <base>` = `git rev-parse origin/<base>`. Agente sem push
  (orquestrador com `Push e PR no loop: não`) → entregue esse comando pronto e espere a pessoa publicar (`git fetch`
  mostra o commit em `origin/<base>`), sem `reset`;
- push recusado (só o que o agente tentou e o remoto recusou: base protegida, outro Dev publicou antes) → desfaça só
  esse commit de registro, ainda não publicado, com `git reset --keep origin/<base>` e o "sim" da pessoa (a única
  exceção ao "nunca ofereça `reset`"), e pare, explicando o motivo.

## Regras

- Ids nunca são reaproveitados nem renumerados; "Próximos ids" só cresce.
- Antes de gravar: `git switch <base>` e `git pull --ff-only`; depois, commit pequeno só com ele quando não houver
  outro artefato de produto junto. Push: com o "sim" da pessoa.
- Conflito no `backlog.md`: mantenha o remoto e reaplique só a sua mudança, linha a linha (cada item é uma linha).
  Nunca resolva descartando o lado remoto.
