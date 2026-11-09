# Agentes — o gerador e o `agentes.json`

Os agentes são **gerados**, nunca editados à mão. O script [gerar_agentes.py](../scripts/gerar_agentes.py) junta:

| Fonte | Onde | O quê |
|---|---|---|
| `perfis.json` | [../assets/agents/perfis.json](../assets/agents/perfis.json) | harness, segredos, os 2 modelos de permissão, a condicional banco e os 5 agentes |
| `sa-<nome>.md` | [../assets/agents/](../assets/agents/) | o prompt de cada um dos 5 agentes |
| `agentes.json` | `.sabia/config/agentes.json` (projeto, versionado) | as escolhas do projeto |
| definições dos fluxos e `tipos.json` | o framework instalado (`~/.sabia/framework`; `--framework` troca) | o dono de cada fluxo, os passos com desvio e o passo que cria cada tipo |
| override | `.sabia/fluxo/` e `.sabia/template/` (projeto, esparso; harness) | o delta no prompt do agente que roda a skill do passo |

```bash
uv run --no-project python <pasta desta skill>/scripts/gerar_agentes.py --projeto <raiz>            # mostra o diff e a tabela
uv run --no-project python <pasta desta skill>/scripts/gerar_agentes.py --projeto <raiz> --gravar   # grava
... --alvo kiro,opencode           # padrão: os alvos do agentes.json
... --framework <dir>              # padrão: ~/.sabia/framework (os testes passam outro)
uv run --no-project python <pasta desta skill>/scripts/gerar_agentes.py --base sa-desenvolver.codificar.tarefa  # a base de uma cópia
```

Sai com código 1, sem gravar nada, se sobrou um `{{…}}`, se um caminho não existe ou é absoluto, ou se o override ou
um desvio de toolkit é recusado. O `--base <id>` imprime o sha12 do original no framework (o id do passo ou o template
`<skill>/<nome>.md`) e não gera nada. Roda no passo `agentes` do `sa-setup.configurar` e no passo `regenerar` do
`sa-setup.customizar`.

## `agentes.json`

Esquema fechado; chave desconhecida faz o gerador parar.

| Campo | Formato | O quê |
|---|---|---|
| `alvos` | `["kiro", "opencode"]` | as ferramentas do time |
| `sabia` | `"<versão>"` | a versão do Sabiá com que o projeto foi configurado; diferente da instalada → aviso |
| `formato_spec` | `"kiro"` \| `"openspec"` | o formato da spec (`.kiro/specs/` ou `openspec/changes/`) |
| `produto` | `".sabia/planejamento"` | a pasta do produto |
| `branch_base` | `"<branch>"` | a branch base, sem `origin/` |
| `prefixo_branch` | `"<prefixo>"` | o prefixo da branch de trabalho |
| `glossario` | `".sabia/glossario.md"` \| `null` | o glossário opcional (só sem GL do DOORS) |
| `adr` | `"docs/adr"` \| `null` | os ADRs opcionais |
| `elm` | `false` \| `{"pa": "<nome>", "bundle": "<caminho>", "regras": {"allow": [], "ask": [], "deny": []}}` | os dados da `sa-elm.setup`; as regras só entram com `elm` diferente de `false` |
| `toolkits` | `{"<nome>": {"pasta": "…", "versao": "…", "sha": "…" \| null}}` | os toolkits ligados |
| `passos` | `[{"toolkit": "<nome>", "skill": "<caminho no toolkit.json>", "agente": true \| false}]` | as skills de toolkit com `passo`; `agente: true` gera o agente do toolkit |
| `agentes.<agente>.modelo` | `"<modelo>"` | o modelo, se não for o padrão |
| `agentes.<agente>.mcp` | `["<servidor>/<tool>" \| "<servidor>"]` | MCPs do projeto (banco: só a tool de consulta) |
| `agentes.<agente>.skills` | `["<caminho>/SKILL.md"]` | skills extras (de toolkit) |
| `agentes.<agente>.subagentes` | `[{"nome": "<agente>", "para": "<quando usar>"}]` | agentes do projeto como subagentes |

`<agente>` ∈ `sa-desenvolvedor` · `sa-especificador` · `sa-pesquisador` · `sa-revisor` · `sa-verificador`.

## `perfis.json`

Fica em `assets/agents/perfis.json`. Contém `harness`, `segredos`, os 2 modelos de permissão (`build` e `leitura`)
com allow, ask e deny, a condicional banco e os 5 agentes, cada um com `permissao` (`build`: `sa-desenvolvedor` e
`sa-especificador`; `leitura`: `sa-pesquisador`, `sa-revisor` e `sa-verificador`), `mode` (`primary` | `subagent`),
as skills que roda e os subagentes que chama. O `sa-verificador` tem as liberações (Executar, curl na URL de teste,
`CT.csv`), e o `sa-desenvolvedor`, o bloco `autopilot`. As regras ELM não ficam aqui: vêm de `elm.regras` do
`agentes.json`.

- **Harness** (deny): `.kiro/agents`, `.kiro/settings`, `.kiro/steering/sabia.md`, `.opencode`, `opencode.json`,
  `.sabia/config`, `.sabia/fluxo` e `.sabia/template`. Liberados: `.kiro/specs`, `openspec/`, `.sabia/planejamento` e
  `.sabia/creditos`.
- **build:** ler e editar sem restrição por pasta; push, merge, curl e wget em ask; rebase, `--force`,
  `--force-with-lease`, `reset --hard`, `--no-verify` e destrutivos em deny; GitLab: leitura allow, escrita ask.
- **leitura:** ler allow, editar deny, comandos e MCP só de leitura.
- **autopilot** (o `sa-desenvolvedor` como subagente na worktree): o push da própria branch (sem `--force`), o merge
  da branch base nela e abrir ou atualizar o MR dela; merge do MR, ELM e rede bloqueados.

## Saída

- **Kiro:** `.kiro/agents/sa-<nome>.json` para os 5 agentes, só com nomes de capability em `tools` (sem
  `toolsSettings` nem `allowedTools`). `sa-pesquisador` e `sa-revisor` não recebem escrita; os limites por caminho e
  URL (o `CT.csv` e a URL de teste do `sa-verificador`) ficam no prompt. Só no motor v3 (a IDE ou
  `kiro-cli chat --agent-engine v3`).
- **opencode:** `.opencode/agents/sa-<nome>.md`, com `mode` `primary` (`sa-desenvolvedor`, `sa-especificador`) ou
  `subagent` (`sa-pesquisador`, `sa-revisor`, `sa-verificador`) e `permission`.
- O que não tem tradução num alvo sai no fim da saída do gerador.

## O prompt

As skills instaladas são compiladas e não sabem do projeto. O que o projeto mudou chega pelo prompt, montado depois
do `sa-<nome>.md`:

- **Delta do override**, no agente que roda a skill do passo: passo trocado (leia o `.sabia/fluxo/…` no lugar do da
  skill), passo inserido (o arquivo e depois de qual) e passo removido. Template trocado vai a todos os agentes.
- **Recusa** (código 1): arquivo que não é passo nem template do Sabiá; cópia sem `branch_base`; operação que não é `inserir`
  nem `remover`; `remover` de passo com trava; `inserir` com id inválido, repetido, `depois` inexistente ou sem o
  arquivo.
- **Aviso:** a `branch_base` da cópia difere do original atual → compare e funda à mão.
- **Toolkit:** `skills[].papeis` e `steering[].papeis` mapeiam 1:1 (desenvolvedor → `sa-desenvolvedor`,
  especificador e produto → `sa-especificador`, pesquisador → `sa-pesquisador`, revisor → `sa-revisor`, verificador →
  `sa-verificador`). Tipos HF, UC, REG, MSG e EL → `sa-especificador`; ET as-built → `sa-desenvolvedor`; critérios de revisão →
  `sa-revisor`; `verificacao` → `sa-verificador`. O desvio da codificação é `sa-desenvolver.codificar.tarefa`. Um
  agente de toolkit (`agentes[]`, ligado em `passos[].agente`) vira subagente do dono do passo, em
  `.kiro/agents/<toolkit>-<agente>.json` e `.opencode/agents/<toolkit>-<agente>.md`, com as permissões dele. Ver
  [toolkits.md](toolkits.md).
- **Regra de chamada:** chama **em linha** → roda o fluxo chamado e volta ao passo; chama **subagente** → chama o
  agente e continua com a resposta; **passa a** → o fluxo termina, diz a próxima e para.

## Testes

O `test_gerar_agentes.py` (na pasta `scripts/`: `uv run --no-project python -m unittest test_gerar_agentes`) cobre os
5 agentes × 2 formatos, com e sem `elm`, o bloco `autopilot`, as liberações do `sa-verificador`, o mapeamento 1:1 de
papéis e o agente de toolkit com as permissões do dono. Mudar uma regra é no `perfis.json`, com o teste; os projetos
pegam a mudança com "regenerar os agentes".
