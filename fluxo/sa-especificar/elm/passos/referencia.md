---
{"resumo": "Commit de referência só com os originais baixados, antes de qualquer edição: a diferença e a versão de referência se conferem contra ele."}
---
## Entrada

Os arquivos de altera e exclui que o passo `baixar` gravou agora.

## Faça

Grave só esses arquivos e a versão de referência nos artefatos afetados da ficha, sem nenhuma edição, pelo commit direto na branch base (passo
`gravar`, commit `FT-nnn elm: original <ids>`), e volte aqui. O arquivo novo (inclui) não tem commit de referência. Daqui em
diante, `git diff <commit de referência> -- <arquivo>` mostra a edição, e a versão de referência dos artefatos afetados é a que o passo `conferir`
compara.

## Saída

O commit de referência na branch base → passo `editar`.

## Pare se

- A gravação na branch base parou → os originais ficam sem commit; a próxima sessão retoma do passo `baixar`.
