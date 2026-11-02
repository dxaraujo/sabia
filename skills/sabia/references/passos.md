# Desvios de toolkit — onde uma skill de toolkit assume um passo do Sabiá

O Sabiá é o fluxo; os toolkits são extensões dos agentes dele. Uma skill de toolkit ajuda de dois jeitos:

- **de apoio** (só `papeis`): o agente a carrega quando o artefato pede;
- **de passo** (com `passo` no `toolkit.json`): ela assume um passo definido de um agente do Sabiá, pelo id do passo.
  Quem decide é a configuração do agente (o `agentes.json`, que o gerador leva ao prompt como **Desvios de toolkit no
  passo `<id>`**), então vale
  sempre, também no AFK, e é transparente para quem está no fluxo. A skill traz os modelos no `assets/` e, opcionalmente, um agente a
  quem o dono do passo delega.

O Sabiá define o dono, o contrato de saída e o que continua sendo dele: revisão, GATE, o passo `sa-codificar.codificar.validar` e commit.
Formato no `toolkit.json` (`skills[].passo`, `agentes[]`): [toolkits.md](../../sa-setup/references/toolkits.md).
Os passos ligados no projeto estão na tabela **Desvios de toolkit** do `.sabia/sabia.md` (gravada pela setup), que vale
também na sessão sem agente. O toolkit fica fora da compilação: a skill `sa-*` instalada só marca o gancho (⇢ na
tabela do fluxo) no passo com desvio, e o desvio vem do projeto.

No `toolkit.json`, `passo.passo` é o id do passo (`sa-codificar.codificar.tarefa`), com o `para` e, opcionais, os
`arquivos` (globs) e o `agente`. Só vale em passo com `"desvio": true` no mestre — hoje os dois da tabela abaixo.
Toolkit 1.x, com `passo.papel` no lugar do id: ainda aceito, pelo papel da primeira coluna (`codificador` é o nome
antigo de `desenvolvedor`).

## Os passos

| Passo (`passo.passo` · 1.x: `passo.papel`) | Dono | Como o agente sabe | Contrato de saída |
|---|---|---|---|
| `sa-prd.prd.escrever` · `especificador` | agente `sa-especificador`, na `sa-especificar`; a escrita do passo `sa-prd.prd.escrever` passa para o toolkit | os **Desvios de toolkit** do prompt do `sa-especificador`: o épico que casa com o `para` vai ao toolkit no passo `sa-prd.prd.escrever`, sem pergunta e sem marca no `status.md` | `prd.md` com as H2 do padrão `sa-prd/prd.md`; conceitos OKF em `elm/` quando há ELM; extras em `.md` na pasta de trabalho (vão como anexo e para a base no GATE). O passo `sa-prd.prd.similares`, a revisão P e o GATE continuam do Sabiá |
| `sa-codificar.codificar.tarefa` · `desenvolvedor` | agente `sa-desenvolvedor`, na `sa-codificar`, por tarefa | os **Desvios de toolkit** do prompt do `sa-desenvolvedor`: a tarefa que casa com o `para` ou com os `arquivos` vai ao toolkit na `sa-codificar`, sem marca no `tasks.md` | código e testes da tarefa, dentro do escopo dela, e o resumo dos arquivos. O Sabiá roda o passo `sa-codificar.codificar.validar` (evidência, não afirmação) e faz o commit. O toolkit não faz commit, push nem PR |

## Sem agente e com agente

- **Sem agente** (a coluna Agente da tabela é `—`, ou a pessoa não o marcou): o dono carrega a skill do passo e
  faz o trabalho no próprio contexto. Na especificação, isso mantém a entrevista inteira.
- **Com agente:** o dono delega e confere.
  1. Manda um briefing curto, com o contrato do passo:
     - **especificação:** a pasta de trabalho, o `rascunho.md`, o `decisoes.md` e as dúvidas em aberto;
     - **codificação:** a tarefa, o `design.md`, o `research.md`, os pontos de teste e os comandos do `sabia.md`.
  2. O subagente trabalha em contexto limpo e devolve o que fez (arquivos e resumo).
  3. O dono confere o contrato e segue o fluxo. Fora do contrato → devolve uma vez com o que falta; de novo fora →
     trata como divergência (codificação) ou completa ele mesmo (especificação), e registra no `status.md`.

O agente do toolkit é gerado com as permissões do papel dono, nunca mais que isso, e recebe as skills e os MCPs
ligados ao dono (não os subagentes dele); o subagente dele herda o mesmo papel.
