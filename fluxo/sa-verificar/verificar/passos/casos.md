---
{"resumo": "Grava no CT.csv da fatia a evidência da execução de cada cenário verificado, ligado ao CT planejado do PRD que o prova (CT novo na fatia sem épico ou no caso que a verificação descobre fora dos cenários), no padrão sa-verificar/ct-csv.md, para a consolidação (linha Casos de teste do sabia.md)."}
---
## Entrada

Os cenários verificados no `verificacao.md` (passo `executar`), **todos aceitos** — o `VERIFICACAO: ACEITO` do
passo `decisao`; no AFK, também com cenários `🔁 possível alteração`, que não entram no `CT.csv`. Algum rejeitado ou
⚠️ → pule este passo: siga para o passo `decisao`. Os CTs planejados do épico
(`CT-nn-<slug>.md` no `elm/` da pasta do épico na base, padrão `sa-prd/ct.md`), quando a fatia é de épico.

## Faça

Gere `CT.csv` na pasta da fatia — uma linha por cenário verificado — no formato do padrão `sa-verificar/ct-csv.md`,
com a evidência da execução:

- **Cenário com CT planejado** (o CT que cita a HF e o número do cenário) → a linha liga ao CT: o rótulo dele no
  Resumo e, na Descrição, o caminho e o id no ETM (quando já subiu; informativo: a consolidação lê o id do
  `resource`/`id` do conceito); objetivo, pré-condições, passos e resultado
  esperado vêm do CT, e a evidência, da verificação. O CT planejado não muda aqui: resultado obtido diferente do
  esperado é rejeição (passo `executar`), não CT novo.
- **CT novo**, só na fatia sem épico (um por cenário `C<n>` da ficha) e no caso que a verificação descobre fora dos
  cenários (na fatia de épico, todo cenário da HF tem o seu CT planejado) → CT novo na linha, escrito do cenário ou do
  caso, com o rótulo `CT<FT-nnn>-<nn>`.

Na consolidação, depois do merge, pela linha Casos de teste do `sabia.md`: `ETM` → a `sa-consolidar` liga ao IB
o CT planejado (publicado no ETM na conclusão da `[ESP]`) e cria só o CT novo, já ligado à história (`elm_criar_ct`,
[elm-publicar.md](~/.sabia/framework/skills/sa-consolidar/references/elm-publicar.md)), e o CSV é a
alternativa para importar à mão quando a criação falha; `CSV` → o próprio `CT.csv` é a entrega, com as evidências.

Rodadas: quem pediu a verificação incrementa "verificação" (a `sa-codificar` ou o orquestrador); só no
pedido direto de uma pessoa, incremente você.

## Saída

`CT.csv` na pasta da fatia → passo `decisao`, que o commita na entrega.

## Pare se

—
