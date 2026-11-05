---
{"resumo": "Troca para a base, espelha no EWM o backlog sem IB, lê a entrada e procura se o item já existe antes de triar."}
---
## Entrada

O pedido em texto, o número do EWM ou o pedido de lote, e o `backlog.md` da base.

## Faça

**Antes de tudo** — a triagem lê e escreve na base: itens 1 e 5 do bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base) (troca
com "sim", `pull --ff-only`, árvore suja → pare; no fim, oferecer voltar).

**Backlog sem IB** (com ELM e o MCP `elm` nesta sessão): o backlog do EWM é a fonte dos relatórios das demandas, e
nenhum item espera a sprint para nascer nele. Linha do `backlog.md` não terminal com `elm` `—`, `pendente` ou id sem
link → `🏛️ <n> itens do backlog sem IB no EWM: <ids> → criar agora? (sim)`, com a prévia e o "sim" do
[elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §0, passo 4 (espelhamento). Os ids entram no commit
único do passo `registrar`. "não" → a triagem segue, e o painel da `sa-status` continua contando.

| Entrada | Como ler |
|---|---|
| pedido em texto ("nova demanda: …", "corrigir o cálculo de juros") | a própria descrição |
| número do EWM (DF, IB) | `elm_ler_wi(id, comentarios = -1)` (todos); sem o MCP `elm` → peça à pessoa o título, a descrição e o comportamento esperado — nunca invente dado de work item |
| "importar do EWM", "triar os defeitos do time" | **lote** → fluxo `sa-triar.lote-ewm` |
| trabalho sem mudança no repositório — pedido de cliente ("extrai as contas bloqueadas", "por que o caso X deu Y?"), implantação, script de banco, ambiente, rotina de produção, ajuda a outro time | trilha sustentação (passo `triagem`) |

**Já existe?** Antes de triar, procure no `backlog.md` da base (ids, títulos parecidos e as colunas `origem`, `elm`
e `obs` — épicos, fatias e as `### <Categoria>` da `## Sustentação`), no `**Origem:**` das fichas e dos
`<produto>/sustentacao/**/*.md` e nos `status.md` das branches
(`git grep -l '<id>' <ref> -- '.kiro/specs/*/status.md'`). Achou → mostre a linha e:
- **fatia sem épico que volta para cá** — `nova` com `falta:` (fora o `falta: especificação` sozinho, abaixo), ficha
  em `rascunho` ou a aprovar, mudança na ficha (pedida pela pessoa ou devolvida pela `sa-plano` ou pela
  `sa-verificar`) ou trilha que não serve
  (devolvida pela `sa-desenvolver`) → **retome a triagem dela**: passo `triagem` com o mesmo `FT` e
  a ficha que existe; no passo `registrar`, só atualize a linha (sem id novo), com a situação pela Volta das
  [Situações](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#situações) — de `iniciada` em diante ela não muda: avise quem a
  conduz (artefato novo na seção Artefatos afetados → rode você o bloco
  [Volta à especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação), como pedido de fora da
  fatia: a linha com Especificado `—` e a autorização, a `[ESP] FT` pela tabela do bloco, e avise quem a conduz);
- **fatia sem épico que vira épico, se divide ou é cancelada** (decisão do P.O.) → `EP-nn` novo ou as fatias novas
  (passo `registrar`, situação `nova`, com `obs` `desmembrada de FT-…`; no EWM, o §3 "Fatia dividida" do
  [elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md)) e a original, no `backlog.md` e na linha da sprint,
  `cancelada` (`obs` `substituida-por EP-nn` ou o motivo) ou `dividida` (`substituida-por FT-…`). Já `iniciada` →
  antes, conclua as tarefas abertas dela com as horas lançadas (sem o MCP, `ELM pendente [<tipo> <id> concluir]: concluir com <h>h lançadas` no
  rodapé da ficha) e avise o Dev para
  fechar o PR. Cancelada → o IB (e, se não foi iniciada, as tarefas) cancela no EWM: `elm_transicao(<id>,
  "cancelar")`, um por id, com "sim"; na falha (sem o MCP, `precondicao`, erro), `ELM pendente [FT-<nnn> cancelar]`.
  As pendências da original moram no rodapé da ficha
  (o padrão `sa-triar/ficha.md`);
- **fatia `nova` no backlog com só `falta: especificação`** → não é da triagem: ela entra na sprint como
  especificação, com a `[ESP] FT`, no planejamento (`sa-planejamento.sprint.previsao`) ou pelo encaixe
  (`sa-planejamento.durante.encaixe`) — P.O. ou SM, no agente `sa-produto`;
- **fatia `nova` de épico no backlog** (`origem` `EP-nn`, `sprint` `—`, `obs` `falta: …`) → **deixe-a pronta**, sem
  tarefa (o `falta: especificação` fica para a `[ESP] FT`): [Completar uma fatia `nova`](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#completar-uma-fatia-nova) (créditos no
  comentário da `[GB]`);
- **épico `novo`** que voltou (falta de informação para o PRD, P.O. ou EWM pendentes —
  devolvido pela `sa-prd`, pela `sa-especificar` ou pela Definition of Ready) → **complete o registro**: o que
  falta da linha (`po`, descrição mínima, `elm`), sem id novo (passa na DoR → `elegivel`), e siga para o
  passo `encaminhar`;
- **item de Sustentação** registrado por engano, em dobro ou com o pedido retirado → `cancelado`, com o motivo, na
  linha do `backlog.md` (e na da sprint, se houver) e no `**Situação:**` do registro; o IB e a tarefa cancelam no
  EWM (`elm_transicao(<id>, "cancelar")`, com "sim"); na falha, a linha `ELM pendente [<ID> cancelar]: <o que falta>` sob o
  `**ELM:**` do registro;
- **item de Sustentação devolvido pela `sa-atender` ou pela `sa-executar` por categoria errada** (outra categoria,
  muda o repositório ou tem regra de negócio em aberto) → **retome a triagem do pedido**: passo `triagem`, com
  `origem` o `<ID>` devolvido. No passo `registrar`:

  | Devolvido para | Item novo | IB do item novo | Tarefa do devolvido | Devolvido fica |
  |---|---|---|---|---|
  | outra categoria | id da série dela | o IB do devolvido, como item de origem (sem IB novo), com o pai trocado pelo IB da categoria nova (sem o "mantenha e avise") | fecha antes: com horas lançadas `concluir`, sem horas `cancelar`; nunca vira a tarefa do item novo (a dele nasce pela regra do passo `registrar`, sem aproveitar a fechada) | `cancelado`, motivo `substituido-por <novo>` |
  | muda o repositório | fatia de Manutenção | o IB do devolvido, como item de origem (sem IB novo), com o pai trocado pela Manutenção | idem | idem |

  O devolvido fica `cancelado` como o registrado por engano (acima: a linha do `backlog.md`, a da sprint e o
  `**Situação:**` do registro), mas no EWM só a tarefa dele fecha: o IB segue como o do item novo;
- **item terminal** (`concluida`, `cancelada`, `dividida`, `concluido`, `cancelado`) com pedido novo → nunca reabre:
  é item novo, pelo passo `triagem` (id novo). Fatia → `obs` `origem FT-<nnn>`; épico → `obs` `origem EP-<nn>` (como
  no cenário novo de épico já fatiado); item de Sustentação → coluna `origem` = o `<ID>` terminal;
- o resto → pare (abaixo).

## Saída

Item novo → passo `triagem`; item que já existe → a ação da lista acima.

**Sessão com gravação pendente** (os ids do espelhamento acima, ou um item registrado antes, no "sim: mais um
item"): antes de sair para outro fluxo, para o fim (o resto) ou por uma parada do Pare se, feche a sessão como o passo
`encaminhar` na resposta "não" — o resumo, os créditos e o commit único — e só então diga o próximo.

## Pare se

- Árvore suja ao trocar para a base (bloco Gravar na base).
- Fatia com a `[ESP] FT` aberta na sprint (`nova` em especificação, ou a que voltou à especificação) → não é aqui:
  "use `sa-especificar FT-<nnn>`".
- Item que já existe, não terminal, fora dos casos acima → pare: começar ou retomar é pelo hub **`sa-iniciar`**; cancelar uma fatia de épico é
  refinamento na **`sa-fatiar`** (depois do GATE do backlog, a fatia não se divide nem se junta).
