---
{"resumo": "Bloco 🔎 Verificação no fim da rodada do verificacao.md, devolvido a quem chamou: ACEITO/REJEITADO/AMBIENTE com a possível alteração indicada (🔁; HITL: provisório, decidido pela pessoa no hitl; AFK: decidido pelo Dev Sênior na [APR]); AFK: verificada ou implementando; ambiente ou cenário errado na ficha sem épico: bloqueada."}
---
## Entrada

O resultado de cada cenário no `verificacao.md` (passo `executar`) e, com todos aceitos, o `CT.csv` (passo `casos`).

## Faça

Grave o bloco no fim da rodada, no fim do `verificacao.md` (padrão `sa-verificar/verificacao.md`, Decisão); como
subagente, devolva-o também a quem chamou.

```
🔎 Verificação FT-<nnn> — rodada <N>
Cenários: <a> aceitos · <r> rejeitados · <e> ambiente · <p> possível alteração
Drift de negócio: não | possível alteração — <motivo> · artefatos: <id|rótulo> (<tipo>)
VERIFICACAO: ACEITO | REJEITADO | AMBIENTE
```

**Drift de negócio** — o agente **indica** a `possível alteração` quando o comportamento entregue (o do contrato de
pronto) diverge do artefato aprovado (o de `elm/` da pasta da fatia, o do épico ou o do bundle), ou quando o cenário
parece errado no artefato, não no código. HITL: quem chama (`sa-verificar.hitl`) a grava no campo do `status.md`, e a
pessoa decide antes do resultado da tarefa. O cenário que você atribui a um artefato fica `🔁 possível alteração` no
`verificacao.md` e não vira tarefa de código — no HITL, provisório até a decisão da pessoa. AFK: a linha fica no
relatório e quem conduz a grava no Drift; quem decide é o Dev Sênior na `[APR] Aprovar PR`.

**Resultado** da rodada:

- **ACEITO** — só `✅` e `🔁`, com o Drift `possível alteração — …`. O `CT.csv` já está gerado (passo `casos`; no
  HITL com `🔁`, ele espera a decisão da pessoa).
- **REJEITADO** — algum `❌`: para cada cenário, esperado × obtido + evidência, só no `verificacao.md` (como os
  achados da revisão no relatório dela; a `sa-codificar` os leva a Achados abertos, passo `sa-codificar.codificar.onde`).
  Se o problema é o artefato ou a ficha, não o código, diga isso (Drift, acima; ficha sem épico: Pare se).
- **AMBIENTE** — só `⚠️ ambiente` (nenhum `❌`): ninguém corrige código (tabela abaixo).
- Rodada com ❌ e ⚠️ em cenários diferentes → REJEITADO; os ⚠️ ficam no `verificacao.md` como `⚠️ ambiente`.

| Resultado · Modo | fase | aviso |
|---|---|---|
| ACEITO · AFK (subagente do loop ou da `sa-codificar`) | `verificada` | devolva para abrir o PR (passo `sa-codificar.codificar.pr`); a possível alteração segue com o PR para a `[APR]` |
| REJEITADO · AFK | `implementando` | devolva: a `sa-codificar` corrige e a verificação roda de novo (rodada nova, roteiro); o `🔁` fica no Drift, não vira tarefa |
| ACEITO ou REJEITADO · HITL | continua `em-verificacao` | devolva ao `sa-verificar.hitl`: a decisão da pessoa, a fase, a entrega e a `[VER]` são dele |
| AMBIENTE (só `⚠️ ambiente`) | `bloqueada (de: verificando)` (HITL: `de: em-verificacao`), Bloqueio `⚠️ ambiente: <o que faltou>` | ninguém corrige código: diga o que falta, sem contar rejeição (HITL: devolva ao `sa-verificar.hitl`, que faz a entrega) |

Aqui não há commit, push nem ELM: no AFK não há `[VER]` no EWM, e o commit é de quem chamou.

## Saída

O bloco no `verificacao.md`, devolvido a quem chamou: AFK, ACEITO → `fase: verificada`; REJEITADO → `fase:
implementando`; AMBIENTE → `bloqueada`; HITL, a fase segue `em-verificacao` (AMBIENTE: `bloqueada`). Aqui o fluxo termina.

## Pare se

- `VERIFICACAO: AMBIENTE` → a linha dela na tabela; ninguém corrige código.
- Cenário errado na ficha sem épico, fora dos artefatos (`C<n>`, decisão) → `fase: bloqueada (de: verificando)`
  (HITL: `de: em-verificacao`, devolvida ao `sa-verificar.hitl`, que faz a entrega) com a pergunta ao P.O.: a ficha,
  pela `sa-triar` (agente `sa-produto`).
