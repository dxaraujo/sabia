# Desvios de toolkit — onde um toolkit assume um passo do Sabiá

O Sabiá é o fluxo; os toolkits são extensões dos agentes dele. Um toolkit ajuda de três jeitos, lidos do
`agentes.json` (`toolkits`, `passos`) e aplicados pelo gerador no prompt do agente:

- **de apoio** (só `papeis`): o agente carrega a skill quando o artefato pede;
- **de passo** (com `passo` no `toolkit.json`): a skill assume um passo do Sabiá, pelo id do passo. Quem decide é a
  configuração do agente (o `agentes.json`, que o gerador leva ao prompt como **Desvios de toolkit no passo `<id>`**),
  então vale sempre, também no autopilot, e é transparente para quem está no fluxo. A skill traz os modelos no
  `assets/` e, opcionalmente, um agente a quem o dono do passo delega;
- **de tipo** (com `tipos` no `toolkit.json`): uma skill do toolkit, com o fluxo e o padrão do tipo, escreve um tipo
  desviável do catálogo no passo de desvio do tipo (ver [Tipos com skill de toolkit](#tipos-com-skill-de-toolkit)).

`skills[].papeis` e `steering[].papeis` mapeiam 1:1 para os agentes:

| Papel no `toolkit.json` | Agente |
|---|---|
| `desenvolvedor` | `sa-desenvolvedor` |
| `especificador` · `produto` | `sa-especificador` |
| `pesquisador` | `sa-pesquisador` |
| `revisor` | `sa-revisor` (recebe também as `criterios_revisao`) |
| `verificador` | `sa-verificador` (recebe também o texto `verificacao`) |

O Sabiá define o dono (o agente que roda a skill do passo), o contrato de saída e o que continua sendo dele: revisão,
validação e commit. Formato no `toolkit.json` (`skills[].passo`, `agentes[]`):
[toolkits.md](../../sa-setup/references/toolkits.md). Os passos ligados no projeto estão na tabela **Desvios de
toolkit** do `.sabia/sabia.md` (gravada pela `sa-setup`), que vale também na sessão sem agente. O toolkit fica fora da
compilação: a skill instalada só marca o gancho (⇢ na tabela do fluxo) no passo com desvio, e o desvio vem do projeto.

No `toolkit.json`, `passo.passo` é o id do passo no formato `skill.fluxo.passo`, com o `para` e, opcionais, os
`arquivos` (globs) e o `agente`. Só vale em passo com `"desvio": true` na definição do fluxo — hoje o da tabela abaixo.

## Os passos

| Passo (`passo.passo`) | Dono | Como o agente sabe | Contrato de saída |
|---|---|---|---|
| `sa-desenvolver.codificar.tarefa` | `sa-desenvolvedor`, por tarefa | os **Desvios de toolkit** do prompt do `sa-desenvolvedor`: a tarefa que casa com o `para` ou com os `arquivos` vai ao toolkit, sem marca no `tasks.md` | código e testes da tarefa, dentro do escopo dela, e o resumo dos arquivos. O Sabiá roda a validação da `sa-desenvolver.codificar` (evidência, não afirmação) e faz o commit. O toolkit não faz commit, push nem MR |

## Sem agente e com agente

- **Sem agente** (a coluna Agente da tabela é `—`): o dono carrega a skill do passo e faz o trabalho no próprio
  contexto.
- **Com agente:** o dono delega e confere.
  1. Manda um briefing curto, com o contrato do passo: a tarefa, o `design.md`, o `research.md`, os pontos de teste e
     os Comandos do `.sabia/sabia.md`.
  2. O subagente trabalha em contexto isolado e devolve o que fez (arquivos e resumo).
  3. O dono confere o contrato e segue o fluxo. Fora do contrato → devolve uma vez com o que falta; de novo fora →
     registra em Desvios do `status.md`.

O agente do toolkit vira subagente do agente dono do passo, com as permissões dele, nunca mais que isso, e recebe as
skills e os MCPs ligados ao dono (não os subagentes dele).

## Tipos com skill de toolkit

O catálogo ([tipos.md](tipos.md)) é fechado: o toolkit não cria tipo. A coluna Desviável diz os passos de Cria que são
o ponto de desvio do tipo (⇢ na tabela do fluxo); nos outros passos de Cria, o tipo é sempre do Sabiá. Nesse passo, o
toolkit que declara `tipos` (`{"HF": {"skill": "skills/<skill>/SKILL.md", "fluxo": "<arquivo>", "padrao":
"<arquivo>"}}`, fluxo e padrão opcionais) escreve o artefato pela skill dele, que o dono carrega e que segue o fluxo
com o padrão do tipo, lidos pelo caminho na pasta do toolkit, ou, sem eles, as references dela; depois, volta ao passo.

- **Quem escreve:** HF, UC, REG, MSG e EL saem pelo `sa-especificador`, com a aprovação gravada no documento; a ET as-built,
  pelo `sa-desenvolvedor`, com a aprovação do MR.
- **Como o agente sabe:** a linha **Tipos com skill de toolkit** do prompt do dono de cada passo de desvio (gerada do
  `agentes.json`), com a skill do toolkit ligada a ele — a skill traz em `papeis` o papel de cada dono, senão o CLI e o
  gerador recusam o toolkit; sem agente, a seção **Tipos com skill de toolkit** do `.sabia/sabia.md`.
- **Contrato, na volta ao passo:** o arquivo pela coluna Arquivo do catálogo, no formato do Sabiá (no arquivo de
  `elm/`: o frontmatter `type` · `title` · `status` · `sources` e o corpo pelo padrão do tipo; no bloco do `prd.md`,
  o mesmo corpo, sem frontmatter). Fora dele → o dono completa no próprio passo e registra em Desvios do
  `status.md`.
- **Padrão do núcleo:** o toolkit não troca padrão do Sabiá. A cópia do projeto em
  `.sabia/padrao/requisitos/padrao-<tipo>.md` vale sobre o padrão em vigor do tipo, do Sabiá ou do toolkit.
- **Continua do Sabiá:** o catálogo (sigla, arquivo, ELM), a revisão (o toolkit só acrescenta itens de critério de revisão), a
  aprovação e a publicação (`sa-elm.publicar`).
- **Colisão:** dois toolkits do projeto no mesmo tipo ou no mesmo id de critérios de revisão → o gerador recusa e não grava nada.
