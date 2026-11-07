---
{"resumo": "Tira a linha Aprovado do prd.md e acrescenta em Mudanças a versão nova com data, o que mudou e a origem."}
---
## Entrada

O `prd.md` aprovado e o pedido de mudança, com a origem.

## Faça

1. **Aprovação.** `**Aprovado:** —` no topo.
2. **Mudanças.** Linha nova `v<N> | <AAAA-MM-DD> | <o que mudou> | <origem>`, com `v<N>` = a maior + 1 e a origem ∈
   pedido · `ATA-nn` · `protótipo v<N>` · `FT-nnn`.
3. **Gravar.** Pela gravação comum na base (passo `gravar`, commit `EP-nn PRD v<N> em mudança`), e volte aqui.

## Saída

O PRD sem aprovação e com a versão nova → passo `editar`.

## Pare se

Nenhum caso próprio deste passo.
