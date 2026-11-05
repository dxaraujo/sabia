---
{"resumo": "Mostra o caminho de leitura (Como ler, revisão aprovada, evidências, ADRs e ET as-built) e a possível alteração indicada, executa o backpressure (C3) e deixa a decisão com a pessoa."}
---
## Entrada

A `[APR]` assumida, na branch do PR (passo `assumir`).

## Faça

Mostre o caminho de leitura: o texto do PR ("Como ler"), o `revisao-codigo-<N>.md` aprovado, as evidências do
`verificacao.md` e os ADRs e a ET as-built do PR (`adr/` e `elm/ET-*.md` da pasta da fatia — C15: a pessoa julga se cada um descreve
o que o código faz). **Execute** o backpressure (C3) — não confie no relatório. Drift de negócio do `status.md` (ou dos relatórios)
`possível alteração — …` sem ` · especificação:` → mostre-o, com os cenários `🔁 possível alteração` do
`verificacao.md`: os subagentes (ou o Dev) indicaram que o código muda (ou diverge de) um artefato. A leitura do
código é da pessoa: você aponta, ela decide.

## Saída

A decisão da pessoa (aprovado, mudanças pedidas ou volta à especificação) → passo `decidir`.

## Pare se

—
