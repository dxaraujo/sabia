---
{"resumo": "Lista os requisitos tocados, um por linha, com inclui, altera ou exclui e a versão de referência do bundle; sem requisito, 'nenhum requisito'."}
---
## Entrada

Regras e cenários dos passos anteriores; na fatia de épico, os artefatos afetados que a `sa-refinar.fatiar` gravou.

## Faça

1. **Vigente**: specs arquivadas, depois o bundle (`docs/elm/<pa>/`). Sem bundle, ofereça a `sa-elm.baixar`. Bundle
   desatualizado (`sincronizado_em` anterior à última `Publicação: publicada`): mostre a data e pergunte se baixa.
2. **Uma linha por requisito tocado**: `<sigla>-<id> · inclui | altera | exclui · versão de referência <AAAA-MM-DDTHH:MM>`,
   com `<sigla>` ∈ `HF` · `REG` · `EL` · `GL`.
   - Existente: `<sigla>-<id do ELM>`; a versão é o `modificado_em` do DOORS no bundle.
   - Novo: id provisório `<sigla>-<EPnn | FTnnn>-nn` (o do PRD na fatia de épico; o da própria fatia no item
     avulso, ex.: `REG-FT031-01`), com versão `—`.
   - Sem ELM: o `<sigla>-<EP | FT>-nn` é o id definitivo e a versão é `—`.
3. Sem requisito tocado: a linha `nenhum requisito`.

## Saída

A seção Artefatos afetados → passo `elm`.

## Pare se

Nenhuma condição própria: sem bundle, os artefatos afetados seguem com o que a pessoa confirma.
