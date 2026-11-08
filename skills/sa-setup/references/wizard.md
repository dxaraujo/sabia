# Cartões do wizard — o que a pessoa vê

A setup é a porta de entrada do produto. Toda mensagem dela é um destes cartões, **copiado como está**: troque só
o que está entre `<…>`, apague as linhas marcadas `(se …)` quando a condição não vale e nunca invente ícone,
coluna ou formato. O que está entre `<…>` descreve o campo — **nunca é valor sugerido**: tudo vem do projeto, do ELM
ou da pessoa. `<a | b>` no cartão = escolha **uma** das opções (o `|` não vai para a tela). Tabela sem linha para mostrar → a linha `| — | nada a mostrar | ➖ |`, com `—` nas colunas que sobram, até o número de colunas da tabela; nunca linha em branco
como separador.

**Só o que é das ferramentas do time.** Linha, aviso ou valor de uma ferramenta fora dos `alvos` não aparece, nem com
➖: a linha cujo item termina em `(Kiro)` ou `(opencode)` sai quando a ferramenta não está nos alvos,
e os números das outras não mudam. `(se a sessão é do Kiro)` vale pela ferramenta desta sessão. Onde o cartão diz "a
ferramenta", use o nome da que está nos alvos.

## Legenda (fixa — só estes ícones)

| Uso | Ícones |
|---|---|
| Trilha das etapas | `●` feita · `◉` atual · `○` por vir |
| Status | ✅ ok · ⚠️ atenção · ❌ falhou · ⏸️ não testado (sempre com o motivo) · ➖ não se aplica |
| De onde veio o valor | 🔍 detectado · 📐 padrão do Sabiá · 🙋 você · 🧩 ELM |
| Seleção (primeira coluna da tabela) | `[✅]` marcado · `[ ]` desmarcado |
| Permissão do agente | 🟢 livre · 🟡 pergunta antes · 🔴 negado |
| Modo | ✨ configuração inicial · 🔄 atualização |

"✅" só com resposta real (comando que rodou, MCP que respondeu); falhou por rede ou credencial → ⏸️ com o motivo,
nunca "testado".

## Peças de todo cartão

**Cabeçalho** (primeira linha de toda mensagem de etapa; a trilha tem 9 posições):

```
## 🧭 Etapa <n> de 9 · <nome da etapa>
`<●●◉○○○○○○>` <uma frase: o que esta etapa decide>
```

**Pergunta** (última coisa da mensagem; **uma** por mensagem):

```
> ❓ **<pergunta>**
> `ok` aceita tudo · `<n>: <novo valor>` muda a linha <n> · `voltar` refaz a etapa anterior
```

Escolha numa lista → as opções numeradas logo acima da pergunta, a recomendada com `⭐ (recomendado)`.

**Fechamento** (uma linha, antes do cabeçalho da etapa seguinte):

```
✔ **<nome da etapa>** — <valor 1> · <valor 2> · <valor 3>
```

**Trabalhando** (uma linha antes de ler ou rodar várias coisas; nada de narrar cada ferramenta):

```
🔎 <Lendo o projeto | Rodando os comandos | Consultando o ELM>…
```

**Bloqueio** (algo impede seguir):

```
### ⚠️ <o que aconteceu, em uma frase>
| # | Opção | O que acontece |
|---|---|---|
| 1 | <corrigir agora> | <…> |
| 2 | <seguir sem> | <…> |
| 3 | parar aqui | nada é gravado |
```

## W0 · Boas-vindas e pré-checagem (passo `pre-checagem`)

```
## 👋 Configurar o Sabiá · <projeto>
<✨ configuração inicial | 🔄 atualização da configuração de <data do sabia.md>>

O Sabiá organiza o trabalho do time em fatias pequenas: alinhar antes, teste primeiro com backpressure, revisão e
verificação independentes e o MR lido por uma pessoa. São **9 etapas**, e **nada é gravado antes da etapa 8**,
quando você confere tudo numa tela só.

| # | Etapa | O que decide |
|---|---|---|
| 1 | Projeto | tipo, stack, módulos e regras críticas (`## Projeto` do `.sabia/sabia.md`) |
| 2 | Comandos | compilar, testar, lint e cobertura, rodados uma vez (`## Comandos` do `.sabia/sabia.md`) |
| 3 | Git, GitLab e banco | branch base, MR, consulta ao banco |
| 4 | Especificação e ELM | formato da spec, pasta do produto, ELM, glossário, Sustentação |
| 5 | Skills | o que o projeto já sabe fazer (toolkits) |
| 6 | Agentes | os extras de cada um dos 5 agentes |
| 7 | Regras e autonomia | permissões, verificação de aceite e backpressure |
| 8 | Gravação | tudo numa tela; só então grava |
| 9 | Conferência | confere e diz o próximo passo |

### Pré-checagem
| # | Item | Status |
|---|---|---|
| 1 | Repositório git | <✅ `<raiz>` | ❌ sem git — o fluxo depende de branch e MR> |
| 2 | Shell | <✅ bash/zsh | ✅ fish — comandos compostos vão em `bash -c '…'`> |
| 3 | `uv` (gera os agentes) | <✅ <versão> | ❌ instale: https://docs.astral.sh/uv/> |
| 4 | `kiro-cli`, que valida os agentes (Kiro) | <✅ <versão> | ➖ sem ele, a conferência é só a do gerador> |
| 5 | Credencial do GitLab | <⏸️ arquivo existe — a conexão é testada na etapa 3 | ❌ sem arquivo — modelo na etapa 3> |
| 6 | Ferramentas do time | <só as dos alvos, separadas por ` · `: <ferramenta> ✅ 🔍 <onde detectou> | <ferramenta> ❌ skills do Sabiá não instaladas — `npx sabia instalar --alvo <ferramenta>`> (Kiro: só no motor v3 — a IDE ou `kiro-cli chat --agent-engine v3`) |
| 7 | Sabiá instalado | <✅ <versão> | ⚠️ o projeto foi configurado com o Sabiá <versão do agentes.json> e o seu é o <versão> — `npx sabia atualizar` ou regenerar com a sua> |

Na linha 6, as ferramentas fora dos alvos não aparecem; a pessoa acrescenta uma com `6: + <ferramenta>`.

> ❓ **Começamos pela etapa 1?**
> `ok` começa · `<n>: …` corrige um item da pré-checagem
```

## W0-A · Modo atualização (passo `pre-checagem`)

No lugar da tabela de etapas do W0 (a pré-checagem continua):

```
### 🔄 Configuração atual
| # | Etapa | Hoje | Mudou desde então |
|---|---|---|---|
| 1 | Projeto | <tipos · linguagem e versão · frameworks principais> | <➖ | ⚠️ <o que mudou no repositório>> |
| 2 | Comandos | <compilar · testes · cobertura> | <➖ | ⚠️ …> |
| 3 | Git, GitLab e banco | <base `<…>` · MR <…> · banco <…>> | <➖ | ⚠️ …> |
| 4 | Especificação e ELM | <`formato_spec` · `<pasta>` · ELM <`pa_<nome>` | não>> | <➖ | ⚠️ …> |
| 5 | Skills | <n> skills · <n> agentes do projeto | <➖ | ⚠️ <n> novas: `<…>` · <n> sumiram: `<…>`> |
| 6 | Agentes | gerados com o Sabiá <versão do agentes.json> | <➖ | ⚠️ o seu é o <versão instalada> → regenerar> |
| 7 | Regras e autonomia | <Executar · URL de teste | ➖> | <➖ | ⚠️ …> |

> ❓ **O que muda?**
> `nada` só regenera os agentes · `<n>` refaz a etapa <n> · `<n>,<m>` refaz várias
```

## W1 · Projeto (passo `projeto`)

```
## 🧭 Etapa 1 de 9 · Projeto
`◉○○○○○○○○` Entendi o projeto assim — confira.

| # | Item | Valor | Fonte |
|---|---|---|---|
| 1 | Tipos | <tipos detectados — tabela de toolkits.md> | 🔍 <sinal e arquivo onde apareceu> |
| 2 | Stack | <linguagem e versão · frameworks · banco> | 🔍 <arquivo de build> |
| 3 | Módulos | <único | lista dos módulos> | 🔍 <arquivo de build> |
| 4 | Testes e cobertura | <framework de teste · ferramenta de cobertura e gate | sem cobertura> | 🔍 <arquivo de build> |
| 5 | Steering de produto (Kiro) | <✅ `.kiro/steering/product.md` | ❌ não há> | 🔍 |
| 6 | Steering de tecnologia (Kiro) | <✅ `.kiro/steering/tech.md` | ❌ não há> | 🔍 |
| 7 | Steering de estrutura (Kiro) | <✅ `.kiro/steering/structure.md` | ❌ não há> | 🔍 |
| 8 | Regras críticas | <1. … 2. … | nenhuma além do steering> | 🔍 <tech.md> |
| 9 | IA já configurada | <✅ `AGENTS.md` · `.kiro/steering/*.md` · <outros arquivos de instrução de agente> | ❌ não há> — o que houver é lido como fonte e continua valendo como steering de base; o Sabiá não o altera | 🔍 |

> ❓ **Está certo?**
> `ok` aceita tudo · `<n>: <novo valor>` muda a linha <n> · steering ❌ → `<n>: <arquivo>`, `<n>: gerar` (você roda o "Generate Steering Docs" do Kiro e eu releio) ou `<n>: nenhum`
```

## W2 · Comandos (passo `comandos`)

Duas mensagens: a proposta (Status `⏸️ ainda não rodado`) e, depois do `ok`, o mesmo cartão com o resultado
**de cada comando rodado** e a pergunta `> ❓ **Fecho os comandos assim?**`. `pular` → Status `⏸️ você pulou`.

```
## 🧭 Etapa 2 de 9 · Comandos
`●◉○○○○○○○` Backpressure em camadas: o trecho tocado a cada alteração, a suíte completa antes do MR.

| # | Ação | Comando | Status | Fonte |
|---|---|---|---|---|
| 1 | Compilar | `<comando do projeto>` | <✅ <tempo> | ❌ <erro em uma linha> | ⏸️ ainda não rodado> | 🔍 <arquivo de onde veio> |
| 2 | Testes | `<…>` | <…> | <…> |
| 3 | Teste do trecho tocado | `<… -Dtest={alvo} …>` | <…> | <…> |
| 4 | Lint | `<… | não há>` | <… | ➖> | <…> |
| 5 | Cobertura e gate | `<…>` · <gate> | <…> | <…> |

> ❓ **Rodo os comandos uma vez para confirmar?** (recomendado — backpressure que não roda não é backpressure)
> `ok` roda · `pular` segue sem rodar · `<n>: <novo comando>` troca um
```

## W3 · Git, GitLab e banco (passos `git`, `gitlab` e `banco`)

```
## 🧭 Etapa 3 de 9 · Git, GitLab e banco
`●●◉○○○○○○` Para onde vão as branches, como o MR é aberto e como o agente consulta o banco.

| # | Item | Valor | Status | Fonte |
|---|---|---|---|---|
| 1 | Branch base | `<branch>` | ✅ | 🔍 <sinal: origin/HEAD · destino dos merges · única remota> |
| 2 | Push na base | o estado e os documentos de planejamento vão direto nela | <✅ aceita | ⚠️ protegida — diga outra base> | 🔍 |
| 3 | Prefixo das branches | `<prefixo>` | ✅ | 🔍 <branches remotas> |
| 4 | Padrão de commit | `<padrão>` (o id do WI só com "Id no commit: sim" no `acordos.md`) | ✅ | 🔍 <git log> |
| 5 | MR | <MCP `gitlabpr` | entregar título e descrição> | <✅ respondeu | ⏸️ sem rede — testo de novo na etapa 9 | ❌ sem credencial> | 🔍 |
| 6 | Banco (só consulta) | <`<servidor>/<tool>` | não há> | <✅ | ⏸️ …> | 🔍 <arquivo de MCP onde está> |

> ❓ **Está certo?**
> `ok` aceita tudo · `<n>: <novo valor>` muda a linha <n> · `5: entregar título e descrição` segue sem o MCP

(se a branch base for ambígua) mostre os candidatos **antes** desta tabela e pergunte só isso:

| # | Branch | Sinal |
|---|---|---|
| 1 | `<branch>` ⭐ (recomendado) | <sinal mais forte: destino de <n> dos últimos <m> merges> |
| 2 | `<outra>` | <origin/HEAD> |

> ❓ **Qual é a branch base?**
> `<n>` escolhe · `<branch>` diz outra
```

## W4 · Especificação e ELM (passos `formato-spec` a `sustentacao`)

```
## 🧭 Etapa 4 de 9 · Especificação e ELM
`●●●◉○○○○○` Onde a spec e o produto moram e se o projeto usa o ELM.

| # | Item | Valor | Fonte |
|---|---|---|---|
| 1 | Formato da spec | <Kiro (`.kiro/specs/`) — alvo Kiro | Kiro ⭐ (padrão da empresa) | OpenSpec (`openspec/changes/`)> | <📐 | 🙋> |
| 2 | Pasta do produto | `.sabia/planejamento` — backlog, épicos, fatias, sprints, Sustentação, ATAs, protótipos | <🔍 existe | 📐> |
| 3 | Usa ELM | <sim — `pa_<nome>` (da `sa-elm.setup`) | não> | <🧩 | 🙋> |
| 4 | Glossário | <GL do DOORS | `.sabia/glossario.md` (será criado) | não há> | <🧩 | 🙋> |
| 5 | ADRs | <`docs/adr/` | não há> | <🔍 | 🙋> |
| 6 | REG com dados técnicos | <não ⭐ | sim> | 📐 |
| 7 | Telas | <sim ⭐ (projeto `frontend`; o protótipo só vale aprovado pelo cliente) | não ⭐> | <🔍 tipos da etapa 1 | 📐> |
| 8 | Casos de uso | <não ⭐ | sim (o que o projeto já descreve em UC; o novo, em HF)> | 📐 |

### Sustentação
| # | Categoria | Descrição | Exemplo |
|---|---|---|---|
| 1 | `AT` atendimento | <…> | <…> |
| 2 | `IM` implantação | <…> | <…> |
| 3 | `BD` banco de dados | <…> | <…> |
| 4 | `IN` infra | <…> | <…> |
| 5 | `OP` operação | <…> | <…> |
| 6 | `EX` apoio a outros times | <…> | <…> |

> ❓ **Está certo?**
> `ok` aceita tudo · `<n>: <valor>` muda a linha <n> · `S<n>: <descrição> · <exemplo>` muda uma categoria
```

"Usa ELM" é perguntado antes do cartão, numa mensagem só (`> ❓ **Usa ELM?**`). Com sim, a `sa-elm.setup` roda com os
cartões dela e devolve os dados; a linha 3 mostra o `pa` que ela gravou.

## W5 · Skills (passo `toolkits`)

```
## 🧭 Etapa 5 de 9 · Skills
`●●●●◉○○○○` O que já existe para os agentes usarem. Na próxima etapa você escolhe, agente por agente.

| # | Skill | Para quê | Origem | Toolkit | Papéis | Autor | Stack |
|---|---|---|---|---|---|---|---|
| 1 | `<nome da skill>` | <início da description> | <projeto | usuário | power `<nome>`> | <`<nome>` 🔍 detectado | `<nome>` · tipo `<tipo>` (sugerido) | `<nome>` ↳ customiza `<base>` <versão> | —> | <`<skills[].papeis>` | —> | <`<autor.nome>` (<autor.area>) | —> | <`<stack>` 🔍 casa | `<stack>` | —> |

(se há toolkit com `customiza`) Logo abaixo da tabela, uma linha por cópia: `↳ <cópia> customiza <base> <versão>, por <autor.nome> (<autor.area>): <mudanças>`
— com a base também presente, `<base>` fica fora (substituído pela cópia); base mais nova que a versão da cópia → ⚠️.

(só se alguma skill traz `passo`) Desvios de toolkit — a skill assume um passo do Sabiá que aceita desvio; ligados na próxima etapa:

| # | Toolkit | Passo | Para | Skill | Agente |
|---|---|---|---|---|---|
| 1 | `<toolkit>` <versão> | <`sa-desenvolver.codificar.tarefa` | ❌ `<id>` não aceita desvio> | <quando usar> | `<skill>` | <`<agente>` | —> |

(só se algum toolkit traz `tipos`) Tipos com skill de toolkit — a skill do toolkit, com o fluxo e o padrão do tipo,
escreve o tipo no passo de desvio dele (coluna Desviável do catálogo):

| Tipo | Skill | Fluxo e padrão | Toolkit | Passo de desvio |
|---|---|---|---|---|
| `<sigla>` | `<skill>` | `<fluxo>` <com o padrão `<padrão>`> <ou — (as references da skill)> | `<toolkit>` <versão> | `<id do passo>` |

Ligar ao projeto — um toolkit de tipo por linha (marcado o detectado; desmarcado o sugerido):

| | # | Toolkit | Tipos |
|---|---|---|---|
| <[✅] | [ ]> | <n> | `<toolkit>` <versão> <🔍 detectado | (sugerido)> | `<sigla>` · … |

Agentes do projeto (podem virar subagentes dos agentes primários):

| # | Agente | Para quê | Status |
|---|---|---|---|
| 1 | `<nome do agente>` | <início da description> | <✅ | ⚠️ tem campo `hooks` — a IDE ignora> |

<o bloco Fluxos (W5-F)>

> ❓ **Falta alguma skill ou agente que eu não achei?**
> `ok` segue · `<caminho>` acrescenta · (se há toolkit de tipo) `toolkit <n>: sim` liga · `toolkit <n>: não` desliga
```

## W5-F · Fluxos (passo `toolkits`)

Na mesma mensagem do W5, antes da pergunta; também no C4 ("o que este projeto mudou?"):

```
### 🔀 Fluxos — o que este projeto customizou
| # | Ponto | Mudança | Arquivo | Base |
|---|---|---|---|---|
| 1 | `<skill>.<fluxo>.<passo> | <skill>/<nome>.md>` | <trocado | inserido depois de `<passo>` | removido | padrão trocado> | `<.sabia/fluxo/… | .sabia/padrao/…>` | <✅ igual à do Sabiá instalado | ⚠️ a base mudou desde a cópia — compare e funda à mão | ➖ inserido ou removido | ❌ <sem `base` | não é passo nem padrão do Sabiá> — o gerador recusa> |

Nada customizado → a linha `| — | o Sabiá como vem | — | — | ➖ |`. Para mudar: "customizar …", "descustomizar …".
```

## W6 · Um agente (passo `perfis`) — cinco cartões, um por mensagem

```
## 🧭 Etapa 6 de 9 · Agentes — <n> de 5 · `sa-<nome>`
`●●●●●◉○○○` <o agente em uma frase: ex. "leva a fatia de pronta ao merge">

**Já vem do perfil:** <as skills do agente no `perfis.json`> · <primário | subagente>

| | # | Skill extra | Para quê · origem |
|---|---|---|---|
| <[✅] | [ ]> | 1 | `<nome da skill>` | <início da description> · <projeto | usuário | toolkit `<nome>` 🔍> |

| | # | MCP | Acesso |
|---|---|---|---|
| <[✅] | [ ]> | <n> | `<servidor>/<tool>` | 🟢 só consulta |
| <[✅] | [ ]> | <n> | `<servidor de browser>` | 🟢 servidor inteiro (só `sa-verificador`, projeto `frontend`) |

(só nos primários) subagentes: os do perfil, `[✅]` fixos, e os agentes do projeto, desmarcados
| | # | Subagente | Para quê |
|---|---|---|---|
| [✅] | <n> | `sa-revisor` | revisão do agente e revisão do plano |
| [ ] | <n> | `<agente do projeto>` | <início da description> |

(só no dono de um passo com desvio de toolkit da etapa 5)
| | # | Desvio de toolkit | Para | Agente |
|---|---|---|---|---|
| <[✅] | [ ]> | <n> | `<skill>` · toolkit `<nome>` | <quando usar> | <[ ] `<agente>` — delegar a ele | — sem agente> |

| Item | Valor |
|---|---|
| Modelo | padrão da ferramenta |

> ❓ **Confirma o `sa-<nome>`?**
> `ok` · `tirar 3,5` · `pôr 7` · `só 1,2` · `nenhuma skill` · `modelo: <nome>`
```

Linhas numeradas em sequência pelas tabelas, para "tirar 3,5" valer em qualquer uma. No desvio, `pôr <n>` liga a
skill e `agente <n>` marca também o agente (só com a skill ligada). Toda opção aparece, marcada ou não: marcadas
primeiro. Depois de um ajuste, mostre o cartão de novo antes de pedir o "ok" do agente.

## W7 · Regras e autonomia (passos `regras-perfis`, `verificacao` e `autonomia`)

```
## 🧭 Etapa 7 de 9 · Regras e autonomia
`●●●●●●◉○○` O que cada agente pode fazer sozinho e o que sempre passa por uma pessoa.

| # | Item | Valor | Fonte |
|---|---|---|---|
| 1 | build (`sa-desenvolvedor`, `sa-especificador`) | 🟢 ler e editar · 🔴 harness e segredos · 🟡 push, merge, curl, wget · 🔴 rebase, `--force`, `reset --hard`, `--no-verify` · GitLab 🟢 leitura 🟡 escrita | 📐 fixo |
| 2 | só leitura (`sa-pesquisador`, `sa-revisor`) | 🟢 ler · 🔴 editar · comandos e MCP só de leitura | 📐 fixo |
| 3 | `sa-verificador` | só leitura + 🟢 Executar, curl na URL de teste e o `CT.csv` | 📐 fixo |
| 4 | ELM | <🟢 leitura · 🟡 escrita nos primários · 🔴 nos subagentes e no autopilot | ➖ sem ELM> | <🧩 | ➖> |
| 5 | Autopilot | 🟢 push da própria branch, merge da base nela, abrir ou atualizar o MR · 🔴 merge do MR, ELM e rede | 📐 fixo |
| 6 | Executar · URL de teste | <`<comando>` · `<url>` | `<job e parâmetros>` · ➖> | <🔍 | 🙋> |
| 7 | Backpressure | trecho tocado a cada alteração · suíte completa antes do MR · baseline do CI | 📐 fixo |
| 8 | Disjuntor do autopilot | no `acordos.md` (`sa-planejamento.inicial`) | 📐 |

(se o projeto é `backend` ou `frontend` e a URL não está no repositório)
> ❓ **Qual é a URL do ambiente de teste?** (nunca a de produção)

(senão)
> ❓ **Está certo?**
> `ok` · `6: <comando> · <url>`
```

## W8 · Gravação (passos `sabia-md` a `gitignore`)

```
## 🧭 Etapa 8 de 9 · Gravação
`●●●●●●●◉○` Tudo numa tela. Nada foi gravado ainda.

### Projeto
| Item | Valor |
|---|---|
| Projeto | <nome> · <tipos> · <stack> |
| Comandos | compilar `<…>` · testes `<…>` · cobertura `<…>` (<✅ rodados | ⏸️ não rodados>) |
| Git | base `<…>` · prefixo `<…>` · commit `<…>` · MR <…> |
| Especificação | `<formato_spec>` · `.sabia/planejamento` · ELM <`pa_<nome>` | não> |
| Fluxos | <➖ o Sabiá como vem | <n> customizações — bloco Fluxos da etapa 5 (<n> ⚠️ base mudou)> |

### Agentes
<a tabela que o gerador imprimiu (sem `--gravar`), colada como está — mesmas colunas, mesma ordem>

### Arquivos
| Arquivo | Ação |
|---|---|
| `.sabia/sabia.md` | <criar | alterar — diff abaixo (Regras aprendidas preservadas) | manter> |
| `.sabia/config/agentes.json` | <criar | alterar> · `"sabia": "<versão instalada>"` |
| `.kiro/agents/sa-*.json`, os 5 e os dos toolkits (Kiro) | <criar | alterar — diff abaixo> |
| `.kiro/steering/sabia.md`, ponteiro do `sabia.md` (Kiro) | <criar | manter> |
| `.opencode/agents/sa-*.md`, os 5 e os dos toolkits (opencode) | <criar | alterar — diff abaixo> |
| `opencode.json` com `.sabia/sabia.md` em `instructions` (opencode) | <criar | acrescentar | manter> |
| `.sabia/planejamento/` | <criar `backlog.md` e as pastas | acrescentar <…> | manter> |
| `.gitlab/merge_request_templates/Default.md` | <criar | ➖ já existe> |
| `<glossário>` | <criar | manter | ➖ não há> |
| `.gitignore` · `.gitattributes` | <acrescentar `.sabia/local/` · `.sabia/creditos/*.csv merge=union` | manter> |
| `CODEOWNERS` | <➖ existe | sugestão abaixo — o time grava> |

(se a sessão é do Kiro) O Kiro pede confirmação para cada arquivo em `.kiro/agents` — se recusar um
por engano, diga `regravar <arquivo>`.

> ❓ **Gravo tudo?**
> `ok` grava · `<item>: <mudança>` ajusta antes · `parar` sai sem gravar
```

## W9 · Conferência e pronto (passos `conferir`, `commit` e `proximo`)

```
## 🧭 Etapa 9 de 9 · Conferência
`●●●●●●●●◉` Conferindo o que foi gravado.

| # | Verificação | Status |
|---|---|---|
| 1 | Agentes gerados = os combinados (tabela do gerador) | <✅ | ❌ <diferença>> |
| 2 | `kiro-cli agent validate` e `agent list`: os 5 e os de toolkit (Kiro) | <✅ | ❌ <agente: campo> | ➖ sem kiro-cli> |
| 3 | Agente de toolkit com as permissões do dono do passo (Kiro) | <✅ | ❌ <agente> | ➖ sem toolkit> |
| 4 | `opencode debug agents` lista os `sa-*` (opencode) | <✅ | ❌ <agente que falta>> |
| 5 | Comandos do `.sabia/sabia.md`, um a um | <✅ <comando> <tempo> · … | ❌ <primeiro que falhou: erro em uma linha> | ⏸️ não rodado> |
| 6 | GitLab responde (`gitlab_listar_mrs`) | <✅ | ⏸️ <motivo> | ➖> |
| 7 | `pa` do ELM válido (`elm_status`) | <✅ | ❌ <faltando> | ➖ sem ELM> |
| 8 | Caminhos citados no `sabia.md` e no `agentes.json` existem | <✅ | ❌ <caminho>> |
| 9 | Ferramentas que varrem a raiz ignoram `.sabia/local/` | <✅ | ⚠️ <ferramenta>> |
| 10 | Workspace confiável (Kiro) | <✅ | ⚠️ confie no workspace para carregar agentes e skills> |
```

Depois, numa mensagem só:

```
## ✅ Sabiá pronto · <projeto>
`●●●●●●●●●`

| Quero… | Diga | Agente |
|---|---|---|
| montar equipe e acordos | "monta o planejamento" | `sa-especificador` |
| registrar uma demanda nova | "nova demanda: …" | qualquer um |
| começar o que é meu | "minha próxima" ou "vamos trabalhar na <id>" | o do seu papel |
| saber onde parei | "onde parei?" | qualquer um |

### Próximo passo
<1. **Monte o planejamento** (`sa-planejamento.inicial`): equipe e acordos. | 1. **Nova demanda: …** (`sa-triar`).>

### Commit
`<git add … && git commit -m "<padrão de commit, com a descrição configurar o Sabiá>">`

> ❓ **Faço o commit?**
> `ok` commita · `não` deixa para você
```

## C1 · Customizar — achar o ponto

```
## 🔀 Customizar · <o pedido, em poucas palavras>
Achei o ponto assim — confira.

| # | Passo | Travas | Saídas |
|---|---|---|---|
| 1 | `<passo>` | <travas | —> | <saídas | —> |
| 2 | `<passo>` 👉 | <…> | <…> |

**<skill>.<fluxo>.<passo>** · <resumo do passo>

(se há mais de um candidato) as opções numeradas logo acima da pergunta, a melhor com `⭐ (recomendado)`.

> ❓ **É este o ponto?**
> `ok` · `<n>` escolhe outra linha · `<id>` diz o ponto
```

## C2 · Customizar — a forma

```
## 🔀 Customizar · `<skill>.<fluxo>.<passo>`

| # | Forma | O que acontece |
|---|---|---|
| 1 | trocar o passo | cópia inteira em `.sabia/fluxo/<skill>/<fluxo>/passos/<passo>.md`, com a `base`, para você editar |
| 2 | inserir um passo depois deste | `.sabia/fluxo/<skill>/<fluxo>/passos/<novo>.md` com as quatro seções + `inserir` no `<fluxo>.md` do projeto |
| 3 | remover o passo | <`remover` no `<fluxo>.md` do projeto | ➖ não removível — trava `<id>`> |
| 4 | trocar o padrão `<skill>/<nome>.md` | <cópia em `.sabia/padrao/<skill>/<nome>.md`, com a `base` | ➖ o passo não usa padrão> |

As travas do fluxo continuam valendo em qualquer forma.

> ❓ **Qual forma?**
> `<n>` · `<n>: <id do passo novo>` (inserir) · `parar` sai sem gravar
```

## C3 · Customizar — regenerar

Também no "descustomizar" (a coluna Ação diz "apagar").

```
## 🔀 Customizar · `<skill>.<fluxo>.<passo>`

| Arquivo | Ação |
|---|---|
| `<.sabia/fluxo/… | .sabia/padrao/…>` | <criado — diff contra o original abaixo | alterado | apagar> |
| `<.sabia/fluxo/<skill>/<fluxo>/<fluxo>.md>` | <`inserir` · `remover` | apagar — ficou vazio | ➖> |
| `<.kiro/agents/<dono>.json · .opencode/agents/<dono>.md>` | <alterar — o delta no prompt, diff abaixo | manter> |

(se o gerador avisou) `⚠️ <aviso do gerador>`
(se o gerador recusou) o cartão de bloqueio com a mensagem dele — nada é gravado.

> ❓ **Gravo?**
> `ok` regenera os agentes · `editar` volta ao arquivo · `parar` deixa o override sem regenerar
```

## C4 · O que este projeto mudou?

```
## 🔀 O que este projeto mudou · <projeto>
<o bloco Fluxos (W5-F)>

<por linha: o diff do override contra o original compilado — trocado, padrão; o arquivo inteiro — inserido>

> ❓ **Quer mudar algo?**
> `ok` · `customizar <n>` · `descustomizar <n>` · `fundir <n>` (base ⚠️)
```
