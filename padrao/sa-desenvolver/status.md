---
{"resumo": "Formato do status.md da fatia (quick e completo): Rota, Autonomia, Fase, MR, Publicação e as seções Desvios, Em aberto, Lições e Retomar."}
---
# FT-<nnn> — <título>

| Campo | Valor |
|---|---|
| Rota | <quick \| completo> |
| Autonomia | <IA supervisionada \| IA autopilot \| manual> |
| Fase | <— \| implementando \| revisando \| verificando \| pr-aberto \| retrabalho> |
| MR | <— \| !<iid> <url>> |

<!-- Rota: escolhida por quem desenvolve ao assumir (sa-desenvolver.iniciar.assumir); a troca é um Desvio (Tipo rota).
     A rota trivial não tem status.md: o estado fica no MR e no último commit.
     Autonomia: o modo da codificação, escolhido ao assumir e fixo até o fim da tarefa. manual = só a geração do
     código-fonte é da pessoa; status.md, branch, plano, validar, revisão, verificação, Lições e MR seguem iguais.
     Fase: — até o plano ser aprovado (sa-plano.plano.aprovar grava implementando); depois, quem conduz a
     codificação grava. em-revisao não é fase: é derivado do MR aberto.
     Publicação: só com ELM e arquivos em elm/, depois do merge. Acrescente a linha
     | Publicação | <pendente | publicada AAAA-MM-DD> | — a sa-especificar.archive grava pendente e a
     sa-elm.publicar grava publicada. Linha ausente = nada a publicar ou ainda antes do merge. -->

## Desvios

| Data | Tipo | O quê | Decisão |
|---|---|---|---|

<!-- O que saiu do plano. Data AAAA-MM-DD · Tipo ∈ plano · rota · disjuntor · posse. No autopilot, também os achados
     triados pela recomendação do revisor. -->

## Em aberto

| Pergunta | Para quem | Bloqueia |
|---|---|---|

<!-- Pergunta ao especificador ou ao P.O., ou dependência (ex.: BD-nnn da DDL). Para quem ∈ especificador · P.O. ·
     <usuario>. Bloqueia ∈ tarefa N.M · MR · nada. No autopilot, o que gravaria na base entra aqui como
     "capturar: <tipo> · <título> · origem FT-<nnn>" e volta à pessoa no resumo. -->

## Lições

| Lição | Origem | Regra proposta |
|---|---|---|

<!-- Gravadas antes do MR (sa-desenvolver.codificar.licoes). Origem ∈ tarefa N.M · MR !<n> · CT-nn. A curadoria é da
     review do ciclo (sa-planejamento.review), que leva as escolhidas às Regras aprendidas do .sabia/sabia.md. -->

## Retomar

Feito: <o que foi feito> · Próximo: <o próximo passo exato>

<!-- No manual: "codificação manual; avise quando terminar". Falha de ambiente: "⚠️ ambiente: <o que faltou>".
     Gravado por sa-desenvolver.iniciar, sa-plano.plano, sa-desenvolver.codificar (a cada tarefa e na pausa) e
     sa-status.fechar-sessao. -->
