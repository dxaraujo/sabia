---
{"resumo": "PRD aprovado e não fatiado só muda por pedido explícito, pela regra da tarefa de especificação (a [ESP] aberta, reaberta na sprint corrente, a Revisão pelo encaixe ou a pendência do P.O. na [GB]), numa versão nova do PRD com a mudança registrada nele; Fase em-revisao (de: aprovado), conceitos alterados em draft e o GATE de novo. Fatiado: a [ESP] FT da fatia ou a sa-triar."}
---
## Entrada

Épico com o PRD aprovado na base, na Fase `aprovado` ou `fatiado`, e um pedido explícito de mudança no PRD (da
pessoa, da ATA, ou o da `[ESP] EP-<nn> Revisão <n>`: a Observação `revisão <n>: <motivo>` da linha dela).

## Faça

O PRD aprovado só muda por um pedido explícito, e só antes do fatiamento:

- **`fatiado`** → o PRD não muda (o DOORS Next é a fonte). Alteração de artefato que uma fatia não terminal cobre →
  a [Volta à especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação) dessa fatia
  (não iniciada: a linha na seção Artefatos afetados, com Especificado `—`, e a DoR volta a `nova` com
  `falta: especificação`; iniciada: item Pedido de fora da fatia) e mostre o bloco 🔁 da Volta à especificação: o próximo é o da linha
  `Próximo:` dele (`sa-especificar FT-<nnn>`, agente `sa-especificador` · encaixe: `sa-planejamento`, agente
  `sa-produto` · próximo planejamento: P.O. ou SM, agente `sa-produto`); escopo novo (história, regra ou ator que o PRD não tem), ou a fatia já terminal → "use
  `sa-triar` com origem EP-<nn>" (agente `sa-produto`).
- **`aprovado`** (o intervalo GATE do PRD → fatiamento) → a mudança é da tarefa de especificação do épico, pela
  tabela da [Volta à especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação),
  com o bloco dela (`EP-<nn>`):
  1. **`[ESP]`** aberta → segue nela; a `[ESP] EP-<nn> Revisão <n>` ainda `planejada` → `assumir`, com "sim" (seção
     Assumir do passo `sa-especificar.especificar.entrada`). Concluída na sprint aberta → `reabrir` e `assumir`, com
     "sim". Nos dois, a linha dela na seção Especificação do `sprint-<nn>.md` aberto fica `iniciada` (na reabertura,
     com a Observação `reaberta: <motivo>`) na hora, num commit próprio pelo bloco Gravar na base, antes da reunião
     (que exige a linha `iniciada`): `EP-<nn> reabrir especificação` na reabertura, `EP-<nn> iniciar especificação`
     na Revisão assumida. Concluída numa sprint fechada → não reabre: o pedido fica na `obs` `falta: especificação (<motivo>,
     <login>, <AAAA-MM-DD>)` da linha do épico no `backlog.md` (bloco
     [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), commit
     `EP-<nn> registrar pendência de especificação`) e diga: com sprint aberta, "o EP-<nn> entra na sprint aberta pelo
     encaixe e nasce a `[ESP] EP-<nn> Revisão <n>` (P.O. ou SM, agente `sa-produto`)"; sem sprint aberta, "pendência do
     P.O. na [GB]: o próximo planejamento cria a `[ESP] EP-<nn> Revisão <n>` (P.O. ou SM, agente `sa-produto`)"; e
     pare. A transcrição nova de uma reunião, sem ATA
     aprovada, é pedido explícito: com a `[ESP]` aberta, a reunião registra a ATA antes de mudar o PRD
     (`sa-especificar.reuniao`), e a decisão que muda o PRD volta aqui.
  2. **Versão nova** — o PRD sobe de versão (`1.1`, `1.2`…): uma linha na seção Mudanças do `prd.md` (Versão, Data, O
     que mudou, Origem: o pedido de `<login>`, a `ATA-<nn>` ou o `D-nn`; Aprovado por `—` até o GATE). Fase
     `em-revisao (de: aprovado)` enquanto o que mudou é revisto, e o GATE de novo. Conceito alterado:
     `status: draft`, `generated.at` novo; no GATE, um `verified` novo é acrescentado à lista, e o passo
     `sa-especificar.especificar.publicar` republica (o filtro pega o `verified` mais novo). Antes de escrever, grave
     na base, pelo bloco Gravar na base, **um** commit `EP-<nn> registrar mudança do PRD` com a linha da seção
     Mudanças e a Fase `em-revisao (de: aprovado)` no `status.md` do épico. Assim a retomada volta à revisão do PRD, e
     não à publicação.
  3. **Onde se edita** — direto na pasta do épico na base (`<produto>/epicos/<EP>-<slug>/`; a de trabalho guarda só
     `reunioes/`): o que a mudança edita ali fica sem commit até o GATE, e o commit `EP-<nn> aprovar PRD` do passo
     `sa-prd.prd.gate` leva a pasta (a exceção do bloco Gravar na base).

Artefato novo, alterado ou excluído que a mudança trouxer passa antes pelo passo `sa-prd.prd.similares`; a escrita
segue as regras do passo `sa-prd.prd.escrever`.

## Saída

- `aprovado` com a transcrição nova → a `[ESP]` aberta (ou reaberta) e `sa-especificar.reuniao` (a ATA primeiro).
- `aprovado` → o que mudou é revisto pelo passo `sa-prd.prd.revisao` e aprovado pelo passo `sa-prd.prd.gate`, no
  caminho "mudança antes do fatiamento".
- `aprovado` com a `[ESP]` concluída numa sprint fechada → o pedido na `obs` `falta: especificação (<motivo>, …)` e o
  encaixe da Revisão (P.O. ou SM) ou, sem sprint aberta, a pendência do P.O. na `[GB]` para o próximo planejamento
  (`sa-planejamento.sprint.especificacao`).
- PRD ainda na pasta de trabalho (sem o GATE, ou `aprovado` sem ir à base) → não é mudança: "use
  `sa-especificar EP-<nn>`" (a sessão da `[ESP]` segue no `sa-prd.prd`, ou leva o PRD para a base antes).
- `fatiado` → o próximo da linha `Próximo:` do bloco 🔁 (`sa-especificar FT-<nnn>`, agente `sa-especificador` ·
  encaixe: `sa-planejamento`, agente `sa-produto` · próximo planejamento: P.O. ou SM, agente `sa-produto`) ou a
  `sa-triar` (agente `sa-produto`).

## Pare se

- Sem pedido explícito de mudança → o PRD aprovado não muda: pare.
- PRD na pasta de trabalho, `fatiado`, ou a `[ESP]` concluída numa sprint fechada (item 1) → diga a próxima e pare.
