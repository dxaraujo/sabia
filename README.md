# Sabiá

> *A IA levanta voo. O Sabiá garante o pouso.*

O agente escreve muito código e rápido. O que limita o resultado é o alinhamento antes e a verificação depois. O Sabiá
conduz cada demanda por sete etapas: triagem, alinhamento, fatiamento, plano, implementação, verificação e consolidação.
Cada etapa tem um dono, um gate e uma evidência. O IBM ELM é o registro oficial, e cada erro vira uma regra para a
próxima fatia.

Desenvolvido por Daniel Xavier Araújo.

```
ENTRADA   triar ─► backlog: EP novo · FT sem épico (padrão ou rápida, cada uma com a sua ficha e os artefatos afetados do ELM) · Sustentação (AT-/IM-… + IB) ─► "mais algum?"
HUB       iniciar <item> ─► especificar · desenvolver · revisar ([REV], [APR]) · verificar · atender · planejamento (troca) · consolidar · executar (cada uma assume a sua tarefa)
            │
PRODUTO   especificar (ATA de cada reunião · protótipo aprovado, com tela) ─► entrevistar ─► PRD ─► GATE PRD (especificador) ─► ELM ─► fatiar (P.O./SM, logo em seguida) ─► GATE backlog ─► sprint (EWM)
                                                                                                                                                                   │
FATIA     [ESP] FT (artefato afetado) ─► ELM ─► encaixe ─► desenvolver (iniciada na base) ─► pesquisar ─► plano (spec do Kiro) ─► GATE plano ─► implementar (TDD) ─► PR ─► revisar ─► verificar   (AFK: revisão e verificação antes do PR)
                                                                                                                                                                    │
DEPOIS    merge (Dev; remove a worktree do loop) ─► pronta na base
            │
PRODUTO   consolidar (P.O./SM, [GB]): débito de especificação ─► ELM (ET as-built ligada à [DEV], CTs) ─► ADRs do PR ─► concluida ─► aprender
```

**Mapa interativo do fluxo:** <https://dxaraujo.github.io/sabia/> — cada trilha é uma linha de metrô e cada skill uma
estação. Escolha a linha (épico, fatia HITL ou AFK, Sustentação, ciclo da sprint), a senioridade de quem implementa
e a trilha da fatia; a ficha ao lado mostra papel, agente, tarefa no EWM, arquivos, chamadas ao ELM e as transições de
cada passo. Fonte: branch `gh-pages` deste repositório.

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
| `sa-especificar` | Especificador: assume a `[ESP]`, conduz entrevista → PRD numa pasta local até o GATE do PRD, especifica os artefatos afetados de uma fatia na `[ESP] FT` até o GATE dele, publica no ELM e liga à `[ESP]` os requisitos aprovados e os CT planejados (a `[ESP]` termina com a publicação; alteração depois dela: no épico, só entre o GATE do PRD e o fatiamento, pela `sa-prd.mudanca`, e depois do fatiamento sempre na `[ESP] FT` da fatia; a tarefa aberta registra, a concluída na sprint corrente reabre, e a concluída numa sprint fechada vai à `[GB]` ou nasce a `[ESP] <id> Revisão <n>`), registra cada sessão na tarefa (comentário + anexos), faz a ATA de cada reunião com o cliente a partir da transcrição e, em projeto com tela, registra o protótipo e a aprovação do cliente antes do PRD |
| `sa-desenvolver` | Dev: compromisso (Definition of Ready, sprint/encaixe, WIP), `iniciada` na base, branch, pasta, assume a `[DEV]`; retomada pela fase; merge do PR aprovado, `pronta` na base e conclusão da `[DEV]` |
| `sa-entrevistar` | alinhamento em rodadas (grill), decisões e glossário |
| `sa-prd` | PRD do épico (o quê e por quê, com os artefatos novos, alterados e excluídos e o impacto) e GATE do PRD, do especificador |
| `sa-fatiar` | processo de produto (P.O. ou SM, agente `sa-produto`): PRD → fatias verticais AFK/HITL com os artefatos afetados, backlog e GATE do backlog |
| `sa-planejamento` | roadmap, acordos (cadência Scrumban, DoR/DoD, WIP, reserva para Sustentação e retrabalho), sprint com especificação e Sustentação, encaixe, troca AFK → HITL, "sincroniza a sprint", review, retrospectiva, virada e relatório de horas |
| `sa-executar` | executa os demais itens de Sustentação já triados (`[IMPL]` `[BD]` `[INF]` `[OPE]` `[EXT]`; a pessoa faz o trabalho fora do repositório): assumir no ELM (`em-andamento`), registrar o trabalho, lançar horas, concluir a tarefa e o IB do item |
| `sa-atender` | executa o atendimento (categoria Atendimento da Sustentação) já triado (AT-nnn): assume a `[ATD]`, consulta só leitura, extração fora do git, resposta, saldo de horas, desdobramentos |
| `sa-pesquisar` | pesquisa do código compactada em `research.md` |
| `sa-plano` | spec do Kiro (`requirements.md`/`bugfix.md`, `design.md`, `tasks.md`) e GATE do plano |
| `sa-codificar` | TDD + backpressure, commits pequenos, revisão e PR (termina no PR) |
| `sa-revisar` | revisão independente: PRD (P), plano (L), código (C, dois eixos) |
| `sa-verificar` | aceite de ponta a ponta com evidência; `CT.csv` para o ETM |
| `sa-consolidar` | fatia `pronta` (pós-merge) → `concluida`, processo de produto (P.O. ou SM, agente `sa-produto`, créditos num comentário na `[GB]`; horas só do SM): divergência do código mergeado com um artefato como débito técnico de especificação (para a review e a retrospectiva), ET as-built ligada à `[DEV]` e casos de teste da fatia no ELM (ETM ou CSV, pela política), ADRs do PR, glossário, conclusão |
| `sa-sync` | sincroniza o bundle OKF do DOORS Next nas duas vias (plano, baixar, enviar, conflitos) e, depois de baixar, pergunta se indexa o bundle local e gera a visualização offline dele (`explorar.html`, galáxias 3D) |
| `sa-orquestrar` | fatias AFK até o PR, uma worktree por fatia, uma fase por contexto limpo |
| `sa-aprender` | lições, promoção de regras, retrospectiva com dados, casos de avaliação |

## O que a setup instala no projeto

O formato de power recomendado pelo Kiro (Agent Plugins, `plugin.json`) carrega só `skills/` e `mcp.json` — steering,
agentes e scripts dentro de um power são ignorados. Por isso a `sa-setup` instala no projeto, a partir
de `skills/sa-setup/assets/`:

| Arquivo | O quê |
|---|---|
| `.sabia/sabia.md` (e o ponteiro `.kiro/steering/sabia.md`) | o único steering do fluxo (sempre carregado): resumo, configuração do projeto (pasta do produto, comandos, verificação, git, banco, autonomia, ELM, agentes) e regras aprendidas |
| `.sabia/config/agentes.json` | as escolhas do projeto para os agentes (caminhos, comandos, skills e MCPs por agente) e a versão do Sabiá — a entrada do gerador |
| agentes de cada ferramenta do time: `.kiro/agents/sa-*.json` · `.opencode/agents/sa-*.md` | `produto`, `especificador`, `pesquisador`, `desenvolvedor`, `revisor`, `verificador`, `orquestrador` — gerados pelo script da setup a partir do `agentes.json`, cada um com as skills e MCPs que a pessoa liberou |
| `.sabia/glossario.md` · `.sabia/adr/` | glossário e ADRs, quando o projeto ainda não os tem em outro lugar |
| `.sabia/fluxo/` · `.sabia/padrao/` (só ao customizar) | o passo, as operações do mestre ou o padrão que o projeto mudou ("customizar …" na `sa-setup`) |
| `.sabia/http.sh` (opcional) | única chamada HTTP que o verificador faz sem perguntar: só à URL de teste, com corpo da pasta `massa/`; o backpressure antes de cada commit (compila, testa, roda o lint e a cobertura) é o passo `validar` da `sa-codificar`, com os Comandos do `sabia.md` |
| pasta do produto (proposta pela setup; padrão `.sabia/planejamento`) | `backlog.md`, épicos e PRDs, `equipe.json`, `acordos.md`, `roadmap.md`, `sprints/<iteração pai>/`, `sustentacao/<pasta>/`, `aprendizado/` — versionada; o que é local fica em `.sabia/local/` (fora do git) |

O ELM vem no próprio power: o MCP **`mcp-elm`** (≥ 3.6.4) lê o `.kiro/config/elm/pa_<nome>.json` do projeto (um por
project area, gravado pela `sa-setup`) e expõe operações (`elm_transicao`, `elm_lancar_horas`, `elm_criar_wi`,
`elm_ligar`, `elm_publicar_req`…): a skill do passo passa só o caminho do projeto, os ids e o conteúdo, e recebe
`{"ok": …}`. Regras comuns em [`skills/sabia/references/elm.md`](skills/sabia/references/elm.md). Leituras liberadas nos
agentes; escritas com confirmação do Kiro, além do "sim" da skill; cada papel comenta e anexa só na própria tarefa; o
pesquisador só consulta o bundle local. Sem o MCP, a escrita vira pendência registrada.

Cada agente tem as permissões mínimas do papel, definidas uma vez em
[`skills/sa-setup/assets/agents/papeis.json`](skills/sa-setup/assets/agents/papeis.json) e geradas no campo
`permissions` do Kiro e no `permission` do opencode: lê o projeto e o power, mas não `.env`, chaves, `~/.ssh`, `~/.aws` nem as credenciais do ELM;
escreve só o que produz (nunca o harness: configuração, agentes, `.sabia/fluxo/`, `.sabia/padrao/`); o shell é
liberado para quem escreve no projeto (o pesquisador só lê), menos o que a regra nega. Merge,
rebase, `--force`, `reset --hard`, `git -C` (que esconde o subcomando das regras), credenciais e os arquivos do
harness no comando são negados em todos; push com
confirmação a cada um (`ask`), só da branch da fatia, no orquestrador, no desenvolvedor, no revisor e no verificador —
e, no desenvolvedor e no orquestrador, o da base com os registros de situação (`backlog.md`, `sprints/**` e o
`status.md` da fatia, conferidos antes; quem desenvolve precisa de push na base); o merge do PR aprovado é do Dev
responsável, pelo desenvolvedor. Detalhes em
[`skills/sa-setup/references/agentes.md`](skills/sa-setup/references/agentes.md).

## Toolkits

O fluxo não sabe programar em nenhuma stack: o conhecimento de Java, Spring Batch, Angular, React etc. vem de
**toolkits** — pacotes de skills mantidos fora do power, um por tipo de projeto ou stack. A `sa-setup` é a única
parte do fluxo que sabe procurá-los (`.sabia/toolkits/`, `~/.sabia/toolkits/`, powers instalados com `toolkit.json`,
ou skills com `metadata.toolkit`), detecta o tipo do projeto e **propõe, agente por agente**, as skills a ligar (uma confirmação por agente) —
num projeto 100% Spring Batch, o desenvolvedor recebe as de batch e Java que a pessoa escolher, e não as de REST ou
frontend. Uma skill de toolkit também pode assumir um passo do Sabiá pelo id (`sa-codificar.codificar.tarefa`): o
desvio vai no prompt do agente dono. E um toolkit pode trazer a skill que escreve um tipo desviável do catálogo,
com o fluxo e o padrão do tipo (`"tipos": {"HF": {"skill", "fluxo", "padrao"}}`; `HF`, `REG`, `EL`, `ET`, `CT` e `ATA`), os
itens que ele acrescenta à revisão (`rubricas`) e a versão mínima do Sabiá (`requer`). Fluxo com passos é só do
framework: o Sabiá não compila conteúdo de toolkit, e o toolkit não troca padrão do núcleo; o catálogo, o envelope OKF,
a revisão, o GATE e a publicação continuam do Sabiá.
Contrato em [`skills/sa-setup/references/toolkits.md`](skills/sa-setup/references/toolkits.md) e
schema em [`toolkit.schema.json`](skills/sa-setup/assets/toolkit.schema.json).

## IBM ELM

O ELM é o sistema de registro; o repositório guarda as propostas de mudança (PRD, fatias) e como cada mudança foi
feita. Mapeamento padrão (ajustável na setup): história → artefato *História de Usuário* (DOORS Next); regra →
*Regra*; termo → *Termos de Glossário*; épico → *Épico* (EWM); fatia → *Item de Backlog* (sem épico, filho da `Manutenção`); item de Sustentação → *Item de Backlog* `[AT-nnn]`, filho do IB da
categoria; tarefas filhas na sprint, cada uma ligada ao que gera (a `[ESP]` **rastreia** os requisitos que
publica; a `[DEV]` **implementa** os que a fatia cobre e a ET as-built); cenário verificado → *Caso de Teste* (ETM) que **valida** a história.

Todo artefato é de um tipo do catálogo fechado ([`fluxo/tipos.json`](fluxo/tipos.json); compilado em
`skills/sabia/references/tipos.md`): `HF` história, `REG` regra, `GL` termo, `EL` leiaute (uma por tela, com a
política Telas = `sim`, lido do protótipo que o cliente aprovou), `ET` especificação técnica (inicial no PRD e
as-built por fatia, pela política ET), `CT` caso de teste (planejado da HF no PRD ou na `[ESP] FT` e aprovado no GATE da `[ESP]`; a evidência da execução no `CT.csv` da verificação; ETM ou CSV, pela linha Casos de teste do `sabia.md`) e `ATA` (a ata de cada
reunião com o cliente durante a `[ESP]`, escrita da transcrição, que fica só local). Cada um nasce como um conceito
**OKF v0.2** na pasta da spec (o mesmo formato do bundle da `sa-sync`), com aprovação registrada em `verified` no
GATE da `[ESP]` (o do PRD, no épico; o da `[ESP] FT`, na fatia com artefato afetado); os requisitos aprovados sobem
para o DOORS Next na conclusão da `[ESP]`, de baixo para cima (`GL` → `REG` → `EL` → `HF` → `ET`), com
HF → REG como embed, sem nada extra no texto publicado e sempre com prévia e confirmação; o excluído vai à lixeira do DOORS Next por
roteiro manual. A ATA sobe na aprovação dela. Atributos e links entre
requisitos ficam registrados nos conceitos, porque o MCP não os grava. Detalhes em [`skills/sabia/references/elm.md`](skills/sabia/references/elm.md)
e [`skills/sa-consolidar/references/elm-publicar.md`](skills/sa-consolidar/references/elm-publicar.md).

Com a política Casos de teste = `ETM`, o CT planejado sobe ao ETM na conclusão da `[ESP]`, com os requisitos; na
consolidação, o agente o liga ao IB e cria só o CT novo da verificação, com o link **valida** (`elm_criar_ct`); sem permissão de criar no ETM, o `CT.csv` é importado à mão. O MCP `elm` ainda não grava atributos de requisito, links requisito↔requisito, módulos, change sets nem baselines: quando o
processo do projeto exige algum deles, a skill do passo entrega o roteiro manual e registra a pendência.

## Pré-requisitos

- Uma das ferramentas: Kiro IDE 1.x ou Kiro CLI 2.32+ no motor V3 (`--agent-engine v3`, obrigatório; na V2 o agente
  dá "Mode not found") ou opencode (conferido no 2.1.3); repositório git com branch base
  e PRs; e `uv` para os scripts da setup e da `sa-status`. No opencode, a proteção por papel é
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

1. Instale com o CLI (Node 18+): **`npx sabia instalar`**. Ele baixa o Sabiá para `~/.sabia/framework/`,
   pergunta as ferramentas do time (Kiro, opencode), **compila** as skills (fluxos, padrões e skills do framework) em
   `~/.sabia/compilado/<alvo>/` e as instala na pasta do usuário — no Kiro, o power (`kiro-cli powers install`); no
   opencode, as skills em `~/.config/opencode/skills/` e os MCPs do `mcp.json` —, registrando
   tudo em `~/.sabia/inventario.json`. Nada vai para o projeto. Depois: `sabia atualizar` (recompila), `sabia desinstalar` e `sabia toolkits
   listar|baixar|instalar|atualizar|remover` (`npm i -g sabia` deixa o comando `sabia`; `npx sabia --ajuda` mostra
   todos). Instale pelo CLI, não pelo painel **Powers** a partir deste repositório: as skills do repositório são a
   fonte, e o que roda é a compilação. Para ver por onde um arquivo passa (o passo com desvio, o dono, o toolkit e as
   travas): `sabia rota <arquivo>`, ou `sabia rota <spec>/tasks.md#2.1` (pelos arquivos que a tarefa cita; sem casar,
   mostra o texto dela e os `para` dos desvios); o fluxo resolvido no projeto (tabela, grafo ASCII e Mermaid):
   `sabia rota --fluxo <skill.fluxo>`.
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
contra essas páginas gerou as correções do Sabiá: `git -C` negado, leitura restrita, confirmação de push e PR,
delegação a subagente sem pergunta por agente, chamada HTTP do verificador por script.

Com o **Kiro CLI 2.31.0** (o binário oficial):

- `kiro-cli powers install <pasta>` instala o power em `~/.kiro/powers/installed/sabia/`, com todas as skills,
  `references/` e `assets/` — o caminho que a setup usa nos agentes;
- o formato `.md` de agente **não** é carregado pela engine V2 do CLI (ainda a padrão), por isso os agentes do Kiro
  são JSON; padrões de comando encadeado (`cd … && …`) são descartados pelo `kiro-cli agent upgrade`, por isso as
  permissões usam comandos simples;
- o `http.sh` foi exercitado contra um servidor local (método, caminho e corpo fora da pasta `massa/` recusados).

Com o **Kiro CLI 2.32.0**, engine V3 (23/10/2026), os agentes gerados pelo `gerar_agentes.py`: os seis passam no
`kiro-cli agent validate`; numa conversa sem interação, comando liberado roda, comando fora da lista e exceção
(`git log --output`) caem em aprovação, e `git commit -n` e push para a base são negados pela regra. Não foi
possível abrir a IDE.

**Prova do núcleo**, só com fixtures sintéticas (`node --test` em `cli/` e `python3 -m unittest test_gerar_agentes`
em `skills/sa-setup/scripts/`): o framework deste repositório instalado e compilado no Kiro e no opencode, com o
grafo de cada fluxo igual ao do mestre, o catálogo sem tipo pendente e a linha Telas = `sim` como condição do
protótipo, da EL e da P12 nos passos compilados; um projeto front+back com um toolkit de especificação (HF ⇢ a skill
dele, com o fluxo e o padrão do tipo, e um item de rubrica), um passo do Sabiá trocado no projeto e as linhas ET, Casos de teste e
Telas do `sabia.md` (ET inicial, `CT.csv`, HF ↔ EL, P12 e P13 nos passos compilados); e um projeto batch com o desvio
da tarefa de job ao agente do toolkit. Nos dois, os agentes são gerados pelo
`gerar_agentes.py` sobre a instalação, e a `sabia rota` mostra o desvio e a origem de cada passo.

**Verificação pendente** (da pessoa, numa PA real, com `elm_setup_descobrir`): os tipos de artefato do DOORS Next para
a `ATA` (Reunião) e a `EL` (Leiaute) — o nome, o `OT_` e os atributos obrigatórios de cada um.

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
