---
{"fluxo": "fatiar", "dono": "sa-produto",
 "quando": ["o primeiro fatiamento de um PRD aprovado: rascunho, GATE do backlog e gravação na base", "fatiar o PRD", "quebrar em histórias", "gerar o backlog", "criar os itens de backlog", "PRD para issues"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "sprint": "nao"},
   {"id": "rascunho", "chama": "sa-pesquisar.pesquisar"},
   {"id": "perguntar", "saidas": {"ajuste pedido: repita até o ok": "perguntar", "conceito do PRD que precisa mudar": "→ sa-prd.mudanca"}},
   {"id": "gravar"},
   {"id": "proximos", "saidas": {"alocar as fatias na sprint: planejamento ou encaixe": "fim"}}
 ]}
---
# Fatiar — PRD → fatias verticais

Entrada: o PRD aprovado — a linha `| Fase | aprovado |` no `status.md` do épico, na base
(`<produto>/epicos/<EP>-<slug>/`, com o `prd.md` e a `elm/` aprovada; no refinamento, `fatiado`); a `[ESP]` concluiu
depois do GATE do PRD, com a publicação no ELM (`sa-especificar.especificar.concluir`). Saída: fatias no
`<produto>/backlog.md` (formato em [references/backlog.md](~/.sabia/framework/skills/sa-fatiar/references/backlog.md)) e a ficha de cada uma (`<produto>/fatias/FT-<nnn>-<slug>.md`, formato
"padrão de épico" do padrão `sa-triar/ficha.md`, com a seção Artefatos afetados vinda do PRD).

**Processo de produto:** quem fatia é o **P.O. ou o SM**, no agente **`sa-produto`**, sob a **`[GB] Gerenciamento
do backlog`** (horas só do SM; os créditos num comentário nela). O GATE do backlog é do P.O. ou do SM.

## Entrada: vizinhos

- `fatiado` (cancelar fatias ou o épico) → `sa-fatiar.refinamento`
- `rascunho` ou `em-revisao` (o PRD ainda não aprovado, ou em mudança; agente `sa-especificador`) → `sa-especificar.especificar`
- `aprovado` com a Especificação ainda `iniciada` (a publicação e a conclusão da `[ESP]` depois do GATE do PRD; agente `sa-especificador`) → `sa-especificar.especificar`
- `aprovado` com a linha viva `planejada` de uma `[ESP] EP-nn Revisão <n>` (a mudança antes do fatiamento; agente `sa-especificador`) → `sa-prd.mudanca`
- `aprovado` com a `obs` `falta: especificação` na linha do épico, com sprint aberta (a `[ESP] EP-nn Revisão <n>` pelo encaixe) → `sa-planejamento.durante`
- `aprovado` com a `obs` `falta: especificação` na linha do épico, sem sprint aberta (pendência do P.O. na `[GB]`, para o próximo planejamento) → `sa-planejamento.sprint`

## Modo autônomo

Fatiar é decisão de uma pessoa (o GATE do backlog): chamada em modo autônomo (`AUTONOMO=true`, pelo loop ou por um
agente sem pessoa na conversa) → "PRD, backlog e itens de Sustentação (`AT-`, `IM-`…) nunca são AFK — fatie numa
sessão com o P.O. ou o SM" e pare.

## Regras

- Nunca crie fatia por camada técnica ou por papel ("especificar X", "testar X") — o trabalho de todos os papéis
  na mesma fatia é a mesma fatia.
- Dividir, juntar ou mudar uma fatia, só antes do GATE do backlog (passo `perguntar`). Depois dele, no backlog, a
  fatia não se altera mais: o P.O. ainda pode cancelá-la (`sa-fatiar.refinamento`), e cenário novo é épico ou fatia
  nova pela `sa-triar`.
- O fatiamento não muda conceito do PRD: artefato que precisa mudar → `sa-prd.mudanca` (agente `sa-especificador`),
  antes de fatiar.
- Tamanho não é promessa de prazo: é o sinal de que a fatia cabe num PR revisável.
- Não invoque nem simule outra skill além das que os passos mandam chamar (subagente pesquisador): depois
  do GATE do backlog, diga os próximos passos (passo `proximos`) e pare.
