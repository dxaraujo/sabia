---
{"resumo": "Depois de cada GATE: leva o PRD aprovado, com o protótipo registrado, para a base (um commit) e, depois do GATE do backlog, conclui a linha da Especificação e a [ESP]."}
---
## Entrada

Um GATE feito: Fase `aprovado` no `status.md` da pasta de trabalho (GATE do PRD) ou `fatiado` no da base (GATE do
backlog), com a `[ESP]` aberta. Ou, pelo passo `entrada`: o épico `concluido` com a linha da Especificação ainda
`iniciada` (só os itens 2–3 de "Depois do GATE do backlog").

## Faça

Fechamentos da `[ESP]` (depois de cada GATE). A `sa-prd` e a `sa-fatiar` conduzem o GATE e gravam só o próprio artefato; o que é da `[ESP]` é daqui.

**Depois do GATE do PRD** (Fase `aprovado` no `status.md` da pasta de trabalho, gravada pela `sa-prd`):
1. Feche a sessão (passo `fechar-sessao`), para a `[ESP]` ter a versão aprovada.
2. Leve a pasta para a **base**, pelo bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base):
   copie-a, fora de `reunioes/` (a transcrição fica só nesta máquina), para `<produto>/epicos/<EP>-<slug>/`, com
   `prototipo/` só com as versões registradas (`prototipo-v<N>-<slug>.<ext>`, conferidas com dado fictício; arquivo
   sem o prefixo fica fora; o anexo da `[ESP]` continua)
   (substitui o `rascunho.md`, o `decisoes.md` e o `status.md` da triagem), com o `revisao-prd-<N>.md`; no
   `backlog.md`, só o link `prd` na linha do épico e, se estava `—`, o da `pasta` (ele segue `iniciado`; a sprint
   não muda). **Um** commit (padrão do `sabia.md`), direto na base; nunca numa
   branch de fatia. A partir daí a base é a fonte; a pasta local pode ser apagada pela pessoa (o fluxo não apaga).
3. Próximo, e pare: a [publicação dos requisitos](~/.sabia/framework/skills/sa-consolidar/references/elm-publicar.md) (se o projeto usa ELM e
   a publicação é `na-aprovacao`) e **`sa-fatiar`**.

**Depois do GATE do backlog** (Fase `fatiado` no `status.md` do épico na base, `[ESP]` aberta):
1. Pergunte se a especificação terminou. Continua (refinamento na próxima sprint) → não conclua: a linha segue
   `iniciada`, a virada a migra e, no EWM, só muda o `plannedFor`; pare.
2. No `sprint-<nn>.md` aberto, a linha do épico na seção Especificação com Situação `concluida` e os Créditos (a
   soma da seção Créditos do `status.md` do épico; o `creditos` do `backlog.md` é da virada da sprint), pelo bloco
   Gravar na base, um commit. O épico segue `iniciado` no `backlog.md`, com as fatias.
3. **Conclusão da `[ESP]`** (com ELM): mostre as horas já lançadas (`elm_horas(id)`) e pergunte só o saldo a quem especificou →
   `elm_lancar_horas(id, horas)` e `elm_transicao(id, "concluir")`, numa confirmação. Sem o MCP `elm` → `ELM pendente [<chave>]: lançar
   <h>h e concluir [ESP] EP-<nn>` no rodapé do PRD (no mesmo commit).

Situação da linha do épico na seção Especificação ([situações](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#situações)):
`planejada` (`sa-planejamento`), `iniciada` (passo `assumir`) e `concluida` (GATE do backlog), estas duas gravadas aqui;
`cancelada` com o épico cancelado (`sa-fatiar`).

## Saída

GATE do PRD → o PRD aprovado na base e a próxima dita (publicação e `sa-fatiar`). GATE do backlog → a linha da
Especificação `concluida` e a `[ESP]` concluída (ou `ELM pendente`). Aqui o fluxo termina.

## Pare se

- Depois do GATE do PRD: próximo dito (item 3) → pare.
- Depois do GATE do backlog: a especificação continua (refinamento na próxima sprint) → não conclua; pare.
