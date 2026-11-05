---
{"resumo": "GATE do PRD pelo especificador: aprovado → status stable (o excluído segue deprecated) e verified humano em cada conceito que a rodada criou ou mudou, gravado só onde o PRD está; o primeiro GATE e a mudança antes do fatiamento seguem na [ESP]; diz a próxima e para."}
---
## Entrada

O PRD revisto (passo `revisao`), na pasta de trabalho (primeiro GATE) ou na base (mudança antes do fatiamento:
`sa-prd.mudanca`).

## Faça

Mostre à pessoa:

```
📄 PRD EP-<nn> — <título>
Artefatos: <sigla> <n> (novo <n> · altera <n> · exclui <n>) · … — HF também com <c> cenários · No ELM: reusa <ids | —> · altera <ids | —> · exclui <ids | —> · novos verificados <n>
Impacto: <id> (<sigla>) <rel> · … | —
Decisões: <d> decididas · <a> em aberto (<bloqueantes>)
Revisão: <OK na rodada N | achados aceitos: …>
Aprovar? (o especificador)
```

Em Artefatos, uma contagem por tipo do [catálogo](~/.sabia/framework/skills/sabia/references/tipos.md) que o passo `escrever` cria, fora os pendentes, na ordem do
catálogo, com os arquivos de `elm/` (novos, alterados e excluídos).
Quem especifica aprova o PRD e, com ele, todos os conceitos de `elm/`: os novos, os alterados e os excluídos.

- Decisão **em aberto que muda comportamento** → não há aprovação; volte à entrevista.
- Aprovado → Fase `aprovado` no `status.md` do épico; no `prd.md`, a versão (`1.0`; na mudança, a da linha nova da
  seção Mudanças, `1.1`, `1.2`…, com o Aprovado por), data e quem aprovou no rodapé. Em
  cada conceito de `elm/` que esta rodada criou ou mudou — `status: draft`, ou `deprecated` sem `verified` posterior
  ao `generated.at` (no primeiro GATE, todos) —, fora a ATA (já aprovada no passo `sa-especificar.reuniao.aprovar`):
  `status: stable` (o excluído segue `deprecated`) e, acrescentado à lista `verified` (crie-a se não existe),
  `{ by: human:<login de quem especifica>, at: <agora, AAAA-MM-DDThh:mm:ssZ> }` — sem esse `verified` humano nada é
  publicado. Os demais conceitos ficam como estão. Grave só onde o PRD está:
  - **primeiro GATE** (PRD na pasta de trabalho) → só ali; levar a pasta para a base e gravar no `backlog.md` só o
    link `prd` e, se estava `—`, o da `pasta` (o épico segue `iniciado`) são da `sa-especificar`.
  - **mudança antes do fatiamento** (PRD já na base) → na base, pelo bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base),
    um commit `EP-<nn> aprovar PRD` com a pasta do épico (o que a mudança editou ali sem commit: passo
    `sa-prd.mudanca.mudanca`, item 3).

## Saída

- Decisão em aberto que muda comportamento → passo `entrevistar`.
- Primeiro GATE aprovado, ou mudança aprovada → próximo: "use `sa-especificar EP-<nn>`" — ela fecha a sessão, leva o
  PRD aprovado para a base (no primeiro GATE), publica no ELM, conclui a `[ESP]` e diz o que vem depois (o
  fatiamento, do P.O. ou do SM).

## Pare se

- GATE aprovado: diga o próximo e pare.

Parou aqui sem o GATE aprovado (na sessão da `[ESP]`, feche-a: `sa-especificar.especificar.fechar-sessao`); aprovado,
quem fecha é a `sa-especificar`.
