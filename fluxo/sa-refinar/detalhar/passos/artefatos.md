---
{"resumo": "Busca no vigente os requisitos que as regras tocam, classifica em inclui, altera ou exclui, mostra o que achou e pergunta se há outro artefato afetado; a resposta vira Decisão, com quem respondeu."}
---
## Entrada

Regras e cenários dos passos anteriores, o Requisito citado da Entrada e, na fatia de épico, os artefatos afetados que a
`sa-refinar.fatiar` gravou.

## Faça

1. **Busque antes de perguntar**, a partir das Regras, dos Cenários e do Requisito citado: specs arquivadas, depois o bundle
   (`docs/elm/<pa>/`), pelas tools `elm_*_local`. Bundle desatualizado, pelo critério da `sa-elm.regras`: mostre a data e
   pergunte se baixa.
2. **Sem bundle, ou a busca local não bastou:** pergunte "busco no ELM? é mais demorado". Sem o aceite, não busque; siga com o
   que achou e registre que o ELM não foi consultado.
3. **Classifique**: `inclui` — regra, mensagem, termo ou comportamento que não existe no vigente; `altera` — regra da
   ficha que muda, contradiz ou restringe o texto vigente, ou caso de uso cujo fluxo muda; `exclui` — o requisito deixa de valer.
4. **Uma linha por requisito tocado**: `<sigla>-<id> · inclui | altera | exclui · versão de referência <AAAA-MM-DDTHH:MM>`,
   com `<sigla>` ∈ `HF` · `UC` · `REG` · `MSG` · `EL` · `GL` · `RF` · `RNF`.
   - Existente: `<sigla>-<id do ELM>`; a versão é o `modificado_em` do DOORS no bundle.
   - Novo: id provisório `<sigla>-<EPnn | FTnnn>-nn` (o do PRD na fatia de épico; o da própria fatia no item
     avulso, ex.: `REG-FT031-01`), com versão `—`.
   - Sem ELM: o `<sigla>-<EP | FT>-nn` é o id definitivo e a versão é `—`.
5. **Mostre e pergunte uma vez só.** Diga os termos pesquisados e:
   - **Achou:** a tabela Requisito · Por que apareceu · Proposta, e pergunte "Existe outro artefato que possa ser afetado por
     essa regra e não está nesta lista?".
   - **Não achou:** "Realizei a pesquisa por estes termos e não encontrei nenhum artefato que referencie essa regra. Você
     conhece artefato que possa ser afetado por esta regra?".
   - Sim → a pessoa informa quais; classifique e grave cada um pelos itens 3 e 4. Não, e sem nenhuma linha → `nenhum requisito`.
6. **Quem responde:** quem tem `especificador`, na fatia e no bug que toca requisito; no bug sem requisito tocado, quem conduz.
7. **Registre em Decisões**, com quem respondeu: `Artefatos afetados conferidos: <ids | nenhum>; termos: <termos>`, e diga se o
   ELM não foi consultado.

## Saída

A seção Artefatos afetados e a Decisão → passo `elm`.

## Pare se

- Sem a resposta → não grave `nenhum requisito`.
- Sem quem responde na sessão → grave o que a busca achou, mande a pergunta ao Em aberto, para os nomes com `especificador`, com
  `Bloqueia: esta fatia`, e siga: o item fica `aceita`.
