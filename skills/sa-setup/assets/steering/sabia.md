---
inclusion: always
---

# Sabiá — <nome do projeto>

Este repositório usa o fluxo **Sabiá** (skills `sa-*`): alinhar antes de escrever, fatias verticais pequenas, plano
aprovado por um Dev Sênior (GATE pela senioridade), teste primeiro com backpressure, revisão e verificação independentes, PR lido por uma
pessoa, e o IBM ELM como registro oficial da documentação. Como funciona: skill `sabia`. Toda demanda nova: `sa-triar`.
Começar um item registrado: hub `sa-iniciar` (diz a skill do papel: `sa-especificar`, `sa-desenvolver`,
`sa-revisar`, `sa-verificar`, `sa-atender`; `sa-revisar` também nas `[APR]` (plano e PR), `sa-planejamento` na troca de modo, `sa-consolidar` na fatia `pronta`, `sa-executar` nas demais tarefas de Sustentação — `[IMPL]` `[BD]` `[INF]` `[OPE]` `[EXT]`). Onde parei ou fechar a sessão: `sa-status`.

- **Créditos do Kiro:** nenhuma sessão termina sem registrá-los. Skill que termina (diz a próxima e para) sem ter
  registrado os desta sessão, ou pessoa que encerra → pergunte `💳 Fechar a sessão e registrar os créditos? (sim)`
  e, na resposta, `sa-status` › Fechar a sessão › Créditos da sessão. A leitura é sempre depois de uma resposta da pessoa: o Kiro
  só grava o consumo do turno quando ele termina.
- Nada inventado (confirme no código, no banco — só leitura — ou no ELM). Nunca apague nem afrouxe teste.
- **Falha de escrita:** pasta inexistente → crie; permissão negada ou confirmação recusada → `fase: bloqueada (de:
  <fase>)` com o caminho e o que faltou (fora de fatia: diga e pare); gravação parcial → o próximo passo retoma pelo
  que está no disco. Nunca siga como se tivesse gravado.
- Estado limpo entre sessões: quem grava um passo na pasta da fatia commita o que gravou **com o `status.md`**,
  antes de seguir. AFK: quem pede a rodada (plano, implementação, loop) commita o relatório do subagente assim que o
  recebe — revisor, verificador e pesquisador como subagentes não commitam. HITL: cada papel commita o seu
  relatório e a fase na branch do PR.
- **Entrega (todo papel do HITL):** commit → push → **conferir no remoto** (`git fetch`; `git rev-parse HEAD` =
  `git rev-parse origin/<branch>`) → só então lançar horas ou concluir a tarefa do papel e avisar o próximo. Push
  da entrega pelo agente com a confirmação do Kiro, só da branch da fatia; sem ela, o comando pronto e a pessoa diz
  que publicou. Subagente do AFK não faz push (quem conduz commita).
- **Uma skill por vez:** cada skill termina dizendo a próxima e para — nunca invoca nem simula a do passo seguinte
  (os subagentes que ela manda chamar fazem parte dela); quem chama a próxima é a pessoa, ou o
  orquestrador no loop. Consolidar (fatia `pronta`) é do P.O. ou do SM, no `sa-produto` — nunca do agente do Dev.
- Push, troca de branch e escrita no ELM só com "sim" de uma pessoa; push de agente para a base só dos registros de
  situação da fatia (`<FT> iniciar`, `<FT> registrar merge`), com os arquivos conferidos antes (bloco Gravar na base
  do `references/backlog.md` da `sa-fatiar`). Merge só do PR aprovado, pelo **Dev responsável**
  (`gitlab_mesclar_mr`, com confirmação); nunca `--force`.
- Dado de cliente (consulta, extração, tela com dado real) nunca vai para o git: fica em `.sabia/local/<origem>/<id>/`;
  o versionado guarda consulta, contagem, caminho e resumo sem identificar pessoas.
- Scrumban: a sprint é cadência (meta, review, retro), não contêiner de escopo: o compromisso é a meta; dentro dela,
  fluxo puxado — a `elegivel` de maior prioridade entra quando o WIP de revisão tem folga, sempre pelo encaixe
  (`sa-planejamento`, agente `sa-produto`: o P.O., o SM ou quem puxa com a aprovação do P.O., registrada). Item fora
  da sprint → "fale com o P.O. ou o SM". Previsão pela vazão, sem pontos.
- **Modo pela senioridade** de quem implementa (`equipe.json`): Júnior → sempre HITL; Pleno → os critérios da fatia;
  Sênior → AFK por padrão (HITL só com motivo forte, registrado). Só Pleno ou Sênior dispara o `sa-orquestrar`. A `[REV]`
  e a `[APR]` são sempre de um **Dev Sênior** (PR de um Sênior: outro Sênior; único Sênior ativo → ele mesmo,
  `revisor único`). **GATE do plano** pela senioridade: Júnior → sempre; Pleno → pergunta (no loop, vale para o
  lote); Sênior → nunca (aprova o próprio plano). Fatia AFK cujo plano mostra risco → para em `bloqueada`,
  `aguardando troca de modo`. A troca de modo é só do P.O. ou do SM (agente `sa-produto`): AFK → HITL sem aprovação;
  HITL → AFK só antes do PR (Sênior direto, Pleno pergunta a ele e anota, Júnior nunca). Na primeira atribuição
  (fatia `—`), quem assume define o modo pela senioridade.
- Toda hora tem tarefa (`[ESP]` `[DEV]` `[REV]` `[VER]` e as da Sustentação — `[ATD]` `[IMPL]` `[BD]` `[INF]` `[OPE]` `[EXT]`; no AFK, só a `[DEV]`; `[APR]` do Dev Sênior nos
  gates sem tarefa de papel — aprovar plano, aprovar PR do AFK —, criada quando a fatia chega ao gate; `[GB]
  Gerenciamento do backlog` do SM: só ele lança horas nela; o P.O. nunca lança, nem quando é também o SM, e toda
  sessão do P.O. ou do SM no `sa-produto` comenta nela os créditos gastos). Lançar horas é
  registro de empenho, a qualquer momento na tarefa assumida; concluir é da skill do papel, com o saldo: `[DEV]` no
  merge, `[REV]` ao aprovar (depois do push), `[VER]` ao aceitar (depois do push), `[APR]` na aprovação, `[ESP]` ao
  publicar o aprovado no ELM (a do épico, depois do GATE do PRD; a `[ESP] FT`, ao concluir a especificação da fatia), a da Sustentação ao concluir o item (junto com o IB dele). A sincronização com o EWM
  (`sa-planejamento`, "sincroniza a sprint") leva o Sabiá até onde o trabalho chegou por fora: traz a tarefa criada
  direto no EWM, compara os itens conhecidos (estado, iteração, dono, estimativa, a fase do `status.md`, o IB do
  backlog fora do estado inicial) e lê o git (branch, PR, merge → `iniciada` ou `pronta`), numa tabela com a solução
  proposta.
- **Consolidação é processo de produto:** fatia `pronta` → o P.O. ou o SM, no agente `sa-produto`
  (`sa-consolidar`, créditos na `[GB]`): os requisitos já foram publicados na conclusão da `[ESP]`; publica no ELM a
  ET *as-built* (ligada à `[DEV]` e ao código) e os casos de teste, registra a divergência depois do merge como débito
  técnico de especificação (lido na review e na retrospectiva), leva os ADRs do PR à pasta de ADRs e fecha a fatia na
  base (`concluida`).
- Estado em disco: a situação de cada item no `backlog.md` e na sprint, gravada na base por quem a causa (seção
  Situações do `references/backlog.md` da `sa-fatiar`); o detalhe da fatia em `.kiro/specs/<ft>-<slug>/` (comece
  pelo `status.md`; em `pronta` e `concluida` vale o da base — regra A base prevalece do padrão
  `sa-desenvolver/status.md`); produto na pasta abaixo.

> Gerado pela `sa-setup` (Sabiá <x.y.z>) em <AAAA-MM-DD>. Para mudar: "atualizar a configuração do Sabiá".
> As skills e os agentes `sa-*` leem os valores daqui.

## Projeto

| Item | Valor |
|---|---|
| Pasta do produto (`<produto>` nas skills) | `<.sabia/planejamento>` — backlog, épicos e PRDs, planejamento, aprendizado |
| Tipos · stack · módulos | `<batch>` · <Java 21, Spring Batch 5, Oracle> · <módulo único | lista> |
| Toolkits | <nome (origem) | nenhum> |
| Steering | produto `<product.md>` · tecnologia `<tech.md>` · estrutura `<structure.md>` · extras `<… | nenhum>` |
| Glossário · ADRs | `<.sabia/glossario.md>` · `<.sabia/adr | não há>` |
| Bundle do ELM (cópia local em Markdown, baixada pela `sa-sync`) | `<rm.download do pa — ex.: docs/elm/<pa>> | não há` — consulta **só pelo MCP `elm`**: `elm_buscar_req_local` para achar, `elm_ler_req_local` para ler, `elm_listar_req_local` para listar (o MCP acha a pasta pelo `pa` e reindexa o que mudou); sem nada baixado (erro `nao_encontrado` campo `bundle`) → diga isso, pesquise no ELM remoto (`elm_buscar_req`/`elm_ler_req`) e ofereça a `sa-sync`. Nunca leia nem busque os arquivos dela |

**Regras críticas** (BLOQUEANTE na revisão):
- <ex.: escrita em lote sempre idempotente por chave de negócio>

## Comandos (backpressure)

Uma coluna por módulo quando houver mais de um; a fatia usa a do módulo que altera (o `design.md` diz qual).
O passo `sa-codificar.codificar.validar` roda compilar, testes, lint e cobertura de todos os módulos antes
de cada commit.
Na worktree do `sa-orquestrar`: `cd .sabia/local/wt/<ft> && <comando>`. Falha de ambiente → `AMBIENTE`, nunca consertar.

| Ação | `<módulo>` |
|---|---|
| Compilar | `<…>` |
| Testes · teste único (`{alvo}`) | `<…>` · `<…>` |
| Lint · cobertura e gate | `<… | não há>` · `<comando> · <gate | sem gate>` |

## Verificação de aceite

| Item | `<módulo>` |
|---|---|
| Executar · exercitar um cenário | `<comando | job + parâmetros>` · <HTTP | job | browser | carga> |
| Onde verificar · massa de teste | <resposta, banco, log> · `<pasta e convenção>` |
| Ambiente · chamada HTTP | <local | dev — nunca produção> · `<sh .sabia/http.sh — <url> | curl com confirmação | não se aplica>` |

## Git, banco e autonomia

| Item | Valor |
|---|---|
| Branch base · prefixo · commit | `<develop>` · `<feature/>` · `<FT-<nnn> <verbo> <descrição> | Task <id> - …>` |
| Mensagens do fluxo (dentro do padrão acima) | início: `<id> iniciar` (fatia, épico ou item de Sustentação; lote do loop: `FT-031, FT-032 iniciar`) · fatia: `<FT> registrar plano` · `registrar análise do plano <N>` · `registrar aprovação do plano` · `registrar revisão <N>` · `registrar verificação` · `<FT> registrar merge` · tarefa: `<id> <o que a tarefa fez>` · triagem: `backlog: triagem <ids>` · Sustentação: `<ID> concluir` · sprint: `<pai>/Sprint <nn>: <planejar | encaixe | virada | sincronizar com o EWM>` (ex.: `2026/Sprint 03: planejar`) · especificação: `<id> iniciar especificação` · `<id> registrar sessão` · `<id> reabrir especificação` · `<id> registrar pendência de especificação` · `<id> concluir especificação` · PRD: `EP-<nn> aprovar PRD` · `EP-<nn> registrar mudança do PRD` · `[ESP] FT`: `<FT> aprovar especificação` · consolidação (com a ET as-built): `<id> consolidar` |
| PR (merge request) | `<MCP gitlabpr — gitlab_listar_mrs · gitlab_obter_mr · gitlab_criar_mr (origem e destino sempre explícitos) · gitlab_mesclar_mr (merge pelo Dev responsável, com o `sha` aprovado) | entregar título e descrição>` — nunca `gh` nem `glab` |
| Artefatos de produto (pasta do produto, glossário, ADRs, consolidação) | direto na branch base — nunca em branch de fatia; push com o "sim" da pessoa (o agente `sa-produto` não faz push: entrega o comando; o agente do Dev publica ali só os registros de situação da fatia) |
| MCP de banco | `<@servidor/tool | não há>` — **somente leitura** (`SELECT`/`WITH`), exceto os scripts de massa; DDL fora do fluxo |
| Paralelo no loop | `<1>` (máx. 3) — o GATE do plano não se configura: sai da senioridade de quem implementa (passo `sa-plano.plano.gate`) |
| Push e PR no loop | `<perguntar a cada lote (o Kiro confirma cada um) | não — a pessoa abre (o push da base com a iniciada do lote também: o orquestrador entrega o comando e espera a publicação)>` |

## ELM

| Item | Valor |
|---|---|
| Usa ELM | `<sim — .kiro/config/elm/pa_<nome>.json (padrão; outros: …) | não>` — o MCP `elm` lê o `pa`; regras em `references/elm.md` da skill `sabia`; sem o MCP, a escrita vira `ELM pendente` (itens do EWM: nascem no backlog do produto do `pa` — `ccm.backlog` — e mudam de iteração ao entrar na sprint) |
| ET | `<não publica | só as-built | inicial no PRD + as-built>` — só as-built: uma ET por fatia, escrita pelo Dev no PR; inicial no PRD + as-built: também uma ET inicial por épico, no lote do PRD (rubrica P13), e a as-built de cada fatia do épico ligada a ela (padrão `sa-prd/et.md`) |
| Casos de teste | `<CSV | ETM>` — o CT planejado nasce da HF no PRD ou na `[ESP] FT` e é aprovado no GATE da `[ESP]`; a verificação grava no `CT.csv` da fatia a evidência de cada um. CSV: o CT planejado fica no repositório e o `CT.csv` é a entrega, sem ELM pendente; ETM: o CT planejado é publicado na conclusão da `[ESP]`, com os requisitos, e a consolidação o liga ao IB, criando só o CT novo (`elm_criar_ct`; precisa do `qm` no `pa`) |
| REG com dados técnicos | `<não | sim>` — sim: a regra pode ter `## Dados` (tabela e campo na forma original), onde a P9 não vale |
| Telas | `<não | sim>` — sim: antes do PRD, o protótipo aprovado pelo cliente (`sa-especificar.prototipo`, a aprovação num `D-nn`); no lote do PRD, uma EL por tela, lida dele (padrão `sa-prd/el.md`, rubrica P12) |
| Manual no DOORS Next | `<change set, módulo, links restringe, baseline | nada>` |
| Fatia dividida no EWM | `<itens novos como filhos do item original | fecha o original e cria itens novos>` |
| Pontos P/M/G no EWM | `<não | 2 · 3 · 5>` (opcional; o planejamento prevê pela vazão) |
| Critérios de aceite no IB | `<nome do campo em ccm.tipos.ib.campos do pa | descrição>` |
| IB de defeito | `<campo = valor de correção (ex.: Categoria = Correção) | —>` (os demais padrões estão no `pa`) |
| Tarefas (títulos padrão; editáveis à mão) | `[ESP] EP-<nn> Especificação` · `[ESP] FT-<nnn> Especificação` · `[ESP] <EP-nn ou FT-nnn> Revisão <n>` · `[DEV] FT-<nnn> Implementar` · `[REV] FT-<nnn> Revisar` · `[VER] FT-<nnn> Verificar` · `[APR] FT-<nnn> Aprovar plano` · `[APR] FT-<nnn> Aprovar PR` · `<prefixo da categoria> <ID> <pedido>`, filha do IB do item `[<ID>] <pedido>` (ex.: `[ATD] AT-012 <pedido>` sob `[AT-012] <pedido>`) · `[GB] Gerenciamento do backlog` |
| `CT.csv` (colunas na ordem do template do ETM) | `<Tipo=Caso de Teste · Resumo · Responsável · Status=<inicial> · Categoria · Planejado para · Descrição>` |

## Sustentação

O que não vem de épico. No EWM, o IB `Sustentação` (um por produto, no backlog do EWM; nasce com a `[GB]` no fluxo
`inicial` da `sa-planejamento`) é o pai da `[GB]`, do IB `Manutenção` e dos IBs de categoria.

- **Manutenção:** o IB pai das fatias sem épico (trilha padrão ou rápida; `origem` `Manutenção` no `backlog.md`),
  que nasce com a primeira delas. Elas mudam o repositório e seguem o fluxo da fatia: são do Dev e podem ser AFK.
  Não é categoria: não tem prefixo de tarefa, série de ids nem pasta próprios.
- **Categorias** (tabela abaixo): trabalho sem mudança no repositório (mudança de código ou config é fatia da
  Manutenção). Cada item é de uma categoria, com prefixo de tarefa, série de ids e pasta de fichas próprios. No EWM:
  IB `<Categoria>` (filho da Sustentação; nasce com o primeiro item triado dela, como a `### <Categoria>` do
  `backlog.md`) → IB do item `[<ID>] <pedido>` (nasce na triagem; dono = P.O.) → tarefa `<prefixo> <ID> <pedido>`
  (nasce quando o item entra numa sprint; dono = quem faz). Ficha: `<produto>/sustentacao/<pasta>/<ID>-<slug>.md`;
  dado de cliente: `.sabia/local/sustentacao/<pasta>/<ID>/` (fora do git).

Item de categoria (`AT-`, `IM-`, `BD-`, `IN-`, `OP-`, `EX-` e as tarefas deles) não é do agente do Dev nem AFK: a
regra vale pelo tipo de id, não pelo nome Sustentação.

| Categoria | O que cobre | Tarefa | Id | Pasta | Classificação da Tarefa (PA) | Skill |
|---|---|---|---|---|---|---|
| Atendimento | chamado ou pedido do cliente: consulta, extração, explicação, conferência | `[ATD]` | `AT-` | `atendimento` | `<Suporte / Apoio Técnico Especializado>` | `sa-atender` |
| Implantação | preparar e acompanhar a subida de versão: pacote, janela, roteiro, validação pós-implantação | `[IMPL]` | `IM-` | `implantacao` | `<…>` | `sa-executar` |
| Banco de dados | script de correção ou carga de dados, conferência de base, apoio ao DBA | `[BD]` | `BD-` | `banco-de-dados` | `<…>` | `sa-executar` |
| Infra | ambiente, acesso, certificado, fila, servidor, pedido a outra equipe | `[INF]` | `IN-` | `infra` | `<…>` | `sa-executar` |
| Operação | rotina de produção: reprocessar job, acompanhar execução, incidente sem mudança de código | `[OPE]` | `OP-` | `operacao` | `<…>` | `sa-executar` |
| Apoio a outros times | ajuda técnica a outra equipe ou outro produto | `[EXT]` | `EX-` | `outros-times` | `<…>` | `sa-executar` |

## Agentes

| Agente | Skills extras | Oferecidas e recusadas | MCP | Modelo | Subagentes |
|---|---|---|---|---|---|
| `sa-produto` | <…> | <…> | <…> | <padrão> | `sa-pesquisador` |
| `sa-especificador` | <…> | <…> | <…> | <padrão> | `sa-pesquisador`, `sa-revisor` <+ do toolkit> |
| `sa-pesquisador` | <…> | <…> | <…> | <padrão> | — |
| `sa-desenvolvedor` | <…> | <…> | <…> | <padrão> | `sa-pesquisador`, `sa-revisor`, `sa-verificador` <+ do projeto> |
| `sa-revisor` | <…> | <…> | <…> | <padrão> | — |
| `sa-verificador` | <…> | <…> | <…> | <padrão> | — |
| `sa-orquestrador` | <…> | <…> | — | <padrão> | os `sa-*` <+ do projeto> |

## Desvios de toolkit

Num passo do Sabiá que aceita desvio (`sa-codificar.codificar.tarefa`), a skill de um toolkit
assume o trabalho; o Sabiá continua dono da revisão, do GATE, do passo `sa-codificar.codificar.validar` e do commit
(`references/passos.md` da skill `sabia`). O agente dono já tem o desvio no prompt; esta tabela vale na sessão sem
agente.

| Passo | Toolkit | Para | Skill | Agente |
|---|---|---|---|---|
| `sa-codificar.codificar.tarefa` | `<nome>` <versão> | <quando usar> | `<skill>` | <`<agente>` | —> |
<nenhum — sem skill de toolkit com `passo`, ou nenhuma ligada>

## Tipos com skill de toolkit

Num tipo desviável do catálogo (`references/tipos.md` da skill `sabia`), a skill de um toolkit, com o fluxo e o padrão
do tipo (ou só as references dela), escreve o artefato no passo de desvio do tipo (coluna Desviável, ⇢), no padrão OKF do Sabiá; o Sabiá continua
dono do catálogo, do envelope OKF, da revisão e do GATE. O agente dono já tem a linha no prompt; estas tabelas (as que o
gerador imprime) valem na sessão sem agente.

| Tipo | Skill | Fluxo e padrão | Toolkit | Passo de desvio |
|---|---|---|---|---|
| `<sigla>` | `~/.sabia/toolkits/<toolkit>/skills/<skill>/SKILL.md` | `~/.sabia/toolkits/<toolkit>/<fluxo>` <com o padrão `~/.sabia/toolkits/<toolkit>/<padrão>`> <ou — (as references da skill)> | `<nome>` <versão> | `<id do passo>` |
<nenhum — sem toolkit com `tipos`>

Os itens de rubrica do toolkit se somam aos da rubrica do artefato na revisão (nenhum troca um item do Sabiá):

| Item de rubrica | Tipo | Severidade | Verificação | Toolkit |
|---|---|---|---|---|
| `<id>` | `<sigla>` | <BLOQUEANTE · IMPORTANTE · SUGESTÃO> | <verificação> | `<nome>` <versão> |
<nenhum — sem toolkit com `rubricas`>

## Regras aprendidas

Regras de **julgamento** promovidas pela `sa-aprender` (lições em `<produto>/aprendizado/licoes.md`), que grava só
esta seção (fluxo `sa-aprender.promover`, agente `sa-produto`); a `sa-setup` a preserva ao regravar este arquivo. O revisor
as cobra como itens da rubrica; o plano as respeita. Erro mecânico não entra aqui: vira lint, teste, hook ou CI.
Formato: `### R-<nn> · <título> · aplica a: <desenvolvedor | revisor | plano | PRD | todos> · severidade: <BLOQUEANTE | IMPORTANTE>`,
a regra em 1–2 frases imperativas, `- ✅ <certo> · ❌ <errado>`, `- Origem: L-<nnn>`.

<!-- Nenhuma regra promovida ainda. -->
