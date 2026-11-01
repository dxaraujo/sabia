---
{"resumo": "Decisão ACEITO/REJEITADO com o Drift de negócio; ACEITO (com o CT.csv do passo casos): verificada (AFK) ou aceita com a entrega e a conclusão da [VER] (HITL); REJEITADO: achados e retrabalho; ambiente ou PRD errado: bloqueada."}
---
## Entrada

O resultado de cada cenário no `verificacao.md` (passo `executar`) e, com todos aceitos, o `CT.csv` (passo `casos`).

## Faça

```
🔎 Verificação FT-<nnn> — rodada <N>
Cenários: <a> aceitos · <r> rejeitados · <e> ambiente
Drift de negócio: não | sim — <cenário ajustado e por quê>
VERIFICACAO: ACEITO | REJEITADO
```

**Drift de negócio** = `sim` quando algum cenário foi ajustado nesta verificação (o roteiro ou o Esperado deixou de
ser o do PRD ou da ficha, por decisão registrada). HITL: grave-o no campo do `status.md` (só sobe de `não` para
`sim`); AFK: fica no relatório e quem conduz grava. A consolidação só lê esse campo.

- **ACEITO** (todos aceitos) → o `CT.csv` já está gerado (passo `casos`).
  - **AFK** (subagente do loop ou da `sa-codificar`): `fase: verificada` e devolva para abrir o PR (passo
    `sa-codificar.codificar.pr`). Não há `[VER]` no EWM (Q8).
  - **HITL**: `fase: aceita`, e a **entrega**, nesta ordem — o Dev só acha o seu trabalho no remoto:
    1. créditos da sessão no `status.md` ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4); commit de `verificacao.md`, `CT.csv`, `evidencias/`,
       `massa/` e `status.md` (`FT-<nnn> verificação: ACEITO`);
    2. push da branch do PR (`git push origin <branch>`, nunca a base; o Kiro pergunta). Push recusado (pela
       pessoa ou pela regra) → entregue o comando pronto e espere a pessoa dizer que publicou;
    3. **confira no remoto:** `git fetch` e `git rev-parse HEAD` = `git rev-parse origin/<branch>`;
    4. só então: saldo de horas e conclusão da `[VER]` (`elm_horas` → `elm_lancar_horas` do saldo → `elm_transicao(<id>, "concluir")`, numa
       confirmação; sem o MCP `elm` → `ELM pendente [<chave>]: lançar <h>h e concluir [VER] FT-<nnn>`) e avise o **Dev
       responsável** de que a fatia está `aceita`, à espera do merge (`sa-desenvolver.encerrar`).
- **REJEITADO** → para cada cenário, esperado × obtido + evidência, registrados no `status.md` como achados.
  AFK: `fase: implementando`; a `sa-codificar` corrige e a verificação roda de novo (só os rejeitados + os de
  repetição). HITL: `fase: retrabalho (de: em-verificacao)`, "retrabalho" +1 em Rodadas e uma linha na tabela
  **Retrabalho** (papel VER); a `[VER]` fica em andamento; entrega como no aceito (commit `FT-<nnn> verificação: REJEITADO` → push →
  conferir no remoto) e avise o Dev responsável. Se o
  problema é o cenário estar errado no PRD, diga isso: é com o P.O., não com o código.
- Cenário misto (❌ + ⚠️) → REJEITADO, e o ⚠️ também vai para Achados como "ambiente".

## Saída

ACEITO → AFK: `fase: verificada`, devolva a quem chamou; HITL: `fase: aceita`, entregue e o Dev avisado. REJEITADO →
achados no `status.md` e a fase do retrabalho. Aqui o fluxo termina.

## Pare se

- Remoto diferente do local (entrega, item 3) → não siga: diga o que falta.
- Só `⚠️ ambiente` → `fase: bloqueada (de: verificando)` (HITL: `de: em-verificacao`) com o que falta; ninguém corrige código.
- Cenário errado no PRD (não no código) → `fase: bloqueada (de: verificando)` (HITL: `de: em-verificacao`) com a pergunta ao P.O.; a
  correção é a mudança do PRD depois de aprovado (`sa-prd.mudanca`), não o código.
