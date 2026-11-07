---
{"resumo": "Leitura livre do ELM por qualquer skill; escrever e baixar só pela sa-elm."}
---
## Entrada

O fluxo que incluiu as regras.

## Faça

- Qualquer skill lê o ELM para buscar o vigente: `elm_ler_req`, `elm_buscar_req`, `elm_ler_wi` e o bundle pelas
  tools `elm_*_local`, nunca lendo os arquivos do bundle. Ordem da busca do vigente: specs arquivadas → bundle →
  ELM ao vivo.
- Bundle desatualizado = `sincronizado_em` do `sync.md` anterior à última `Publicação: publicada` nos `status.md`:
  mostre a data e pergunte se baixa (`sa-elm.baixar`).
- Escrever no ELM e baixar dele (bundle ou original de um requisito) só pela `sa-elm`.

## Saída

Segue para o passo `identidade`.

## Pare se

- Nunca.
