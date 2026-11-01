---
{"resumo": "Leva os ADRs do PR para a pasta de ADRs do sabia.md, sem reescrever, e corrige o glossário com os termos que o código introduziu ou renomeou."}
---
## Entrada

Os ADRs do PR (`.kiro/specs/<ft>-<slug>/adr/`) e os `termo pendente` do `decisoes.md` da fatia.

## Faça

- **ADRs:** o Dev os escreveu no PR (`.kiro/specs/<ft>-<slug>/adr/`, uma por decisão "Vira ADR? sim" do
  `design.md`) e o Dev Sênior os julgou na revisão ou na `[APR]`. Leve cada um para a pasta de ADRs do `sabia.md`
  (próximo número da pasta, `origem FT-<nnn>`), sem reescrever o conteúdo; a cópia da pasta da fatia fica como
  registro do PR. Pasta de ADRs "não há" → ficam só na pasta da fatia.
- **Glossário:** termos que o código novo introduziu ou renomeou — e os `termo pendente` do `decisoes.md` da
  fatia — estão no glossário? Faltando ou divergente → corrija o glossário (com "ok") ou abra a correção do código
  como fatia.

O lint do conhecimento (contradições entre glossário, ADRs, bundle e steering) não é por fatia: é da
retrospectiva do épico ou da sprint (`sa-aprender`).

## Saída

ADRs na pasta do projeto e glossário em dia → passo `fechar`.

## Pare se

—
