---
name: sa-especificar
description: "Skill for the Especificador (specifier) role in the Sabiá flow — drives the specification of an epic (épico, EP-nn) from the [ESP] task: claims the [ESP] in EWM (the epic becomes iniciado on the base branch), sets up the local working folder outside git (.sabia/local/especificacao/), routes by the Fase in the epic's status.md (sa-entrevistar → sa-prd → PRD GATE → sa-fatiar), brings the approved PRD to the base branch, completes the [ESP] after the backlog GATE and, at the end of each session with the client, records the elicitation in the [ESP] (comment + .md attachments with the latest version of each artifact) and logs the session's hours. Another machine resumes by downloading the attachments. Use when the user says \"especificar o EP-03\", \"pegar a [ESP] do EP-03\", \"retomar a especificação\", \"fechar a sessão de especificação\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "1.0.0"
---

# sa-especificar — Especificação de épico

> **Arquivos desta skill** (`references/`, `assets/` e os `../<skill>/…` citados abaixo) ficam na pasta desta skill, não no projeto:
> abra-os pelo caminho relativo a este `SKILL.md`. A busca no workspace não os encontra — não procure no projeto.

A especificação de um épico é trabalho junto ao cliente — levantamento de regras e definições — que dura várias
sessões antes do GATE do PRD. Ele fica registrado na tarefa `[ESP]` do EWM, não na base: até o GATE, a base só
recebe a situação do épico (Passo 2); o resto vai com o PRD aprovado. Esta skill é a do papel **Especificador**; o
épico chega `novo` ou `elegivel` pela `sa-triar` e `planejado` (com a `[ESP]`) pela `sa-planejamento`.

Leia antes: `.sabia/sabia.md`. Sem ele → ofereça a **`sa-setup`** ("configurar o Sabiá") e pare.

## Passo 1 — O que chegou

| Entrada | Como ler |
|---|---|
| `EP-nn` ou `[ESP] EP-nn` | linha do épico em `## Épicos` do `backlog.md` da base; a `[ESP]` pela coluna `elm` (`ESP <id>`) ou pela Tarefa ELM da seção Especificação do `sprint-<nn>.md` |
| `FT-nnn`, `[DEV]`, `[REV]`, `[VER]`, `AT-nnn` | não é deste papel → "use `sa-iniciar <item>`" e pare |
| pedido em texto, ou épico fora do backlog | não está registrado → "use `sa-triar`" e pare |

**DoR do épico:** a do [`backlog.md`](../sa-fatiar/references/backlog.md#definition-of-ready-o-que-faz-uma-fatia-elegivel)
(o problema, quem pede, o resultado e o `po`) — `elegivel` ou adiante já passou; `novo`, confira agora. Faltando →
liste e pare: a `sa-triar` completa o registro antes. `concluido` ou `cancelado` → nada a especificar; pare —
salvo `concluido` com a linha da Especificação ainda `iniciada`: só os itens 2–3 de "Depois do GATE do backlog"
(Passo 6), que gravam `concluida` e concluem a `[ESP]`. Épico
não planejado (`novo` ou `elegivel`, sem `[ESP]`) → ofereça a `sa-planejamento` (seção Especificação); a pessoa
pode seguir sem tarefa — a linha dele nasce na sprint aberta (Passo 2), como a da fatia puxada, e as horas ficam
`ELM pendente`. O `elegivel` que saiu de uma sprint sem começar (a linha dele nessa sprint tem `saiu da sprint`, e o
`elm` do épico no `backlog.md` guarda o `ESP <id>`) não conta como sem `[ESP]`: a dele ficou no backlog do EWM, é a
`[ESP]` da linha e move com o IB do épico para a iteração da sprint (Passo 2).

## Passo 2 — Assumir a `[ESP]`

1. **Situação na base** — a exceção ao "nada vai à base antes do GATE do PRD" (Regras): pelo bloco
   [Gravar na base](../sa-fatiar/references/backlog.md#gravar-na-base), o épico `iniciado` no `backlog.md` e a linha
   dele na seção Especificação do `sprint-<nn>.md` aberto com Situação `iniciada`; um commit, `EP-<nn> iniciar`.
   Épico não planejado → no backlog, `sprint` = a chave da sprint aberta, e a linha nasce agora (quem assume, Horas
   previstas `—`, `ESP <id>` — a que ficou no backlog do EWM — ou `pendente`, Observação `puxada`), nova mesmo se a
   sprint tem a dele com `saiu da sprint` (histórico, pela Linha viva); nenhuma sprint aberta (planejamento ainda não
   feito) → ofereça a `sa-planejamento` e não comece (nada na base nem no EWM). Já `iniciado` (retomada) → nada a
   gravar.
2. **EWM** — `elm_transicao(id, "assumir")`, com "sim" (já minha → `ja_estava`, nada a fazer; de outra pessoa →
   `conflito`: pergunte e repita com `forcar: true`). Épico não planejado → antes, no mesmo "sim", o IB do épico vai
   para a iteração da sprint, só com `iteracao`, e a `[ESP]` que ficou no backlog do EWM (Passo 1) move com ele:
   `elm_atualizar_wi([id], iteracao = a da sprint, dono = quem assume)`, com `estimativa_h` se faltar
   ([elm-sprint.md](../sa-planejamento/references/elm-sprint.md), topo e §3). Sem o MCP `elm` →
   `ELM pendente [<chave>]: assumir [ESP] EP-<nn>` no `rascunho.md` da pasta de trabalho.

## Passo 3 — Pasta de trabalho (fora do git)

`.sabia/local/especificacao/<EP>-<slug>/` — é ali que a `sa-entrevistar`, a `sa-prd` e a revisão P trabalham até
o GATE. Monte-a pela primeira fonte que existir:

1. **Já existe nesta máquina** → use-a, mas compare antes com a `[ESP]`: último comentário de sessão mais novo que
   a última sessão registrada no `rascunho.md` local (outra máquina trabalhou depois) — compare as duas em UTC (o
   EWM devolve UTC; o rascunho, hora local) e nunca pelo mtime dos arquivos, que muda a cada download → mostre as duas datas e pergunte se baixa os anexos (item 2)
   por cima da pasta local.
2. **A `[ESP]` tem anexos** (`elm_anexo(id, "listar")`) → outra pessoa ou máquina já trabalhou: baixe cada `.md`
   (`elm_anexo(id, "baixar", caminho)`) para a pasta (os de `elm/` para `elm/`, pelo prefixo `elm-` do nome do anexo). Mostre a
   data do último comentário de sessão.
3. **Só a base** → copie `rascunho.md`, `decisoes.md` e `status.md` de `<produto>/epicos/<EP>-<slug>/` em
   `origin/<base>` (`git show origin/<base>:<caminho>`, depois de `git fetch`; criados pela triagem).
   Sem essa pasta na base → crie-os: `rascunho.md` com o título e a descrição do item do EWM (sem dado inventado),
   `decisoes.md` no formato do Passo 3 da [`sa-entrevistar`](../sa-entrevistar/SKILL.md) (título `# Decisões — <EP-nn> <título>` e a tabela vazia)
   e o `status.md` pelo modelo abaixo.

Em qualquer das três, a pasta tem o **`status.md` do épico** — a Fase (o detalhe do épico, como o da fatia; a
situação fica no `backlog.md`), o início e os créditos de cada sessão. A triagem o cria com Fase `rascunho` e
`[ESP]`, Responsável e Início `—`, que você preenche aqui; a fonte não o trouxe → crie-o:

```markdown
# EP-<nn> — <título>

| Campo | Valor |
|---|---|
| Épico | EP-<nn> · P.O. <login> |
| Fase | rascunho |
| [ESP] | <id \| pendente> |
| Responsável | <login> |
| Início | <AAAA-MM-DD> |
| Toolkit | <nome \| nenhum> |

<!-- Fases: rascunho → em-revisao → aprovado → fatiado → concluido · cancelado
     rascunho: triado, na entrevista e na escrita do PRD (sa-triar, sa-especificar) · em-revisao: PRD na revisão P
     e na mudança depois de aprovado (sa-prd) · aprovado: GATE do PRD (sa-prd) · fatiado: GATE do backlog
     (sa-fatiar) · concluido: última fatia concluída (sa-consolidar) · cancelado: decisão do P.O. (sa-fatiar).
     Até o GATE do PRD vive na pasta de trabalho; no GATE vai à base com a pasta, e a base passa a ser a fonte. -->

## Créditos

| Data | Papel | Login | Sessão Kiro | Power sabia | Créditos |
|---|---|---|---|---|---|
```

A linha `Toolkit` é escolhida aqui, uma vez por épico (ver [Toolkit na especificação](#toolkit-na-especificação)).

O `rascunho.md` é o **caderno do levantamento**: o que o cliente contou, exemplos reais, dúvidas para a próxima
reunião, com a data de cada sessão. Decisões vão para o `decisoes.md` (`D-nn`), nunca só para o rascunho.

## Passo 4 — Encaminhar pela Fase do épico

```
🧭 EP-<nn> — <título> · [ESP] <id | pendente> · fase <…>
Pasta de trabalho: .sabia/local/especificacao/<EP>-<slug>/
Próximo: <skill>
```

| Fase (`status.md` do épico: o da base se a linha do épico já tem `prd`; senão, o da pasta de trabalho) | Próxima skill |
|---|---|
| `rascunho`, sem `prd.md` | **`sa-prd`** (Passo 1: explora o código e o ELM; Passo 2: `sa-entrevistar`) |
| `rascunho`/`em-revisao` com `prd.md` | **`sa-prd`** no passo em que parou (escrita, revisão P ou GATE) |
| `aprovado` na pasta de trabalho (`prd` `—` no `backlog.md`) | **Passo 6** desta skill — levar para a base |
| `aprovado` na base | **`sa-fatiar`**; depois do GATE do backlog, volte aqui (Passo 6) |
| `fatiado`, Especificação ainda `iniciada` na sprint | **Passo 6** desta skill — concluir a `[ESP]` |
| `fatiado`, Especificação `concluida` | nada a especificar; refinamento de fatia → `sa-fatiar` |

## Passo 5 — Fechar a sessão (toda sessão, antes de parar)

Pergunta única, com prévia do que vai:

```
📝 Sessão de especificação — EP-<nn> · <data>
Comentário na [ESP] <id>: <resumo do levantamento · decisões D-nn novas · dúvidas para a próxima reunião>
Anexos (última versão, substituem os anteriores): rascunho.md · decisoes.md · status.md · prd.md · elm-<arquivo>.md …
Horas desta sessão na [ESP]: <h> h em <data>   (pergunte à pessoa; nunca estime por ela)
Créditos desta sessão: <x.xx> (sessão <id>) · power sabia <versão>   (script da sa-status, item 4)
Registrar? (sim)
```

Com "sim": primeiro a linha de créditos no `status.md` do épico ([`sa-status`](../sa-status/SKILL.md#fechar-a-sessão), item 4) — depois do GATE do PRD, no da
base, no commit que o fatiamento já faz —; então `elm_comentar` (o resumo), `elm_anexo(id, "enviar", caminho)` para cada `.md` da pasta de trabalho (os de
`elm/` com o prefixo `elm-`, para não colidir com o nome de outro arquivo) e `elm_lancar_horas(id, horas)` (lança;
não conclui). Sem o MCP `elm` ou com falha → `ELM pendente [<chave>]: registrar sessão [ESP] EP-<nn> (<data>)` no `rascunho.md`, e o
próximo fechamento registra.

## Passo 6 — Fechamentos da `[ESP]` (depois de cada GATE)

A `sa-prd` e a `sa-fatiar` conduzem o GATE e gravam só o próprio artefato; o que é da `[ESP]` é daqui.

**Depois do GATE do PRD** (Fase `aprovado` no `status.md` da pasta de trabalho, gravada pela `sa-prd`):
1. Feche a sessão (Passo 5), para a `[ESP]` ter a versão aprovada.
2. Leve a pasta para a **base**, pelo bloco [Gravar na base](../sa-fatiar/references/backlog.md#gravar-na-base):
   copie-a para `<produto>/epicos/<EP>-<slug>/` (substitui o `rascunho.md`, o `decisoes.md` e o `status.md` da
   triagem), com o `revisao-prd-<N>.md`; no `backlog.md`, só o link `prd` na linha do épico e, se estava `—`, o da
   `pasta` (ele segue `iniciado`; a sprint não muda). **Um** commit (padrão do `sabia.md`), direto na base; nunca numa
   branch de fatia. A partir daí a base é a fonte; a pasta local pode ser apagada pela pessoa (a skill não apaga).
3. Próximo, e pare: a [publicação dos requisitos](../sa-consolidar/references/elm-publicar.md) (se o projeto usa ELM e
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

Situação da linha do épico na seção Especificação ([situações](../sa-fatiar/references/backlog.md#situações)):
`planejada` (`sa-planejamento`), `iniciada` (Passo 2) e `concluida` (GATE do backlog), estas duas gravadas aqui;
`cancelada` com o épico cancelado (`sa-fatiar`).

## Toolkit na especificação

Passo `especificador` de [passos.md](../sabia/references/passos.md): uma skill de toolkit pode assumir a escrita do
3.2 da `sa-prd` (os modelos de PRD e os extras de uma stack ou de um tipo de sistema).

1. **Escolha (Passo 3).** A tabela **Passos de toolkit** do `sabia.md` tem linha do passo `especificador` e o
   `status.md` do épico ainda não tem a linha `Toolkit` → mostre cada uma (toolkit e `para`) e pergunte se este
   épico a usa; grave `Toolkit: <nome>` ou `nenhum`. Gravada, não pergunte de novo. Sem linha na tabela →
   `nenhum`, sem perguntar.
2. **Escrita (Passo 4, `sa-prd` 3.2).** Com `Toolkit: <nome>`: sem agente → carregue a skill do passo e escreva
   por ela, no seu contexto; com agente → delegue com o briefing de especificação de
   [passos.md](../sabia/references/passos.md#sem-agente-e-com-agente). O 3.1 (similares) vem antes e é seu.
3. **Contrato, antes da revisão P.** `prd.md` com todas as H2 do template, `elm/` com os conceitos OKF quando há
   ELM, extras só em `.md` na pasta de trabalho. Fora disso → como manda o `passos.md`. A revisão P e o GATE
   continuam os do Sabiá.

## Regras

- Até o GATE do PRD, nada da especificação vai para a base — só a situação do Passo 2: o registro é a `[ESP]`
  (comentários e anexos), atualizado ao fechar cada sessão.
- Nunca invente regra, valor ou ator: sem fonte e sem decisão de uma pessoa, é `em aberto`.
- Dado de cliente identificável não vai para os anexos: no rascunho, só o resumo anônimo.
- Toda escrita no EWM só com "sim"; sem o MCP `elm`, `ELM pendente` ([pendências](../sabia/references/elm.md#pendências)), e o fluxo segue.
- Não invoque outra skill por conta própria: diga a próxima e pare.
