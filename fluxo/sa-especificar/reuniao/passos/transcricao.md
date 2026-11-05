---
{"resumo": "Acha em reunioes/ a transcrição sem ATA aprovada (ou retoma a ATA aprovada não registrada), confere a [ESP] aberta e converte o .vtt ou .md em falas \"[mm:ss] papel: fala\" pelo script, com o papel de cada falante dito pela pessoa."}
---
## Entrada

O épico e a pasta de trabalho `.sabia/local/especificacao/<EP>-<slug>/` (montada pelo passo
`sa-especificar.especificar.pasta`), com `reunioes/`.

## Faça

1. **[ESP] aberta** — a linha do épico na seção Especificação do `sprint-<nn>.md` aberto com Situação `iniciada`.
   Senão → "a ATA só registra reunião da `[ESP]` aberta" e pare (guarda para quem chamou).
2. **Transcrição sem ATA aprovada** — em `reunioes/`, cada `.vtt` ou `.md` (fora os `.transcricao.md`, que são a
   saída) cujo nome nenhuma `elm/ATA-*.md` da pasta do épico (a da base se a linha do épico no `backlog.md` já tem o link `prd`; senão, a de trabalho) traz no `title` da
   entrada `transcricao` de `sources`. Mais de uma → a mais antiga primeiro, uma ATA por reunião. Já há ATA `draft`
   para ela → passo `aprovar`. A ATA aprovada traz o mesmo nome com outro sha256 (a transcrição foi trocada) →
   mostre e pergunte se refaz a ATA. **ATA aprovada não registrada** (retomada): `stable` sem `resource`/`id`, num
   projeto com ELM, com a sigla `ATA` no `pa` e sem `ELM pendente [ATA-<nn> EP-<nn> publicar]` → passo `publicar`;
   `stable` com os `D-nn` ainda reservados no `decisoes.md` (`em aberto — ATA-<nn> draft`) → passo `decisoes`.
3. **Converter** — `uv run --no-project python ~/.sabia/framework/skills/sa-especificar/scripts/transcricao.py
   .sabia/local/especificacao/<EP>-<slug>/reunioes/<arquivo.ext>` (da raiz do projeto): grava, ao lado,
   `<arquivo.ext>.transcricao.md` e lista no stderr os falantes sem papel e
   quantas falas ficaram sem falante (`?`: não há papel a perguntar; não as atribua a ninguém). Pergunte à pessoa o
   papel de cada falante (P.O., cliente — área, analista…; nunca deduza) e rode de novo com `--papel "Nome=papel"`
   por falante. Código 1 (nenhuma fala reconhecida) → mostre o formato aceito e pare. Código 2 → mostre a mensagem
   do script (arquivo inexistente, não UTF-8, `--papel` fora de `"Nome=papel"` ou entrada que não é `.vtt`/`.md`) e
   pare; `--papel` errado → corrija e rode de novo.

A transcrição e o `.transcricao.md` ficam só em `reunioes/`.

## Saída

O `.transcricao.md` da reunião, com o papel de cada falante → passo `escrever`. ATA `draft` já escrita → passo
`aprovar`; ATA aprovada não registrada → passo `publicar` ou `decisoes` (item 2).

## Pare se

- A `[ESP]` não está aberta (item 1) → a frase e pare.
- Nenhuma transcrição sem ATA aprovada nem ATA aprovada não registrada → "nada a registrar"; volte a quem chamou.
- O script não reconheceu nenhuma fala ou não leu o arquivo (item 3) → o formato aceito, ou a mensagem, e pare.
