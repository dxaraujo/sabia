# Desvios de toolkit — onde um toolkit assume um passo do Sabiá

O Sabiá é o fluxo; os toolkits são extensões dos agentes dele. Um toolkit ajuda de três jeitos:

- **de apoio** (só `papeis`): o agente a carrega quando o artefato pede;
- **de passo** (com `passo` no `toolkit.json`): ela assume um passo definido de um agente do Sabiá, pelo id do passo.
  Quem decide é a configuração do agente (o `agentes.json`, que o gerador leva ao prompt como **Desvios de toolkit no
  passo `<id>`**), então vale
  sempre, também no AFK, e é transparente para quem está no fluxo. A skill traz os modelos no `assets/` e, opcionalmente, um agente a
  quem o dono do passo delega;
- **de tipo** (com `tipos` no `toolkit.json`): uma skill do toolkit, com o fluxo e o padrão do tipo, escreve um tipo
  desviável do catálogo no passo de desvio do tipo — ver [Tipos com skill de toolkit](#tipos-com-skill-de-toolkit).

O Sabiá define o dono, o contrato de saída e o que continua sendo dele: revisão, GATE, o passo `sa-codificar.codificar.validar` e commit.
Formato no `toolkit.json` (`skills[].passo`, `agentes[]`): [toolkits.md](../../sa-setup/references/toolkits.md).
Os passos ligados no projeto estão na tabela **Desvios de toolkit** do `.sabia/sabia.md` (gravada pela setup), que vale
também na sessão sem agente. O toolkit fica fora da compilação: a skill `sa-*` instalada só marca o gancho (⇢ na
tabela do fluxo) no passo com desvio, e o desvio vem do projeto.

No `toolkit.json`, `passo.passo` é o id do passo (`sa-codificar.codificar.tarefa`), com o `para` e, opcionais, os
`arquivos` (globs) e o `agente`. Só vale em passo com `"desvio": true` no mestre — hoje o da tabela abaixo.

## Os passos

| Passo (`passo.passo`) | Dono | Como o agente sabe | Contrato de saída |
|---|---|---|---|
| `sa-codificar.codificar.tarefa` | agente `sa-desenvolvedor`, na `sa-codificar`, por tarefa | os **Desvios de toolkit** do prompt do `sa-desenvolvedor`: a tarefa que casa com o `para` ou com os `arquivos` vai ao toolkit na `sa-codificar`, sem marca no `tasks.md` | código e testes da tarefa, dentro do escopo dela, e o resumo dos arquivos. O Sabiá roda o passo `sa-codificar.codificar.validar` (evidência, não afirmação) e faz o commit. O toolkit não faz commit, push nem PR |

## Sem agente e com agente

- **Sem agente** (a coluna Agente da tabela é `—`, ou a pessoa não o marcou): o dono carrega a skill do passo e
  faz o trabalho no próprio contexto.
- **Com agente:** o dono delega e confere.
  1. Manda um briefing curto, com o contrato do passo: a tarefa, o `design.md`, o `research.md`, os pontos de teste e
     os comandos do `sabia.md`.
  2. O subagente trabalha em contexto limpo e devolve o que fez (arquivos e resumo).
  3. O dono confere o contrato e segue o fluxo. Fora do contrato → devolve uma vez com o que falta; de novo fora →
     trata como divergência e registra no `status.md`.

O agente do toolkit é gerado com as permissões do papel dono, nunca mais que isso, e recebe as skills e os MCPs
ligados ao dono (não os subagentes dele); o subagente dele herda o mesmo papel.

## Tipos com skill de toolkit

O catálogo ([tipos.md](tipos.md)) é fechado: o toolkit não cria tipo. A coluna Desviável diz os passos de Cria que
são o ponto de desvio do tipo (⇢ na tabela do fluxo); nos outros passos de Cria, o tipo é sempre do Sabiá. Nesse
passo, o toolkit que declara `tipos` (`{"HF": {"skill": "skills/<skill>/SKILL.md", "fluxo": "<arquivo>", "padrao":
"<arquivo>"}}`, fluxo e padrão opcionais) escreve o artefato pela skill dele, que o dono carrega e que segue o fluxo com
o padrão do tipo, lidos pelo caminho na pasta do toolkit, ou, sem eles, as references dela; depois, volta ao passo. Fluxo com passos é só do framework: o Sabiá não compila
conteúdo de toolkit.

- **Como o agente sabe:** a linha **Tipos com skill de toolkit** do prompt do dono de cada passo de desvio (gerada do
  `agentes.json`: todo toolkit ligado ao projeto com `tipos`), com a skill do toolkit ligada a ele — a skill traz em
  `papeis` o papel de cada dono, senão o CLI e o gerador recusam o toolkit; sem agente, a seção
  **Tipos com skill de toolkit** do `.sabia/sabia.md` (a skill, o fluxo e o padrão de cada tipo, e os itens de rubrica).
- **Contrato, na volta ao passo:** o arquivo pela coluna Arquivo, o envelope do `okf-elm.md` e `status: draft`.
  Fora dele → o dono completa no próprio passo e registra no `status.md`.
- **Padrão do núcleo:** o toolkit não troca padrão do Sabiá; o tipo fora do passo de desvio (a ET as-built, no
  `sa-codificar.codificar.pr`) usa o padrão do Sabiá, e o `.sabia/padrao/` do projeto vale só sobre um padrão do Sabiá.
- **Continua do Sabiá:** o catálogo (sigla, arquivo, ELM), o envelope OKF, a revisão (o toolkit só **acrescenta** itens
  de rubrica), o GATE e a publicação.
- **Colisão:** dois toolkits do projeto no mesmo tipo ou no mesmo id de rubrica → o gerador recusa e não grava nada.
