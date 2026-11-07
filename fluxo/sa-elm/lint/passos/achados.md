---
{"resumo": "Cada achado: corrigir na fonte do repositório com sim, ou registrar pela captura."}
---
## Entrada

Os achados.

## Faça

Para cada achado, dois caminhos, à escolha da pessoa:

- **Corrigir na fonte do repositório** (`glossario.md`, Regras aprendidas), com "sim": a correção vai no commit
  do passo `gravar`. ADR é código: registre como fatia.
- **Registrar** pelo passo `captura`, com o tipo que a pessoa disser (padrão: `fatia`) e a obs `origem lint`.

O DOORS nunca muda aqui.

## Saída

A registrar → passo `captura`. Só correções → passo `gravar`.

## Pare se

- Nunca decida qual fonte está certa: a decisão é da pessoa.
