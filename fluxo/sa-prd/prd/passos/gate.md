---
{"resumo": "GATE do PRD pelo P.O.: aprovado → status stable e verified humano em cada conceito, gravado só onde o PRD está; o primeiro GATE e a mudança antes do fatiamento seguem na [ESP], a correção depois dele volta a quem chamou; diz a próxima e para."}
---
## Entrada

O PRD revisto (passo `revisao`), na pasta de trabalho (primeiro GATE) ou na base (mudança depois de aprovado:
`sa-prd.mudanca`).

## Faça

Mostre à pessoa:

```
📄 PRD EP-<nn> — <título>
Artefatos: HF <n> (<c> cenários) · REG <n> · GL <n> novos · … · No ELM: reusa <ids | —> · altera <ids | —> · novos verificados <n>
Decisões: <d> decididas · <a> em aberto (<bloqueantes>)
Revisão: <OK na rodada N | achados aceitos: …>
Aprovar? (o P.O. ou quem ele delegou)
```

Em Artefatos, uma contagem por tipo do [catálogo](~/.sabia/framework/skills/sabia/references/tipos.md) que o passo `escrever` cria, fora os pendentes.

- Decisão **em aberto que muda comportamento** → não há aprovação; volte à entrevista.
- Aprovado → Fase `aprovado` no `status.md` do épico (na mudança, a do `de:`: `aprovado` ou `fatiado`); no `prd.md`, a versão (`1.0`; na mudança, a do passo
  `sa-prd.mudanca.mudanca`), data e quem aprovou no rodapé. Em
  **cada** conceito de `elm/` (fora a ATA, já aprovada no passo `sa-especificar.reuniao.aprovar`): `status: stable`
  e um `verified` com `{ by: human:<login de quem aprovou>, at: <agora> }` — sem esse `verified` humano nada é publicado. Entrada `**Update**` no `log.md`. Grave só onde o PRD
  está:
  - **primeiro GATE** (PRD na pasta de trabalho) → só ali; levar a pasta para a base e gravar no `backlog.md` só o
    link `prd` e, se estava `—`, o da `pasta` (o épico segue `iniciado`) são da `sa-especificar`.
  - **mudança depois de aprovado** (PRD já na base) → na base, pelo bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base),
    um commit.

## Saída

- Decisão em aberto que muda comportamento → passo `entrevistar`.
- Primeiro GATE aprovado → próximo: "use
  `sa-especificar EP-<nn>`" — ela fecha a sessão, leva o PRD aprovado para a base e diz o que vem depois
  (publicação no ELM e `sa-fatiar`).
- Mudança depois de aprovado → próximo: a [publicação dos requisitos](~/.sabia/framework/skills/sa-consolidar/references/elm-publicar.md#requisitos-conceitos-okf-de-elm--doors-next) alterados (se o PRD já
  subiu ao ELM e a publicação é `na-aprovacao`). Depois, pelo `de:` da Fase (`em-revisao (de: …)`, do passo
  `sa-prd.mudanca.mudanca`):
  - `de: aprovado` (antes do fatiamento) → "use `sa-especificar EP-<nn>`": a sessão segue na mesma `[ESP]`, que a fecha e diz o que
    vem depois (`sa-fatiar`);
  - `de: fatiado` (correção depois do fatiamento): chamada pelo `sa-fatiar.refinamento` (⇄) → volte a ele, que segue com a fatia
    nova; vinda do drift da consolidação → "avise o P.O.: retome pela `sa-consolidar FT-<nnn>`"; da verificação, do
    plano, de completar a fatia, da ATA ou pedido direto, com fatias afetadas → diga que o refinamento delas é o `sa-fatiar.refinamento`.

## Pare se

- Primeiro GATE aprovado, ou mudança antes do fatiamento aprovada: diga o próximo e pare.
- Correção depois do fatiamento, fora do refinamento: diga o próximo e pare — vinda do drift, a consolidação é do
  P.O., no agente `sa-produto`.
