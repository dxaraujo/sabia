---
{"resumo": "Leva os ADRs do PR para a pasta de ADRs do sabia.md, sem reescrever, e corrige o glossário com os termos que o código introduziu ou renomeou."}
---
## Entrada

Os ADRs do PR (`.kiro/specs/ft-<nnn>-<slug>/adr/`) e os nomes novos do diff do merge (`git diff <sha do merge>^1
<sha do merge>`: classes, campos, tabelas e mensagens).

## Faça

- **ADRs:** o Dev os escreveu no PR (`.kiro/specs/ft-<nnn>-<slug>/adr/`, uma por decisão "Vira ADR? sim" do
  `design.md`) e o Dev Sênior os julgou na revisão ou na `[APR]`. Leve cada um para a pasta de ADRs do `sabia.md`
  (nome = o padrão dos arquivos que já estão nela, com o próximo número; pasta vazia → `0001-<slug-da-decisão>.md`, 4
  dígitos, em sequência; `origem FT-<nnn>`), sem reescrever o conteúdo; a cópia da pasta da fatia fica como
  registro do PR. Pasta de ADRs "não há" → ficam só na pasta da fatia.
- **Glossário:** termos que o código novo introduziu ou renomeou estão no glossário? Faltando → proponha a linha no
  padrão `sa-entrevistar/glossario.md` e grave com "ok".
  O código usa um termo diferente do glossário → pergunte à pessoa: corrigir o glossário (com "ok") ou o código (diga
  "registre a correção pela `sa-triar`, origem FT-<nnn>" e siga).

O lint do conhecimento (contradições entre glossário, ADRs, bundle e steering) não é por fatia: é da
retrospectiva do épico ou da sprint (`sa-aprender`).

## Saída

ADRs na pasta do projeto e glossário em dia → passo `fechar`.

## Pare se

—
