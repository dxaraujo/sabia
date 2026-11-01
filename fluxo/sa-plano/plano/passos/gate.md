---
{"resumo": "AFK com risco: sugere HITL. GATE do plano pela senioridade de quem implementa: com GATE, [APR] para um Dev Sênior; sem GATE, fase implementando. Quem aprova é a sa-revisar."}
---
## Entrada

`ANALISE: OK` (passo `analise`). Ou retomando em `aguardando-aprovacao-plano` sem `[APR]`, ou de volta da troca de
modo, já no HITL.

## Faça

### Fatia AFK com risco → sugerir HITL

`Modo: AFK` e o plano mostra risco — regra de negócio sensível, muitos cenários, integração externa, mudança de
dado (diga qual) → **sugira** ao Dev trocar para HITL. A troca é do P.O. (ou do SM), na base; aqui só se para.
**HITL → AFK nunca:** nem sugira nem aceite.

- Dev não aceita → o GATE abaixo, no AFK.
- Dev aceita → `fase: bloqueada (de: planejando)`, Bloqueio `aguardando troca para HITL` · motivo: `<risco>`, linha
  no Histórico e os créditos da sessão ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4); commit com os artefatos do plano e o `status.md` (`registrar plano`) → push → conferir no remoto
  (como na Entrega do passo `sa-codificar.codificar.pr`) → horas da sessão na
  `[DEV]` (`elm_horas(<id>)` → desconte → `elm_lancar_horas(<id>, <h>)`, com "sim"; sem o MCP `elm` →
  `ELM pendente [DEV FT-<nnn> horas]`) — ela fica
  **interrompida**, sem conclusão → avise o P.O. (troca pela `sa-planejamento.troca-modo`). Não troque
  de branch nem grave na base. A sessão pode ser encerrada: feita a troca, o Dev retoma pela `sa-iniciar` →
  `sa-desenvolver`, que sincroniza o `status.md` e devolve a fatia a este passo `gate`, já no HITL.

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
([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §8, com "sim"; sem o MCP `elm` →
`ELM pendente [APR FT-<nnn> criar]`). Commit com `research.md`, `.config.kiro`,
`requirements.md`/`bugfix.md`, `design.md`, `tasks.md` e `status.md`, já com os créditos da sessão ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4) (`registrar plano`) → push → conferir no remoto
(como na Entrega do passo `sa-codificar.codificar.pr`) — quem aprova lê o plano no remoto → horas da sessão na
`[DEV]` (lança, não conclui) → avise o aprovador (`sa-revisar.aprovar-plano`).

**Sem GATE** (Sênior, ou Pleno que dispensou): `fase: implementando`, a linha no Histórico, os créditos da sessão ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4) e **um commit** com os
mesmos arquivos (`registrar plano`). Próximo: **`sa-codificar`** — numa sessão nova, de preferência (o plano está
no disco; o contexto da pesquisa não é mais necessário).

Retomando em `aguardando-aprovacao-plano` sem `[APR]` (pendência `[APR FT-<nnn> criar]`) → faça
agora a pergunta ao Pleno, ou crie a `[APR]` (Júnior, Pleno que pediu).

### Quem aprova

A aprovação é do Dev Sênior da `[APR]`, na sessão dele, pelo fluxo **`sa-revisar.aprovar-plano`** —
nunca neste fluxo nem na sessão de quem implementa.

## Saída

Com GATE → `fase: aguardando-aprovacao-plano`, a `[APR]` e o aprovador avisado. Sem GATE → `fase: implementando`;
próximo: `sa-codificar`. Dev aceitou a troca → `fase: bloqueada (de: planejando)` e o P.O. avisado.

## Pare se

- Dev aceita a troca para HITL → a sessão pode ser encerrada (acima); não troque de branch nem grave na base.
- Com GATE: avisado o aprovador, pare — a aprovação nunca é nesta sessão.
- Sem GATE: diga a próxima (`sa-codificar`) e pare.
