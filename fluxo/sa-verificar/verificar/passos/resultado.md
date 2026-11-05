---
{"resumo": "Bloco 🔎 Verificação no verificacao.md, devolvido a quem chamou: ACEITO/REJEITADO com a possível alteração indicada (HITL: decidida pela pessoa no hitl; AFK: 🔁, decidida pelo Dev Sênior na [APR]); AFK: verificada ou implementando; ambiente ou cenário errado na ficha sem épico: bloqueada."}
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
parece errado no artefato, não no código. HITL: quem chama (`sa-verificar.hitl`) a grava no campo do `status.md`, e a
pessoa decide antes do resultado da tarefa. AFK: o cenário que você atribui a um artefato fica `🔁 possível
alteração` no `verificacao.md` e não vira tarefa de código; a linha fica no relatório e quem conduz a grava no Drift;
quem decide é o Dev Sênior na `[APR] Aprovar PR`.

**Resultado** da rodada:

- **ACEITO** — todos aceitos; no AFK, só `✅` e `🔁`, com o Drift `possível alteração — …`. O `CT.csv` já está gerado
  (passo `casos`).
- **REJEITADO** — algum `❌`: para cada cenário, esperado × obtido + evidência, registrados no `status.md` como
  achados. Se o problema é o artefato ou a ficha, não o código, diga isso (Drift, acima; ficha sem épico: Pare se).
- Rodada com ❌ e ⚠️ em cenários diferentes → REJEITADO; os ⚠️ ficam no `verificacao.md` como `⚠️ ambiente` e vão
  também para Achados como "ambiente".

| Resultado · Modo | fase | aviso |
|---|---|---|
| ACEITO · AFK (subagente do loop ou da `sa-codificar`) | `verificada` | devolva para abrir o PR (passo `sa-codificar.codificar.pr`); a possível alteração segue com o PR para a `[APR]` |
| REJEITADO · AFK | `implementando` | devolva: a `sa-codificar` corrige e a verificação roda de novo (só os rejeitados + os de repetição); o `🔁` fica no Drift, não vira tarefa |
| ACEITO ou REJEITADO · HITL | continua `em-verificacao` | devolva ao `sa-verificar.hitl`: a decisão da pessoa, a fase, a entrega e a `[VER]` são dele |
| só `⚠️ ambiente` | `bloqueada (de: verificando)` (HITL: `de: em-verificacao`), com o que falta | ninguém corrige código: diga o que falta |

Aqui não há commit, push nem ELM: no AFK não há `[VER]` no EWM, e o commit é de quem chamou.

## Saída

O bloco no `verificacao.md`, devolvido a quem chamou: AFK, ACEITO → `fase: verificada`; REJEITADO → achados no
`status.md` e `fase: implementando`; HITL, a fase segue `em-verificacao`. Aqui o fluxo termina.

## Pare se

- Só `⚠️ ambiente` → a linha dela na tabela; ninguém corrige código.
- Cenário errado na ficha sem épico, fora dos artefatos (`C<n>`, decisão) → `fase: bloqueada (de: verificando)`
  (HITL: `de: em-verificacao`) com a pergunta ao P.O.: a ficha, pela `sa-triar` (agente `sa-produto`).
