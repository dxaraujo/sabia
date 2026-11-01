---
{"resumo": "GATE do PRD pelo P.O.: aprovado → status stable e verified humano em cada conceito, gravado só onde o PRD está; diz a próxima e para."}
---
## Entrada

O PRD revisto (passo `revisao`), na pasta de trabalho (primeiro GATE) ou na base (mudança depois de aprovado:
`sa-prd.mudanca`).

## Faça

Mostre à pessoa:

```
📄 PRD EP-<nn> — <título>
Histórias: <n> (<c> cenários) · Regras: <n> · Termos novos: <n> · No ELM: reusa <ids | —> · altera <ids | —> · novos verificados <n>
Decisões: <d> decididas · <a> em aberto (<bloqueantes>)
Revisão: <OK na rodada N | achados aceitos: …>
Aprovar? (o P.O. ou quem ele delegou)
```

- Decisão **em aberto que muda comportamento** → não há aprovação; volte à entrevista.
- Aprovado → Fase `aprovado` no `status.md` do épico; no `prd.md`, versão `1.0`, data e quem aprovou no rodapé. Em
  **cada** conceito de `elm/`: `status: stable` e um `verified` com `{ by: human:<login de quem aprovou>, at:
  <agora> }` — sem esse `verified` humano nada é publicado. Entrada `**Update**` no `log.md`. Grave só onde o PRD
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
- Mudança depois de aprovado → próximo: a [publicação dos requisitos](~/.sabia/framework/skills/sa-consolidar/references/elm-publicar.md#requisitos-conceitos-okf-de-elm--doors-next) alterados (se a publicação é `na-aprovacao`)
  e o refinamento das fatias afetadas (`sa-fatiar.refinamento`).

## Pare se

- Primeiro GATE aprovado: diga o próximo e pare.
- Mudança depois de aprovado: diga o próximo e pare — chamada pela `sa-consolidar` (drift), devolva a ela,
  que segue para a publicação.
