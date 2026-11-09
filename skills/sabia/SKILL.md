---
name: sabia
description: "Sabiá guide and router for the agent workflow (Kiro and opencode). Use when the person asks how the Sabiá flow works, which skill to use, or makes a request without naming a skill. Covers intake and triage, refinement (shaping with go/kill, three amigos, slicing), sprint planning with WIP limits, development routes (trivial, rápida, complete) with AI supervised, AI autopilot or manual coding, merge request review by a developer other than the author, verification, archive and optional publication to IBM ELM through sa-elm. Routes each request to the right sa-* skill. Use when the user says \"como funciona o Sabiá\", \"qual o fluxo\", \"qual skill eu uso\", \"o que eu faço agora com isso\", \"Sabiá\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "2.1.11"
---

# Sabiá — guia e roteador do fluxo

Alinhar antes e verificar depois. O agente escreve muito código rápido; o que limita o resultado é o alinhamento antes
e a verificação depois. O vigente fica no DOORS quando o projeto tem ELM; sem ELM, fica na especificação vigente do repositório
(OpenSpec: `openspec/specs/`; Kiro: `.kiro/specs/`). Este guia não grava nada: explica e manda cada pedido para a
skill certa (tabela [O que dizer](#o-que-dizer)).

Configuração do projeto: `.sabia/sabia.md` (gerado pela `sa-setup`). Sem ele, comece por "configurar o Sabiá".

**As-built:** as skills são compiladas na pasta do usuário na instalação (`sabia instalar`, no opencode e no Kiro), e
nada é copiado para o projeto. O que o projeto customiza fica em `.sabia/fluxo/` e `.sabia/padrao/` e chega pelo
agente dono do fluxo.

## Fases e papéis

```
captura (qualquer pessoa ou skill) ─► triagem sa-triar.triar
  ├─ épico ───────► sa-refinar.moldar (pitch, go/kill) ─► sa-prd.prd ─► sa-refinar.fatiar
  ├─ fatia · bug ─► sa-refinar.detalhar (ficha: regras · CT-nn · Artefatos afetados [+ elm/]) ─► elegível ─► sa-refinar.ajustar
  └─ sustentação ─► sa-atender.atender
ciclo sa-planejamento (inicial · sprint · review · retrospectiva) · daily sa-status.painel
desenvolvimento sa-desenvolver.iniciar ─► [sa-plano.plano] ─► sa-desenvolver.codificar ─► MR
revisão e aceite sa-verificar.verificar · sa-revisar.mr · [sa-verificar.revisao-humana] ─► sa-desenvolver.encerrar (merge)
  ─► sa-especificar.archive ─► "publicar no DOORS?" sa-elm.publicar
```

Não existe consolidação: o fechamento é o merge, o archive e a publicação.

- **Papéis** são booleanas no `equipe.json`. `desenvolvedor`: puxa item para desenvolvimento e revisa o MR de outro
  autor. `especificador`: aprova os arquivos de `elm/` e publica no ELM. `produto`: decide go/kill, ordena e aprova
  pitch, PRD e ficha. Captura, triagem e revisão humana ficam abertos a qualquer pessoa.
- **Identidade** é o usuário do GitLab: o `usuario` do `equipe.json` é o autor do MR e o `@dono` no CODEOWNERS. O
  `elm_login` é opcional e só a `sa-elm` o lê.
- **Agentes.** A pessoa abre a sessão num dos dois principais: `sa-desenvolvedor` (desenvolvimento, plano, MR, revisão humana,
  Sustentação e archive) ou `sa-especificador` (refinamento, PRD, especificação, entrevista e planejamento; inclui as
  funções de produto). Triagem, status, este guia e as ofertas da `sa-elm` rodam nos dois. Pesquisa, revisão do agente e
  verificação rodam nos subagentes `sa-pesquisador`, `sa-revisor` e `sa-verificador`, de contexto isolado. A
  `sa-setup` e a `sa-elm.setup` rodam na sessão sem agente. A booleana do `equipe.json` continua conferida na
  pré-condição de cada skill.
- **Tipos e ids.** `tipo` ∈ {`épico`, `fatia`, `bug`, `sustentação`}. Séries: épico → `EP-nn`; fatia e bug →
  `FT-nnn`; sustentação → `<categoria>-nnn` (`AT` · `IM` · `BD` · `IN` · `OP` · `EX`). Fatia e bug têm `pai` `EP-nn`
  ou vazio. O próximo id é o maior da série no `backlog.md` + 1, lido depois do pull, e nunca muda: "vira épico" cria
  a linha `EP-nn` com a obs `veio de FT-nnn`, e a FT fica `cancelada · virou EP-nn`.
- **Status.** Fatia e bug: `nova` → `aceita` → `elegivel` → `em-andamento` → `concluida`, mais `cancelada` e `adiada
  até <data>`; `em-revisao` não se grava, vem do MR aberto. Épico: `a-moldar` → `em-especificacao` (go) → `fatiado` →
  `concluido` · `cancelado`; fecha no merge da última fatia aberta (`sa-desenvolver.encerrar`). Sustentação: `nova` →
  `em-andamento` → `concluida` · `cancelada`.
- **Prioridade e tamanho.** `prioridade` ∈ {`crítica`, vazio}: crítica é o expedite, pela política do `acordos.md`;
  vazio segue a ordem das linhas. `tamanho` ∈ {`P`, `M`, `G`}: P = horas, M ≈ 1 dia, G = 2 a 3 dias. Maior que G é
  épico, e só o épico vai ao pitch e ao go/kill.
- **Trilhas.** Quem desenvolve escolhe pelo código: `trivial` (sem arquivo de spec, tudo no MR), `rapida` ou `completo`.
  O formato da spec vem do `formato_spec` do `agentes.json` (Kiro ou OpenSpec). A pasta da spec é `ft-<nnn>-<slug>`.
- **Sustentação.** A categoria é confirmada antes de gravar a triagem e não se recategoriza depois. Quem atende puxa
  dentro da reserva de capacidade reservada. A IA auxilia, e a pessoa declara o item resolvido (`sa-atender.atender`).
- **Estado na branch base.** As linhas do `backlog.md` e do `sprint-<nn>.md` vão num commit pequeno por commit direto na branch base na branch base. Os documentos de planejamento (`pitch.md`, `prd.md`, ficha, arquivos de `elm/`) também vão
  direto na branch base. MR só existe para código.

## Aprovações

| Quem | Aprova | Onde fica |
|---|---|---|
| `produto` (o P.O.) | go/kill, pitch, PRD e ficha | `Aprovado: <usuário> · <data>` no topo do documento; o que está em aberto bloqueia só o que depende dele |
| `especificador` | o arquivo inteiro de cada artefato em `elm/`; publica depois do merge (`sa-elm.publicar`) | `status: stable` e `verified` no frontmatter do arquivo de `elm/` |
| um `desenvolvedor` ≠ autor | o MR (o CODEOWNERS indica o dono), com o CI verde e a evidência do verificador | o MR |
| qualquer pessoa | a revisão humana, conforme o risco (`sa-verificar.revisao-humana`) | o MR |

O autor faz o merge com a aprovação e o CI verde. Não há rebase: a branch se atualiza só por merge da branch base.

## Autonomia

Autonomia de trabalho: IA supervisionada, IA autopilot ou manual, escolhida antes de começar e fixa até o fim daquele
trabalho. Codificação e especificação têm autonomias independentes.

- **Codificação** (ao assumir, na `sa-desenvolver.iniciar`; campo Autonomia do `status.md`): IA supervisionada (o
  `sa-desenvolvedor` na sessão da pessoa), IA autopilot (o `sa-desenvolvedor` como subagente na worktree) ou manual
  (só a geração do código-fonte é da pessoa; `status.md`, branch e plano seguem; no "terminei", o fluxo segue da
  validação, com as mesmas validações).
- **Especificação** (só com ELM, ao detalhar a fatia com artefatos afetados, na `sa-refinar.detalhar`; campo Especificação da
  ficha): IA supervisionada, IA autopilot ou manual (o especificador altera direto no DOORS e avisa "alterei"; a skill
  sincroniza).
- **Autopilot:** o `sa-desenvolvedor` roda como subagente na worktree `.sabia/local/wt/<id>` enquanto a pessoa segue na branch base; várias tarefas podem correr em paralelo. Ficam liberados o push da própria branch (sem `--force`), o merge da branch base nela e abrir ou atualizar o MR dela. Merge do MR, ELM e rede continuam bloqueados. O autopilot leva até o MR,
  que passa pela mesma revisão humana. Não existe lote.
- **Disjuntor:** dispara pelo teto do `acordos.md` ou por 2 reprovações seguidas, grava em `.sabia/local/loop-<id>.md`
  e devolve o item à pessoa.

## Princípios

1. **Alinhar antes de escrever** — até 5 perguntas por rodada, cada uma com recomendação. O agente busca os fatos, e a
   pessoa toma as decisões. Regra de negócio é decisão de uma pessoa.
2. **Cerimônia do tamanho** — pelas trilhas `trivial` · `rapida` · `completo` e pelo tamanho P · M · G.
3. **Fatias verticais** — cada fatia prova algo demonstrável e mantém os artefatos afetados.
4. **Verificação acima de geração** — backpressure em camadas: o trecho tocado a cada alteração e a suíte completa uma
   vez antes do MR, com baseline do CI. A asserção que dura são os testes automatizados, marcados com o `CT-nn`.
5. **Gerador ≠ avaliador** — a revisão do agente pelo `sa-revisor` tem três eixos: spec · padrões · segurança. O aceite é
   do `sa-verificador`, de contexto isolado.
6. **Estado em disco** — o estado vive no `status.md`, no `research.md` e no plano. Na mesma tarefa, segue na mesma
   sessão; para outra tarefa, sugere sessão nova.
7. **Autonomia gradual** — por item, escolhida por quem desenvolve, com disjuntor.
8. **Rastreio leve** — os artefatos afetados ficam na ficha, e o texto completo dos requisitos fica no delta. Com ELM, a pasta `elm/`
   da fatia é a fonte da publicação no DOORS depois do merge, conferindo a versão. Sem ELM, a especificação vigente fica no
   repositório.
9. **Aprendizado composto** — a lição nasce na seção Lições aprendidas do `status.md` ou do registro de Sustentação. Na review do
   ciclo, as escolhidas entram nas Regras aprendidas do `sabia.md`.
10. **Leia o código** — o MR traz o quê, o porquê, a evidência, o risco, o foco e os artefatos afetados. Nada é mergeado sem uma
    aprovação humana.

## O que dizer

Pedido que não nomeia skill → a linha que casa. Couber em duas → pergunte qual é a intenção.

| Quero… | Skill |
|---|---|
| instalar ou atualizar o Sabiá no projeto, os agentes, o formato da spec, "usa ELM?" · customizar ou descustomizar um passo ou padrão | `sa-setup` (`sa-setup.configurar` · `sa-setup.customizar`) |
| onde parei · minha próxima · o estado de `<id>` · pendências (publicação pendente, travas de artefato) · lições aprendidas para a review · fechar a sessão | `sa-status` (`sa-status.painel` · `sa-status.item` · `sa-status.minha-proxima` · `sa-status.pendencias` · `sa-status.licoes-aprendidas` · `sa-status.fechar-sessao`) |
| registrar uma demanda sem triar · triar a fila das linhas `nova` | `sa-triar` (`sa-triar.capturar` · `sa-triar.triar`) |
| ideia nova, pitch, go/kill · refinamento conjunto, ficha, artefatos afetados e `elm/` da fatia · fatiar o épico · editar, dividir ou cancelar um item pronto | `sa-refinar` (`sa-refinar.moldar` · `sa-refinar.detalhar` · `sa-refinar.fatiar` · `sa-refinar.ajustar`) |
| escrever o PRD do épico depois do go, ou mudar o PRD | `sa-prd` (`sa-prd.prd`) |
| os arquivos de `elm/` da fatia · protótipo de tela e aprovação do cliente · ATA de reunião (transcrição em `.sabia/local/reunioes/`) · archive da spec depois do merge | `sa-especificar` (`sa-especificar.elm` · `sa-especificar.prototipo` · `sa-especificar.reuniao` · `sa-especificar.archive`) |
| alinhar decisões em rodadas | `sa-entrevistar` (`sa-entrevistar.entrevistar`) |
| planejamento inicial (`equipe.json`, `acordos.md`) · planejar a sprint, reabastecer, virada · review com curadoria das Regras aprendidas · retrospectiva | `sa-planejamento` (`sa-planejamento.inicial` · `sa-planejamento.sprint` · `sa-planejamento.review` · `sa-planejamento.retrospectiva`) |
| puxar, começar ou retomar, com trilha e autonomia · implementar e abrir o MR · mergear e fechar | `sa-desenvolver` (`sa-desenvolver.iniciar` · `sa-desenvolver.codificar` · `sa-desenvolver.encerrar`); autopilot é uma autonomia da `sa-desenvolver` |
| entender o código e devolver fatos, sem gravar | `sa-pesquisar` (`sa-pesquisar.pesquisar`) |
| `research.md`, design e tasks da fatia, com o texto aprovado copiado para o delta · replanejar | `sa-plano` (`sa-plano.plano` · `sa-plano.replanejar`) |
| revisão do agente ou revisão do plano · revisar o MR de outro autor | `sa-revisar` (`sa-revisar.revisar` · `sa-revisar.mr`) |
| aceite de ponta a ponta, com a evidência no MR e o `CT.csv` · revisão humana | `sa-verificar` (`sa-verificar.verificar` · `sa-verificar.revisao-humana`) |
| atender um item de Sustentação (`AT` · `IM` · `BD` · `IN` · `OP` · `EX`) | `sa-atender` (`sa-atender.atender`) |
| criar o item ou a tarefa no ELM · finalizar ou cancelar a tarefa · lançar horas e relatórios · publicar no DOORS · bundle ou original de um requisito · visualização · "confere com o EWM" e "o DOORS mudou?" · importar do EWM · iteração · lint · configurar o ELM | `sa-elm` (`sa-elm.item` · `sa-elm.finalizar` · `sa-elm.horas` · `sa-elm.publicar` · `sa-elm.baixar` · `sa-elm.visualizar` · `sa-elm.conferir` · `sa-elm.importar-backlog` · `sa-elm.iteracao` · `sa-elm.lint` · `sa-elm.setup`) |
| explicar o fluxo, as fases, os papéis e as regras | `sabia` (este guia) |

## Onde as coisas moram

| Caminho | O quê |
|---|---|
| `.sabia/sabia.md` | Resumo do fluxo · Projeto · Especificação · Comandos · Verificação de aceite · Sustentação · ELM · Desvios de toolkit · Tipos com skill de toolkit · Regras aprendidas (gravadas pela curadoria da review) |
| `.sabia/config/` | `agentes.json` (as escolhas do projeto e a entrada do gerador), `elm/pa_<nome>.json` (da `sa-elm.setup`) e `elk/elk-<ambiente>.json` |
| `.kiro/agents/` · `.opencode/agents/` | os 5 agentes gerados (e os de toolkit) |
| `.sabia/planejamento/` | `backlog.md` (id · título · tipo · status · prioridade · tamanho · responsável · pai · relator · ib · obs · aceita_em · iniciada_em · concluida_em), `acordos.md`, `equipe.json`, `roadmap.md`, `sprints/<AAAA>/sprint-<nn>.md` (Item · Trabalho · Responsável · Tarefas), `fatias/FT-<nnn>-<slug>.md`, `epicos/EP-nn-<slug>/` (`pitch.md`; `prd.md` a partir do go), `prototipos/`, `atas/`, `sustentacao/<pasta>/` |
| spec da fatia | `.kiro/specs/ft-<nnn>-<slug>/` ou `openspec/changes/ft-<nnn>-<slug>/`: `status.md`, `research.md`, os arquivos da trilha, `CT.csv` e, com ELM, `elm/`. No OpenSpec, a arquivada fica em `openspec/changes/archive/<AAAA-MM-DD>-ft-<nnn>-<slug>/` |
| glossário · ADRs · bundle | GL no DOORS, onde há ELM; o `.sabia/glossario.md` é opcional. ADRs em `docs/adr/`, só para decisão que atravessa fatias. O bundle (chave `elm.bundle` do `agentes.json`, ex.: `docs/elm/<pa>/`) é cópia local e nunca é editado |
| `.sabia/creditos/` | `<usuario>.csv` com os créditos do Kiro por sessão |
| `.sabia/fluxo/` · `.sabia/padrao/` | override esparso do projeto, pela `sa-setup.customizar`; nenhum agente escreve |
| `.sabia/local/` (fora do git) | worktrees do autopilot (`wt/<id>`), `loop-<id>.md`, `reunioes/` e dados de cliente |

## Tipos de artefato

O catálogo é fechado ([references/tipos.md](references/tipos.md)): HF · UC · REG · MSG · EL · GL · ET · CT · ATA. O
padrão de cada tipo é `requisitos/padrao-<tipo>.md`; a cópia do projeto em `.sabia/padrao/requisitos/` vale sobre ele. Artefato
existente: `<sigla>-<id do ELM>`. Novo: `<sigla>-<EP|FT>-nn`, provisório até a publicação; sem ELM, esse é o id
definitivo.

| Tipo | Onde nasce |
|---|---|
| HF · UC · REG · MSG · EL · GL | o texto completo dos requisitos tocados vai no delta da spec; com ELM, também em `elm/` da fatia, um arquivo por artefato, criado no refinamento (`sa-refinar.detalhar`). EL só com Telas = sim; UC só com Casos de uso = sim |
| ET | só as-built, publicada na finalização do desenvolvimento, nos projetos que mantêm ET |
| CT | cenários `CT-nn` na ficha; o `CT.csv` é escrito só pela `sa-verificar.verificar` (pela skill do toolkit, quando o CT desvia), e cada linha liga ao `CT-nn` marcado no teste automatizado |
| ATA | opcional, pela `sa-especificar.reuniao`; a decisão vale com quem e quando |

Um toolkit não cria tipo; num tipo desviável (⇢), a skill dele escreve o artefato
([references/passos.md](references/passos.md#tipos-com-skill-de-toolkit)).

## Fronteiras de fase

- Toda skill termina oferecendo "seguir para a próxima?" na mesma sessão, quando é a mesma tarefa. Para outra tarefa,
  sugere sessão nova.
- Nunca compactar no meio de uma fase.
- Mandar um item para o autopilot é decisão de quem desenvolve, ao assumir a tarefa (`sa-desenvolver.iniciar`), e vale
  até o fim dela.

## Regras de ouro

- **Falha de escrita:** nunca seguir como se tivesse gravado. Se a gravação falhar, diga o caminho e o que faltou e
  pare a fase.
- **Nada inventado:** tabela, coluna, regra e id se confirmam no código, no banco (só leitura) ou no ELM. Regra de
  negócio é decisão de uma pessoa, registrada com quem e quando.
- **Sim da pessoa:** push, merge, `curl`, `wget`, escrita no GitLab e escrita no ELM passam pelo ask dos principais
  `sa-desenvolvedor` e `sa-especificador`; nos subagentes e no autopilot, o que não é liberado é deny. `rebase`,
  `--force`, `--force-with-lease`, `reset --hard` e `--no-verify` ficam em deny.
- **Gravar na branch base:** estado e documentos de planejamento vão pelo commit direto na branch base. O código vai por MR, na
  branch `<id>`, atualizada só por merge da branch base.
- **MCPs:** o MR só pelo `gitlabpr`, nunca pelo `gh` nem pelo `glab`. O ELM só pelo MCP `elm`, e toda escrita no ELM
  passa pela `sa-elm`. Busca do vigente: specs arquivadas → bundle → ELM ao vivo.
- **Dado de cliente** nunca vai para o git: fica em `.sabia/local/`. O agente não executa em ambiente de cliente nem
  responde ao cliente.

## Desvios de toolkit

Toolkit de apoio, de passo e de tipo, lidos do `agentes.json` e aplicados pelo gerador no prompt do agente dono do
passo: [references/passos.md](references/passos.md).
