# Arquivos do planejamento — raiz de `<produto>/`

Todos versionados. Antes de gravar: `git pull --ff-only` (falhou → a branch local divergiu: peça à pessoa que a
atualize); mostre o diff e grave só com "ok".

## `equipe.json`

Formato definido pelo JSON Schema [../assets/equipe.schema.json](../assets/equipe.schema.json) (fonte da verdade).
Ele fica na pasta desta skill, não no projeto: leia-o direto pelo caminho relativo a esta pasta (busca no
workspace não o acha), e valide o JSON contra ele antes de mostrar. `$schema` é a primeira propriedade e é sempre a
URL abaixo, nunca um caminho local:

```json
{
  "$schema": "https://raw.githubusercontent.com/dxaraujo/sabia/main/skills/sa-planejamento/assets/equipe.schema.json",
  "atualizado": "2026-10-13",
  "projeto": {
    "nome": "Gestão de Acessos",
    "duracao-sprint-semanas": 2,
    "inicio": "2026-10-06",
    "historico": [
      { "sprint": "2026/Sprint 01", "fatias-concluidas": 5, "lead-time-medio-dias": 3.2, "horas-revisao": 22,
        "horas-lancadas": { "entrega": 120, "revisao": 18, "aprovacao": 4, "verificacao": 6, "especificacao": 24, "sustentacao": 9 },
        "reserva-sustentacao": 0.2 }
    ]
  },
  "membros": [
    {
      "nome": "Ana Souza",
      "login": "ana.souza",
      "papeis": ["P.O.", "Especificador", "SM"],
      "horas-semana": 10,
      "horas-revisao-semana": 4,
      "horas-especificacao-semana": 4,
      "atende": true,
      "ativo": true,
      "ausencias": [{ "inicio": "2026-12-20", "fim": "2027-01-05", "motivo": "férias" }]
    },
    {
      "nome": "João Lima",
      "login": "joao.lima",
      "papeis": ["Dev"],
      "senioridade": "Sênior",
      "horas-semana": 40,
      "horas-revisao-semana": 6,
      "atende": false,
      "ativo": true,
      "ausencias": []
    },
    {
      "nome": "Rita Melo",
      "login": "rita.melo",
      "papeis": ["Dev", "Especificador"],
      "senioridade": "Pleno",
      "horas-semana": 40,
      "horas-revisao-semana": 4,
      "horas-especificacao-semana": 8,
      "atende": true,
      "ativo": true,
      "ausencias": []
    }
  ]
}
```

- Chaves em kebab-case, exatamente as do exemplo; nada além delas (o schema recusa `horasSemana`, `capacidade`…).
- `papeis` é uma lista com um ou mais de `P.O.`, `Especificador`, `Dev`, `QA` e `SM` (ex.: `["Dev", "QA"]`); as horas de
  revisão e de especificação já dizem quanto do tempo vai para cada frente. Exatamente **um** membro ativo tem `P.O.` e
  exatamente **um** tem `SM` — pode ser a mesma pessoa (Ana, acima). O SM é o dono da `[GB] Gerenciamento do backlog`.
- `senioridade` — `Júnior`, `Pleno` ou `Sênior` — é obrigatória em quem tem `Dev` (o schema recusa sem ela) e não
  existe nos demais. Decide o modo das fatias que a pessoa implementa (Júnior: sempre HITL · Pleno: pelos critérios da
  fatia · Sênior: AFK por padrão) e quem revisa PR: a `[REV]` é sempre de um Dev Sênior.
- `horas-revisao-semana` soma revisar (planos, PRs) e verificar (aceite) e é parte de `horas-semana`.
- `horas-especificacao-semana` (entrevista, PRD, especificação de fatia: tarefas `[ESP]`) também é parte de `horas-semana`;
  ausente = 0. Revisão + especificação nunca passam de `horas-semana`.
- `atende: true` marca quem faz Sustentação (toda categoria: responsável sugerido na triagem); a reserva é das horas
  do time inteiro, não só dessas pessoas.
- `historico` ganha uma entrada na virada, com `sprint` = a chave da sprint (`2026/Sprint 01`);
  `horas-lancadas` e `reserva-sustentacao` vêm do relatório de horas ([elm-sprint.md](elm-sprint.md) §5).
- Capacidade da sprint e totais **não** são gravados: calcule na hora. `historico` fica dentro de `projeto`.
- `motivo` da ausência: `férias`, `folga`, `treinamento` ou `outro`.
- Exatamente um P.O. e um SM ativos (a mesma pessoa pode ter os dois). Quem sai fica `ativo: false` (preserva o histórico).
- Horas de uma sprint = `horas-semana × duracao-sprint-semanas` − (dias úteis, seg–sex, da ausência dentro das datas da
  sprint × `horas-semana` ÷ 5); o mesmo para `horas-revisao-semana` e `horas-especificacao-semana`.
- Sem dado pessoal além de nome e login.

## `acordos.md`

```markdown
# Acordos do time

| Item | Acordo |
|---|---|
| Cadência | Scrumban: sprints de 2 semanas (planejamento, review, retrospectiva, virada), fluxo puxado dentro da sprint, WIP limitado |
| Cerimônias | planejamento (seg, 1h) · review (última qui, 30 min) · retrospectiva (última qui, 30 min) |
| WIP | 1 fatia por sessão de agente · fatias esperando pessoa (`aguardando-aprovacao-plano`, `pr-aberto`, `em-revisao`, `em-verificacao`, `aceita`, `verificada`, `aguardando-aprovacao-pr`) ≤ 2 por revisor · PR parado > 1 dia: destravar antes de fatia nova (exceção registrada no Histórico do `status.md` da fatia que começa: `WIP excedido: <motivo>`) |
| Tamanhos | P (horas) · M (≈ 1 dia) · G (2–3 dias) · maior → dividir (sem pontos; a previsão é pela vazão) |
| Horas por tamanho | P: [DEV] 4 · [REV] 1 · [VER] 1 · M: [DEV] 8 · [REV] 2 · [VER] 2 · G: [DEV] 20 · [REV] 3 · [VER] 3 (exemplo: os números são do time; horas inteiras; a estimativa das tarefas de papel na publicação, ajustável por fatia na proposta; AFK: só a [DEV]) |
| Especificação | Épico com até 8 histórias (toda história conta, inclusive as desdobradas de outra) e um objetivo de negócio; mais → propor dividir em dois épicos antes de escrever o PRD |
| Reserva (Sustentação + retrabalho) | 20% das horas da sprint do time, para a Sustentação sem mudança no repositório (toda categoria; a Manutenção entra pela vazão, como as fatias de épico) e o retrabalho da sprint anterior (fatias migradas primeiro); na virada, o P.O. pode mudar o % olhando o consumido (muda aqui, com "ok") |
| Lançamento de horas | Cadência do time (padrão: ao fechar cada sessão de trabalho), em qualquer tarefa assumida; na conclusão, só o saldo. Lançar não conclui. Na `[GB]`, só o SM lança; o P.O. nunca lança (nem quando é também o SM): os créditos das sessões do P.O. e do SM vão num comentário na `[GB]` |

## Definition of Ready (fatia)

A do fluxo, por trilha: [../../sa-fatiar/references/backlog.md](../../sa-fatiar/references/backlog.md#definition-of-ready-o-que-faz-uma-fatia-elegivel).
O time só acrescenta itens próprios aqui (ex.: "massa de teste disponível"), nunca afrouxa os de lá.

## Definition of Done (fatia)
- [ ] Plano aprovado (GATE do plano pela senioridade, ou plano do Sênior / Pleno que dispensou) e seguido; desvios registrados no design.md
- [ ] Backpressure verde: compilar, testes, lint, cobertura (gate do projeto)
- [ ] Revisão independente APROVADO
- [ ] Verificação de aceite ACEITO com evidência por cenário
- [ ] PR revisado e mergeado por uma pessoa
- [ ] ELM atualizado (requisitos, IB concluído, CTs ligados) ou pendência registrada
- [ ] Lições registradas
```

## `roadmap.md`

```markdown
# Roadmap — <projeto>

| Release | Objetivo | Épicos | Previsão |
|---|---|---|---|
| R1 | Bloquear abuso de login | EP-03, EP-04 | 2026/Sprint 03 (pela vazão média) |
| R2 | … | EP-05 (a descobrir) | — |
```

Previsão = a chave da sprint `ceil(fatias restantes ÷ vazão média)` sprints depois da aberta (sem aberta: a partir
da próxima), no pai atual; com histórico, a faixa pelas vazões mínima e máxima das últimas 3 sprints:
`2026/Sprint 03 (vazão média; faixa 2026/Sprint 02–2026/Sprint 05)`; épico sem fatias (a descobrir) → `—`.

## `sprints/<pai>/sprint-<nn>.md`

A sprint acompanha a iteração do EWM de que ela é filha (estrutura padrão: `<linha de base>` → `2026` → `Sprint 01`, `Sprint 02`…;
`2027` → `Sprint 01`… — [elm-sprint.md](elm-sprint.md#estrutura-no-ewm-padrão)): `<pai>` é o nome da iteração pai (`2026`) e `<nn>` recomeça em `01` em cada pai — `sprints/2026/sprint-01.md`,
`sprints/2027/sprint-01.md`. A **chave** da sprint é `<pai>/Sprint <nn>` (`2026/Sprint 03`), do número do arquivo
(o nome do arquivo não muda; o da iteração no EWM é livre e fica só no `**Iteração no EWM:**`, com ou sem ELM): é
ela que vai no cabeçalho, na coluna `sprint` do `backlog.md`, em `historico[].sprint` do `equipe.json`, nas
Observações `migrada para <chave>` e `migrada de <chave>` e nos commits (`2026/Sprint 03: planejar`). Nas skills,
`sprint-<nn>.md` abrevia `sprints/<pai>/sprint-<nn>.md` e "sprint `<nn>`", a chave. A ordem das sprints é a da data
de início do cabeçalho (o nome do pai é livre e não ordena) — a do `historico`, que cruza pais na vazão.

```markdown
# <pai>/Sprint <nn> · <AAAA-MM-DD> → <AAAA-MM-DD>

**Meta:** <resultado de negócio>
**Iteração no EWM:** <pai>/<nome> | —   (o caminho que o `elm_iteracao` recebe: `2026/Sprint 03`)
**Plano no EWM:** <nome> - <nome curto da meta>   (o `plano` do `elm_iteracao`: `Sprint 03 - Exportar o relatório de contas`)
**Power sabia:** <versões usadas, crescente: 2.0.0 · 2.0.1>   (o planejamento grava a da abertura; a virada acrescenta as das linhas de créditos)
**Situação:** <aberta | fechada>   (a virada grava `fechada`; o painel usa a última `aberta`)
**Fechamento sem consolidar:** FT-031, FT-033 (<login do P.O.>, <AAAA-MM-DD>)   (só quando o P.O. decide fechar com fatia de PR mergeado sem consolidação; ids separados por vírgula; outra decisão na mesma sprint acrescenta ` · FT-… (<login do P.O.>, <AAAA-MM-DD>)`)
**Publicação no EWM:** pendente   (só enquanto o §1 do [elm-sprint.md](elm-sprint.md) não rodou: planejamento sem o MCP ou com falha, ou a próxima, criada no passo `sa-planejamento.retrospectiva.fechar` da virada; a publicação a tira)

## Fatias

| FT | Título | Origem | Tam. | Modo | Responsável | Revisor | Verificador | Status | Tarefa ELM | Créditos | Observação |
|---|---|---|---|---|---|---|---|---|---|---|---|
| FT-031 | Bloquear a conta após 3 tentativas | EP-03 | M | AFK | joao.lima | — | — | concluida | DEV 669401 | 41.20 | |
| FT-033 | Avisar o usuário do bloqueio | EP-03 | M | HITL | rita.melo | joao.lima | ana.souza | iniciada | DEV 669410 · REV 669411 · VER 669412 | — | migrada para 2026/Sprint 04 |
| FT-034 | Corrigir o texto do e-mail | Manutenção | P | AFK | joao.lima | — | — | concluida | DEV 669420 | 6.75 | encaixe: entra na folga (ana.souza, 2026-10-22) |

## Especificação

| EP · FT | Responsável | Horas previstas | Situação | Tarefa ELM | Créditos | Observação |
|---|---|---|---|---|---|---|
| EP-05 | rita.melo | 16 | iniciada | ESP 669377 | — | |
| FT-040 | — | 6 | planejada | ESP 670500 | — | encaixe: entra na folga (ana.souza, 2026-10-23) |

## Sustentação

Reserva (Sustentação + retrabalho): <h>h · retrabalho migrado: <h>h

### Atendimento

| Id | Pedido | Origem | Responsável | Horas | Tarefa ELM | Situação | Créditos | Observação |
|---|---|---|---|---|---|---|---|---|
| AT-012 | Extração de contas bloqueadas em setembro | chamado 4521 | joao.lima | 3 | ATD 669380 | concluido | 3.12 | |

### Implantação

| Id | Pedido | Origem | Responsável | Horas | Tarefa ELM | Situação | Créditos | Observação |
|---|---|---|---|---|---|---|---|---|
| IM-003 | Subir a versão 1.4 em produção | EWM 670215 | ana.souza | 4 | IMPL 670215 | em-andamento | — | trazida do EWM |

## Créditos de gestão

| Data | Atividade | Login | Sessão Kiro | Power sabia | Créditos |
|---|---|---|---|---|---|
| 2026-10-06T10:41:12 | planejamento | ana.souza | 9ec1dcaa | 2.0.0 | 2.40 |

## Débito de especificação

| FT | Artefato | Divergência | Registrado | Tarefa |
|---|---|---|---|---|
| FT-031 | 2101 · REG - Desconto de pontualidade (REG) | o código limita a 12%; a REG diz 10% | ana.souza, 2026-11-04 | — |

## Capacidade
Revisão: <h>h · HITL: <h>h · Especificação: <h>h · Reserva (Sustentação + retrabalho): <h>h · Vazão prevista: <n> fatias (previsão; o compromisso é a meta)

## Review
<retorno do P.O. por fatia; pedidos novos → backlog> ou, sem retorno, a linha `sem retorno (<P.O.>, <AAAA-MM-DD>)` (a retrospectiva exige a seção preenchida)

## Retrospectiva
| Bom | Melhorar | Ação (dono) |
|---|---|---|

## Números
Concluídas: <n> fatias (<p> previstas · <q> por encaixe) · meta: <atingida | não — por quê> · lead time médio <d> dias · rodadas de revisão por fatia <x> · correções humanas <n>

| Tipo | Planejadas (h) | Lançadas (h) | Créditos |
|---|---|---|---|
| Entrega `[DEV]` | | | <Fatias: todos os papéis> |
| Revisão `[REV]` | | | ↑ |
| Aprovação `[APR]` | | | ↑ |
| Verificação `[VER]` | | | ↑ |
| Especificação `[ESP]` | | | |
| Sustentação — Atendimento `[ATD]` | | | |
| Sustentação — <categoria> `<prefixo>` (uma linha por categoria com horas) | | | |
| Gestão `[GB]` | — | | |
| **Total** | | | |

Créditos por fatia concluída: <média> · por versão do power sabia: <versão> <x> · …
```

| Coluna | Valores |
|---|---|
| FT · EP · Id | o id do `backlog.md` |
| EP · FT (Especificação) | `EP-<nn>` (a `[ESP]` do épico) ou `FT-<nnn>` (a `[ESP] FT` da fatia `nova` em especificação, ou a Revisão <n> de uma fatia); uma linha por `[ESP]`: a Revisão <n> do mesmo item é uma linha nova (Observação `revisão <n>: <motivo>`) |
| Título · Pedido | o `título` do `backlog.md` |
| Origem | a `origem` do `backlog.md` (fatia: `EP-nn` · `Manutenção`; Sustentação: chamado, e-mail, `DF <id>`, `IB <id>`, `pedido`, `EWM <id>`) |
| Tam. | `P` · `M` · `G` (o `tamanho`) |
| Modo | `AFK` · `HITL` (o `modo` final; troca só pelo fluxo `sa-planejamento.troca-modo`) |
| Responsável · Revisor · Verificador | `login` do `equipe.json` ou `—`: Responsável = o `responsavel` do backlog; Revisor e Verificador = o Dev Sênior da `[REV]` e quem verifica, só no HITL (`—` no AFK e até a atribuição) |
| Horas previstas (Especificação) | a estimativa da `[ESP]` (`estimativa_h` no EWM), em horas inteiras |
| Horas (Sustentação) | a estimativa do item, a do `**Estimativa:**` do registro, sem a unidade (as horas lançadas ficam no `## Horas` do registro e no EWM) |

Reserva da `## Sustentação`: gravada pelo planejamento — a reserva = o % do `acordos.md` × as horas da sprint do time;
`retrabalho migrado` = a soma, nas fatias com `migrada de`, das horas que faltam da [DEV]. O consumido não é gravado:
quem lê calcula = retrabalho migrado + a soma da coluna Horas das linhas vivas das `### <Categoria>` (sem `saiu da
sprint`).

`## Sustentação`: a linha da reserva e só as `### <Categoria>` com item na sprint, na ordem da tabela Sustentação do
`sabia.md` (a `### <Categoria>` nasce com o primeiro item dela na sprint; sem coluna Categoria: a seção diz).

**Situações ao vivo:** Status (fatia) e Situação (Especificação e Sustentação) são gravados durante a sprint, por
quem causa a transição (ou pela sincronização, com a evidência do git: `iniciada` e `pronta`,
[elm-sprint.md](elm-sprint.md) §9), no mesmo commit do `backlog.md` — listas fechadas e quem grava cada uma em
[Situações](../../sa-fatiar/references/backlog.md#situações). Fatia: `planejada` → `iniciada` → `pronta` →
`concluida` (a linha nasce `planejada`, também a do encaixe; a que sai da sprint fica `nova` ou `elegivel`, com
`saiu da sprint`; desvios `dividida`, `cancelada`); o detalhe da `iniciada` é a fase do `status.md`. Especificação:
`planejada` → `iniciada` → `concluida` · `cancelada` (a que sai da sprint fica com a situação do item no backlog —
épico `elegivel`, fatia `nova` — e `saiu da sprint`). Sustentação: `aberto` → `em-andamento` → `concluido` ·
`cancelado` (a que sai da sprint fica `aberto`, com `saiu da sprint`). A linha migrada guarda a última situação.
**O item que volta** à sprint de onde saiu ganha linha nova; a com `saiu da sprint` fica como histórico — nunca é
editada e não migra na virada —, e a **viva**, que se lê e se escreve, é a sem ela
([Gravar na base](../../sa-fatiar/references/backlog.md#gravar-na-base)).

"Tarefa ELM": as tarefas do item no EWM, com o tipo antes de cada id — nas fatias `DEV <id> · REV <id> · VER <id>`,
mais `APR <id>` das aprovações criadas no gate (AFK, a `DEV` e as `APR`); `ESP <id>`; `ATD <id>`, `IMPL <id>`… —,
ou `pendente`, gravada pela publicação da sprint ([elm-sprint.md](elm-sprint.md) §4), pelo encaixe, pela troca de
modo (`REV`/`VER`), pela sincronização (§9: por fora e publicação pendente) e pela consolidação (os ids do campo ELM
do `status.md` que faltam, inclusive as `APR`, que até lá ficam só no `status.md`). Observação: `revisor único`, `encaixe: <decisão> (<quem aprovou>, <data>)` — a puxada; por outra pessoa,
`encaixe: <decisão> (<quem aprovou>, <data>; puxada por <login>)`; a que entrou pelo EWM, `encaixe: trazida do EWM —
<decisão> (<quem aprovou>, <data>)` (a linha `encaixe` da sincronização, pelo passo `sa-planejamento.durante.encaixe`);
a que a sincronização grava direto, sem passar pelo encaixe (fatia `nova` que entra como especificação, épico com a
`[ESP]`, `[ESP]` por fora — [elm-sprint.md](elm-sprint.md) §9), `encaixe: trazida do EWM — entra como especificação (<quem aprovou>, <data>)`;
a começada por fora, `encaixe: começada por fora (<P.O.>, <data>)` —; `<decisão>`: `entra na folga` · `entra no lugar
de FT-<nnn>` (a que sai recebe `saiu da sprint: encaixe de <FT> (<quem aprovou>, <data>)`) · `entra como
especificação`; "fica para a próxima sprint" não grava linha —,
`modo: <de> → <para> (<quem>, <data>, <motivo>)`, `modo: <atual> mantido (<quem>, <data>)`,
`modo: HITL → AFK (Pleno <login> aceitou|recusou, <data>)`, `horas: DEV <h> · REV <h> · VER <h>` (AFK: `horas: DEV <h>`; as horas por papel
ajustadas na proposta, `sa-planejamento.sprint.proposta`; sem ela, valem as da linha `Horas por tamanho` do `acordos.md`), `migrada para <chave>`, `migrada de <chave>`, `saiu da sprint: <motivo> (<quem>,
<data>)` (movida no EWM: `saiu da sprint: movida no EWM para <iteração> (<P.O.>, <data>)`), `trazida do EWM`,
`concluído no EWM`, `cancelado no EWM` (Sustentação: a tarefa fechou ou foi descartada direto no EWM, [elm-sprint.md](elm-sprint.md)
§9), `revisão <n>: <motivo>` (a linha da `[ESP] <id> Revisão <n>` na Especificação), `reaberta: <motivo>` (a linha da
Especificação `concluida` que volta a `iniciada` na sprint aberta: [Volta à
especificação](../../sa-fatiar/references/backlog.md#volta-à-especificação)), `volta: <motivo>` (a linha da
`[ESP] FT-<nnn> Especificação` que o encaixe cria para a fatia `iniciada` sem `[ESP]`, na mesma Volta), `não consolidada`; texto livre só para o
que nenhuma convenção acima cobre. Vários valores na Observação: separados por ` · `, na ordem em que foram gravados.

`## Débito de especificação`: a divergência entre o código mergeado e um artefato publicado, uma linha por artefato,
gravada pela consolidação (`sa-consolidar.consolidar.drift`); lida na review (`sa-planejamento.review.rito`) e na
retrospectiva. Tarefa fica `—` até o P.O. abrir a correção pela `sa-triar` (`origem FT-<nnn> (débito de
especificação)`), que grava ali o `FT-<nnn>` da fatia de correção (na linha viva: a da sprint aberta). Na virada, a linha com Tarefa `—`
migra (`sa-planejamento.retrospectiva.fechar`): na sprint que fecha, a Tarefa recebe `migrada para <chave>`; na
próxima, a linha nasce igual, com Tarefa `—` e ` · migrada de <chave>` no Registrado. Sem linha, a seção fica só
com o cabeçalho.

Créditos (do Kiro): nas Fatias, Especificação e Sustentação, a soma das linhas de créditos do item, gravada na
conclusão dele (`sa-consolidar`, `sa-especificar`, `sa-atender`, `sa-executar`), `—` antes; em Créditos de gestão, uma linha por
sessão do P.O. ou do SM no agente de produto — Atividade, um destes valores: `inicial` · `planejamento` · `encaixe` · `sincronização` · `troca de modo` · `review` · `retrospectiva` · `virada` · `triagem` · `consolidação` · `fatiamento` · `refinamento` —, com o
mesmo número no comentário de créditos da `[GB]` (`sa-status`, Fechar a sessão, item 4). A `[GB]` só tem as horas do
SM: sem horas (dona que também é P.O.) não é falta.
