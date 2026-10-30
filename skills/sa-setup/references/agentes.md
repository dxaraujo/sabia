# Agentes — como a setup gera `.kiro/agents/sa-*.json`

Os agentes são **gerados**, nunca editados à mão. Três fontes:

| Fonte | Onde | O quê |
|---|---|---|
| `papeis.json` | [../assets/agents/](../assets/agents/papeis.json) (power) | permissões de cada papel: escrita, registros, nível de shell, push e MCPs |
| `sa-<papel>.md` | [../assets/agents/](../assets/agents/) (power) | o prompt de cada agente |
| `agentes.json` | `.sabia/config/agentes.json` (projeto, versionado) | as escolhas do projeto: caminhos, comandos, skills e MCPs por agente |

O script [../scripts/gerar_agentes.py](../scripts/gerar_agentes.py) junta as três e grava os sete agentes, mais os agentes dos passos de toolkit ligados (`.kiro/agents/<nome>.json`):

```bash
uv run --no-project python <power>/skills/sa-setup/scripts/gerar_agentes.py --projeto <raiz>            # mostra o diff e a tabela
uv run --no-project python <power>/skills/sa-setup/scripts/gerar_agentes.py --projeto <raiz> --gravar   # grava
```

Sai com código 1 (sem gravar nada) se sobrou um `{{…}}` ou se um `skill://`/`file://` não existe ou é absoluto.
"Atualizar os agentes do Sabiá" depois de atualizar o power é só rodar o script de novo: as escolhas estão no
`agentes.json`.

O formato é o **V3** do Kiro (campo `permissions`), carregado pela IDE e pela engine V3 do `kiro-cli`. A engine V2
do CLI não é suportada pelos agentes do Sabiá: use a IDE ou `kiro-cli chat --agent-engine v3`. Não rode
`/upgrade-agent` nem `kiro-cli agent upgrade` neles — os três com subagentes aparecem como `out of sync (not
rebuilt)` no `--dry-run` (por causa do `toolsSettings.subagent`, que a V3 ainda usa), e o conversor os deixa de lado.

## `agentes.json` do projeto

| Campo | O quê |
|---|---|
| `power` | a pasta do power, relativa ao home (Passo 0): `~/.kiro/powers/installed/sabia` |
| `produto`, `glossario`, `adr` | os caminhos do Passo 4 (`null` = não há) |
| `base` | a branch base, sem `origin/` — nas regras de push da base (pergunta no codificador e no orquestrador; negado nos demais) |
| `bundle` | o `rm.download` do `pa` (leitura negada: a consulta é pelas `elm_*_local`), ou `null` |
| `massa` | a pasta de massa do projeto que o verificador escreve, ou `null` |
| `elm` | `false` → nenhuma tool do `elm` em nenhum agente (`sabia/elm/*` negado) |
| `push_pr_no_loop` | `false` ("não — a pessoa abre") → o orquestrador não faz push (nem o da `iniciada` do lote, na base) nem abre PR |
| `http_sh` | `true` se a setup instalou `.sabia/http.sh` |
| `steering` | `file://` do steering de produto, tecnologia e estrutura, para todos os agentes |
| `comandos.build` | compilar, testes, teste único, lint, cobertura (padrões de shell: `mvn test*`) |
| `comandos.verificacao` | executar a aplicação ou o job, scripts de massa |
| `agentes.sa-<papel>.skills` | `skill://` das skills escolhidas no Passo 6 |
| `agentes.sa-<papel>.ler` | pastas dessas skills fora do projeto e do power (`~/.kiro/skills/<skill>/**`) |
| `agentes.sa-<papel>.mcp` | tools de MCP do projeto: `servidor/tool` (banco: só a de consulta) ou `servidor` (inteiro, ex.: browser) |
| `agentes.sa-<papel>.subagentes` | `[{"nome", "para"}]` — agentes do projeto (codificador e orquestrador) |
| `agentes.sa-<papel>.modelo` | o modelo, se não for o padrão |
| `toolkits.<nome>` | `{"pasta", "versao", "sha"}` de cada toolkit com passo ligado — `pasta` relativa ao home (`~/.sabia/toolkits/<nome>`) ou ao projeto |
| `passos` | `[{"toolkit", "skill", "agente"}]` — a skill do `toolkit.json` que tem `passo`; `agente: true` gera o agente do passo e o liga ao dono |

Todo papel com shell `trabalho` recebe `build`, `verificacao`, o `sh .sabia/verificar.sh` e, com `http_sh`, o
`sh .sabia/http.sh *`.

## Como as permissões são montadas

- **Leitura:** o projeto e o power; negados `.env*`, `*.pem`, `*.key`, `~/.ssh`, `~/.aws`, as credenciais dos MCPs
  e o bundle. Os agentes leem e procuram com as ferramentas do agente, não com `cat`/`grep` no shell.
- **Shell — por nível** (`niveis_shell`): `nenhum` (sem a ferramenta de shell) · `leitura` (`git-leitura`,
  `worktree`, `creditos`) · `trabalho` (a leitura, `git-escrita` e os comandos do projeto), mais poucos extras por
  papel (`shell_permitir`, `shell_perguntar`, `shell_negar`: `uuidgen`, o `git worktree add` do orquestrador, o
  `curl` com `ask` no verificador). Comando fora da lista → o Kiro pergunta (sem interação, é negado). Cada grupo tem
  exceções (`exclude`) que caem em "perguntar" (`git log --output`, `git add -f`…). Negados em todos (`shell.negar`):
  `git -C`/`-c` (escondem o subcomando das regras), merge, rebase, `pull --rebase`/`--no-ff`, `commit -n`,
  `--no-verify`, `reset --hard`, `clean`, `stash`, `restore`, `checkout --`/`.`, `--force`, `--delete`, `rm -rf`,
  credenciais e o bundle em qualquer comando.
- **Push:** codificador, revisor, verificador e orquestrador — `git push *` pergunta sempre (`ask`, sem "sempre
  permitir"); `push-perigoso` nega `-f`, `+ref`, `:ref`, `--mirror`, `--all`, `--prune`, o push sem a branch nomeada
  (`git push`, `git push origin`, `HEAD`, `@`: as skills sempre a nomeiam) e outra ref para a base (`<ref>:<base>`,
  `heads/<base>`). O push da base (`git push origin <base>`) pergunta no codificador e no orquestrador, só para os
  registros de situação da fatia, com os arquivos conferidos antes
  ([Gravar na base](../../sa-fatiar/references/backlog.md#gravar-na-base)); nos dois, `git reset --keep origin/*`
  também pergunta (desfaz o commit de registro de um push recusado). Revisor e verificador: push da base negado
  (`shell_negar`). Produto, especificador e pesquisador: push negado.
- **MCP do power** (`elm`, `gitlabpr`): regra `power` `sabia/<servidor>/<tool>` — leitura liberada (`mcp_libera`),
  escrita com confirmação (`mcp_pergunta`), e **toda tool do catálogo que o papel não usa, negada**: a IDE chama
  tool de power pela `kiro_powers`, fora do filtro de `tools`. Comentar e anexar: todo papel com tarefa, só na
  própria (regra em [`sabia/references/elm.md`](../../sabia/references/elm.md)). Merge do PR: só o codificador.
- **MCP do projeto:** `tools` (`@servidor/tool`), regra `mcp` `allow` e `includeMcpJson: true` — o gerador faz os
  três a partir de `agentes.sa-<papel>.mcp`.
- **Subagentes:** `tools` `subagent/<nome>`, `toolsSettings.subagent` e a regra `subagent`. O subagente herda as
  regras de quem o chama (interseção, o mais restritivo vence): por isso o orquestrador já tem os comandos de build
  e verificação e escreve nas worktrees.
- **Escrita — protege só o framework:** `escrita` `nenhuma` (sem a ferramenta de escrita: o pesquisador devolve o
  `research.md` e quem chamou grava) ou `projeto` (escreve em `./**`, menos o `harness` e os `registros` de outros
  papéis). O `harness`, que nenhum agente escreve: `.sabia/config`, `sabia.md`, `http.sh`, `verificar.sh`, o ponteiro
  `.kiro/steering/sabia.md`, `.kiro/agents`, `.kiro/settings`, `.claude`, `.opencode`, `opencode.json`,
  `AGENTS.md`, `.git` e a pasta do produto dentro das worktrees (cada um também na raiz: o `like` do V3 exige o `/`
  antes de `**/x`). Os `registros`: `backlog` (`backlog.md`), `sprints` (`sprints/**`) e `epicos` (`epicos/**`, PRD
  e decisões) — produto e especificador escrevem os três; codificador e orquestrador, `backlog` e `sprints` (a
  situação da fatia e a `iniciada` do lote, na base); revisor e verificador, nenhum. A independência do revisor e do
  verificador fica no prompt e no diff do PR; quem barra relatório forjado é o merge, que confere as tarefas no
  ELM.
- **Limite: redireção.** O Kiro compara as regras só com o comando, sem o `> arquivo`: `git show … > <caminho>` passa
  pelo `allow` de `git show*`. A defesa é fora do agente — a confirmação de cada push, a revisão do PR por pessoa e
  o merge conferindo o ELM.

Conferido em 23/10/2026 com o `kiro-cli` 2.32 na engine V3, com as regras de então: os seis passam no
`agent validate`; comando liberado roda, comando fora da lista e exceção caem em aprovação, `commit -n` e push para
a base são negados pela regra. O `agent validate` não lê o `permissions`: o `exclude` no `fs_write` foi
conferido no motor V3 do `kiro-cli` 2.35, que o aplica aos caminhos como aos comandos.

**Mudar uma regra** é no `papeis.json` do power, com o teste
(`uv run --no-project python -m unittest test_gerar_agentes`, na pasta `scripts/`); os projetos pegam a mudança
com "atualizar os agentes do Sabiá".

## Gravação

O Kiro sempre pergunta antes de gravar em `.kiro/agents/`: o script grava
pelo shell, então a confirmação é a do comando — mostre antes o diff (o script sem `--gravar`).
