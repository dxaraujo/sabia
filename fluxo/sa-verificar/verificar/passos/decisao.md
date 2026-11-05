---
{"resumo": "Decisão ACEITO/REJEITADO com a possível alteração indicada (HITL: decidida pela pessoa; AFK: 🔁, decidida pelo Dev Sênior na [APR]); ACEITO (com o CT.csv do passo casos): verificada (AFK) ou aceita com a entrega e a conclusão da [VER] (HITL); REJEITADO: achados e retrabalho; ambiente, volta à especificação ou cenário errado na ficha sem épico: bloqueada; lição nas Lições candidatas."}
---
## Entrada

O resultado de cada cenário no `verificacao.md` (passo `executar`) e, com todos aceitos, o `CT.csv` (passo `casos`).

## Faça

Grave o bloco no fim do `verificacao.md` (padrão `sa-verificar/verificacao.md`, Decisão); como subagente, devolva-o
também a quem chamou.

```
🔎 Verificação FT-<nnn> — rodada <N>
Cenários: <a> aceitos · <r> rejeitados · <e> ambiente · <p> possível alteração (AFK)
Drift de negócio: não | possível alteração — <motivo> · artefatos: <id|rótulo> (<tipo>)
VERIFICACAO: ACEITO | REJEITADO
```

**Drift de negócio** — o agente **indica** a `possível alteração` quando o comportamento entregue (o do contrato de
pronto) diverge do artefato aprovado (o de `elm/` da pasta da fatia, o do épico ou o do bundle), ou quando o cenário
parece errado no artefato, não no código. HITL: grave-a no campo do `status.md` (só sobe de `não` para `possível
alteração`; sobre um campo já decidido, o padrão `sa-desenvolver/status.md`) e a pessoa decide, antes do resultado:
`Possível alteração: <motivo> · <artefatos>. Volta à especificação, ou o código está errado?` — **código errado** → o
cenário é rejeitado (REJEITADO, abaixo), o Drift fica `não` e o Histórico ganha `drift descartado: código errado
(<login>)`; **volta** → ` · especificação: [ESP] FT-<nnn>` no Drift e a linha Volta da tabela. AFK: o cenário que
você atribui a um artefato fica `🔁 possível alteração` no `verificacao.md` e não vira tarefa de código; a linha fica
no relatório e quem conduz a grava no Drift; quem decide é o Dev Sênior na `[APR] Aprovar PR`.

**Resultado** da rodada:

- **ACEITO** — todos aceitos; no AFK, só `✅` e `🔁`, com o Drift `possível alteração — …`. O `CT.csv` já está gerado
  (passo `casos`).
- **REJEITADO** — algum `❌`: para cada cenário, esperado × obtido + evidência, registrados no `status.md` como
  achados. Se o problema é o artefato ou a ficha, não o código, diga isso (Drift, acima; ficha sem épico: Pare se).
- Rodada com ❌ e ⚠️ em cenários diferentes → REJEITADO; os ⚠️ ficam no `verificacao.md` como `⚠️ ambiente` e vão
  também para Achados como "ambiente".

| Resultado · Modo | fase | Rodadas · Retrabalho | commit (mensagem no padrão do `sabia.md`) | push | ELM | aviso |
|---|---|---|---|---|---|---|
| ACEITO · AFK (subagente do loop ou da `sa-codificar`) | `verificada` | — | — | — | não há `[VER]` no EWM no AFK | devolva para abrir o PR (passo `sa-codificar.codificar.pr`); a possível alteração segue com o PR para a `[APR]` |
| ACEITO · HITL | `aceita` | — | `FT-<nnn> verificação: ACEITO` | entrega, itens 2-3 | saldo de horas e conclusão da `[VER]` (`elm_horas` → `elm_lancar_horas` do saldo → `elm_transicao(<id>, "concluir")`, numa confirmação; sem o MCP `elm` → `ELM pendente [VER FT-<nnn> concluir]: lançar <h>h e concluir`) | o **Dev responsável**: a fatia está `aceita`, à espera do merge (`sa-desenvolver.encerrar`) |
| REJEITADO · AFK | `implementando` | — | — | — | — | devolva: a `sa-codificar` corrige e a verificação roda de novo (só os rejeitados + os de repetição); o `🔁` fica no Drift, não vira tarefa |
| REJEITADO · HITL | `retrabalho (de: em-verificacao)` | "retrabalho" +1 em Rodadas; uma linha na tabela **Retrabalho** (papel `VER`) | `FT-<nnn> verificação: REJEITADO` | entrega, itens 2-3 | horas da sessão na `[VER]` (lança, não conclui; sem o MCP `elm` → `ELM pendente [VER FT-<nnn> horas]: lançar <h>h (<data>)`); a `[VER]` fica em andamento | o Dev responsável |
| só `⚠️ ambiente` | `bloqueada (de: verificando)` (HITL: `de: em-verificacao`), com o que falta | — | — | — | — | ninguém corrige código: diga o que falta |
| Volta (HITL, a pessoa decidiu) | o bloco [Volta à especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação) (`de: em-verificacao`) | — | `FT-<nnn> verificação: volta à especificação` | entrega, itens 2-3 | horas da sessão na `[VER]`, como no REJEITADO · HITL; a `[VER]` fica em andamento | quem o `Próximo:` do bloco diz (o especificador, ou o P.O. ou o SM, agente `sa-produto`) e o Dev responsável |

**Entrega** (HITL: ACEITO, REJEITADO e Volta), nesta ordem — o Dev só acha o seu trabalho no remoto:

1. créditos da sessão no `status.md` ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4) e, se a
   pessoa corrigiu algo nesta sessão, uma linha nas **Lições candidatas** (a consolidação a registra); commit de
   `verificacao.md`, `CT.csv` (ACEITO), `evidencias/`, `massa/` e `status.md`, com a mensagem da tabela;
2. push da branch do PR (`git push origin <branch>`, nunca a base; o Kiro pergunta). Push recusado (pela
   pessoa ou pela regra) → entregue o comando pronto e espere a pessoa dizer que publicou;
3. **confira no remoto:** `git fetch` e `git rev-parse HEAD` = `git rev-parse origin/<branch>`;
4. só então: a coluna ELM e o aviso.

## Saída

ACEITO → AFK: `fase: verificada`, devolva a quem chamou; HITL: `fase: aceita`, entregue e o Dev avisado. REJEITADO →
achados no `status.md` e a fase do retrabalho. Aqui o fluxo termina.

## Pare se

- Remoto diferente do local (entrega, item 3) → não siga: diga o que falta.
- Só `⚠️ ambiente` → a linha dela na tabela; ninguém corrige código.
- Volta à especificação (HITL, a pessoa decidiu) → a linha Volta da tabela, com a entrega.
- Cenário errado na ficha sem épico, fora dos artefatos (`C<n>`, decisão) → `fase: bloqueada (de: verificando)`
  (HITL: `de: em-verificacao`) com a pergunta ao P.O.: a ficha, pela `sa-triar` (agente `sa-produto`).
