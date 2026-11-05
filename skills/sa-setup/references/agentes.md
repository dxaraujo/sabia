# Agentes — como a setup gera `.kiro/agents/sa-*.json` e `.opencode/agents/sa-*.md`

Os agentes são **gerados**, nunca editados à mão. Cinco fontes:

| Fonte | Onde | O quê |
|---|---|---|
| `papeis.json` | [../assets/agents/](../assets/agents/papeis.json) (power) | permissões de cada papel: escrita, registros, nível de shell, push e MCPs |
| `sa-<papel>.md` | [../assets/agents/](../assets/agents/) (power) | o prompt de cada agente |
| `agentes.json` | `.sabia/config/agentes.json` (projeto, versionado) | as escolhas do projeto: caminhos, comandos, skills e MCPs por agente |
| mestres dos fluxos | `~/.sabia/framework/fluxo/<skill>/<fluxo>/<fluxo>.md` (framework instalado; `--framework` troca), mais o `fluxo/tipos.json` | o dono de cada fluxo, os passos, quais aceitam desvio (`"desvio": true`) e que passo cria cada tipo |
| override | `.sabia/fluxo/` e `.sabia/padrao/` (projeto, esparso; harness) | o que o projeto customizou: vira o [delta](#o-prompt-delta-do-override-e-chamada-entre-fluxos) no prompt do dono |

O script [../scripts/gerar_agentes.py](../scripts/gerar_agentes.py) junta as cinco e grava os sete agentes, mais os agentes dos passos de toolkit ligados, em cada alvo (`.kiro/agents/<nome>.json`, `.opencode/agents/<nome>.md`):

```bash
uv run --no-project python <pasta desta skill>/scripts/gerar_agentes.py --projeto <raiz>            # mostra o diff e a tabela
uv run --no-project python <pasta desta skill>/scripts/gerar_agentes.py --projeto <raiz> --gravar   # grava
... --alvo kiro,opencode           # padrão: `alvos` do agentes.json, ou kiro
... --framework <dir>              # padrão: ~/.sabia/framework (os testes passam outro)
uv run --no-project python <pasta desta skill>/scripts/gerar_agentes.py --base sa-codificar.codificar.tarefa  # a `base` de uma cópia
```

Sai com código 1 (sem gravar nada) se sobrou um `{{…}}` ou se um `skill://`/`file://` não existe ou é absoluto, e
também se o override ou um desvio de toolkit é recusado.
O `--base <id>` imprime o sha12 do original no framework — o id do passo (ex.: `sa-codificar.codificar.tarefa`) ou o padrão
(`<skill>/<nome>.md`) —,
e não gera nada: a setup grava a `base` de toda cópia por ele, nunca por outro cálculo.
"Atualizar os agentes do Sabiá" depois de atualizar o power é só rodar o script de novo: as escolhas estão no
`agentes.json`.

Alvos: **Kiro** (motor v3) e **opencode**. O formato é o **V3** do Kiro (campo `permissions`), carregado pela IDE e
pela engine V3 do `kiro-cli`. A engine V2
do CLI não é suportada pelos agentes do Sabiá (dá "Mode not found"): use a IDE ou `kiro-cli chat --agent-engine v3`. Não rode
`/upgrade-agent` nem `kiro-cli agent upgrade` neles — os quatro com subagentes (produto, especificador, desenvolvedor,
orquestrador) aparecem como `out of sync (not rebuilt)` no `--dry-run` (por causa do `toolsSettings.subagent`, que a V3 ainda usa), e o conversor os deixa de lado.

## `agentes.json` do projeto

Obrigatórios: `produto` e `base`; os demais são opcionais, com o padrão dito na linha.

| Campo | Formato | O quê |
|---|---|---|
| `alvos` | `["kiro", "opencode"]` | as ferramentas do time (padrão `["kiro"]`; `--alvo` no gerador troca) |
| `sabia` | `"<versão>"` | a versão do Sabiá com que o projeto foi configurado; diferente da instalada (`plugin.json` do framework) → o gerador e a setup avisam |
| `power` | `"~/.kiro/powers/installed/sabia"` | a pasta do power do Kiro, relativa ao home (Passo 0) |
| `produto`, `glossario`, `adr` | `"<caminho relativo à raiz>"` \| `null` | os caminhos do Passo 4 (padrão `.sabia/planejamento`, `.sabia/glossario.md`, `.sabia/adr`; `null` = não há) |
| `base` | `"<branch>"` | a branch base, sem `origin/` — nas regras de push da base (pergunta no desenvolvedor e no orquestrador; negado nos demais) |
| `bundle` | `"<caminho>"` \| `null` | o `rm.download` do `pa` (leitura negada: a consulta é pelas `elm_*_local`) |
| `massa` | `"<caminho>"` \| `null` | a pasta de massa do projeto que o verificador escreve — só registro (nenhuma regra nem prompt o usa); o corpo do `http.sh` vem de `.kiro/specs/<ft>-<slug>/massa/` |
| `elm` | `true` \| `false` | `false` → nenhuma tool do `elm` em nenhum agente (`sabia/elm/*` negado) |
| `push_pr_no_loop` | `true` \| `false` | `false` ("não — a pessoa abre") → o orquestrador não faz push (nem o da `iniciada` do lote, na base) nem abre PR |
| `http_sh` | `true` \| `false` | `true` se a setup instalou `.sabia/http.sh` (com o shell `*`, não vira regra) |
| `steering` | `["file://<caminho relativo à raiz>", …]` \| `[]` | o steering de produto, tecnologia e estrutura, para todos os agentes |
| `comandos` | `{"build": ["<comando>", …], "verificacao": ["<comando>", …]}` | `build`: compilar, testes, teste único, lint, cobertura; `verificacao`: executar a aplicação ou o job, scripts de massa — só registro (o gerador não lê; com o shell `*`, não vira regra) |
| `agentes.sa-<papel>.skills` | `["skill://~/<caminho>/SKILL.md" \| "skill://.kiro/skills/<skill>/SKILL.md", …]` | as skills escolhidas no Passo 6 |
| `agentes.sa-<papel>.ler` | `["~/.kiro/skills/<skill>/**", …]` | pastas dessas skills fora do projeto e do power |
| `agentes.sa-<papel>.mcp` | `["<servidor>/<tool>" \| "<servidor>", …]` | tools de MCP do projeto: `servidor/tool` (banco: só a de consulta) ou `servidor` (inteiro, ex.: browser) |
| `agentes.sa-<papel>.subagentes` | `[{"nome": "<agente>", "para": "<quando usar>"}]` | agentes do projeto (só desenvolvedor e orquestrador: em outro agente, o gerador recusa) |
| `agentes.sa-<papel>.modelo` | `"<modelo>"` | o modelo, se não for o padrão |
| `toolkits.<nome>` | `{"pasta": "~/.sabia/toolkits/<nome>" \| ".sabia/toolkits/<nome>", "versao": "<versao do toolkit.json>", "sha": "<sha do .origem.json>" \| null}` | cada toolkit com passo ou tipos ligados; `sha` `null` no toolkit do projeto (só registro; o gerador não lê o sha) |
| `passos` | `[{"toolkit": "<chave em toolkits>", "skill": "<caminho da skill no toolkit.json, ex.: skills/spring-batch-job/SKILL.md>", "agente": true \| false}]` | a skill do `toolkit.json` que tem `passo`; `agente: true` gera o agente do passo e o liga ao dono |

O shell `trabalho` é liberado (`*`): os comandos do projeto não viram regra. O backpressure antes de cada commit é o
passo `sa-codificar.codificar.validar`, que roda a seção Comandos do `sabia.md`.

## No opencode

O gerador monta o agente do Kiro e o traduz:

- **opencode** (`.opencode/agents/<nome>.md`): `permission` por agente, na ordem em que a última regra que casa
  vence — `read` e `edit` por caminho (`read`: `**/x` vira `x` e `*/x`; `edit`: `**/x` vira `*/x`, e a raiz vem da regra própria), `bash` (as negações por último), `task` (os
  subagentes), `skill` (as skills do agente, pelo nome), as tools de MCP como `<servidor>_<tool>` e
  `external_directory` para o que se lê fora do projeto (o power vira `~/.config/opencode`, onde estão as skills
  compiladas). Agente do toolkit sai como `mode: subagent`.
- O que não tem tradução sai no fim da saída do gerador, por alvo.

## O prompt: delta do override e chamada entre fluxos

As skills `sa-*` instaladas são compiladas (as-built) e não sabem do projeto. O que o projeto mudou chega pelo prompt
do agente, que o gerador monta depois do `sa-<papel>.md`:

- **Delta do override**, só no agente **dono** do fluxo (o `dono` do mestre) e só se o projeto mudou algo: passo
  trocado → "leia `.sabia/fluxo/<s>/<f>/passos/<id>.md` (no lugar do da skill)"; passo inserido → o arquivo e depois
  de qual; passo removido. Padrão trocado (`.sabia/padrao/<s>/<n>.md`) vai a **todos** os agentes (um padrão é citado
  por fluxos de vários donos). Sem override → nada.
- **Recusa** (código 1, nada gravado): arquivo que não é `.md` ou não é passo ou padrão do Sabiá; cópia sem `base`;
  no `<f>.md` do projeto, operação que não seja `inserir` ou `remover` (`liberar` existe no formato, mas nenhuma trava
  é liberável); `remover` de passo sem `removivel` ou com trava; `inserir` com id inválido, repetido, `depois`
  inexistente, em ciclo ou sem o arquivo; override com um framework sem os fluxos (`fluxo/` ausente ou incompleto).
- **Aviso:** a `base` da cópia difere do original atual (o Sabiá mudou o passo desde a cópia) → compare e funda à mão.
- **Desvios de toolkit** no passo de toolkit ligado (só em passo com `"desvio": true`): ver
  [toolkits.md](toolkits.md#passos).
- **Tipos com skill de toolkit** (a skill, com o fluxo e o padrão do tipo por caminho), no dono do passo de desvio
  do tipo (com a skill ligada); os itens de rubrica do toolkit, no revisor. Colisão entre toolkits do projeto →
  recusa (código 1, nada gravado). Ver [toolkits.md](toolkits.md#tipos).
- **Regra de chamada**, em todo agente de papel: chama **em linha** → roda o fluxo chamado e volta ao passo; chama
  **subagente** → chama o agente e continua com a resposta (sem ele, carrega a skill do fluxo); **passa a** → o fluxo
  termina, diz a próxima (o agente dono do outro fluxo) e para.

## Como as permissões são montadas

- **Leitura:** o projeto, o power (as skills compiladas; no opencode, `~/.config/opencode`) e `~/.sabia/toolkits/`; negados `.env*`, `*.pem`, `*.key`, `~/.ssh`, `~/.aws`, as credenciais dos MCPs
  e o bundle. Os agentes leem e procuram com as ferramentas do agente, não com `cat`/`grep` no shell.
- **Shell — por nível** (`niveis_shell`): `nenhum` (sem a ferramenta de shell) · `leitura` (`git-leitura`,
  `worktree`, `creditos`; o pesquisador) · `trabalho` = **`*`**: liberado para quem escreve no projeto, menos o
  `negar` e o push do papel, mais poucos extras por papel (`shell_perguntar`, `shell_negar`; o `shell_permitir` só
  vale no `leitura`): o `git worktree add` do orquestrador só sem `..`, o `git reset --keep origin/*` com `ask` no
  desenvolvedor e no orquestrador, o `curl` com `ask` no verificador (e o `wget`), o push da base negado no revisor e
  no verificador. No `leitura`, comando fora da lista → o Kiro pergunta (sem interação, é negado), e cada grupo tem
  exceções (`exclude`) que caem em "perguntar" (`git log --output`…).
- **O que o `negar` segura** (`shell.negar`, em todos; o deny sempre vence, e o curinga no início pega
  `cd <worktree> && git …`): `git -C`/`-c` (escondem o subcomando das regras), merge, rebase, `pull --rebase`/`--no-ff`,
  `commit -n`, `--no-verify`, `reset --hard`, `clean`, `stash`, `restore`, `checkout --`/`.`, `--discard-changes`,
  `worktree remove`, `branch -D`/`-M`/`-f`, `switch`/`checkout -f`, `--force`, `--delete`, `--upload-pack`/`--receive-pack`,
  `gh pr merge`, `glab mr merge`, `rm -rf`; os arquivos dos agentes e do harness citados no comando (`.kiro/agents`,
  `.kiro/settings`, `.opencode/`, `opencode.json`, `.sabia/config`, `.sabia/fluxo/`, `.sabia/padrao/`); e
  credenciais e o bundle em qualquer comando (`.env`, `.ssh`, `.aws`, `~/.config/mcp-*`, `*.pem`, `*.key`).
- **Lacuna do shell liberado:** a negação é por trecho do comando. `grep -r` no projeto, glob ou variável chegam a um
  `.env` ou a um arquivo do harness sem citá-lo. A leitura pela ferramenta continua negada, e o prompt manda buscar com
  as ferramentas do agente; o gerador repete a lacuna no fim da saída, por alvo.
- **Push:** desenvolvedor, revisor, verificador e orquestrador — `*git push*` pergunta sempre (`ask`, sem "sempre
  permitir"); `push-perigoso` nega `-f`, `+ref`, `:ref`, `--mirror`, `--all`, `--prune`, o push sem a branch nomeada
  (`git push`, `git push origin`, `HEAD`, `@`: as skills sempre a nomeiam) e outra ref para a base (`<ref>:<base>`,
  `heads/<base>`). O push da base (`git push origin <base>`) pergunta no desenvolvedor e no orquestrador, só para os
  registros de situação da fatia, com os arquivos conferidos antes
  ([Gravar na base](../../sa-fatiar/references/backlog.md#gravar-na-base)); nos dois, `git reset --keep origin/*`
  também pergunta (desfaz o commit de registro de um push recusado). Revisor e verificador: push da base negado
  (`shell_negar`). Produto, especificador e pesquisador: push negado.
- **MCP do power** (`elm`, `gitlabpr`): regra `power` `sabia/<servidor>/<tool>` — leitura liberada (`mcp_libera`),
  escrita com confirmação (`mcp_pergunta`), e **toda tool do catálogo que o papel não usa, negada**: a IDE chama
  tool de power pela `kiro_powers`, fora do filtro de `tools`. Comentar e anexar: todo papel com tarefa, só na
  própria (regra em [`sabia/references/elm.md`](../../sabia/references/elm.md)). Merge do PR: só o desenvolvedor.
- **MCP do projeto:** `tools` (`@servidor/tool`), regra `mcp` `allow` e `includeMcpJson: true` — o gerador faz os
  três a partir de `agentes.sa-<papel>.mcp`.
- **Subagentes:** `tools` `subagent/<nome>`, `toolsSettings.subagent` e a regra `subagent`. O subagente herda as
  regras de quem o chama (interseção, o mais restritivo vence): por isso o orquestrador já tem os comandos de build
  e verificação e escreve nas worktrees.
- **Escrita — protege só o framework:** `escrita` `nenhuma` (sem a ferramenta de escrita: o pesquisador devolve o
  `research.md` e quem chamou grava) ou `projeto` (escreve em `./**`, menos o `harness` e os `registros` de outros
  papéis). O `harness`, que nenhum agente escreve: `.sabia/config`, `sabia.md`, `http.sh`, `.sabia/fluxo/**` e
  `.sabia/padrao/**` (o override: só a sessão padrão, pela `sa-setup`), o ponteiro
  `.kiro/steering/sabia.md`, `.kiro/agents`, `.kiro/settings`, `.claude`, `.opencode`, `opencode.json`,
  `AGENTS.md`, `.git` e a pasta do produto dentro das worktrees (cada um também na raiz: o `like` do V3 exige o `/`
  antes de `**/x`). **Exceção** (`harness_libera`): o `.sabia/sabia.md` sai do harness só para o `sa-produto` e só na
  raiz (não nas worktrees nem para os agentes de toolkit) — o fluxo `sa-aprender.promover` grava a seção Regras
  aprendidas; a setup grava o resto e preserva essa seção. Os `registros`: `backlog` (`backlog.md`), `sprints` (`sprints/**`) e `epicos` (`epicos/**`, PRD
  e decisões) — produto e especificador escrevem os três; desenvolvedor e orquestrador, `backlog` e `sprints` (a
  situação da fatia e a `iniciada` do lote, na base); revisor e verificador, nenhum. A independência do revisor e do
  verificador fica no prompt e no diff do PR; quem barra relatório forjado é o merge, que confere as tarefas no
  ELM.
- **Limite: redireção.** O Kiro compara as regras só com o comando, sem o `> arquivo`: `git show … > <caminho>` passa
  pelo `allow` de `git show*`. A defesa é fora do agente — a confirmação de cada push, a revisão do PR por pessoa e
  o merge conferindo o ELM.

Conferido em 23/10/2026 com o `kiro-cli` 2.32 na engine V3: os agentes passam no
`agent validate`; comando liberado roda, comando fora da lista e exceção caem em aprovação, `commit -n` e push para
a base são negados pela regra. O `agent validate` não lê o `permissions`: o `exclude` no `fs_write` foi
conferido no motor V3 do `kiro-cli` 2.35, que o aplica aos caminhos como aos comandos.

**Mudar uma regra** é no `papeis.json` do power, com o teste
(`uv run --no-project python -m unittest test_gerar_agentes`, na pasta `scripts/`); os projetos pegam a mudança
com "atualizar os agentes do Sabiá".

## Gravação

O Kiro sempre pergunta antes de gravar em `.kiro/agents/`: o script grava
pelo shell, então a confirmação é a do comando — mostre antes o diff (o script sem `--gravar`).
