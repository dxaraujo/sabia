---
{"resumo": "Pergunta o que a pessoa já sabe, busca no vigente, classifica cada requisito tocado em inclui, altera ou exclui, com a versão de referência, e confirma com a pessoa, inclusive 'nenhum requisito'."}
---
## Entrada

Regras e cenários dos passos anteriores; na fatia de épico, os artefatos afetados que a `sa-refinar.fatiar` gravou.

## Faça

1. **O que a pessoa já sabe**, antes de buscar: "você já sabe de algum requisito, caso de uso ou regra afetada?". Sem
   repetir o Requisito citado da Entrada; `não sei` é resposta.
2. **Vigente**, a partir da resposta, das Regras e dos Cenários: specs arquivadas, depois o bundle (`docs/elm/<pa>/`).
   Sem bundle, ofereça a `sa-elm.baixar`; bundle desatualizado, pelo critério da `sa-elm.regras`, mostre a data e pergunte se baixa.
3. **Classifique**: `inclui` — regra, mensagem, termo ou comportamento que não existe no vigente; `altera` — regra da
   ficha que muda, contradiz ou restringe o texto vigente, ou caso de uso cujo fluxo muda; `exclui` — o requisito deixa de valer.
4. **Uma linha por requisito tocado**: `<sigla>-<id> · inclui | altera | exclui · versão de referência <AAAA-MM-DDTHH:MM>`,
   com `<sigla>` ∈ `HF` · `UC` · `REG` · `MSG` · `EL` · `GL`.
   - Existente: `<sigla>-<id do ELM>`; a versão é o `modificado_em` do DOORS no bundle.
   - Novo: id provisório `<sigla>-<EPnn | FTnnn>-nn` (o do PRD na fatia de épico; o da própria fatia no item
     avulso, ex.: `REG-FT031-01`), com versão `—`.
   - Sem ELM: o `<sigla>-<EP | FT>-nn` é o id definitivo e a versão é `—`.
5. Sem requisito tocado: a linha `nenhum requisito`.
6. **Confirme**: mostre os requisitos consultados, o motivo de cada linha e a conclusão, e peça a confirmação, inclusive de
   `nenhum requisito`.

## Saída

A seção Artefatos afetados → passo `elm`.

## Pare se

Nenhuma condição própria: sem bundle, os artefatos afetados seguem com o que a pessoa confirma.
