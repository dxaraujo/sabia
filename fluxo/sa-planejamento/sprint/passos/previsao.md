---
{"resumo": "Previsão (não compromisso): DoR das fatias do topo e seleção das elegivel por prioridade e dependência até a menor das capacidades; revisor e verificador no HITL."}
---
## Entrada

O `backlog.md` e as capacidades (passo `capacidade`).

## Faça

**Previsão** (não compromisso): confira a [Definition of Ready](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#definition-of-ready-o-que-faz-uma-fatia-elegivel)
das fatias `nova` e `elegivel` do topo e grave `elegivel` nas que passam (ou `nova`, com `obs` `falta: <o quê>`,
nas que deixaram de passar). Entram as `elegivel` — de épico e de Manutenção — pela `prioridade` (crítica →
baixa, `—` no fim; no empate, a ordem da linha no `backlog.md`), respeitando `bloqueada-por` — a fatia só entra
se as dependências entram antes ou já estão `pronta` ou `concluida`. Pare ao atingir a menor das capacidades.
As fatias `nova` com só `falta: especificação` são **recomendadas** pela `prioridade`, antes das `elegivel` que
dependem delas: entram como especificação (abaixo), dentro da capacidade de especificação, com o "sim" da pessoa.
Outra fatia `nova` que a pessoa quer na sprint → **não barre**: avise que ela entra **como especificação**, com a
`[ESP] FT-<nnn>` (a `[ESP] FT-<nnn> Revisão <n>` quando a dela já concluiu: passo `especificacao`; `falta: <o quê>` — decisão, PRD, fatiar, ficha, especificação), na seção Especificação, dentro da capacidade
de especificação; ela não conta na vazão nem ganha `[DEV]` agora (ganha quando, `elegivel`, entrar numa sprint ou
for puxada). Cada fatia **HITL** prevê
**revisor** — um **Dev Sênior**, pela regra do revisor (passo `modo`) — e **verificador** (não quem
implementa), e a soma das revisões e verificações (as horas de `[REV]` e `[VER]` da linha `Horas por tamanho`
do `acordos.md`, pelo `Tam.`) cabe nas horas de revisão do time; fatia **AFK** não tem
(revisão e verificação por subagente, sem `[REV]`/`[VER]`) — a revisão humana dela é a leitura do PR. As
**aprovações previstas** também consomem as horas de revisão dos Dev Sêniores: o plano de cada fatia de Júnior
(e de Pleno que costuma pedir o GATE) e o PR de cada fatia AFK. A `[APR]` não nasce aqui — nasce no gate.

## Saída

A lista das fatias previstas (e as próximas a puxar) → passo `responsaveis`.

## Pare se

Sem condição de parada própria: a seleção para na menor das capacidades, e a fatia `nova` pedida entra como
especificação.
