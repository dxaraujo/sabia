---
{"resumo": "AFK com risco: grava bloqueada aguardando troca de modo e orienta o P.O. ou o SM; volta da troca pela base. GATE do plano pela senioridade de quem implementa: com GATE, [APR] para um Dev Sênior; sem GATE, fase implementando. Quem aprova é a sa-revisar."}
---
## Entrada

`ANALISE: OK` (passo `analise`), também na volta do ajuste pedido no GATE. Ou, pelo passo `entrada`: retomando em `aguardando-aprovacao-plano` sem `[APR]`, ou
em `bloqueada (de: planejando)` com `aguardando troca de modo`.

## Faça

O **Modo** é o da base (regra A base prevalece do padrão `sa-desenvolver/status.md`): diverge do `status.md` →
sincronize como ela manda, num commit (`<FT> sincronizar modo`), antes do GATE.

### Volta da troca de modo

`bloqueada (de: planejando)` com `aguardando troca de modo`: leia a base sem trocar de branch — `git fetch` e
`git show origin/<base>:<produto>/backlog.md` e `…/sprints/<pai>/sprint-<nn>.md`. A troca vale registrada lá pelo P.O.
ou pelo SM (`sa-planejamento.troca-modo`). Leia a linha viva da fatia no `sprint-<nn>.md` aberto em `origin/<base>`:
- **trocou** (Modo diferente do `Modo` do `status.md`) → mostre o modo novo, com o revisor e o verificador das colunas
  Revisor e Verificador da linha da sprint (o Histórico não é a fonte), e, com "sim", sincronize o `status.md` pela regra A base prevalece (`Modo`, os ids da
  `[REV]` e da `[VER]` da coluna "Tarefa ELM", `Bloqueio: —`, fase `planejando`); commit `<FT> sincronizar modo` e push. A `[DEV]`, pela
  seção Assumir do passo `sa-plano.plano.entrada`. Siga para o GATE abaixo, no modo novo;
- **manteve** (mesmo Modo e Observação `modo: AFK mantido (<quem>, <data>)` com data igual ou posterior à da linha do
  bloqueio no Histórico) → `Bloqueio: —`, fase `planejando`, commit `<FT> sincronizar modo`, e o GATE abaixo no AFK;
- **nada registrado** (senão) → "a troca de modo espera o P.O. ou o SM (agente `sa-produto`)" e pare.

Na troca, o Dev não grava na base nem cria ou cancela tarefa.

### Fatia AFK com risco

`Modo: AFK` e o plano mostra risco — regra de negócio sensível, muitos cenários, integração externa, mudança de
dado (diga qual) → mostre o risco e **pergunte** se o Dev pede a troca para HITL. A troca de modo é só do P.O. ou do
SM, na base; aqui só se para.

- Não pede → o GATE abaixo, no AFK.
- Pede → `fase: bloqueada (de: planejando)`, Bloqueio `aguardando troca de modo · motivo: <risco>`, linha
  no Histórico e os créditos da sessão ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4); commit com os artefatos do plano e o `status.md` (`<FT> registrar plano`) → push → conferir no remoto
  (como na Entrega do passo `sa-codificar.codificar.pr`) → horas da sessão na
  `[DEV]` (`elm_horas(<id>)` → desconte → `elm_lancar_horas(<id>, <h>)`, com "sim"; sem o MCP `elm` →
  `ELM pendente [DEV FT-<nnn> horas]: lançar <h>h (<AAAA-MM-DD>)` no Histórico) — ela fica **interrompida**, sem conclusão → "A troca de modo é do P.O. ou do
  SM: fale com eles (agente `sa-produto`, `sa-planejamento.troca-modo`)" e pare. Não troque de branch nem grave na
  base. Feita a troca, o Dev retoma pela `sa-plano FT-<nnn>` (Volta da troca de modo, acima).

O Dev pede a troca de uma fatia HITL para AFK → nada gravado aqui: a mesma frase, e o GATE segue no modo registrado.

### GATE do plano — pela senioridade de quem implementa

```
🧭 Plano FT-<nnn> — <título> · trilha <…> · modo <AFK|HITL> · Dev <login> (<senioridade>)
Requisitos: <n> (<c> critérios) · Tarefas: <n> · Arquivos: <criar n · alterar n>
Análogo: <…> · Pontos de teste: <…> · Decisões técnicas: <lista curta>
Testes existentes que mudam: <nenhum | lista>
Contrato de pronto: <n> cenários, executados por <API | job | browser | carga>
Análise: OK na rodada <N>
Leia de preferência: forma do programa e contrato de pronto.
```

A `senioridade` de quem implementa — o `responsavel` da linha da fatia no `backlog.md` da base (no loop, quem
disparou); nunca o `Responsável` do `status.md`, que em `aguardando-aprovacao-plano` é quem aprova — no `equipe.json`
da base decide; trilha e modo não entram:

| Senioridade | GATE |
|---|---|
| **Júnior** | sempre: um Dev Sênior aprova |
| **Pleno** | **pergunte** se ele quer a aprovação de um Dev Sênior (recomende "sim" quando o plano muda a expectativa de um teste existente). Sim → como o Júnior; não → `fase: implementando`, Histórico `Pleno dispensou o GATE do plano` |
| **Sênior** | nunca: ele aprova o próprio plano — `fase: implementando`, Histórico `plano do Sênior` —, inclusive quando o plano muda a expectativa de um teste existente |

**Com GATE** (Júnior, ou Pleno que pediu): pergunte qual Dev Sênior aprova — sugira o que vai revisar o PR (coluna
Revisor da fatia no `sprint-<nn>.md`, que a puxada também tem); AFK, sem revisor: um Dev Sênior ativo que não é quem
implementa. Então `fase: aguardando-aprovacao-plano` (conta no WIP de revisão humana), `Responsável` = quem aprova,
e a tarefa **`[APR] FT-<nnn> Aprovar plano`** para ele
([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §8, com "sim"; sem o MCP `elm` →
`ELM pendente [APR FT-<nnn> criar]: criar a [APR] FT-<nnn> Aprovar plano para <login>` no Histórico). Commit com `research.md`, `.config.kiro`,
`requirements.md`/`bugfix.md`, `design.md`, `tasks.md` e `status.md`, já com os créditos da sessão ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4) (`<FT> registrar plano`) → push → conferir no remoto
(como na Entrega do passo `sa-codificar.codificar.pr`) — quem aprova lê o plano no remoto → horas da sessão na
`[DEV]` (lança, não conclui) → avise o aprovador (`sa-revisar.aprovar-plano`).

**Sem GATE** (Sênior, ou Pleno que dispensou): `fase: implementando`, a linha no Histórico, os créditos da sessão ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4) e **um commit** com os
mesmos arquivos (`<FT> registrar plano`). Próximo: **`sa-codificar`** — numa sessão nova, de preferência (o plano está
no disco; o contexto da pesquisa não é mais necessário).

**Volta do ajuste** (a última decisão no Histórico é `ajuste do plano pedido por <login>`, sem `plano aprovado por`
depois): é a mesma `[APR]` — sem perguntar ao Pleno nem quem aprova, e sem criar outra. `fase:
aguardando-aprovacao-plano`, `Responsável` = esse `<login>`; commit, push, conferência, horas e o aviso como no Com
GATE.

Retomando em `aguardando-aprovacao-plano` sem `APR <id>` no campo ELM: com `ELM pendente [APR FT-<nnn> criar]` sem o
`ELM feito` correspondente no Histórico → crie a `[APR]` para o `Responsável`; sem essa pendência (loop sem a escolha
do Pleno) → faça a pergunta ao Pleno da tabela.

### Quem aprova

A aprovação é do Dev Sênior da `[APR]`, na sessão dele, pelo fluxo **`sa-revisar.aprovar-plano`** —
nunca neste fluxo nem na sessão de quem implementa.

## Saída

Com GATE → `fase: aguardando-aprovacao-plano`, a `[APR]` e o aprovador avisado. Sem GATE → `fase: implementando`;
próximo: `sa-codificar`. AFK com risco e o Dev pediu a troca → `fase: bloqueada (de: planejando)`, `aguardando troca
de modo`, e o Dev orientado a falar com o P.O. ou o SM.

## Pare se

- O Dev pediu a troca de modo → "fale com o P.O. ou o SM (agente `sa-produto`)" e pare; a sessão pode ser encerrada
  (acima); não troque de branch nem grave na base.
- Volta da troca sem nada registrado na base → a mesma frase e pare.
- Com GATE: avisado o aprovador, pare — a aprovação nunca é nesta sessão.
- Sem GATE: diga a próxima (`sa-codificar`) e pare.
