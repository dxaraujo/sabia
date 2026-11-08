---
inclusion: always
---

# Sabiá — <nome do projeto>

> Gerado pela `sa-setup` (Sabiá <x.y.z>) em <AAAA-MM-DD>. Para mudar: "atualizar a configuração do Sabiá".
> O projeto e os comandos ficam no `AGENTS.md`; as escolhas dos agentes, no `.sabia/config/agentes.json`.

## Resumo do fluxo

Este repositório usa o fluxo **Sabiá** (skills `sa-*`): alinhar antes, verificar depois. Fatias verticais
pequenas, teste primeiro com backpressure, autorrevisão e verificação de contexto limpo, MR revisado por um
desenvolvedor que não é o autor e lido por uma pessoa antes do merge.

- Como funciona e qual skill usar: `sabia`. Demanda nova: `sa-triar`. Onde parei ou minha próxima: `sa-status`.
- Agentes primários: `sa-desenvolvedor` (desenvolvimento, plano, MR, UAT e Sustentação) e `sa-especificador`
  (refinamento, PRD, especificação, entrevista e planejamento). Subagentes: `sa-pesquisador`, `sa-revisor` e
  `sa-verificador`. A `sa-setup` e a `sa-elm.setup` rodam na sessão padrão.
- Papéis são booleanas no `.sabia/planejamento/equipe.json` (`desenvolvedor` · `especificador` · `produto`). A
  identidade é o usuário do GitLab.
- O estado (`backlog.md`, `sprint-<nn>.md`) e os documentos de planejamento vão direto na base; o código, a spec da
  fatia e o `status.md`, na branch `<id>`.
- Nada inventado: sem fonte e sem a decisão de uma pessoa, fica em aberto. Nunca apague nem afrouxe teste.
- Dado de cliente nunca vai para o git: fica em `.sabia/local/`.

## Especificação

| Item | Valor |
|---|---|
| Formato da spec | `<kiro — .kiro/specs/ft-<nnn>-<slug>/ | openspec — openspec/changes/ft-<nnn>-<slug>/>` |
| REG com dados técnicos | `<não | sim>` |
| Telas | `<não | sim>` — sim: o protótipo só vale aprovado pelo cliente |
| Casos de uso | `<não | sim>` — sim: UC para o que o projeto já descreve em casos de uso; o novo, em HF |
| Glossário · ADRs | `<GL do DOORS | .sabia/glossario.md | não há>` · `<docs/adr/ | não há>` |

## Verificação de aceite

| Item | `<módulo>` |
|---|---|
| Executar | `<comando | job + parâmetros>` |
| URL de teste | `<url — nunca a de produção | não se aplica>` |

O `sa-verificador` exercita a aplicação direto, por curl ou navegador; o curl dele vale só para a URL de teste.

## Sustentação

Trabalho sem mudança no repositório. O que muda código ou configuração é fatia ou bug.

| Categoria | Descrição | Exemplo |
|---|---|---|
| `AT` | <atendimento: chamado ou pedido do cliente — consulta, extração, explicação> | <…> |
| `IM` | <implantação: preparar e acompanhar a subida de versão> | <…> |
| `BD` | <banco de dados: script de correção ou carga, conferência de base> | <…> |
| `IN` | <infra: ambiente, acesso, certificado, pedido a outra equipe> | <…> |
| `OP` | <operação: rotina de produção, reprocessar job, incidente sem mudança de código> | <…> |
| `EX` | <apoio a outros times> | <…> |

## ELM

<só com ELM: o texto que a `sa-elm.setup` devolveu — pa · ET as-built · Tarefas ·
Manual no DOORS Next. Sem ELM, a seção sai inteira.>

## Desvios de toolkit

Num passo que aceita desvio, a skill de um toolkit assume o trabalho; o Sabiá continua dono da revisão, do
backpressure e do commit. O agente dono já tem o desvio no prompt; esta tabela vale na sessão sem agente.

| Passo | Toolkit | Para | Skill | Agente |
|---|---|---|---|---|
| `<id do passo>` | `<nome>` <versão> | <quando usar> | `<skill>` | <`<agente>` | —> |
<nenhum — sem skill de toolkit com `passo`, ou nenhuma ligada>

## Tipos com skill de toolkit

Num tipo desviável do catálogo, a skill de um toolkit, com o fluxo e o padrão do tipo, escreve o artefato no passo
de desvio do tipo; o Sabiá continua dono do catálogo, da revisão e da aprovação. Estas tabelas são as que o gerador
imprime.

| Tipo | Skill | Fluxo e padrão | Toolkit | Passo de desvio |
|---|---|---|---|---|
| `<sigla>` | `~/.sabia/toolkits/<toolkit>/skills/<skill>/SKILL.md` | `<fluxo>` <com o padrão `<padrão>`> <ou — (as references da skill)> | `<nome>` <versão> | `<id do passo>` |
<nenhum — sem toolkit com `tipos`>

| Item de rubrica | Tipo | Severidade | Verificação | Toolkit |
|---|---|---|---|---|
| `<id>` | `<sigla>` | <BLOQUEANTE · IMPORTANTE · SUGESTÃO> | <verificação> | `<nome>` <versão> |
<nenhum — sem toolkit com `rubricas`>

## Regras aprendidas

Gravadas pela curadoria da `sa-planejamento.review`; a `sa-setup` as preserva ao regravar este arquivo. O revisor as
cobra como itens da rubrica; o plano as respeita. Uma por linha:
`- <regra> · origem <FT-nnn | AT-nnn…> · AAAA-MM-DD`.

<!-- Nenhuma regra ainda. -->
