---
{"resumo": "Monta a pasta de trabalho fora do git (.sabia/local/especificacao/) pela primeira fonte: a pasta local, os anexos da [ESP] ou a base."}
---
## Entrada

O épico `iniciado` e a `[ESP]` assumida (passo `assumir`).

## Faça

Pasta de trabalho (fora do git): `.sabia/local/especificacao/<EP>-<slug>/` (`<slug>`: o da coluna `pasta` do
`backlog.md`, `[pasta](epicos/<EP>-<slug>/)`; `pasta` `—` → o título do épico em kebab-case, minúsculas, sem acento) — é ali que a `sa-entrevistar`, a `sa-prd` e a revisão P trabalham até
o GATE. Monte-a pela primeira fonte que existir:

1. **Já existe nesta máquina** → use-a, mas compare antes com a `[ESP]` (`elm_ler_wi(id, comentarios = -1)`): o
   último comentário que começa com `Sessão de especificação`, mais novo que a sessão local mais recente — a Data
   da última linha da seção Créditos do `status.md` do épico da pasta local — (outra máquina trabalhou depois) —
   compare as duas em UTC (o EWM devolve UTC; a Data dos Créditos, hora local) e nunca pelo mtime dos arquivos, que
   muda a cada download → mostre as duas datas e pergunte se baixa os anexos (item 2) por cima da pasta local.
2. **A `[ESP]` tem anexos** (`elm_anexo(id, "listar")`) → outra pessoa ou máquina já trabalhou: baixe cada `.md`
   (`elm_anexo(id, "baixar", caminho)`; o caminho termina no nome do anexo) para a pasta — o anexo `elm-<arquivo>.md`
   com caminho = `<pasta de trabalho>/elm/elm-<arquivo>.md`, renomeado depois para `elm/<arquivo>.md` — e cada
   `prototipo-v<N>-*` para `prototipo/`. Mostre a data do último comentário de sessão.
3. **Só a base** → copie `rascunho.md`, `decisoes.md` e `status.md` de `<produto>/epicos/<EP>-<slug>/` em
   `origin/<base>` (`git show origin/<base>:<caminho>`, depois de `git fetch`; criados pela triagem).
   Sem essa pasta na base → crie-os: `rascunho.md` pelo padrão `sa-especificar/rascunho.md`, com o Pedido = o título
   e a descrição do IB do épico (`elm_ler_wi(<IB>, comentarios = 0)`, o IB da coluna `elm`;
   sem o MCP `elm` ou IB `pendente` → o título do `backlog.md` e a descrição `—`; sem dado inventado),
   `decisoes.md` no formato do padrão [`sa-entrevistar/decisoes.md`](~/.sabia/framework/padrao/sa-entrevistar/decisoes.md) (título `# Decisões — <EP-nn> <título>` e a tabela vazia)
   e o `status.md` pelo padrão `sa-especificar/status-epico.md`.

Em qualquer das três, a pasta tem o **`status.md` do épico** — a Fase (o detalhe do épico, como o da fatia; a
situação fica no `backlog.md`), o início e os créditos de cada sessão. A triagem o cria com Fase `rascunho` e
`[ESP]`, Responsável e Início `—`, que você preenche aqui; a fonte não o trouxe → crie-o pelo padrão
`sa-especificar/status-epico.md`.

**`reunioes/`** — onde a pessoa põe a transcrição de cada reunião com o cliente (`.vtt` ou `.md`); a ATA dela sai pelo
`sa-especificar.reuniao`. Só nesta máquina: nenhuma das três fontes a traz, e ela não vai para anexo nem base (as
atas, sim, pelo `elm/`). Crie a pasta vazia se não existir.

**`prototipo/`** — só com a linha Telas = `sim` do `sabia.md`: onde a pessoa põe o arquivo de cada versão do
protótipo de tela; o registro e a aprovação do cliente saem pelo `sa-especificar.prototipo`, e cada versão vai à
`[ESP]` como anexo; com o PRD aprovado, as registradas vão com a pasta para a base. Crie a pasta vazia se não existir.

O `rascunho.md` é o **caderno do levantamento**, no padrão `sa-especificar/rascunho.md`: o pedido, o levantamento de
cada sessão, as dúvidas para a próxima reunião, as versões do protótipo e as pendências do ELM até o PRD ir à base.

## Saída

A pasta de trabalho com `rascunho.md`, `decisoes.md`, o `status.md` do épico, `reunioes/` e, com Telas = `sim`,
`prototipo/` → passo `encaminhar`.

## Pare se

Nenhum caso próprio deste passo: a pasta local mais velha que a `[ESP]` é pergunta à pessoa (item 1), não parada.
