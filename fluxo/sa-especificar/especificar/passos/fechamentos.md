---
{"resumo": "Depois do GATE do PRD (o primeiro, ou a mudança antes do fatiamento): no primeiro GATE, fecha a sessão e leva o PRD aprovado, com o protótipo registrado, para a base (um commit); com o PRD já na base, nada aqui; a publicação e a conclusão da [ESP] vêm nos passos seguintes."}
---
## Entrada

O GATE do PRD feito, com a `[ESP]` aberta: Fase `aprovado` no `status.md` da pasta de trabalho (o primeiro GATE) ou,
pelo passo `entrada`, no da base com a Especificação ainda `iniciada` (a mudança antes do fatiamento, `sa-prd.mudanca`,
ou a retomada da publicação).

## Faça

Fechamentos do GATE do PRD. A `sa-prd` conduz o GATE e grava só o próprio artefato; o que é da `[ESP]` é daqui e
dos passos `publicar` e `concluir`. O fatiamento e o backlog são do P.O. ou do SM.

1. **Primeiro GATE** → feche a sessão (passo `fechar-sessao`), para a `[ESP]` ter a versão aprovada. **PRD já na
   base** (a mudança ou a retomada da publicação) → não fecha aqui: a sessão fecha no Pare se do passo `publicar` ou
   no passo `concluir`, antes do commit da conclusão.
2. **Base**, pelo bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), **um** commit
   (padrão do `sabia.md`), direto na base; nunca numa branch de fatia:
   - **primeiro GATE** → leve a pasta: copie-a, fora de `reunioes/` (a transcrição fica só nesta máquina), para
     `<produto>/epicos/<EP>-<slug>/`, com `prototipo/` só com as versões registradas (`prototipo-v<N>-<slug>.<ext>`,
     conferidas com dado fictício; arquivo sem o prefixo fica fora; o anexo da `[ESP]` continua) (substitui o
     `rascunho.md`, o `decisoes.md` e o `status.md` da triagem), com o `revisao-prd-<N>.md`; no `backlog.md`, só o
     link `prd` na linha do épico e, se estava `—`, o da `pasta` (ele segue `iniciado`). Commit `EP-<nn> aprovar PRD`.
     A partir daí a base é a fonte; a pasta local pode ser apagada pela pessoa (o fluxo não apaga);
   - **PRD já na base** (a mudança, que o passo `sa-prd.prd.gate` commitou, ou a retomada) → nada aqui.

## Saída

O PRD aprovado na base → passo `publicar`.

## Pare se

Nenhum caso próprio deste passo.
