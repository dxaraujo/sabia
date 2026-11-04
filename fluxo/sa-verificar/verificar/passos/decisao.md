---
{"resumo": "Decisão ACEITO/REJEITADO com o Drift de negócio indicado e decidido pela pessoa; ACEITO (com o CT.csv do passo casos): verificada (AFK) ou aceita com a entrega e a conclusão da [VER] (HITL); REJEITADO: achados e retrabalho; ambiente, volta à especificação ou cenário errado na ficha sem épico: bloqueada; lição nas Lições candidatas."}
---
## Entrada

O resultado de cada cenário no `verificacao.md` (passo `executar`) e, com todos aceitos, o `CT.csv` (passo `casos`).

## Faça

```
🔎 Verificação FT-<nnn> — rodada <N>
Cenários: <a> aceitos · <r> rejeitados · <e> ambiente
Drift de negócio: não | sim — <motivo> · artefatos: <id|rótulo> (<tipo>)
VERIFICACAO: ACEITO | REJEITADO
```

**Drift de negócio** — o agente **indica** `sim` quando o comportamento entregue (o do contrato de pronto) diverge do
artefato aprovado (o de `elm/` da pasta da fatia, o do épico ou o do bundle), ou quando o cenário rejeitado parece
errado no artefato, não no código. HITL: grave-o no campo do `status.md` (só sobe de `não` para `sim`; sobre um campo já decidido, o padrão
`sa-desenvolver/status.md`) e a pessoa
decide, antes do resultado: `Drift: <motivo> · <artefatos>. Volta à especificação, ou o código está errado?`
— **código errado** → o cenário é rejeitado (REJEITADO, abaixo), o Drift fica `não` e o Histórico ganha
`drift descartado: código errado (<login>)`; **volta** → ` · especificação: [ESP] FT-<nnn>` no Drift e o Pare se.
AFK: fica no relatório e quem conduz grava; quem decide é o Dev Sênior na `[APR] Aprovar PR`.

- **ACEITO** (todos aceitos) → o `CT.csv` já está gerado (passo `casos`).
  - **AFK** (subagente do loop ou da `sa-codificar`): `fase: verificada` e devolva para abrir o PR (passo
    `sa-codificar.codificar.pr`). Não há `[VER]` no EWM (Q8).
  - **HITL**: `fase: aceita`, e a **entrega**, nesta ordem — o Dev só acha o seu trabalho no remoto:
    1. créditos da sessão no `status.md` ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4) e, se a
       pessoa corrigiu algo nesta sessão, uma linha nas **Lições candidatas** (a consolidação a registra); commit de
       `verificacao.md`, `CT.csv`, `evidencias/`, `massa/` e `status.md` (`FT-<nnn> verificação: ACEITO`);
    2. push da branch do PR (`git push origin <branch>`, nunca a base; o Kiro pergunta). Push recusado (pela
       pessoa ou pela regra) → entregue o comando pronto e espere a pessoa dizer que publicou;
    3. **confira no remoto:** `git fetch` e `git rev-parse HEAD` = `git rev-parse origin/<branch>`;
    4. só então: saldo de horas e conclusão da `[VER]` (`elm_horas` → `elm_lancar_horas` do saldo → `elm_transicao(<id>, "concluir")`, numa
       confirmação; sem o MCP `elm` → `ELM pendente [<chave>]: lançar <h>h e concluir [VER] FT-<nnn>`) e avise o **Dev
       responsável** de que a fatia está `aceita`, à espera do merge (`sa-desenvolver.encerrar`).
- **REJEITADO** → para cada cenário, esperado × obtido + evidência, registrados no `status.md` como achados.
  AFK: `fase: implementando` (salvo o cenário que o agente indica como do artefato: Pare se); a `sa-codificar` corrige e a verificação roda de novo (só os rejeitados + os de
  repetição). HITL: `fase: retrabalho (de: em-verificacao)`, "retrabalho" +1 em Rodadas e uma linha na tabela
  **Retrabalho** (papel VER); a `[VER]` fica em andamento; entrega como no aceito (commit `FT-<nnn> verificação: REJEITADO` → push →
  conferir no remoto) e avise o Dev responsável. Se o
  problema é o artefato ou a ficha, não o código, diga isso (Drift, acima; ficha sem épico: Pare se).
- Cenário misto (❌ + ⚠️) → REJEITADO, e o ⚠️ também vai para Achados como "ambiente".

## Saída

ACEITO → AFK: `fase: verificada`, devolva a quem chamou; HITL: `fase: aceita`, entregue e o Dev avisado. REJEITADO →
achados no `status.md` e a fase do retrabalho. Aqui o fluxo termina.

## Pare se

- Remoto diferente do local (entrega, item 3) → não siga: diga o que falta.
- Só `⚠️ ambiente` → `fase: bloqueada (de: verificando)` (HITL: `de: em-verificacao`) com o que falta; ninguém corrige código.
- Volta à especificação (HITL, a pessoa decidiu) → o bloco [Volta à especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação) (`de: em-verificacao`); entrega como no rejeitado (commit
  `FT-<nnn> verificação: volta à especificação` → push → conferir no remoto), a `[VER]` fica em andamento (horas da
  sessão lançadas) e avise o especificador (`sa-especificar FT-<nnn>`, agente `sa-especificador`) e o Dev responsável.
- AFK, cenário rejeitado que o agente indica como do artefato → `fase: bloqueada (de: verificando)` com a indicação e
  a pergunta `Volta à especificação, ou o código está errado? (Dev Sênior)`; ninguém corrige código.
- Cenário errado na ficha sem épico, fora dos artefatos (`C<n>`, decisão) → `fase: bloqueada (de: verificando)`
  (HITL: `de: em-verificacao`) com a pergunta ao P.O.: a ficha, pela `sa-triar` (agente `sa-produto`).
