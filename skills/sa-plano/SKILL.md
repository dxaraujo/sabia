---
name: sa-plano
description: "Plans a slice (fatia) of the Sabiá flow in Kiro's spec format — researches the code first (sa-pesquisar), then writes requirements.md (falsifiable EARS criteria, only what the slice covers) or bugfix.md (fast track), design.md (pattern grounding, program shape: file tree, signatures and call tree, test points, the verification's definition-of-done contract) and tasks.md (one task per behavior, test first, done command); goes through the independent analysis (rubric L), the AFK → HITL switch suggestion when the plan shows risk, and the plan GATE by the implementer's seniority (Júnior always, Pleno on request, Sênior never), approved by a Dev Sênior in the [APR] task, via sa-revisar. Use when the user says \"planeja a FT-031\", \"gera a spec\", \"cria as tasks\", \"replaneja\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "1.0.0"
---

# sa-plano — Decidir o como antes de codar

> **Arquivos desta skill** (`references/`, `assets/` e os `../<skill>/…` citados abaixo) ficam na pasta da skill, dentro do
> power instalado (ex.: `~/.kiro/powers/installed/sabia/skills/sa-plano/`), não no projeto: abra-os por esse
> caminho, relativo a este `SKILL.md`. A busca no workspace não os encontra — não procure no projeto.

O plano existe para que as decisões de desenho sejam tomadas **com** uma pessoa, não descobertas por ela no
code review. Ele é curto, concreto e descartável: depois do merge, o que vale é o código, o ELM, o glossário e os
ADRs. Templates: [references/plano-templates.md](references/plano-templates.md).

Entrada: pasta `.kiro/specs/<ft>-<slug>/` criada pela `sa-desenvolver`, na branch da fatia.
Leia: `status.md`, a fatia no `backlog.md`, o PRD do épico (histórias e regras cobertas), a ficha da fatia sem
épico (`<produto>/fatias/`) ou o defeito,
`.kiro/steering/sabia.md` (com as regras aprendidas) e o steering de tecnologia/estrutura.

## Passo 1 — Pesquisa

Sem `research.md` → **`sa-pesquisar`** (de preferência pelo agente `sa-pesquisador`). Trabalhe a partir do
arquivo, não da memória da leitura. Divergência entre o ELM e o código apontada na pesquisa → pergunte antes de
seguir (pode ser defeito, pode ser documentação velha).

## Passo 2 — Decisões em aberto

Lacuna de **negócio** (regra sem valor, exceção sem comportamento) → **pare**: é do P.O. — `sa-entrevistar` e,
se mudar o PRD aprovado, `sa-prd` (mudança depois de aprovado) — ou a ficha aprovada, `sa-triar`. Nunca decida regra no plano.
Escolhas **técnicas** com alternativas reais (ex.: onde guardar o contador) → apresente-as à pessoa com a
recomendada (HITL) ou decida e registre (AFK) em "Decisões técnicas".

## Passo 3 — Escrever

0. **`.config.kiro`** (se não existe ou o `specType` não bate com a trilha): `specType` `feature` (padrão) ou `bugfix` (rápida) — é o que faz o painel
   de specs do Kiro reconhecer a pasta.
1. **`requirements.md`** (padrão) ou **`bugfix.md`** (trilha rápida). Cada critério EARS é **falsificável na
   base**: diga a observação que hoje mostra que ele é falso — se ela não existe, o critério já passa e não serve
   como teste.
2. **`design.md`**: pattern grounding (da research), **forma do programa** (árvore de arquivos com ação, assinaturas,
   árvore de chamadas — cada uma é uma decisão que, sem isso, seria tomada implicitamente no code review),
   pontos de teste (o mais alto possível), erros/transação/reexecução, **contrato de pronto** (como cada cenário
   será verificado de ponta a ponta) e decisões técnicas.
3. **`tasks.md`**: uma tarefa por comportamento, teste primeiro, comando de pronto, `_Requirements: N.M_`; a
   última é o checkpoint de validação completa + revisão.
4. Skills do toolkit ligadas ao agente: consulte a da stack para a forma do programa (camadas, nomes, testes).
5. Limite: plano que passa de ~200 linhas no total ou de ~8 tarefas → a fatia está grande: em vez de escrever um
   plano maior, proponha dividi-la. Ela já está `iniciada`: quem divide é o P.O., pela `sa-fatiar` (sem épico, pela
   `sa-triar`), como manda a divisão depois de `iniciada` das
   [Situações](../sa-fatiar/references/backlog.md#situações). Aqui, `fase: bloqueada (de: planejando)` com a
   proposta de divisão no Bloqueio, e a sessão fecha como na troca de modo (Passo 5, "Dev aceita").

`status.md`: fase `planejando` (vale também durante a análise do Passo 4).

## Passo 4 — Análise independente

Incremente "revisão do plano" em Rodadas. Peça ao agente **`sa-revisor`** (subagente) a rubrica **L**
([../sa-revisar/references/rubricas.md](../sa-revisar/references/rubricas.md)) — passe só a pasta da fatia e a
rodada; ele grava o `analise-plano-<N>.md`. Sem subagente disponível (agente sem essa ferramenta, passo de workflow)
→ pare e devolva a quem chamou: "plano pronto para análise".
Assim que o relatório chegar (`OK` ou `AJUSTAR`), commite-o **com o `status.md`** (Rodadas, Histórico) —
mensagem no padrão do `sabia.md`, com o texto `registrar análise do plano <N>`. O GATE e a implementação citam esse
arquivo; ele precisa estar na branch.
- `ANALISE: OK` → Passo 5.
- `AJUSTAR`: falta **do plano** → corrija e peça nova análise (até 2 rodadas); falta **do PRD** → Passo 2.

## Passo 5 — Troca de modo e GATE do plano

### Fatia AFK com risco → sugerir HITL

`Modo: AFK` e o plano mostra risco — regra de negócio sensível, muitos cenários, integração externa, mudança de
dado (diga qual) → **sugira** ao Dev trocar para HITL. A troca é do P.O. (ou do SM), na base; aqui só se para.
**HITL → AFK nunca:** nem sugira nem aceite.

- Dev não aceita → o GATE abaixo, no AFK.
- Dev aceita → `fase: bloqueada (de: planejando)`, Bloqueio `aguardando troca para HITL` · motivo: `<risco>`, linha
  no Histórico e os créditos da sessão ([`sa-status`](../sa-status/SKILL.md#fechar-a-sessão), item 4); commit com os artefatos do plano e o `status.md` (`registrar plano`) → push → conferir no remoto
  (itens 1–3 da Entrega do Passo 5 da [`sa-implementar`](../sa-implementar/SKILL.md)) → horas da sessão na
  `[DEV]` (`elm_horas(<id>)` → desconte → `elm_lancar_horas(<id>, <h>)`, com "sim"; sem o MCP `elm` →
  `ELM pendente [DEV FT-<nnn> horas]`) — ela fica
  **interrompida**, sem conclusão → avise o P.O. (troca pela `sa-planejamento`, seção Troca de modo). Não troque
  de branch nem grave na base. A sessão pode ser encerrada: feita a troca, o Dev retoma pela `sa-iniciar` →
  `sa-desenvolver`, que sincroniza o `status.md` e devolve a fatia a este Passo 5, já no HITL.

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

A `senioridade` de quem implementa (o `Responsável` do `status.md`; no loop, quem disparou) no `equipe.json` da
base decide — trilha e modo não entram:

| Senioridade | GATE |
|---|---|
| **Júnior** | sempre: um Dev Sênior aprova |
| **Pleno** | **pergunte** se ele quer a aprovação de um Dev Sênior (recomende "sim" quando o plano muda a expectativa de um teste existente). Sim → como o Júnior; não → `fase: implementando`, Histórico `Pleno dispensou o GATE do plano` |
| **Sênior** | nunca: ele aprova o próprio plano — `fase: implementando`, Histórico `plano do Sênior` —, inclusive quando o plano muda a expectativa de um teste existente |

**Com GATE** (Júnior, ou Pleno que pediu): pergunte qual Dev Sênior aprova — sugira o que vai revisar o PR (coluna
Revisor da fatia no `sprint-<nn>.md`, que a puxada também tem); AFK, sem revisor: um Dev Sênior ativo que não é quem
implementa. Então `fase: aguardando-aprovacao-plano` (conta no WIP de revisão humana), `Responsável` = quem aprova,
e a tarefa **`[APR] FT-<nnn> Aprovar plano`** para ele
([elm-sprint.md](../sa-planejamento/references/elm-sprint.md) §8, com "sim"; sem o MCP `elm` →
`ELM pendente [APR FT-<nnn> criar]`). Commit com `research.md`, `.config.kiro`,
`requirements.md`/`bugfix.md`, `design.md`, `tasks.md` e `status.md`, já com os créditos da sessão ([`sa-status`](../sa-status/SKILL.md#fechar-a-sessão), item 4) (`registrar plano`) → push → conferir no remoto
(itens 1–3 da Entrega do Passo 5 da `sa-implementar`) — quem aprova lê o plano no remoto → horas da sessão na
`[DEV]` (lança, não conclui) → avise o aprovador (`sa-revisar`, Aprovação do plano).

**Sem GATE** (Sênior, ou Pleno que dispensou): `fase: implementando`, a linha no Histórico, os créditos da sessão ([`sa-status`](../sa-status/SKILL.md#fechar-a-sessão), item 4) e **um commit** com os
mesmos arquivos (`registrar plano`). Próximo: **`sa-implementar`** — numa sessão nova, de preferência (o plano está
no disco; o contexto da pesquisa não é mais necessário).

Retomando em `aguardando-aprovacao-plano` sem `[APR]` (receita de workflow, pendência `[APR FT-<nnn> criar]`) → faça
agora a pergunta ao Pleno, ou crie a `[APR]` (Júnior, Pleno que pediu).

### Quem aprova

A aprovação é do Dev Sênior da `[APR]`, na sessão dele, pela **`sa-revisar`** (seção "Aprovação do plano") —
nunca nesta skill nem na sessão de quem implementa.

## Replanejar

Implementação descobriu que o plano não serve (esperado × encontrado) → atualize `design.md`/`tasks.md` só no que
mudou, acrescente tarefas (nunca desmarque as feitas), registre o motivo no Histórico e repita os Passos 4–5 para
a parte alterada (com GATE e a `[APR]` já concluída → o aprovador a reabre pela `sa-revisar`: modo *assumir* com retrabalho).

## Modo autônomo

`AUTONOMO=true`: sem perguntas; decisão técnica com alternativas → escolha a recomendada e registre; lacuna de
negócio → `fase: bloqueada (de: planejando)` com a pergunta para o P.O. Passo 5 sem pessoa: fatia AFK com risco →
`fase: bloqueada (de: planejando)`, `aguardando troca para HITL` com o risco (a sugestão vai ao P.O.); GATE → Sênior
segue para `implementando`; Pleno → a escolha do lote que quem chamou passou (sem ela: `aguardando-aprovacao-plano`,
e a pergunta fica para a sessão dele); nada de ELM (`ELM pendente [<chave>]`).

## Regras

- Não invoque nem simule outra skill do fluxo: termine dizendo a próxima (`sa-implementar`, o Dev Sênior da `[APR]`
  ou o P.O. na troca de modo e na divisão) e pare. A `sa-pesquisar` e o subagente revisor, que os passos mandam
  chamar, fazem parte desta skill.
