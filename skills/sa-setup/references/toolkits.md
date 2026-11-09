# Toolkits — como a `sa-setup` encontra as skills de cada tipo de projeto

O Sabiá é o fluxo; os toolkits são extensões dos agentes dele. O fluxo não sabe programar em nenhuma stack: ele organiza **o quê** (produto), **o como** (plano) e **a
verificação**. O conhecimento de stack — Java, Spring Batch, Angular, React, Python, mainframe — e o template de
especificação de uma casa (os tipos do catálogo no formato dela) vêm de **toolkits**: pacotes de skills mantidos
**fora** do power, um por tipo de projeto, stack ou casa. A `sa-setup` é a
única parte do fluxo que sabe procurá-los; depois de configurado, cada agente só enxerga as skills que a pessoa
liberou para ele.

```
toolkit (fora do fluxo)            sa-setup                             agentes do projeto
┌──────────────────────┐   descobre   ┌──────────────────────┐  liga   ┌──────────────────────────┐
│ toolkit.json         │ ───────────► │ detecta o tipo de    │ ──────► │ sa-desenvolvedor            │
│ skills/<skill>/      │              │ projeto, propõe as   │         │   skill://…/java/SKILL.md │
│ steering/ (opcional) │              │ skills por agente e  │         │   skill://…/spring-batch… │
│ comandos de build    │              │ PERGUNTA à pessoa    │         │ sa-revisor …              │
└──────────────────────┘              └──────────────────────┘         └──────────────────────────┘
```

## Tipos de projeto

Um repositório pode ter mais de um tipo (ex.: `backend` + `batch`). O tipo decide quais toolkits a setup propõe
e quais verificações a `sa-verificar` usa para executar os cenários de aceite.

| Tipo | Sinais no repositório | Como a aceitação é verificada (template) |
|---|---|---|
| `backend` | controladores/trilhas HTTP, OpenAPI, `spring-boot-starter-web`, `express`, `fastapi`, `*.csproj` web | chamada à API (HTTP), resposta e estado no banco |
| `batch` | `spring-batch-core`, `@EnableBatchProcessing`, `Job`/`Step`, `*.jcl`, agendadores, `cron` | execução do job com os dados do cenário; contagens e estado no banco; log de execução |
| `frontend` | `package.json` com `@angular/core`, `react`, `vue`, `svelte`; `src/app`, `pages/` | navegação no browser (Playwright/MCP de browser), screenshot como evidência |
| `mobile` | `android/`, `ios/`, `pubspec.yaml`, `react-native` | emulador/dispositivo, quando houver; senão roteiro manual |
| `dados` | dbt, Airflow, notebooks, SQL de carga, Spark | execução da carga em ambiente de teste; consultas de verificação |
| `biblioteca` | pacote publicado (`<packaging>jar</packaging>` sem app, `pyproject` de lib) | testes de contrato/unidade públicos |
| `infra` | Terraform, Helm, Ansible, pipelines | `plan`/`lint`/`dry-run`; nunca `apply` |

## Onde procurar (nesta ordem)

1. **Usuário (CLI `sabia`):** `~/.sabia/toolkits/*/*/toolkit.json` (uma pasta por versão) — baixados por `sabia toolkits instalar`, com a
   origem (índice, url, ref, sha e versão) em `.origem.json`
2. **Projeto:** `.sabia/toolkits/*/toolkit.json` (o toolkit do próprio projeto, versionado)
3. **Powers instalados:** `~/.kiro/powers/installed/*/toolkit.json` (um toolkit pode ser distribuído como power;
   não achou nada ali → `~/.kiro/powers/**/toolkit.json`)
4. **Sem manifesto** (toolkit implícito): skills em `.kiro/skills/`, `.opencode/skills/` e
   `.agents/skills/` (no projeto e no home), em `~/.config/opencode/skills/` (exceto `sabia` e `sa-*`) e em
   `~/.kiro/powers/installed/*/skills/`, cada uma `*/SKILL.md`, cujo
   frontmatter traga `metadata.toolkit` (nome do toolkit) — e, opcionalmente, `metadata.papeis` e
   `metadata.tipos-de-projeto`. Skills com o mesmo `metadata.toolkit` formam um toolkit (sem passos nem agentes:
   esses só existem com manifesto).
5. **Skills avulsas** (sem toolkit): entram no inventário geral; a pessoa decide por agente, como qualquer outra.

Ficam de fora do inventário: as skills deste power (`sabia`, `sa-*`).

São pastas ocultas: liste com `ls -A <pasta pai>` e, só das que existirem, `find <pasta> -maxdepth 3 -name SKILL.md`
(ou `-name toolkit.json`), expandindo `~` para o home; nunca a busca do editor nem `ls` de um caminho que pode faltar. Pastas inexistentes são normais — siga sem comentar.
Nunca leia arquivos de credenciais que encontrar no caminho.

## Manifesto `toolkit.json`

Formato definido por [../assets/toolkit.schema.json](../assets/toolkit.schema.json). Caminhos sempre relativos
à pasta do toolkit, com `/`.

```json
{
  "$schema": "https://dxaraujo.github.io/json-schemas/sabia/toolkit.schema.json",
  "nome": "spring-batch",
  "versao": "1.0.0",
  "autor": { "nome": "<quem fez>", "area": "<área, equipe ou projeto>" },
  "descricao": "Jobs Spring Batch 5: steps chunk e tasklet, readers/writers JDBC, reexecução e testes de job",
  "tipos-de-projeto": ["batch"],
  "deteccao": {
    "arquivos": ["pom.xml", "build.gradle", "build.gradle.kts"],
    "contem": ["spring-batch-core", "org.springframework.batch"]
  },
  "skills": [
    { "caminho": "skills/spring-batch-job/SKILL.md", "papeis": ["desenvolvedor", "revisor"], "stack": ["spring-batch 5"],
      "passo": { "passo": "sa-desenvolver.codificar.tarefa", "para": "tarefa que cria ou altera um job ou step",
                 "arquivos": ["**/*JobConfig.java", "**/batch/**/*Step*.java"], "agente": "batch-job" } },
    { "caminho": "skills/spring-batch-teste/SKILL.md", "papeis": ["desenvolvedor", "verificador"] },
    { "caminho": "skills/java/SKILL.md", "papeis": ["desenvolvedor", "revisor", "pesquisador"] }
  ],
  "steering": [
    { "caminho": "steering/batch-regras.md", "papeis": ["desenvolvedor", "revisor"] }
  ],
  "comandos": {
    "compilar": "mvn -q -DskipTests compile",
    "testes": "mvn -q test",
    "teste-unico": "mvn -q -Dtest={alvo} test",
    "cobertura": "mvn -q verify",
    "lint": "mvn -q checkstyle:check"
  },
  "verificacao": "Executar o job pelo teste de integração (JobLauncherTestUtils) ou pela linha de comando do projeto com os dados do cenário; conferir BATCH_JOB_EXECUTION e as contagens nas tabelas de destino",
  "agentes": [
    { "nome": "batch-job", "descricao": "Codifica um job Spring Batch e dispara um batch-step por step independente",
      "prompt": "agentes/batch-job.md", "skills": ["skills/spring-batch-job/SKILL.md"], "subagentes": ["batch-step"] },
    { "nome": "batch-step", "descricao": "Codifica um step Spring Batch (reader, processor, writer) e os testes dele",
      "prompt": "agentes/batch-step.md", "skills": ["skills/spring-batch-teste/SKILL.md"] }
  ]
}
```

| Campo | Uso pela setup |
|---|---|
| `tipos-de-projeto` | casa com o tipo detectado → o toolkit vira **sugestão** (nunca é ligado sem a pessoa dizer sim) |
| `deteccao` | `arquivos` existe na raiz (ou em módulos) **e** algum `contem` aparece nele → toolkit "detectado" |
| `skills[].papeis` | **quem:** pré-seleciona a skill na proposta de cada agente (`desenvolvedor` → `sa-desenvolvedor`, `especificador` e `produto` → `sa-especificador`, `pesquisador` → `sa-pesquisador`, `revisor` → `sa-revisor`, `verificador` → `sa-verificador`, 1:1) — uma skill pode servir a vários |
| `skills[].stack`, `skills[].deteccao` | **onde:** a stack da skill (ex.: `java 17`, `react`); com `deteccao`, a setup só a pré-marca se o repositório casar |
| `skills[].passo` | **em que passo:** opcional — a skill assume o passo de um agente do Sabiá, pelo id (`passo`: `sa-desenvolver.codificar.tarefa`, o único com `"desvio": true` na definição do fluxo), com o `para` e, opcionais, os `arquivos` (globs) e o `agente` a quem delegar — ver [Passos](#passos) |
| `tipos` | opcional — `{"HF": {"skill": "skills/<skill>/SKILL.md", "fluxo": "<arquivo>", "template": "<arquivo>"}}` (a skill do toolkit, com o fluxo e o template do tipo, relativos à pasta do toolkit; o template é opcional e segue o nome `template/requisitos/template-<tipo>.md`): o toolkit escreve um tipo desviável do catálogo (`HF`, `UC`, `REG`, `MSG` e `EL` no `sa-prd.prd.escrever` e no `sa-especificar.elm.editar`; `ATA` no `sa-especificar.reuniao.escrever`; `ET` no `sa-desenvolver.codificar.as-built`; `CT` no `sa-verificar.verificar.casos`; `GL` não desvia — a fonte é a coluna Desviável do catálogo) — ver [Tipos](#tipos) |
| `criterios_revisao` | opcional — itens que o toolkit **acrescenta** à revisão: `id` (maiúsculas e número, ex.: `EX1`), `verificacao`, `severidade` (`BLOQUEANTE`, `IMPORTANTE` ou `SUGESTÃO`) e, opcional, o `tipo`; vão no prompt do revisor |
| `requer` | opcional — `{"sabia": "<versão mínima>"}`: o toolkit usa o catálogo de tipos e ids de passo do Sabiá; abaixo dela, o CLI recusa o toolkit |
| `autor` | **obrigatório:** `nome` e `area` de quem fez e responde pelo toolkit (`email` opcional). Aparece no W5 e no `sabia toolkits listar`; toolkit sem autor é recusado |
| `customiza` | opcional: o toolkit é uma **cópia modificada** de outro (`toolkit`, a `versao` de onde saiu e as `mudancas`) — ver [Customização](#customização) |
| `agentes[]` | agentes neutros do toolkit (nome, descrição, prompt, skills, subagentes); sem campo de permissão |
| `steering[]` | regras da stack: vira `file://` nos agentes dos papéis indicados |
| `comandos` | **proposta** para a seção Comandos do `sabia.md` quando o repositório não deixa claro; a pessoa confirma |
| `verificacao` | texto que a `sa-verificar` usa para executar os cenários de aceite desse tipo de projeto |

## Passos

Uma skill de toolkit sem `passo` é **de apoio**: o agente a carrega quando o artefato pede. Com `passo`, ela assume
um passo definido de um agente do Sabiá, e a configuração do agente decide quando usá-la (a linha **Desvios de toolkit
no passo `<id>`** que o gerador põe no prompt do dono; nada é marcado no `status.md` nem no `tasks.md`); os passos, o briefing e o contrato de cada um
estão em [passos.md](../../sabia/references/passos.md).

- **Pelo id do passo:** `passo.passo` é o id qualificado (`sa-desenvolver.codificar.tarefa`); o dono do fluxo na definição do fluxo é
  quem recebe o desvio. Só vale em passo com `"desvio": true` na definição do fluxo; passo inexistente, ou sem `desvio` → o gerador
  recusa e não grava nada. `arquivos` (globs) e `para` vão juntos na linha do prompt: casou um ou o outro → toolkit.
- **Fora da compilação:** o Sabiá não compila conteúdo de toolkit, e o toolkit não entra nas skills `sa-*` compiladas. A skill compilada leva só o gancho (⇢ na
  tabela do fluxo) no passo com desvio; o desvio vem do projeto: `agentes.json` → prompt do dono, e a tabela **Desvios de
  toolkit** do `sabia.md`, que vale também na sessão sem agente.

- A setup lista os passos no W5 e os oferece no W6 do agente dono (`sa-desenvolvedor`, dono do `sa-desenvolver.codificar.tarefa`, o único passo com `"desvio": true`). Ligado,
  vai no `agentes.json` (`toolkits`: pasta, versão e sha usados; `passos`: toolkit, skill e se usa o agente) e na
  tabela **Desvios de toolkit** do `sabia.md`.
- **Agente neutro:** o toolkit traz só a definição (`agentes[]`) e o prompt em `.md`. O gerador cria o agente com
  as regras do papel dono do passo, nunca mais que isso, mais as skills e os MCPs ligados ao dono (de outros
  toolkits, como o `java`, e do projeto; não os subagentes), e o liga como subagente do dono com o `para`; os
  `subagentes` dele herdam o mesmo papel. Nome `sa-*`, caminho fora da pasta do toolkit, ou agente que não está em
  `agentes[]` → o gerador recusa e não grava nada.
- A pasta `~/.sabia/toolkits/` é de leitura para todos os agentes.

## Tipos

Fluxo com passos (definição do fluxo, `passos/`, compilação) é só do framework: o Sabiá não compila conteúdo de toolkit. Um toolkit
é skill — uma skill com os fluxos e templates dela, referenciados por tipo, ou só skills com as references dentro:

```
toolkit.json                       "tipos", "criterios_revisao", "requer" (abaixo)
skills/exemplo/SKILL.md            a skill, copiada como está (o corpo é dela)
fluxo/fluxo-hf.md                  fluxo do tipo HF, lido pela skill pelo caminho
template/template-hf.md                template do tipo HF, idem
```

```json
{
  "nome": "exemplo", "versao": "1.0.0", "descricao": "Template de histórias de uma casa",
  "autor": { "nome": "<quem fez>", "area": "<área>" }, "tipos-de-projeto": ["backend", "frontend"],
  "skills": [{ "caminho": "skills/exemplo/SKILL.md", "papeis": ["especificador"] }],
  "tipos": { "HF": { "skill": "skills/exemplo/SKILL.md", "fluxo": "fluxo/fluxo-hf.md", "template": "template/template-hf.md" } },
  "criterios_revisao": [{ "id": "EX1", "tipo": "HF", "verificacao": "Toda HF cita o campo de origem", "severidade": "IMPORTANTE" }],
  "requer": { "sabia": "2.1.0" }
}
```

- **Tipo → skill:** a sigla é do catálogo (o toolkit não cria tipo), desviável e não pendente; a skill é uma das
  `skills[]`; o fluxo e o template, opcionais, são arquivos da pasta do toolkit (sem eles, `{"skill": …}` só, a skill segue as references dela). A skill vai ao dono de cada passo de desvio
  (coluna Desviável do catálogo) e traz em `papeis` o papel de cada um (HF, UC, REG, MSG, EL e ATA: `especificador` ou `produto`; ET: `desenvolvedor`; CT: `verificador`); sem ele, o
  CLI e o gerador recusam o toolkit, dizendo o papel que falta. O gerador põe no prompt de cada dono a linha **Tipos com skill de toolkit**: no passo, o
  tipo sai pela skill, que segue o fluxo com o template, quando há, pelo caminho na pasta instalada (`~/.sabia/toolkits/<toolkit>/<versão>/`,
  de leitura para todos os agentes), escrevendo no formato do Sabiá (no arquivo de `elm/`, o do `sa-elm/elm-arquivo.md`; no bloco do `prd.md`, o mesmo corpo,
  sem frontmatter; o corpo nunca tem título Markdown), e volta ao passo. O gerador imprime a seção
  que a setup grava no `sabia.md`: o fluxo, o template e a skill de cada tipo, e os itens de critério de revisão.
- **Template do núcleo:** o toolkit não troca template do Sabiá. O tipo que não vai por `tipos`, e o tipo fora do passo de
  desvio, usam o template do Sabiá.
- **Template no projeto:** `.sabia/template/requisitos/template-<tipo>.md` vale sobre o template em vigor do tipo: o do toolkit
  que o desvia (a `base` é o sha do template do toolkit, e a linha Tipos com skill de toolkit aponta para a cópia) ou o do
  Sabiá. O template do toolkit segue o mesmo nome, `template/requisitos/template-<tipo>.md`.
- **Links:** nos arquivos do toolkit, o link para o Sabiá segue o estilo do repositório
  (`~/.sabia/framework/skills/<sa-x>/references/...`). O Sabiá não confere esses links: um quebrado só aparece quando o
  agente o lê.
- **Critérios de revisão:** cada item se soma aos critérios de revisão do revisor (no prompt do `sa-revisor`; sem agente, na seção **Tipos com
  skill de toolkit** do `sabia.md`), com a severidade dele; o toolkit não troca nem afrouxa item do Sabiá.
- **Requer:** a versão mínima do Sabiá instalado; o `sabia toolkits instalar` confere antes de gravar.
- **Colisão:** dois toolkits do projeto no mesmo tipo ou no mesmo id de item de critério de revisão → o gerador recusa e não grava
  nada. Item de critério de revisão com o id de um do Sabiá também: o toolkit só acrescenta itens; os itens L e C do Sabiá valem igual no
  que a skill dele escreve.

## Proposta por agente

A setup nunca liga uma skill sem a confirmação da pessoa — mas confirma a proposta inteira do agente de uma vez
(skills, MCPs, modelo e subagentes; passo `perfis`). Para cada agente, mostra o inventário **agrupado por toolkit**. Vêm
pré-marcadas só as skills de toolkits **detectados** cujo `papeis` inclui o papel do agente; toolkit não
detectado, skill do projeto e skill do usuário aparecem desmarcadas; toolkit sugerido (o `tipos-de-projeto` casa, o
`deteccao` não) → skills desmarcadas, com "recomendo `pôr <n>`":

O cartão é o W6 de [wizard.md](wizard.md): skills numeradas com a caixa `[✅]`/`[ ]` na primeira coluna, agrupadas por toolkit e origem na coluna
"Para quê" (ex.: `spring-batch-job` — steps chunk/tasklet · toolkit spring-batch 🔍 detectado), e a resposta pelos
números (`tirar 3,5`, `pôr 7`, `nenhuma skill`, `as mesmas do sa-<outro>`).

A skill confirmada vai ao `agentes.json` pela fonte (`skill://~/.sabia/toolkits/<toolkit>/<versão>/skills/<skill>/SKILL.md`);
a skill de um tipo, ligada também pelo `tipos`, não se repete.

No projeto, `sabia toolkits instalar <nome>[@versão]` baixa a versão, liga cada skill aos agentes dos seus papéis e regenera os
agentes e as seções do `sabia.md`, sem modelo. `sabia toolkits atualizar` leva à última versão, mantendo o que a pessoa
escolheu, e `sabia toolkits remover` tira do projeto. Cada projeto aponta para a sua versão; a pasta só sai da máquina quando
nenhum projeto a usa. No opencode, a cópia da skill fica em `.opencode/skills/` do projeto.

Num projeto 100% Spring Batch, o normal é o desenvolvedor receber as skills de batch e Java, e não as de REST ou
de frontend — mas quem decide é a pessoa.

## Sem toolkit

Nenhum toolkit encontrado para o tipo detectado → diga isso uma vez, siga com as skills avulsas e registre no
`sabia.md` (`Toolkits: nenhum — <tipo>`). Os agentes passam a depender do steering de tecnologia e do
código vizinho (pattern grounding) — funciona, mas com mais revisão. Sugira à pessoa criar as skills da stack em
`.kiro/skills/` (ou um toolkit em `.sabia/toolkits/<nome>/`) e rodar a `sa-setup.configurar` em atualização depois.

## Customização

Um toolkit pode ser a **cópia modificada** de outro para uma casa ou projeto (ex.: `spring-batch-alfa`, a partir do
`spring-batch`). A cópia é completa por si — skills, agentes e passos próprios — e **não herda nada** da base: a base
só aparece no campo `customiza`, para mostrar de onde veio e o que mudou.

- **Mesmos nomes:** a cópia mantém os nomes de skill, de agente e de reference da base (ex.: a skill
  `spring-batch` e o agente `spring-batch-job` nos dois). O que é só dela tem prefixo próprio (ex.: `alfa-*.md`).
- **Um ou o outro:** a cópia substitui a base, e o CLI recusa instalar as duas. Encontrou os dois → proponha só a
  cópia e mostre a base como `↳ substituído por <cópia>`; nunca ligue os dois.
- **Visual:** no W5 e no `sabia toolkits listar`, a cópia aparece logo abaixo da base, com `↳`, a versão da base e as
  `mudancas`. Base com versão mais nova que a do `customiza` → ⚠️ "a base mudou desde a cópia" (quem mantém a cópia
  decide o que trazer).

## Atualização

Toolkit novo ou atualizado → "regenerar os agentes" (`sa-setup.configurar`, em atualização): a setup compara o
inventário atual com o `sabia.md` e pergunta só sobre as skills **novas** de cada agente; skill que sumiu
sai dos agentes com aviso.
