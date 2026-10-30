# Sabiá

> *A IA levanta voo. O Sabiá garante o pouso.*

O agente escreve muito código e rápido. O que limita o resultado é o alinhamento antes e a verificação depois. O Sabiá
conduz cada demanda por sete etapas: triagem, alinhamento, fatiamento, plano, implementação, verificação e consolidação.
Cada etapa tem um dono, um gate e uma evidência. O IBM ELM é o registro oficial, e cada erro vira uma regra para a
próxima fatia.

Desenvolvido por Daniel Xavier Araújo.

```
ENTRADA   triar ─► backlog: EP novo · FT sem épico (padrão ou rápida, cada uma com a sua ficha) · Sustentação (AT-/IM-… + IB) ─► "mais algum?"
HUB       iniciar <item> ─► especificar · desenvolver · revisar ([REV], [APR]) · verificar · atender · planejamento (troca) · consolidar · executar (cada uma assume a sua tarefa)
            │
PRODUTO   entrevistar ─► PRD ─► GATE PRD ─► ELM (HF/REG/GL) ─► fatiar ─► GATE backlog ─► sprint (EWM)
                                                                                 │
FATIA     desenvolver (iniciada na base) ─► pesquisar ─► plano (spec do Kiro) ─► GATE plano ─► implementar (TDD) ─► PR ─► revisar ─► verificar   (AFK: revisão e verificação antes do PR)
                                                                                                                                     │
DEPOIS    merge (Dev; remove a worktree do loop) ─► pronta na base
            │
PRODUTO   consolidar (P.O./SM, [GB]): drift da REV/VER ─► ELM as-built (ET, CTs) ─► ADRs do PR ─► concluida ─► aprender
```

**Mapa interativo do fluxo:** <https://dxaraujo.github.io/sabia/> — cada trilha é uma linha de metrô e cada skill uma
estação. Escolha a linha (épico, fatia HITL ou AFK, Sustentação, ciclo da sprint), a senioridade de quem implementa
e a trilha da fatia; a ficha ao lado mostra papel, agente, tarefa no EWM, arquivos, chamadas ao ELM e as transições de
cada passo. Fonte: branch `gh-pages` deste repositório.

## Origem

O Sabiá 1.0.0 nasce do power `sdd` 3.4.4, mantido antes no repositório
[`dxaraujo/kiro`](https://github.com/dxaraujo/kiro) (arquivado, com o histórico de versões). Não há migração
automática: o projeto que usava o `sdd` desinstala o power antigo, instala o Sabiá, move a pasta `.kiro/config/sdd/`
para `.sabia/config/` (os `pa_<nome>.json` vão para `.kiro/config/elm/`) e pede "atualizar a configuração do
Sabiá" e "atualizar os agentes do Sabiá". Requer o `mcp-elm` ≥ 3.5.1, que lê `.kiro/config/elm/`.

A 1.1.0 tira do `.kiro/` o que é do Sabiá e não do Kiro: configuração, steering, local, scripts e a pasta do produto
vão para `.sabia/` (o `.kiro/steering/sabia.md` vira um ponteiro); `.kiro/specs/`, `.kiro/agents/` e
`.kiro/config/elm|elk/` ficam. O hook `sa-backpressure` e as receitas de Kiro Workflows saem: a verificação antes do
commit é o `.sabia/verificar.sh`. A setup, em modo atualização, oferece mover os arquivos de um projeto 1.0.0.

## Fundamentos

| # | Princípio | Quem defende |
|---|---|---|
| 1 | Alinhar antes de escrever: entrevista em rodadas, com resposta recomendada; fatos o agente busca, decisões a pessoa toma | Matt Pocock (`grilling`), Anthropic (entrevista → spec), Dex Horthy (QRSPI), Andrej Karpathy (modelos não pedem esclarecimento) |
| 2 | Cerimônia do tamanho do trabalho | Birgitta Böckeler ("marreta para quebrar noz"), Anthropic ("se o diff cabe numa frase, pule o plano"), Horthy (~40% *oneshot*), Spec Kit |
| 3 | Spec é registro de decisão, sem caminho de arquivo; o que dura é glossário, ADR e — aqui — o ELM | Pocock (`to-spec`), Böckeler (*spec-anchored*), Kent Beck e Martin Fowler (aprender durante a implementação) |
| 4 | Linguagem ubíqua num glossário usado no PRD, nos testes e no código | Pocock (`domain-modeling`), DDD |
| 5 | Fatias verticais (*tracer bullets*) que cabem numa janela de contexto nova, com critérios falsificáveis | Pocock (`to-tickets`), Horthy ("modelos amam planos horizontais"), Anthropic (uma funcionalidade por vez), Geoffrey Huntley (um item por loop) |
| 6 | Pesquisar → planejar → implementar, com compactação em arquivo e revisão humana do plano | Horthy (*Advanced Context Engineering*), Boris Cherny (comece no plan mode) |
| 7 | Desenhar a forma do programa antes do código (árvore de arquivos, assinaturas, árvore de chamadas) | Horthy (*Why Software Factories Fail*, 2026), Pocock (módulos profundos) |
| 8 | Teste primeiro, vermelho → verde, nos pontos de teste combinados | Beck, Simon Willison (*red/green TDD*), Karpathy ("dê critérios de sucesso, peça os testes primeiro"), Pocock (`tdd`) |
| 9 | Backpressure: compilar, testes e lint a cada passo; evidência em vez de afirmação | Huntley, Anthropic, Cherny ("dê ao agente como verificar o trabalho"), Willison ("first run the tests") |
| 10 | Proteger o oráculo: teste não se apaga nem se afrouxa | Anthropic (*long-running harnesses*), Beck ("o gênio trapaceando"), Karpathy (`autoresearch`) |
| 11 | Gerador ≠ avaliador; revisão em contexto limpo e em eixos separados; avaliador cético mas sem caçar gosto | Anthropic (*harness design*), Pocock (`code-review`), Cherny |
| 12 | Contexto limpo por fatia e estado em disco | Horthy (zona burra acima de ~40%), Pocock (*smart zone*), Huntley, Anthropic (*context engineering*) |
| 13 | Slider de autonomia: HITL até o tipo de trabalho provar que anda sozinho; WIP limitado pela revisão humana | Karpathy ("Iron Man suits"), Pocock (AFK/HITL), Addy Osmani (*orchestration tax*), DORA 2025 |
| 14 | Leia o código: PRs pequenos, com caminho de leitura e evidência | Horthy ("read the dang code"), Willison, Osmani (*comprehension debt*), Thoughtworks Radar vol. 34 |
| 15 | Aprendizado composto: cada correção muda o ambiente — checagem determinística primeiro | Mitchell Hashimoto (*engineer the harness*), Cherny, Pocock (`retro`), Fowler (*guides & sensors*) |
| 16 | Conhecimento mantido por LLM, com *lint* de contradições | Karpathy (*LLM Wiki*) — aqui, o bundle do ELM + glossário + ADRs |
| 17 | Harness mínimo, revisto a cada modelo; segurança sem a "tríade letal" | Anthropic, Fowler (*Are Harnesses Worth the Cost?*), Willison |

Fontes no fim deste arquivo.

## Conteúdo

| Skill | Função |
|---|---|
| `sabia` | guia do fluxo: trilhas, gates, princípios, qual skill usar |
| `sa-setup` | configura o projeto: entende o repositório, descobre skills e toolkits, cria os agentes perguntando as skills de cada um |
| `sa-status` | painel "onde parei", WIP de revisão, próxima ação de maior alavanca |
| `sa-triar` | entrada de toda demanda nova: triagem em qualquer trilha, duplicados, ficha da fatia padrão sem épico, registro no backlog (inclusive a Sustentação: categoria, AT-nnn/IM-nnn…, IB do item no EWM; a tarefa `[ATD]`/`[IMPL]`… nasce quando o item entra numa sprint), importação de itens do EWM, "mais algum item?" — não começa nada |
| `sa-iniciar` | hub: recebe o item registrado (ou "minha próxima tarefa") e diz a skill do papel |
| `sa-especificar` | Especificador: assume a `[ESP]`, conduz entrevista → PRD → fatias numa pasta local até o GATE e registra cada sessão na tarefa (comentário + anexos) |
| `sa-desenvolver` | Dev: compromisso (Definition of Ready, sprint/encaixe, WIP), `iniciada` na base, branch, pasta, assume a `[DEV]`; retomada pela fase; merge do PR aprovado, `pronta` na base e conclusão da `[DEV]` |
| `sa-entrevistar` | alinhamento em rodadas (grill), decisões e glossário |
| `sa-prd` | PRD do épico (o quê e por quê) e GATE do PRD |
| `sa-fatiar` | PRD → fatias verticais AFK/HITL, backlog e GATE do backlog |
| `sa-planejamento` | roadmap, acordos (cadência Scrumban, DoR/DoD, WIP, reserva para Sustentação e retrabalho), sprint com especificação e Sustentação, encaixe, troca AFK → HITL, "sincroniza a sprint", review, retrospectiva, virada e relatório de horas |
| `sa-executar` | executa os demais itens de Sustentação já triados (`[IMPL]` `[BD]` `[INF]` `[OPE]` `[EXT]`; a pessoa faz o trabalho fora do repositório): assumir no ELM (`em-andamento`), registrar o trabalho, lançar horas, concluir a tarefa e o IB do item |
| `sa-atender` | executa o atendimento (categoria Atendimento da Sustentação) já triado (AT-nnn): assume a `[ATD]`, consulta só leitura, extração fora do git, resposta, saldo de horas, desdobramentos |
| `sa-pesquisar` | pesquisa do código compactada em `research.md` |
| `sa-plano` | spec do Kiro (`requirements.md`/`bugfix.md`, `design.md`, `tasks.md`) e GATE do plano |
| `sa-codificar` | TDD + backpressure, commits pequenos, revisão e PR (termina no PR) |
| `sa-revisar` | revisão independente: PRD (P), plano (L), código (C, dois eixos) |
| `sa-verificar` | aceite de ponta a ponta com evidência; `CT.csv` para o ETM |
| `sa-consolidar` | fatia `pronta` (pós-merge) → `concluida`, processo de produto (P.O. ou SM, agente `sa-produto`, créditos num comentário na `[GB]`; horas só do SM): drift marcado pela revisão e pela verificação, ELM as-built (requisitos, ET, casos de teste criados no ETM), ADRs do PR, glossário, conclusão |
| `sa-sync` | sincroniza o bundle OKF do DOORS Next nas duas vias (plano, baixar, enviar, conflitos) e, depois de baixar, pergunta se indexa o bundle local |
| `sa-loop` | fatias AFK até o PR, uma worktree por fatia, uma fase por contexto limpo |
| `sa-aprender` | lições, promoção de regras, retrospectiva com dados, casos de avaliação |

## O que a setup instala no projeto

O formato de power recomendado pelo Kiro (Agent Plugins, `plugin.json`) carrega só `skills/` e `mcp.json` — steering,
agentes e scripts dentro de um power são ignorados. Por isso a `sa-setup` instala no projeto, a partir
de `skills/sa-setup/assets/`:

| Arquivo | O quê |
|---|---|
| `.sabia/sabia.md` (e o ponteiro `.kiro/steering/sabia.md`) | o único steering do fluxo (sempre carregado): resumo, configuração do projeto (pasta do produto, comandos, verificação, git, banco, autonomia, ELM, agentes) e regras aprendidas |
| `.sabia/config/agentes.json` | as escolhas do projeto para os agentes (caminhos, comandos, skills e MCPs por agente) — a entrada do gerador |
| agentes de cada ferramenta do time: `.kiro/agents/sa-*.json` · `.opencode/agents/sa-*.md` · `.claude/agents/sa-*.md` (+ regras no `.claude/settings.json`) | `produto`, `especificador`, `pesquisador`, `codificador`, `revisor`, `verificador`, `orquestrador` — gerados pelo script da setup a partir do `agentes.json`, cada um com as skills e MCPs que a pessoa liberou |
| `.sabia/verificar.sh` | backpressure: compila, testa, roda o lint e a cobertura; a `sa-codificar` o roda antes de cada commit |
| `.sabia/http.sh` (opcional) | única chamada HTTP que o verificador faz sem perguntar: só à URL de teste, com corpo da pasta `massa/` |
| pasta do produto (proposta pela setup; padrão `.sabia/planejamento`) | `backlog.md`, épicos e PRDs, `equipe.json`, `acordos.md`, `roadmap.md`, `sprints/<iteração pai>/`, `sustentacao/<pasta>/`, `aprendizado/` — versionada; o que é local fica em `.sabia/local/` (fora do git) |

O ELM vem no próprio power: o MCP **`mcp-elm`** (≥ 3.5.1) lê o `.kiro/config/elm/pa_<nome>.json` do projeto (um por
project area, gravado pela `sa-setup`) e expõe operações (`elm_transicao`, `elm_lancar_horas`, `elm_criar_wi`,
`elm_ligar`, `elm_publicar_req`…): a skill do passo passa só o caminho do projeto, os ids e o conteúdo, e recebe
`{"ok": …}`. Regras comuns em [`skills/sabia/references/elm.md`](skills/sabia/references/elm.md). Leituras liberadas nos
agentes; escritas com confirmação do Kiro, além do "sim" da skill; cada papel comenta e anexa só na própria tarefa; o
pesquisador só consulta o bundle local. Sem o MCP, a escrita vira pendência registrada.

Cada agente tem as permissões mínimas do papel, definidas uma vez em
[`skills/sa-setup/assets/agents/papeis.json`](skills/sa-setup/assets/agents/papeis.json) e geradas no campo
`permissions` do Kiro: lê o projeto e o power, mas não `.env`, chaves, `~/.ssh`, `~/.aws` nem as credenciais do ELM;
escreve só o que produz; no shell, só o que o papel usa — git de leitura e, conforme o papel, `add`/`commit` e os
comandos de build e verificação —, e o resto o Kiro pergunta. Merge,
rebase, `--force`, `reset --hard` e `git -C` (que esconde o subcomando das regras) são negados em todos; push com
confirmação a cada um (`ask`), só da branch da fatia, no orquestrador, no codificador, no revisor e no verificador —
e, no codificador e no orquestrador, o da base com os registros de situação (`backlog.md`, `sprints/**` e o
`status.md` da fatia, conferidos antes; quem desenvolve precisa de push na base); o merge do PR aprovado é do Dev
responsável, pelo codificador. Detalhes em
[`skills/sa-setup/references/agentes.md`](skills/sa-setup/references/agentes.md).

## Toolkits

O fluxo não sabe programar em nenhuma stack: o conhecimento de Java, Spring Batch, Angular, React etc. vem de
**toolkits** — pacotes de skills mantidos fora do power, um por tipo de projeto ou stack. A `sa-setup` é a única
parte do fluxo que sabe procurá-los (`.sabia/toolkits/`, `~/.sabia/toolkits/`, powers instalados com `toolkit.json`,
ou skills com `metadata.toolkit`), detecta o tipo do projeto e **propõe, agente por agente**, as skills a ligar (uma confirmação por agente) —
num projeto 100% Spring Batch, o codificador recebe as de batch e Java que a pessoa escolher, e não as de REST ou
frontend. Contrato em [`skills/sa-setup/references/toolkits.md`](skills/sa-setup/references/toolkits.md) e
schema em [`toolkit.schema.json`](skills/sa-setup/assets/toolkit.schema.json).

## IBM ELM

O ELM é o sistema de registro; o repositório guarda as propostas de mudança (PRD, fatias) e como cada mudança foi
feita. Mapeamento padrão (ajustável na setup): história → artefato *História de Usuário* (DOORS Next); regra →
*Regra*; termo → *Termos de Glossário*; épico → *Épico* (EWM); fatia → *Item de Backlog* que **implementa** as
histórias (sem épico, filho da `Manutenção`); item de Sustentação → *Item de Backlog* `[AT-nnn]`, filho do IB da
categoria; tarefas filhas na sprint; cenário verificado → *Caso de Teste* (ETM) que **valida** a história.
Cada história, regra e termo nasce como um conceito **OKF v0.2** na pasta da spec (o mesmo formato do bundle da
`sa-sync`), com aprovação registrada em `verified`; sobe para o DOORS Next só depois do GATE, de baixo para cima,
com HF → REG como embed, sem nada extra no texto publicado e sempre com prévia e confirmação. Atributos e links entre
requisitos ficam registrados nos conceitos, porque o MCP não os grava. Detalhes em [`skills/sabia/references/elm.md`](skills/sabia/references/elm.md)
e [`skills/sa-consolidar/references/elm-publicar.md`](skills/sa-consolidar/references/elm-publicar.md).

Na consolidação, o agente cria no ETM um caso de teste por cenário verificado, com o link **valida**
(`elm_criar_ct`); sem permissão de criar no ETM, o `CT.csv` é importado à mão. O MCP `elm` ainda não grava atributos de requisito, links requisito↔requisito, módulos, change sets nem baselines: quando o
processo do projeto exige algum deles, a skill do passo entrega o roteiro manual e registra a pendência.

## Pré-requisitos

- Uma das ferramentas: Kiro IDE 1.x ou Kiro CLI 2.32+ na engine V3 (`--agent-engine v3`; a V2 não lê as permissões
  dos agentes), Claude Code (conferido no 2.1.314) ou opencode (conferido no 2.1.3); repositório git com branch base
  e PRs; e `uv` para os scripts da setup e da `sa-status`. No Claude Code e no opencode, a proteção por papel é
  menor que no Kiro: o gerador lista o que não tem tradução.
- Kiro Web não lê `~/.kiro`: os agentes do projeto aparecem lá, mas sem as skills do power — use a IDE ou o CLI.
- MCPs do próprio power (o `mcp.json` os sobe com `uvx`): [`mcp-elm`](https://pypi.org/project/mcp-elm/), que também consulta o
  bundle do ELM (`elm_*_local`, nunca lendo os arquivos), e [`mcp-gitlabpr`](https://pypi.org/project/mcp-gitlabpr/), que lista, lê e abre os PRs (merge
  requests do GitLab) — credencial em `~/.config/mcp-gitlabpr/gitlabpr.properties` (`url` e `token`). Repositório
  fora do GitLab, ou sem a credencial → o fluxo entrega título e descrição do PR, e a pessoa o abre. O `mcp.json`
  também sobe o [`mcp-elk`](https://pypi.org/project/mcp-elk/), que consulta logs no ELK com a configuração do projeto.
  Os três ficam no PyPI; o código e os schemas públicos (como o
  [`pa.schema.json`](https://dxaraujo.github.io/mcps/elm/pa.schema.json)) estão em
  [`dxaraujo/mcps`](https://github.com/dxaraujo/mcps).
- Opcional: IBM ELM — credencial em `~/.config/mcp-elm/elm.properties` e o `pa` gerado pela `sa-setup`; MCP de consulta ao banco (somente leitura);
  MCP de browser/Playwright para verificar frontend.
- Toolkits da stack do projeto (opcional — sem eles os agentes dependem do steering e do código vizinho).

Horas: **lançar ≠ concluir** — lançar é registro de empenho, a qualquer momento numa tarefa assumida (ao fechar a
sessão, por exemplo); concluir é da skill do papel, com o saldo. No AFK há a `[DEV]` e a `[APR] Aprovar PR`.

## Primeiros passos

1. Instale na ferramenta do time:
   - **Kiro:** pelo painel **Powers**, a partir de <https://github.com/dxaraujo/sabia> ou de uma cópia local (o
     power é a raiz do repositório).
   - **Claude Code e opencode:** o CLI `sabia` (em construção) baixa o Sabiá para `~/.sabia/`, copia as skills para
     `~/.claude/skills/` ou `~/.config/opencode/skills/` e registra os MCPs do `mcp.json`, com um inventário para
     atualizar e desinstalar. Até lá, copie `skills/sabia` e `skills/sa-*` para essa pasta e registre os MCPs à mão.
2. No projeto, peça **"configurar o Sabiá"** e confirme as propostas (os padrões vêm marcados; uma confirmação por bloco).
3. Comece: **"nova demanda: …"** (a `sa-triar` faz a triagem e registra no backlog; épico → PRD), **"iniciar a
   FT-031"** ou **"minha próxima tarefa"** (o hub `sa-iniciar` diz a skill do papel), **"corrigir o defeito 4567"**
   (registra pela triagem, se preciso) — ou **"onde parei?"**.

Depois de atualizar o power ou um toolkit, peça "atualizar os agentes do Sabiá".

Não use o `/upgrade-agent` (nem `kiro-cli agent upgrade`) nos agentes `sa-*`: quem os gera é o script da setup
("atualizar os agentes do Sabiá").

## Como foi verificado

**Documentação oficial do Kiro**, lida inteira nas páginas `.md` de `kiro.dev/docs` em 14/10/2026 (powers, skills,
steering, custom agents e referência de configuração, subagentes, permissões, hooks, specs, workflows, CLI V3 e
migração), mais o schema do `plugin.json` (Agent Plugins) e a especificação Agent Skills. Uma auditoria do power
contra essas páginas gerou as correções que o Sabiá herdou do `sdd`: `git -C` negado, leitura restrita, confirmação de push e PR,
delegação a subagente sem pergunta por agente, falha do hook na saída de erro, pausa e falha dos passos de workflow
por `send_message`, chamada HTTP do verificador por script.

Com o **Kiro CLI 2.31.0** (o binário oficial), no `sdd` 2.x, quando os agentes eram templates no formato universal (V2 + V3):

- `kiro-cli powers install <pasta>` instala o power em `~/.kiro/powers/installed/<nome do power>/` (hoje `sabia/`), com todas as skills,
  `references/` e `assets/` — o caminho que a setup usa nos agentes;
- o bloco `permissions` dos templates foi gerado pelo próprio `kiro-cli agent upgrade` a partir do `toolsSettings`
  (V2) e conferido regra a regra; depois receberam o que só existe na V3: `skill` liberada (com leitura restrita o
  conversor avisa que cada skill pediria aprovação), `ask` de push/PR no orquestrador e de `curl`/`wget` no
  verificador. `subagent/<nome>` em `tools` e a regra `subagent` vêm do conversor (de `availableAgents` e
  `trustedAgents`);
- os seis agentes, com os placeholders preenchidos, passam no `kiro-cli agent validate`, aparecem no
  `kiro-cli agent list`, e o `kiro-cli agent upgrade --dry-run` os deixa intactos (`out of sync (not rebuilt)`);
- o formato `.md` de agente **não** é carregado pela engine V2 do CLI (ainda a padrão), por isso os agentes são
  JSON universais; padrões de comando encadeado (`cd … && …`) são descartados pelo conversor, por isso as
  permissões usam comandos simples;
- o `http.sh` foi exercitado contra um servidor local (método, caminho e corpo fora da pasta `massa/` recusados).

Com o **Kiro CLI 2.32.0**, engine V3 (23/10/2026), os agentes gerados pelo `gerar_agentes.py`: os seis passam no
`kiro-cli agent validate`; numa conversa sem interação, comando liberado roda, comando fora da lista e exceção
(`git log --output`) caem em aprovação, e `git commit -n` e push para a base são negados pela regra. Não foi
possível abrir a IDE.

**O que a documentação não resolve** (comportamento a observar no primeiro uso): o formato do `.config.kiro` das
specs; EARS em português no Analyze Requirements; se os subagentes somam ou intersectam os `allow` de quem os
chama (a doc diz "deny-wins intersection" — se um subagente do loop falhar por permissão, libere o comando também
no orquestrador); o alcance de `trustedAgents`; e as páginas de
steering e de configuração divergem sobre agentes herdarem o steering padrão (a setup oferece
`chat.disableInheritingDefaultResources` no CLI).

## Limitações conhecidas e próxima versão

- **Próxima versão:** toolkits oficiais (backend Java/Spring, Spring Batch, frontend Angular/React); execução automatizada dos
  casos de avaliação que a `sa-aprender` já guarda em `<produto>/aprendizado/avaliacoes/`; e — quando o MCP do ELM
  suportar — atributo de chave, links entre requisitos, módulos, change sets e baselines automáticos.

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
