# Sabiá

> *A IA levanta voo. O Sabiá garante o pouso.*

O agente escreve muito código e rápido. O que limita o resultado é o alinhamento antes e a verificação depois. O Sabiá
conduz cada demanda por sete disciplinas — triagem, refinamento, planejamento, especificação, desenvolvimento,
revisão e aceite, sustentação — com Kanban e WIP, Shape Up no épico, três amigos na fatia, TDD e MR revisado por
outro desenvolvedor. Do Sabiá fica só o que dá produtividade ou preserva o rastreio de requisitos; o resto segue o
mercado. Com IBM ELM, o DOORS Next é o registro oficial; sem ELM, a spec viva fica no repositório.

Desenvolvido por Daniel Xavier Araújo.

```
demanda ─► captura (fluxo/captura.md; entrada direta sa-triar.capturar)   tipo ∈ épico · fatia · bug · sustentação
   └─► TRIAGEM ───────── sa-triar.triar                                    (qualquer pessoa)
        ├─ épico ──────► REFINAMENTO sa-refinar.moldar: pitch.md ─► go/kill (produto)
        │                  └─ go ─► ESPECIFICAÇÃO sa-prd.prd: prd.md aprovado ─► sa-refinar.fatiar ─► FT-nnn
        ├─ fatia · bug ► REFINAMENTO sa-refinar.detalhar: ficha (regras · CT-nn · Cobre) [+ elm/] ─► pronta
        │                  └─ sa-refinar.ajustar até alguém puxar
        └─ sustentação ► SUSTENTAÇÃO sa-atender.atender (AT · IM · BD · IN · OP · EX, dentro da folga)

PLANEJAMENTO ─────── sa-planejamento.inicial · .sprint · .review · .retrospectiva · inspeção diária sa-status.painel
DESENVOLVIMENTO ──── sa-desenvolver.iniciar ─► [sa-plano.plano] ─► sa-desenvolver.codificar ─► MR
                     rota: trivial · quick · completo       modo: IA supervisionada · IA autopilot · manual
REVISÃO E ACEITE ─── sa-verificar.verificar · sa-revisar.mr (desenvolvedor ≠ autor) · [sa-verificar.uat]
                     └─► sa-desenvolver.encerrar (merge) ─► sa-especificar.archive ─► [sa-elm.publicar]

estado (backlog.md · sprint-<nn>.md) e documentos (pitch · prd · ficha · elm/): commit pequeno direto na base
MR: só para código, com o delta da spec, o design e as tasks
ELM (borda, só com ELM configurado): sa-elm — a skill do trabalho oferece e nunca trava
```

**Mapa interativo do fluxo:** <https://dxaraujo.github.io/sabia/> — cada trilha é uma linha de metrô e cada skill uma
estação; a ficha ao lado mostra papel, agente, arquivos, chamadas ao ELM e as transições de cada passo. Fonte: branch
`gh-pages` deste repositório.

## Fundamentos

| # | Princípio | Quem defende |
|---|---|---|
| 1 | Alinhar antes de escrever: entrevista em rodadas, com resposta recomendada; fatos o agente busca, decisões a pessoa toma | Matt Pocock (`grilling`), Anthropic (entrevista → spec), Dex Horthy (QRSPI), Andrej Karpathy (modelos não pedem esclarecimento) |
| 2 | Cerimônia do tamanho do trabalho | Birgitta Böckeler ("marreta para quebrar noz"), Anthropic ("se o diff cabe numa frase, pule o plano"), Horthy (~40% *oneshot*), Spec Kit |
| 3 | Spec é registro de decisão, sem caminho de arquivo; o que dura é glossário, ADR e — aqui — o ELM ou a spec viva | Pocock (`to-spec`), Böckeler (*spec-anchored*), Kent Beck e Martin Fowler (aprender durante a implementação) |
| 4 | Linguagem ubíqua num glossário usado no PRD, nos testes e no código | Pocock (`domain-modeling`), DDD |
| 5 | Fatias verticais (*tracer bullets*) que cabem numa janela de contexto nova, com critérios falsificáveis | Pocock (`to-tickets`), Horthy ("modelos amam planos horizontais"), Anthropic (uma funcionalidade por vez), Geoffrey Huntley (um item por loop) |
| 6 | Pesquisar → planejar → implementar, com compactação em arquivo e revisão humana do plano | Horthy (*Advanced Context Engineering*), Boris Cherny (comece no plan mode) |
| 7 | Desenhar a forma do programa antes do código (árvore de arquivos, assinaturas, árvore de chamadas) | Horthy (*Why Software Factories Fail*, 2026), Pocock (módulos profundos) |
| 8 | Teste primeiro, vermelho → verde, nos pontos de teste combinados | Beck, Simon Willison (*red/green TDD*), Karpathy ("dê critérios de sucesso, peça os testes primeiro"), Pocock (`tdd`) |
| 9 | Backpressure: compilar, testes e lint a cada passo; evidência em vez de afirmação | Huntley, Anthropic, Cherny ("dê ao agente como verificar o trabalho"), Willison ("first run the tests") |
| 10 | Proteger o oráculo: teste não se apaga nem se afrouxa | Anthropic (*long-running harnesses*), Beck ("o gênio trapaceando"), Karpathy (`autoresearch`) |
| 11 | Gerador ≠ avaliador; revisão em contexto limpo e em eixos separados; avaliador cético mas sem caçar gosto | Anthropic (*harness design*), Pocock (`code-review`), Cherny |
| 12 | Contexto limpo por fatia e estado em disco | Horthy (zona burra acima de ~40%), Pocock (*smart zone*), Huntley, Anthropic (*context engineering*) |
| 13 | Slider de autonomia: IA supervisionada, IA autopilot ou manual, escolhido por item por quem desenvolve; WIP limitado pela revisão humana | Karpathy ("Iron Man suits"), Pocock (AFK/HITL), Addy Osmani (*orchestration tax*), DORA 2025 |
| 14 | Leia o código: MRs pequenos, com caminho de leitura e evidência | Horthy ("read the dang code"), Willison, Osmani (*comprehension debt*), Thoughtworks Radar vol. 34 |
| 15 | Aprendizado composto: cada correção muda o ambiente — checagem determinística primeiro | Mitchell Hashimoto (*engineer the harness*), Cherny, Pocock (`retro`), Fowler (*guides & sensors*) |
| 16 | Conhecimento mantido por LLM, com *lint* de contradições | Karpathy (*LLM Wiki*) — aqui, o bundle do ELM + glossário + ADRs |
| 17 | Harness mínimo, revisto a cada modelo; segurança sem a "tríade letal" | Anthropic, Fowler (*Are Harnesses Worth the Cost?*), Willison |

Fontes no fim deste arquivo.

## Skills

| Skill | Fluxos | Função |
|---|---|---|
| `sabia` | — | guia e roteador: disciplinas, papéis, aprovações, autonomia e qual skill usar |
| `sa-setup` | `configurar` · `customizar` | configura o projeto na sessão padrão: alvos, comandos, base, formato da spec, "usa ELM?", toolkits e os 5 agentes; customiza um passo ou padrão |
| `sa-status` | `painel` · `item` · `minha-proxima` · `pendencias` · `licoes` · `fechar-sessao` | painel só leitura (WIP, vazão, idade, lead time, pendências de rastreio), estado de um `<id>`, a próxima tarefa e os créditos da sessão |
| `sa-triar` | `capturar` · `triar` | captura sem triar e triagem da fila `nova`: duplicado, falta informação, adiar, cancelar, aceitar |
| `sa-refinar` | `moldar` · `detalhar` · `fatiar` · `ajustar` | pitch e go/kill do épico; três amigos da fatia (ficha com regras, `CT-nn` e Cobre, e `elm/` com ELM); fatiamento do PRD; ajuste do item pronto |
| `sa-prd` | `prd` · `mudanca` | PRD do épico depois do go, aprovado pelo produto no próprio documento |
| `sa-especificar` | `elm` · `prototipo` · `reuniao` · `archive` | arquivos de `elm/` da fatia, protótipo de tela, ATA de reunião e archive da spec depois do merge |
| `sa-entrevistar` | `entrevistar` | alinhamento em rodadas de até 5 perguntas, cada uma com recomendação |
| `sa-desenvolver` | `iniciar` · `codificar` · `encerrar` | assume a tarefa num passo (tamanho, rota e modo), codifica com TDD e backpressure até o MR, faz o merge e fecha |
| `sa-plano` | `plano` · `replanejar` | `research.md`, design e tasks; copia o texto aprovado para o delta sem reescrever |
| `sa-pesquisar` | `pesquisar` | pesquisa neutra e só leitura no `sa-pesquisador`; devolve fatos com arquivo:linha |
| `sa-revisar` | `revisar` · `mr` | autorrevisão independente (rubrica L do plano, C do código) e revisão do MR de outro autor |
| `sa-verificar` | `verificar` · `uat` | aceite de ponta a ponta com a evidência no MR e o `CT.csv`; UAT por risco |
| `sa-atender` | `atender` | Sustentação: um fluxo para as seis categorias |
| `sa-elm` | `regras` · `setup` · `item` · `finalizar` · `horas` · `importar-backlog` · `publicar` · `iteracao` · `conferir` · `lint` · `baixar` · `visualizar` | tudo o que fala com o IBM ELM (DOORS Next e EWM) |

Arquivos comuns em [`fluxo/`](fluxo/): `entrada.md` (pré-condição do papel e da branch), `captura.md` (o único
mecanismo de captura, que grava o tipo), `gravar-na-base.md` (commit pequeno de estado direto na base),
`travas.json` e `tipos.json` (catálogo fechado de artefatos). Padrões dos documentos em [`padrao/`](padrao/).

## Agentes

Cinco agentes por função, gerados pela `sa-setup` a partir do
[`perfis.json`](skills/sa-setup/assets/agents/perfis.json) e do `.sabia/config/agentes.json` do projeto, em
`.kiro/agents/sa-<nome>.json` e `.opencode/agents/sa-<nome>.md`. Nunca se editam à mão.

```
primários (a pessoa escolhe ao abrir a sessão; a pré-condição de cada skill confere a booleana do equipe.json)
├─ sa-desenvolvedor   build · sa-desenvolver · sa-plano · sa-revisar.mr · sa-verificar.uat · sa-atender · sa-especificar.archive
│    chama sa-pesquisador · sa-revisor · sa-verificador · ele mesmo no autopilot
├─ sa-especificador   build · sa-refinar · sa-prd · sa-especificar · sa-entrevistar · sa-planejamento (inclui o produto)
│    chama sa-pesquisador
└─ nos dois: sa-triar · sa-status · sabia · ofertas da sa-elm
subagentes (contexto limpo)
├─ sa-pesquisador     só leitura ── sa-pesquisar
├─ sa-revisor         só leitura ── sa-revisar.revisar + rubricas do toolkit + Regras aprendidas
└─ sa-verificador     só leitura + Executar do sabia.md, curl/wget só à URL de teste e o CT.csv ── sa-verificar.verificar
sessão padrão: sa-setup e sa-elm.setup (as únicas que gravam o harness)
```

| Modelo | Ler | Editar | Comandos | MCP |
|---|---|---|---|---|
| `build` | tudo, menos segredos (`.env*`, `*.pem`, `*.key`, `~/.ssh`, `~/.aws`, `~/.config/mcp-*`) | tudo, menos o harness: `.kiro/agents`, `.kiro/settings`, `.kiro/steering/sabia.md`, `.opencode`, `opencode.json`, `.sabia/config`, `.sabia/fluxo`, `.sabia/padrao` | allow; ask: `git push`, `git merge`, `curl`, `wget`; deny: `rebase`, `--force`, `reset --hard`, `clean -f`, `--no-verify`, `sudo`, `kubectl`, `helm`, `terraform apply` | GitLab: leitura allow, abrir e mesclar MR ask; ELM pelas regras da `sa-elm.setup` |
| `leitura` | tudo, menos segredos | deny | só leitura (`git status/diff/log/show`, `grep`, `ls`) | só leitura |

No Kiro, os agentes levam só os nomes de capability; os limites por caminho e URL vão no prompt. Detalhes em
[`skills/sa-setup/references/agentes.md`](skills/sa-setup/references/agentes.md).

## Modos de trabalho

IA supervisionada · IA autopilot · manual, escolhido antes de começar e fixo até o fim daquele trabalho.
Especificação e codificação têm modos independentes.

| | IA supervisionada | IA autopilot | manual |
|---|---|---|---|
| **Codificação** (`sa-desenvolver.iniciar`; campo Autonomia do `status.md`) | o `sa-desenvolvedor` na sessão da pessoa | o `sa-desenvolvedor` como subagente na worktree `.sabia/local/wt/<id>`; a pessoa segue na base e pode puxar outro item | só a geração do código-fonte é da pessoa; no "terminei", o fluxo segue da validação com as mesmas checagens |
| **Especificação** (só com ELM; `sa-refinar.detalhar`; campo Especificação da ficha) | o `sa-especificador` edita o arquivo inteiro de `elm/` com o especificador | o `sa-especificador` como subagente edita sem perguntas; o que não tem fonte vai ao Em aberto, e o especificador aprova | o especificador altera direto no DOORS e avisa "alterei"; a skill sincroniza `elm/`, o Cobre e o delta |

No autopilot ficam liberados o push da própria branch (sem `--force`), o merge da base nela e abrir ou atualizar o
MR dela; merge do MR, ELM e rede seguem bloqueados. O disjuntor (teto do `acordos.md` ou 2 reprovações seguidas)
grava `.sabia/local/loop-<id>.md` e devolve o item à pessoa. O MR passa pela mesma revisão humana.

## Spec da fatia

O formato é decidido por projeto na `sa-setup`: alvo Kiro → Kiro, sem perguntar; só opencode → pergunta Kiro ou
OpenSpec. Fica em `formato_spec` no `agentes.json` e na seção Especificação do `sabia.md`. A pasta é
`.kiro/specs/ft-<nnn>-<slug>/` ou `openspec/changes/ft-<nnn>-<slug>/`.

| Rota | Kiro | OpenSpec |
|---|---|---|
| `trivial` | nenhum arquivo de spec; tudo no MR | idem |
| `quick` fatia | Quick Spec: `requirements.md`, `design.md`, `tasks.md` | `proposal.md` + delta + `tasks.md` |
| `quick` bug | Bugfix Spec: `bugfix.md`, `design.md`, `tasks.md` | `proposal.md` + delta MODIFIED + `tasks.md` |
| `completo` | `requirements.md` → `design.md` → `tasks.md`, com "quer revisar agora?" | `proposal.md` + delta + `design.md` + `tasks.md` |

Quick e completo têm também `research.md`, `status.md` e `CT.csv`. O delta traz sempre o texto completo dos
requisitos tocados (OpenSpec: ADDED/MODIFIED/REMOVED; Kiro: o bloco completo de cada requisito). Depois do merge, o
archive: sem ELM, o OpenSpec funde o delta na spec viva (`openspec/specs/`) e, no Kiro, o vigente são as specs em
`.kiro/specs/`; com ELM, a `sa-elm.publicar` sobe os arquivos de `elm/` ao DOORS conferindo a versão lida, ou o
archive grava "Publicação: pendente" para o especificador.

## O que a setup instala no projeto

O power do Kiro (Agent Plugins, `plugin.json`) carrega só `skills/` e `mcp.json`; steering e agentes dentro de um
power são ignorados. Por isso a `sa-setup` grava no projeto, a partir de `skills/sa-setup/assets/`:

| Arquivo | O quê |
|---|---|
| `.sabia/sabia.md` (e o ponteiro `.kiro/steering/sabia.md` ou a entrada no `opencode.json`) | o steering do fluxo: resumo, Projeto, Especificação, Comandos, Verificação de aceite, Sustentação, ELM, Desvios de toolkit, Tipos com skill de toolkit e Regras aprendidas |
| `.sabia/config/agentes.json` | as escolhas do projeto (alvos, `formato_spec`, pasta do produto, base, prefixo da branch, ELM, toolkits, desvios e extras por agente) — a entrada do gerador |
| `.sabia/config/elm/pa_<nome>.json` · `.sabia/config/elk/elk-<ambiente>.json` | a project area do ELM (da `sa-elm.setup`) e a configuração do ELK |
| `.kiro/agents/sa-*.json` · `.opencode/agents/sa-*.md` | os 5 agentes (e os de toolkit), gerados pelo `gerar_agentes.py` |
| `.sabia/fluxo/` · `.sabia/padrao/` (só ao customizar) | override esparso de um passo ou padrão; nenhum agente escreve |
| pasta do produto (padrão `.sabia/planejamento`) | `backlog.md`, `equipe.json`, `acordos.md`, `roadmap.md`, `sprints/<AAAA>/sprint-<nn>.md`, `fatias/`, `epicos/EP-nn-<slug>/` (`pitch.md`, `prd.md`), `prototipos/`, `atas/`, `sustentacao/` — versionada |
| `.sabia/creditos/<usuario>.csv` | créditos do Kiro por sessão, gravados pela `sa-status.fechar-sessao` |
| `.sabia/local/` (fora do git) | worktrees do autopilot, `loop-<id>.md`, transcrições e dados de cliente |

## Toolkits

O fluxo não sabe programar em nenhuma stack: o conhecimento de Java, Spring Batch, Angular, React etc. vem de
**toolkits** — pacotes de skills mantidos fora do power, um por tipo de projeto ou stack. A `sa-setup` os procura
(`.sabia/toolkits/`, `~/.sabia/toolkits/`, powers instalados com `toolkit.json`, ou skills com `metadata.toolkit`),
detecta o tipo do projeto e **propõe, agente por agente**, as skills a ligar.

| Campo do `toolkit.json` | Vai para |
|---|---|
| `skills[].papeis` · `steering[].papeis` | 1:1: `desenvolvedor` → `sa-desenvolvedor` · `especificador` e `produto` → `sa-especificador` · `pesquisador` → `sa-pesquisador` · `revisor` → `sa-revisor` · `verificador` → `sa-verificador` |
| `skills[].passo` | desvio de um passo do Sabiá pelo id; hoje a tarefa da codificação, `sa-desenvolver.codificar.tarefa`, no prompt do agente dono |
| `tipos` | a skill que escreve um tipo desviável do catálogo: `HF`, `UC`, `REG`, `MSG`, `EL` e `ATA` → `sa-especificador`; `ET` as-built → `sa-desenvolvedor`; `CT` (linhas do `CT.csv`) → `sa-verificador` |
| `rubricas` | itens que se somam à revisão do `sa-revisor` |
| `verificacao` | texto de apoio ao `sa-verificador` |
| `agentes[]` | subagente do dono do passo, com as permissões dele |
| `requer` | versão mínima do Sabiá (`{"sabia": ">=2.1"}`) |

Fluxo com passos é só do framework: o Sabiá não compila conteúdo de toolkit, e o toolkit não troca padrão do núcleo.
Contrato em [`skills/sa-setup/references/toolkits.md`](skills/sa-setup/references/toolkits.md) e schema em
[`toolkit.schema.json`](skills/sa-setup/assets/toolkit.schema.json).

## IBM ELM

Opcional. Tudo o que fala com o ELM é da `sa-elm`; as outras skills só oferecem e nunca param o fluxo por causa dele.
Sem ELM configurado, nenhuma oferta aparece.

| Momento | Fluxo | O quê |
|---|---|---|
| setup | `sa-elm.setup` | produz o `pa`, a chave `elm` do `agentes.json`, a seção ELM do `sabia.md` e as regras dos agentes; a `sa-setup` aplica |
| assumir · horas · concluir | `sa-elm.item` · `sa-elm.horas` · `sa-elm.finalizar` | o IB e a tarefa `DEV` · `ESP` · `ATD` no EWM; horas só por pergunta ou pedido |
| refinamento | `sa-elm.baixar` | o original do DOORS em `elm/` da fatia, com o commit de base (original + versão lida) |
| depois do merge | `sa-elm.publicar` | do especificador: confere a versão de cada artefato (mudou → avisa e pula), cria os novos e troca o id provisório pelo do ELM |
| a pedido | `sa-elm.importar-backlog` · `iteracao` · `conferir` · `lint` · `visualizar` | importar do EWM, iteração, "o DOORS mudou?", lint do bundle e visualização offline |

Catálogo fechado de artefatos em [`fluxo/tipos.json`](fluxo/tipos.json): `HF` história, `REG` regra, `EL` leiaute
(só com Telas = sim), `GL` termo, `ET` especificação técnica (só as-built), `CT` caso de teste (cenários `CT-nn` na
ficha; o `CT.csv` da verificação) e `ATA`. Artefato novo: id provisório `<sigla>-<EP|FT>-nn` até a publicação. O MCP
`mcp-elm` lê o `pa` em `.sabia/config/elm/`; tools, retornos e erros em
[`skills/sa-elm/references/mcp.md`](skills/sa-elm/references/mcp.md).

## Pré-requisitos

- Uma das ferramentas: Kiro IDE 1.x ou Kiro CLI 2.32+ no motor V3 (`--agent-engine v3`, obrigatório; na V2 o agente
  dá "Mode not found") ou opencode; repositório git no GitLab, com a base aceitando push (ex.: `develop`); e `uv`
  para os scripts da setup e da `sa-status`. No opencode, a proteção por agente é menor que no Kiro: o gerador lista
  o que não tem tradução.
- Kiro Web não lê `~/.kiro`: os agentes do projeto aparecem lá, mas sem as skills do power — use a IDE ou o CLI.
- MCPs do próprio power (o `mcp.json` os sobe com `uvx`): [`mcp-gitlabpr`](https://pypi.org/project/mcp-gitlabpr/),
  que lista, lê, abre e mescla os MRs — credencial em `~/.config/mcp-gitlabpr/gitlabpr.properties` (`url` e
  `token`); sem ela, o fluxo entrega título e descrição do MR, e a pessoa o abre;
  [`mcp-elm`](https://pypi.org/project/mcp-elm/), que também consulta o bundle local; e
  [`mcp-elk`](https://pypi.org/project/mcp-elk/), que consulta logs no ELK. O código e os schemas públicos (como o
  [`pa.schema.json`](https://dxaraujo.github.io/mcps/elm/pa.schema.json)) estão em
  [`dxaraujo/mcps`](https://github.com/dxaraujo/mcps).
- Opcional: IBM ELM — credencial em `~/.config/mcp-elm/elm.properties` e o `pa` gerado pela `sa-elm.setup`; MCP de
  consulta ao banco (somente leitura); MCP de browser/Playwright para verificar frontend.
- Toolkits da stack do projeto (opcional — sem eles os agentes dependem do steering e do código vizinho).

## Primeiros passos

1. Instale com o CLI (Node 18+): **`npx sabia instalar`**. Ele baixa o Sabiá para `~/.sabia/framework/`,
   pergunta as ferramentas do time (Kiro, opencode), **compila** as skills (fluxos, padrões e skills do framework) em
   `~/.sabia/compilado/<alvo>/` e as instala na pasta do usuário — no Kiro, o power (`kiro-cli powers install`); no
   opencode, as skills em `~/.config/opencode/skills/` e os MCPs do `mcp.json` —, registrando
   tudo em `~/.sabia/inventario.json`. Nada vai para o projeto. Depois: `sabia atualizar` (recompila), `sabia desinstalar` e `sabia toolkits
   [listar|instalar|atualizar|remover]` (`npm i -g sabia` deixa o comando `sabia`; `npx sabia` mostra todos; o que
   falta na linha de comando vira pergunta no terminal, e `-y` responde sem perguntas, em script ou CI). Instale pelo CLI, não pelo painel **Powers** a partir deste repositório: as skills do repositório são a
   fonte, e o que roda é a compilação. Para ver por onde um arquivo passa (o passo com desvio, o dono, o toolkit e as
   travas): `sabia rota <arquivo>`, ou `sabia rota <spec>/tasks.md#2.1` (pelos arquivos que a tarefa cita; sem casar,
   mostra o texto dela e os `para` dos desvios); o fluxo resolvido no projeto (tabela, grafo ASCII e Mermaid):
   `sabia rota --fluxo <skill.fluxo>`.
2. No projeto, na sessão padrão, peça **"configurar o Sabiá"** e confirme as propostas (os padrões vêm marcados; uma
   confirmação por bloco).
3. Abra a sessão no `sa-especificador` ou no `sa-desenvolvedor` e comece: **"nova demanda: …"** (a `sa-triar`
   registra e tria), **"minha próxima tarefa"** ou **"onde está a FT-031?"** (a `sa-status` mostra o estado e oferece
   seguir), **"puxar a FT-031"** (a `sa-desenvolver.iniciar` assume a tarefa) — ou **"onde parei?"**.

Depois de atualizar o power ou um toolkit, peça "atualizar os agentes do Sabiá".

Não use o `/upgrade-agent` (nem `kiro-cli agent upgrade`) nos agentes `sa-*`: quem os gera é o script da setup
("atualizar os agentes do Sabiá").

## Como foi verificado

**Documentação oficial do Kiro**, lida inteira nas páginas `.md` de `kiro.dev/docs` em 14/10/2026 (powers, skills,
steering, custom agents e referência de configuração, subagentes, permissões, hooks, specs, workflows, CLI V3 e
migração), mais o schema do `plugin.json` (Agent Plugins) e a especificação Agent Skills.

Com o **Kiro CLI**: `kiro-cli powers install <pasta>` instala o power em `~/.kiro/powers/installed/sabia/`, com todas
as skills, `references/` e `assets/`; o formato `.md` de agente não é carregado pela engine V2, por isso os agentes
do Kiro são JSON; padrões de comando encadeado (`cd … && …`) são descartados pelo `kiro-cli agent upgrade`, por isso
as permissões usam comandos simples.

**Prova do núcleo**, só com fixtures sintéticas (`node --test` em `cli/` e `python3 -m unittest` em
`skills/sa-setup/scripts/`): o framework deste repositório validado, compilado e instalado no Kiro e no opencode, com
o grafo de cada fluxo igual ao do mestre e todo link da saída resolvido; um projeto front+back com um toolkit de
especificação (HF ⇢ a skill dele, com o fluxo e o padrão do tipo) e um passo do Sabiá trocado no projeto; e um
projeto batch com o desvio da tarefa de job ao agente do toolkit. Nos dois, os 5 agentes são gerados pelo
`gerar_agentes.py` sobre a instalação, e a `sabia rota` mostra o desvio e a origem de cada passo.

**A conferir num Kiro e num opencode reais:** o `.config.kiro` da pasta da spec em cada rota; se os subagentes
`sa-pesquisador`, `sa-revisor` e `sa-verificador` exigem declaração própria; se o `sa-desenvolvedor` roda como
subagente no autopilot (no opencode, se precisa de `mode: all`); e EARS em português no Analyze Requirements.

## Limitações conhecidas e próxima versão

- **Não verificado numa PA real:** os tipos de artefato do DOORS Next para a `ATA` (Reunião) e a `EL` (Leiaute) — o
  nome, o `OT_` e os atributos obrigatórios de cada um (`elm_setup_descobrir`).
- **A construir:** o MCP do Jenkins (resultado do pipeline no codificar e na revisão do MR); o `sabia validar-spec`
  (forma e ligações da spec nos dois formatos); a busca da configuração do `mcp-elm` e do `mcp-elk` em
  `.sabia/config/<mcp>`.
- **Próxima versão:** o ELM como toolkit; toolkits oficiais (backend Java/Spring, Spring Batch, frontend
  Angular/React); e — quando o MCP do ELM suportar — atributos de requisito, links entre requisitos, módulos, change
  sets e baselines automáticos.

## Fontes (consultadas em 13 e 14/10/2026)

- Andrej Karpathy — *Software Is Changing (Again)*, YC AI Startup School, jun/2025 · *2025 LLM Year in Review*,
  dez/2025 · notas sobre programar com agentes, jan/2026 · [autoresearch](https://github.com/karpathy/autoresearch),
  mar/2026 · [LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f), abr/2026 · Sequoia AI
  Ascent, abr/2026
- Matt Pocock — [mattpocock/skills](https://github.com/mattpocock/skills) (v1.3.1, out/2026: `grilling`, `to-spec`,
  `to-tickets`, `tdd`, `code-review`, `triage`, `retro`) · *Software Fundamentals Matter More Than Ever*, AI Engineer
  Europe 2026 · dicas de Ralph, jan/2026
- Dex Horthy / HumanLayer — [12-factor agents](https://github.com/humanlayer/12-factor-agents) ·
  [Advanced Context Engineering](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents) ·
  *No Vibes Allowed*, nov/2025 · *Everything We Got Wrong About RPI*, mar/2026 · *Why Software Factories Fail*, jul/2026
- Geoffrey Huntley — *Ralph Wiggum as a software engineer*, 2025 · [Ralph Playbook](https://github.com/ghuntley/how-to-ralph-wiggum), jan/2026
- Anthropic Engineering — *Effective context engineering for AI agents* (set/2025) · *Effective harnesses for
  long-running agents* (nov/2025) · *Demystifying evals for AI agents* (jan/2026) · *Harness design for long-running
  application development* (mar/2026) · [Claude Code best practices](https://code.claude.com/docs/en/best-practices)
- Boris Cherny — fios sobre o fluxo de trabalho com Claude Code, jan/2026
- Simon Willison — *The lethal trifecta* (jun/2025) · *Vibe engineering* (out/2025) · *Agentic Engineering Patterns* (2026)
- Kent Beck — *Augmented Coding: Beyond the Vibes* (jun/2025) · crítica ao SDD citada por Martin Fowler (jan/2026)
- Birgitta Böckeler / Martin Fowler — [Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
  (out/2025) · *Harness Engineering* (2026) · *Are Harnesses Worth the Cost?* (out/2026)
- Addy Osmani — *How to write a good spec for AI agents* (jan/2026) · *Comprehension debt* (mar/2026) · *Loop Engineering* (jun/2026)
- Mitchell Hashimoto — *My AI Adoption Journey* (fev/2026) · Armin Ronacher — *The Coming Loop* (jun/2026)
- Thoughtworks Technology Radar vol. 33 (nov/2025) e vol. 34 (abr/2026) · DORA *State of AI-assisted Software
  Development* 2025 · [GitHub Spec Kit](https://github.com/github/spec-kit)
- Kiro — [docs](https://kiro.dev/docs/) (powers, skills, custom agents, steering, specs, hooks, workflows),
  [kirodotdev/powers](https://github.com/kirodotdev/powers), [Agent Plugins](https://github.com/agentplugins/agent-plugins-spec),
  [Agent Skills](https://agentskills.io/specification)
- IBM — ELM 7.2 (dez/2025) · Engineering AI Hub 1.3/1.4 (MCP oficial, agente de geração de testes) · vocabulário
  [OSLC RM](https://github.com/oslc-op/oslc-specs)

## Licença

[MIT](LICENSE)
