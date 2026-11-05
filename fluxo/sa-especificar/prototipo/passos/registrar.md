---
{"resumo": "Acha em prototipo/ o arquivo novo do protótipo, confere com a pessoa que só tem dado fictício e o registra como versão vN: renomeado, anexado na [ESP] e anotado no rascunho.md; sem arquivo, o épico sem tela vira um D-nn."}
---
## Entrada

A pasta de trabalho `.sabia/local/especificacao/<EP>-<slug>/` (passo `sa-especificar.especificar.pasta`), com
`prototipo/`, o `rascunho.md` e o `decisoes.md`.

## Faça

1. **Versão** — em `prototipo/`, a versão registrada tem o nome `prototipo-v<N>-<slug>.<ext>`. Arquivo sem esse
   prefixo → é a versão nova, `v<N>` = a maior registrada + 1 (a primeira, `v1`); mais de um → pergunte se é uma
   versão só (várias telas) ou se sobra algum. Nenhum arquivo novo: a linha da última versão na seção Protótipo do `rascunho.md` em
   `aguardando o cliente` → passo `aprovacao` (retomada); em `ajuste — aguardando a v<N+1>` → Pare se. Link no
   lugar do arquivo → peça a exportação da versão (Regras).

   Nenhum arquivo em `prototipo/` → pergunte se o épico tem tela. `não` (épico só de integração ou de processamento) →
   `D-nn` (padrão `sa-entrevistar/decisoes.md`): Pergunta `O épico tem tela?`, Decisão
   `Épico sem tela: protótipo não se aplica`, quem decidiu = a pessoa, Situação `decidida`; volte a quem chamou (o
   lote do PRD não cria EL). `sim` → Pare se.
2. **Dado fictício** — mostre o que o protótipo traz (telas, campos com valor de exemplo) e pergunte se todo dado é
   fictício. Nome, documento, conta ou valor de cliente real, visto ou dito → não registre: peça a versão com dado
   fictício e pare.
3. **Registrar** — prévia e um "sim":

   ```
   🖼️ Protótipo v<N> — EP-<nn> · [ESP] <id | pendente>
   Arquivo: prototipo/prototipo-v<N>-<slug>.<ext> (era <nome original>) · telas: <n>
   Muda desde a v<N-1>: <o que o cliente pediu, com a fonte | primeira versão>
   Só dado fictício: confirmado por <login>
   Anexar na [ESP]? (sim)
   ```

   Com "sim": renomeie o arquivo, `elm_anexo(id da [ESP], "enviar", caminho)` (o nome do anexo é o do arquivo) e,
   na seção Protótipo do `rascunho.md`, a linha `Protótipo v<N> — <arquivo> · <data> · <o que muda> · aguardando o cliente` (a da
   versão anterior em `ajuste — aguardando a v<N+1>` passa a `ajuste`). Sem o MCP
   `elm` ou com falha → `ELM pendente [ESP EP-<nn> anexar prototipo-v<N>]: anexar prototipo-v<N> na [ESP] EP-<nn>` na seção ELM pendente do `rascunho.md`, e o
   fluxo segue.

Até o GATE do PRD, o registro é o anexo da `[ESP]`; com o PRD aprovado, as versões registradas vão com a pasta do
épico para a base (passo `sa-especificar.especificar.fechamentos`), e o anexo continua. Na mudança do PRD
(`sa-prd.mudanca`, o PRD já na base), `prototipo/` e o `rascunho.md` são os da pasta do épico na base: o arquivo da
versão vai à base no commit `EP-<nn> registrar protótipo v<N>` (bloco
[Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base); só ele), e a linha da
seção Protótipo do `rascunho.md` fica sem commit até o GATE, no `EP-<nn> aprovar PRD`.

## Saída

A versão `v<N>` registrada, ou a já registrada aguardando o cliente (retomada) → passo `aprovacao`. Épico sem tela →
volte a quem chamou. Épico com tela sem arquivo, ou a última versão em `ajuste — aguardando a v<N+1>` sem a nova → passo
`sa-especificar.especificar.fechar-sessao`.

## Pare se

- Épico com tela e nenhum arquivo em `prototipo/` → "ponha em `prototipo/` o arquivo do protótipo (PDF, imagens,
  HTML exportado)" e feche a sessão (`sa-especificar.especificar.fechar-sessao`): o PRD espera o protótipo.
- Última versão em `ajuste — aguardando a v<N+1>` e nenhum arquivo novo → "ponha em `prototipo/` a `v<N+1>` (<o ajuste pedido>)" e feche a
  sessão (`sa-especificar.especificar.fechar-sessao`).
- Dado real no protótipo (item 2) → peça a versão com dado fictício e pare.
